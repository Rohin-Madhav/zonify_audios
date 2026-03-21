import React, { useState } from "react";
import api from "../../../services/Api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

const initialState = {
  productName: "",
  description: "",
  brand: "",
  price: "",
  stock: "",
  powerOutPut: "",
  channels: "",
  images: "",
  status: "In Stock",
};

const fields = [
  { name: "productName", type: "text",   placeholder: "Product name",  col: "full"  },
  { name: "description", type: "text",   placeholder: "Description",   col: "full"  },
  { name: "brand",       type: "text",   placeholder: "Brand",         col: "half"  },
  { name: "images",      type: "text",   placeholder: "Image URL",     col: "half"  },
  { name: "price",       type: "number", placeholder: "Price (₹)",     col: "half"  },
  { name: "stock",       type: "number", placeholder: "Stock",         col: "half"  },
  { name: "powerOutPut", type: "number", placeholder: "Power output (W)", col: "half" },
  { name: "channels",    type: "number", placeholder: "Channels",      col: "half"  },
];

const AddProducts = () => {
  const [products, setProducts] = useState(initialState);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setProducts({ ...products, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/products/create", {
        ...products,
        price:       Number(products.price),
        stock:       Number(products.stock),
        powerOutPut: Number(products.powerOutPut),
        channels:    Number(products.channels),
      });
      toast.success("Product added");
      setProducts(initialState);
      setIsOpen(false);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger button — minimal, fits navbar */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-medium tracking-tight px-4 py-2 bg-black hover:bg-black/80 text-white rounded-full transition-all duration-200"
      >
        + Add Product
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl border border-black/5 shadow-xl z-50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
                <div>
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 mb-0.5">Admin</p>
                  <h2 className="text-sm font-semibold tracking-tight text-black">Add Product</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg border border-black/8 flex items-center justify-center text-black/30 hover:text-black hover:border-black/20 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  {fields.map(({ name, type, placeholder, col }) => (
                    <input
                      key={name}
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      value={products[name]}
                      onChange={handleChange}
                      required={name !== "images"}
                      className={`${col === "full" ? "col-span-2" : "col-span-1"} px-3.5 py-2.5 text-sm tracking-tight text-black placeholder-black/25 bg-black/2] border border-black/5 rounded-xl outline-none focus:border-black/20 focus:bg-white transition-all duration-200`}
                    />
                  ))}

                  {/* Status select */}
                  <select
                    name="status"
                    value={products.status}
                    onChange={handleChange}
                    className="col-span-2 px-3.5 py-2.5 text-sm tracking-tight text-black bg-black/2 border border-black/5 rounded-xl outline-none focus:border-black/20 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out Of Stock">Out Of Stock</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black hover:bg-black/80 disabled:bg-black/20 text-white text-sm font-medium tracking-tight rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Save Product <ArrowRight className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2.5 border border-black/8 hover:border-black/20 text-sm font-medium tracking-tight text-black/50 hover:text-black rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddProducts;