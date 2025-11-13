import React from 'react'
import FormEditProduct from '../../components/admin/FormEditProduct'

const EditProduct = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Product</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <FormEditProduct/>
      </div>
    </div>
  )
}

export default EditProduct