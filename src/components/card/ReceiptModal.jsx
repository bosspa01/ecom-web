import React from 'react';
import useEcomStore from '../../store/ecom-store';
import { receiptTranslations } from '../../translations/receipts';
import { numberFormat } from '../../utils/number';

const ReceiptModal = ({ order, onClose }) => {
  const language = useEcomStore((state) => state.language);
  const t = receiptTranslations[language] || receiptTranslations.th;

  const handlePrint = () => {
    const backdrop = document.querySelector('.modal-backdrop');
    const printOnly = document.querySelector('.print-only');
    
    if (backdrop && printOnly) {
      backdrop.style.display = 'none';
      printOnly.classList.remove('hidden');
      
      setTimeout(() => {
        window.print();
        backdrop.style.display = '';
        printOnly.classList.add('hidden');
      }, 100);
    }
  };

  if (!order) return null;

  const renderReceiptContent = (isPrint = false) => (
    <div className={`${isPrint ? 'print-only-content bg-white text-gray-900' : 'p-8'}`}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">E-Commerce Store</h1>
          <p className="text-gray-600 text-sm">{t.address}</p>
              <p className="text-gray-600 text-sm">{t.contact}</p>
      </div>

      <div className="border-t-2 border-gray-300 my-4"></div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600">{t.order_id}</p>
          <p className="font-bold text-gray-900">#{order.id}</p>
        </div>
        <div className="text-right">
                        <p className="text-gray-600">{t.date}</p>
          <p className="font-bold text-gray-900">{orderDate}</p>
        </div>
        <div>
                        <p className="text-gray-600">{t.status}</p>
          <p className="font-bold text-blue-600">{statusMap[order.orderStatus] || order.orderStatus}</p>
        </div>
        <div className="text-right">
                          <p className="text-gray-600">{t.payment_id}</p>
          <p className="font-mono text-xs text-gray-700">{order.stripePaymentId}</p>
        </div>
      </div>

      {order.orderedBy?.address && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h3 className="font-bold text-gray-900 mb-2">{t.shipping_address}</h3>
          <div className="text-gray-700 text-sm space-y-1">
            <p><span className="font-semibold">{t.recipient}</span> {order.orderedBy.address.recipientName}</p>
            <p><span className="font-semibold">{t.phone}</span> {order.orderedBy.address.phone}</p>
            <p>
              {order.orderedBy.address.houseNumber}
              {order.orderedBy.address.street ? ` ถ.${order.orderedBy.address.street}` : ''}
              {' '}อ.{order.orderedBy.address.district}
              {' '}จ.{order.orderedBy.address.province}
              {' '}{order.orderedBy.address.postalCode}
            </p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-bold text-gray-900 mb-2 text-sm">{t.items}</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">{t.product}</th>
              <th className="px-4 py-2 text-center text-gray-700">{t.qty}</th>
              <th className="px-4 py-2 text-right text-gray-700">{t.price}</th>
              <th className="px-4 py-2 text-right text-gray-700">{t.total}</th>
            </tr>
          </thead>
          <tbody>
            {order.products?.map((product, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="px-4 py-3 text-gray-900">{product.product.title}</td>
                <td className="px-4 py-3 text-center text-gray-700">{product.count}</td>
                <td className="px-4 py-3 text-right text-gray-700">{numberFormat(product.product.price)}&nbsp;฿</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                  {numberFormat(product.count * product.product.price)}&nbsp;฿
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t-2 border-gray-300 pt-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">{t.subtotal}</span>
            <span className="text-gray-900">{numberFormat(originalTotal)}&nbsp;฿</span>
          </div>
          
          {shippingCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">{t.shipping}</span>
              <span className="text-blue-600">{numberFormat(shippingCost)}&nbsp;฿</span>
            </div>
          )}
          
          {order.coupon && discountAmount > 0 && (
            <div className="flex justify-between bg-green-50 p-2 rounded">
              <span className="text-green-700 font-medium">{t.discount} ({order.coupon.couponCode}):</span>
              <span className="text-green-600 font-semibold">-&nbsp;{numberFormat(discountAmount)}&nbsp;฿</span>
            </div>
          )}
          
          <div className="flex justify-between pt-3 border-t-2 border-gray-300 text-lg font-bold">
            <span className="text-gray-900">{t.total_paid}</span>
            <span className="text-blue-600">{numberFormat(amountPaid)}&nbsp;฿</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>{t.thank_you}</p>
        <p className="mt-1">{t.contact_support}</p>
      </div>
    </div>
  );

  const orderDate = new Date(order.createdAt).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const amountPaid = (order.amount || 0) / 100;
  const originalTotal = order.cartTotal || 0;
  const shippingCost = order.shippingCost || 0;
  const discountAmount = order.coupon ? originalTotal - (amountPaid - shippingCost) : 0;

  const statusMap = {
    PREPARING: t.status_preparing,
    SHIPPED: t.status_shipped,
    DELIVERED: t.status_delivered,
  };

  const shippingOptionsMap = {
    bangkok_standard: 'กรุงเทพและปริมณฑล - ธรรมดา',
    bangkok_express: 'กรุงเทพและปริมณฑล - แบบเร็ว',
    province_standard: 'ต่างจังหวัด - ธรรมดา',
    province_express: 'ต่างจังหวัด - แบบเร็ว'
  };

  return (
    <>
      <style>
        {`
          @media print {
            body {
              margin: 0;
            }
            body * {
              visibility: hidden;
            }
            .print-only,
            .print-only * {
              visibility: visible;
            }
            .print-only {
              display: block !important;
            }
            .print-only-content {
              width: 190mm;
              margin: 0 auto;
              padding: 12mm 14mm;
              box-sizing: border-box;
              background: white;
            }
            .print-hide {
              display: none !important;
            }
            .modal-backdrop {
              display: none !important;
            }
            @page {
              size: A4;
              margin: 10mm;
            }
          }
        `}
      </style>
      <div className="modal-backdrop fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="modal-content bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">ใบเสร็จรับเงิน / Receipt</h2>
              <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">×</button>
            </div>
          </div>

          {renderReceiptContent()}

          <div className="bg-gray-50 px-8 py-4 flex gap-3 justify-end print-hide">
            <button onClick={onClose} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg">
              ปิด
            </button>
            <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              พิมพ์ใบเสร็จ
            </button>
          </div>
        </div>
      </div>
      <div className="print-only hidden">
        {renderReceiptContent(true)}
      </div>
    </>
  );
};

export default ReceiptModal;
