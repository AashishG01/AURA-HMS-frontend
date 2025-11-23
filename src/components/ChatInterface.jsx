import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Settings, Send } from 'lucide-react';

export default function ChatInterface({ messages, isListening, toggleMic, voices, selectedVoiceIndex, onVoiceChange, onSend }) {
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Voice Settings Bar */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
          <Settings size={14} className="text-slate-400" />
          <select 
            className="bg-transparent text-xs text-slate-300 outline-none max-w-[150px]"
            value={selectedVoiceIndex}
            onChange={(e) => onVoiceChange(parseInt(e.target.value))}
          >
            {voices.map((voice, index) => (
              <option key={index} value={index}>
                {voice.name.slice(0, 20)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            
            {/* Message Bubble */}
            <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
            }`}>
              {m.text}
            </div>

            {/* Metadata */}
            {m.role === 'ai' && m.meta && (
              <div className="flex gap-2 mt-2 ml-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-400">
                  INTENT: {m.meta.intent}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 ${
                  m.meta.sentiment === 'POSITIVE' ? 'text-green-400' : 
                  m.meta.sentiment === 'NEGATIVE' ? 'text-red-400' : 'text-slate-400'
                }`}>
                  SENTIMENT: {m.meta.sentiment}
                </span>
              </div>
            )}
          </div>
        ))}
        <div ref={endRef}/>
      </div>

      {/* Bottom Controls: Text Input + Mic */}
      <div className="flex items-end gap-2 pt-2 border-t border-slate-800/50">
        
        {/* Text Input */}
        <div className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center p-1 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="bg-transparent border-none text-slate-200 placeholder-slate-500 text-sm w-full p-3 outline-none"
          />
          <button 
            onClick={handleSend}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors m-1"
          >
            <Send size={18} />
          </button>
        </div>

        {/* Voice Input Button */}
        <button 
          onClick={toggleMic} 
          className={`
            h-[54px] w-[54px] rounded-xl flex justify-center items-center transition-all shadow-lg
            ${isListening 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' 
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'}
          `}
          title={isListening ? "Stop Listening" : "Voice Input"}
        >
           {isListening ? <MicOff size={24} /> : <Mic size={24} />} 
        </button>
      </div>
    </div>
  );
}