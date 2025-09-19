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

// import axios from "axios";


// export interface BackendVehicle {
//   id: string;
//   name: string;
//   description: string | null;
//   price: number;
// }

// export interface Vehicle {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
// }

// export interface UseVehicles {
//   vehicles: Vehicle[];
//   loading: boolean;
//   error: string | null;
//   refetch: () => void;
// }

// import sienna from "../../../../assets/sienna.png";
// import truck from "../../../../assets/truck.png";
// import korope from "../../../../assets/minitruck.png";

// export const MAPBOX_TOKEN = "pk.eyJ1IjoiaGFzdHJvLXRlY2giLCJhIjoiY203bXdkN3hpMGp3bjJrc2RtdW1odTJjbyJ9.YnSynYzhxYvs_XHa0j2QyA";


// export const vehicleData: Vehicle[] = [
//   { id: "default-1", name: "Korope", price: 5_000, image: korope, description: "small bus" },
//   { id: "default-2", name: "Sienna", price: 7_500, image: sienna, description: "medium bus" },
//   { id: "default-3", name: "Truck", price: 15_000, image: truck, description: "truck" },
// ];

// export const vehicleImageByName = (name: string): string =>
//   vehicleData.find((v) => v.name === name)?.image || "";


// // Helper function to get auth headers
// const getAuthHeaders = () => {
//   const token = localStorage.getItem("accessToken");
//   if (!token) {
//     throw new Error("Authentication required. Please log in again.");
//   }
//   return {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };
// };

// export async function createVehicle(name: string, price: number): Promise<BackendVehicle> {
//   try {
//     const response = await axios.post(
//       `https://ziplugs.geniusexcel.tech/api/vehicles`,
//       { name, price },
//       { headers: getAuthHeaders() }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Failed to create vehicle:", error);
//     throw new Error("Failed to create vehicle. Please try again.");
//   }
// }

// export async function getVehicles(params?: { name?: string; price?: number }): Promise<BackendVehicle[]> {
//   try {
//     const headers = getAuthHeaders();
    
//     // If your API expects parameters in the body for GET requests (unusual but as per your docs)
//     const response = await axios.get<{ message: string; data: BackendVehicle[] }>(
//       `https://ziplugs.geniusexcel.tech/api/vehicles`,
//       {
//         headers,
//         params,
//       }
//     );

//     return response.data.data || [];
//   } catch (error) {
//     console.error("Failed to fetch vehicles:", error);
    
//     // Handle specific error cases
//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 401) {
//         throw new Error("Session expired. Please log in again.");
//       }
//       if (error.response?.status === 403) {
//         throw new Error("You don't have permission to view vehicles.");
//       }
//     }
    
//     throw new Error("Failed to load vehicles. Please try again.");
//   }
// }

// export async function seedVehiclesIfEmpty(): Promise<void> {
//   try {
//     const vehicles = await getVehicles();

//     if (!vehicles || vehicles.length === 0) {
//       console.log("Seeding backend with default vehicles...");
      
//       const seedPromises = vehicleData.map(v => 
//         createVehicle(v.name, v.price)
//           .catch(err => {
//             console.error(`Failed to seed vehicle ${v.name}:`, err);
//             return null;
//           })
//       );
      
//       const results = await Promise.allSettled(seedPromises);
//       const successful = results.filter(r => r.status === "fulfilled").length;
      
//       console.log(`Seeded ${successful}/${vehicleData.length} vehicles successfully`);
//     }
//   } catch (err) {
//     console.error("Vehicle seeding failed:", err);
//     throw err; // Re-throw to let the calling code handle it
//   }
// }

// import { useState, useEffect, useCallback } from "react";

// export function useVehicles(): UseVehicles {
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchVehicles = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const backendVehicles = await getVehicles();
//       // Map backend vehicles to Vehicle[]
//       const mapped = backendVehicles.map((v) => ({
//         ...v,
//         image: vehicleImageByName(v.name),
//         description: v.description || "",
//       }));
//       setVehicles(mapped);
//     } catch (err: any) {
//       setError(err.message || "Failed to load vehicles");
//       setVehicles(vehicleData); // fallback to defaults
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchVehicles();
//   }, [fetchVehicles]);

//   return {
//     vehicles,
//     loading,
//     error,
//     refetch: fetchVehicles,
//   };
// }

// Fixed vehicles.ts - Comprehensive vehicle management with proper error handling

