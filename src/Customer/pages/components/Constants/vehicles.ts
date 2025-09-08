// import sienna from "../../../../assets/sienna.png";
// import truck from "../../../../assets/truck.png";
// import korope from "../../../../assets/minitruck.png";
// import axios from "axios";

// export const vehicleData = [
//   {id: "", name: "Korope", price: 5_000, image: korope, description: "small bus" },
//   { id: "", name: "Sienna", price: 7_500, image: sienna, description: "medium bus" },
//   {id: "", name: "Truck", price: 15_000, image: truck, description: "truck" },
// ];

// export const vehicleImageByName = (name: string) =>
//   vehicleData.find((v) => v.name === name)?.image || "";


// export const MAPBOX_TOKEN = "pk.eyJ1IjoiaGFzdHJvLXRlY2giLCJhIjoiY203bXdkN3hpMGp3bjJrc2RtdW1odTJjbyJ9.YnSynYzhxYvs_XHa0j2QyA";

// export interface BackendVehicle {
//   id: string;
//   name: string;
//   description: string | null;
//   price: number;
// }

// export async function seedVehiclesIfEmpty() {
//   try {
//     const vehicles = await getVehicles();

//     if (!vehicles || vehicles.length === 0) {
//       console.log("Seeding backend with default vehicles...");
//       for (const v of vehicleData) {
//         await vehicle(v.name, v.price); // POST each vehicle
//       }
//     }
//   } catch (err) {
//     console.error("Vehicle seeding failed:", err);
//   }
// }



// export async function vehicle(name: string, price: number) {
//   const token = localStorage.getItem("accessToken");
//   if (!token) throw new Error("No access token found");

//   const response = await axios.post(
//     "https://ziplugs.geniusexcel.tech/api/vehicles",
//     { name, price },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   return response.data;
// }

// export async function getVehicles(params?: { name?: string; price?: number }) {
//   const token = localStorage.getItem("accessToken");
//   if (!token) throw new Error("No access token found");

//   const response = await axios.get<{ message: string; data: BackendVehicle[] }>(
//     "https://ziplugs.geniusexcel.tech/api/vehicles",
//     {
//       params,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return response.data.data;
// }

import axios from "axios";


export interface BackendVehicle {
  id: string;
  name: string;
  description: string | null;
  price: number;
}

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface UseVehicles {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

import sienna from "../../../../assets/sienna.png";
import truck from "../../../../assets/truck.png";
import korope from "../../../../assets/minitruck.png";


export const vehicleData: Vehicle[] = [
  { id: "default-1", name: "Korope", price: 5_000, image: korope, description: "small bus" },
  { id: "default-2", name: "Sienna", price: 7_500, image: sienna, description: "medium bus" },
  { id: "default-3", name: "Truck", price: 15_000, image: truck, description: "truck" },
];

export const vehicleImageByName = (name: string): string =>
  vehicleData.find((v) => v.name === name)?.image || "";


// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Authentication required. Please log in again.");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function createVehicle(name: string, price: number): Promise<BackendVehicle> {
  try {
    const response = await axios.post(
      `https://ziplugs.geniusexcel.tech/api/vehicles`,
      { name, price },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create vehicle:", error);
    throw new Error("Failed to create vehicle. Please try again.");
  }
}

export async function getVehicles(params?: { name?: string; price?: number }): Promise<BackendVehicle[]> {
  try {
    const headers = getAuthHeaders();
    
    // If your API expects parameters in the body for GET requests (unusual but as per your docs)
    const response = await axios.get<{ message: string; data: BackendVehicle[] }>(
      `https://ziplugs.geniusexcel.tech/api/vehicles`,
      {
        headers,
        // If using query parameters (more standard):
        params,
        // If your API really needs body parameters for GET (uncommon):
        // data: params
      }
    );

    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    
    // Handle specific error cases
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Session expired. Please log in again.");
      }
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to view vehicles.");
      }
    }
    
    throw new Error("Failed to load vehicles. Please try again.");
  }
}

export async function seedVehiclesIfEmpty(): Promise<void> {
  try {
    const vehicles = await getVehicles();

    if (!vehicles || vehicles.length === 0) {
      console.log("Seeding backend with default vehicles...");
      
      const seedPromises = vehicleData.map(v => 
        createVehicle(v.name, v.price)
          .catch(err => {
            console.error(`Failed to seed vehicle ${v.name}:`, err);
            return null;
          })
      );
      
      const results = await Promise.allSettled(seedPromises);
      const successful = results.filter(r => r.status === "fulfilled").length;
      
      console.log(`Seeded ${successful}/${vehicleData.length} vehicles successfully`);
    }
  } catch (err) {
    console.error("Vehicle seeding failed:", err);
    throw err; // Re-throw to let the calling code handle it
  }
}

import { useState, useEffect, useCallback } from "react";

export function useVehicles(): UseVehicles {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const backendVehicles = await getVehicles();
      // Map backend vehicles to Vehicle[]
      const mapped = backendVehicles.map((v) => ({
        ...v,
        image: vehicleImageByName(v.name),
        description: v.description || "",
      }));
      setVehicles(mapped);
    } catch (err: any) {
      setError(err.message || "Failed to load vehicles");
      setVehicles(vehicleData); // fallback to defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles,
  };
}