import React, { useState, useEffect } from "react";
import api from "../../services/Api";
import ProductCard from "../../components/shop/productCard";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addItemLocal } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductCardSkeleton = () => (
  <div className="border border-black/5 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-56 bg-black/4" />
    <div className="p-5 space-y-3 border-t border-black/5">
      <div className="h-3.5 bg-black/6 rounded-full w-3/4" />
      <div className="h-3 bg-black/4 rounded-full w-1/2" />
      <div className="flex items-center justify-between pt-1">
        <div className="h-4 bg-black/6 rounded-full w-16" />
        <div className="h-5 bg-black/4 rounded-full w-16" />
      </div>
      <div className="h-9 bg-black/4 rounded-xl w-full mt-1" />
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.data);
        console.log(res.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!token) {
      return navigate("/login");
    }
    dispatch(addItemLocal(product));

    try {
      await api.post("/cart/add", {
        items: [
          {
            product: product._id,
            quantity: 1,
          },
        ],
      });
    } catch (error) {
      console.log("Product not found");
    }
  };

  return (
     <main className="bg-white w-full min-h-screen">
      <div className=" max-w-7xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-2">
            Catalogue
          </p>
          <div className="flex items-end justify-between">
            <h1 className="text-3xl font-semibold tracking-tighter text-black">
              All Products
            </h1>
            {!loading && (
              <span className="text-xs text-black/30 tracking-tight">
                {products.length} items
              </span>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <ProductCard product={p} onAddToCart={handleAddToCart} />
                </motion.div>
              ))
          }
        </div>

      </div>
    </main>
  );
};

export default Products;
