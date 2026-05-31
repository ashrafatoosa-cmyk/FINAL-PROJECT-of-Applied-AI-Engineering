"use client";

import { useBooking } from "@/lib/booking-context";
import { useAuth } from "@/lib/auth-context";
import { calculatePrice } from "@/lib/pricing";
import { createBooking, createGuestBooking } from "@/lib/firestore";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Route, Package, Calendar, Clock, CreditCard,
  CheckCircle2, Loader2, Truck, ArrowRight, User as UserIcon
} from "lucide-react";

export default function ConfirmStep() {
  const { state, updateState, goToStep, resetBooking } = useBooking();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const price = useMemo(() => calculatePrice({
    distance: state.distance || 10,
    items: state.items,
    moveType: state.moveType,
    services: { packing: state.services.packing, unpacking: state.services.unpacking, insurance: state.services.insurance, express: state.services.express },
    pickup: { floor: state.propertyDetails.pickupFloor, hasLift: state.propertyDetails.pickupLift },
    drop: { floor: state.propertyDetails.dropFloor, hasLift: state.propertyDetails.dropLift },
    couponDiscount: state.couponDiscount,
    hasLoginDiscount: state.personalDetails.isVerified,
  }), [state]);
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const bookingData = {
        pickup: state.pickup,
        drop: state.drop,
        distance: state.distance,
        duration: state.duration,
        moveType: state.moveType,
        items: state.items,
        services: { packing: state.services.packing, unpacking: state.services.unpacking, insurance: state.services.insurance, express: state.services.express },
        propertyDetails: state.propertyDetails,
        schedule: state.schedule,
        price: { total: price.total, breakdown: price as unknown as Record<string, number> },
        status: "pending_payment" as any, // Special status for payment flow
        couponCode: state.couponCode || undefined,
        personalDetails: state.personalDetails,
      };

      let id;
      if (user) {
        id = await createBooking(user.uid, bookingData);
      } else {
        id = await createGuestBooking(bookingData);
      }
      
      // Update state with bookingId and move to payment step
      updateState({ bookingId: id });
      goToStep(11);
    } catch (err) {
      console.error("Booking failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Inline success screen removed - handled by PaymentStep

  const moveTypeLabel = { home: "Residency", office: "Corporate", single: "Specific", vehicle: "Automotive" }[state.moveType] || state.moveType;
  const timeSlotLabel = { morning: "Alpha Phase (AM)", afternoon: "Beta Phase (PM)", evening: "Gamma Phase (EVE)" }[state.schedule.timeSlot] || state.schedule.timeSlot;

  return (
    <div className="space-y-8 pb-32">
      <div className="animate-fade-in">
        <h2 className="text-4xl font-display font-black text-surface-900 mb-2 tracking-tighter uppercase leading-[0.9]">
          Final<br />Verification
        </h2>
        <p className="text-surface-900/90 text-[10px] font-black uppercase tracking-[0.3em]">
          Execute with absolute precision
        </p>
      </div>

      {/* Locations - Premium Certificate Style */}
      <div className="glass shadow-2xl shadow-brand-500/5 border-brand-500/20 rounded-[3rem] p-8 space-y-8 animate-slide-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
        
        <div className="flex items-start gap-6 relative">
          <div className="w-14 h-14 rounded-[1.5rem] bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-xl shadow-brand-500/30">
            <MapPin size={24} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500 mb-1.5">Origin Protocol</p>
            <p className="text-base font-black text-surface-900 leading-tight truncate">{state.pickup.address || "Pending Address"}</p>
            <p className="text-[10px] font-bold text-surface-900/80 uppercase mt-1">Lvl {state.propertyDetails.pickupFloor} • {state.propertyDetails.pickupLift ? "Elevator Active" : "Stairs Only"}</p>
          </div>
        </div>

        <div className="flex items-start gap-6 relative">
          <div className="w-14 h-14 rounded-[1.5rem] bg-accent-500 text-white flex items-center justify-center shrink-0 shadow-xl shadow-accent-500/30">
            <MapPin size={24} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-500 mb-1.5">Destination Protocol</p>
            <p className="text-base font-black text-surface-900 leading-tight truncate">{state.drop.address || "Pending Address"}</p>
            <p className="text-[10px] font-bold text-surface-900/80 uppercase mt-1">Lvl {state.propertyDetails.dropFloor} • {state.propertyDetails.dropLift ? "Elevator Active" : "Stairs Only"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-brand-500/10">
          <div className="bg-surface-50/50 rounded-2xl p-4 border border-brand-500/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 mb-1">Distance</p>
            <p className="text-lg font-black text-surface-900">{state.distance} <span className="text-xs text-brand-500">KM</span></p>
          </div>
          <div className="bg-surface-50/50 rounded-2xl p-4 border border-brand-500/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 mb-1">Travel Time</p>
            <p className="text-lg font-black text-surface-900">{state.duration} <span className="text-xs text-brand-500">MIN</span></p>
          </div>
        </div>
      </div>

      {/* Logistics Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {[
          { icon: Truck, label: "Transfer Mode", value: moveTypeLabel },
          { icon: Package, label: "Inventory Load", value: `${state.items.reduce((s, i) => s + i.quantity, 0)} Units` },
          { icon: Calendar, label: "Timeline", value: state.schedule.date || "Immediate" },
          { icon: Clock, label: "Operational Window", value: timeSlotLabel }
        ].map((item, idx) => (
          <div key={idx} className="glass border-brand-500/10 rounded-[2rem] p-6 flex items-center justify-between group hover:border-brand-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/5 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all">
                <item.icon size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-900/80">{item.label}</span>
            </div>
            <span className="text-xs font-black text-surface-900 uppercase tracking-widest">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Client Details */}
      <div className="glass border-brand-500/10 rounded-[2rem] p-8 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
            <UserIcon size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500">Client Protocol</p>
            <h3 className="text-xl font-black text-surface-900">
              {state.personalDetails.firstName} {state.personalDetails.lastName}
            </h3>
          </div>
          {state.personalDetails.isVerified && (
            <div className="ml-auto px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              Verified
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 mb-1">Email Address</p>
            <p className="text-sm font-bold text-surface-900">{state.personalDetails.email}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 mb-1">Contact Number</p>
            <p className="text-sm font-bold text-surface-900">{state.personalDetails.phone}</p>
          </div>
        </div>
      </div>

      {/* Pricing Lockup */}
      <div className="glass shadow-2xl shadow-brand-500/20 border-4 border-brand-500/20 rounded-[3rem] p-8 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="flex items-end justify-between relative">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600 mb-1">Guaranteed Total</span>
            <div className="flex items-center gap-2">
              <CreditCard size={14} className="text-brand-500" strokeWidth={3} />
              <span className="text-[10px] font-bold text-surface-900/80 uppercase tracking-widest">Inclusive of Tax</span>
            </div>
          </div>
          <div className="text-right">
            {state.couponCode && (
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 animate-pulse">
                SAVED €{((price.total / (1 - state.couponDiscount/100)) * (state.couponDiscount/100)).toFixed(2)}
              </p>
            )}
            <p className="text-5xl font-display font-black text-surface-900 tracking-tighter">€{price.total.toFixed(0)}<span className="text-lg text-surface-900/80">.{(price.total % 1).toFixed(2).split('.')[1]}</span></p>
          </div>
        </div>
      </div>

    </div>
  );
}
