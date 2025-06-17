import { VehicleRate, PricingCalculation, Location } from "./pricing.types";

export const VEHICLE_RATES: Record<string, VehicleRate> = {
  bus: {
    basePrice: 10000,
    pricePerKm: 1000,
  },
  haulage: {
    basePrice: 20000,
    pricePerKm: 1500,
  },
};

export const calculatePrice = (
  distance: number,
  vehicleType: "bus" | "haulage"
): PricingCalculation => {
  const rate = VEHICLE_RATES[vehicleType];
  const basePrice = rate.basePrice;
  const distancePrice = distance * rate.pricePerKm;
  const totalPrice = basePrice + distancePrice;
  return {
    distance,
    vehicleType,
    basePrice,
    distancePrice,
    totalPrice,
  };
};

export const calculateDistance = (
  pointA: Location,
  pointB: Location
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(pointB.lat - pointA.lat);
  const dLon = toRad(pointB.lng - pointA.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pointA.lat)) *
      Math.cos(toRad(pointB.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100;
};

const toRad = (value: number): number => (value * Math.PI) / 180;
