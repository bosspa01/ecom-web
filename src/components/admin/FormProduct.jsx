import React, { useState, useEffect } from "react";
import useEcomStore from "../../store/ecom-store";
import { createProduct, deleteProduct } from "../../api/product";
import { toast } from "react-toastify";
import Uploadfile from "./Uploadfile";
import { Link } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import { numberFormat } from "../../utils/number";

const initialState = {
  title: "",
  description: "",
  price: 0,
  quantity: 0,
  categoryId: "",
  images: [],
};

const FormProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  //   console.log("products", products);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    images: [],
  });

  useEffect(() => {
    getCategory();
    getProduct(100);
  }, []);

  const handleOnChange = (e) => {
    console.log(e.target.value, e.target.name);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) {
      try {
        const res = await deleteProduct(token, id);
        console.log(res);
        getProduct();
        toast.success(`ลบสินค้า สำเร็จ`);
      } catch (error) {
        console.log("err delete", error);
      }
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct(token, form);
      console.log(res);
      setForm(initialState);
      getProduct();
      toast.success(`เพิ่มสินค้า ${res.data.title} สำเร็จ`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">เพิ่มข้อมูลสินค้า</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.title}
              onChange={handleOnChange}
              placeholder="Product Title"
              name="title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.price}
              onChange={handleOnChange}
              placeholder="0.00"
              name="price"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.quantity}
              onChange={handleOnChange}
              placeholder="0"
              name="quantity"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              name="categoryId"
              onChange={handleOnChange}
              required
              value={form.categoryId}
            >
              <option value="" disabled>
                Please Select Category
              </option>
              {categories.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={form.description}
              onChange={handleOnChange}
              placeholder="Product Description"
              name="description"
              rows="3"
            />
          </div>
        </div>

        {/* Upload File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <Uploadfile form={form} setForm={setForm} />
        </div>

        <button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-md w-full md:w-auto"
        >
          เพิ่มสินค้า
        </button>
      </form>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-xl font-semibold text-white mb-4">Product List</h3>
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No products found</p>
          </div>
        ) : (
          <div className="overflow-auto bg-gray-800 rounded-lg border border-gray-700">
            <table className="min-w-full">
              <thead className="bg-gray-700 text-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">รูปภาพ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">ชื่อสินค้า</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">รายละเอียด</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">ราคา</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">จำนวน</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">จำนวนที่ขายได้</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">วันที่อัปเดต</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-300 text-sm">{index + 1}</td>

                    <td className="px-4 py-3">
                      {item.images.length > 0 ? (
                        <img
                          className="w-20 h-20 object-cover rounded-md shadow-sm"
                          src={item.images[0].url}
                          alt={item.title}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-700 rounded-md flex items-center justify-center shadow-sm text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-gray-300 text-sm font-medium">{item.title}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm max-w-xs truncate">{item.description || "-"}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm font-medium">{numberFormat(item.price)}&nbsp;฿</td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{numberFormat(item.quantity)}&nbsp;ชิ้น</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-900/50 text-green-400 border border-green-800">
                        {item.sold || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link 
                          to={"/admin/product/" + item.id}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition-colors shadow-sm inline-flex items-center justify-center"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
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

export default FormProduct;
