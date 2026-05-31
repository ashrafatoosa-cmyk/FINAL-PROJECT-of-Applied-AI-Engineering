"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Truck, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      const code = (err as any)?.code || "unknown";
      setError(`${msg.replace("Firebase: ", "").replace(/\(auth\/.*\)/, "").trim()} (${code})`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-[#fafafa]">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent-500/5 blur-[120px] rounded-full" />
      
      {/* Back to Homepage */}
      <Link href="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-surface-900/80 hover:text-brand-500 transition-colors text-[10px] font-black uppercase tracking-widest">
        <ArrowLeft size={16} /> Back to Homepage
      </Link>

      {/* Brand */}
      <div className="mb-12 text-center animate-fade-in relative z-10">
        <Link href="/" className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-brand-500 mb-6 shadow-2xl shadow-brand-500/20 animate-pulse-glow hover:scale-105 transition-transform">
          <Truck size={48} className="text-white" strokeWidth={2.5} />
        </Link>
        <h1 className="text-4xl font-display font-black text-surface-900 tracking-tight">
          Move Mate <span className="text-brand-500">Pro</span>
        </h1>
        <p className="text-surface-900/90 mt-2 text-[10px] font-black uppercase tracking-[0.3em]">Smart Moving, Simplified</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm glass shadow-2xl shadow-brand-500/5 border-white rounded-[3rem] p-8 animate-slide-up relative z-10">
        <h2 className="text-xs font-black text-surface-900/80 mb-8 text-center uppercase tracking-[0.2em]">
          {isSignUp ? "Create your moving profile" : "Welcome back to Move Mate"}
        </h2>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest text-center animate-scale-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 px-1">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-900/80 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="text"
                  placeholder="JOHN DOE"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="!pl-12 !py-4 text-xs font-black tracking-widest uppercase"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 px-1">Email Address</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-900/80 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="email"
                placeholder="HELLO@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!pl-12 !py-4 text-xs font-black tracking-widest uppercase"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 px-1">Secure Password</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-900/80 group-focus-within:text-brand-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!pl-12 !pr-12 !py-4 text-xs font-black tracking-widest uppercase"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-900/80 hover:text-brand-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-[2rem] bg-brand-500 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 btn-tactile shadow-2xl shadow-brand-500/40 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? "Create Secure Account" : "Access Personal Profile"}
                <ArrowRight size={16} strokeWidth={3} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[2px] bg-brand-500/5" />
          <span className="text-surface-900/80 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Express Access</span>
          <div className="flex-1 h-[2px] bg-brand-500/5" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-5 rounded-[2rem] bg-white border border-brand-500/10 text-surface-900 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:shadow-xl hover:shadow-brand-500/5 transition-all btn-tactile disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google Identity
        </button>

        {/* Toggle */}
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-surface-900/80 mt-8">
          {isSignUp ? "Already a member?" : "New to Move Mate?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="text-brand-500 hover:text-brand-600 transition-colors ml-1"
          >
            {isSignUp ? "Sign In" : "Register Now"}
          </button>
        </p>
      </div>
    </div>
  );
}
