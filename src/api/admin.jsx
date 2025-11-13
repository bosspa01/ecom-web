import axios from "axios";

export const getOrdersAdmin = async (token) => {
  return axios.get("https://ecom-api-seven-gamma.vercel.app/api/admin/orders",{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

  export const changeOrderStatus = async (token, orderId, orderStatus) => {
    return axios.put(
      "https://ecom-api-seven-gamma.vercel.app/api/admin/order-status",
      { orderId, orderStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

export const getTodaySold = async (token) => {
  return axios.get("https://ecom-api-seven-gamma.vercel.app/api/admin/today-sold", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAdminLogs = async (token, params = {}) => {
  // Build query string without empty values to avoid action=undefined
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      sp.append(key, String(val));
    }
  });
  // Always request meta for richer client rendering
  if (!sp.has('includeMeta')) sp.append('includeMeta', 'true');
  const query = sp.toString();
  return axios.get(`https://ecom-api-seven-gamma.vercel.app/api/admin/logs${query ? '?' + query : ''}` , {
    headers: { Authorization: `Bearer ${token}` },
  });
};
