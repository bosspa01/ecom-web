import React, { useState, useEffect } from "react";
import { listUserCart, saveAddress, validateCoupon } from "../../api/User";
import useEcomStore from "../../store/ecom-store";
import useTranslation from "../../hooks/useTranslation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ShippingSelector from "./ShippingSelector";
import AddressForm from "./AddressForm";
import { numberFormat } from "../../utils/number";

const SHIPPING_COSTS = {
  bangkok_standard: 35,
  bangkok_express: 50,
  province_standard: 50,
  province_express: 75
};

const SummaryCard = () => {

    const t = useTranslation();
    const token = useEcomStore((state) => state.token);
    const [products, setProducts] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const [addressData, setAddressData] = useState(null);
    const [addressSaved, setAddressSaved] = useState(false);

    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

    const [selectedShipping, setSelectedShipping] = useState('bangkok_standard');
    const [shippingCost, setShippingCost] = useState(35);

    const navigate = useNavigate();

    useEffect(() => {
        hdlGetUserCart(token);
    }, []);

    useEffect(() => {
        // Update shipping cost when selection changes
        setShippingCost(SHIPPING_COSTS[selectedShipping]);
    }, [selectedShipping]);

    useEffect(() => {
        let total = cartTotal + shippingCost;
        
        if (appliedCoupon) {
            // Calculate discount based on cart total (before shipping)
            let discount = 0;
            if (appliedCoupon.discountType === "percentage") {
                discount = (cartTotal * appliedCoupon.discountValue) / 100;
            } else if (appliedCoupon.discountType === "fixed_amount") {
                discount = appliedCoupon.discountValue;
            }
            
            // Ensure discount doesn't exceed cart total
            if (discount > cartTotal) {
                discount = cartTotal;
            }
            
            setDiscountAmount(discount);
            total = Math.max(0, cartTotal - discount + shippingCost);
        } else {
            setDiscountAmount(0);
        }
        
        setFinalTotal(total);
    }, [cartTotal, appliedCoupon, shippingCost]);

    const hdlGetUserCart = (token) => {
        listUserCart(token)
        .then((res)=>{
            setProducts(res.data.products);
            setCartTotal(res.data.cartTotal);
        })
        .catch((error) => {console.log(error)});
    }

    const hdlValidateCoupon = async () => {
        if (!couponCode.trim()) {
            return toast.warning(t.please_enter_coupon);
        }

        setIsValidatingCoupon(true);
        try {
            const res = await validateCoupon(token, couponCode, cartTotal);
            if (res.data.ok) {
                setAppliedCoupon(res.data.coupon);
                toast.success(t.coupon_applied);
            }
        } catch (error) {
            const message = error.response?.data?.message || t.invalid_coupon;
            toast.error(message);
            setAppliedCoupon(null);
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const hdlRemoveCoupon = () => {
        setCouponCode("");
        setAppliedCoupon(null);
        toast.info(t.coupon_removed);
    };

    const hdlSaveAddress = (formData) => {
        saveAddress(token, formData)
        .then((res)=>{
            console.log(res)
            toast.success(res.data.message);
            setAddressData(formData);
            setAddressSaved(true);
        })
        .catch((error) => {
            console.log(error);
            toast.error("Failed to save address");
        });
    }

    const hdlGoToPayment = () => {
        if(!addressSaved){
            return toast.warning(t.please_fill_address);
        }
        // Store coupon info and shipping method in sessionStorage
        if (appliedCoupon) {
            sessionStorage.setItem("appliedCouponId", appliedCoupon.id.toString());
        } else {
            sessionStorage.removeItem("appliedCouponId");
        }
        sessionStorage.setItem("shippingMethod", selectedShipping);
        navigate("/user/payment");
    }

  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">{t.checkout}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Address & Shipping Method */}
        <div className="space-y-6">
          {/* Shipping Address Form */}
          <AddressForm 
            onSave={hdlSaveAddress}
            savedAddress={addressData}
          />

          {/* Shipping Method Selector */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md">
            <ShippingSelector
              selectedShipping={selectedShipping}
              onShippingChange={setSelectedShipping}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md space-y-4">
            <h1 className="text-xl font-bold text-white mb-4">{t.your_order}</h1>

            {/* Item list */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {products && products.length > 0 ? (
                products.map((item,index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-bold text-white">{item.product.title}</p>
                        <p className="text-sm text-gray-400">{t.quantity}: {numberFormat(item.count)} x {numberFormat(item.product.price)}&nbsp;฿</p>
                      </div>
                      <div>
                        <p className="text-green-400 font-bold">{numberFormat(item.price * item.count)}&nbsp;฿</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">{t.no_items_in_cart}</p>
              )}
            </div>

            {/* Coupon Code Section */}
            <div className="pt-4 border-t border-gray-700 space-y-3">
              <h2 className="font-bold text-white text-sm">{t.have_coupon}</h2>
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder={t.enter_coupon_code}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === "Enter" && hdlValidateCoupon()}
                  />
                  <button
                    type="button"
                    onClick={hdlValidateCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {isValidatingCoupon ? "..." : t.apply}
                  </button>
                </div>
              ) : (
                <div className="bg-green-500/20 border border-green-500 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-400 font-semibold">{appliedCoupon.couponCode}</p>
                      <p className="text-sm text-gray-400">
                        {appliedCoupon.discountType === "percentage" 
                          ? `${appliedCoupon.discountValue}% ${t.off}`
                          : `$${appliedCoupon.discountValue} ${t.off}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={hdlRemoveCoupon}
                      className="text-red-400 hover:text-red-300 text-sm font-semibold"
                    >
                      {t.remove}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-700 space-y-2">
              <div className="flex justify-between text-gray-300">
                <p>{t.subtotal}:</p>
                <p>{numberFormat(cartTotal)}&nbsp;฿</p>
              </div>
              <div className="flex justify-between text-gray-300">
                <p>{t.shipping}:</p>
                <p className="text-blue-400">{numberFormat(shippingCost)}&nbsp;฿</p>
              </div>
              <div className="flex justify-between text-gray-300">
                <p>{t.discount}:</p>
                <p className={discountAmount > 0 ? "text-green-400" : ""}>
                  -&nbsp;{numberFormat(discountAmount)}&nbsp;฿
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <p className="font-bold text-white text-lg">{t.total}:</p>
                <p className="text-green-400 font-bold text-2xl">
                  {numberFormat(finalTotal)}&nbsp;฿
                </p>
              </div>
            </div>
            <div className="pt-4">
              <button 
                onClick={hdlGoToPayment}
                disabled={!addressSaved}
                className="bg-green-500 w-full p-3 rounded-lg shadow-md text-white hover:bg-green-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {t.proceed_to_payment}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
