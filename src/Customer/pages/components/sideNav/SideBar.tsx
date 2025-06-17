// import { Link } from "react-router-dom";
// import React, { useState } from "react";
// import HomeIcon from "@mui/icons-material/Home";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import HelpIcon from "@mui/icons-material/Help";
// import SettingsIcon from "@mui/icons-material/Settings";
// import LogoutIcon from "@mui/icons-material/Logout";
// import ziplugs from "../../../../assets/Ziplugs-04.png";
// import auth from "../../../../../helper/authenticate";

// const SideBar: React.FC = () => {
//   // Log out handler
//   const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
//     event.preventDefault();
//     auth.logout();
//     // Redirect user to login page or another page if necessary
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <aside className="bg-[#0a1172] w-64 text-white p-4 font-bold text-2xl overflow-hidden">
//         <div className="top-15">
//           <img src={ziplugs} alt="Ziplugs logo" />
//         </div>
//         <div className="mt-16 grid place-content-center">
//           {/* Sidebar Navigation */}
//           <NavLink />
//         </div>

//         {/* Log Out Button */}
//         <div className="absolute bottom-0 pl-4 hover:bg-white hover:text-[#0a1172] hover:rounded">
//           <Link
//             to="/logout"
//             onClick={handleLogout}
//             className="flex items-center space-x-2"
//           >
//             <LogoutIcon />
//             <span>Log Out</span>
//           </Link>
//         </div>
//       </aside>
//     </div>
//   );
// };

// const NavLink = () => {
//   const [activeLink, setActiveLink] = useState<string | null>(null);

//   const handleLinkClick = (
//     link: string,
//     event: React.MouseEvent<HTMLElement>
//   ) => {
//     event.preventDefault(); // Prevent the default anchor click behavior
//     setActiveLink(link);
//   };

//   return (
//     <nav className="space-y-4">
//       <div onClick={(event) => handleLinkClick("link1", event)}>
//         <Link
//           to="/dashboard"
//           className={`flex items-center space-x-2 hover:bg-white hover:text-[#0a1172] hover:rounded p-1 ${
//             activeLink === "link1" ? "bg-white text-[#0a1172] rounded" : ""
//           }`}
//         >
//           <HomeIcon />
//           <span>Home</span>
//         </Link>
//       </div>

//       <div onClick={(event) => handleLinkClick("link2", event)}>
//         <Link
//           to="/place-order"
//           className={`flex items-center space-x-2 hover:bg-white hover:text-[#0a1172] hover:rounded p-1 ${
//             activeLink === "link2" ? "bg-white text-[#0a1172] rounded" : ""
//           }`}
//         >
//           <LocalShippingIcon />
//           <span>Place Order</span>
//         </Link>
//       </div>

//       <div onClick={(event) => handleLinkClick("link3", event)}>
//         <Link
//           to="/track-shipment"
//           className={`flex items-center space-x-2 hover:bg-white hover:text-[#0a1172] hover:rounded p-1 ${
//             activeLink === "link3" ? "bg-white text-[#0a1172] rounded" : ""
//           }`}
//         >
//           <LocationOnIcon />
//           <span>Track Shipment</span>
//         </Link>
//       </div>

//       <div onClick={(event) => handleLinkClick("link4", event)}>
//         <Link
//           to="/help"
//           className={`flex items-center space-x-2 hover:bg-white hover:text-[#0a1172] hover:rounded p-1 ${
//             activeLink === "link4" ? "bg-white text-[#0a1172] rounded" : ""
//           }`}
//         >
//           <HelpIcon />
//           <span>Help</span>
//         </Link>
//       </div>

//       <div onClick={(event) => handleLinkClick("link5", event)}>
//         <Link
//           to="/settings"
//           className={`flex items-center space-x-2 hover:bg-white hover:text-[#0a1172] hover:rounded p-1 ${
//             activeLink === "link5" ? "bg-white text-[#0a1172] rounded" : ""
//           }`}
//         >
//           <SettingsIcon />
//           <span>Settings</span>
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default SideBar;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  MapPin,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import auth from "../../../../../helper/authenticate";
import logo from "../../../../assets/Ziplugs-04.png";

const SideBar = () => {
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Package, label: "Place Order", path: "/place-order" },
    { icon: MapPin, label: "Track Shipment", path: "/track-shipment" },
    { icon: HelpCircle, label: "Help", path: "/help" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    auth.logout();
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-primary text-white">
      {/* Logo */}
      <div className="p-6">
        <img src={logo} alt="Ziplugs logo" className="w-full" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-6">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant="ghost"
                asChild
                className={cn(
                  "w-full justify-start gap-2 hover:bg-white hover:text-primary",
                  location.pathname === item.path && "bg-white text-primary"
                )}
              >
                <Link to={item.path}>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <Button
          variant="ghost"
          asChild
          className="w-full justify-start gap-2 hover:bg-white hover:text-primary"
        >
          <Link to="/logout" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            Log Out
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
