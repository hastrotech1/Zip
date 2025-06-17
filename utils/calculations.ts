import { Coordinates } from "../helper/types";

export const haversineKm = (a: Coordinates, b: Coordinates): number => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const A =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A)));
};

export const calculateFare = (
  pickup: Coordinates,
  dropoff: Coordinates,
  vehicleType: string,
  vehicleData: any[]
): number => {
  const km = haversineKm(pickup, dropoff);
  const perKm = 1000;
  const base = vehicleData.find((v) => v.type === vehicleType)?.fare || 0;
  return base + km * perKm;
};
