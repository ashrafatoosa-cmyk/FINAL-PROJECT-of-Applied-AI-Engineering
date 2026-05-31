"use client";

import React, { useState, useEffect } from "react";
import { useBooking } from "@/lib/booking-context";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { calculatePrice } from "@/lib/pricing";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Initialize Stripe (User will provide this key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_mock");

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { state, updateState, resetBooking } = useBooking();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const price = calculatePrice({
    distance: state.distance || 10,
    items: state.items,
    moveType: state.moveType,
    services: { packing: state.services.packing, unpacking: state.services.unpacking, insurance: state.services.insurance, express: state.services.express },
    pickup: { floor: state.propertyDetails.pickupFloor, hasLift: state.propertyDetails.pickupLift },
    drop: { floor: state.propertyDetails.dropFloor, hasLift: state.propertyDetails.dropLift },
    couponDiscount: state.couponDiscount,
    hasLoginDiscount: state.personalDetails.isVerified,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    // If no real key, simulate success
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "pk_test_mock") {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSucceeded(true);
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(price.total * 100) }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to initiate payment");

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
            email: state.personalDetails.email,
            phone: state.personalDetails.phone,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else {
        // Update Firestore status to confirmed
        if (state.bookingId) {
          try {
            const bookingRef = doc(db, "bookings", state.bookingId);
            await updateDoc(bookingRef, {
              paymentStatus: "paid",
              status: "confirmed",
              updatedAt: new Date().toISOString()
            });
          } catch (fsError) {
            console.error("Failed to update booking status:", fsError);
            // We don't block the UI here as the payment itself was successful
          }
        }
        setSucceeded(true);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-bounce-in">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-accent-500 blur-3xl opacity-20 scale-150 animate-pulse" />
          <div className="relative w-32 h-32 rounded-[3.5rem] bg-accent-500/10 flex items-center justify-center shadow-2xl shadow-accent-500/20 border-4 border-accent-500/20">
            <CheckCircle2 size={56} className="text-accent-500" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-4xl font-display font-black text-surface-900 mb-2 tracking-tighter leading-none">
          BOOKING<br />SECURED
        </h2>
        <p className="text-surface-900/80 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
          Payment confirmed. Your journey is ready.
        </p>
        
        <div className="glass-light shadow-2xl shadow-brand-500/5 border-brand-500/10 rounded-[3rem] p-8 mb-12 w-full max-w-sm relative overflow-hidden">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500/60 mb-2">Booking Reference</p>
          <p className="text-2xl font-black tracking-[0.1em] text-surface-900 uppercase">
            {state.bookingId?.slice(0, 12).match(/.{1,4}/g)?.join('-') || "PENDING"}
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => router.push("/bookings")}
            className="w-full py-6 rounded-[2.5rem] bg-brand-500 text-white text-[10px] font-black uppercase tracking-[0.3em] btn-tactile shadow-2xl shadow-brand-500/40"
          >
            Track Living Ops
          </button>
          <button
            onClick={() => { resetBooking(); router.push("/"); }}
            className="w-full py-6 rounded-[2.5rem] glass-light border-brand-500/10 text-brand-600 text-[10px] font-black uppercase tracking-[0.3em] btn-tactile flex items-center justify-center gap-3"
          >
            Return to Nexus <ArrowRight size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
      <div className="glass-light shadow-2xl shadow-brand-500/5 border-brand-500/20 rounded-[3rem] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500">Payment Summary</p>
            <h3 className="text-2xl font-black text-surface-900">Secure Checkout</h3>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-surface-900/60">Total Amount</p>
            <p className="text-3xl font-display font-black text-brand-600">€{price.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-900/5 border border-brand-500/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-surface-900/80">
              <CreditCard size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Card Details</span>
            </div>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#0f172a", // surface-900
                    fontFamily: "Inter, sans-serif",
                    "::placeholder": {
                      color: "#94a3b8", // surface-400
                    },
                  },
                  invalid: {
                    color: "#ef4444",
                  },
                },
              }}
            />
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent-500/5 border border-accent-500/10">
            <ShieldCheck className="text-accent-600" size={20} />
            <p className="text-[10px] text-surface-900/80 font-bold uppercase tracking-widest leading-relaxed">
              Encrypted by Stripe. Your data is protected by industry-leading security protocols.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500">
          <AlertCircle size={18} />
          <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-6 rounded-[2.5rem] bg-brand-500 text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 btn-tactile shadow-2xl shadow-brand-500/40 transition-all disabled:opacity-50"
      >
        {isProcessing ? (
          <Loader2 size={24} className="animate-spin" strokeWidth={3} />
        ) : (
          <>
            <Lock size={18} strokeWidth={3} /> Pay & Complete Booking
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-surface-900/80">
        <Lock size={12} />
        <span className="text-[10px] font-black uppercase tracking-widest">SSL Secure Payment</span>
      </div>
    </form>
  );
}

export function PaymentStep() {
  return (
    <div className="space-y-8 pb-32">
      <div className="animate-fade-in">
        <h2 className="text-4xl font-display font-black text-surface-900 mb-2 tracking-tighter uppercase leading-[0.9]">
          Final<br />Step
        </h2>
        <p className="text-surface-900/80 text-[10px] font-black uppercase tracking-[0.3em]">
          Secure your premium relocation service
        </p>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
