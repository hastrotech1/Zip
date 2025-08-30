import { Driver } from "../../../../../helper/types";
import axios from "axios";

export const fetchNearbyDrivers = async (): Promise<Driver[]> => {
  try {
    const res = await fetch("https://ziplugs.geniusexcel.tech/api/available-drivers");
    const json = await res.json();
    return json.data; // array of drivers
  } catch {
    throw new Error("Failed to fetch drivers");
  }
};



export const fetchDriverById = async (driverId: string): Promise<Driver> => {
  try {
    const res = await fetch(`https://ziplugs.geniusexcel.tech/api/available-drivers/${driverId}`);
    const json = await res.json();
    return json.data;
  } catch {
    throw new Error("Failed to fetch driver details");
  }
};

export async function selectDriverForOrder(driver_id: string, order_number: string) {
  const response = await axios.post("https://ziplugs.geniusexcel.tech/api/customer-select-driver", {
    driver_id,
    order_number,
  });
  return response.data;
}