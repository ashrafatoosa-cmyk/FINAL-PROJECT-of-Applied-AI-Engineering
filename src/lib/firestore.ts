import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ===== Bookings =====
export interface BookingData {
  pickup: { address: string; lat: number; lng: number };
  drop: { address: string; lat: number; lng: number };
  distance: number;
  duration: number;
  moveType: string;
  items: { category: string; name: string; quantity: number }[];
  services: { packing: boolean; unpacking: boolean; insurance: boolean; express: boolean };
  propertyDetails: {
    pickupFloor: number;
    pickupLift: boolean;
    dropFloor: number;
    dropLift: boolean;
    parkingDistance: string;
    narrowStreet: boolean;
  };
  schedule: { date: string; timeSlot: string; urgent: boolean };
  price: { total: number; breakdown: Record<string, number> };
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  couponCode?: string;
  personalDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  isGuest?: boolean;
  createdAt?: Timestamp;
}

export async function createBooking(userId: string, data: BookingData) {
  const ref = collection(db, "users", userId, "bookings");
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function createGuestBooking(data: BookingData) {
  const ref = collection(db, "bookings");
  const docRef = await addDoc(ref, {
    ...data,
    isGuest: true,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getBookings(userId: string) {
  const ref = collection(db, "users", userId, "bookings");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as (BookingData & { id: string })[];
}

export async function getBooking(userId: string, bookingId: string) {
  const ref = doc(db, "users", userId, "bookings", bookingId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as BookingData & { id: string };
}

export async function updateBookingStatus(userId: string, bookingId: string, status: BookingData["status"]) {
  const ref = doc(db, "users", userId, "bookings", bookingId);
  await updateDoc(ref, { status });
}

// ===== Addresses =====
export interface SavedAddress {
  label: string;
  address: string;
  lat: number;
  lng: number;
}

export async function saveAddress(userId: string, data: SavedAddress) {
  const ref = collection(db, "users", userId, "addresses");
  const docRef = await addDoc(ref, data);
  return docRef.id;
}

export async function getAddresses(userId: string) {
  const ref = collection(db, "users", userId, "addresses");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as (SavedAddress & { id: string })[];
}

export async function deleteAddress(userId: string, addressId: string) {
  const ref = doc(db, "users", userId, "addresses", addressId);
  await deleteDoc(ref);
}
