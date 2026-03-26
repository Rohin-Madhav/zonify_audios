import React, { useEffect, useState } from "react";
import api from "../../services/Api";
import { motion } from "framer-motion";

const SkeletonRow = () => (
  <tr className="border-b border-black/5 animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-3 bg-black/5 rounded-full w-3/4" />
      </td>
    ))}
  </tr>
);

const roleStyle = (role) =>
  role === "admin" ? "bg-black text-white" : "bg-black/5 text-black/40";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users");
        setUsers(res.data.users);
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
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
              Customers
            </h1>
            {!loading && (
              <span className="text-xs text-black/30 tracking-tight">
                {users.length} {users.length === 1 ? "user" : "users"}
              </span>
            )}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          className="border border-black/5 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-black/1">
                {["Name", "Email", "Phone", "Role", "Joined"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3.5 text-[10px] font-semibold tracking-widest uppercase text-black/30"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                : users.map((user, i) => (
                    <motion.tr
                      key={user._id}
                      className="border-b border-black/5 last:border-none hover:bg-black/1 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {/* Name + avatar */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                            <span className="text-[11px] font-semibold text-black/40 uppercase">
                              {user.name?.[0] || "?"}
                            </span>
                          </div>
                          <span className="font-medium tracking-tight text-black">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-black/40 tracking-tight">
                        {user.email}
                      </td>

                      <td className="px-4 py-4 text-black/40 tracking-tight">
                        {user.phone || <span className="text-black/20">—</span>}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${roleStyle(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-black/30 tracking-tight text-xs">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </main>
  );
};

export default Customers;
