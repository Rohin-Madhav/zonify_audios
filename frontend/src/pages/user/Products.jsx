import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/Api";
import ProductCard from "../../components/shop/productCard";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { addItemLocal } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
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
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derive unique categories from products
  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        products.map((p) => p.productName || p.category).filter(Boolean),
      ),
    ];
    return ["All", ...unique];
  }, [products]);

  // Filter products by search + category
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.productName?.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        p.productName === category ||
        p.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset to page 1 when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const goTo = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (product) => {
    if (!token) return navigate("/login");
    dispatch(addItemLocal(product));
    try {
      await api.post("/cart/add", {
        items: [{ product: product._id, quantity: 1 }],
      });
      toast.success("Item added to cart");
    } catch (error) {
      console.log("Product not found");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  const hasActiveFilter = search.trim() !== "" || category !== "All";

  return (
    <main className="bg-white w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-2">
            Catalogue
          </p>
          <div className="flex items-end justify-between">
            <h1 className="text-3xl font-semibold tracking-tighter text-black">
              All Products
            </h1>
            {!loading && (
              <span className="text-xs text-black/30 tracking-tight">
                {filtered.length} {filtered.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </div>

        {/* ── Search + Filters ── */}
        <div className="mb-8 space-y-3">
          {/* Search bar */}
          <div className="relative group max-w-sm">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/25 group-focus-within:text-black/50 transition-colors"
              strokeWidth={1.5}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, brand…"
              className="w-full pl-10 pr-10 py-2.5 text-sm tracking-tight text-black placeholder-black/25 bg-black/2 border border-black/5 rounded-xl outline-none focus:border-black/20 focus:bg-white transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/25 hover:text-black transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-black/4 rounded-full animate-pulse"
                  />
                ))
              : categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200 ${
                      category === cat
                        ? "bg-black text-white"
                        : "border border-black/8 text-black/40 hover:border-black/20 hover:text-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}

            {/* Clear filters */}
            <AnimatePresence>
              {hasActiveFilter && (
                <motion.button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium tracking-tight border border-red-100 text-red-400 hover:border-red-200 hover:text-red-500 transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-3 h-3" />
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 mb-12">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : paginated.length > 0 ? (
            paginated.map((p, i) => (
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
          ) : (
            <motion.div
              className="col-span-full flex flex-col items-center justify-center py-24 text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Search className="w-8 h-8 text-black/15 mb-4" strokeWidth={1} />
              <p className="text-sm font-medium tracking-tight text-black/30">
                No products found
              </p>
              <p className="text-xs text-black/20 tracking-tight mt-1 mb-5">
                Try a different search or category
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2 border border-black/8 hover:border-black/20 text-xs font-medium tracking-tight text-black/40 hover:text-black rounded-full transition-all"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-black/5 pt-8">
            <p className="text-xs text-black/30 tracking-tight">
              Page {page} of {totalPages} · {filtered.length} products
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goTo(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-xl border border-black/8 hover:border-black/20 flex items-center justify-center text-black/30 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
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
