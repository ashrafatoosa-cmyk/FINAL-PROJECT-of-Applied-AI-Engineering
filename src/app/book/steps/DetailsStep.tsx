"use client";

import React, { useState } from "react";
import { useBooking } from "@/lib/booking-context";
import { User, Mail, Phone, CheckCircle2, Loader2, Send } from "lucide-react";

export default function DetailsStep() {
  const { state, setPersonalDetails, nextStep } = useBooking();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.personalDetails.firstName || !state.personalDetails.lastName || !state.personalDetails.email || !state.personalDetails.phone) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsVerifying(true);
    setError("");
    
    // Simulate sending email verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsVerifying(false);
    setIsSent(true);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === "1234" || verificationCode === "MOVE") {
      setIsVerifying(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPersonalDetails({ isVerified: true });
      nextStep();
    } else {
      setError("Invalid verification code. Use 'MOVE' to test.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-black text-surface-900 uppercase tracking-tight">Personal Details</h2>
        <p className="text-surface-900/80 text-sm font-medium">Verify your information to unlock a 20% discount on your estimate.</p>
      </div>

      {!isSent ? (
        <form onSubmit={handleSendVerification} className="space-y-5 max-w-md mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-900/80 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                placeholder="First Name"
                value={state.personalDetails.firstName}
                onChange={(e) => setPersonalDetails({ firstName: e.target.value })}
                className="w-full bg-white border border-surface-200 rounded-2xl py-4 pl-12 pr-4 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                required
              />
            </div>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-900/80 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                placeholder="Last Name"
                value={state.personalDetails.lastName}
                onChange={(e) => setPersonalDetails({ lastName: e.target.value })}
                className="w-full bg-white border border-surface-200 rounded-2xl py-4 pl-12 pr-4 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                required
              />
            </div>
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-900/80 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              value={state.personalDetails.email}
              onChange={(e) => setPersonalDetails({ email: e.target.value })}
              className="w-full bg-white border border-surface-200 rounded-2xl py-4 pl-12 pr-4 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
              required
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-900/80 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="tel"
              placeholder="Phone Number"
              value={state.personalDetails.phone}
              onChange={(e) => setPersonalDetails({ phone: e.target.value })}
              className="w-full bg-white border border-surface-200 rounded-2xl py-4 pl-12 pr-4 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
              required
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-black py-5 rounded-2xl shadow-2xl shadow-brand-500/30 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs btn-tactile"
          >
            {isVerifying ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5" />
                Send Verification Code
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6 max-w-md mx-auto">
          <div className="p-6 rounded-[2rem] bg-brand-500/5 border border-brand-500/10 text-center animate-scale-in">
            <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-1">Code sent to</p>
            <p className="font-bold text-surface-900">{state.personalDetails.email}</p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-surface-900/80 uppercase tracking-widest ml-1">Verification Code</label>
            <input
              type="text"
              maxLength={4}
              placeholder="0 0 0 0"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
              className="w-full bg-white border border-surface-200 rounded-2xl py-6 text-center text-3xl font-black tracking-[0.5em] text-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-inner"
              required
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-accent-500/30 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs btn-tactile"
          >
            {isVerifying ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Verify & Continue
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsSent(false)}
            className="w-full text-surface-900/80 text-[10px] font-black uppercase tracking-[0.2em] hover:text-brand-500 transition-colors py-2"
          >
            Change Contact Info
          </button>
        </form>
      )}

      <div className="mt-8 p-8 rounded-[2.5rem] glass-light border border-accent-500/20 relative overflow-hidden group">
        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-accent-500/5 rounded-full blur-2xl group-hover:bg-accent-500/10 transition-colors" />
        <div className="flex items-start gap-5 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-600">
            <CheckCircle2 className="h-6 w-6" strokeWidth={3} />
          </div>
          <div>
            <h4 className="text-surface-900 font-black uppercase tracking-widest text-xs">Verification Benefit</h4>
            <p className="text-surface-900/80 text-sm mt-2 font-medium leading-relaxed">
              Verifying your details automatically applies a <span className="text-accent-600 font-bold">20% discount</span> to your final estimate. No coupon code required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

