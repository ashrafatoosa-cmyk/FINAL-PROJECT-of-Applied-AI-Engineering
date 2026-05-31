"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import DashboardHeader from "./DashboardHeader";
import BottomNav from "./BottomNav";
import { MeshBackground } from "@/components/MeshBackground";

export default function NavigationShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Paths that should NOT show navigation (e.g., login, or if landing page is full-width)
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  
  // If we're on the root path and not logged in, it shows LandingPage (full width)
  const isLandingPage = pathname === "/" && !user && !loading;

  const showNavigation = !isAuthPage && !isLandingPage && user;

  if (!showNavigation) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex flex-col h-full bg-surface-50 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <MeshBackground />
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <DashboardHeader />
        <main className="flex-1 relative overflow-y-auto pb-24">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
