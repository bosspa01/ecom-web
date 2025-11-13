import axios from "axios";

export const getCartServer = (token) => {
  return axios.get("https://ecom-api-seven-gamma.vercel.app/api/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const syncCartServer = (token, items) => {
  return axios.post(
    "https://ecom-api-seven-gamma.vercel.app/api/cart/sync",
    { items },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
