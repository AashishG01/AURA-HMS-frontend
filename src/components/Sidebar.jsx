import React from 'react';
import { LayoutDashboard, MessageSquare, Hotel } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 gap-6">
      <div className="p-2 bg-indigo-500/10 rounded-lg"><Hotel className="text-indigo-400" /></div>
      <button onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-xl ${activeTab === 'dashboard' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500'}`}>
        <LayoutDashboard />
      </button>
      <button onClick={() => setActiveTab('chat')} className={`p-3 rounded-xl ${activeTab === 'chat' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}>
        <MessageSquare />
      </button>
    </div>
  );
}