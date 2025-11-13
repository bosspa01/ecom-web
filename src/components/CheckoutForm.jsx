import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "../stripe.css";
import { saveOrder } from "../api/User";
import useEcomStore from "../store/ecom-store";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CheckoutForm() {
  const token = useEcomStore((state) => state.token);
  const clearCart = useEcomStore((state) => state.clearCart);
  const fetchOrders = useEcomStore((state) => state.fetchOrders);
  const setNewOrderNotification = useEcomStore((state) => state.setNewOrderNotification);

  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const payload = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    console.log("payload", payload);
    if (payload.error) {
      setMessage(payload.error.message);
      console.log("error");
    //   toast.error(payload.error.message);
    } else if (payload.paymentIntent.status === "succeeded") {
      console.log("Ready or Saveorder");
      // Get couponId and shippingMethod from sessionStorage
      const couponId = sessionStorage.getItem("appliedCouponId");
      const shippingMethod = sessionStorage.getItem("shippingMethod");
      const orderPayload = {
        ...payload,
        couponId: couponId ? parseInt(couponId, 10) : null,
        shippingMethod: shippingMethod || "bangkok_standard",
      };
      
      // Create Order
      saveOrder(token, orderPayload)
        .then((res) => {
          console.log(res);
          clearCart();
          // Clear coupon and shipping from sessionStorage
          sessionStorage.removeItem("appliedCouponId");
          sessionStorage.removeItem("shippingMethod");
          // Refresh order history
          fetchOrders(token);
          // Show notification badge on history icon
          setNewOrderNotification(true);
          // toast.success("Payment Success!!!");
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Something wrong!!!");
      // toast.warning("ชำระเงินไม่สำเร็จ");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <div>
      <form className="space-y-6" id="payment-form" onSubmit={handleSubmit}>
        <div className="mb-6">
          <PaymentElement id="payment-element" options={paymentElementOptions} />
        </div>
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Pay Now"
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && (
          <div 
            id="payment-message" 
            className={`mt-4 p-4 rounded-lg ${
              message.includes("success") || message.includes("Success")
                ? "bg-green-500/20 text-green-400 border border-green-500"
                : "bg-red-500/20 text-red-400 border border-red-500"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}