"use client";

import { Star, MapPin, Quote, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReviewsPage() {
  const router = useRouter();

  const testimonials = [
    {
      name: "Sarah & James Thompson",
      location: "Helsinki → Espoo",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
      rating: 5,
      text: "Absolutely seamless. The AI scanner was shockingly accurate and the crew handled our antique piano like it was their own. We were settled in by dinner time.",
      tag: "Family Move",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Maria Rodriguez",
      location: "Tampere → Turku",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      rating: 5,
      text: "I've moved 6 times in the last decade and this was by far the most professional experience. The real-time tracking gave me complete peace of mind.",
      tag: "Solo Move",
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "David & Lin Chen",
      location: "Oulu → Helsinki",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      rating: 5,
      text: "Cross-country move with two kids and a dog. MoveMate Pro handled everything — packing, transport, even reassembled our furniture. Worth every cent.",
      tag: "Long Distance",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Emma Virtanen",
      location: "Jyväskylä → Lahti",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
      rating: 5,
      text: "The white-glove tier is incredible. They wrapped every glass individually and not a single item was damaged. My new apartment was set up perfectly.",
      tag: "Premium Service",
      image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80"
    },
  ];

  return (
    <main className="min-h-screen relative bg-brand-50 selection:bg-accent-500 selection:text-white pb-32">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass border-b border-brand-500/5 px-6 lg:px-24 h-20 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3 text-surface-900/60 hover:text-brand-500 transition-colors group"
        >
          <ChevronLeft size={20} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Home</span>
        </button>
      </nav>

      <section className="pt-24 pb-16 px-6 lg:px-24 max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <span className="text-accent-500 text-[10px] font-black uppercase tracking-[0.4em]">Testimonials</span>
          <h1 className="text-4xl lg:text-6xl font-display font-black text-surface-900 tracking-tighter">
            Moves We're Proud Of.
          </h1>
          <p className="text-surface-900/90 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Hear from families and businesses who have experienced the MoveMate Pro standard of relocation.
          </p>
        </div>

        <div className="space-y-12">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-[2rem] shadow-xl shadow-brand-500/5 border border-brand-500/10 p-6 sm:p-8 flex flex-col gap-6 w-full max-w-[600px] mx-auto">
              
              {/* Header: Quote & Badge */}
              <div className="flex justify-between items-start">
                <div className="text-brand-500/20">
                  <Quote size={40} strokeWidth={2} />
                </div>
                <div className="px-4 py-2 bg-brand-50 rounded-xl border border-brand-500/10 flex-shrink-0">
                  <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{t.tag}</span>
                </div>
              </div>
              
              {/* Stars */}
              <div className="flex gap-1.5 justify-start">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} size={20} fill="#f59e0b" className="text-amber-500" />
                ))}
              </div>

              {/* Text */}
              <p className="text-surface-900/90 text-lg md:text-xl leading-relaxed font-medium italic w-full">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Profile Meta Data */}
              <div className="flex items-center gap-4 pt-4 border-t border-brand-500/5 mt-2">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover shadow-md flex-shrink-0"
                />
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-black text-surface-900 uppercase tracking-wider">{t.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={14} className="text-accent-500 flex-shrink-0" />
                    <span className="text-[10px] font-bold text-surface-900/80 uppercase tracking-widest">{t.location}</span>
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
