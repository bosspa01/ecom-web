import axios from "axios";

export const payment = async (token, couponId = null, shippingMethod = "bangkok_standard") => {
  const payload = { shippingMethod };
  if (couponId) {
    payload.couponId = couponId;
  }
  
  return await axios.post(
    "https://ecom-api-seven-gamma.vercel.app/api/user/create-payment-intent",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};