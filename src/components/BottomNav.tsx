"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PackagePlus, ClipboardList, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/book", icon: PackagePlus, label: "Book" },
  { href: "/bookings", icon: ClipboardList, label: "Bookings" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname === "/login") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass safe-bottom max-w-lg mx-auto border-x border-brand-500/5">
      <div className="flex items-center justify-around w-full h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-300 btn-tactile relative ${
                isActive
                  ? "text-brand-500 scale-110"
                  : "text-surface-900/80 hover:text-brand-500/60"
              }`}
            >
              <div className={`transition-transform duration-300 ${isActive ? "-translate-y-0.5" : ""}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}>
                {label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-5 h-1 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(204,102,153,0.5)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
