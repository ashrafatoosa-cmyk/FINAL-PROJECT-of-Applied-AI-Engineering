"use client";

import { useBooking } from "@/lib/booking-context";
import { MapPin, Navigation, ArrowDown, Route, Clock, Ruler } from "lucide-react";
import { useState } from "react";

const SAMPLE_ADDRESSES = [
  { address: "Helsinki Central Station, Finland", lat: 60.1710, lng: 24.9410 },
  { address: "Espoo City Centre, Finland", lat: 60.2055, lng: 24.6559 },
  { address: "Tampere Railway Station, Finland", lat: 61.4978, lng: 23.7610 },
  { address: "Turku Market Square, Finland", lat: 60.4518, lng: 22.2666 },
  { address: "Vantaa Tikkurila, Finland", lat: 60.2921, lng: 25.0444 },
  { address: "Jyväskylä Centre, Finland", lat: 62.2426, lng: 25.7473 },
];

function calculateMockDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function LocationStep() {
  const { state, updateState } = useBooking();
  const [pickupQuery, setPickupQuery] = useState(state.pickup.address);
  const [dropQuery, setDropQuery] = useState(state.drop.address);
  const [pickupResults, setPickupResults] = useState<typeof SAMPLE_ADDRESSES>([]);
  const [dropResults, setDropResults] = useState<typeof SAMPLE_ADDRESSES>([]);

  const search = (query: string) =>
    SAMPLE_ADDRESSES.filter((a) => a.address.toLowerCase().includes(query.toLowerCase()));

  const selectPickup = (addr: typeof SAMPLE_ADDRESSES[0]) => {
    setPickupQuery(addr.address);
    setPickupResults([]);
    const pickup = { address: addr.address, lat: addr.lat, lng: addr.lng };
    updateState({ pickup });
    if (state.drop.lat) {
      const d = calculateMockDistance(addr.lat, addr.lng, state.drop.lat, state.drop.lng);
      updateState({ pickup, distance: Math.round(d * 10) / 10, duration: Math.round(d * 1.5) });
    }
  };

  const selectDrop = (addr: typeof SAMPLE_ADDRESSES[0]) => {
    setDropQuery(addr.address);
    setDropResults([]);
    const drop = { address: addr.address, lat: addr.lat, lng: addr.lng };
    updateState({ drop });
    if (state.pickup.lat) {
      const d = calculateMockDistance(state.pickup.lat, state.pickup.lng, addr.lat, addr.lng);
      updateState({ drop, distance: Math.round(d * 10) / 10, duration: Math.round(d * 1.5) });
    }
  };

  const useCurrentLocation = () => {
    const loc = SAMPLE_ADDRESSES[0];
    selectPickup(loc);
  };

  return (
    <div className="space-y-8">
      <div className="animate-fade-in text-center sm:text-left">
        <h2 className="text-3xl font-display font-black text-surface-900 mb-1 uppercase tracking-tight">Where are you moving?</h2>
        <p className="text-surface-900/80 text-sm font-medium tracking-wide">Enter your pickup and destination details</p>
      </div>

      {/* Pickup */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-900/80 flex items-center gap-2 px-1">
          <MapPin size={14} className="text-brand-500" strokeWidth={3} /> Pickup Location
        </label>
        <div className="relative group">
          <input
            type="text"
            placeholder="Search pickup address..."
            value={pickupQuery}
            onChange={(e) => { setPickupQuery(e.target.value); setPickupResults(search(e.target.value)); }}
            className="w-full bg-white border border-surface-200 rounded-2xl py-4.5 pl-4 pr-12 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
          />
          <button
            onClick={useCurrentLocation}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-brand-500/5 text-brand-500 hover:bg-brand-500 hover:text-white transition-all duration-300 flex items-center justify-center btn-tactile"
            title="Use current location"
          >
            <Navigation size={18} strokeWidth={2.5} />
          </button>
        </div>
        {pickupResults.length > 0 && (
          <div className="glass-light rounded-2xl overflow-hidden divide-y divide-surface-100 shadow-2xl animate-slide-up mt-2 border border-surface-200/50">
            {pickupResults.map((r) => (
              <button
                key={r.address}
                onClick={() => selectPickup(r)}
                className="w-full text-left px-4 py-4 text-sm font-bold text-surface-900/90 hover:bg-brand-500 hover:text-white flex items-center gap-3 transition-all group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-500/5 flex items-center justify-center shrink-0 group-hover/item:bg-white/20">
                  <MapPin size={14} className="text-brand-500 group-hover/item:text-white" strokeWidth={2.5} />
                </div>
                {r.address}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <div className="flex justify-center -my-3 relative z-10">
        <div className="w-12 h-12 rounded-full bg-white shadow-2xl shadow-brand-500/20 border border-surface-100 flex items-center justify-center group">
          <ArrowDown size={20} strokeWidth={3} className="text-brand-500 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* Drop */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-900/80 flex items-center gap-2 px-1">
          <MapPin size={14} className="text-accent-500" strokeWidth={3} /> Drop-off Location
        </label>
        <input
          type="text"
          placeholder="Search drop-off address..."
          value={dropQuery}
          onChange={(e) => { setDropQuery(e.target.value); setDropResults(search(e.target.value)); }}
          className="w-full bg-white border border-surface-200 rounded-2xl py-4.5 px-4 text-surface-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all font-bold placeholder:text-surface-300"
        />
        {dropResults.length > 0 && (
          <div className="glass-light rounded-2xl overflow-hidden divide-y divide-surface-100 shadow-2xl animate-slide-up mt-2 border border-surface-200/50">
            {dropResults.map((r) => (
              <button
                key={r.address}
                onClick={() => selectDrop(r)}
                className="w-full text-left px-4 py-4 text-sm font-bold text-surface-900/90 hover:bg-accent-500 hover:text-white flex items-center gap-3 transition-all group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-500/5 flex items-center justify-center shrink-0 group-hover/item:bg-white/20">
                  <MapPin size={14} className="text-accent-500 group-hover/item:text-white" strokeWidth={2.5} />
                </div>
                {r.address}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Preview (Mock) */}
      {state.pickup.lat > 0 && state.drop.lat > 0 && (
        <div className="animate-scale-in pt-4">
          <div className="bg-brand-50/50 h-64 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden border border-surface-200 shadow-inner">
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, rgba(99,102,241,0.1) 0%, transparent 60%),
                                radial-gradient(circle at 70% 60%, rgba(20,184,166,0.1) 0%, transparent 60%)`,
            }} />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-[2rem] glass flex items-center justify-center shadow-2xl border-white">
                <Route size={32} className="text-brand-500" strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-900/80">Optimized Route</p>
            </div>
            
            {/* Route dots */}
            <div className="absolute left-[25%] top-[35%] w-5 h-5 rounded-full bg-brand-600 shadow-2xl shadow-brand-500/50 flex items-center justify-center z-20">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
            <div className="absolute left-[72%] top-[58%] w-5 h-5 rounded-full bg-accent-500 shadow-2xl shadow-accent-500/50 flex items-center justify-center z-20">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <path 
                d="M 25% 35% Q 50% 20% 72% 58%" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeDasharray="8 8" 
                className="text-brand-500"
              />
            </svg>
            <div className="absolute left-[26%] top-[37%] w-[48%] h-1 bg-gradient-to-r from-brand-500 to-accent-500 origin-left rotate-14 rounded-full blur-sm opacity-50" />
          </div>
        </div>
      )}

      {/* Distance info */}
      {state.distance > 0 && (
        <div className="flex gap-4 animate-scale-in">
          <div className="flex-1 glass rounded-[2.5rem] p-8 text-center border-surface-200/50 shadow-2xl shadow-brand-500/5 hover:shadow-brand-500/10 transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/5 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Ruler size={28} className="text-brand-500" strokeWidth={2.5} />
            </div>
            <p className="text-3xl font-display font-black text-surface-900 tracking-tight">{state.distance} km</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-900/80 mt-1.5">Total Distance</p>
          </div>
          <div className="flex-1 glass rounded-[2.5rem] p-8 text-center border-surface-200/50 shadow-2xl shadow-brand-500/5 hover:shadow-brand-500/10 transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-accent-500/5 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Clock size={28} className="text-accent-500" strokeWidth={2.5} />
            </div>
            <p className="text-3xl font-display font-black text-surface-900 tracking-tight">{state.duration} min</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-900/80 mt-1.5">Est. Duration</p>
          </div>
        </div>
      )}
    </div>
  );
}

