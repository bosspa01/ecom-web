import React from 'react'
import TableOrders from '../../components/admin/TableOrders'

const ManageOders = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Manage Orders</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <TableOrders/>
      </div>
    </div>
  )
}

export default ManageOders