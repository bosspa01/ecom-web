import axios from "axios";

export const createUserCart = async (token, cart) => {
  return axios.post("https://ecom-api-seven-gamma.vercel.app/api/user/cart", cart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const listUserCart = async (token) => {
  return axios.get("https://ecom-api-seven-gamma.vercel.app/api/user/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const saveAddress = async (token, address) => {
  return axios.post(
    "https://ecom-api-seven-gamma.vercel.app/api/user/address",
    address, // Send address directly without wrapping
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const saveOrder = async (token, payload) => {
  return axios.post("https://ecom-api-seven-gamma.vercel.app/api/user/order", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getOrders = async (token) => {
  return axios.get("https://ecom-api-seven-gamma.vercel.app/api/user/order", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Admin utilities
export const listUsersAdmin = async (token) => {
  return axios.get("https://ecom-api-seven-gamma.vercel.app/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeUserRole = async (token, id, role) => {
  return axios.post(
    "https://ecom-api-seven-gamma.vercel.app/api/change-role",
    { id, role },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const changeUserStatus = async (token, id, enabled) => {
  return axios.post(
    "https://ecom-api-seven-gamma.vercel.app/api/change-status",
    { id, enabled },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Coupon functions
export const validateCoupon = async (token, couponCode, cartTotal) => {
  return axios.post(
    "https://ecom-api-seven-gamma.vercel.app/api/user/validate-coupon",
    { couponCode, cartTotal },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Admin coupon functions
export const createCoupon = async (token, couponData) => {
  return axios.post(
    "https://ecom-api-seven-gamma.vercel.app/api/admin/coupon",
    couponData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getAllCoupons = async (token) => {
  return axios.get("https://ecom-api-seven-gamma.vercel.app/api/admin/coupons", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCoupon = async (token, id, couponData) => {
  return axios.put(
    `https://ecom-api-seven-gamma.vercel.app/api/admin/coupon/${id}`,
    couponData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteCoupon = async (token, id) => {
  return axios.delete(`https://ecom-api-seven-gamma.vercel.app/api/admin/coupon/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};