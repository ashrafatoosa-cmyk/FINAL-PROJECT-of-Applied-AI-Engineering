"use client";

import { Shield, Zap, Globe, Truck, Server, Cpu, Navigation, Activity, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InfrastructurePage() {
  const router = useRouter();

  const capabilities = [
    {
      icon: Server,
      title: "IT Infrastructure Handling",
      desc: "Specialized protocols for server racks, networking equipment, and delicate electronics. Climate-controlled transit.",
      color: "bg-indigo-500",
    },
    {
      icon: Activity,
      title: "After-Hours Deployment",
      desc: "Zero-downtime relocation services executing between 8PM and 6AM for minimal business disruption.",
      color: "bg-amber-500",
    },
    {
      icon: Shield,
      title: "Secure Document Transit",
      desc: "Chain-of-custody protocols for sensitive intellectual property and legal documentation.",
      color: "bg-emerald-500",
    },
    {
      icon: Globe,
      title: "Global Network",
      desc: "A distributed fleet of vetted professionals ready to deploy across major metropolitan sectors globally.",
      color: "bg-blue-500",
    },
    {
      icon: Cpu,
      title: "Neural Engine AI",
      desc: "Our proprietary AI calculates volumetric weight, route optimization, and packing materials in real time.",
      color: "bg-purple-500",
    },
    {
      icon: Navigation,
      title: "Live GPS Telemetry",
      desc: "Sub-second GPS tracking on every asset in the fleet, accessible via your command dashboard.",
      color: "bg-rose-500",
    }
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
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Systems Operational</span>
        </div>
      </nav>

      <section className="pt-24 pb-16 px-6 lg:px-24 max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <span className="text-accent-500 text-[10px] font-black uppercase tracking-[0.4em]">Architecture</span>
          <h1 className="text-4xl lg:text-6xl font-display font-black text-surface-900 tracking-tighter">
            Core Infrastructure.
          </h1>
          <p className="text-surface-900/90 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Engineered for zero-downtime operations. Discover the technology and logistics framework that powers MoveMate Pro.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {capabilities.map((cap, i) => (
            <div key={i} className="group p-8 rounded-[2rem] bg-white border border-brand-500/5 shadow-xl shadow-brand-500/5 hover:border-accent-500/30 transition-all duration-500 hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-2xl ${cap.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                <cap.icon size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-display font-black text-surface-900 tracking-tight mb-3">
                {cap.title}
              </h3>
              <p className="text-surface-900/90 text-sm leading-relaxed">
                {cap.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-20 px-6 lg:px-24">
        <div className="max-w-6xl mx-auto bg-brand-900 rounded-[3rem] overflow-hidden relative">
          <div className="absolute inset-0 bg-accent-500/10 blur-[100px]" />
          <div className="relative z-10 grid grid-cols-2 gap-4 p-8 text-center">
            {[
              { label: "Uptime", value: "99.99%" },
              { label: "Active Fleet", value: "450+" },
              { label: "Data Centers", value: "12" },
              { label: "Avg. Latency", value: "14ms" }
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="text-3xl lg:text-5xl font-display font-black text-white tracking-tighter">{stat.value}</p>
                <p className="text-[10px] text-accent-400/80 font-black uppercase tracking-[0.3em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
