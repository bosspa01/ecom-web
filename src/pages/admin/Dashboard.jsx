import React, { useEffect, useState, useCallback } from 'react';
import StripeChart from '../../components/admin/StripeChart';
import TopSellingProducts from '../../components/admin/TopSellingProducts';
import useEcomStore from '../../store/ecom-store';
import { getTodaySold, getOrdersAdmin } from '../../api/admin';
import { numberFormat } from '../../utils/number';

const Dashboard = () => {
  const token = useEcomStore((s) => s.token);
  const [soldToday, setSoldToday] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSold = useCallback(async () => {
    if (!token) {
      setSoldToday(null);
      return;
    }
    try {
      setIsRefreshing(true);
      
      // Try the API endpoint first
      const res = await getTodaySold(token);
      console.log('Today sold API response:', res.data);
      
      // Handle different possible response structures
      let soldCount = res.data?.soldToday ?? res.data?.data?.soldToday ?? res.data ?? 0;
      console.log('Parsed sold count from API:', soldCount);
      
      // If API returns 0, try calculating from orders as fallback
      if (soldCount === 0) {
        console.log('API returned 0, calculating from orders...');
        try {
          const ordersRes = await getOrdersAdmin(token);
          const orders = ordersRes.data || [];
          
          // Get today's date range
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          // Filter orders created today and sum up product counts
          const todayOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= today && orderDate < tomorrow;
          });
          
          console.log('Today orders found:', todayOrders.length);
          console.log('Today orders:', todayOrders);
          
          let calculatedCount = 0;
          todayOrders.forEach(order => {
            if (order.products && Array.isArray(order.products)) {
              order.products.forEach(product => {
                calculatedCount += product.count || 0;
              });
            }
          });
          
          console.log('Calculated count from orders:', calculatedCount);
          
          // Use calculated count if it's greater than 0
          if (calculatedCount > 0) {
            soldCount = calculatedCount;
            console.log('Using calculated count:', soldCount);
          }
        } catch (calcErr) {
          console.error('Error calculating from orders:', calcErr);
        }
      }
      
      setSoldToday(soldCount);
    } catch (err) {
      console.error('Failed to fetch today sold', err);
      console.error('Error details:', err.response?.data || err.message);
      setSoldToday(0);
    } finally {
      setIsRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSold();
    
    // Set up interval to refresh every 10 seconds (reduced for faster updates)
    const interval = setInterval(() => {
      fetchSold();
    }, 10000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchSold]);
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div className="bg-white mb-4 p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg">ขายวันนี้</h2>
          <button
            onClick={fetchSold}
            disabled={isRefreshing}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? 'กำลังโหลด...' : 'รีเฟรช'}
          </button>
        </div>
        <div className="text-3xl font-bold">{soldToday === null ? 'Loading...' : `${numberFormat(soldToday)} ชิ้น`}</div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
          
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg mb-2">Last 7 days</h2>
          <StripeChart days={7} />
        </div>
          <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg mb-2">Last 30 days</h2>
          <StripeChart days={30} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <TopSellingProducts />
      </div>
    </div>
  );
};

export default Dashboard;