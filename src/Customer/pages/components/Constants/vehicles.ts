import sienna from "../../../../assets/sienna.png";
import truck from "../../../../assets/truck.png";
import korope from "../../../../assets/minitruck.png";
import axios from "axios";

export const vehicleData = [
  {id: "", type: "Korope", fare: 5_000, image: korope },
  { id: "", type: "Sienna", fare: 7_500, image: sienna },
  {id: "", type: "Truck", fare: 15_000, image: truck },
];

export const vehicleImageByType = (type: string) =>
  vehicleData.find((v) => v.type === type)?.image || "";

export async function vehicle(name: string, price: number) {
  const response = await axios.post("https://ziplugs.geniusexcel.tech/api/vehicles", {
    name,
    price,
  });

  return response.data;
}

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

export interface BackendVehicle {
  id: string;
  name: string;
  description: string | null;
  price: number;
}

export async function getVehicles(params?: { name?: string; price?: number }) {
  const response = await axios.get<{ message: string; data: BackendVehicle[] }>(
    "https://ziplugs.geniusexcel.tech/api/vehicles",
    { params }
  );
  return response.data.data;
}