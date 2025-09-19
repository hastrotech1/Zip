import "./App.css";
import { Route, Routes } from "react-router-dom";
import ErrorPage from "./Customer/components/errorPage/ErrorPage";
import Login from "./Customer/components/Login/Login";
import Home from "./Customer/components/Home";
import PlaceOrder from "./Customer/pages/components/PlaceOrder/PlaceOrder";
import ResetPassword from "./Customer/pages/components/Reset/ResetPassword";
import NewPassword from "./Customer/pages/components/Reset/Passwords";
// import ShipmentDetails from "./Customer/pages/components/PlaceOrder/ShipmentDetails";
import Help from "./Customer/pages/components/Help/Help";
import Notifications from "./Customer/pages/components/Notification/Notification";
import { LocationProvider } from "./Customer/pages/components/TrackShipment/LocationContext";
import DriverWeb from "./Driver/components/webpage/driverWeb";
import DriverHelp from "./Driver/pages/Help/Help";
import DriverNotifications from "./Driver/pages/Notification/Notification";
import { DriverDashboard } from "./Driver/pages/DriverDashboard/DriverDashboard";
import { Setting } from "./Driver/pages/Settings/Settings";
import AdminLogin from "./Admin/pages/Auth/Login/AdminLogin";
import AdminSignUp from "./Admin/pages/Auth/Signup/AdminSignup";
import AdminDashboard from "./Admin/pages/AdminDashbord/AdminDashboard";
import CustomerManagement from "./Admin/pages/CustomerManagement/CustomerManagement";
import DriverManagement from "./Admin/pages/DriverManagement/DriverManagement";
import OrderManagement from "./Admin/pages/OrderManagement/OrderManagement";
import DocumentUpload from "./Driver/pages/DriverProfile/DocumentUpload";
import PaymentDetailsForm from "./Driver/pages/DriverProfile/PaymentDetails";
import { MyDeliveries } from "./Driver/pages/DeliveryHistory/DeliveryHistory";
import DriverLogin from "./Driver/components/Login/DriverLogin";
import EmergencyContact from "./Driver/pages/DriverProfile/EmergencyContact";
import AvailableDrivers from "./Customer/pages/components/TrackShipment/AvailableDriver";
import OrderHistory from "./Customer/pages/components/OrderHistory/OrderHistory";
import { AvailableDeliveries } from "./Driver/pages/AvailableDeliveries/AvailableDeliveries";
import { Profile } from "./Driver/pages/Profiles/Profiles";
import Settings from "./Customer/pages/components/SettingsComp/Settings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/drive" element={<DriverWeb />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/available-drivers" element={<AvailableDrivers />} />
        // NOTE DRIVER ROUTES
        <Route path="/driver-login" element={<DriverLogin />} />
        <Route path="/driver-help" element={<DriverHelp />} />
        <Route path="/contact" element={<EmergencyContact />} />
        <Route path="/driver-notification" element={<DriverNotifications />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/driver-settings" element={<Setting />} />
        <Route path="/driver-profile" element={<Profile />} />
        <Route path="/deliveries" element={<AvailableDeliveries />} />
        <Route path="/delivery-history" element={<MyDeliveries />} />
        <Route
          path="/place-order"
          element={
            <LocationProvider>
              <PlaceOrder />
            </LocationProvider>
          }
        />
        <Route path="/document-upload" element={<DocumentUpload />} />
        <Route path="/payment-details" element={<PaymentDetailsForm />} />
        {/* <Route path="/shipment-details" element={<ShipmentDetails />} /> */}
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="*" element={<ErrorPage />} />
        {/* NOTE ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/customer-management"
          element={<CustomerManagement />}
        />
        <Route path="/admin/driver-management" element={<DriverManagement />} />
        <Route path="/admin/order-management" element={<OrderManagement />} />
      </Routes>
    </>
  );
}

export default App;
