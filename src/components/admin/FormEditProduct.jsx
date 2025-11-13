import React, { useState, useEffect } from "react";
import useEcomStore from "../../store/ecom-store";
import { readProduct, updateProduct } from "../../api/product";
import { toast } from "react-toastify";
import Uploadfile from "./Uploadfile";
import { useParams, useNavigate } from "react-router-dom";

const initialState = {
  title: "5555",
  description: "desc",
  price: "6500",
  quantity: 10,
  categoryId: "",
  images: [],
};

const FormEditProduct = () => {
    const {id} = useParams();
    const navigate = useNavigate();

  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
//   console.log("products", products);

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    getCategory();
    fetchProduct(token,id,form);
  }, []);

  const fetchProduct = async (token,id,form) => {
    try{
        const res = await readProduct(token,id,form);
        console.log("res from backend",res);
        setForm(res.data);
    }catch(error){
        console.log("err fetch data",error);
    }
  }
  console.log("form",form);

  const handleOnChange = (e) => {
    console.log(e.target.value, e.target.name);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProduct(token,id, form);
      console.log(res);
      toast.success(`เพิ่มสินค้า ${res.data.title} สำเร็จ`);
      navigate("/admin/product");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">แก้ไขข้อมูลสินค้า</h3>
        
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

        <div className="flex gap-3">
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-md"
          >
            บันทึกการแก้ไข
          </button>
          <button 
            type="button"
            onClick={() => navigate("/admin/product")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-md"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormEditProduct;
