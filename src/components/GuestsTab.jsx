import React from 'react';
import { Search } from 'lucide-react';

export default function GuestsTab({ bookings }) {
  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Guest List</h2>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 flex items-center gap-2">
           <Search size={16} className="text-slate-400"/>
           <input type="text" placeholder="Search guests..." className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500"/>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-slate-400 text-xs uppercase sticky top-0">
            <tr>
              <th className="p-4 font-semibold">Guest Name</th>
              <th className="p-4 font-semibold">Room</th>
              <th className="p-4 font-semibold">Check In</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-300 divide-y divide-slate-800">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-medium text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {booking.guestName.charAt(0)}
                   </div>
                   {booking.guestName}
                </td>
                <td className="p-4"><span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">{booking.roomNumber}</span></td>
                <td className="p-4 text-slate-500">{new Date(booking.checkIn).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    booking.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 text-right font-mono">₹{booking.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
           <div className="p-8 text-center text-slate-500">No active bookings found.</div>
        )}
      </div>
    </div>
  );
}