import React from 'react'
import FormProduct from '../../components/admin/FormProduct'

const Product = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Product Management</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <FormProduct/>
      </div>
    </div>
  )
}

export default Product