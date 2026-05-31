"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getAddresses, saveAddress, deleteAddress, SavedAddress } from "@/lib/firestore";
import { MeshBackground } from "@/components/MeshBackground";
import {
  Mail, MapPin, Plus, Trash2, LogOut,
  Shield, Bell, HelpCircle, Star, ChevronRight
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<(SavedAddress & { id: string })[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    // Auth redirect removed to allow guest access to view landing state
  }, []);

  useEffect(() => {
    if (user) {
      getAddresses(user.uid).then(setAddresses).catch(console.error);
    }
  }, [user]);

  const handleAddAddress = async () => {
    if (!user || !newLabel.trim() || !newAddress.trim()) return;
    const id = await saveAddress(user.uid, {
      label: newLabel.trim(),
      address: newAddress.trim(),
      lat: 60.17 + Math.random() * 0.1,
      lng: 24.94 + Math.random() * 0.1,
    });
    setAddresses([...addresses, { id, label: newLabel.trim(), address: newAddress.trim(), lat: 0, lng: 0 }]);
    setNewLabel(""); setNewAddress(""); setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteAddress(user.uid, id);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-background">
        <MeshBackground />
        <div className="relative z-10 max-w-lg lg:max-w-[1400px] mx-auto px-6 lg:px-10 pt-12 lg:pt-10 pb-24 text-center animate-fade-in">
          <div className="glass-light shadow-2xl shadow-brand-500/10 border border-white/60 rounded-[3rem] p-16 space-y-10">
            <div className="w-32 h-32 rounded-[3.5rem] bg-brand-500/5 flex items-center justify-center mx-auto border border-brand-500/10 shadow-inner">
              <Shield size={64} className="text-brand-500/30" strokeWidth={1} />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-display font-black text-surface-900 tracking-tight">PROFILE LOCKED</h1>
              <p className="text-xs font-black uppercase tracking-widest text-surface-900/80 max-w-sm mx-auto leading-relaxed">
                Please authenticate your account to access saved locations, security protocols, and premium preferences.
              </p>
            </div>
            <button 
              onClick={() => router.push("/login")}
              className="px-12 py-5 rounded-[2.5rem] bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest btn-tactile shadow-2xl shadow-brand-500/30 mx-auto block"
            >
              Sign In
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative">
      <div className="relative z-10 max-w-lg lg:max-w-[1400px] mx-auto px-6 lg:px-10 pt-12 lg:pt-10 pb-24">
        <div className="flex flex-col gap-8">
          {/* Top Column: Profile & Settings */}
          <div className="space-y-6">
            {/* Profile Header Card */}
            <div className="glass-light shadow-2xl shadow-brand-500/10 border border-white/60 rounded-[2.5rem] p-6 animate-fade-in relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 group-hover:bg-brand-500/10 transition-all duration-1000" />
              
              <div className="flex flex-col items-center text-center relative z-10 w-full px-2">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-[2rem] gradient-brand flex items-center justify-center text-white text-3xl font-display font-black shadow-xl shadow-brand-500/30 border-4 border-white">
                    {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white shadow-lg border border-brand-100 flex items-center justify-center">
                    <Star size={14} className="text-brand-500" fill="currentColor" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-display font-black text-surface-900 tracking-tight break-words px-4 leading-tight">{user.displayName || "Explorer"}</h2>
                <div className="flex items-center justify-center gap-2 mt-3 px-4 py-2 rounded-full glass-light border border-white/40 shadow-sm max-w-full">
                  <Mail size={14} className="text-brand-500 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-surface-900/60 truncate">{user.email}</span>
                </div>
              </div>
            </div>

            {/* Premium Menu Settings */}
            <section className="glass-light shadow-xl shadow-brand-500/5 border border-white/60 rounded-[2.5rem] p-3 space-y-2 animate-slide-up block" style={{ animationDelay: "0.2s" }}>
              {[
                { icon: Bell, label: "Smart Alerts", desc: "Notification preferences", color: "text-blue-500", bg: "bg-blue-500/5" },
                { icon: Shield, label: "Security", desc: "Two-factor auth & locks", color: "text-emerald-500", bg: "bg-emerald-500/5" },
                { icon: Star, label: "Premium Membership", desc: "Check your gold status", color: "text-amber-500", bg: "bg-amber-500/5" },
                { icon: HelpCircle, label: "Support Concierge", desc: "24/7 dedicated help", color: "text-brand-500", bg: "bg-brand-500/5" },
              ].map(({ icon: Icon, label, desc, color, bg }) => (
                <button key={label} className="w-full flex items-center gap-4 p-3 lg:p-4 rounded-[2rem] hover:bg-brand-500/5 transition-all group relative overflow-hidden text-left">
                  <div className={`w-12 h-12 shrink-0 rounded-2xl ${bg} flex items-center justify-center ${color} shadow-sm border border-white/20 transition-all group-hover:scale-105`}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                     <p className="text-xs font-black text-surface-900 tracking-tight group-hover:text-brand-600 transition-colors uppercase leading-tight mb-0.5 truncate">{label}</p>
                     <p className="text-[9px] font-bold text-surface-900/80 uppercase tracking-widest leading-none truncate">{desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-surface-900/80 group-hover:text-brand-500 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </section>

            {/* Special Logout Action */}
            <button
              onClick={handleLogout}
              className="flex w-full py-4 rounded-[2.5rem] bg-white border border-red-100 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] items-center justify-center gap-3 btn-tactile hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-white/20 group-hover:text-white transition-all">
                <LogOut size={16} strokeWidth={3} />
              </div>
              Sign Out
            </button>
          </div>

          {/* Bottom Column: Content */}
          <div className="space-y-8">
            {/* Saved Addresses Section */}
            <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4 px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-900/80 flex items-center gap-2">
                  <MapPin size={14} className="text-brand-500" strokeWidth={3} /> Saved Locations
                </h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all btn-tactile shadow-lg ${
                    showAddForm 
                      ? "bg-surface-900 text-white shadow-black/20 rotate-45" 
                      : "bg-white text-brand-500 shadow-brand-500/5 border border-white/60"
                  }`}
                >
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>

              {showAddForm && (
                <div className="glass-light shadow-2xl shadow-brand-500/5 border border-white rounded-[2.5rem] p-6 space-y-4 mb-6 animate-scale-in">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 px-2">Label</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Home, Office" 
                      value={newLabel} 
                      onChange={(e) => setNewLabel(e.target.value)} 
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 ring-brand-500/5 transition-all outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 px-2">Address</label>
                    <input 
                      type="text" 
                      placeholder="Enter full address" 
                      value={newAddress} 
                      onChange={(e) => setNewAddress(e.target.value)} 
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 ring-brand-500/5 transition-all outline-none" 
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setShowAddForm(false)} 
                      className="flex-1 py-4 rounded-2xl bg-surface-900/5 text-surface-900/80 text-[10px] font-black uppercase tracking-widest hover:bg-surface-900/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddAddress} 
                      className="flex-1 py-4 rounded-2xl bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest btn-tactile shadow-xl shadow-brand-500/20"
                    >
                      Add Point
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <div className="glass-light shadow-sm border border-white/40 rounded-[2rem] p-10 text-center">
                    <div className="w-16 h-16 bg-surface-900/5 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                      <MapPin size={24} className="text-surface-900/80" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-surface-900/80 italic">Explore and save locations</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className="glass-light shadow-sm border border-white/60 rounded-[2rem] p-5 flex items-center gap-5 group hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5 transition-all">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-brand-500 shadow-sm border border-brand-50 group-hover:scale-105 transition-all">
                        <MapPin size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-surface-900 uppercase tracking-tight">{addr.label}</p>
                        <p className="text-[10px] font-bold text-surface-900/80 truncate uppercase tracking-tighter">{addr.address}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(addr.id)} 
                        className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all btn-tactile flex items-center justify-center border border-red-100 shadow-sm shadow-red-500/5"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-surface-900/80 lg:hidden">MoveMate Pro • Version 1.0.0</p>
          </div>
        </div>
        <p className="hidden lg:block text-center text-[10px] font-black uppercase tracking-[0.4em] text-surface-900/80 mt-12">MoveMate Pro • Version 1.0.0</p>
      </div>
    </main>
  );
}
