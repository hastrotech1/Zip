import sienna from "../../../../assets/sienna.png";
import truck from "../../../../assets/truck.png";
import korope from "../../../../assets/minitruck.png";
import axios from "axios";

export const vehicleData = [
  {id: "", name: "Korope", price: 5_000, image: korope, description: "small bus" },
  { id: "", name: "Sienna", price: 7_500, image: sienna, description: "medium bus" },
  {id: "", name: "Truck", price: 15_000, image: truck, description: "truck" },
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

export async function seedVehiclesIfEmpty() {
  try {
    const vehicles = await getVehicles();

    if (!vehicles || vehicles.length === 0) {
      console.log("Seeding backend with default vehicles...");
      for (const v of vehicleData) {
        await vehicle(v.name, v.price); // POST each vehicle
      }
    }
  } catch (err) {
    console.error("Vehicle seeding failed:", err);
  }
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
