import sienna from "../../../../assets/sienna.png";
import truck from "../../../../assets/truck.png";
import korope from "../../../../assets/minitruck.png";

export const vehicleData = [
  { type: "Korope", fare: 5_000, image: korope },
  { type: "Sienna", fare: 7_500, image: sienna },
  { type: "Truck", fare: 15_000, image: truck },
];

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";
