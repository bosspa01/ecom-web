import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import ReceiptModal from "./ReceiptModal";
import { numberFormat } from "../../utils/number";

const HistoryCard = () => {
  const token = useEcomStore((state) => state.token);
  const orders = useEcomStore((state) => state.orders);
  const fetchOrders = useEcomStore((state) => state.fetchOrders);
  const setNewOrderNotification = useEcomStore((state) => state.setNewOrderNotification);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleViewReceipt = (order) => {
    setSelectedOrder(order);
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    if (token) {
      fetchOrders(token);
    }
    // Clear notification when viewing history
    setNewOrderNotification(false);
  }, [token, fetchOrders, setNewOrderNotification]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6 print:hidden">Order History</h1>
      
      {/* Receipt Modal */}
      {showReceipt && selectedOrder && (
        <ReceiptModal order={selectedOrder} onClose={handleCloseReceipt} />
      )}
      
      <div className="space-y-4 print:hidden">
        {orders && orders.length > 0 ? (
          orders.map((item, index) => {
            const orderDate = new Date(item.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            return (
              <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-700">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Order Date</p>
                    <p className="font-bold text-white">{orderDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-semibold">
                      {item.orderStatus || "Completed"}
                    </div>
                    <button
                      onClick={() => handleViewReceipt(item)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                      title="ดูใบเสร็จ"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      ดูใบเสร็จ
                    </button>
                  </div>
                </div>

                {/* Shipping Address Display */}
                {item.orderedBy?.address && (
                  <div className="mb-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">ที่อยู่จัดส่ง</h3>
                    <div className="text-white space-y-1">
                      <p><span className="text-gray-400">ผู้รับ:</span> {item.orderedBy.address.recipientName}</p>
                      <p><span className="text-gray-400">เบอร์โทร:</span> {item.orderedBy.address.phone}</p>
                      <p className="text-gray-300">
                        {item.orderedBy.address.houseNumber}
                        {item.orderedBy.address.street ? ` ถ.${item.orderedBy.address.street}` : ''}
                        {' '}อ.{item.orderedBy.address.district}
                        {' '}จ.{item.orderedBy.address.province}
                        {' '}{item.orderedBy.address.postalCode}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-700 text-left">
                          <th className="px-4 py-3 text-white font-semibold">Product</th>
                          <th className="px-4 py-3 text-white font-semibold">Price</th>
                          <th className="px-4 py-3 text-white font-semibold">Quantity</th>
                          <th className="px-4 py-3 text-white font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.products?.map((product, idx) => {
                          return (
                            <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                              <td className="px-4 py-3 text-white">{product.product.title}</td>
                              <td className="px-4 py-3 text-gray-300">{numberFormat(product.product.price)}&nbsp;฿</td>
                              <td className="px-4 py-3 text-gray-300">{numberFormat(product.count)}</td>
                              <td className="px-4 py-3 text-green-400 font-semibold">
                                {numberFormat(product.count * product.product.price)}&nbsp;฿
                              </td>
                            </tr>
                          );
                        })}
                        {/* Coupon row if coupon was used */}
                        {item.coupon && (() => {
                          const amountPaid = (item.amount || 0) / 100;
                          const originalTotal = item.cartTotal || 0;
                          const discountAmount = originalTotal - amountPaid;
                          
                          if (discountAmount > 0) {
                            return (
                              <tr className="border-b-2 border-green-500/50 bg-green-500/10">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-green-400 font-semibold">
                                      Coupon Applied:
                                    </span>
                                    <span className="text-green-300 font-bold bg-green-500/20 px-3 py-1 rounded border border-green-500/50">
                                      {item.coupon.couponCode}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      ({item.coupon.discountType === "percentage" 
                                        ? `${item.coupon.discountValue}% off`
                                        : `$${item.coupon.discountValue} off`})
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-400 italic">-</td>
                                <td className="px-4 py-3 text-gray-400 italic">-</td>
                                <td className="px-4 py-3">
                                  <div className="flex flex-col items-end">
                                    <span className="text-red-400 font-semibold line-through text-sm">
                                      {numberFormat(originalTotal)}&nbsp;฿
                                    </span>
                                    <span className="text-green-400 font-bold text-lg">
                                      {numberFormat(amountPaid)}&nbsp;฿
                                    </span>
                                    <span className="text-xs text-green-400 mt-1">
                                      Saved: {numberFormat(discountAmount)}&nbsp;฿
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                          return null;
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700 space-y-2">
                  {/* Calculate amounts */}
                  {(() => {
                    const amountPaid = (item.amount || 0) / 100;
                    const originalTotal = item.cartTotal || 0;
                    const shippingCost = item.shippingCost || 0;
                    const discountAmount = originalTotal - (amountPaid - shippingCost);
                    const hasDiscount = item.coupon && discountAmount > 0;

                    // Define shipping options map for display names
                    const shippingOptionsMap = {
                      bangkok_standard: 'กรุงเทพและปริมณฑล - ธรรมดา',
                      bangkok_express: 'กรุงเทพและปริมณฑล - แบบเร็ว',
                      province_standard: 'ต่างจังหวัด - ธรรมดา',
                      province_express: 'ต่างจังหวัด - แบบเร็ว'
                    };

                    return (
                      <>
                        {/* Subtotal (cart total before shipping and discount) */}
                        <div className="flex justify-between items-center text-sm">
                          <p className="text-gray-400">Subtotal:</p>
                          <p className="text-gray-300">{numberFormat(originalTotal)}&nbsp;฿</p>
                        </div>
                        
                        {/* Shipping cost */}
                        {shippingCost > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <p className="text-gray-400">Shipping:</p>
                              <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                                {shippingOptionsMap[item.shippingMethod] || item.shippingMethod || 'N/A'}
                              </span>
                            </div>
                            <p className="text-blue-400">{numberFormat(shippingCost)}&nbsp;฿</p>
                          </div>
                        )}
                        
                        {/* Show coupon discount if coupon was used */}
                        {hasDiscount && (
                          <div className="flex justify-between items-center text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/30">
                            <div className="flex items-center gap-2">
                              <p className="text-gray-300 font-medium">Coupon Applied:</p>
                              <span className="text-xs text-green-300 bg-green-500/30 px-3 py-1 rounded-full border border-green-500/50 font-semibold">
                                {item.coupon.couponCode}
                              </span>
                              <span className="text-xs text-green-400">
                                ({item.coupon.discountType === "percentage" 
                                  ? `${item.coupon.discountValue}% off`
                                  : `฿${item.coupon.discountValue} off`})
                              </span>
                            </div>
                            <p className="text-green-400 font-semibold">
                              -&nbsp;{numberFormat(discountAmount)}&nbsp;฿
                            </p>
                          </div>
                        )}
                        
                        {/* Show final amount paid */}
                        <div className={`flex justify-between items-center ${hasDiscount || shippingCost > 0 ? 'pt-2 border-t border-gray-700' : ''}`}>
                          <p className="text-gray-300 font-semibold">Amount Paid:</p>
                          <p className="text-2xl font-bold text-green-400">
                            {numberFormat(amountPaid)}&nbsp;฿
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700 rounded-lg">
            <p className="text-gray-400 text-lg mb-4">No order history found</p>
            <p className="text-gray-500">Start shopping to see your orders here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryCard;
