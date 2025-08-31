import { Driver } from "../../../../../helper/types";
import axios from "axios";

// export const fetchNearbyDrivers = async (): Promise<Driver[]> => {
//   try {
//     const res = await fetch("https://ziplugs.geniusexcel.tech/api/available-drivers");
//     const json = await res.json();
//     return json.data; // array of drivers
//   } catch {
//     throw new Error("Failed to fetch drivers");
//   }
// };

export const fetchNearbyDrivers = async (): Promise<Driver[]> => {
  try {
    const token = localStorage.getItem("accesToken"); 
    if (!token) throw new Error("No access token found");

    const res = await fetch("https://ziplugs.geniusexcel.tech/api/available-drivers", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to fetch drivers");
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Fetch drivers error:", err);
    throw err;
  }
};



// export const fetchDriverById = async (driverId: string): Promise<Driver> => {
//   try {
//     const res = await fetch(`https://ziplugs.geniusexcel.tech/api/available-drivers/${driverId}`);
//     const json = await res.json();
//     return json.data;
//   } catch {
//     throw new Error("Failed to fetch driver details");
//   }
// };

export const fetchDriverById = async (driverId: string): Promise<Driver> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    const res = await fetch(`https://ziplugs.geniusexcel.tech/api/available-drivers/${driverId}`, {
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


// export async function selectDriverForOrder(driver_id: string, order_number: string) {
//   const response = await axios.post("https://ziplugs.geniusexcel.tech/api/customer-select-driver", {
//     driver_id,
//     order_number,
//   });
//   return response.data;
// }

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
