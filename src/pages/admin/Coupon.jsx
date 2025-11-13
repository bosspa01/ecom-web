import React from 'react'
import FormCoupon from '../../components/admin/FormCoupon'

const Coupon = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Coupon Management</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <FormCoupon/>
      </div>
    </div>
  )
}

export default Coupon

