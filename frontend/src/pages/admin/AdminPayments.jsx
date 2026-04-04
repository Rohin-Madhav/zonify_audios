import React, { useEffect, useState } from "react";
import api from "../../services/Api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

const statusStyles = {
  paid: "bg-green-50 text-green-500",
  refunded: "bg-blue-50 text-blue-400",
  pending: "bg-yellow-50 text-yellow-500",
  failed: "bg-red-50 text-red-400",
};

const SkeletonRow = () => (
  <tr className="border-b border-black/5 animate-pulse">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-3 bg-black/5 rounded-full w-3/4" />
      </td>
    ))}
  </tr>
);

const PER_PAGE = 8;

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [openViewDetails, setOpenViewDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payment/all");
        setPayments(res.data.data);
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const totalPages = Math.ceil(payments.length / PER_PAGE);
  const paginated = payments.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleRefund = async (paymentId) => {
    if (!window.confirm("Process refund for this payment?")) return;
    setRefunding(paymentId);
    try {
      await api.post(`/payment/refund/${paymentId}`);
      toast.success("Refund successful");
      setPayments((prev) =>
        prev.map((p) =>
          p._id === paymentId ? { ...p, status: "refunded" } : p,
        ),
      );
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Refund failed");
    } finally {
      setRefunding(null);
    }
  };

  const handleView = async (paymentId) => {
    try {
      const res = await api.get(`/payment/${paymentId}`);
      setPaymentDetails(res.data);
      setOpenViewDetails(true);
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to load details");
    }
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
              Payment Controller
            </h1>
            {!loading && (
              <span className="text-xs text-black/30 tracking-tight">
                {payments.length} {payments.length === 1 ? "record" : "records"}
              </span>
            )}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          className="border border-black/5 rounded-2xl overflow-x-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <table className="w-full text-sm min-w-215">
            <thead>
              <tr className="border-b border-black/5 bg-black/1">
                {[
                  "Payment ID",
                  "Order ID",
                  "Customer",
                  "Amount",
                  "Method",
                  "Status",
                  "Date",
                  "Actions",
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
                ? Array.from({ length: PER_PAGE }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                : paginated.map((payment, i) => {
                    const status = payment.status?.toLowerCase();
                    const isRefunded = status === "refunded";
                    return (
                      <motion.tr
                        key={payment._id}
                        className="border-b border-black/5 last:border-none hover:bg-black/1 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td className="px-4 py-4">
                          <p className="text-xs font-mono text-black/30 truncate max-w-22.5">
                            {payment._id}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs font-mono text-black/30 truncate max-w-22.5">
                            {payment.orderId?._id}
                          </p>
                        </td>
                        <td className="px-4 py-4 font-medium tracking-tight text-black text-xs">
                          {payment.userId?.name}
                        </td>
                        <td className="px-4 py-4 font-semibold tracking-tight text-black text-xs whitespace-nowrap">
                          ₹{payment.amount?.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-4 text-xs text-black/40 tracking-tight capitalize">
                          {payment.paymentMethod}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${statusStyles[status] || statusStyles.pending}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-black/30 tracking-tight whitespace-nowrap">
                          {new Date(payment.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleView(payment._id)}
                              className="w-7 h-7 rounded-lg border border-black/8 hover:border-black/20 flex items-center justify-center text-black/30 hover:text-black transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {!isRefunded && (
                              <button
                                onClick={() => handleRefund(payment._id)}
                                disabled={refunding === payment._id}
                                className="w-7 h-7 rounded-lg border border-black/8 hover:border-red-200 flex items-center justify-center text-black/30 hover:text-red-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {refunding === payment._id ? (
                                  <span className="w-3 h-3 border border-black/20 border-t-black/50 rounded-full animate-spin" />
                                ) : (
                                  <RotateCcw className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
            </tbody>
          </table>

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3.5 border-t border-black/5">
              <p className="text-xs text-black/30 tracking-tight">
                Page {page} of {totalPages} · {payments.length} records
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 rounded-lg border border-black/8 hover:border-black/20 flex items-center justify-center text-black/30 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const isActive = p === page;
                  const show =
                    p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                  const ellipsis =
                    (p === 2 && page > 3) ||
                    (p === totalPages - 1 && page < totalPages - 2);

                  if (!show && !ellipsis) return null;
                  if (ellipsis && !show)
                    return (
                      <span key={p} className="text-xs text-black/20 px-0.5">
                        …
                      </span>
                    );

                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium tracking-tight transition-all ${
                        isActive
                          ? "bg-black text-white"
                          : "border border-black/8 hover:border-black/20 text-black/40 hover:text-black"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-7 h-7 rounded-lg border border-black/8 hover:border-black/20 flex items-center justify-center text-black/30 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Payment Details Modal ── */}
      <AnimatePresence>
        {openViewDetails && paymentDetails && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenViewDetails(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl border border-black/5 shadow-xl z-50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
                <div>
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 mb-0.5">
                    Payment
                  </p>
                  <h2 className="text-sm font-semibold tracking-tight text-black">
                    Transaction Details
                  </h2>
                </div>
                <button
                  onClick={() => setOpenViewDetails(false)}
                  className="w-7 h-7 rounded-lg border border-black/8 flex items-center justify-center text-black/30 hover:text-black hover:border-black/20 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-2">
                {[
                  {
                    label: "Transaction ID",
                    value: paymentDetails.transactionId,
                  },
                  { label: "Order ID", value: paymentDetails.orderId },
                  { label: "User ID", value: paymentDetails.userId },
                  {
                    label: "Method",
                    value: `${paymentDetails.paymentMethod} (${paymentDetails.paymentGateway})`,
                  },
                  { label: "Status", value: paymentDetails.status },
                  {
                    label: "Date",
                    value: new Date(paymentDetails.createdAt).toLocaleString(
                      "en-IN",
                    ),
                  },
                  {
                    label: "Amount",
                    value: `₹${paymentDetails.amount?.toLocaleString("en-IN")}`,
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 py-2.5 border-b border-black/5 last:border-none"
                  >
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 shrink-0 mt-0.5">
                      {label}
                    </p>
                    <p className="text-xs text-black/60 tracking-tight text-right font-mono break-all">
                      {value}
                    </p>
                  </div>
                ))}
                <button
                  onClick={() => setOpenViewDetails(false)}
                  className="w-full mt-2 py-2.5 border border-black/8 hover:border-black/20 text-sm font-medium tracking-tight text-black/50 hover:text-black rounded-xl transition-all duration-200"
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

export default AdminPayments;
