"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, Phone, Clock, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="bg-brand-50 min-h-screen font-sans selection:bg-accent-500 selection:text-white pb-24">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 glass border-b border-brand-500/5 px-6 lg:px-24 h-20 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-surface-900 hover:text-brand-600 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-brand-500/10">
            <ChevronLeft size={18} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Home</span>
        </button>
      </nav>

      {/* ── Header ── */}
      <header className="px-6 pt-12 pb-8 max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6 animate-slide-down">
          <Mail size={14} className="text-brand-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">
            Get In Touch
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-surface-900 mb-6 tracking-tight animate-slide-up">
          Contact <span className="text-accent-500">Us</span>
        </h1>
        <p className="text-surface-900/80 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed animate-fade-in break-words min-w-0">
          Have a question about our moving services, enterprise infrastructure, or pricing? Our dedicated team is ready to assist you.
        </p>
      </header>

      {/* ── Content ── */}
      <div className="px-6 max-w-2xl mx-auto flex flex-col gap-6 w-full animate-fade-in">
        
        {/* Contact Form */}
        <div className="w-full glass-light p-8 rounded-3xl border border-brand-500/10 shadow-2xl shadow-brand-500/5">
          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 ml-1">Your Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full bg-white border border-surface-200 rounded-2xl py-4 px-5 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold placeholder:text-surface-300 shadow-inner"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com" 
                className="w-full bg-white border border-surface-200 rounded-2xl py-4 px-5 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold placeholder:text-surface-300 shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 ml-1">Message</label>
              <textarea 
                rows={4}
                placeholder="How can we help you today?" 
                className="w-full bg-white border border-surface-200 rounded-2xl py-4 px-5 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold placeholder:text-surface-300 shadow-inner resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="mt-3 w-full py-4 rounded-2xl bg-brand-500 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 btn-tactile"
            >
              <span>Send Message</span>
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Info Footer Block */}
        <div className="w-full glass-light p-8 rounded-3xl border border-brand-500/10 shadow-lg shadow-brand-500/5 flex flex-col gap-6">
          
          {/* Hours */}
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500">
              <Clock size={14} strokeWidth={3} /> Operational Hours
            </span>
            <p className="text-sm font-bold text-surface-900 leading-relaxed">
              Mon-Fri: 8:00 AM - 8:00 PM<br/>Sat-Sun: 9:00 AM - 5:00 PM
            </p>
          </div>

          <div className="w-full h-px bg-brand-500/10" />

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-600">
              <Phone size={14} strokeWidth={3} /> Phone Support
            </span>
            <p className="text-base font-bold text-surface-900 whitespace-nowrap">+1 (800) 555-MOVE</p>
          </div>

          <div className="w-full h-px bg-brand-500/10" />

          {/* Email */}
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-600">
              <Mail size={14} strokeWidth={3} /> Email Address
            </span>
            <p className="text-base font-bold text-surface-900">support@movematepro.com</p>
          </div>

        </div>

      </div>
    </div>
  );
}
