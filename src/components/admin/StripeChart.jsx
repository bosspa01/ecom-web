import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useEcomStore from '../../store/ecom-store';
// Chart.js + react-chartjs-2 are used. Install with:
// npm install chart.js react-chartjs-2
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
const ChartComp = Bar;

export default function StripeChart({ days = 30 }) {
  const token = useEcomStore((s) => s.token);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://ecom-api-seven-gamma.vercel.app/api/admin/stripe-sales?days=${days}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to load stripe sales', err);
      }
    };
    fetchData();
  }, [token, days]);

  if (!token) return <div>Please login as admin to view analytics.</div>;
  if (!data) return <div>Loading analytics...</div>;

  if (!ChartComp) {
    return (
      <div>
        Chart libraries not installed. Run:
        <pre>npm install chart.js react-chartjs-2</pre>
      </div>
    );
  }

  const labels = data.map((d) => d.label || d.date);
  const revenues = data.map((d) => d.revenue);
  const counts = data.map((d) => d.count);

  const total = revenues.reduce((s, v) => s + (Number(v) || 0), 0);
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'THB' }).format(total);

  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Revenue',
        data: revenues,
        backgroundColor: 'rgba(54,162,235,0.6)',
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Orders',
        data: counts,
        borderColor: 'rgba(255,99,132,0.8)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    stacked: false,
    scales: {
      y: { type: 'linear', position: 'left', title: { display: true, text: 'Revenue' } },
      y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Orders' } },
    },
  };

  return (
    <div className="p-4">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-xl">Stripe Sales (last {days} days)</h3>
        <div className="text-right">
          <div className="text-sm text-gray-500">Gross volume</div>
          <div className="text-2xl font-semibold">{formattedTotal}</div>
        </div>
      </div>
      <ChartComp data={chartData} options={options} />
    </div>
  );
}
