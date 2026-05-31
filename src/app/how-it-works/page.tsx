"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Play, Camera, PackageCheck, Truck, MapPin,
  Shield, Star, CheckCircle2, Quote, X, Sparkles, Clock, Users, Heart
} from "lucide-react";
import Link from "next/link";

/* ─── Data ─── */

const steps = [
  {
    num: "01",
    title: "Snap & Scan",
    desc: "Use our AI Vision to photograph your space. Our neural engine detects every item, calculates volume, and generates a precise inventory in seconds.",
    icon: Camera,
    color: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "02",
    title: "Get Your Quote",
    desc: "Receive an instant, transparent quote with no hidden fees. Choose your service tier — from essential to white-glove premium handling.",
    icon: PackageCheck,
    color: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "03",
    title: "We Move You",
    desc: "Our vetted, elite crew arrives on time with professional-grade equipment. Real-time GPS tracking lets you follow every step of the journey.",
    icon: Truck,
    color: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "04",
    title: "Settle In",
    desc: "We unpack, arrange, and set up your new space exactly how you want it. Full insurance coverage means total peace of mind.",
    icon: MapPin,
    color: "from-rose-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  },
];

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    alt: "Beautiful modern home interior",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=600&q=80",
    alt: "Professional packing service",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
    alt: "Moving truck fleet",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
    alt: "Luxury home delivery",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80",
    alt: "Happy family in new home",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=600&q=80",
    alt: "Careful handling of valuables",
    span: "col-span-1 row-span-1",
  },
];

const testimonials = [
  {
    name: "Sarah & James Thompson",
    location: "Helsinki → Espoo",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Absolutely seamless. The AI scanner was shockingly accurate and the crew handled our antique piano like it was their own. We were settled in by dinner time.",
    tag: "Family Move",
  },
  {
    name: "Maria Rodriguez",
    location: "Tampere → Turku",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "I've moved 6 times in the last decade and this was by far the most professional experience. The real-time tracking gave me complete peace of mind.",
    tag: "Solo Move",
  },
  {
    name: "David & Lin Chen",
    location: "Oulu → Helsinki",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Cross-country move with two kids and a dog. MoveMate Pro handled everything — packing, transport, even reassembled our furniture. Worth every cent.",
    tag: "Long Distance",
  },
  {
    name: "Emma Virtanen",
    location: "Jyväskylä → Lahti",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "The white-glove tier is incredible. They wrapped every glass individually and not a single item was damaged. My new apartment was set up perfectly.",
    tag: "Premium Service",
  },
];

const videos = [
  {
    id: "dQw4w9WgXcQ",
    title: "How MoveMate Pro Works",
    desc: "See our end-to-end process in 90 seconds",
    thumbnail: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=800&q=80",
    duration: "1:32",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "AI Vision Scanner Demo",
    desc: "Watch our AI analyze a full room in real-time",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    duration: "2:15",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Customer Stories",
    desc: "Real families share their MoveMate experience",
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    duration: "3:47",
  },
];

/* ─── Component ─── */

