import { Home, Briefcase, Activity, Scan, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      id: "residential",
      icon: Home,
      title: "Residential Logistics",
      description: "End-to-end relocation services for homes and apartments with zero-damage guarantee.",
      features: ["White-glove packing", "Real-time GPS tracking", "Furniture disassembly/assembly"],
      color: "bg-blue-500",
    },
    {
      id: "commercial",
      icon: Briefcase,
      title: "Commercial Relocation",
      description: "Enterprise-grade office moving with minimal downtime and secure asset transport.",
      features: ["IT infrastructure handling", "After-hours deployment", "Secure document transit"],
      color: "bg-amber-500",
    },
    {
      id: "fleet",
      icon: Activity,
      title: "Predictive Fleet Management",
      description: "Our Grade-5 standard telemetry system ensuring our trucks never break down en route.",
      features: ["Live sensor ingestion via MQTT", "AI-driven Remaining Useful Life (RUL)", "Automated LLM reporting"],
      color: "bg-accent-500",
      link: "/fleet-monitor",
      linkText: "View Fleet Command",
    },
    {
      id: "inventory",
      icon: Scan,
      title: "AI Inventory Analysis",
      description: "Neural network spatial analysis to calculate volume and pricing instantly from photos.",
      features: ["Automated quote generation", "Fragile item detection", "Smart truck loading plans"],
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50 font-sans selection:bg-accent-500 selection:text-white pb-24">
      
      {/* Header */}
      <header className="px-6 py-5 border-b border-brand-500/10 glass sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 rounded-xl text-surface-900/80 hover:bg-brand-500/5 hover:text-surface-900 transition-colors">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-xl font-display font-black text-surface-900 tracking-tight leading-none">SERVICES</h1>
            <p className="text-[10px] text-surface-900/80 font-bold uppercase tracking-widest mt-1">MoveMate Capabilities</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 sm:p-6 max-w-lg mx-auto space-y-8 mt-4">
        
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-display font-black text-surface-900 tracking-tighter leading-tight">
            Logistics, <span className="text-accent-500">Reimagined.</span>
          </h2>
          <p className="text-sm text-surface-900/90 leading-relaxed max-w-xs mx-auto">
            From household moves to enterprise fleet tracking, discover our cutting-edge relocation solutions.
          </p>
        </div>

        <div className="grid gap-6">
          {services.map((svc) => (
            <div key={svc.id} className="bg-white rounded-3xl p-6 shadow-xl shadow-brand-500/5 border border-brand-500/5 group hover:border-accent-500/30 transition-all duration-500">
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-12 h-12 ${svc.color} text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <svc.icon size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-surface-900 tracking-tight">{svc.title}</h3>
                  <p className="text-xs text-surface-900/80 mt-1 leading-relaxed">{svc.description}</p>
                </div>
              </div>
              
              <div className="space-y-2.5 mb-5 pl-16">
                {svc.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-surface-900/90 text-xs font-medium">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {feature}
                  </div>
                ))}
              </div>

              {svc.link && (
                <div className="pl-16">
                  <Link 
                    href={svc.link}
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 hover:-translate-y-0.5 transition-all shadow-md shadow-brand-500/20"
                  >
                    {svc.linkText}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
        
      </main>
    </div>
  );
}
