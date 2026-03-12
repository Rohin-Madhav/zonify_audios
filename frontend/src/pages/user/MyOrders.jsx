import React, { useState, useEffect } from "react";
import api from "../../services/Api";
import { motion } from "framer-motion";
import { Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles = {
  delivered: "bg-green-50 text-green-500",
  shipped: "bg-blue-50 text-blue-400",
  processing: "bg-yellow-50 text-yellow-500",
  cancelled: "bg-red-50 text-red-400",
  pending: "bg-black/5 text-black/40",
};

const SkeletonCard = () => (
  <div className="border border-black/5 rounded-2xl p-6 space-y-4 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-2.5 bg-black/6 rounded-full w-16" />
        <div className="h-3 bg-black/4 rounded-full w-40" />
      </div>
      <div className="h-6 bg-black/4 rounded-full w-20" />
    </div>
    <div className="flex gap-3">
      <div className="h-3 bg-black/4 rounded-full w-20" />
      <div className="h-3 bg-black/4 rounded-full w-16" />
    </div>
    <div className="border-t border-black/5 pt-4 space-y-2">
      <div className="h-3 bg-black/4 rounded-full w-3/4" />
      <div className="h-3 bg-black/4 rounded-full w-1/2" />
    </div>
  </div>
);

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/order/my");
        setOrders(res.data.orders);
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-2">
            History
          </p>
          <div className="flex items-end justify-between">
            <h1 className="text-3xl font-semibold tracking-tighter text-black">
              My Orders
            </h1>
            {!loading && (
              <span className="text-xs text-black/30 tracking-tight">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </span>
            )}
          </div>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-2xl border border-black/5 flex items-center justify-center mb-4">
              <Package className="w-5 h-5 text-black/25" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium tracking-tight text-black/40 mb-1">
              No orders yet
            </p>
            <p className="text-xs text-black/25 tracking-tight mb-6">
              Your completed orders will appear here
            </p>
            <Link to="/products">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-black/80 text-white text-sm font-medium tracking-tight rounded-full transition-all duration-300 cursor-pointer">
                Start shopping
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </motion.div>
        )}

        {/* Orders */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                className="border border-black/5 rounded-2xl p-6 hover:border-black/10 transition-colors duration-200"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 mb-1">
                      Order ID
                    </p>
                    <p className="text-xs font-mono text-black/40 truncate max-w-45">
                      {order._id}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${
                      statusStyles[order.orderStatus?.toLowerCase()] ||
                      statusStyles.pending
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-black/30 tracking-tight mb-4">
                  <span>{order.paymentMethod}</span>
                  <span className="w-1 h-1 rounded-full bg-black/15" />
                  <span className="font-semibold text-black">
                    ₹{order.totalAmount?.toLocaleString()}
                  </span>
                </div>

                {/* Items */}
                <div className="border-t border-black/5 pt-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="flex items-center justify-between text-xs tracking-tight"
                    >
                      <span className="text-black/55 truncate max-w-50">
                        {item.productName}
                      </span>
                      <span className="text-black/30 shrink-0 ml-4">
                        {item.quantity} × ₹{item.price?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
