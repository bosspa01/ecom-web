import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listCategory } from "../api/Category";
import { listProduct, searchFilters } from "../api/product";
import { getOrders } from "../api/User";
import { getCartServer, syncCartServer } from "../api/cart";
import _ from "lodash";
import { act } from "react";

// Helpers for per-user cart persistence
const CART_KEY_PREFIX = "ecom-cart:";
const getCartKeyForUser = (user) => `${CART_KEY_PREFIX}${user?.id || "guest"}`;
const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};
const loadCartFromStorage = (key) => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  const data = safeParse(raw);
  return Array.isArray(data) ? data : [];
};
const saveCartToStorage = (key, carts) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(carts || []));
  } catch (e) {
    // noop on quota or storage errors
  }
};

const ecomStore = (set, get) => ({
  user: null,
  token: null,
  categories: [],
  products: [],
  carts: [],
  orders: [],
  hasNewOrder: false,
  language: typeof window !== 'undefined' ? localStorage.getItem('language') || 'th' : 'th',
  actionAddtoCart: (product) => {
    const carts = get().carts;
    const updateCart = [...carts, { ...product, count: 1 }];
    // Deduplicate by product id
    const unique = _.unionBy(updateCart, 'id');
    set({ carts: unique });
    // Sync to per-identity storage
    const user = get().user;
    const key = getCartKeyForUser(user);
    saveCartToStorage(key, unique);
    // If logged in, sync to server (fire and forget)
    if (user) {
      syncCartServer(get().token, unique.map(i => ({ id: i.id, count: i.count }))).catch(()=>{});
    }
  },
  actionUpdateQuantity: (productId, newQuantity) => {
    // console.log("update quantityyyy",productId, newQuantity);
    set((state) => ({
      carts: state.carts.map((item) =>
        item.id === productId
          ? { ...item, count: Math.max(1, newQuantity) }
          : item
      ),
    }));
    const user = get().user;
    const key = getCartKeyForUser(user);
    saveCartToStorage(key, get().carts);
    if (user) {
      syncCartServer(get().token, get().carts.map(i => ({ id: i.id, count: i.count }))).catch(()=>{});
    }
  },
  actionRemoveProduct: (productId) => {
    // console.log("remove product",productId);
    set((state) => ({
      carts: state.carts.filter((item) => item.id !== productId),
    }));
    const user = get().user;
    const key = getCartKeyForUser(user);
    saveCartToStorage(key, get().carts);
    if (user) {
      syncCartServer(get().token, get().carts.map(i => ({ id: i.id, count: i.count }))).catch(()=>{});
    }
  },
  getTotalPrice: () => {
    return get().carts.reduce((total, item) => {
      return total + item.price * item.count;
    }, 0);
  },
  actionLogin: async (form) => {
    const res = await axios.post("https://ecom-api-seven-gamma.vercel.app/api/login", form);
    const payload = res.data.payload;
    const userKey = getCartKeyForUser(payload);
    const guestKey = getCartKeyForUser(null);

    // Load server cart
    let serverCart = [];
    try {
      const scRes = await getCartServer(res.data.token);
      if (scRes.data?.ok) {
        serverCart = scRes.data.items.map(it => ({
          id: it.id,
          count: it.count,
          price: it.price,
          title: it.title,
          images: it.images || [],
          categoryId: it.categoryId,
        }));
      }
    } catch {}

    // Determine guest cart (in-memory preferred, else LS)
    const guestCartLS = loadCartFromStorage(guestKey);
    const guestCartMem = get().carts || [];
    const guestCart = (guestCartMem && guestCartMem.length ? guestCartMem : guestCartLS) || [];

    // Merge counts by product id (server + guest)
    const countMap = new Map();
    for (const it of serverCart) {
      countMap.set(it.id, (countMap.get(it.id) || 0) + (it.count || 1));
    }
    for (const it of guestCart) {
      if (!it || typeof it.id === 'undefined') continue;
      countMap.set(it.id, (countMap.get(it.id) || 0) + (parseInt(it.count || 1, 10)));
    }
    const mergedCounts = Array.from(countMap.entries()).map(([id, count]) => ({ id, count }));

    // Sync merged to server and fetch authoritative items
    let finalCart = [];
    try {
      await syncCartServer(res.data.token, mergedCounts);
      const finalRes = await getCartServer(res.data.token);
      if (finalRes.data?.ok) {
        finalCart = finalRes.data.items.map(it => ({
          id: it.id,
          count: it.count,
          price: it.price,
          title: it.title,
          images: it.images || [],
          categoryId: it.categoryId,
        }));
      }
    } catch {
      // fallback to local per-user storage
      finalCart = loadCartFromStorage(userKey);
    }

    // Update state and storage; clear guest stash
    set({ user: payload, token: res.data.token, carts: finalCart });
    saveCartToStorage(userKey, finalCart);
    saveCartToStorage(guestKey, []);
    return res;
  },
  getCategory: async () => {
    try {
      const res = await listCategory();
      set({ categories: res.data });
    } catch (error) {
      console.log(error);
    }
  },
  getProduct: async (count) => {
    try {
      const res = await listProduct(count);
      set({ products: res.data });
    } catch (error) {
      console.log(error);
    }
  },
  actionSearchFilters: async (arg) => {
    try {
      const res = await searchFilters(arg);
      set({ products: res.data });
    } catch (error) {
      console.log(error);
    }
  },
  actionLogout: () => {
    const user = get().user;
    const currentCarts = get().carts || [];
    if (user) {
      const userKey = getCartKeyForUser(user);
      saveCartToStorage(userKey, currentCarts);
    }
    // Load guest cart (isolation) after logout
    const guestKey = getCartKeyForUser(null);
    const guestCart = loadCartFromStorage(guestKey);
    set({ user: null, token: null, carts: guestCart, orders: [], hasNewOrder: false });
  },
  clearCart: () => {
    set({ carts: [] });
    const user = get().user;
    const key = getCartKeyForUser(user);
    saveCartToStorage(key, []);
  },
  fetchOrders: async (token) => {
    try {
      const res = await getOrders(token);
      if (res.data && res.data.ok && res.data.orders) {
        set({ orders: res.data.orders });
      } else {
        set({ orders: [] });
      }
    } catch (error) {
      console.log(error);
      // If no orders found or error, set empty array
      set({ orders: [] });
    }
  },
  setNewOrderNotification: (value) => {
    set({ hasNewOrder: value });
  },
  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },
});

const usePersist = {
  name: "ecom-store",
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    user: state.user,
    token: state.token,
    categories: state.categories,
    products: state.products,
    carts: state.carts,
    orders: state.orders,
    hasNewOrder: state.hasNewOrder,
  }),
};

const useEcomStore = create(persist(ecomStore, usePersist));

export default useEcomStore;
