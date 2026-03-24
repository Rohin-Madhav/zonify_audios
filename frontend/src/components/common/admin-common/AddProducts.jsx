import React, { useState } from "react";
import api from "../../../services/Api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Upload, ImagePlus } from "lucide-react";

const initialState = {
  productName: "",
  description: "",
  brand: "",
  price: "",
  stock: "",
  powerOutPut: "",
  channels: "",
  status: "In Stock",
};

const textFields = [
  {
    name: "productName",
    type: "text",
    placeholder: "Product name",
    col: "full",
  },
  {
    name: "description",
    type: "text",
    placeholder: "Description",
    col: "full",
  },
  { name: "brand", type: "text", placeholder: "Brand", col: "half" },
  { name: "price", type: "number", placeholder: "Price (₹)", col: "half" },
  { name: "stock", type: "number", placeholder: "Stock", col: "half" },
  {
    name: "powerOutPut",
    type: "number",
    placeholder: "Power output (W)",
    col: "half",
  },
  { name: "channels", type: "number", placeholder: "Channels", col: "half" },
];

const AddProducts = () => {
  const [products, setProducts] = useState(initialState);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setProducts({ ...products, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    const files = e.target.files;
    setImages(files);
    setPreviews(Array.from(files).map((f) => URL.createObjectURL(f)));
  };

  const handleClose = () => {
    setIsOpen(false);
    setProducts(initialState);
    setImages([]);
    setPreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(products).forEach((key) =>
        formData.append(key, products[key]),
      );
      for (let i = 0; i < images.length; i++)
        formData.append("images", images[i]);

      await api.post("/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added");
      handleClose();
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-medium tracking-tight px-4 py-2 bg-black hover:bg-black/80 text-white rounded-full transition-all duration-200"
      >
        + Add Product
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Modal */}
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
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 mb-0.5">
                    Admin
                  </p>
                  <h2 className="text-sm font-semibold tracking-tight text-black">
                    Add Product
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-lg border border-black/8 flex items-center justify-center text-black/30 hover:text-black hover:border-black/20 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="px-6 py-5 space-y-3 max-h-[72vh] overflow-y-auto"
              >
                <div className="grid grid-cols-2 gap-3">
                  {/* Text fields */}
                  {textFields.map(({ name, type, placeholder, col }) => (
                    <input
                      key={name}
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      value={products[name]}
                      onChange={handleChange}
                      required
                      className={`${col === "full" ? "col-span-2" : "col-span-1"} px-3.5 py-2.5 text-sm tracking-tight text-black placeholder-black/25 bg-black/2 border border-black/5 rounded-xl outline-none focus:border-black/20 focus:bg-white transition-all duration-200`}
                    />
                  ))}

                  {/* Status */}
                  <select
                    name="status"
                    value={products.status}
                    onChange={handleChange}
                    className="col-span-1 px-3.5 py-2.5 text-sm tracking-tight text-black bg-black/2 border border-black/5 rounded-xl outline-none focus:border-black/20 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out Of Stock">Out Of Stock</option>
                  </select>

                  {/* File upload */}
                  <label className="col-span-2 cursor-pointer group">
                    <div className="flex flex-col items-center justify-center gap-2 py-5 border border-dashed border-black/10 group-hover:border-black/25 rounded-xl transition-colors duration-200 bg-black/1">
                      <div className="w-8 h-8 rounded-lg border border-black/8 flex items-center justify-center">
                        <ImagePlus
                          className="w-4 h-4 text-black/30"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium tracking-tight text-black/50">
                          {previews.length > 0
                            ? `${previews.length} image${previews.length > 1 ? "s" : ""} selected`
                            : "Upload images"}
                        </p>
                        <p className="text-[10px] text-black/25 mt-0.5">
                          Click to browse — multiple allowed
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleFiles}
                      className="hidden"
                    />
                  </label>

                  {/* Image previews */}
                  {previews.length > 0 && (
                    <div className="col-span-2 flex gap-2 flex-wrap">
                      {previews.map((src, i) => (
                        <div
                          key={i}
                          className="w-14 h-14 rounded-xl border border-black/5 overflow-hidden bg-black/2"
                        >
                          <img
                            src={src}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
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
                      <>
                        Save Product <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
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
