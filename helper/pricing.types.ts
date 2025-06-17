export interface VehicleRate {
  basePrice: number;
  pricePerKm: number;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface PricingCalculation {
  distance: number;
  vehicleType: "bus" | "haulage";
  basePrice: number;
  distancePrice: number;
  totalPrice: number;
}
