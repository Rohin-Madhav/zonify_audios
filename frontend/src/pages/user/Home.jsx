import React, { useEffect, useState } from "react";
import newArriavalWebp from "../../assets/./hero/newArrival.webp";
import api from "../../services/Api";
import ProductCard from "../../components/shop/productCard";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Headphones,
  Truck,
  ShieldCheck,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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

const reasons = [
  {
    icon: Headphones,
    title: "Studio-Grade Sound",
    desc: "Every product is tuned by audio engineers for an immersive, true-to-life listening experience.",
  },
  {
    icon: ShieldCheck,
    title: "2-Year Warranty",
    desc: "We stand behind our gear. All products come with a full two-year manufacturer warranty.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Free express delivery on all orders. No minimum. No surprises at checkout.",
  },
  {
    icon: RefreshCcw,
    title: "30-Day Returns",
    desc: "Not in love? Return it hassle-free within 30 days — no questions asked.",
  },
];

const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const Carousel = ({ products, onAddToCart }) => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, products.length]);

  const goToSlide = (index) => {
    setCurrent(index);
    setIsAutoPlay(false);
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + products.length) % products.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % products.length);
    setIsAutoPlay(false);
  };

  if (products.length === 0) return null;

  return (
    <div className="relative h-96 md:h-125 overflow-hidden rounded-3xl group">
      {/* Slides */}
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          className="absolute inset-0 bg-white border border-black/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: current === index ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setIsAutoPlay(false)}
        >
          <div className="h-full flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
            {/* Left Content */}
            <motion.div
              className="flex-1 text-center md:text-left z-10"
              initial={{ opacity: 0, x: -40 }}
              animate={
                current === index
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -40 }
              }
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-4">
                Featured Product
              </p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-black mb-4">
                {product.productName}
              </h2>
              <p className="text-black/60 mb-6 leading-relaxed max-w-sm">
                {product.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 justify-center md:justify-start">
                <motion.div
                  className="text-3xl font-bold text-black"
                  initial={{ opacity: 0 }}
                  animate={current === index ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  ₹{product.price?.toLocaleString()}
                </motion.div>
                <motion.button
                  onClick={() => onAddToCart(product)}
                  className="px-6 py-2.5 bg-black hover:bg-black/80 text-white text-sm font-medium tracking-tight rounded-full transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              className="flex-1 flex items-center justify-center h-full"
              initial={{ opacity: 0, x: 40 }}
              animate={
                current === index ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }
              }
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <img
                src={product.images?.[0] || newArriavalWebp}
                alt={product.productName}
                className="w-full h-full object-contain max-w-xs md:max-w-md"
              />
            </motion.div>
          </div>
        </motion.div>
      ))}

      {/* Navigation Buttons */}
      <motion.button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-black/10 rounded-full flex items-center justify-center text-black/60 hover:text-black hover:bg-black/2 transition-all opacity-0 group-hover:opacity-100"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
      </motion.button>

      <motion.button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-black/10 rounded-full flex items-center justify-center text-black/60 hover:text-black hover:bg-black/2 transition-all opacity-0 group-hover:opacity-100"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
      </motion.button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {products.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              current === index
                ? "w-8 bg-black"
                : "w-2 bg-black/20 hover:bg-black/40"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-6 right-6 z-20">
        <motion.button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`px-4 py-2 rounded-full text-xs font-medium tracking-tight transition-all ${
            isAutoPlay
              ? "bg-black text-white"
              : "bg-black/10 text-black hover:bg-black/20"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {isAutoPlay ? "Auto" : "Paused"}
        </motion.button>
      </div>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
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
      console.log(error);
    }
  };

  const featuredProducts = products.slice(0, 3);

  return (
    <main className="bg-white">
      {/* Subtle bg glow - fixed */}
      <div className="pointer-events-none fixed inset-0 flex items-start justify-center">
        <div className="w-150 h-100 bg-black/2 rounded-full blur-3xl mt-24" />
      </div>

      {/* ── Carousel Hero ── */}
      <section className="relative pt-20 md:pt-28 pb-20 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-3">
              Explore
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-black">
              Featured Collection
            </h1>
          </motion.div>

          {loading ? (
            <div className="h-96 md:h-125 bg-black/2 rounded-3xl animate-pulse" />
          ) : (
            <Carousel products={products} onAddToCart={handleAddToCart} />
          )}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="mb-14">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-3">
              Why us
            </p>
            <h2 className="text-3xl font-semibold tracking-tighter text-black">
              Built different.
              <br className="hidden sm:block" />
              <span className="text-black/30">Because sound matters.</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/5 border border-black/5">
            {reasons.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="group bg-white p-8 hover:bg-black/2 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="w-9 h-9 flex items-center justify-center border border-black/10 rounded-xl mb-5 group-hover:border-black/20 transition-colors">
                  <Icon
                    className="w-4 h-4 text-black/40 group-hover:text-black transition-colors duration-300"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-sm font-semibold tracking-tight text-black mb-2">
                  {title}
                </h3>
                <p className="text-sm text-black/40 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Products Grid ── */}
      <section className="relative py-20 z-10 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-2">
                Complete Collection
              </p>
              <h2 className="text-3xl font-semibold tracking-tighter text-black">
                All Amplifiers
              </h2>
            </div>
            <Link to="/products">
              <button className="group flex items-center gap-2 px-5 py-2.5 border border-black/10 hover:border-black/30 text-sm font-medium tracking-tight text-black/50 hover:text-black transition-all duration-300 cursor-pointer rounded-full">
                View All
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
            </Link>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : featuredProducts.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative py-10 pb-24 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="rounded-3xl border border-black/5 bg-black/2 px-10 py-14 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-semibold tracking-tighter text-black mb-2">
                  Experience pure audio excellence
                </h3>
                <p className="text-sm text-black/40 tracking-tight">
                  Free shipping • 30-day returns • 2-year warranty
                </p>
              </div>
              <Link to="/products" className="shrink-0">
                <button className="px-7 py-3 bg-black hover:bg-black/80 text-white text-sm font-medium tracking-tight rounded-full transition-all duration-300 cursor-pointer">
                  Shop All
                </button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
};

export default Home;
