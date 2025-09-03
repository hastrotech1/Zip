import React from "react";
import MobileMenu from "./MobileHeader";

interface NavbarProps {
  pageName: string;
}

const Navbar: React.FC<NavbarProps> = ({ pageName }) => {
  const isPlaceOrder = pageName.toLowerCase() === "place-order";

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0a1172] text-white shadow-md z-50">
      <div className="relative flex items-center justify-center px-4 py-3">
        {/* Menu button (always visible) */}
        <div className="absolute left-4">
          <MobileMenu />
        </div>

        {/* Page title (skip on place-order) */}
        {!isPlaceOrder && (
          <h1 className="text-lg font-semibold">{pageName}</h1>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
