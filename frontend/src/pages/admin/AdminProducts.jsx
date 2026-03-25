import React, { useEffect, useState } from "react";
import api from "../../services/Api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Pencil, Trash2, Eye } from "lucide-react";

// ── Shared input style ────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3.5 py-2.5 text-sm tracking-tight text-black placeholder-black/25 bg-black/[0.02] border border-black/5 rounded-xl outline-none focus:border-black/20 focus:bg-white transition-all duration-200";

// ── Modal shell ───────────────────────────────────────────────────────────────
const Modal = ({ onClose, title, eyebrow, children }) => (
  <>
    <motion.div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    />
    <motion.div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl border border-black/5 shadow-xl z-50 overflow-hidden"
      initial={{ opacity: 0, scale: 0.96, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 mb-0.5">
            {eyebrow}
          </p>
          <h2 className="text-sm font-semibold tracking-tight text-black">
            {title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg border border-black/8 flex items-center justify-center text-black/30 hover:text-black hover:border-black/20 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
    </motion.div>
  </>
);

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-black/5 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-3 bg-black/5 rounded-full w-3/4" />
      </td>
    ))}
  </tr>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    productName: "",
    price: 0,
    stock: 0,
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.data);
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product removed");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleView = async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      setSelectedProduct(res.data.data);
      setViewOpen(true);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const openEdit = (product) => {
    setEditFormData(product);
    setEditOpen(true);
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch(
        `/products/update/${editFormData._id}`,
        editFormData,
      );
      setProducts((prev) =>
        prev.map((p) => (p._id === editFormData._id ? res.data.data : p)),
      );
      setEditOpen(false);
      toast.success("Product updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const statusStyle = (status) =>
    status === "In Stock"
      ? "bg-green-50 text-green-500"
      : "bg-red-50 text-red-400";

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
              Product Controller
            </h1>
            {!loading && (
              <span className="text-xs text-black/30 tracking-tight">
                {products.length} products
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
                {[
                  "Product",
                  "Brand",
                  "Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((h) => (
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
                : products.map((product, i) => (
                    <motion.tr
                      key={product._id}
                      className="border-b border-black/5 hover:bg-black/1 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <td className="px-4 py-4 font-medium tracking-tight text-black">
                        {product.productName}
                      </td>
                      <td className="px-4 py-4 text-black/40 tracking-tight">
                        {product.brand}
                      </td>
                      <td className="px-4 py-4 text-black/70 tracking-tight">
                        ₹{product.price?.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-black/40 tracking-tight">
                        {product.stock}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${statusStyle(product.status)}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(product._id)}
                            className="w-7 h-7 rounded-lg border border-black/8 hover:border-black/20 flex items-center justify-center text-black/30 hover:text-black transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEdit(product)}
                            className="w-7 h-7 rounded-lg border border-black/8 hover:border-black/20 flex items-center justify-center text-black/30 hover:text-black transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="w-7 h-7 rounded-lg border border-red-100 hover:border-red-200 flex items-center justify-center text-red-300 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* ── View Modal ── */}
      <AnimatePresence>
        {viewOpen && selectedProduct && (
          <Modal
            onClose={() => setViewOpen(false)}
            eyebrow="Product"
            title={selectedProduct.productName}
          >
            <div className="space-y-4">
              {/* Image */}
              {selectedProduct.images?.[0] && (
                <div className="w-full h-40 rounded-xl border border-black/5 bg-black/2 flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedProduct.images[0]}
                    alt=""
                    className="h-full object-contain p-4"
                  />
                </div>
              )}
              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Brand", value: selectedProduct.brand },
                  {
                    label: "Price",
                    value: `₹${selectedProduct.price?.toLocaleString()}`,
                  },
                  {
                    label: "Power Output",
                    value: `${selectedProduct.powerOutPut}W`,
                  },
                  {
                    label: "Channels",
                    value: selectedProduct.channels || "N/A",
                  },
                  { label: "Stock", value: selectedProduct.stock },
                  { label: "Status", value: selectedProduct.status },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="border border-black/5 rounded-xl p-3"
                  >
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 mb-1">
                      {label}
                    </p>
                    <p className="text-sm font-medium tracking-tight text-black">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              {/* Description */}
              <div className="border border-black/5 rounded-xl p-4">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 mb-2">
                  Description
                </p>
                <p className="text-sm text-black/50 leading-relaxed tracking-tight">
                  {selectedProduct.description}
                </p>
              </div>
              <button
                onClick={() => setViewOpen(false)}
                className="w-full py-2.5 border border-black/8 hover:border-black/20 text-sm font-medium tracking-tight text-black/50 hover:text-black rounded-xl transition-all duration-200"
              >
                Close
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {editOpen && (
          <Modal
            onClose={() => setEditOpen(false)}
            eyebrow="Admin"
            title="Update Product"
          >
            <form onSubmit={submitUpdate} className="space-y-3">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25">
                  Product Name
                </p>
                <select
                  name="productName"
                  value={editFormData.productName}
                  onChange={handleInputChange}
                  className={inputCls}
                >
                  <option value="Amplifier">Amplifier</option>
                  <option value="Speaker">Speaker</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25">
                    Price (₹)
                  </p>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25">
                    Stock
                  </p>
                  <input
                    type="number"
                    name="stock"
                    value={editFormData.stock}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25">
                  Description
                </p>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black hover:bg-black/80 disabled:bg-black/20 text-white text-sm font-medium tracking-tight rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Save Changes <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-5 py-2.5 border border-black/8 hover:border-black/20 text-sm font-medium tracking-tight text-black/50 hover:text-black rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </main>
  );
};

export default AdminProducts;
