"use client";

import { useBooking } from "@/lib/booking-context";
import { Building, ArrowUpDown, ParkingCircle, AlertTriangle, Minus, Plus } from "lucide-react";

export default function PropertyStep() {
  const { state, updateState } = useBooking();
  const pd = state.propertyDetails;

  const update = (patch: Partial<typeof pd>) => {
    updateState({ propertyDetails: { ...pd, ...patch } });
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-display font-black text-surface-900 mb-1 tracking-tight">Property Details</h2>
        <p className="text-surface-900/90 text-xs font-black uppercase tracking-widest">Help us prepare for building access</p>
      </div>

      {/* Pickup Property */}
      <div className="glass-light shadow-xl shadow-brand-500/5 border-brand-500/10 rounded-[2.5rem] p-7 space-y-7">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-900/80 mb-1">Building Detail</span>
            <h3 className="text-sm font-black text-brand-600 flex items-center gap-2">
              <Building size={16} strokeWidth={3} /> Pickup Property
            </h3>
          </div>
          <div className="flex items-center gap-3 bg-white shadow-sm p-1.5 rounded-2xl border border-brand-500/5">
            <button onClick={() => update({ pickupFloor: Math.max(0, pd.pickupFloor - 1) })} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all btn-tactile ${pd.pickupFloor > 0 ? "bg-surface-900 text-white shadow-lg shadow-surface-900/20" : "bg-surface-900/5 text-surface-900/80"}`}><Minus size={20} strokeWidth={3} /></button>
            <div className="w-10 flex flex-col items-center">
              <span className="text-xs font-black text-brand-500">{pd.pickupFloor}</span>
              <span className="text-[8px] font-black text-surface-900/80 uppercase tracking-tighter">Floor</span>
            </div>
            <button onClick={() => update({ pickupFloor: pd.pickupFloor + 1 })} className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center btn-tactile shadow-lg shadow-brand-500/30"><Plus size={20} strokeWidth={3} /></button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-2x bg-white/40 border border-brand-500/5 rounded-2xl">
          <span className="text-sm font-bold text-surface-900 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <ArrowUpDown size={16} strokeWidth={2.5} className="text-brand-500" />
            </div>
            Lift Available?
          </span>
          <div 
            onClick={() => update({ pickupLift: !pd.pickupLift })} 
            className={`w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer shadow-inner ${pd.pickupLift ? "bg-brand-500" : "bg-surface-900/10"}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${pd.pickupLift ? "translate-x-6" : "translate-x-0"}`} />
          </div>
        </div>
      </div>

      {/* Drop Property */}
      <div className="glass-light shadow-xl shadow-brand-500/5 border-brand-500/10 rounded-[2.5rem] p-7 space-y-7">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-900/80 mb-1">Building Detail</span>
            <h3 className="text-sm font-black text-accent-600 flex items-center gap-2">
              <Building size={16} strokeWidth={3} /> Drop-off Property
            </h3>
          </div>
          <div className="flex items-center gap-3 bg-white shadow-sm p-1.5 rounded-2xl border border-brand-500/5">
            <button onClick={() => update({ dropFloor: Math.max(0, pd.dropFloor - 1) })} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all btn-tactile ${pd.dropFloor > 0 ? "bg-surface-900 text-white shadow-lg shadow-surface-900/20" : "bg-surface-900/5 text-surface-900/80"}`}><Minus size={20} strokeWidth={3} /></button>
            <div className="w-10 flex flex-col items-center">
              <span className="text-xs font-black text-brand-500">{pd.dropFloor}</span>
              <span className="text-[8px] font-black text-surface-900/80 uppercase tracking-tighter">Floor</span>
            </div>
            <button onClick={() => update({ dropFloor: pd.dropFloor + 1 })} className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center btn-tactile shadow-lg shadow-brand-500/30"><Plus size={20} strokeWidth={3} /></button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-2x bg-white/40 border border-brand-500/5 rounded-2xl">
          <span className="text-sm font-bold text-surface-900 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center">
              <ArrowUpDown size={16} strokeWidth={2.5} className="text-accent-500" />
            </div>
            Lift Available?
          </span>
          <div 
            onClick={() => update({ dropLift: !pd.dropLift })} 
            className={`w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer shadow-inner ${pd.dropLift ? "bg-brand-500" : "bg-surface-900/10"}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${pd.dropLift ? "translate-x-6" : "translate-x-0"}`} />
          </div>
        </div>
      </div>

      {/* Additional */}
      <div className="glass-light shadow-xl shadow-brand-500/5 border-brand-500/10 rounded-[2.5rem] p-7 space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-900/80 flex items-center gap-2 px-1">
            <ParkingCircle size={14} strokeWidth={3} className="text-brand-500" /> Distance from parking
          </label>
          <input
            type="text"
            placeholder="e.g., 50 meters"
            value={pd.parkingDistance}
            onChange={(e) => update({ parkingDistance: e.target.value })}
            className="!py-4.5 !rounded-2xl shadow-xl shadow-brand-500/5 focus:shadow-brand-500/10 transition-all font-bold"
          />
        </div>
        <div className="flex items-center justify-between p-4 rounded-2x bg-amber-500/5 border border-amber-500/10 rounded-2xl">
          <span className="text-sm font-bold text-surface-900 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle size={18} strokeWidth={2.5} className="text-amber-500" />
            </div>
            Narrow Street Access?
          </span>
          <div 
            onClick={() => update({ narrowStreet: !pd.narrowStreet })} 
            className={`w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer shadow-inner ${pd.narrowStreet ? "bg-brand-500" : "bg-surface-900/10"}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${pd.narrowStreet ? "translate-x-6" : "translate-x-0"}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
