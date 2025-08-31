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

// export async function vehicle(name: string, price: number) {
//   const response = await axios.post("https://ziplugs.geniusexcel.tech/api/vehicles", {
//     name,
//     price,
//   });

//   return response.data;
// }

export const MAPBOX_TOKEN = "pk.eyJ1IjoiaGFzdHJvLXRlY2giLCJhIjoiY203bXdkN3hpMGp3bjJrc2RtdW1odTJjbyJ9.YnSynYzhxYvs_XHa0j2QyA";

export interface BackendVehicle {
  id: string;
  name: string;
  description: string | null;
  price: number;
}

// export async function getVehicles(params?: { name?: string; price?: number }) {
//   const response = await axios.get<{ message: string; data: BackendVehicle[] }>(
//     "https://ziplugs.geniusexcel.tech/api/vehicles",
//     { params }
//   );
//   return response.data.data;
// }

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
