import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, LayoutDashboard, MessageSquare, Hotel, 
  Bed, Users, DollarSign, Settings, Send, Search, 
  CheckCircle, Sparkles, Bot 
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const BACKEND_URL = "https://aura-hms-backend.onrender.com";
const COLORS = {
  Available: '#10b981', // Green
  Occupied: '#ef4444',  // Red
  Cleaning: '#f59e0b',  // Yellow
  Maintenance: '#64748b' // Slate
};

// --- COMPONENT: SIDEBAR ---
const Sidebar = ({ activeTab, setActiveTab }) => {
  const NavButton = ({ icon, active, onClick, label }) => (
    <button 
      onClick={onClick} 
      className={`p-4 rounded-2xl transition-all duration-300 group relative mb-4 ${
        active 
          ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30 scale-105' 
          : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      {React.cloneElement(icon, { size: 22 })}
      <span className="absolute left-16 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none border border-slate-700 shadow-xl z-50">
        {label}
      </span>
    </button>
  );

  return (
    <div className="w-24 bg-slate-950/80 border-r border-slate-800/50 flex flex-col items-center py-8 z-20 backdrop-blur-md">
      <div className="p-3.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-8 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
        <Hotel className="text-cyan-400 h-7 w-7" />
      </div>
      
      <nav className="flex-1 w-full flex flex-col items-center gap-2">
        <NavButton icon={<LayoutDashboard />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Overview" />
        <NavButton icon={<Bed />} active={activeTab === 'rooms'} onClick={() => setActiveTab('rooms')} label="Front Desk" />
        <NavButton icon={<Users />} active={activeTab === 'guests'} onClick={() => setActiveTab('guests')} label="Guests" />
      </nav>
    </div>
  );
};

// --- COMPONENT: DASHBOARD TAB ---
const DashboardTab = ({ stats }) => {
  if (!stats) return <div className="text-slate-400 p-8 flex items-center gap-2">Loading Live Analytics...</div>;

  const pieData = [
    { name: 'Available', value: stats.stats.availableRooms },
    { name: 'Occupied', value: stats.stats.occupiedRooms },
    { name: 'Other', value: stats.stats.totalRooms - (stats.stats.availableRooms + stats.stats.occupiedRooms) }
  ];

  const revenueData = [{ name: 'Today', amount: stats.stats.revenue }];

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className={`p-2 rounded-lg bg-slate-800 ${color}`}>{icon}</span>
      </div>
      <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">{title}</div>
      <div className="text-2xl font-bold text-slate-100 mt-1">{value}</div>
    </div>
  );

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2 pb-20">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Rooms" value={stats.stats.totalRooms} icon={<Hotel size={18} />} color="text-slate-200" />
        <StatCard title="Available" value={stats.stats.availableRooms} icon={<CheckCircle size={18} />} color="text-emerald-400" />
        <StatCard title="Occupied" value={stats.stats.occupiedRooms} icon={<Users size={18} />} color="text-rose-400" />
        <StatCard title="Revenue" value={`₹${stats.stats.revenue.toLocaleString()}`} icon={<DollarSign size={18} />} color="text-amber-400" />
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6 h-72">
        {/* Pie Chart */}
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 relative">
          <h3 className="text-sm font-semibold text-slate-400 mb-4">Room Occupancy</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                <Cell fill={COLORS.Available} />
                <Cell fill={COLORS.Occupied} />
                <Cell fill={COLORS.Cleaning} />
              </Pie>
              <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              <Tooltip contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
           <h3 className="text-sm font-semibold text-slate-400 mb-4">Revenue Overview</h3>
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`}/>
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff'}}/>
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={50}>
                <Cell fill="#818cf8" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: ROOMS TAB ---
const RoomsTab = ({ rooms }) => {
  return (
    <div className="h-full overflow-y-auto pb-20 pr-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Front Desk View</h2>
        <div className="flex gap-3 text-xs font-medium bg-slate-900/50 px-3 py-2 rounded-full border border-slate-800">
           <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Available</span>
           <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Occupied</span>
           <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Cleaning</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {rooms.map((room) => (
          <div key={room._id} className={`
            relative p-4 rounded-xl border transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl
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
            <div className="text-xs text-slate-500 font-medium">{room.type}</div>
            <div className="text-sm font-semibold text-slate-300 mt-1">₹{room.price}</div>
            
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-2 text-center z-10">
               <span className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Amenities</span>
               <div className="flex flex-wrap justify-center gap-1">
                  {room.amenities.slice(0,3).map(a => <span key={a} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">{a}</span>)}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENT: GUESTS TAB ---
const GuestsTab = ({ bookings }) => {
  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Guest List</h2>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 flex items-center gap-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
           <Search size={16} className="text-slate-400"/>
           <input type="text" placeholder="Search guests..." className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500"/>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-900/50 shadow-inner">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10">
            <tr>
              <th className="p-4 font-semibold">Guest Name</th>
              <th className="p-4 font-semibold">Room</th>
              <th className="p-4 font-semibold">Check In</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-300 divide-y divide-slate-800/50">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-medium text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-lg">
                      {booking.guestName.charAt(0)}
                   </div>
                   {booking.guestName}
                </td>
                <td className="p-4"><span className="bg-slate-800 px-2 py-1 rounded border border-slate-700 font-mono text-xs">{booking.roomNumber}</span></td>
                <td className="p-4 text-slate-500">{new Date(booking.checkIn).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                    booking.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400 border border-slate-600'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 text-right font-mono text-slate-400">₹{booking.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
           <div className="p-12 text-center text-slate-500 flex flex-col items-center">
             <Users size={48} className="mb-4 opacity-20"/>
             No active bookings found.
           </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENT: CHAT INTERFACE (Futuristic Panel) ---
const ChatInterface = ({ messages, isListening, toggleMic, voices, selectedVoiceIndex, onVoiceChange, onSend }) => {
  const endRef = useRef(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSend(inputText);
    setInputText("");
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="text-amber-400 h-5 w-5" />
          AI Assistant
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">Powered by Gemini 2.5 Flash</p>
        
        {/* Voice Config */}
        <div className="mt-3 flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <Settings size={14} className="text-slate-500" />
          <select 
            className="bg-transparent text-[10px] font-medium text-slate-400 outline-none w-full cursor-pointer hover:text-slate-200 transition-colors"
            value={selectedVoiceIndex}
            onChange={(e) => onVoiceChange(parseInt(e.target.value))}
          >
            {voices.map((voice, index) => (
              <option key={index} value={index}>{voice.name.slice(0, 25)}...</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Stream */}
      <div className="flex-1 overflow-y-auto mb-4 pr-1 space-y-5 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${m.role === 'user' ? 'flex-row-reverse text-indigo-400' : 'text-cyan-400'}`}>
               {m.role === 'user' ? 'You' : 'Aura'}
            </div>
            <div className={`p-4 rounded-2xl text-sm leading-6 shadow-lg backdrop-blur-sm border ${
              m.role === 'user' 
                ? 'bg-indigo-600/90 text-white rounded-tr-none border-indigo-500/50' 
                : 'bg-slate-900/80 text-slate-200 rounded-tl-none border-slate-800'
            }`}>
              {m.text}
            </div>
            {m.role === 'ai' && m.meta && (
              <div className="flex gap-2 mt-2 ml-1 animate-fade-in">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-cyan-400 uppercase tracking-wide shadow-sm">
                  {m.meta.intent}
                </span>
                {m.meta.sentiment && (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 uppercase tracking-wide shadow-sm ${
                    m.meta.sentiment === 'POSITIVE' ? 'text-emerald-400' : 
                    m.meta.sentiment === 'NEGATIVE' ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    {m.meta.sentiment}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef}/>
      </div>

      {/* Floating Interaction Area */}
      <div className="mt-auto bg-slate-900/50 p-1 rounded-2xl border border-slate-800 backdrop-blur-xl relative">
        <div className="flex items-center gap-2 p-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Aura anything..."
            className="bg-transparent border-none text-slate-200 placeholder-slate-500 text-sm w-full px-2 outline-none font-medium"
          />
          <button onClick={handleSend} className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-lg">
            <Send size={16} />
          </button>
        </div>
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
           <div className={`
              pointer-events-auto cursor-pointer w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]
              ${isListening 
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 scale-110 shadow-[0_0_50px_rgba(244,63,94,0.4)] border-4 border-slate-900' 
                : 'bg-slate-800 hover:bg-slate-700 border-4 border-slate-900 text-slate-400 hover:text-white'}
           `}
           onClick={toggleMic}
           >
              {isListening ? <MicOff size={28} className="animate-pulse text-white" /> : <Mic size={28} />}
           </div>
           {isListening && <span className="text-[10px] bg-black/50 px-2 py-1 rounded text-white backdrop-blur-md animate-bounce">Listening...</span>}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function HotelApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([{ role: 'ai', text: "Welcome back, Manager. Systems are online.", meta: { intent: 'GREETING', sentiment: 'NEUTRAL' } }]);
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Voice Load
  useEffect(() => {
    const loadVoices = () => {
      const avail = window.speechSynthesis.getVoices();
      setVoices(avail);
      const def = avail.findIndex(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
      if (def !== -1) setSelectedVoiceIndex(def);
    };
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  // Data Poll
  const fetchStats = () => {
    fetch(`${BACKEND_URL}/api/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchStats();
    const i = setInterval(fetchStats, 3000);
    return () => clearInterval(i);
  }, []);

  // Speech Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SR = window.webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (e) => handleQuery(e.results[0][0].transcript);
    }
    if ('speechSynthesis' in window) synthesisRef.current = window.speechSynthesis;
  }, []);

  const speak = (text) => {
    synthesisRef.current?.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voices[selectedVoiceIndex]) u.voice = voices[selectedVoiceIndex];
    synthesisRef.current?.speak(u);
  };

  const handleQuery = async (text) => {
    setMessages(p => [...p, { role: 'user', text }]);
    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, history: messages.slice(-3) })
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'ai', text: data.display_text, meta: { intent: data.intent, sentiment: data.sentiment } }]);
      speak(data.spoken_response);
      fetchStats();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex overflow-hidden selection:bg-indigo-500/30 relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden p-6 gap-6">
          <header className="flex justify-between items-center pb-2">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                Aura PMS <span className="text-indigo-400 text-sm font-normal ml-2 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Pro</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide uppercase">Hotel Operations Command Center</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-md shadow-sm">
               <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
               <span className={`text-xs font-bold uppercase tracking-wider ${isListening ? 'text-rose-400' : 'text-emerald-400'}`}>
                 {isListening ? "Listening..." : "Online"}
               </span>
            </div>
          </header>

          <div className="flex-1 overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-xl shadow-2xl relative">
            {activeTab === 'dashboard' && <DashboardTab stats={stats} />}
            {activeTab === 'rooms' && <RoomsTab rooms={stats ? stats.rooms : []} />}
            {activeTab === 'guests' && <GuestsTab bookings={stats ? stats.recentBookings : []} />}
          </div>
        </div>

        <div className="w-[380px] h-screen p-6 border-l border-slate-800/50 bg-slate-950/50 backdrop-blur-2xl flex flex-col shadow-2xl z-20">
           <ChatInterface 
              messages={messages} 
              isListening={isListening} 
              toggleMic={() => isListening ? recognitionRef.current.stop() : recognitionRef.current.start()}
              voices={voices}
              selectedVoiceIndex={selectedVoiceIndex}
              onVoiceChange={setSelectedVoiceIndex}
              onSend={handleQuery}
            />
        </div>
      </div>
    </div>
  );
}