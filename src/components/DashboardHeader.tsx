"use client";
import { usePathname } from "next/navigation";
import { Bell, Settings, Truck, Sparkles, LogIn, Activity } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader() {
  const pathname = usePathname();
  const pageTitle = pathname === "/" ? "Dashboard" : pathname.split("/")[1].charAt(0).toUpperCase() + pathname.split("/")[1].slice(1);

  return (
    <header className="h-14 glass-light border-b border-brand-500/10 flex items-center justify-between px-3 sticky top-0 z-40">
      {/* Logo + App Name */}
      <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-md">
            <Truck size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-accent-500 rounded flex items-center justify-center border border-white">
            <Sparkles size={7} className="text-white" />
          </div>
        </div>
        <div className="leading-none">
          <p className="text-sm font-display font-black text-surface-900 tracking-tight">
            MOVEMATE <span className="text-accent-500">PRO</span>
          </p>
          <p className="text-[8px] tracking-[0.15em] text-surface-900/80 font-bold uppercase mt-0.5">
            {pageTitle}
          </p>
        </div>
      </Link>

      {/* Right-side actions */}
      <div className="flex items-center gap-1">
        <a
          href="/fleet-monitor"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-accent-500 hover:text-white hover:bg-accent-500 transition-all duration-300"
        >
          <Activity size={13} strokeWidth={2.5} className="animate-pulse" />
          Fleet Command
        </a>
        <Link
          href="/login"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-surface-900/80 hover:text-brand-500 hover:bg-brand-500/8 transition-all duration-300"
        >
          <LogIn size={13} strokeWidth={2.5} />
          Sign In
        </Link>
        <button className="relative p-1.5 text-surface-900/80 hover:text-accent-500 transition-colors group">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent-500 rounded-full border border-white animate-pulse shadow-[0_0_6px_rgba(20,184,166,0.5)]" />
        </button>
        <button className="p-1.5 text-surface-900/80 hover:text-accent-500 transition-colors">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
