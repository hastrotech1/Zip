import { Driver } from "../../../../../helper/types";
import axios from "axios";

// export const fetchNearbyDrivers = async (): Promise<Driver[]> => {
//   try {
//     const token = localStorage.getItem("accessToken"); 
//     if (!token) throw new Error("No access token found");

//     const res = await fetch("https://ziplugs.geniusexcel.tech/api/available-drivers", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.detail || "Failed to fetch drivers");
//     }

//     const json = await res.json();
//     return json.data;
//   } catch (err) {
//     console.error("Fetch drivers error:", err);
//     throw err;
//   }
// };

export const fetchNearbyDrivers = async (): Promise<Driver[]> => {
  try {
    const token = localStorage.getItem("accessToken"); 
    if (!token) throw new Error("No access token found");

    const res = await fetch("https://ziplugs.geniusexcel.tech/api/available-drivers", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("API Error Response:", errorData);
      throw new Error(errorData.detail || errorData.message || "Failed to fetch drivers");
    }

    const json = await res.json();
    
    // Debug logging - check what we're actually getting
    console.log("Full API Response:", json);
    console.log("Drivers data:", json.data);
    console.log("First driver:", json.data?.[0]);
    
    // Check if data exists and is an array
    if (!json.data) {
      console.error("No 'data' field in response");
      return [];
    }
    
    if (!Array.isArray(json.data)) {
      console.error("'data' field is not an array:", typeof json.data);
      return [];
    }
    
    if (json.data.length === 0) {
      console.warn("No drivers available");
      return [];
    }

    // Transform the data to match expected Driver interface
  const transformedDrivers = json.data.map((driver: any, index: number) => {
    // Merge first_name and last_name
    const firstName = driver.first_name || driver.firstName || '';
    const lastName = driver.last_name || driver.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || driver.name || "Unknown Driver";
    
    return {
      id: driver.id || `driver-${index}`,
      name: fullName, // This is now the merged name
      vehicle: driver.vehicle || "Unknown Vehicle",
      profile_pic: driver.profile_pic || 
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=777&color=fff`,
      rating: driver.rating || 4.5,
      eta_minutes: driver.eta_minutes || 5,
      distance_km: driver.distance_km || 1.5,
      phone: driver.phone || "",
    };
  });

    console.log("Transformed drivers:", transformedDrivers);
    return transformedDrivers;
    
  } catch (err) {
    console.error("Fetch drivers error:", err);
    throw err;
  }
};


export const fetchDriverById = async (driver_id: string): Promise<Driver> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    const res = await fetch(`https://ziplugs.geniusexcel.tech/api/available-drivers/${driver_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to fetch driver details");
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Fetch driver error:", err);
    throw err;
  }
};

export async function selectDriverForOrder(driver_id: string, order_number: string) {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No access token found");

  const response = await axios.post(
    "https://ziplugs.geniusexcel.tech/api/customer-select-driver",
    { driver_id, order_number },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
