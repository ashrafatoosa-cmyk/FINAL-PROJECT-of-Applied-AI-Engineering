import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { BookingProvider } from "@/lib/booking-context";
import NavigationShell from "@/components/NavigationShell";

export const metadata: Metadata = {
  title: "MoveMate Pro | Premium Logistics",
  description: "High-fidelity moving and packing solutions powered by AI.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MoveMate Pro",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased bg-surface-100 text-surface-900 font-sans min-h-[100dvh]">
        <AuthProvider>
          <BookingProvider>
            <div className="mx-auto max-w-lg min-h-[100dvh] bg-surface-50 shadow-2xl relative pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] overflow-hidden">
              <NavigationShell>{children}</NavigationShell>
            </div>
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

