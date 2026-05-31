"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { MeshBackground } from "@/components/MeshBackground";
import { ChevronLeft, MapPin, Truck, Phone, Circle, CheckCircle2 } from "lucide-react";

const STATUSES = [
  { key: "assigned", label: "Driver Assigned", desc: "A driver has been assigned to your move" },
  { key: "on_the_way", label: "On the Way", desc: "Driver is heading to pickup location" },
  { key: "arrived", label: "Arrived", desc: "Driver has arrived at pickup" },
  { key: "completed", label: "Completed", desc: "Move completed successfully" },
];

export default function TrackingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  // Simulate status progression
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus((prev) => (prev < 3 ? prev + 1 : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (authLoading || !user) return null;

  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      <MeshBackground />
      
      <div className="relative z-10 max-w-lg lg:max-w-4xl mx-auto px-4 pt-6 pb-24 space-y-6">
        {/* Header */}
        <header className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2.5 rounded-2xl glass-light btn-tactile shadow-sm border border-white/50"
          >
            <ChevronLeft size={20} className="text-foreground-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display font-bold text-foreground-900 tracking-tight">Live Tracking</h1>
            <p className="text-xs text-surface-900/80 font-medium opacity-70">Order #MP-5829</p>
          </div>
        </header>

        {/* Map Visualization */}
        <section className="relative rounded-[2rem] overflow-hidden map-container animate-fade-in shadow-2xl shadow-brand-500/10 border border-white/40">
          <div className="bg-white/80 backdrop-blur-md h-64 relative">
            {/* Styled Map Background */}
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 35%, rgba(102, 102, 153, 0.08) 0%, transparent 50%),
                                radial-gradient(circle at 75% 65%, rgba(204, 102, 153, 0.08) 0%, transparent 50%),
                                radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.9) 0%, transparent 100%)`,
            }} />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `linear-gradient(#000 1px, transparent 1px),
                                linear-gradient(90deg, #000 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />

            {/* Pickup marker */}
            <div className="absolute left-[20%] top-[30%] flex flex-col items-center animate-bounce-in z-20">
              <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/40 border-2 border-white">
                <MapPin size={18} className="text-white" />
              </div>
              <div className="mt-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur shadow-sm border border-brand-100">
                <span className="text-[10px] text-brand-600 font-bold whitespace-nowrap uppercase tracking-wider">Pickup</span>
              </div>
            </div>

            {/* Drop marker */}
            <div className="absolute right-[18%] bottom-[25%] flex flex-col items-center animate-bounce-in z-20" style={{ animationDelay: "0.2s" }}>
              <div className="w-10 h-10 rounded-2xl bg-accent-500 flex items-center justify-center shadow-lg shadow-accent-500/40 border-2 border-white">
                <MapPin size={18} className="text-white" />
              </div>
              <div className="mt-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur shadow-sm border border-accent-100">
                <span className="text-[10px] text-accent-600 font-bold whitespace-nowrap uppercase tracking-wider">Drop-off</span>
              </div>
            </div>

            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 256" fill="none">
              <path 
                d="M 80 80 Q 200 60 330 180" 
                stroke="url(#routeGrad)" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray="1 10" 
                className="opacity-40"
              />
              <defs>
                <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Moving Truck */}
            <div
              className="absolute z-30 transition-all duration-[2000ms] ease-in-out"
              style={{
                left: `${20 + currentStatus * 18}%`,
                top: `${30 + currentStatus * 8}%`,
                transform: `translate(-50%, -50%) rotate(${currentStatus * 5}deg)`,
              }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-accent-400/20 rounded-full animate-ping opacity-75" />
                <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center shadow-xl shadow-accent-500/30 border-2 border-white">
                  <Truck size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Driver Details Card */}
        <div className="glass-light rounded-[2rem] p-5 flex items-center gap-4 animate-slide-up border border-white/60 shadow-xl shadow-black/5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white font-display font-bold text-xl shadow-inner-white border border-white/20">
              JD
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent-500 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-foreground-800">John Driver</p>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">
                <span className="w-1 h-1 rounded-full bg-amber-500" />
                4.9 ★
              </div>
            </div>
            <p className="text-xs text-surface-900/80 font-medium">Toyota HiAce • White • ABC-1234</p>
          </div>
          <a 
            href="tel:+1234567890"
            className="w-12 h-12 rounded-2xl bg-accent-50/80 border border-accent-100 flex items-center justify-center text-accent-600 btn-tactile hover:bg-accent-100 transition-all shadow-sm"
          >
            <Phone size={20} fill="currentColor" className="opacity-20 absolute" />
            <Phone size={20} className="relative z-10" />
          </a>
        </div>

        {/* Timeline Progress */}
        <div className="glass-light rounded-[2.5rem] p-6 animate-slide-up border border-white/60 shadow-xl shadow-black/5" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-foreground-800 uppercase tracking-widest opacity-60">Status Timeline</h3>
            <span className="text-[10px] bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full font-bold">LIVE UPDATE</span>
          </div>
          
          <div className="space-y-0">
            {STATUSES.map((s, i) => {
              const isDone = i <= currentStatus;
              const isCurrent = i === currentStatus;
              return (
                <div key={s.key} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500
                      ${isDone ? "bg-accent-500 shadow-lg shadow-accent-500/20" : "bg-foreground-100"}
                      ${isCurrent ? "scale-110 ring-4 ring-accent-100" : ""}
                    `}>
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-white" />
                      ) : (
                        <Circle size={12} className="text-foreground-300" />
                      )}
                    </div>
                    {i < STATUSES.length - 1 && (
                      <div className={`
                        w-0.5 h-10 my-1 transition-colors duration-500
                        ${isDone ? "bg-accent-500" : "bg-foreground-100"}
                      `} />
                    )}
                  </div>
                  <div className={`pb-6 transition-all duration-500 ${isCurrent ? "translate-x-1" : ""}`}>
                    <p className={`
                      text-sm font-bold transition-colors
                      ${isDone ? "text-foreground-800" : "text-foreground-400"}
                      ${isCurrent ? "text-accent-600" : ""}
                    `}>
                      {s.label}
                    </p>
                    <p className={`
                      text-xs mt-0.5 transition-colors
                      ${isDone ? "text-surface-900/80" : "text-foreground-300"}
                    `}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
