"use client";

import { useBooking } from "@/lib/booking-context";
import { Calendar, Clock, Zap, Sun, CloudSun, Moon } from "lucide-react";

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "8 AM – 12 PM", icon: Sun, color: "text-amber-500" },
  { id: "afternoon", label: "Afternoon", time: "12 PM – 5 PM", icon: CloudSun, color: "text-orange-500" },
  { id: "evening", label: "Evening", time: "5 PM – 9 PM", icon: Moon, color: "text-indigo-500" },
];

export default function ScheduleStep() {
  const { state, updateState } = useBooking();

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-display font-black text-surface-900 mb-1 tracking-tight">Schedule Your Move</h2>
        <p className="text-surface-900/80 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Pick a date and preferred time
        </p>
      </div>

      {/* Date */}
      <div className="space-y-3 animate-slide-up">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-900/80 flex items-center gap-2 px-1">
          <Calendar size={16} className="text-brand-500" strokeWidth={3} /> Select Move Date
        </label>
        <div className="glass-light p-2 rounded-[2rem] border-brand-500/10 shadow-xl shadow-brand-500/5">
          <input
            type="date"
            min={today}
            value={state.schedule.date}
            onChange={(e) => updateState({ schedule: { ...state.schedule, date: e.target.value } })}
            className="w-full !bg-transparent !border-0 !shadow-none !py-4 font-black text-surface-900 focus:ring-0 px-6 uppercase tracking-widest text-sm"
          />
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-900/80 flex items-center gap-2 px-1">
          <Clock size={16} className="text-brand-500" strokeWidth={3} /> Arrival Window
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TIME_SLOTS.map(({ id, label, time, icon: Icon, color }) => {
            const active = state.schedule.timeSlot === id;
            return (
              <button
                key={id}
                onClick={() => updateState({ schedule: { ...state.schedule, timeSlot: id } })}
                className={`rounded-[2.5rem] p-6 text-center transition-all duration-500 btn-tactile group relative overflow-hidden ${
                  active 
                    ? "glass-light border-brand-500/20 shadow-2xl shadow-brand-500/10 scale-[1.02]" 
                    : "glass-light border-brand-500/5 hover:border-brand-500/10 shadow-sm"
                }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent" />
                )}
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-500 relative z-10 ${active ? 'bg-brand-500 text-white shadow-2xl shadow-brand-500/40' : 'bg-brand-500/5 text-surface-900/80 group-hover:bg-brand-500/10'}`}>
                  <Icon size={28} strokeWidth={active ? 3 : 2} />
                </div>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 relative z-10 ${active ? "text-brand-600" : "text-surface-900"}`}>{label}</p>
                <p className={`text-[9px] font-bold relative z-10 tracking-widest uppercase ${active ? "text-brand-500/60" : "text-surface-900/80"}`}>{time}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Urgent */}
      <div className={`flex items-center justify-between p-7 rounded-[2.5rem] transition-all duration-500 animate-slide-up group relative overflow-hidden ${
        state.schedule.urgent 
          ? "glass-light border-brand-500/20 shadow-2xl shadow-brand-500/10 scale-[1.01]" 
          : "glass-light border-brand-500/5 shadow-sm hover:border-brand-500/10"
      }`} style={{ animationDelay: '0.2s' }}>
        {state.schedule.urgent && (
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-transparent" />
        )}
        <div className="flex items-center gap-5 relative z-10">
          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${state.schedule.urgent ? "bg-brand-500 text-white shadow-2xl shadow-brand-500/40" : "bg-brand-500/5 text-brand-500"}`}>
            <Zap size={28} strokeWidth={3} className={state.schedule.urgent ? "animate-pulse" : ""} />
          </div>
          <div>
            <p className={`text-sm font-black uppercase tracking-[0.2em] ${state.schedule.urgent ? "text-brand-600" : "text-surface-900"}`}>Urgent Booking</p>
            <p className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${state.schedule.urgent ? "text-brand-500/60" : "text-surface-900/80"}`}>Sameday / Next Day priority</p>
          </div>
        </div>
        <div 
          onClick={() => updateState({ schedule: { ...state.schedule, urgent: !state.schedule.urgent } })} 
          className={`w-14 h-7 rounded-full transition-all duration-500 relative cursor-pointer z-10 border-2 ${state.schedule.urgent ? "bg-brand-500 border-brand-500 shadow-lg shadow-brand-500/30" : "bg-surface-900/5 border-transparent"}`}
        >
          <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-500 shadow-sm ${state.schedule.urgent ? "translate-x-7 scale-110" : "translate-x-0"}`} />
        </div>
      </div>
    </div>
  );
}
