import axios from "axios";

// export async function createShipment(params: {
//   pickup_location: string;
//   delivery_location: string;
//   receiver_phone: string;
//   estimate_fee: number;
//   selected_vehicle: string; // vehicle ID
// }) {
//   const token = localStorage.getItem("access_token");
//   if (!token) throw new Error("No access token found");

//   const response = await axios.post(
//     "https://ziplugs.geniusexcel.tech/api/shipments",
//     params
//   );
  
//   return response.data;
// }

export async function createShipment(params: {
  pickup_location: string;
  delivery_location: string;
  receiver_phone: string;
  estimate_fee: number;
  selected_vehicle: string;
}) {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No access token found");

  const response = await axios.post(
    "https://ziplugs.geniusexcel.tech/api/shipments",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
