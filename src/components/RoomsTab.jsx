import React from 'react';

export default function RoomsTab({ rooms }) {
  return (
    <div className="h-full overflow-y-auto pb-20 pr-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Front Desk View</h2>
        <div className="flex gap-2 text-xs font-medium">
           <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Available</span>
           <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Occupied</span>
           <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Cleaning</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {rooms.map((room) => (
          <div key={room._id} className={`
            relative p-4 rounded-xl border transition-all duration-200 group
            ${room.status === 'Available' ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50' : 
              room.status === 'Occupied' ? 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/50' : 
              room.status === 'Cleaning' ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/50' :
              'bg-slate-800 border-slate-700'}
          `}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-lg font-bold text-slate-200">{room.number}</span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                 room.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' : 
                 room.status === 'Occupied' ? 'bg-rose-500/20 text-rose-400' : 
                 'bg-amber-500/20 text-amber-400'
              }`}>
                {room.status}
              </span>
            </div>
            <div className="text-xs text-slate-500">{room.type}</div>
            <div className="text-sm font-semibold text-slate-300 mt-1">₹{room.price}</div>
            
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-2 text-center">
               <span className="text-xs text-slate-400 mb-2">Amenities:</span>
               <div className="flex flex-wrap justify-center gap-1">
                  {room.amenities.slice(0,2).map(a => <span key={a} className="text-[9px] bg-slate-700 px-1 rounded">{a}</span>)}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}