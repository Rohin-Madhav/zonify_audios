import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/Api";
import { motion } from "framer-motion";
import { ShoppingBag, Zap, Radio, Package } from "lucide-react";

const ProductDetailsSkeleton = () => (
  <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 animate-pulse">
    <div className="grid md:grid-cols-2 gap-12">
      {/* Image */}
      <div className="aspect-square rounded-2xl bg-black/4" />
      {/* Info */}
      <div className="space-y-4 py-4">
        <div className="h-3 bg-black/4 rounded-full w-20" />
        <div className="h-8 bg-black/6 rounded-full w-3/4" />
        <div className="h-4 bg-black/4 rounded-full w-1/4" />
        <div className="space-y-2 pt-4">
          <div className="h-3 bg-black/4 rounded-full w-full" />
          <div className="h-3 bg-black/4 rounded-full w-5/6" />
          <div className="h-3 bg-black/4 rounded-full w-4/6" />
        </div>
        <div className="h-10 bg-black/4 rounded-xl w-full mt-6" />
      </div>
    </div>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <main className="bg-white min-h-screen"><ProductDetailsSkeleton /></main>;

  if (!product) return (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <p className="text-sm text-black/30 tracking-tight">Product not found.</p>
    </main>
  );

  const {
    productName, brand, price, description,
    images, stock, status, powerOutPut, channels,
  } = product;

  const isOutOfStock = stock <= 0;

  const specs = [
    { icon: Zap,     label: "Power Output", value: `${powerOutPut}W` },
    { icon: Radio,   label: "Channels",     value:`${channels}.1` },
    { icon: Package, label: "Stock",        value: `${stock} units` },
  ];

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Images ── */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main image */}
            <div className="aspect-square w-full rounded-2xl border border-black/5 bg-black/2 overflow-hidden flex items-center justify-center">
              <img
                src={images?.[activeImage]}
                alt={productName}
                className="w-3/4 h-3/4 object-contain transition-opacity duration-300"
              />
            </div>

            {/* Thumbnails */}
            {images?.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-xl border overflow-hidden flex items-center justify-center bg-black/2 transition-all duration-200 ${
                      activeImage === i ? "border-black/30" : "border-black/5 hover:border-black/15"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Info ── */}
          <motion.div
            className="flex flex-col justify-center space-y-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Brand + status */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30">
                {brand}
              </span>
              <span
                className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${
                  isOutOfStock ? "bg-red-50 text-red-400" :
                  stock < 5    ? "bg-yellow-50 text-yellow-500" :
                                 "bg-green-50 text-green-500"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : stock < 5 ? "Low Stock" : status}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-4xl font-semibold tracking-tighter text-black leading-tight">
              {productName}
            </h1>

            {/* Price */}
            <p className="text-2xl font-semibold tracking-tight text-black">
              ₹{price?.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-sm text-black/45 leading-relaxed tracking-tight">
              {description}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-3 py-2">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="border border-black/5 rounded-xl p-3 space-y-1.5"
                >
                  <Icon className="w-3.5 h-3.5 text-black/30" strokeWidth={1.5} />
                  <p className="text-[10px] text-black/30 tracking-wide uppercase font-semibold">{label}</p>
                  <p className="text-xs font-semibold tracking-tight text-black">{value}</p>
                </div>
              ))}
            </div>

            {/* Add to cart */}
            <button
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium tracking-tight transition-all duration-300 ${
                isOutOfStock
                  ? "bg-black/5 text-black/25 cursor-not-allowed"
                  : "bg-black hover:bg-black/80 text-white cursor-pointer"
              }`}
            >
              {!isOutOfStock && <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />}
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </motion.div>

        </div>
      </div>
    </main>
  );
};

export default ProductDetails;