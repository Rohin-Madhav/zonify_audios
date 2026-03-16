import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../services/Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [address, setAddress] = useState({
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        const items = res.data.cart.items || [];
        setCart(items);
        setTotalQuantity(items.reduce((sum, item) => sum + item.quantity, 0));
        setTotal(res.data.total);
      } catch (error) {
        console.log(error.response?.data);
        toast.error("Failed to load cart");
      }
    };
    fetchCart();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const validateAddress = () => {
    const requiredFields = ["house", "street", "city", "state", "pincode"];
    for (let field of requiredFields) {
      if (!address[field].trim()) {
        toast.error(`Please fill in ${field}`);
        return false;
      }
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAddress()) return;

    if (paymentMethod === "COD") {
      return handleCODSubmit(e);
    }

    if (paymentMethod === "ONLINE") {
      setLoading(true);

      try {
        //  create order first
        const orderRes = await api.post("/order/create", {
          address,
          paymentMethod: "ONLINE",
        });

        const orderId = orderRes.data.orderId;

        //  initialize razorpay
        await handleOnlinePayment(orderId);
      } catch (error) {
        console.log(error.response?.data);
        toast.error("Failed to start payment");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCODSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    setLoading(true);
    try {
      const orderData = {
        address,
        paymentMethod: "COD",
      };
      const res = await api.post("/order/create", orderData);
      toast.success("Order placed successfully!");
      setOrderSuccess(true);
      console.log(res.data);
    } catch (error) {
      console.log(error.response?.data);
      toast.error(
        error.response?.data?.message || "Order failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async (orderId) => {
    if (!validateAddress()) return;

    setLoading(true);

    try {
      const res = await api.post("/payment/initialize", { orderId });

      const { razorpayOrderId, amount, currency, keyId } = res.data;

      const options = {
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "Zonify Audios",
        description: "Order Payment",

        handler: function (response) {
          console.log("Payment success:", response);

          toast.success("Payment success");

          navigate("/payment-success");
        },

        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <main className="bg-white">
        <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 overflow-hidden flex items-center justify-center min-h-screen">
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
            <div className="w-150 h-100 bg-black/2 rounded-full blur-3xl mt-24" />
          </div>

          <motion.div
            className="relative z-10 max-w-md text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="mb-8 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="w-20 h-20 flex items-center justify-center border border-black/10 rounded-full">
                <svg
                  className="w-10 h-10 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-semibold tracking-tighter text-black mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Order Confirmed
            </motion.h2>

            <motion.p
              className="text-black/40 mb-2 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Your order has been successfully placed.
            </motion.p>

            <motion.p
              className="text-sm text-black/30 mb-10 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              You will receive a confirmation email shortly.
            </motion.p>
            <motion.button
              onClick={() => (window.location.href = "/myOrders")}
              className="px-7 py-3 bg-black hover:bg-black/80 text-white text-sm font-medium tracking-tight rounded-full transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Orders
            </motion.button>
          </motion.div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white">
      {/* Subtle bg glow */}
      <div className="pointer-events-none fixed inset-0 flex items-start justify-center">
        <div className="w-150 h-100 bg-black/2 rounded-full blur-3xl mt-24" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-4">
            Secure Checkout
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter text-black">
            Complete your order
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Shipping Section */}
            <div className="mb-12 pb-12 border-b border-black/5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-6">
                  Shipping Details
                </p>
                <h2 className="text-2xl font-semibold tracking-tighter text-black mb-8">
                  Where should we deliver?
                </h2>
              </motion.div>

              <form className="space-y-5">
                <motion.input
                  type="text"
                  name="house"
                  placeholder="House/Flat No."
                  value={address.house}
                  onChange={handleAddressChange}
                  className="w-full px-5 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-transparent transition-all duration-300 text-sm font-medium tracking-tight text-black placeholder:text-black/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  required
                />

                <motion.input
                  type="text"
                  name="street"
                  placeholder="Street/Locality"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="w-full px-5 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-transparent transition-all duration-300 text-sm font-medium tracking-tight text-black placeholder:text-black/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <motion.input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="px-5 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-transparent transition-all duration-300 text-sm font-medium tracking-tight text-black placeholder:text-black/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    required
                  />
                  <motion.input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="px-5 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-transparent transition-all duration-300 text-sm font-medium tracking-tight text-black placeholder:text-black/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    required
                  />
                </div>

                <motion.input
                  type="text"
                  name="pincode"
                  placeholder="Pincode (6 digits)"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  className="w-full px-5 py-3 bg-white border border-black/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-transparent transition-all duration-300 text-sm font-medium tracking-tight text-black placeholder:text-black/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.45 }}
                  required
                />
              </form>
            </div>

            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-6">
                Payment Method
              </p>
              <h2 className="text-2xl font-semibold tracking-tighter text-black mb-8">
                How would you like to pay?
              </h2>

              <form onSubmit={handleSubmit}>
                {/* COD Option */}
                <motion.label
                  className={`flex items-start p-6 border rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === "COD"
                      ? "border-black/20 bg-black/2"
                      : "border-black/5 hover:border-black/10 bg-white"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 mt-0.5 cursor-pointer accent-black"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-black tracking-tight mb-1">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-black/40 tracking-tight">
                      Pay when your order arrives at your doorstep
                    </p>
                  </div>
                </motion.label>

                {/* Online Payment Option */}
                <motion.label
                  className={`flex items-start p-6 border rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === "ONLINE"
                      ? "border-black/20 bg-black/2"
                      : "border-black/5 hover:border-black/10 bg-white"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.55 }}
                  whileHover={{ y: -2 }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 mt-0.5 cursor-pointer accent-black"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-black tracking-tight mb-1">
                      Online Payment
                    </p>
                    <p className="text-sm text-black/40 tracking-tight">
                      Pay securely with card, UPI, or digital wallet
                    </p>
                  </div>
                </motion.label>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-8 py-4 px-6 text-white text-sm font-medium tracking-tight rounded-full transition-all duration-300 ${
                    loading
                      ? "bg-black/40 cursor-not-allowed"
                      : "bg-black hover:bg-black/80"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={!loading ? { scale: 1.01 } : {}}
                  whileTap={!loading ? { scale: 0.99 } : {}}
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod === "COD"
                      ? "Place Order"
                      : "Proceed to Payment"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="sticky top-8 border border-black/5 rounded-2xl p-8 bg-white/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-4">
                  Order Summary
                </p>
                <h3 className="text-2xl font-semibold tracking-tighter text-black mb-8">
                  {totalQuantity} items in cart
                </h3>
              </motion.div>

              {/* Cart Items */}
              <div className="space-y-4 mb-8 pb-8 border-b border-black/5 max-h-64 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-black/30 text-sm tracking-tight py-8">
                    Your cart is empty
                  </p>
                ) : (
                  cart.map((item, i) => (
                    <motion.div
                      key={item._id}
                      className="flex gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.35 + i * 0.05 }}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-black/5 shrink-0">
                        <img
                          src={item.product.images?.[0]}
                          alt={item.product.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-black tracking-tight line-clamp-2">
                          {item.product.productName}
                        </p>
                        <p className="text-black/40 text-xs mt-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-semibold text-black mt-2 tracking-tight">
                          ₹
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Pricing Summary */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <div className="flex justify-between text-sm text-black/60 tracking-tight">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-black/60 tracking-tight">
                  <span>Shipping</span>
                  <span className="text-black font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm text-black/60 tracking-tight">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>

                <div className="pt-4 border-t border-black/5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-black/60 tracking-tight">
                      Total
                    </span>
                    <span className="text-3xl font-semibold text-black tracking-tighter">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="mt-8 pt-8 border-t border-black/5 space-y-3 text-xs text-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-black/20 rounded" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-black/20 rounded" />
                  <span>Fast delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-black/20 rounded" />
                  <span>2-year warranty</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
