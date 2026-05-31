"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getBookings, BookingData } from "@/lib/firestore";
import { MapPin, Clock, Package, ChevronRight, Truck, Filter, ClipboardList } from "lucide-react";

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending: { color: "bg-amber-500/10 text-amber-600 border-amber-500/10", label: "Pending" },
  confirmed: { color: "bg-brand-500/10 text-brand-600 border-brand-500/10", label: "Confirmed" },
  in_progress: { color: "bg-blue-500/10 text-blue-600 border-blue-500/10", label: "In Transit" },
  completed: { color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10", label: "Completed" },
  cancelled: { color: "bg-red-500/10 text-red-600 border-red-500/10", label: "Cancelled" },
};

const MOVE_TYPE_LABELS: Record<string, string> = {
  home: "Home Shifting",
  office: "Office Shifting",
  single: "Single Item",
  vehicle: "Vehicle Transport",
};

const DUMMY_BOOKINGS: (BookingData & { id: string })[] = [
  {
    id: "BKG-98231",
    status: "in_progress",
    moveType: "home",
    pickup: { address: "123 Maple Street, Helsinki", lat: 60.1695, lng: 24.9354 },
    drop: { address: "456 Oak Avenue, Espoo", lat: 60.2055, lng: 24.6559 },
    distance: 15.2,
    duration: 45,
    items: [
      { category: "furniture", name: "Living Room Set", quantity: 1 },
      { category: "boxes", name: "Standard Boxes", quantity: 15 }
    ],
    services: { packing: true, unpacking: false, insurance: true, express: false },
    propertyDetails: { pickupFloor: 2, pickupLift: true, dropFloor: 1, dropLift: false, parkingDistance: "10m", narrowStreet: false },
    schedule: { date: "Today", timeSlot: "14:00 - 16:00", urgent: false },
    price: { total: 300, breakdown: { base: 200, distance: 50, items: 50 } },
  },
  {
    id: "BKG-76492",
    status: "confirmed",
    moveType: "office",
    pickup: { address: "Business Park, Vantaa", lat: 60.2932, lng: 25.0373 },
    drop: { address: "City Center, Helsinki", lat: 60.1699, lng: 24.9384 },
    distance: 22.4,
    duration: 60,
    items: [
      { category: "furniture", name: "Office Desks", quantity: 5 },
      { category: "electronics", name: "Computers", quantity: 10 }
    ],
    services: { packing: true, unpacking: true, insurance: true, express: true },
    propertyDetails: { pickupFloor: 5, pickupLift: true, dropFloor: 12, dropLift: true, parkingDistance: "0m", narrowStreet: false },
    schedule: { date: "Tomorrow", timeSlot: "09:00 - 12:00", urgent: true },
    price: { total: 600, breakdown: { base: 400, distance: 80, items: 120 } },
  },
  {
    id: "BKG-12948",
    status: "completed",
    moveType: "single",
    pickup: { address: "IKEA, Espoo", lat: 60.2198, lng: 24.6653 },
    drop: { address: "Student Housing, Helsinki", lat: 60.1873, lng: 24.9312 },
    distance: 8.5,
    duration: 30,
    items: [
      { category: "furniture", name: "Sofa", quantity: 1 }
    ],
    services: { packing: false, unpacking: false, insurance: false, express: false },
    propertyDetails: { pickupFloor: 0, pickupLift: false, dropFloor: 3, dropLift: false, parkingDistance: "20m", narrowStreet: true },
    schedule: { date: "Yesterday", timeSlot: "11:30 - 12:30", urgent: false },
    price: { total: 80, breakdown: { base: 50, distance: 20, items: 10 } },
  }
];

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<(BookingData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // Auth redirect removed to allow guest access to view landing state
  }, []);

  useEffect(() => {
    if (user) {
      getBookings(user.uid)
        .then((data) => {
          if (data.length === 0) {
            setBookings(DUMMY_BOOKINGS);
          } else {
            setBookings(data);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    return (
      <div className="max-w-lg lg:max-w-[1400px] mx-auto px-6 lg:px-10 pt-12 lg:pt-10 pb-24 text-center space-y-12 animate-fade-in">
        <div className="glass-light shadow-2xl shadow-brand-500/10 border border-white/60 rounded-[3rem] p-16 space-y-10">
          <div className="w-32 h-32 rounded-[3.5rem] bg-brand-500/5 flex items-center justify-center mx-auto border border-brand-500/10 shadow-inner">
            <ClipboardList size={64} className="text-brand-500/30" strokeWidth={1} />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-display font-black text-surface-900 tracking-tight">LOGISTICS ACCESS DENIED</h1>
            <p className="text-xs font-black uppercase tracking-widest text-surface-900/80 max-w-sm mx-auto leading-relaxed">
              Authentication is required to synchronize with the fleet operations database and retrieve your move records.
            </p>
          </div>
          <button 
            onClick={() => router.push("/login")}
            className="px-12 py-5 rounded-[2.5rem] bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest btn-tactile shadow-2xl shadow-brand-500/30 mx-auto block"
          >
            Authenticate Session
          </button>
        </div>
      </div>
    );
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="max-w-lg lg:max-w-[1400px] mx-auto px-6 lg:px-10 pt-12 lg:pt-10 pb-24 space-y-12">
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-display font-black text-surface-900 tracking-tight">Activity</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-surface-900/80">Manage your moving orders</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-600 shadow-inner">
          <Truck size={24} strokeWidth={2.5} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
        {["all", "pending", "confirmed", "in_progress", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all btn-tactile whitespace-nowrap ${
              filter === f
                ? "bg-surface-900 text-white shadow-xl shadow-surface-900/20"
                : "glass border-brand-500/5 text-surface-900/80"
            }`}
          >
            {f === "all" ? "EVERYTHING" : STATUS_CONFIG[f]?.label?.toUpperCase() || f}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 animate-fade-in glass rounded-[3rem] border-dashed border-2 border-brand-500/10">
          <div className="w-20 h-20 rounded-[2rem] bg-brand-500/5 flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-brand-500/20" strokeWidth={1} />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-surface-900/80">No records found</p>
          <button onClick={() => router.push("/book")} className="mt-8 px-10 py-4 rounded-2xl bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest btn-tactile shadow-2xl shadow-brand-500/20">
            Start First Move
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filtered.map((b, i) => {
            const isExpanded = expandedId === b.id;
            const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
            return (
              <div
                key={b.id}
                className="glass-light shadow-xl shadow-brand-500/5 border border-white/60 rounded-[2rem] overflow-hidden transition-all animate-slide-up group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : b.id)}
                  className="w-full p-5 lg:p-6 text-left"
                >
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-2xl bg-brand-500/5 flex items-center justify-center text-brand-500 shrink-0 border border-brand-500/10">
                        <Truck size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-surface-900 truncate leading-tight">{MOVE_TYPE_LABELS[b.moveType] || b.moveType}</span>
                    </div>
                    <span className={`text-[8px] px-2.5 py-1 rounded-full border-2 font-black uppercase tracking-widest shrink-0 whitespace-nowrap ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="space-y-3 px-1">
                    <div className="flex items-start gap-4">
                      <MapPin size={14} className="text-brand-500 mt-0.5 shrink-0" strokeWidth={3} />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-surface-900/70 leading-snug truncate">{b.pickup?.address || "Source"}</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="ml-1.5 border-l-2 border-dashed border-brand-500/20 h-4" />
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin size={14} className="text-accent-500 mt-0.5 shrink-0" strokeWidth={3} />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-surface-900/70 leading-snug truncate">{b.drop?.address || "Destination"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-brand-500/5">
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-surface-900/80 min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 truncate"><Clock size={12} className="text-brand-500 shrink-0" /> <span className="truncate">{b.schedule?.date || "N/A"}</span></span>
                      <span className="flex items-center gap-1.5 shrink-0"><Package size={12} className="text-brand-500 shrink-0" /> {b.items?.length || 0} ITEMS</span>
                    </div>
                    <span className="text-lg font-black text-brand-600 tracking-tight shrink-0 pl-2">€{b.price?.total?.toFixed(0) || "0"}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-brand-500/5 pt-5 animate-slide-up space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-surface-900/80 italic">Ref: <span className="text-surface-900/80">{b.id}</span></p>
                    {b.items && b.items.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-surface-900/80 px-1">Inventory Manifest:</p>
                        <div className="flex flex-wrap gap-2">
                          {b.items.map((item, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-xl bg-brand-500/5 text-[9px] font-black uppercase tracking-widest text-brand-600 border border-brand-500/5">
                              {item.name} ×{item.quantity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {b.status === "in_progress" && (
                      <button
                        onClick={() => router.push(`/tracking/${b.id}`)}
                        className="w-full mt-2 py-4 rounded-2xl bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 btn-tactile shadow-xl shadow-brand-500/10"
                      >
                        Launch Tracker <ChevronRight size={14} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