import { useState, useEffect, useCallback } from "react";
import auth, { APIError } from "../../../../../helper/authenticate";

// Asset imports
import sienna from "../../../../assets/sienna.png";
import truck from "../../../../assets/truck.png";
import korope from "../../../../assets/minitruck.png";

// Types
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

export interface UseVehiclesReturn {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Configuration
export const MAPBOX_TOKEN = "pk.eyJ1IjoiaGFzdHJvLXRlY2giLCJhIjoiY203bXdkN3hpMGp3bjJrc2RtdW1odTJjbyJ9.YnSynYzhxYvs_XHa0j2QyA";

// Default vehicle data with fallback images
export const defaultVehicleData: Vehicle[] = [
  { 
    id: "default-korope", 
    name: "Korope", 
    price: 5000, 
    image: korope, 
    description: "Small delivery vehicle perfect for packages and small items" 
  },
  { 
    id: "default-sienna", 
    name: "Sienna", 
    price: 7500, 
    image: sienna, 
    description: "Medium-sized vehicle for larger deliveries" 
  },
  { 
    id: "default-truck", 
    name: "Truck", 
    price: 15000, 
    image: truck, 
    description: "Heavy-duty vehicle for bulk and oversized items" 
  },
];

// Vehicle image mapping with fallback
export const getVehicleImageByName = (name: string): string => {
  const normalizedName = name.toLowerCase().trim();
  
  // Direct name matches
  const imageMap: Record<string, string> = {
    'korope': korope,
    'sienna': sienna,
    'truck': truck,
  };

  // Try direct match first
  if (imageMap[normalizedName]) {
    return imageMap[normalizedName];
  }

  // Try partial matches
  for (const [key, image] of Object.entries(imageMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return image;
    }
  }

  // Fallback: generate placeholder image
  const fallbackColor = ['FF6B6B', '4ECDC4', '45B7D1', 'F9CA24', 'F0932B'][
    Math.abs(name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 5
  ];
  
  return `https://via.placeholder.com/120x80/${fallbackColor}/FFFFFF?text=${encodeURIComponent(name.charAt(0).toUpperCase())}`;
};

// API functions with comprehensive error handling
export const createVehicle = async (name: string, price: number, description?: string): Promise<BackendVehicle> => {
  try {
    if (!name?.trim()) {
      throw new APIError("Vehicle name is required", 400, "VALIDATION_ERROR");
    }
    
    if (price < 0) {
      throw new APIError("Vehicle price must be non-negative", 400, "VALIDATION_ERROR");
    }

    const payload = {
      name: name.trim(),
      price,
      description: description?.trim() || null
    };

    const response = await auth.apiCall<BackendVehicle>('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log(`Created vehicle: ${name}`);
    return response;
    
  } catch (error) {
    console.error("Failed to create vehicle:", error);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      "Failed to create vehicle. Please try again.",
      500,
      "CREATE_VEHICLE_ERROR"
    );
  }
};

export const getVehicles = async (params?: { 
  name?: string; 
  price?: number;
  limit?: number;
  offset?: number; 
}): Promise<BackendVehicle[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.name) queryParams.append('name', params.name);
    if (params?.price !== undefined) queryParams.append('price', params.price.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `/api/vehicles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await auth.apiCall<{ 
      message: string; 
      data: BackendVehicle[];
      pagination?: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
    }>(url, {
      method: 'GET',
    });

    const vehicles = response.data || [];
    console.log(`Fetched ${vehicles.length} vehicles`);
    
    return vehicles;
    
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    
    if (error instanceof APIError) {
      // Re-throw API errors with context
      throw new APIError(
        `Failed to load vehicles: ${error.message}`,
        error.status,
        error.code
      );
    }
    
    throw new APIError(
      "Failed to load vehicles. Please try again.",
      500,
      "FETCH_VEHICLES_ERROR"
    );
  }
};

export const updateVehicle = async (
  id: string, 
  updates: Partial<Pick<BackendVehicle, 'name' | 'price' | 'description'>>
): Promise<BackendVehicle> => {
  try {
    if (!id?.trim()) {
      throw new APIError("Vehicle ID is required", 400, "VALIDATION_ERROR");
    }

    const response = await auth.apiCall<BackendVehicle>(`/api/vehicles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    console.log(`Updated vehicle: ${id}`);
    return response;
    
  } catch (error) {
    console.error("Failed to update vehicle:", error);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      "Failed to update vehicle. Please try again.",
      500,
      "UPDATE_VEHICLE_ERROR"
    );
  }
};

