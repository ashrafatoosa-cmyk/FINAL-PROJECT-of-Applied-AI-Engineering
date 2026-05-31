"use client";

import { CheckCircle2, ChevronLeft, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  const plans = [
    {
      name: "Essential",
      price: "$299",
      suffix: "/base",
      desc: "Perfect for studios and 1-bedroom apartments.",
      features: ["AI Volume Scanning", "Standard Insurance", "Loading & Transport", "Real-time Tracking"],
      popular: false,
    },
    {
      name: "Pro",
      price: "$599",
      suffix: "/base",
      desc: "Ideal for 2-3 bedroom homes and small offices.",
      features: ["Everything in Essential", "Full Packing Service", "Premium Insurance", "Priority Scheduling"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      suffix: "",
      desc: "For large estates, corporate offices, and IT relocation.",
      features: ["Dedicated Fleet Command", "White-Glove Handling", "IT Infrastructure Setup", "24/7 After-Hours Deployment"],
      popular: false,
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
      </nav>

      <section className="pt-24 pb-16 px-6 lg:px-24 max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <span className="text-accent-500 text-[10px] font-black uppercase tracking-[0.4em]">Pricing Models</span>
          <h1 className="text-4xl lg:text-6xl font-display font-black text-surface-900 tracking-tighter">
            Transparent Pricing.
          </h1>
          <p className="text-surface-900/90 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            AI-generated instant quotes with no hidden fees. Choose the tier that matches your operational requirements.
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`relative p-6 lg:p-8 rounded-[2.5rem] bg-white border ${plan.popular ? 'border-accent-500 shadow-2xl shadow-accent-500/10 lg:scale-105 z-10' : 'border-brand-500/5 shadow-xl shadow-brand-500/5 mt-0 lg:mt-4'} flex flex-col`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-accent-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-accent-500/30 w-max max-w-[90%]">
                  <Zap size={12} fill="currentColor" className="flex-shrink-0" /> <span className="truncate">Most Deployed</span>
                </div>
              )}
              <h3 className="text-lg lg:text-xl font-black uppercase tracking-widest text-surface-900 mb-2">{plan.name}</h3>
              <p className="text-surface-900/90 text-sm font-medium mb-6 min-h-[40px]">{plan.desc}</p>
              
              <div className="flex items-end gap-1 mb-8 flex-wrap">
                <span className={`${plan.price === 'Custom' ? 'text-4xl' : 'text-5xl'} font-display font-black text-surface-900 tracking-tighter`}>{plan.price}</span>
                <span className="text-surface-900/90 text-sm font-bold pb-1 lg:pb-2 flex-shrink-0">{plan.suffix}</span>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className={plan.popular ? "text-accent-500 flex-shrink-0 mt-0.5" : "text-brand-400 flex-shrink-0 mt-0.5"} strokeWidth={2.5} />
                    <span className="text-sm font-medium text-surface-900/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push("/book")}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${
                  plan.popular 
                  ? "bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/25 hover:scale-105" 
                  : "bg-brand-500/5 text-surface-900 hover:bg-brand-500/10"
                }`}
              >
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
