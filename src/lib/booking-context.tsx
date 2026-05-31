"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { BookingItem } from "./pricing";

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

export interface BookingState {
  step: number;
  pickup: LocationData;
  drop: LocationData;
  distance: number;
  duration: number;
  moveType: string;
  items: BookingItem[];
  services: {
    packing: boolean;
    unpacking: boolean;
    loading: boolean;
    insurance: boolean;
    express: boolean;
  };
  propertyDetails: {
    pickupFloor: number;
    pickupLift: boolean;
    dropFloor: number;
    dropLift: boolean;
    parkingDistance: string;
    narrowStreet: boolean;
  };
  schedule: {
    date: string;
    timeSlot: string;
    urgent: boolean;
  };
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isVerified: boolean;
  };
  paymentStatus: "pending" | "processing" | "succeeded" | "failed";
  paymentIntentId?: string;
  bookingId?: string;
  couponCode: string;
  couponDiscount: number;
  aiEstimatedVolume?: number; // Total m3 from Scan-to-Quote
}

const defaultState: BookingState = {
  step: 1,
  pickup: { address: "", lat: 0, lng: 0 },
  drop: { address: "", lat: 0, lng: 0 },
  distance: 0,
  duration: 0,
  moveType: "",
  items: [],
  services: {
    packing: false,
    unpacking: false,
    loading: true,
    insurance: false,
    express: false,
  },
  propertyDetails: {
    pickupFloor: 1,
    pickupLift: false,
    dropFloor: 1,
    dropLift: false,
    parkingDistance: "",
    narrowStreet: false,
  },
  schedule: {
    date: "",
    timeSlot: "",
    urgent: false,
  },
  personalDetails: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isVerified: false,
  },
  paymentStatus: "pending",
  couponCode: "",
  couponDiscount: 0,
};

interface BookingContextType {
  state: BookingState;
  updateState: (patch: Partial<BookingState>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setPersonalDetails: (details: Partial<BookingState["personalDetails"]>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType>({
  state: defaultState,
  updateState: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  setPersonalDetails: () => {},
  resetBooking: () => {},
});

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>(defaultState);

  const updateState = useCallback((patch: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 11) }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step: Math.max(1, Math.min(step, 11)) }));
  }, []);

  const setPersonalDetails = useCallback((details: Partial<BookingState["personalDetails"]>) => {
    setState((prev) => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, ...details },
    }));
  }, []);

  const resetBooking = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <BookingContext.Provider value={{ state, updateState, setPersonalDetails, nextStep, prevStep, goToStep, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
