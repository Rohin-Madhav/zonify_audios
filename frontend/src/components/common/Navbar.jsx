import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, UserRound, LogOut, ShoppingBag as Orders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../services/Api"

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileIsOpen, setProfileISOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token"));
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/auth/users/me`);
        console.log(res.data.user);
        setUser(res.data.user);
      } catch (error) {
        console.log("Can't Fetch user");
      }
    };
    if (token) {
      fetchUser();
    }
  }, [token]);

  const cart = useSelector((state) => state.cart);
  console.log(cart);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const links = [
    { name: "Store", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Support", href: "/contact" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setProfileISOpen(false);
    navigate("/login");
    toast.success("Logout successful");
  };

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md border-b border-black/5"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="opacity-90 hover:opacity-100 transition-opacity"
            >
              <span className="font-semibold tracking-tighter text-lg text-black">
                zonyfy_audios
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-10">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-black/70 hover:text-black transition-colors tracking-tight"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4 relative">
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative opacity-70 hover:opacity-100 transition-opacity"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {totalQuantity > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[9px] flex items-center justify-center rounded-full font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    {totalQuantity}
                  </motion.span>
                )}
              </Link>

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              {/* Sign In / Sign Out */}
              {!token ? (
                <Link
                  to="/login"
                  className="hidden md:block text-sm font-medium text-black/70 hover:text-black transition-colors tracking-tight"
                >
                  Sign In
                </Link>
              ) : null}

              {/* Profile Button */}
              {token && (
                <div className="relative">
                  <button
                    onClick={() => setProfileISOpen(!profileIsOpen)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 hover:border-black/20 text-sm font-medium tracking-tight text-black/50 hover:text-black transition-all duration-200 hover:bg-black/2"
                  >
                    <UserRound className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Account
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {profileIsOpen && (
                      <motion.div
                        className="absolute right-0 top-full mt-3 w-56 bg-white border border-black/5 rounded-2xl shadow-xl overflow-hidden"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {/* User Info Section */}
                        <motion.div
                          className="px-6 py-5 border-b border-black/5 bg-black/2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                              <UserRound className="w-5 h-5 text-black/40" strokeWidth={1.5} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-black tracking-tight text-sm truncate">
                                {user?.name || "User"}
                              </p>
                              <p className="text-xs text-black/40 tracking-tight truncate mt-1">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Menu Items */}
                        <motion.div
                          className="px-2 py-3 space-y-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                        >
                          <Link to="/myOrders" onClick={() => setProfileISOpen(false)}>
                            <motion.button
                              className="w-full flex items-center gap-3 px-4 py-3 text-black/60 hover:text-black hover:bg-black/2 rounded-lg transition-all duration-200 text-sm font-medium tracking-tight group"
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Orders className="w-4 h-4 text-black/30 group-hover:text-black/60 transition-colors" strokeWidth={1.5} />
                              <span>My Orders</span>
                            </motion.button>
                          </Link>

                          <motion.button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-black/60 hover:text-black hover:bg-black/2 rounded-lg transition-all duration-200 text-sm font-medium tracking-tight group"
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <LogOut className="w-4 h-4 text-black/30 group-hover:text-black/60 transition-colors" strokeWidth={1.5} />
                            <span>Logout</span>
                          </motion.button>
                        </motion.div>

                        {/* Footer */}
                        <motion.div
                          className="px-4 py-3 border-t border-black/5 bg-black/2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <p className="text-xs text-black/30 tracking-tight text-center">
                            Customer Account
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — outside <nav> to avoid z-index / stacking context issues */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 top-16 bg-white z-40 md:hidden overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col px-6 py-8 gap-6">
              {links.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-semibold text-black/90 border-b border-black/5 pb-4 block"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {token && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    <Link
                      to="/myOrders"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-xl font-semibold text-black/90 border-t border-black/5 pt-4 pb-4 border-b"
                    >
                      <Orders className="w-5 h-5" strokeWidth={1.5} />
                      My Orders
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 text-xl font-semibold text-black/90 w-full"
                    >
                      <LogOut className="w-5 h-5" strokeWidth={1.5} />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}

              {!token && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-semibold text-black/90 border-t border-black/5 pt-4"
                  >
                    Sign In
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;