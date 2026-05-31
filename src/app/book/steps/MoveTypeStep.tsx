"use client";

import { useBooking } from "@/lib/booking-context";
import { Home, Building2, Package, Car, Check } from "lucide-react";

const MOVE_TYPES = [
  {
    id: "home",
    label: "Home Shifting",
    desc: "Household furniture & belongings",
    icon: Home,
    color: "from-brand-500 to-brand-700",
  },
  {
    id: "office",
    label: "Office Shifting",
    desc: "Workstations, equipment & files",
    icon: Building2,
    color: "from-brand-600 to-accent-500",
  },
  {
    id: "single",
    label: "Single Item",
    desc: "Move one or few items quickly",
    icon: Package,
    color: "from-accent-500 to-accent-700",
  },
  {
    id: "vehicle",
    label: "Vehicle Transport",
    desc: "Bike or car transportation",
    icon: Car,
    color: "from-brand-900 to-brand-700",
  },
];

export default function MoveTypeStep() {
  const { state, updateState } = useBooking();

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-display font-black text-surface-900 mb-1 uppercase tracking-tight">What are you moving?</h2>
        <p className="text-surface-900/80 text-sm font-medium tracking-wide">Select the category that best fits your move</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        {MOVE_TYPES.map(({ id, label, desc, icon: Icon, color }) => {
          const active = state.moveType === id;
          return (
            <button
              key={id}
              onClick={() => updateState({ moveType: id, items: [] })}
              className={`relative rounded-[2.5rem] p-6 lg:p-8 text-left transition-all duration-500 btn-tactile group ${
                active
                  ? `glass-light shadow-2xl shadow-brand-500/10 ring-2 ring-brand-500/30 bg-white/60`
                  : "glass-light opacity-70 hover:opacity-100 shadow-xl shadow-brand-500/5 hover:shadow-brand-500/10"
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-xl shadow-brand-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <Icon size={32} className="text-white" strokeWidth={2.5} />
              </div>
              
              <h3 className={`text-sm font-black uppercase tracking-[0.15em] mb-2 transition-colors duration-300 ${active ? 'text-brand-600' : 'text-surface-900'}`}>
                {label}
              </h3>
              
              <p className="text-[10px] text-surface-900/80 font-black leading-relaxed uppercase tracking-widest group-hover:text-surface-900/90 transition-colors">
                {desc}
              </p>
              
              {active && (
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-accent-500 shadow-lg shadow-accent-500/40 flex items-center justify-center animate-scale-in">
                  <Check size={18} strokeWidth={4} className="text-white" />
                </div>
              )}
              
              {!active && (
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full border-2 border-surface-200 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

