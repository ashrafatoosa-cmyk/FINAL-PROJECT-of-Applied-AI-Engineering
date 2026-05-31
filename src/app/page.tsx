"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getBookings, BookingData } from "@/lib/firestore";
import {
  Truck, MapPin, Clock, ChevronRight, Sparkles, PackagePlus,
  RotateCcw, ArrowRight, Shield, Star, Zap, Scan, Camera, Box,
  TrendingUp, HardDrive, History
} from "lucide-react";
import { useBooking } from "@/lib/booking-context";
import { analyzeInventory } from "@/app/actions/ai-scan";
import { useRef } from "react";
import { MeshBackground } from "@/components/MeshBackground";
import CameraScan from "@/components/CameraScan";

import { LandingPage } from "@/components/LandingPage";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  confirmed: "bg-accent-500/10 text-accent-700 border-accent-500/20",
  in_progress: "bg-brand-500/10 text-brand-700 border-brand-500/20",
  completed: "bg-success-500/10 text-success-700 border-success-500/20",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { updateState } = useBooking();
  const router = useRouter();
  const [bookings, setBookings] = useState<(BookingData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [aiStats, setAiStats] = useState({ items: 0, volume: 0, fragile: 0 });

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("ai_insights") || '{"items":0, "volume":0, "fragile":0}');
    setAiStats(stats);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanProgress("Analyzing your space...");

    try {
      const reader = new FileReader();
      const fileDataPromise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const fileData = await fileDataPromise;
      const result = await analyzeInventory(fileData, file.type);
      
      if (result.items) {
        updateState({ 
          items: result.items.map((i: any) => ({
            category: i.category || "Furniture",
            name: i.name,
            quantity: i.quantity,
            isFragile: i.isFragile,
            volume: i.m3
          })),
          aiEstimatedVolume: result.totalVolume,
          step: 3 // Jump to Inventory step
        });
        router.push("/book");
      }
    } catch (error: any) {
      alert(error.message || "Failed to scan room");
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (user) {
      getBookings(user.uid).then(setBookings).catch(console.error).finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="w-10 h-10 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const activeBookings = bookings.filter((b) => ["pending", "confirmed", "in_progress"].includes(b.status));
  const pastBookings = bookings.filter((b) => ["completed", "cancelled"].includes(b.status)).slice(0, 3);

  return (
    <div className="min-h-[100dvh] relative pb-32 lg:pb-10 overflow-hidden">
      {/* Attractive Background matching branding */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-accent-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[70%] h-[70%] bg-brand-400/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-brand-500/5 backdrop-blur-[1px]" />
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 pt-6 lg:pt-10 space-y-12 relative z-10">

        {/* Dashboard Content */}
        <div className="flex flex-col gap-8">
          {/* Left Column: Primary Stats & Operations */}
          <div className="flex flex-col gap-8 space-y-0 order-2">
            {/* AI Pulse - Premium Insights Widget */}
            <section className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
              <div className="glass-light shadow-2xl shadow-brand-800/5 rounded-[3rem] p-8 lg:p-10 border-brand-500/20 relative overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-accent-500/5 rounded-full blur-3xl transition-opacity group-hover:opacity-100"></div>
                
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-2xl shadow-brand-800/30">
                      <Sparkles size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-surface-900 uppercase tracking-widest leading-none">AI CORE</h2>
                      <p className="text-[10px] text-accent-500/60 font-black uppercase tracking-[0.2em] mt-1.5">Neural Statistics</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20"></div>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Sys Level Alpha</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 lg:gap-8">
                  {[
                    { label: "Cargo Volume", value: aiStats.volume.toFixed(1), unit: "m³", color: "text-brand-600" },
                    { label: "Detected Units", value: aiStats.items, unit: "pts", color: "text-surface-900" },
                    { label: "Fragile Risk", value: aiStats.fragile, unit: "lvl", color: "text-accent-500" },
                  ].map((stat) => (
                    <div key={stat.label} className="space-y-2">
                      <p className="text-[9px] text-surface-900/80 uppercase font-black tracking-[0.2em]">{stat.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl lg:text-3xl font-display font-black tracking-tighter ${stat.color}`}>{stat.value}</span>
                        <span className="text-[8px] text-surface-300 font-bold uppercase">{stat.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 pt-8 border-t border-brand-500/10 flex items-center justify-between">
                  <span className="text-[9px] font-black text-surface-900/80 uppercase tracking-[0.3em]">Fleet Optimization</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className={`w-4 h-1.5 rounded-full transition-all duration-500 ${i <= 5 ? 'bg-accent-500 shadow-[0_0_8px_rgba(20,184,166,0.4)]' : 'bg-brand-500/10'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Active Operations - Modern List */}
            {activeBookings.length > 0 ? (
              <section className="animate-slide-up space-y-8" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-6 bg-accent-500 rounded-full"></div>
                    <h2 className="text-base font-black text-surface-900 uppercase tracking-[0.2em]">Active Logistics</h2>
                  </div>
                  <button 
                    onClick={() => router.push("/bookings")} 
                    className="text-brand-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:translate-x-1 transition-transform"
                  >
                    Full Fleet Registry <ChevronRight size={16} strokeWidth={3} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {activeBookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => router.push(`/bookings`)}
                      className="glass-light border border-brand-500/20 rounded-[3rem] p-6 lg:p-8 cursor-pointer hover:border-brand-500/40 transition-all relative overflow-hidden group shadow-2xl shadow-brand-800/10"
                    >
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className={`px-5 py-2 rounded-full border text-[9px] font-black tracking-[0.2em] uppercase shadow-sm ${STATUS_COLORS[b.status]}`}>
                          {b.status.replace("_", " ")}
                        </div>
                        <span className="text-[10px] font-black text-surface-300 uppercase tracking-widest">#{b.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                      
                      <div className="space-y-6 flex-1 relative z-10">
                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-800/20">
                            <MapPin size={20} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[9px] uppercase font-black text-surface-900/80 tracking-[0.2em] mb-1">Current Sector</p>
                            <p className="text-sm text-surface-900 font-black leading-tight line-clamp-1">{b.pickup.address || "Sector Unassigned"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 pt-8 border-t border-brand-500/10 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-500/5 flex items-center justify-center text-brand-500">
                            <Clock size={18} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-[9px] text-surface-900/80 font-black uppercase tracking-widest">ETA Window</p>
                            <p className="text-[10px] font-black text-surface-900 uppercase tracking-widest">{b.schedule?.date || "STANDBY"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-surface-900/80 font-black uppercase tracking-widest mb-1">Contract Value</p>
                          <p className="text-3xl font-display font-black text-surface-900 tracking-tighter">€{b.price?.total?.toFixed(0)}</p>
                        </div>
                      </div>

                      <div className="absolute top-0 right-0 w-40 h-40 bg-accent-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-accent-500/10 transition-colors"></div>
                    </div>
                  ))}
                </div>
              </section>
            ) : !loading && (
              <div className="text-center py-20 animate-fade-in space-y-8 glass-light rounded-[3rem] border border-brand-500/10">
                <div className="relative inline-block scale-110">
                  <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-20 scale-150 animate-pulse"></div>
                  <div className="w-32 h-32 rounded-[3.5rem] bg-white flex items-center justify-center mx-auto relative border border-brand-500/10 shadow-2xl">
                    <Truck size={56} className="text-brand-500" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-surface-900 uppercase tracking-tighter">Operation Ready</h3>
                  <p className="text-surface-900/90 text-[10px] font-black uppercase tracking-[0.2em] max-w-[240px] mx-auto leading-relaxed px-4">
                    Logistics network is currently idle. Initiate first procedure to begin life operations.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Deployment Controls */}
          <div className="flex flex-col gap-8 space-y-0 order-1">
            <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>

              <button 
                onClick={() => setShowCamera(true)}
                className="w-full group relative overflow-hidden rounded-[3rem] bg-white border-2 border-brand-500/20 p-8 lg:p-10 cursor-pointer btn-tactile hover:border-brand-500/50 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)] text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-8 relative z-10">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2rem] lg:rounded-[2.5rem] bg-brand-500 text-white flex items-center justify-center shadow-[0_20px_40px_rgba(15,23,42,0.3)] group-hover:scale-110 transition-transform duration-700 relative">
                    <Camera size={36} strokeWidth={2.5} className="lg:w-11 lg:h-11" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl bg-white shadow-xl flex items-center justify-center border border-brand-500/10">
                      <Scan size={18} className="text-accent-500 lg:w-[22px] lg:h-[22px]" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl lg:text-3xl font-black text-surface-900 tracking-tighter uppercase leading-none">Vision<br />AI</h3>
                      <div className="px-3 py-1 rounded-full bg-accent-600 text-[8px] font-black text-white uppercase tracking-widest shadow-lg shadow-accent-500/20">Pro</div>
                    </div>
                    <p className="text-surface-900/90 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                      Neural Spatial Mapping
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-brand-500/5 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500 shrink-0 shadow-inner">
                    <ArrowRight size={24} strokeWidth={3} />
                  </div>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-4 lg:gap-6 mt-6">
                <button
                  onClick={() => router.push("/book")}
                  className="group glass-light rounded-[2.5rem] p-6 lg:p-8 text-left btn-tactile hover:bg-white transition-all shadow-xl shadow-brand-800/5 border-brand-500/10 hover:border-brand-500/30"
                >
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-brand-500/5 flex items-center justify-center mb-6 text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500 shadow-inner">
                    <PackagePlus size={24} strokeWidth={2.5} className="lg:w-7 lg:h-7" />
                  </div>
                  <h4 className="text-[11px] lg:text-sm font-black text-surface-900 mb-1 uppercase tracking-widest">Manual</h4>
                  <p className="text-[8px] lg:text-[9px] text-surface-900/80 font-black uppercase tracking-wider">Direct Entry</p>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group glass-light rounded-[2.5rem] p-6 lg:p-8 text-left btn-tactile hover:bg-white transition-all shadow-xl shadow-brand-800/5 border-brand-500/10 hover:border-brand-500/30"
                >
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-brand-500/5 flex items-center justify-center mb-6 text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500 shadow-inner">
                    <Box size={24} strokeWidth={2.5} className="lg:w-7 lg:h-7" />
                  </div>
                  <h4 className="text-[11px] lg:text-sm font-black text-surface-900 mb-1 uppercase tracking-widest">Vault</h4>
                  <p className="text-[8px] lg:text-[9px] text-surface-900/80 font-black uppercase tracking-wider">Media Files</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" className="hidden" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Camera Overlay */}
      {showCamera && <CameraScan onClose={() => setShowCamera(false)} />}
      
      {/* Modern Scanning Modal */}
      {isScanning && !showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/60 backdrop-blur-xl animate-fade-in">
          <div className="glass shadow-2xl border-brand-500/20 max-w-sm w-full p-12 rounded-[3rem] text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-500/5">
              <div className="h-full bg-brand-500 animate-progress-indefinite shadow-[0_0_20px_rgba(204,102,153,0.5)]"></div>
            </div>
            
            <div className="relative mx-auto w-28 h-28">
              <div className="absolute inset-0 rounded-full border-2 border-brand-500/10"></div>
              <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center shadow-2xl shadow-brand-500/40">
                  <Sparkles size={40} className="text-white animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3 relative z-10">
              <h3 className="text-2xl font-display font-black text-surface-900 tracking-tight uppercase">Vision Engine</h3>
              <p className="text-brand-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">{scanProgress}</p>
              <p className="text-surface-900/90 text-[10px] font-bold uppercase tracking-widest mt-4">Analyzing Spatial Depth & Volume</p>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-500 opacity-[0.03] blur-3xl"></div>
          </div>
        </div>
      )}
    </div>
  );
}
