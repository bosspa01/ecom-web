import React, { useState, useEffect } from "react";
import useEcomStore from "../../store/ecom-store";
import { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } from "../../api/User";
import { toast } from "react-toastify";
import { Trash, Pencil } from "lucide-react";

const initialState = {
  couponCode: "",
  description: "",
  discountType: "percentage",
  discountValue: 0,
  maxUses: 1,
  expirationDate: "",
  minimumOrderAmount: "",
  status: "active",
};

const FormCoupon = () => {
  const token = useEcomStore((state) => state.token);
  const [form, setForm] = useState(initialState);
  const [coupons, setCoupons] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await getAllCoupons(token);
      setCoupons(res.data.coupons || []);
    } catch (error) {
      console.error("Failed to load coupons", error);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!form.couponCode || !form.discountValue || !form.maxUses || !form.expirationDate) {
      return toast.warning("Please fill all required fields");
    }

    if (form.discountType === "percentage" && (form.discountValue < 0 || form.discountValue > 100)) {
      return toast.warning("Percentage must be between 0 and 100");
    }

    if (form.discountType === "fixed_amount" && form.discountValue < 0) {
      return toast.warning("Fixed amount must be positive");
    }

    try {
      if (editingId) {
        await updateCoupon(token, editingId, form);
        toast.success("Coupon updated successfully");
      } else {
        await createCoupon(token, form);
        toast.success("Coupon created successfully");
      }
      setForm(initialState);
      setEditingId(null);
      fetchCoupons();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save coupon";
      toast.error(message);
    }
  };

  const handleEdit = (coupon) => {
    setForm({
      couponCode: coupon.couponCode,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxUses: coupon.maxUses,
      expirationDate: new Date(coupon.expirationDate).toISOString().slice(0, 16),
      minimumOrderAmount: coupon.minimumOrderAmount || "",
      status: coupon.status,
    });
    setEditingId(coupon.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(token, id);
        toast.success("Coupon deleted successfully");
        fetchCoupons();
      } catch (error) {
        toast.error("Failed to delete coupon");
      }
    }
  };

  const handleCancel = () => {
    setForm(initialState);
    setEditingId(null);
  };

  const isExpired = (expirationDate) => {
    return new Date(expirationDate) < new Date();
  };

  const isMaxUsesReached = (coupon) => {
    return coupon.currentUses >= coupon.maxUses;
  };

  return (
    <div className="p-6">
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {editingId ? "Edit Coupon" : "Create New Coupon"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
              value={form.couponCode}
              onChange={handleOnChange}
              placeholder="SAVE10"
              name="couponCode"
              required
              disabled={!!editingId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              name="discountType"
              onChange={handleOnChange}
              value={form.discountType}
              required
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed_amount">Fixed Amount ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.discountValue}
              onChange={handleOnChange}
              placeholder={form.discountType === "percentage" ? "10" : "50"}
              name="discountValue"
              min="0"
              step={form.discountType === "percentage" ? "1" : "0.01"}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.discountType === "percentage"
                ? "Enter percentage (0-100)"
                : "Enter amount in dollars"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Uses <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.maxUses}
              onChange={handleOnChange}
              placeholder="100"
              name="maxUses"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.expirationDate}
              onChange={handleOnChange}
              name="expirationDate"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Order Amount (Optional)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.minimumOrderAmount}
              onChange={handleOnChange}
              placeholder="0.00"
              name="minimumOrderAmount"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              name="status"
              onChange={handleOnChange}
              value={form.status}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={form.description}
              onChange={handleOnChange}
              placeholder="Coupon description"
              name="description"
              rows="3"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-md"
          >
            {editingId ? "Update Coupon" : "Create Coupon"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-xl font-semibold mb-4">Coupon List</h3>
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No coupons found</p>
          </div>
        ) : (
          <div className="overflow-auto bg-gray-800 rounded-lg border border-gray-700">
            <table className="min-w-full">
              <thead className="bg-gray-700 text-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Discount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Uses
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Expires
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className={
                      isExpired(coupon.expirationDate) || isMaxUsesReached(coupon)
                        ? "border-b border-gray-700 bg-red-900/20 hover:bg-red-900/30"
                        : "border-b border-gray-700 hover:bg-gray-700/50"
                    }
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-300">
                      {coupon.couponCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {coupon.currentUses} / {coupon.maxUses}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(coupon.expirationDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium border ${
                          isExpired(coupon.expirationDate) || isMaxUsesReached(coupon)
                            ? "bg-red-900/50 text-red-400 border-red-800"
                            : coupon.status === "active"
                            ? "bg-green-900/50 text-green-400 border-green-800"
                            : "bg-gray-700 text-gray-300 border-gray-600"
                        }`}
                      >
                        {isExpired(coupon.expirationDate)
                          ? "Expired"
                          : isMaxUsesReached(coupon)
                          ? "Max Uses"
                          : coupon.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition-colors shadow-sm inline-flex items-center justify-center"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors shadow-lg inline-flex items-center justify-center"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCoupon;

