import React, { useState, useEffect, } from "react";
import {
  createCategory,
  listCategory,
  removeCategory,
} from "../../api/Category";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";

const FormCategory = () => {
  const token = useEcomStore((state) => state.token);
  const [name, setName] = useState("");
  //   const [categories, setCategories] = useState([]);
  const categories = useEcomStore((state) => state.categories);
  const getCategory = useEcomStore((state) => state.getCategory);

  useEffect(() => {
    getCategory(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      return toast.warning("Please fill data");
    }
    try {
      const res = await createCategory(token, { name });
      console.log(res.data.name);
      toast.success(`Add Category ${res.data.name} successfully`);
      setName(""); // Clear the input after successful submission
      getCategory(token);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemove = async (id) => {
    console.log(id);
    try {
      const res = await removeCategory(token, id);
      console.log(res);
      toast.success(`Delete ${res.data.name} successfully`);
      getCategory(token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <form className="mb-8" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Category</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              placeholder="Enter category name"
            />
          </div>
          <div className="flex items-end">
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors shadow-md"
            >
              Add Category
            </button>
          </div>
        </div>
      </form>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-xl font-semibold mb-4">Category List</h3>
        {categories.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No categories found</p>
          </div>
        ) : (
          <div className="overflow-auto bg-gray-800 rounded-lg border border-gray-700">
            <table className="min-w-full">
              <thead className="bg-gray-700 text-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Category Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-300 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm font-medium">{item.name}</td>
                    <td className="px-4 py-3">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
                        onClick={() => handleRemove(item.id)}
                      >
                        Delete
                      </button>
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

export default FormCategory;
