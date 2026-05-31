"use client";

import { useBooking } from "@/lib/booking-context";
import { Package, PackageOpen, Truck, Shield, Zap } from "lucide-react";

const SERVICES = [
  { key: "packing" as const, label: "Packing Service", desc: "Professional packing of all items", icon: Package, color: "text-blue-500" },
  { key: "unpacking" as const, label: "Unpacking Service", desc: "Unpack & arrange at destination", icon: PackageOpen, color: "text-purple-500" },
  { key: "loading" as const, label: "Loading / Unloading", desc: "Included by default", icon: Truck, color: "text-emerald-500" },
  { key: "insurance" as const, label: "Insurance Coverage", desc: "Protect against damage", icon: Shield, color: "text-amber-500" },
  { key: "express" as const, label: "Express Delivery", desc: "Priority handling & faster delivery", icon: Zap, color: "text-brand-500" },
];

export default function ServicesStep() {
  const { state, updateState } = useBooking();

  const toggle = (key: keyof typeof state.services) => {
    updateState({
      services: { ...state.services, [key]: !state.services[key] },
    });
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-display font-black text-surface-900 mb-1 tracking-tight">Service Options</h2>
        <p className="text-surface-900/80 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Customize your experience
        </p>
      </div>

      <div className="grid gap-3">
        {SERVICES.map(({ key, label, desc, icon: Icon, color }, idx) => {
          const active = state.services[key];
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`w-full flex items-center gap-5 p-6 rounded-[2.5rem] transition-all duration-500 btn-tactile group relative overflow-hidden animate-slide-up ${
                active
                  ? "glass-light border-brand-500/20 shadow-2xl shadow-brand-500/10 scale-[1.01]"
                  : "glass-light border-brand-500/5 hover:border-brand-500/10 shadow-sm"
              }`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-transparent opacity-50" />
              )}
              
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 relative z-10 ${active ? "bg-brand-500 text-white shadow-2xl shadow-brand-500/40" : "bg-brand-500/5 text-surface-900/80 group-hover:bg-brand-500/10"}`}>
                <Icon size={28} strokeWidth={active ? 3 : 2} className={active ? "text-white" : color} />
              </div>

              <div className="flex-1 text-left relative z-10">
                <p className={`text-sm font-black uppercase tracking-[0.2em] ${active ? "text-brand-600" : "text-surface-900"}`}>{label}</p>
                <p className={`text-[10px] font-bold mt-1 ${active ? "text-brand-500/60" : "text-surface-900/80"}`}>{desc}</p>
              </div>

              <div className={`w-14 h-7 rounded-full transition-all duration-500 relative z-10 border-2 ${active ? "bg-brand-500 border-brand-500 shadow-lg shadow-brand-500/30" : "bg-surface-900/5 border-transparent"}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-500 shadow-sm ${active ? "translate-x-7 scale-110" : "translate-x-0"}`} />
              </div>
            </button>
          );
        })}
      </div>

      {state.services.express && (
        <div className="glass-light shadow-2xl shadow-brand-500/5 border-brand-500/10 rounded-[2rem] p-6 animate-scale-in flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/30 relative z-10">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600 mb-1">Express Priority Active</p>
            <p className="text-[9px] font-bold text-surface-900/80 leading-relaxed uppercase tracking-widest">
              30% Surcharge applied for priority handling
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