export default function HowItWorksPage() {
  const router = useRouter();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-brand-50 font-sans selection:bg-accent-500 selection:text-white">

      {/* ━━━ Navigation ━━━ */}
      <nav className="sticky top-0 z-50 glass border-b border-brand-500/5 px-4 lg:px-20 h-16 lg:h-20 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 lg:gap-3 text-surface-900/60 hover:text-brand-500 transition-colors group"
        >
          <ArrowLeft size={18} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em]">Home</span>
        </button>
        <button
          onClick={() => router.push("/book")}
          className="px-5 lg:px-8 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl bg-brand-500 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-800/10 hover:translate-y-[-2px] transition-all"
        >
          Get Quote
        </button>
      </nav>

      {/* ━━━ Hero Banner ━━━ */}
      <section className="relative overflow-hidden py-28 lg:py-40 px-6 lg:px-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=2400&q=60")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/60 to-transparent" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
            <Play size={14} fill="white" className="text-white" />
            <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">See It In Action</span>
          </div>
          <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter leading-tight">
            How MoveMate<br />
            <span className="text-accent-400">Pro Works.</span>
          </h1>
          <p className="text-white/50 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            From your first scan to settling into your new home — discover the precision-engineered process that has helped 14,000+ families move with confidence.
          </p>
        </div>
      </section>

      {/* ━━━ Process Steps ━━━ */}
      <section className="py-20 lg:py-24 px-6 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 lg:mb-20">
            <span className="text-accent-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">The Process</span>
            <h2 className="text-3xl lg:text-5xl font-display font-black text-surface-900 tracking-tighter">
              Four Simple Steps.
            </h2>
          </div>

          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="flex flex-col items-center text-center gap-6"
              >
                {/* Image & Icon */}
                <div className="w-full max-w-2xl relative rounded-[2rem] overflow-visible shadow-xl shadow-brand-800/10 group aspect-video">
                  <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-xl ring-4 ring-brand-50 z-10`}>
                    <step.icon size={24} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 pt-8 flex flex-col items-center">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-accent-500 font-black tracking-widest uppercase text-xs">Step {step.num}</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-display font-black text-surface-900 tracking-tight break-words min-w-0 hyphens-auto text-center">
                    {step.title}
                  </h3>
                  <p className="text-surface-900/90 text-base leading-relaxed font-medium max-w-lg mx-auto break-words min-w-0 text-center">
                    {step.desc}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-accent-500 pt-2">
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Included in all plans</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Video Showcase ━━━ */}
      <section className="py-28 lg:py-36 bg-brand-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-500/5 blur-[120px]" />
        <div className="max-w-6xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="text-center mb-20">
            <span className="text-accent-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Watch & Learn</span>
            <h2 className="text-4xl lg:text-6xl font-display font-black text-white tracking-tighter">
              See Us In Action.
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {videos.map((video, i) => (
              <button
                key={i}
                onClick={() => setActiveVideo(video.id)}
                className="group text-left rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-accent-500/30 transition-all duration-500 bg-white/5 backdrop-blur-sm"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-accent-500 transition-all duration-500 shadow-2xl">
                      <Play size={24} fill="white" className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-black text-white/80 tracking-widest">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">{video.title}</h4>
                  <p className="text-[11px] text-white/40 font-medium">{video.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Gallery ━━━ */}
      <section className="py-28 lg:py-36 px-6 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-accent-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Gallery</span>
            <h2 className="text-4xl lg:text-6xl font-display font-black text-surface-900 tracking-tighter">
              Moves We&apos;re Proud Of.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 auto-rows-[160px]">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxImg(img.src.replace("w=600", "w=1600"))}
                className={`${img.span} rounded-2xl lg:rounded-[2rem] overflow-hidden relative group cursor-pointer`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[8px] lg:text-[10px] font-black text-white uppercase tracking-widest">
                    View
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Happy Customers ━━━ */}
      <section className="py-28 lg:py-36 px-6 lg:px-24 bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-accent-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block flex items-center justify-center gap-2">
              <Heart size={14} fill="currentColor" /> Happy Families
            </span>
            <h2 className="text-4xl lg:text-6xl font-display font-black text-surface-900 tracking-tighter">
              What Our Customers Say.
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="glass-light rounded-[3rem] p-8 lg:p-10 border border-brand-500/10 hover:border-accent-500/20 hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-6 right-8 text-brand-500/5 group-hover:text-brand-500/10 transition-colors">
                  <Quote size={80} strokeWidth={1} />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-surface-900 uppercase tracking-wider break-words min-w-0 hyphens-auto">{t.name}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <MapPin size={12} className="text-accent-500 flex-shrink-0" />
                        <span className="text-[9px] font-bold text-surface-900/80 uppercase tracking-widest break-words min-w-0">{t.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} size={16} fill="#f59e0b" className="text-amber-500" />
                    ))}
                  </div>

                  <p className="text-surface-900/90 text-[15px] leading-relaxed font-medium italic break-words min-w-0">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="pt-4 border-t border-brand-500/5">
                    <span className="px-4 py-1.5 rounded-full bg-brand-500/5 text-[9px] font-black text-brand-500 uppercase tracking-widest border border-brand-500/10">
                      {t.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Stats Bar ━━━ */}
      <section className="py-20 px-6 lg:px-24 bg-brand-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6 text-center">
          {[
            { value: "14,000+", label: "Moves Completed", icon: Truck },
            { value: "99.8%", label: "Damage-Free Rate", icon: Shield },
            { value: "4.9★", label: "Customer Rating", icon: Star },
            { value: "< 2hrs", label: "Average Setup Time", icon: Clock },
          ].map((stat) => (
            <div key={stat.label} className="space-y-3">
              <stat.icon size={24} className="text-accent-400 mx-auto" strokeWidth={2.5} />
              <p className="text-3xl lg:text-4xl font-display font-black text-white tracking-tighter">{stat.value}</p>
              <p className="text-[9px] text-accent-400/60 font-black uppercase tracking-[0.3em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="py-32 lg:py-40 px-6 lg:px-24 text-center">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="w-20 h-20 rounded-[2.5rem] bg-accent-500 flex items-center justify-center shadow-2xl shadow-accent-500/40 mx-auto animate-float">
            <Sparkles size={36} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-5xl lg:text-7xl font-display font-black text-surface-900 tracking-tighter">
            Ready to Experience It?
          </h2>
          <p className="text-surface-900/90 text-lg max-w-xl mx-auto leading-relaxed">
            Join thousands of happy families who trusted MoveMate Pro with their most important move.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => router.push("/book")}
              className="px-12 py-6 bg-brand-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-brand-800/30 hover:scale-105 transition-all"
            >
              Get Your Free Quote
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-12 py-6 glass text-surface-900 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-white transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer className="py-16 border-t border-brand-500/5 px-6 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-accent-500 rounded-full" />
            <h1 className="text-xl font-display font-black text-surface-900 tracking-tighter">
              MOVEMATE<span className="text-accent-500">.</span>
            </h1>
          </div>
          <p className="text-[10px] font-black text-surface-900/90 uppercase tracking-widest">
            © 2026 MOVEMATE LOGISTICS INC.
          </p>
        </div>
      </footer>

      {/* ━━━ Video Modal ━━━ */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 border border-white/10"
            >
              <X size={20} />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
              title="Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* ━━━ Image Lightbox ━━━ */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/10"
          >
            <X size={24} />
          </button>
          <img
            src={lightboxImg}
            alt="Full size gallery image"
            className="max-w-full max-h-[85vh] rounded-[2rem] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
