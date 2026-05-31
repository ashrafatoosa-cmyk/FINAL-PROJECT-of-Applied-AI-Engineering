"use client";

import { useBooking } from "@/lib/booking-context";
import { useState } from "react";
import { Ticket, Check, X, Tag, Sparkles } from "lucide-react";
import { validateCoupon } from "@/lib/pricing";

export default function DiscountStep() {
  const { state, updateState } = useBooking();
  const [code, setCode] = useState(state.couponCode);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const applyCoupon = () => {
    if (!code.trim()) return;
    const discount = validateCoupon(code.trim());
    if (discount) {
      updateState({ couponCode: code.trim().toUpperCase(), couponDiscount: discount });
      setMessage({ type: "success", text: `${discount}% discount applied!` });
    } else {
      updateState({ couponCode: "", couponDiscount: 0 });
      setMessage({ type: "error", text: "Invalid coupon code" });
    }
  };

  const removeCoupon = () => {
    setCode("");
    updateState({ couponCode: "", couponDiscount: 0 });
    setMessage(null);
  };

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h2 className="text-3xl font-display font-black text-surface-900 mb-1 tracking-tight">Discounts & Rewards</h2>
        <p className="text-surface-900/80 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Apply a coupon to unlock savings
        </p>
      </div>

      {/* Coupon Input Area */}
      <div className="glass-light shadow-2xl shadow-brand-500/10 border-brand-500/20 rounded-[2.5rem] p-8 space-y-6 animate-slide-up relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
        
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-900/80 flex items-center gap-2 px-1">
          <Ticket size={16} className="text-brand-500" strokeWidth={3} /> Redeem Voucher
        </label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder="ENTER PROMO CODE"
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setMessage(null); }}
              onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
              className="w-full !py-4.5 !rounded-2xl !px-6 !pr-12 shadow-xl shadow-brand-500/5 focus:shadow-brand-500/10 transition-all font-black tracking-[0.2em] uppercase placeholder:text-surface-900/80"
            />
            <Tag size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-500/30 group-focus-within:text-brand-500 transition-colors" strokeWidth={2.5} />
          </div>
          <button
            onClick={applyCoupon}
            className="px-10 py-4 sm:py-0 rounded-2xl bg-surface-900 text-white text-[10px] font-black uppercase tracking-widest btn-tactile shadow-2xl shadow-surface-900/20"
          >
            Apply
          </button>
        </div>

        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-scale-in border ${
            message.type === "success"
              ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20 shadow-lg shadow-emerald-500/5"
              : "bg-red-500/5 text-red-600 border-red-500/20 shadow-lg shadow-red-500/5"
          }`}>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${message.type === "success" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
              {message.type === "success" ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
            </div>
            {message.text}
          </div>
        )}
      </div>

      {/* Verified Reward Card */}
      {state.personalDetails.isVerified && (
        <div className="glass-light shadow-2xl shadow-brand-500/10 border-brand-500/30 rounded-[2.5rem] p-7 animate-bounce-in relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-30" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[1.5rem] bg-brand-500 text-white flex items-center justify-center shadow-2xl shadow-brand-500/40">
                <Sparkles size={32} strokeWidth={2.5} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-display font-black text-brand-700 tracking-tighter">VERIFIED REWARD</p>
                  <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-[8px] font-black text-brand-600 uppercase tracking-widest border border-brand-500/20">Applied</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500/60 mt-1">
                  Verified details unlocked 20% savings
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Bonus</p>
              <p className="text-2xl font-display font-black text-brand-500 tracking-tighter">-20%</p>
            </div>
          </div>
        </div>
      )}

      {/* Applied Active Coupon */}
      {state.couponDiscount > 0 && (
        <div className="glass-light shadow-2xl shadow-emerald-500/10 border-emerald-500/30 rounded-[2.5rem] p-7 animate-bounce-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-30" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                <Tag size={32} strokeWidth={2.5} className="rotate-90" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-display font-black text-emerald-700 tracking-tighter">{state.couponCode}</p>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[8px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-500/20">Active</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 mt-1">
                  Saved {state.couponDiscount}% on your move
                </p>
              </div>
            </div>
            <button 
              onClick={removeCoupon} 
              className="w-12 h-12 rounded-2xl bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all btn-tactile shadow-lg shadow-emerald-500/10 border border-emerald-500/10 group flex items-center justify-center"
            >
              <X size={20} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Available Rewards */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-900/80 mb-5 flex items-center gap-2 px-1">
          <Sparkles size={16} className="text-amber-500" strokeWidth={3} /> Personalized Offers
        </h3>
        <div className="grid gap-3">
          {[
            { code: "FIRST20", desc: "Welcome Bonus", sub: "For your first booking", pct: 20 },
            { code: "SAVE15", desc: "Seasonal Saver", sub: "Peak season promotion", pct: 15 },
            { code: "MOVE10", desc: "Local Explorer", sub: "Community special", pct: 10 },
          ].map((offer, idx) => (
            <button
              key={offer.code}
              onClick={() => { setCode(offer.code); updateState({ couponCode: offer.code, couponDiscount: offer.pct }); setMessage({ type: "success", text: `${offer.pct}% discount applied!` }); }}
              className="w-full flex items-center justify-between p-6 rounded-[2rem] glass-light border-brand-500/10 hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 group btn-tactile relative overflow-hidden"
            >
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-brand-500/5 border border-brand-500/10 group-hover:bg-brand-500 group-hover:border-brand-500 transition-all duration-500">
                  <span className="text-[8px] font-black text-brand-500/60 uppercase tracking-widest group-hover:text-white/60">PROMO</span>
                  <span className="text-xs font-black text-brand-600 transition-colors group-hover:text-white">{offer.code}</span>
                </div>
                <div className="text-left">
                  <span className="block text-sm font-black text-surface-900 uppercase tracking-[0.1em]">{offer.desc}</span>
                  <span className="block text-[9px] font-bold text-surface-900/80 uppercase tracking-widest mt-0.5">{offer.sub}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-xl font-display font-black text-brand-500 tracking-tighter group-hover:scale-110 transition-transform">
                  {offer.pct}% <span className="text-[10px] text-surface-900/80 group-hover:text-brand-500/30">OFF</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-brand-500/5 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-lg group-hover:shadow-brand-500/30">
                  <Check size={12} strokeWidth={4} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
