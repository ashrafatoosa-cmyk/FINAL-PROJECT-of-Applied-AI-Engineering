export interface BookingItem {
  category: string;
  name: string;
  quantity: number;
  isFragile?: boolean;
  volume?: number; // m3
}

export interface PriceBreakdown {
  baseFare: number;
  distanceCost: number;
  itemHandling: number;
  packingCost: number;
  unpackingCost: number;
  insuranceCost: number;
  floorCharge: number;
  expressSurcharge: number;
  taxes: number;
  discount: number;
  total: number;
}

interface PricingInput {
  distance: number;
  items: BookingItem[];
  moveType: string;
  services: {
    packing: boolean;
    unpacking: boolean;
    insurance: boolean;
    express: boolean;
  };
  pickup: { floor: number; hasLift: boolean };
  drop: { floor: number; hasLift: boolean };
  couponDiscount?: number;
  hasLoginDiscount?: boolean;
}

const BASE_FARE = 49;
const RATE_PER_KM = 3.5;
const ITEM_RATES: Record<string, number> = {
  "Bed": 25,
  "Sofa": 30,
  "Table": 15,
  "Chair": 8,
  "TV": 20,
  "Fridge": 35,
  "Washing Machine": 30,
  "AC": 25,
  "Microwave": 10,
  "Kitchen Box": 8,
  "Clothes Bag": 5,
  "Suitcase": 6,
  "Glass Item": 15,
  "Mirror": 18,
  "Artwork": 20,
  "Workstation": 20,
  "Office Chair": 10,
  "Server": 50,
  "Document Box": 5,
  "Storage Unit": 40,
  "Bike": 60,
  "Car": 150,
  "Custom Item": 12,
};
const PACKING_RATE = 0.15;
const UNPACKING_RATE = 0.10;
const INSURANCE_RATE = 0.05;
const EXPRESS_RATE = 0.30;
const TAX_RATE = 0.08;
const FLOOR_CHARGE_NO_LIFT = 5;
const FLOOR_CHARGE_WITH_LIFT = 1;

export function calculatePrice(input: PricingInput): PriceBreakdown {
  const baseFare = BASE_FARE;
  const distanceCost = Math.round(input.distance * RATE_PER_KM * 100) / 100;

  let itemHandling = 0;
  for (const item of input.items) {
    const rate = ITEM_RATES[item.name] ?? ITEM_RATES["Custom Item"];
    let itemTotal = rate * item.quantity;
    
    // Add 20% surcharge for fragile items
    if (item.isFragile) {
      itemTotal *= 1.2;
    }
    
    itemHandling += itemTotal;
  }

  const subtotalBeforeServices = baseFare + distanceCost + itemHandling;

  const packingCost = input.services.packing
    ? Math.round(subtotalBeforeServices * PACKING_RATE * 100) / 100
    : 0;

  const unpackingCost = input.services.unpacking
    ? Math.round(subtotalBeforeServices * UNPACKING_RATE * 100) / 100
    : 0;

  const insuranceCost = input.services.insurance
    ? Math.round(subtotalBeforeServices * INSURANCE_RATE * 100) / 100
    : 0;

  // Floor charges
  let floorCharge = 0;
  const pickupFloors = Math.max(0, input.pickup.floor - 1);
  const dropFloors = Math.max(0, input.drop.floor - 1);
  floorCharge += pickupFloors * (input.pickup.hasLift ? FLOOR_CHARGE_WITH_LIFT : FLOOR_CHARGE_NO_LIFT);
  floorCharge += dropFloors * (input.drop.hasLift ? FLOOR_CHARGE_WITH_LIFT : FLOOR_CHARGE_NO_LIFT);
  floorCharge *= Math.max(1, Math.ceil(input.items.length / 3));

  const preExpressTotal = subtotalBeforeServices + packingCost + unpackingCost + insuranceCost + floorCharge;

  const expressSurcharge = input.services.express
    ? Math.round(preExpressTotal * EXPRESS_RATE * 100) / 100
    : 0;

  const preTaxTotal = preExpressTotal + expressSurcharge;
  const taxes = Math.round(preTaxTotal * TAX_RATE * 100) / 100;

  // Login Discount (20%)
  const loginDiscount = input.hasLoginDiscount
    ? Math.round(preTaxTotal * 0.20 * 100) / 100
    : 0;

  // Coupon Discount
  const couponDiscount = input.couponDiscount
    ? Math.round(preTaxTotal * (input.couponDiscount / 100) * 100) / 100
    : 0;

  const totalDiscount = loginDiscount + couponDiscount;
  const total = Math.round((preTaxTotal + taxes - totalDiscount) * 100) / 100;

  return {
    baseFare,
    distanceCost,
    itemHandling,
    packingCost,
    unpackingCost,
    insuranceCost,
    floorCharge,
    expressSurcharge,
    taxes,
    discount: totalDiscount,
    total,
  };
}

export const COUPONS: Record<string, number> = {
  "MOVE10": 10,
  "FIRST20": 20,
  "SAVE15": 15,
  "WELCOME5": 5,
};

export function validateCoupon(code: string): number | null {
  return COUPONS[code.toUpperCase()] ?? null;
}
