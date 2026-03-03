import React, { useEffect, useState } from "react";
import newArriavalWebp from "../../assets/./hero/newArrival.webp";
import api from "../../services/Api";
import ProductCard from "../../components/shop/productCard";
import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";


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

// Reusable fade-up animation wrapper
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

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);
  };



  const featuredProducts = products.slice(0, 3);

  return (
    <main className="bg-white">

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 overflow-hidden">

        {/* Subtle bg glow */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div className="w-150 h-100 bg-black/2 rounded-full blur-3xl mt-24" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">

          {/* Eyebrow */}
          <motion.span
            className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            New Release
          </motion.span>

          {/* Heading — each line staggers in */}
          <div className="overflow-hidden mb-6">
            {["Zonyfy 2.1 Class D", "Amplifier"].map((line, i) => (
              <motion.h1
                key={i}
                className="text-5xl md:text-7xl font-semibold tracking-tighter text-black leading-[1.05]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.h1>
            ))}
            <motion.h1
              className="text-5xl md:text-7xl font-semibold tracking-tighter text-black/25 leading-[1.05]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              Pure performance.
            </motion.h1>
          </div>

          {/* Subtext */}
          <motion.p
            className="max-w-xl mx-auto text-lg md:text-xl text-black/40 font-medium tracking-tight mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          >
            Engineered for clarity. Built for those who hear the difference.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          >
            <Link to="/products">
              <button className="px-7 py-3 bg-black hover:bg-black/80 text-white text-sm font-medium tracking-tight rounded-full transition-all duration-300 cursor-pointer">
                Buy Now
              </button>
            </Link>
            <button className="group flex items-center gap-1.5 text-sm font-medium tracking-tight text-black/50 hover:text-black transition-colors duration-300">
              Learn more
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-transparent to-black/5 z-10 pointer-events-none" />
            <div className="aspect-video w-full rounded-3xl border border-black/5 overflow-hidden bg-gray-50">
              <img
                className="w-full h-full object-contain"
                src={newArriavalWebp}
                alt="Zonyfy 2.1 Class D Amplifier"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-black/5">

        <FadeUp className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-2">Handpicked</p>
            <h2 className="text-2xl font-semibold tracking-tighter text-black">Featured Amplifiers</h2>
          </div>
          <Link to="/products">
            <button className="group flex items-center gap-2 px-5 py-2.5 border border-black/10 hover:border-black/30 text-sm font-medium tracking-tight text-black/50 hover:text-black transition-all duration-300 cursor-pointer rounded-full">
              View All
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </Link>
        </FadeUp>

        {/* Product cards stagger in */}
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-black/5">

        <FadeUp className="mb-14">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-3">Why us</p>
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
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-9 h-9 flex items-center justify-center border border-black/10 rounded-xl mb-5 group-hover:border-black/20 transition-colors">
                <Icon
                  className="w-4 h-4 text-black/40 group-hover:text-black transition-colors duration-300"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-black mb-2">{title}</h3>
              <p className="text-sm text-black/40 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA Banner ── */}
      <section className="max-w-5xl mx-auto px-6 py-10 pb-24">
        <FadeUp>
          <div className="rounded-3xl border border-black/5 bg-black/2 px-10 py-14 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-semibold tracking-tighter text-black mb-2">
                Ready to upgrade your sound?
              </h3>
              <p className="text-sm text-black/40 tracking-tight">
                Free shipping. 30-day returns. 2-year warranty.
              </p>
            </div>
            <Link to="/products" className="shrink-0">
              <button className="px-7 py-3 bg-black hover:bg-black/80 text-white text-sm font-medium tracking-tight rounded-full transition-all duration-300 cursor-pointer">
                Shop Now
              </button>
            </Link>
          </div>
        </FadeUp>
      </section>

    </main>
  );
};

export default Home;