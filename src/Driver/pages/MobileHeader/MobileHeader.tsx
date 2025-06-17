import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Package,
  Clock,
  Settings,
  LogOut,
  Bell,
  LayoutList as ListOrdered,
  CircleHelp,
} from "lucide-react";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    picture: "",
  });

  useEffect(() => {
    // Get user info from localStorage
    const firstName = localStorage.getItem("first_name") || "";
    const userMail = localStorage.getItem("user_mail") || "";
    const userPicture = localStorage.getItem("user_picture") || "";

    setUserInfo({
      name: firstName,
      email: userMail,
      picture: userPicture,
    });
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("driver_id");
    localStorage.removeItem("user_mail");
    localStorage.removeItem("first_name");
    localStorage.removeItem("user_picture");

    // Redirect to login
    window.location.href = "/driver-login";
  };

  const menuItems = [
    { icon: ListOrdered, label: "Upcoming Deliveries", href: "/deliveries" },
    { icon: Clock, label: "Delivery History", href: "/delivery-history" },
    { icon: Bell, label: "Notifications", href: "/driver-notification" },
    { icon: Settings, label: "Settings", href: "/driver-settings" },
    { icon: CircleHelp, label: "Help", href: "/driver-help" },
    { icon: Package, label: "Book as Customer", href: "/#" },
  ];

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="absolute top-4 left-4 z-100 p-3 bg-[#1D43F3] hover:bg-[#1320D8] rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleMenu}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-50 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header with User Info */}
        <div className="bg-gradient-to-r from-[#1D43F3] to-[#1320D8] p-6 pt-20">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg flex-shrink-0">
              {userInfo.picture ? (
                <img
                  src={userInfo.picture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white bg-opacity-20 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg truncate">
                {userInfo.name || "User"}
              </h3>
              <p className="text-blue-100 text-sm truncate">
                {userInfo.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center space-x-4 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#0a1172] rounded-lg transition-all duration-200 group"
                  onClick={toggleMenu}
                >
                  <item.icon className="w-5 h-5 text-gray-500 group-hover:text-[#0a1172] transition-colors duration-200" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors duration-200" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
