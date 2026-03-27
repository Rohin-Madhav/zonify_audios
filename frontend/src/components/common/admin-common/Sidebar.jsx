import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Package,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  DollarSign,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/admin",
      badge: null,
    },
    {
      label: "Products",
      icon: Package,
      href: "/admin/products",
      badge: null,
    },
    {
      label: "Customers",
      icon: Users,
      href: "/admin/customers",
      badge: null,
    },
    {
      label: "Orders",
      icon: Package,
      href: "/admin/orders",
      badge: null,
    },
    {
      label: "Payments",
      icon:DollarSign,
      href: "/admin/payments",
      badge: null,
    },
  ];

  const isActive = (href) => location.pathname === href;

  const menuItemVariants = {
    hover: { x: 4 },
    tap: { scale: 0.98 },
  };

  const SidebarContent = () => (
    <>
      {/* Header */}
      <motion.div
        className="px-6 py-8 border-b border-black/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className={`${isCollapsed ? "hidden" : ""}`}>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-2">
              Admin Panel
            </p>
            <h2 className="text-lg font-semibold tracking-tighter text-black">
              zonyfy_audios
            </h2>
          </div>
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg border border-black/10 hover:border-black/20 text-black/50 hover:text-black transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ${
                isCollapsed ? "" : "rotate-180"
              }`}
              strokeWidth={1.5}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        className="flex-1 px-3 py-6 space-y-2 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
            >
              <Link to={item.href} onClick={() => setIsOpen(false)}>
                <motion.button
                  variants={menuItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                    active
                      ? "bg-black text-white shadow-md"
                      : "text-black/60 hover:text-black hover:bg-black/2"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      active
                        ? "text-white"
                        : "text-black/40 group-hover:text-black/60"
                    } transition-colors`}
                    strokeWidth={1.5}
                  />

                  {!isCollapsed && (
                    <>
                      <span
                        className={`text-sm font-medium tracking-tight flex-1 text-left ${
                          active ? "font-semibold" : ""
                        }`}
                      >
                        {item.label}
                      </span>

                      {item.badge && (
                        <motion.span
                          className="bg-black/10 px-2 py-1 rounded text-xs font-semibold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                        >
                          {item.badge}
                        </motion.span>
                      )}

                      {active && (
                        <motion.div
                          className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"
                          layoutId="activeIndicator"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        />
                      )}
                    </>
                  )}
                </motion.button>
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Footer */}
      <motion.div
        className="border-t border-black/5 px-3 py-6 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        {/* User Profile */}
        {!isCollapsed && (
          <div className="px-4 py-4 rounded-lg bg-black/2 border border-black/5">
            <p className="text-xs text-black/30 tracking-tight mb-2">
              Logged in as
            </p>
            <p className="text-sm font-semibold text-black tracking-tight">
              Admin User
            </p>
          </div>
        )}

        {/* Logout Button */}
        <motion.button
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-black/60 hover:text-black hover:bg-black/2 transition-all duration-200 group ${
            isCollapsed ? "justify-center" : ""
          }`}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut
            className="w-5 h-5 text-black/40 group-hover:text-black/60 transition-colors shrink-0"
            strokeWidth={1.5}
          />
          {!isCollapsed && (
            <span className="text-sm font-medium tracking-tight flex-1 text-left">
              Logout
            </span>
          )}
        </motion.button>
      </motion.div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 md:hidden z-50 w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" strokeWidth={1.5} />
        ) : (
          <Menu className="w-6 h-6" strokeWidth={1.5} />
        )}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 md:hidden z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-black/5 z-40 md:hidden flex flex-col overflow-hidden"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{
          width: isCollapsed ? 96 : 256,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex bg-white border-r border-black/5 z-0 flex-col overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
};

export default Sidebar;
