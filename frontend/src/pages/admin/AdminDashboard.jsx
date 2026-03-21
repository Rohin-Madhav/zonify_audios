import React, { useEffect, useState } from "react";
import api from "../../services/Api";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ShoppingBag, Users, Package, CreditCard } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

const groupByMonth = (arr, dateKey = "createdAt") => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const map = {};
  arr.forEach((item) => {
    const d = new Date(item[dateKey]);
    const label = months[d.getMonth()];
    map[label] = (map[label] || 0) + 1;
  });
  return months.filter((m) => map[m]).map((m) => ({ month: m, value: map[m] }));
};

const revenueByMonth = (orders) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const map = {};
  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    const label = months[d.getMonth()];
    map[label] = (map[label] || 0) + (o.totalAmount || 0);
  });
  return months.filter((m) => map[m]).map((m) => ({ month: m, value: map[m] }));
};

const statusCount = (orders) => {
  const map = {};
  orders.forEach((o) => {
    const s = o.orderStatus || "unknown";
    map[s] = (map[s] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
};

// ── Sub-components ────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, delay }) => (
  <motion.div
    className="border border-black/5 rounded-2xl p-6 flex items-center gap-4"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: "easeOut" }}
  >
    <div className="w-10 h-10 rounded-xl border border-black/5 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-black/40" strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-[10px] font-semibold tracking-widest uppercase text-black/30 mb-0.5">
        {label}
      </p>
      <p className="text-2xl font-semibold tracking-tighter text-black">
        {value}
      </p>
    </div>
  </motion.div>
);

const StatCardSkeleton = () => (
  <div className="border border-black/5 rounded-2xl p-6 flex items-center gap-4 animate-pulse">
    <div className="w-10 h-10 rounded-xl bg-black/4" />
    <div className="space-y-2">
      <div className="h-2.5 bg-black/4 rounded-full w-20" />
      <div className="h-6 bg-black/6 rounded-full w-12" />
    </div>
  </div>
);

const ChartCard = ({ title, eyebrow, children, delay }) => (
  <motion.div
    className="border border-black/5 rounded-2xl p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 mb-1">
      {eyebrow}
    </p>
    <h3 className="text-sm font-semibold tracking-tight text-black mb-6">
      {title}
    </h3>
    {children}
  </motion.div>
);

const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-black/8 rounded-xl px-3 py-2 text-xs shadow-sm">
      <p className="text-black/40 mb-0.5">{label}</p>
      <p className="font-semibold text-black">
        {prefix}
        {payload[0].value?.toLocaleString()}
      </p>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resOrders, resPayments, resProducts, resUsers] =
          await Promise.all([
            api.get("/order"),
            api.get("/payment/all"),
            api.get("/products"),
            api.get("/auth/users"),
          ]);
        setOrders(resOrders.data.data || []);
        setProducts(resProducts.data.data || []);
        setUsers(resUsers.data.users || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const ordersOverTime = groupByMonth(orders);
  const usersOverTime = groupByMonth(users);
  const revenueOverTime = revenueByMonth(orders);
  const ordersByStatus = statusCount(orders);

  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: orders.length },
    {
      icon: CreditCard,
      label: "Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
    },
    { icon: Package, label: "Products", value: products.length },
    { icon: Users, label: "Customers", value: users.length },
  ];

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-2">
            Admin
          </p>
          <h1 className="text-3xl font-semibold tracking-tighter text-black">
            Dashboard
          </h1>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))
            : stats.map((s, i) => (
                <StatCard key={s.label} {...s} delay={i * 0.07} />
              ))}
        </div>

        {/* Charts row 1 — Revenue + Orders over time */}
        <div className="grid md:grid-cols-2 gap-4">
          <ChartCard eyebrow="Revenue" title="Monthly Revenue" delay={0.2}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueOverTime}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#00000050" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#00000050" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#000"
                  strokeWidth={1.5}
                  fill="url(#rev)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard eyebrow="Orders" title="Orders Over Time" delay={0.25}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={ordersOverTime}>
                <defs>
                  <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.06} />
                    <stop offset="95%" stopColor="#000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#00000050" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#00000050" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#000"
                  strokeWidth={1.5}
                  fill="url(#ord)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Charts row 2 — Order status + New users */}
        <div className="grid md:grid-cols-2 gap-4">
          <ChartCard eyebrow="Breakdown" title="Orders by Status" delay={0.3}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ordersByStatus} barSize={28}>
                <CartesianGrid stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#00000050" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#00000050" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="#000"
                  radius={[4, 4, 0, 0]}
                  opacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard eyebrow="Growth" title="New Customers" delay={0.35}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={usersOverTime} barSize={28}>
                <CartesianGrid stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#00000050" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#00000050" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="#000"
                  radius={[4, 4, 0, 0]}
                  opacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent orders table */}
        <motion.div
          className="border border-black/5 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="px-6 py-5 border-b border-black/5">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 mb-1">
              Latest
            </p>
            <h3 className="text-sm font-semibold tracking-tight text-black">
              Recent Orders
            </h3>
          </div>
          <div className="divide-y divide-black/5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-6 py-4 animate-pulse"
                  >
                    <div className="h-3 bg-black/4 rounded-full w-40" />
                    <div className="h-3 bg-black/4 rounded-full w-16" />
                    <div className="h-5 bg-black/4 rounded-full w-20" />
                    <div className="h-3 bg-black/4 rounded-full w-16" />
                  </div>
                ))
              : orders.slice(0, 8).map((order, i) => {
                  const statusColor =
                    {
                      delivered: "bg-green-50 text-green-500",
                      shipped: "bg-blue-50 text-blue-400",
                      processing: "bg-yellow-50 text-yellow-500",
                      cancelled: "bg-red-50 text-red-400",
                      pending: "bg-black/5 text-black/40",
                    }[order.orderStatus?.toLowerCase()] ||
                    "bg-black/5 text-black/40";

                  return (
                    <motion.div
                      key={order._id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-black/1] transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 + i * 0.04 }}
                    >
                      <p className="text-xs font-mono text-black/40 truncate max-w-35">
                        {order._id}
                      </p>
                      <p className="text-xs text-black/40 tracking-tight hidden sm:block">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <span
                        className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${statusColor}`}
                      >
                        {order.orderStatus}
                      </span>
                      <p className="text-xs font-semibold tracking-tight text-black">
                        ₹{order.totalAmount?.toLocaleString()}
                      </p>
                    </motion.div>
                  );
                })}
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default AdminDashboard;
