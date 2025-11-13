import React, { useEffect, useState } from "react";
import { getOrdersAdmin, changeOrderStatus } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { numberFormat } from "../../utils/number";

const ORDER_STATUS_LABELS = {
  PREPARING: "กำลังเตรียมจัดส่ง",
  SHIPPED: "ส่งสินค้าให้ขนส่งแล้ว",
  DELIVERED: "ส่งสินค้าสำเร็จ",
};

const TableOrders = () => {
  const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (token) handleGetOrders();
  }, [token]);

  const handleGetOrders = async () => {
    try {
      const res = await getOrdersAdmin(token);
      setOrders(res.data || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await changeOrderStatus(token, orderId, newStatus);
      toast.success("อัปเดตสถานะออเดอร์สำเร็จ");
      // Refresh orders
      handleGetOrders();
    } catch (error) {
      console.error("Failed to update order status", error);
      toast.error("ไม่สามารถอัปเดตสถานะได้");
    }
  };

  return (
    <div className="p-6">
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No orders found</p>
        </div>
      ) : (
        <div className="overflow-auto bg-gray-800 rounded-lg border border-gray-700">
          <table className="min-w-full">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Shipping Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Payment ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Currency
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3 text-gray-300 text-sm">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-gray-300">
                      {order.orderedBy?.name || "-"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.orderedBy?.email || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {order.orderedBy?.address ? (
                      <div className="text-xs">
                        <div className="font-medium text-gray-300">
                          {order.orderedBy.address.recipientName}
                        </div>
                        <div className="text-gray-400">
                          {order.orderedBy.address.phone}
                        </div>
                        <div className="text-gray-500 mt-1">
                          {order.orderedBy.address.houseNumber}
                          {order.orderedBy.address.street
                            ? ` ถ.${order.orderedBy.address.street}`
                            : ""}
                          <br />
                          อ.{order.orderedBy.address.district} จ.
                          {order.orderedBy.address.province}{" "}
                          {order.orderedBy.address.postalCode}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {order.products?.map((p) => (
                      <div key={p.id} className="pb-2 last:pb-0">
                        <div className="font-medium text-sm text-gray-300">
                          {p.product?.title || "Product " + p.productId}
                        </div>
                        <div className="text-xs text-gray-400">
                          Qty: {numberFormat(p.count)} × {numberFormat(p.price)}
                         &nbsp;฿
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-300">
                    {order.amount
                      ? numberFormat(Number(order.amount) / 100)
                      : numberFormat(order.cartTotal)}
                    &nbsp;฿
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus || "PREPARING"}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`w-full px-3 py-2 rounded text-sm font-medium border-2 cursor-pointer transition-colors ${
                        order.orderStatus === "DELIVERED"
                          ? "bg-green-900/50 text-green-400 border-green-800 hover:bg-green-900/70"
                          : order.orderStatus === "SHIPPED"
                          ? "bg-blue-900/50 text-blue-400 border-blue-800 hover:bg-blue-900/70"
                          : "bg-yellow-900/50 text-yellow-400 border-yellow-800 hover:bg-yellow-900/70"
                      }`}
                    >
                      <option value="PREPARING">กำลังเตรียมจัดส่ง</option>
                      <option value="SHIPPED">ส่งสินค้าให้ขนส่งแล้ว</option>
                      <option value="DELIVERED">ส่งสินค้าสำเร็จ</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono text-xs">
                    {order.stripePaymentId || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm uppercase text-gray-300">
                    {order.currency || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TableOrders;
