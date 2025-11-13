import React from "react";
import FormCategory from "../../components/admin/FormCategory";

const Category = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Category Management</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <FormCategory />
      </div>
    </div>
  );
};

export default Category;
