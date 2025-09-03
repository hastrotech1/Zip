//All interfaces and types
export interface ShipmentData {
  id: string;
  selected_vehicle: string;
  created_at: string;
  receiver_phone: string;
  status: string;
  customer_order_id: string;
  origin: string;
  destination: string;
  deliveryDate: string;
  shippingCost: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Driver {
  id: string;
  name: string;
  vehicle: string;
  eta_minutes: number;
  distance_km: number;
  rating: number;
  profile_image: string;
  phone: string;
}


export interface Suggest {
  place_name: string;
  center: [number, number];
}

export type ViewState = "form" | "drivers" | "selected";