import React, { useEffect, useState } from "react";
import api from "../../services/Api";
import { Eye, X, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const statusStyles = {
  delivered: "bg-green-50 text-green-500",
  shipped: "bg-blue-50 text-blue-400",
  processing: "bg-yellow-50 text-yellow-500",
  cancelled: "bg-red-50 text-red-400",
  pending: "bg-black/5 text-black/40",
};

const paymentStyles = {
  paid: "bg-green-50 text-green-500",
  pending: "bg-yellow-50 text-yellow-500",
  failed: "bg-red-50 text-red-400",
};

const SkeletonRow = () => (
  <tr className="border-b border-black/5 animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-3 bg-black/5 rounded-full w-3/4" />
      </td>
    ))}
  </tr>
);

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [viewAddress, setViewAddress] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/order");
        setOrders(res.data.data);
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleView = async (orderId) => {
    try {
      const res = await api.get(`/order/my/${orderId}`);
      setShippingAddress(res.data.shippingAddress);
      setViewAddress(true);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/order/update/${orderId}`, {
        status: newStatus,
      });
      if (res.status === 200) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: newStatus } : o,
          ),
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-2">
            Admin
          </p>
          <div className="flex items-end justify-between">
            <h1 className="text-3xl font-semibold tracking-tighter text-black">
              Orders Controller
            </h1>
            {!loading && (
              <span className="text-xs text-black/30 tracking-tight">
                {orders.length} {orders.length === 1 ? "order" : "orders"} total
              </span>
            )}
          </div>
        </motion.div>

        {/* Table Container */}
        <motion.div
          className="border border-black/5 rounded-2xl overflow-x-auto bg-white"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <table className="w-full text-sm min-w-225">
            <thead>
              <tr className="border-b border-black/5 bg-black/1">
                {[
                  "Order ID",
                  "Customer",
                  "Total",
                  "Payment",
                  "Status",
                  "Address",
                  "Date",
                  "Update Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3.5 text-[10px] font-semibold tracking-widest uppercase text-black/30 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: itemsPerPage }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                : currentOrders.map((order, i) => {
                    const payStatus = (
                      order.paymentStatus || "pending"
                    ).toLowerCase();
                    const ordStatus = (
                      order.orderStatus || "pending"
                    ).toLowerCase();

                    return (
                      <motion.tr
                        key={order._id}
                        className="border-b border-black/5 last:border-none hover:bg-black/1 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        {/* Order ID */}
                        <td className="px-4 py-4">
                          <p className="text-xs font-mono text-black/35 truncate max-w-25">
                            {order._id}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-4">
                          <p className="font-medium tracking-tight text-black text-xs">
                            {order.user?.name}
                          </p>
                          <p className="text-[11px] text-black/30 tracking-tight mt-0.5">
                            {order.user?.email}
                          </p>
                        </td>

                        {/* Total */}
                        <td className="px-4 py-4 font-semibold tracking-tight text-black text-xs whitespace-nowrap">
                          ₹{order.totalAmount?.toLocaleString()}
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <p className="text-xs text-black/40 tracking-tight">
                              {order.paymentMethod}
                            </p>
                            <span
                              className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full ${paymentStyles[payStatus] || paymentStyles.pending}`}
                            >
                              {order.paymentStatus || "Pending"}
                            </span>
                          </div>
                        </td>

                        {/* Order Status badge */}
                        <td className="px-4 py-4">
                          <span
                            className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${statusStyles[ordStatus] || statusStyles.pending}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        {/* Address */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-black/40 tracking-tight">
                              {order.shippingAddress?.city},{" "}
                              {order.shippingAddress?.state}
                            </p>
                            <button
                              onClick={() => handleView(order._id)}
                              className="w-6 h-6 rounded-lg border border-black/8 hover:border-black/20 flex items-center justify-center text-black/25 hover:text-black transition-all shrink-0"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-4 text-xs text-black/30 tracking-tight whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>

                        {/* Status updater */}
                        <td className="px-4 py-4">
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleUpdateStatus(order._id, e.target.value)
                            }
                            className="text-xs tracking-tight text-black bg-black/2 border border-black/8 rounded-lg px-2.5 py-1.5 outline-none focus:border-black/20 cursor-pointer appearance-none transition-all"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </motion.tr>
                    );
                  })}
            </tbody>
          </table>

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-black/5 bg-black/1">
              <span className="text-xs text-black/40 tracking-tight">
                Showing{" "}
                <span className="font-semibold text-black">
                  {indexOfFirstItem + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-black">
                  {Math.min(indexOfLastItem, orders.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-black">
                  {orders.length}
                </span>{" "}
                results
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg border border-black/8 flex items-center justify-center text-black/40 hover:text-black hover:border-black/20 disabled:opacity-30 disabled:hover:border-black/8 disabled:cursor-not-allowed transition-all bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-xs font-medium text-black/60 tracking-tight px-2">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg border border-black/8 flex items-center justify-center text-black/40 hover:text-black hover:border-black/20 disabled:opacity-30 disabled:hover:border-black/8 disabled:cursor-not-allowed transition-all bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Address Modal ── */}
      <AnimatePresence>
        {viewAddress && shippingAddress && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewAddress(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl border border-black/5 shadow-xl z-50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
                <div>
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 mb-0.5">
                    Order
                  </p>
                  <h2 className="text-sm font-semibold tracking-tight text-black">
                    Shipping Address
                  </h2>
                </div>
                <button
                  onClick={() => setViewAddress(false)}
                  className="w-7 h-7 rounded-lg border border-black/8 flex items-center justify-center text-black/30 hover:text-black hover:border-black/20 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Address */}
              <div className="px-6 py-5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl border border-black/8 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin
                      className="w-4 h-4 text-black/30"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="space-y-0.5">
                    {[
                      shippingAddress.house,
                      shippingAddress.street,
                      shippingAddress.city,
                      shippingAddress.state,
                      shippingAddress.pincode,
                    ]
                      .filter(Boolean)
                      .map((line, i) => (
                        <p
                          key={i}
                          className="text-sm text-black/60 tracking-tight leading-relaxed"
                        >
                          {line}
                        </p>
                      ))}
                  </div>
                </div>

                <button
                  onClick={() => setViewAddress(false)}
                  className="w-full mt-5 py-2.5 border border-black/8 hover:border-black/20 text-sm font-medium tracking-tight text-black/50 hover:text-black rounded-xl transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
};

export default AdminOrders;
