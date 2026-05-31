"use client";

import { useBooking } from "@/lib/booking-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { MeshBackground } from "@/components/MeshBackground";

import LocationStep from "./steps/LocationStep";
import MoveTypeStep from "./steps/MoveTypeStep";
import InventoryStep from "./steps/InventoryStep";
import ServicesStep from "./steps/ServicesStep";
import PropertyStep from "./steps/PropertyStep";
import ScheduleStep from "./steps/ScheduleStep";
import DetailsStep from "./steps/DetailsStep";
import PricingStep from "./steps/PricingStep";
import DiscountStep from "./steps/DiscountStep";
import ConfirmStep from "./steps/ConfirmStep";
import { PaymentStep } from "./steps/PaymentStep";

const STEP_LABELS = [
  "Location",
  "Move Type",
  "Inventory",
  "Services",
  "Property",
  "Schedule",
  "Details",
  "Discounts",
  "Pricing",
  "Confirm",
  "Payment",
];

function BookingWizard() {
  const { state, nextStep, prevStep } = useBooking();
  const router = useRouter();

  const renderStep = () => {
    switch (state.step) {
      case 1: return <LocationStep />;
      case 2: return <MoveTypeStep />;
      case 3: return <InventoryStep />;
      case 4: return <ServicesStep />;
      case 5: return <PropertyStep />;
      case 6: return <ScheduleStep />;
      case 7: return <DetailsStep />;
      case 8: return <DiscountStep />;
      case 9: return <PricingStep />;
      case 10: return <ConfirmStep />;
      case 11: return <PaymentStep />;
      default: return null;
    }
  };

  return (
    <main className="min-h-[100dvh] relative overflow-hidden bg-background">
      <MeshBackground />
      
      <div className="relative z-10 max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-6 pt-6 lg:pt-10 pb-36 min-h-[100dvh]">
        {/* Nav Header */}
        <header className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.push("/")} 
            className="p-2.5 rounded-2xl glass-light btn-tactile shadow-sm border border-white/50"
          >
            <ChevronLeft size={20} className="text-foreground-600" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground-900 tracking-tight">Booking Wizard</h1>
            <p className="text-xs text-foreground-400 font-medium tracking-tight">Plan your perfect move</p>
          </div>
        </header>

        {/* Stepper */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-300">Phase 0{state.step}</span>
              <span className="text-sm font-bold text-foreground-800 tracking-tight">{STEP_LABELS[state.step - 1]}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-light border border-white/40 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">{Math.round((state.step / 11) * 100)}% Complete</span>
            </div>
          </div>
          
          <div className="flex gap-1.5 px-0.5">
            {STEP_LABELS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-700 ease-out ${
                  i < state.step
                    ? "bg-brand-500 shadow-lg shadow-brand-500/20"
                    : i === state.step - 1
                    ? "bg-brand-500/30 animate-pulse"
                    : "bg-foreground-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div key={state.step} className="step-enter">
          {renderStep()}
        </div>

        {/* Bottom Actions */}
        {state.step < 11 && (
          <div className="sticky bottom-0 z-40 p-4 backdrop-blur-xl bg-white/40 border-t border-white/60 -mx-4 sm:-mx-6">
            <div className="flex gap-3 px-4 sm:px-6">
              {state.step > 1 && (
                <button
                  onClick={prevStep}
                  className="w-12 h-12 rounded-2xl glass-light flex items-center justify-center text-surface-900/80 hover:text-brand-500 transition-all btn-tactile shadow-xl shadow-black/5 border border-white flex-shrink-0"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <button
                onClick={nextStep}
                className="flex-1 h-12 rounded-2xl bg-brand-500 text-white font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 btn-tactile shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 transition-all border border-brand-400/20"
              >
                <span className="mb-0.5">{state.step === 9 ? "Review Summary" : "Next Step"}</span>
                {state.step === 9 ? <Check size={18} strokeWidth={3} /> : <ChevronRight size={18} strokeWidth={3} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function BookPage() {
  return <BookingWizard />;
}
