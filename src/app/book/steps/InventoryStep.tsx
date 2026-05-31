"use client";

import { useBooking } from "@/lib/booking-context";
import { useState } from "react";
import {
  BedDouble, Sofa, Table, Tv, Refrigerator, WashingMachine,
  AirVent, Microwave, UtensilsCrossed, Shirt, Briefcase, GlassWater,
  Frame, Palette, Monitor, Armchair, Server, FolderClosed, Archive,
  Bike, Car, ChevronDown, Plus, Minus, PlusCircle,
  Scan, CheckCircle2, AlertTriangle, Box
} from "lucide-react";
import CameraScanner from "@/components/CameraScanner";
import type { ScanResult } from "@/components/CameraScanner";

interface Category {
  name: string;
  icon: React.ElementType;
  items: { name: string; icon: React.ElementType }[];
}

const HOME_CATEGORIES: Category[] = [
  {
    name: "Furniture",
    icon: Sofa,
    items: [
      { name: "Bed", icon: BedDouble },
      { name: "Sofa", icon: Sofa },
      { name: "Table", icon: Table },
    ],
  },
  {
    name: "Electronics",
    icon: Tv,
    items: [
      { name: "TV", icon: Tv },
      { name: "Fridge", icon: Refrigerator },
      { name: "Washing Machine", icon: WashingMachine },
      { name: "AC", icon: AirVent },
      { name: "Microwave", icon: Microwave },
    ],
  },
  {
    name: "Kitchen Items",
    icon: UtensilsCrossed,
    items: [{ name: "Kitchen Box", icon: UtensilsCrossed }],
  },
  {
    name: "Clothes / Luggage",
    icon: Shirt,
    items: [
      { name: "Clothes Bag", icon: Shirt },
      { name: "Suitcase", icon: Briefcase },
    ],
  },
  {
    name: "Fragile Items",
    icon: GlassWater,
    items: [
      { name: "Glass Item", icon: GlassWater },
      { name: "Mirror", icon: Frame },
      { name: "Artwork", icon: Palette },
    ],
  },
];

const OFFICE_CATEGORIES: Category[] = [
  {
    name: "Workstations",
    icon: Monitor,
    items: [{ name: "Workstation", icon: Monitor }],
  },
  {
    name: "Chairs",
    icon: Armchair,
    items: [{ name: "Office Chair", icon: Armchair }],
  },
  {
    name: "IT Equipment",
    icon: Server,
    items: [{ name: "Server", icon: Server }],
  },
  {
    name: "Documents",
    icon: FolderClosed,
    items: [{ name: "Document Box", icon: FolderClosed }],
  },
  {
    name: "Storage",
    icon: Archive,
    items: [{ name: "Storage Unit", icon: Archive }],
  },
];

const VEHICLE_CATEGORIES: Category[] = [
  {
    name: "Vehicles",
    icon: Car,
    items: [
      { name: "Bike", icon: Bike },
      { name: "Car", icon: Car },
    ],
  },
];