export const deleteVehicle = async (id: string): Promise<void> => {
  try {
    if (!id?.trim()) {
      throw new APIError("Vehicle ID is required", 400, "VALIDATION_ERROR");
    }

    await auth.apiCall(`/api/vehicles/${id}`, {
      method: 'DELETE',
    });

    console.log(`Deleted vehicle: ${id}`);
    
  } catch (error) {
    console.error("Failed to delete vehicle:", error);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      "Failed to delete vehicle. Please try again.",
      500,
      "DELETE_VEHICLE_ERROR"
    );
  }
};

// Seeding function with better error handling
export const seedVehiclesIfEmpty = async (): Promise<{
  success: boolean;
  seeded: number;
  errors: string[];
}> => {
  const result = {
    success: false,
    seeded: 0,
    errors: [] as string[]
  };

  try {
    console.log("Checking if vehicles need seeding...");
    
    const existingVehicles = await getVehicles({ limit: 1 });

    if (existingVehicles && existingVehicles.length > 0) {
      console.log("Vehicles already exist, skipping seeding");
      result.success = true;
      return result;
    }

    console.log("No vehicles found, seeding default vehicles...");

    const seedPromises = defaultVehicleData.map(async (vehicle) => {
      try {
        await createVehicle(vehicle.name, vehicle.price, vehicle.description);
        result.seeded++;
        return { success: true, vehicle: vehicle.name };
      } catch (error) {
        const errorMsg = `Failed to seed ${vehicle.name}: ${
          error instanceof APIError ? error.message : 'Unknown error'
        }`;
        result.errors.push(errorMsg);
        console.error(errorMsg, error);
        return { success: false, vehicle: vehicle.name, error };
      }
    });

    await Promise.all(seedPromises);

    result.success = result.seeded > 0;
    
    if (result.success) {
      console.log(`Successfully seeded ${result.seeded}/${defaultVehicleData.length} vehicles`);
    } else {
      console.error("Failed to seed any vehicles");
    }

    return result;
    
  } catch (error) {
    console.error("Vehicle seeding process failed:", error);
    
    const errorMsg = error instanceof APIError 
      ? error.message 
      : 'Failed to check existing vehicles';
      
    result.errors.push(errorMsg);
    return result;
  }
};

// React hook with comprehensive state management
export function useVehicles(): UseVehiclesReturn {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformBackendVehicle = useCallback((backendVehicle: BackendVehicle): Vehicle => {
    return {
      id: backendVehicle.id,
      name: backendVehicle.name,
      price: typeof backendVehicle.price === 'string' 
        ? parseFloat(backendVehicle.price) 
        : backendVehicle.price,
      description: backendVehicle.description || `${backendVehicle.name} vehicle`,
      image: getVehicleImageByName(backendVehicle.name),
    };
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to seed vehicles if needed
      await seedVehiclesIfEmpty();

      // Then fetch all vehicles
      const backendVehicles = await getVehicles();
      
      if (!backendVehicles || backendVehicles.length === 0) {
        console.log("No vehicles from backend, using defaults");
        setVehicles(defaultVehicleData);
        setError("Using offline vehicle data. Some features may be limited.");
        return;
      }

      // Transform backend data to frontend format
      const transformedVehicles = backendVehicles.map(transformBackendVehicle);
      setVehicles(transformedVehicles);
      
      console.log(`Loaded ${transformedVehicles.length} vehicles successfully`);
      
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      
      let errorMessage = "Failed to load vehicles";
      
      if (err instanceof APIError) {
        switch (err.status) {
          case 401:
            errorMessage = "Authentication expired. Please log in again.";
            break;
          case 403:
            errorMessage = "You don't have permission to view vehicles.";
            break;
          case 0:
            errorMessage = "Network connection failed. Using offline data.";
            break;
          default:
            errorMessage = err.message;
        }
      }

      setError(errorMessage);
      
      // Fallback to default vehicles
      setVehicles(defaultVehicleData);
      
    } finally {
      setLoading(false);
    }
  }, [transformBackendVehicle]);

  const refetch = useCallback(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    refetch,
  };
}

// Export default for backward compatibility
export default {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  seedVehiclesIfEmpty,
  useVehicles,
  getVehicleImageByName,
  defaultVehicleData,
};