"use client";

import { useBooking } from "@/lib/booking-context";
import { calculatePrice } from "@/lib/pricing";
import { useMemo } from "react";
import {
  Receipt, Truck, Route, Package, PackageOpen, Shield, Building,
  Zap, Calculator, TrendingDown
} from "lucide-react";

const BREAKDOWN_ITEMS = [
  { key: "baseFare", label: "Base Fare", icon: Truck },
  { key: "distanceCost", label: "Distance Cost", icon: Route },
  { key: "itemHandling", label: "Item Handling", icon: Package },
  { key: "packingCost", label: "Packing Service", icon: PackageOpen },
  { key: "unpackingCost", label: "Unpacking Service", icon: PackageOpen },
  { key: "insuranceCost", label: "Insurance", icon: Shield },
  { key: "floorCharge", label: "Floor Charges", icon: Building },
  { key: "expressSurcharge", label: "Express Surcharge", icon: Zap },
  { key: "taxes", label: "Taxes (8%)", icon: Calculator },
] as const;

export default function PricingStep() {
  const { state } = useBooking();

  const price = useMemo(() => calculatePrice({
    distance: state.distance || 10,
    items: state.items,
    moveType: state.moveType,
    services: {
      packing: state.services.packing,
      unpacking: state.services.unpacking,
      insurance: state.services.insurance,
      express: state.services.express,
    },
    pickup: { floor: state.propertyDetails.pickupFloor, hasLift: state.propertyDetails.pickupLift },
    drop: { floor: state.propertyDetails.dropFloor, hasLift: state.propertyDetails.dropLift },
    couponDiscount: state.couponDiscount,
    hasLoginDiscount: state.personalDetails.isVerified,
  }), [state]);

  return (
    <div className="space-y-8">
      <div className="animate-fade-in text-center">
        <h2 className="text-3xl font-display font-black text-surface-900 mb-1 tracking-tight">Price Estimate</h2>
        <p className="text-surface-900/80 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Smart pricing engine results
        </p>
      </div>

      {/* Total Card - High Fidelity */}
      <div className="glass-light shadow-2xl shadow-brand-500/15 border-brand-500/20 rounded-[3rem] p-10 text-center animate-scale-in relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/5 opacity-50" />
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-[1.5rem] gradient-brand flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-500/40 relative">
             <div className="absolute inset-0 bg-white/20 animate-pulse rounded-[1.5rem]" />
             <Receipt size={36} strokeWidth={2.5} className="text-white relative z-10" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-surface-900/80 mb-3">Guaranteed Estimate</p>
          <div className="flex items-center justify-center gap-1.5 h-16">
            <span className="text-2xl font-display font-black text-brand-500 tracking-tighter self-start mt-1">€</span>
            <span className="text-6xl font-display font-black text-surface-900 tracking-tighter">
              {price.total.toFixed(0)}
            </span>
            <span className="text-2xl font-display font-black text-surface-900/80 self-end mb-1">
              .{(price.total % 1).toFixed(2).substring(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="glass-light shadow-2xl shadow-brand-500/5 border-brand-500/10 rounded-[2.5rem] overflow-hidden animate-slide-up relative" style={{ animationDelay: '0.1s' }}>
        <div className="absolute -left-10 bottom-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl" />
        
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-900/80 p-8 pb-4 flex items-center gap-2">
          <Calculator size={14} className="text-brand-500" strokeWidth={3} /> Line Item Detail
        </h3>
        
        <div className="px-6 pb-8 space-y-2 relative z-10">
          {BREAKDOWN_ITEMS.map(({ key, label, icon: Icon }) => {
            const value = price[key];
            if (value === 0) return null;
            return (
              <div key={key} className="flex items-center justify-between px-5 py-4 hover:bg-brand-500/5 rounded-2xl transition-all duration-300 group/row">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-900/5 flex items-center justify-center text-surface-900/80 group-hover/row:bg-brand-500/10 group-hover/row:text-brand-500 transition-colors">
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-surface-900/60 group-hover/row:text-surface-900 transition-colors">{label}</span>
                </div>
                <span className="text-sm font-display font-black text-surface-900 tracking-tighter">€{value.toFixed(2)}</span>
              </div>
            );
          })}

          {price.discount > 0 && (
            <div className="flex items-center justify-between px-6 py-5 mt-4 bg-emerald-500/5 rounded-[1.5rem] border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-scale-in">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <TrendingDown size={20} strokeWidth={3} />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Rewards Applied</span>
                  <span className="block text-[9px] font-bold text-emerald-500/60 uppercase tracking-tighter mt-1">
                    {state.personalDetails.isVerified ? "20% Verified Discount" : ""}
                    {state.personalDetails.isVerified && state.couponDiscount > 0 ? " + " : ""}
                    {state.couponDiscount > 0 ? `Promo Code (${state.couponDiscount}%)` : ""}
                  </span>
                </div>
              </div>
              <span className="text-lg font-display font-black text-emerald-600 tracking-tighter">-€{price.discount.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary note */}
      <div className="p-6 rounded-[2rem] bg-brand-500/5 border-2 border-brand-500/10 border-dashed animate-fade-in relative z-10" style={{ animationDelay: '0.2s' }}>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-surface-900/80 text-center leading-loose">
          Our pricing is transparent and includes all tolls, taxes, and labor.<br/> 
          <span className="text-brand-500">Fast, secure, and stress-free moving experience guaranteed.</span>
        </p>
      </div>
    </div>
  );
}
