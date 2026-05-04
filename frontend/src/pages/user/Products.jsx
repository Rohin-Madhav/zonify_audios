import React, { useState, useEffect } from "react";
import api from "../../services/Api";
import ProductCard from "../../components/shop/productCard";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addItemLocal } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 8;

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
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const sorted = [...res.data.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setProducts(sorted);
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
      toast.success("Item added to cart");
    } catch (error) {
      console.log("Product not found");
    }
  };

  const totalPages = Math.ceil(products.length / PER_PAGE);
  const paginated = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const goTo = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            : paginated.map((p, i) => (
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
              ))}
        </div>
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-black/5 pt-8">
            <p className="text-xs text-black/30 tracking-tight">
              Page {page} of {totalPages} · {products.length} products
            </p>

            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => goTo(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-xl border border-black/8 hover:border-black/20 flex items-center justify-center text-black/30 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
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
                    onClick={() => goTo(p)}
                    className={`w-8 h-8 rounded-xl text-xs font-medium tracking-tight transition-all ${
                      isActive
                        ? "bg-black text-white"
                        : "border border-black/8 hover:border-black/20 text-black/40 hover:text-black"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => goTo(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-xl border border-black/8 hover:border-black/20 flex items-center justify-center text-black/30 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
