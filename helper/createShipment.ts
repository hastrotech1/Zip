import axios from "axios";

export async function createShipment(params: {
  pickup_location: string;
  delivery_location: string;
  receiver_phone: string;
  estimate_fee: number;
  selected_vehicle: string; // vehicle ID
}) {
  const response = await axios.post(
    "https://ziplugs.geniusexcel.tech/api/shipments",
    params
  );
  return response.data;
}