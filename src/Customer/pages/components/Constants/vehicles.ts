import sienna from "../../../../assets/sienna.png";
import truck from "../../../../assets/truck.png";
import korope from "../../../../assets/minitruck.png";
import axios from "axios";

export const vehicleData = [
  {id: "Small_bus", name: "Korope", price: 5_000, image: korope },
  { id: "space_bus", name: "Sienna", price: 7_500, image: sienna },
  {id: "truck", name: "Truck", price: 15_000, image: truck },
];

export const vehicleImageByName = (name: string) =>
  vehicleData.find((v) => v.name === name)?.image || "";


export const MAPBOX_TOKEN = "pk.eyJ1IjoiaGFzdHJvLXRlY2giLCJhIjoiY203bXdkN3hpMGp3bjJrc2RtdW1odTJjbyJ9.YnSynYzhxYvs_XHa0j2QyA";

export interface BackendVehicle {
  id: string;
  name: string;
  description: string | null;
  price: number;
}


export async function vehicle(name: string, price: number) {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No access token found");

  const response = await axios.post(
    "https://ziplugs.geniusexcel.tech/api/vehicles",
    { name, price },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function getVehicles(params?: { name?: string; price?: number }) {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No access token found");

  const response = await axios.get<{ message: string; data: BackendVehicle[] }>(
    "https://ziplugs.geniusexcel.tech/api/vehicles",
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
}