export default function InventoryStep() {
  const { state, updateState } = useBooking();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [customItem, setCustomItem] = useState("");
  const [showCameraScanner, setShowCameraScanner] = useState(false);

  const handleScanComplete = (result: ScanResult) => {
    const newItems = [...state.items];
    result.items.forEach((aiItem) => {
      const index = newItems.findIndex((i) => i.name === aiItem.name);
      if (index > -1) {
        newItems[index].quantity += aiItem.quantity;
        newItems[index].isFragile = aiItem.isFragile || newItems[index].isFragile;
      } else {
        newItems.push({
          category: aiItem.category || "Custom",
          name: aiItem.name,
          quantity: aiItem.quantity,
          isFragile: aiItem.isFragile,
          volume: aiItem.m3,
        });
      }
    });

    updateState({
      items: newItems,
      aiEstimatedVolume: (state.aiEstimatedVolume || 0) + result.totalVolume,
    });

    setShowCameraScanner(false);
  };

  const categories =
    state.moveType === "office" ? OFFICE_CATEGORIES :
    state.moveType === "vehicle" ? VEHICLE_CATEGORIES :
    HOME_CATEGORIES;

  const getItemQty = (name: string) => state.items.find((i) => i.name === name)?.quantity || 0;

  const setItemQty = (category: string, name: string, qty: number) => {
    const existing = state.items.filter((i) => i.name !== name);
    if (qty > 0) {
      existing.push({ category, name, quantity: qty });
    }
    updateState({ items: existing });
  };

  const addCustom = () => {
    if (!customItem.trim()) return;
    const existing = state.items.filter((i) => i.name !== customItem.trim());
    existing.push({ category: "Custom", name: customItem.trim(), quantity: 1 });
    updateState({ items: existing });
    setCustomItem("");
  };

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-display font-black text-surface-900 mb-1 uppercase tracking-tight">Select Your Items</h2>
          <p className="text-surface-900/80 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
            {totalItems} item{totalItems !== 1 ? "s" : ""} selected
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowCameraScanner(true)}
            className="flex items-center gap-3 px-8 py-4.5 rounded-[2rem] bg-brand-600 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all btn-tactile shadow-2xl shadow-brand-500/30 group"
          >
            <Scan size={20} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
            Smart AI Scan
          </button>
        </div>
      </div>

      {state.aiEstimatedVolume && state.aiEstimatedVolume > 0 && (
        <div className="glass-light shadow-2xl shadow-brand-500/10 border-brand-500/20 rounded-[2.5rem] p-7 flex items-center gap-5 animate-scale-in relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="w-16 h-16 rounded-[1.5rem] bg-brand-500/10 flex items-center justify-center shadow-inner relative z-10">
            <Box size={32} className="text-brand-500" strokeWidth={2.5} />
          </div>
          <div className="flex-1 relative z-10">
            <p className="text-[10px] text-surface-900/80 uppercase tracking-[0.3em] font-black mb-1.5">AI Inventory Scale</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-black text-surface-900 tracking-tighter">
                {state.aiEstimatedVolume.toFixed(1)}
              </span>
              <span className="text-xs font-black text-brand-500 tracking-widest uppercase">Cubic Meters</span>
            </div>
          </div>
          <div className="shrink-0 relative z-10">
            <div className="px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 text-[9px] font-black text-accent-600 flex items-center gap-2 uppercase tracking-widest shadow-sm">
              <CheckCircle2 size={12} strokeWidth={3} /> AI Verified
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {categories.map((cat, idx) => {
          const isOpen = expanded === cat.name;
          const catCount = cat.items.reduce((sum, i) => sum + getItemQty(i.name), 0);

          return (
            <div 
              key={cat.name} 
              className={`glass-light shadow-xl shadow-brand-500/5 border-brand-500/10 rounded-[2.5rem] overflow-hidden group transition-all duration-500 animate-slide-up`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : cat.name)}
                className={`w-full flex items-center gap-5 p-6 transition-all duration-300 ${isOpen ? 'bg-brand-500/5 shadow-inner' : 'hover:bg-brand-500/5'}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-brand-600 text-white shadow-2xl shadow-brand-500/40 scale-110' : 'bg-brand-500/5 text-brand-500'}`}>
                  <cat.icon size={28} strokeWidth={isOpen ? 3 : 2} />
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-sm font-black uppercase tracking-[0.2em] ${isOpen ? 'text-brand-600' : 'text-surface-900'}`}>{cat.name}</p>
                  {catCount > 0 && !isOpen && (
                    <p className="text-[10px] font-black text-accent-500 mt-1 uppercase tracking-widest">
                      {catCount} Item{catCount !== 1 ? 's' : ''} Packed
                    </p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-brand-600 text-white rotate-180 shadow-lg shadow-brand-500/20' : 'bg-surface-100 text-surface-900/80'}`}>
                  <ChevronDown size={20} strokeWidth={3} />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 space-y-5 animate-slide-up">
                  {cat.items.map((item) => {
                    const qty = getItemQty(item.name);
                    const isFragile = state.items.find(i => i.name === item.name)?.isFragile;
                    return (
                      <div key={item.name} className="flex items-center justify-between group/item p-4 rounded-[2rem] bg-white shadow-sm border border-brand-500/10">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner ${qty > 0 ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'bg-surface-50 text-surface-300'}`}>
                            <item.icon size={24} strokeWidth={2.5} />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-black transition-colors ${qty > 0 ? 'text-surface-900' : 'text-surface-900/80'}`}>{item.name}</span>
                            {qty > 0 && isFragile && (
                              <span className="text-[8px] font-black text-accent-500 flex items-center gap-1.5 mt-1 tracking-[0.2em] uppercase">
                                <AlertTriangle size={10} strokeWidth={3} className="animate-pulse" /> Careful: Fragile
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-surface-50 p-1.5 rounded-2xl shadow-inner border border-brand-500/5">
                          <button
                            onClick={() => setItemQty(cat.name, item.name, Math.max(0, qty - 1))}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all btn-tactile ${qty > 0 ? 'bg-brand-600 text-white shadow-lg' : 'bg-white text-surface-200'}`}
                          >
                            <Minus size={20} strokeWidth={3} />
                          </button>
                          <div className="w-10 flex flex-col items-center">
                            <span className={`text-sm font-black transition-colors ${qty > 0 ? "text-brand-600" : "text-surface-200"}`}>
                              {qty}
                            </span>
                          </div>
                          <button
                            onClick={() => setItemQty(cat.name, item.name, qty + 1)}
                            className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center transition-all btn-tactile shadow-lg shadow-brand-500/30"
                          >
                            <Plus size={20} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom item */}
      <div className="glass-light shadow-xl shadow-brand-500/5 border-brand-500/10 rounded-[2.5rem] p-8 animate-fade-in relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-900/80 mb-4 flex items-center gap-2 px-1">
          <PlusCircle size={16} className="text-accent-500" strokeWidth={3} /> Something Else?
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Type item name..."
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            className="flex-1 !py-4.5 !rounded-2xl !px-6 shadow-xl shadow-brand-500/5 focus:shadow-brand-500/10 transition-all font-bold placeholder:text-surface-200"
          />
          <button
            onClick={addCustom}
            className="px-10 py-4 sm:py-0 rounded-2xl bg-brand-700 text-white text-[10px] font-black uppercase tracking-widest btn-tactile shadow-2xl shadow-brand-500/20"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Camera Scanner Modal */}
      {showCameraScanner && (
        <CameraScanner
          onScanComplete={handleScanComplete}
          onClose={() => setShowCameraScanner(false)}
        />
      )}
    </div>
  );
}

