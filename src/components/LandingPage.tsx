"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Truck, Shield, Star, Zap, ArrowRight,
  Play, Globe, Sparkles, Menu, X,
  Settings, Server, Tag, Mail
} from "lucide-react";
import Link from "next/link";

import BackgroundSlider from "./BackgroundSlider";

export function LandingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = ["Services", "Fleet", "Infrastructure", "Pricing", "Reviews"];

  const features = [
    {
      icon: Zap,
      title: "AI Inventory",
      desc: "Upload a photo and our neural engine calculates volume, packing requirements, and pricing instantly.",
      color: "bg-amber-500",
    },
    {
      icon: Shield,
      title: "Vault Protection",
      desc: "Full coverage for all assets. Real-time monitoring and impact-sensor technology on fragile units.",
      color: "bg-blue-500",
    },
    {
      icon: Globe,
      title: "Global Network",
      desc: "A distributed fleet of vetted professionals ready to deploy across major metropolitan sectors.",
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="bg-brand-100 min-h-screen font-sans selection:bg-accent-500 selection:text-white overflow-x-hidden">

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 glass border-b border-brand-500/10 w-full">
        <div className="px-6 py-3 flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg">
                <Truck size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-500 rounded-md flex items-center justify-center border border-white">
                <Sparkles size={8} className="text-white" />
              </div>
            </div>
            <div className="leading-none">
              <p className="text-[7px] tracking-[0.25em] text-surface-900/80 font-black uppercase">EST. 2026</p>
              <p className="text-base font-display font-black text-surface-900 tracking-tight">
                MOVEMATE <span className="text-accent-500">PRO</span>
              </p>
            </div>
          </div>

          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-surface-900 rounded-xl hover:bg-brand-500/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* ── Slide-Out Sidebar Overlay ── */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-[60] flex justify-end overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative w-[75%] max-w-[280px] h-[100dvh] bg-white shadow-2xl flex flex-col animate-slide-left border-l border-brand-500/10 sticky top-0">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-5 border-b border-brand-500/5">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-surface-900/60">Menu</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-brand-500/10 transition-colors"
              >
                <X size={18} className="text-surface-900" />
              </button>
            </div>

            {/* Sidebar Links */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
              {[
                { name: "Services", icon: Settings },
                { name: "Fleet", icon: Truck },
                { name: "Infrastructure", icon: Server },
                { name: "Pricing", icon: Tag },
                { name: "Reviews", icon: Star },
                { name: "Contact Us", icon: Mail },
              ].map((item) => {
                let href = "#";
                if (item.name === "Fleet") href = "/fleet-monitor";
                if (item.name === "Services") href = "/services";
                if (item.name === "Infrastructure") href = "/infrastructure";
                if (item.name === "Pricing") href = "/pricing";
                if (item.name === "Reviews") href = "/reviews";
                if (item.name === "Contact Us") href = "/contact";
                
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className="group text-xs font-bold uppercase tracking-widest text-surface-900 transition-all flex items-center relative py-1"
                  >
                    <span className="flex items-center gap-3 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1.5 group-hover:text-brand-600">
                      <Icon size={16} className="text-surface-900/40 group-hover:text-brand-500 transition-colors" />
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Sidebar Footer Actions */}
            <div className="p-5 border-t border-brand-500/5 space-y-3 bg-brand-50/30">
              <button
                onClick={() => { setIsMenuOpen(false); router.push("/login"); }}
                className="w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-surface-900 bg-white shadow-sm border border-brand-500/10 hover:bg-brand-500/5 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); router.push("/book"); }}
                className="w-full py-3 rounded-xl bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:-translate-y-0.5 transition-all"
              >
                Booking Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero / Slider ── */}
      <section className="relative pt-[60px] h-screen min-h-[500px] flex items-end justify-center pb-24">
        <BackgroundSlider />

        {/* CTA buttons over the slider */}
        <div className="relative z-20 w-full px-5">
          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto sm:max-w-none sm:justify-center">
            <button
              onClick={() => router.push("/book")}
              className="group w-full sm:w-auto px-8 py-4 bg-accent-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[0_16px_32px_rgba(20,184,166,0.35)] hover:scale-105 transition-all duration-300"
            >
              Get Free Quote
              <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={18} strokeWidth={3} />
            </button>
            <button
              onClick={() => router.push("/how-it-works")}
              className="w-full sm:w-auto px-8 py-4 bg-white/15 backdrop-blur-md text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border border-white/20 hover:bg-white hover:text-brand-900 transition-all duration-300"
            >
              How It Works <Play size={16} fill="currentColor" />
            </button>
            <button
              onClick={() => router.push("/scanner")}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-500/80 backdrop-blur-md text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border border-indigo-400/30 shadow-[0_8px_24px_rgba(99,102,241,0.25)] hover:bg-indigo-500 hover:scale-105 transition-all duration-300"
            >
              <Zap size={16} fill="currentColor" className="text-yellow-300" /> Try AI Scanner
            </button>
          </div>
        </div>

        {/* Fade to background */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-brand-100 to-transparent z-10 pointer-events-none" />
      </section>

      {/* ── Trust Bar ── */}
      <section className="py-10 border-b border-brand-500/10 overflow-hidden px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          {["FORBES", "TECHCRUNCH", "WALL ST. JOURNAL", "WIRED"].map((brand) => (
            <span key={brand} className="text-sm font-display font-black tracking-tight whitespace-nowrap">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-16">
        {/* Section header */}
        <div className="mb-10">
          <span className="text-accent-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
            Core Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-surface-900 tracking-tighter mb-4 leading-tight">
            Engineered for Reliability.
          </h2>
          <p className="text-surface-900/90 text-sm sm:text-base leading-relaxed max-w-xl">
            From AI-driven spatial analysis to automated scheduling, MoveMate provides enterprise-grade relocation for homes and businesses.
          </p>
        </div>

        {/* Cards — stacked vertically one by one */}
        <div className="flex flex-col gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group flex items-start gap-5 p-5 rounded-2xl bg-white border border-brand-500/8 hover:border-accent-500/30 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-500"
            >
              {/* Icon on the left */}
              <div className={`w-12 h-12 rounded-xl ${feature.color} text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon size={22} strokeWidth={2.5} />
              </div>
              {/* Text on the right */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black text-surface-900 uppercase tracking-tight mb-1.5 break-words min-w-0 hyphens-auto">
                  {feature.title}
                </h3>
                <p className="text-surface-900/90 text-sm leading-relaxed break-words min-w-0">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ── Stats Section ── */}
      <section className="py-14 px-4 sm:px-6 bg-brand-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-500/5 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-8 max-w-lg mx-auto">

          {/* Heading */}
          <div>
            <span className="text-accent-500 text-[9px] font-black uppercase tracking-[0.4em] mb-3 block">
              Our Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tighter leading-tight">
              Scaling the Future of{" "}
              <span className="text-accent-500">Logistics.</span>
            </h2>
          </div>

          {/* Stats numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/8">
              <p className="text-4xl font-display font-black text-white tracking-tighter">14k+</p>
              <p className="text-[9px] text-accent-500 font-black uppercase tracking-[0.3em] mt-1.5">
                Successful Moves
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/8">
              <p className="text-4xl font-display font-black text-white tracking-tighter">99.8%</p>
              <p className="text-[9px] text-accent-500 font-black uppercase tracking-[0.3em] mt-1.5">
                Integrity Rate
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/10" />

          {/* Testimonial card */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5 space-y-4">
            {/* Badge */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0">
                <Star fill="white" size={14} />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-widest text-[10px]">Platinum Recognition</h4>
                <p className="text-[9px] text-white/40 uppercase tracking-widest">Global Logistics Awards 2026</p>
              </div>
            </div>

            {/* Quote */}
            <p className="text-sm font-medium leading-relaxed italic text-white/75">
              "MoveMate hasn't just improved the moving experience — they've completely re-engineered it for the modern era. Absolute precision and reliability."
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex-shrink-0 flex items-center justify-center text-white/40 text-xs font-black">
                MV
              </div>
              <div>
                <p className="font-black text-xs">Marcus Vane</p>
                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Director, Apex Corp</p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ── CTA Section ── */}
      <section className="py-20 px-4 sm:px-6 text-center">
        <div className="max-w-lg mx-auto space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-[1.5rem] bg-accent-500 flex items-center justify-center shadow-2xl shadow-accent-500/40 animate-float">
              <Truck size={30} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-surface-900 tracking-tighter leading-tight">
            Ready for Deployment?
          </h2>
          <p className="text-surface-900/90 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            Initiate your relocation procedure today and experience the MoveMate standard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push("/book")}
              className="px-8 py-4 bg-brand-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-800/25 hover:scale-105 transition-all"
            >
              Get Instant Quote
            </button>
            <button
              onClick={() => router.push("/fleet-monitor")}
              className="px-8 py-4 glass text-surface-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all"
            >
              Contact Fleet Command
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-brand-500/10 px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 bg-accent-500 rounded-full" />
            <span className="text-base font-display font-black text-surface-900 tracking-tighter">
              MOVEMATE<span className="text-accent-500">.</span>
            </span>
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            {["Security", "Privacy", "Terms", "Support"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[10px] font-black uppercase tracking-widest text-surface-900/90 hover:text-accent-500 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-[9px] font-black text-surface-900/90 uppercase tracking-widest text-center sm:text-right">
            © 2026 MOVEMATE LOGISTICS INC.
          </p>
        </div>
      </footer>
    </div>
  );
}
