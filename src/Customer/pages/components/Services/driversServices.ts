import { Driver, Coordinates } from "../../../../../helper/types";
import { mockDrivers } from "../Data/MockData";

export const fetchNearbyDrivers = async (
  _pickup: Coordinates,
  _dropoff: Coordinates
): Promise<Driver[]> => {
  try {
    // TODO: Replace with real API call
    // const res = await fetch("/api/nearby-drivers", {
    //   method: "POST",
    //   body: JSON.stringify({ pickup, dropoff })
    // });
    // return await res.json();

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockDrivers;
  } catch {
    throw new Error("Failed to fetch drivers");
  }
};
