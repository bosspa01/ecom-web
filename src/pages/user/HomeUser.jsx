import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, History, CreditCard } from 'lucide-react'
import useEcomStore from '../../store/ecom-store'

const HomeUser = () => {
  const user = useEcomStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="text-gray-400">Manage your account and orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/shop"
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all transform hover:scale-105 shadow-lg group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg group-hover:bg-green-500/30 transition-colors">
                <ShoppingBag className="text-green-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Shop</h2>
            </div>
            <p className="text-gray-400">Browse and shop for products</p>
          </Link>

          <Link
            to="/user/history"
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all transform hover:scale-105 shadow-lg group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg group-hover:bg-green-500/30 transition-colors">
                <History className="text-green-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Order History</h2>
            </div>
            <p className="text-gray-400">View your past orders</p>
          </Link>

          <Link
            to="/cart"
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all transform hover:scale-105 shadow-lg group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg group-hover:bg-green-500/30 transition-colors">
                <CreditCard className="text-green-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Cart</h2>
            </div>
            <p className="text-gray-400">Review your cart items</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeUser