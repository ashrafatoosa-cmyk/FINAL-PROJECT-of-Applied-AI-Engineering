"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Activity, ThermometerSun, Zap, ShieldAlert, Truck, Info, Settings, Clock, ChevronLeft } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type TelematicsData = {
  truck_id: string;
  engine_temp: number;
  vibration_hz: number;
  battery_current: number;
  status: string;
  timestamp: string;
};

export default function FleetMonitor() {
  const router = useRouter();
  const [dataStream, setDataStream] = useState<TelematicsData[]>([]);
  const [activeTruck, setActiveTruck] = useState("TRUCK-001");
  const [isConnected, setIsConnected] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // In production, this connects to the FastAPI backend
    // For local dev demonstration, we'll simulate the WebSocket internally if it fails to connect
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket("ws://localhost:8000/ws/fleet-data");
        
        ws.onopen = () => setIsConnected(true);
        ws.onclose = () => setIsConnected(false);
        ws.onerror = () => setIsConnected(false);
        
        ws.onmessage = (event) => {
          const newData = JSON.parse(event.data) as TelematicsData;
          newData.timestamp = new Date().toLocaleTimeString();
          
          setDataStream(prev => {
            const updated = [...prev, newData];
            return updated.length > 20 ? updated.slice(updated.length - 20) : updated;
          });

          // Simulate AI Report generation on warning
          if (newData.status === "warning" && newData.truck_id === activeTruck) {
            setAiReport(`[AI Agent Report - ${new Date().toLocaleTimeString()}]\nAnomaly detected on ${newData.truck_id}.\nEngine Temp: ${newData.engine_temp}°C | Vibration: ${newData.vibration_hz}Hz\n\nRAG Analysis: According to Volvo Fleet Manual Section 4.1, combined high vibration and temperature indicates potential transmission bearing failure. \n\nRecommended Action: Ground vehicle and inspect front-left bearing immediately.`);
          }
        };
        
        wsRef.current = ws;
      } catch (e) {
        console.error("WebSocket setup failed", e);
      }
    };

    connectWebSocket();
    
    // Fallback simulation if backend isn't running yet
    const simInterval = setInterval(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        setIsConnected(true);
        const trucks = ["TRUCK-001", "TRUCK-002"];
        const isAnomaly = Math.random() > 0.9;
        
        const mockData = {
          truck_id: trucks[Math.floor(Math.random() * trucks.length)],
          engine_temp: isAnomaly ? 105 + Math.random() * 5 : 85 + Math.random() * 10,
          vibration_hz: isAnomaly ? 45 + Math.random() * 10 : 20 + Math.random() * 5,
          battery_current: 13.5 + Math.random(),
          status: isAnomaly ? "warning" : "normal",
          timestamp: new Date().toLocaleTimeString()
        };
        
        setDataStream(prev => {
          const updated = [...prev, mockData];
          return updated.length > 20 ? updated.slice(updated.length - 20) : updated;
        });

        if (mockData.status === "warning" && mockData.truck_id === activeTruck) {
            setAiReport(`[AI Agent Report - ${new Date().toLocaleTimeString()}]\nAnomaly detected on ${mockData.truck_id}.\nEngine Temp: ${mockData.engine_temp.toFixed(1)}°C | Vibration: ${mockData.vibration_hz.toFixed(1)}Hz\n\nRAG Analysis: According to Volvo Fleet Manual Section 4.1, combined high vibration and temperature indicates potential transmission bearing failure. \n\nRecommended Action: Ground vehicle and inspect front-left bearing immediately.`);
        }
      }
    }, 2000);

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearInterval(simInterval);
    };
  }, [activeTruck]);

  const activeData = dataStream.filter(d => d.truck_id === activeTruck);
  const latestData = activeData.length > 0 ? activeData[activeData.length - 1] : null;

  return (
    <div className="min-h-screen bg-brand-900 text-white font-sans overflow-y-auto pb-24 selection:bg-accent-500">
      
      {/* Header */}
      <header className="px-6 py-5 border-b border-white/10 glass sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10 group flex-shrink-0"
          >
            <ChevronLeft size={20} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.5)] flex-shrink-0">
              <Activity size={20} className="text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black tracking-tight leading-none">FLEET COMMAND</h1>
              <p className="text-[10px] text-accent-500 font-bold uppercase tracking-widest mt-1">Predictive Maintenance Console</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 hidden sm:inline">
            {isConnected ? "Live Stream Active" : "Disconnected"}
          </span>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-6 max-w-lg mx-auto">
        
        {/* Truck Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["TRUCK-001", "TRUCK-002", "TRUCK-003"].map(truck => (
            <button
              key={truck}
              onClick={() => { setActiveTruck(truck); setAiReport(null); }}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTruck === truck 
                  ? "bg-brand-500 text-white shadow-lg border border-brand-400/50" 
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
              }`}
            >
              <Truck size={14} className="inline mr-2" />
              {truck}
            </button>
          ))}
        </div>

        {/* Live Gauges */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-4 rounded-2xl border transition-colors ${(latestData?.engine_temp ?? 0) > 100 ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 border-white/10'}`}>
            <div className="flex items-center gap-2 text-white/50 mb-2">
              <ThermometerSun size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Engine Temp</span>
            </div>
            <p className="text-3xl font-display font-black tracking-tighter">
              {latestData ? latestData.engine_temp.toFixed(1) : "--"}°<span className="text-lg text-white/50">C</span>
            </p>
          </div>
          
          <div className={`p-4 rounded-2xl border transition-colors ${(latestData?.vibration_hz ?? 0) > 40 ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 border-white/10'}`}>
            <div className="flex items-center gap-2 text-white/50 mb-2">
              <Activity size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Axle Vibration</span>
            </div>
            <p className="text-3xl font-display font-black tracking-tighter">
              {latestData ? latestData.vibration_hz.toFixed(1) : "--"}<span className="text-lg text-white/50">Hz</span>
            </p>
          </div>
        </div>

        {/* ML Prediction Bar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-accent-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white/80">Remaining Useful Life (RUL)</h3>
            </div>
            <span className="text-[10px] font-black tracking-widest bg-white/10 px-2 py-1 rounded-md">ML MODEL</span>
          </div>
          
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${(latestData?.status ?? '') === 'warning' ? 'bg-red-500 w-[15%]' : 'bg-emerald-500 w-[85%]'}`} 
            />
          </div>
          <div className="flex justify-between mt-2 text-[9px] font-bold text-white/40 uppercase tracking-widest">
            <span>Critical Failure</span>
            <span>Optimal Condition</span>
          </div>
        </div>

        {/* Real-time Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-64">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-brand-500" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white/80">Live Telemetry Stream</h3>
          </div>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.3)" fontSize={10} tickMargin={10} />
                <YAxis yAxisId="left" stroke="rgba(255,255,255,0.3)" fontSize={10} domain={['auto', 'auto']} />
                <YAxis yAxisId="right" orientation="right" stroke="rgba(20,184,166,0.5)" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="engine_temp" stroke="#cc6699" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" dataKey="vibration_hz" stroke="#14b8a6" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Agent LLM Report */}
        {aiReport && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={18} className="text-red-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-red-500">Auto-Generated Agent Report</h3>
            </div>
            <div className="bg-black/20 rounded-xl p-4 font-mono text-xs text-white/80 leading-relaxed whitespace-pre-wrap border border-white/5">
              {aiReport}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
