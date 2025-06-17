import { Routes, Route } from "react-router-dom";
import { AvailableDeliveries } from "../AvailableDeliveries/AvailableDeliveries";
import { MyDeliveries } from "../DeliveryHistory/DeliveryHistory";
import { Profile } from "../Profiles/Profiles";

export const DriverDashboard = () => {
  return (
    <Routes>
      <Route index element={<AvailableDeliveries />} />
      <Route path="deliveries" element={<MyDeliveries />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
};
