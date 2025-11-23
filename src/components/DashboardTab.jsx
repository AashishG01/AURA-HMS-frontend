import React from 'react';
import { Hotel, CheckCircle, Users, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  Available: '#10b981',
  Occupied: '#ef4444',
  Cleaning: '#f59e0b',
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <span className={`p-2 rounded-lg bg-slate-800 ${color}`}>{icon}</span>
    </div>
    <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">{title}</div>
    <div className="text-2xl font-bold text-slate-100 mt-1">{value}</div>
  </div>
);

export default function DashboardTab({ stats }) {
  if (!stats) return <div className="text-slate-400 p-8">Loading Analytics...</div>;

  const pieData = [
    { name: 'Available', value: stats.stats.availableRooms },
    { name: 'Occupied', value: stats.stats.occupiedRooms },
    { name: 'Other', value: stats.stats.totalRooms - (stats.stats.availableRooms + stats.stats.occupiedRooms) }
  ];

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2 pb-20">
      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Rooms" value={stats.stats.totalRooms} icon={<Hotel size={18} />} color="text-slate-200" />
        <StatCard title="Available" value={stats.stats.availableRooms} icon={<CheckCircle size={18} />} color="text-emerald-400" />
        <StatCard title="Occupied" value={stats.stats.occupiedRooms} icon={<Users size={18} />} color="text-rose-400" />
        <StatCard title="Revenue" value={`₹${stats.stats.revenue.toLocaleString()}`} icon={<DollarSign size={18} />} color="text-amber-400" />
      </div>

      {/* Charts Area */}
      <div className="grid md:grid-cols-2 gap-6 h-72">
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-400 mb-4">Room Occupancy</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                <Cell fill={COLORS.Available} />
                <Cell fill={COLORS.Occupied} />
                <Cell fill={COLORS.Cleaning} />
              </Pie>
              <Legend verticalAlign="bottom" height={36}/>
              <Tooltip contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px', border: 'none'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
           <h3 className="text-sm font-semibold text-slate-400 mb-4">Revenue Targets</h3>
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Today', amount: stats.stats.revenue }]}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px', border: 'none'}}/>
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}