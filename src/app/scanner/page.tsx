"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import CameraScanner from "@/components/CameraScanner";
import type { ScanResult } from "@/components/CameraScanner";

export default function AIScannerPage() {
  const router = useRouter();
  const { updateState, state } = useBooking();

  const handleScanComplete = (result: ScanResult) => {
    // Merge detected items into booking state
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

    // Redirect to booking wizard
    router.push("/book");
  };

  const handleClose = () => {
    router.push("/");
  };

  return <CameraScanner onScanComplete={handleScanComplete} onClose={handleClose} />;
}
