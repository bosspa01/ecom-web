import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { payment } from "../../api/Stripe";
import useEcomStore from "../../store/ecom-store";
import CheckoutForm from "../../components/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51SUAMZJT4IB2IMfklqoIZgMhoUuAcJnR2ltFMNPWgsLX1iEKAc6fKmu8QA1DHwYKC3Bsw5SCrZkEoi0zpT8ibBjR00qzTRAsfa"
);

const Playment = () => {
  const token = useEcomStore((state) => state.token);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Get couponId and shippingMethod from sessionStorage
    const couponId = sessionStorage.getItem("appliedCouponId");
    const couponIdNum = couponId ? parseInt(couponId, 10) : null;
    const shippingMethod = sessionStorage.getItem("shippingMethod") || "bangkok_standard";

    payment(token, couponIdNum, shippingMethod)
      .then((res) => {
        console.log(res);
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const appearance = {
    theme: "stripe",
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Payment</h1>
        <div className="bg-white p-6 rounded-lg border border-gray-700 shadow-md">
          {clientSecret ? (
            <Elements options={{ clientSecret, appearance, loader }}
              stripe={stripePromise} >
              <CheckoutForm />
            </Elements>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading payment form...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default Playment;
