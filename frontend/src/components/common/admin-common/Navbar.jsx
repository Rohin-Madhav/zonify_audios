import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddProducts from "./AddProducts";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 Dynamic title
  const getTitle = () => {
    if (location.pathname.includes("products")) return "Products";
    if (location.pathname.includes("orders")) return "Orders";
    if (location.pathname.includes("customers")) return "Customers";
    if (location.pathname.includes("settings")) return "Settings";
    return "Dashboard";
  };

  // 🔥 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="w-full h-14 flex items-center justify-between px-6 border-b border-black/5 bg-white">
      {/* Page Title */}
      <h1 className="text-sm font-semibold tracking-tight text-black">
        {getTitle()}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4">

     <AddProducts/>

        {/* Admin label */}
        <span className="text-xs text-black/40">Admin</span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1 border border-black/10 rounded-md hover:bg-black/5 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
