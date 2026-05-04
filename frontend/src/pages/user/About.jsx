import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Headphones, Zap, Award, Users } from "lucide-react";

const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const stats = [
  { value: "2021", label: "Founded" },
  { value: "5K+", label: "Happy Customers" },
  { value: "99%", label: "Satisfaction" },
  { value: "2 Yr", label: "Warranty" },
];

const values = [
  {
    icon: Headphones,
    title: "Sound First",
    desc: "Every product is designed with one goal — delivering audio that moves you. No compromise on quality.",
  },
  {
    icon: Zap,
    title: "Pure Power",
    desc: "Our Class D amplifiers are engineered for maximum efficiency and minimal distortion, even at peak output.",
  },
  {
    icon: Award,
    title: "Built to Last",
    desc: "We use only premium components. Every unit ships tested, tuned, and backed by a two-year warranty.",
  },
  {
    icon: Users,
    title: "Community Driven",
    desc: "Our products are shaped by audiophiles, for audiophiles. Real feedback, real improvements.",
  },
];

const team = [
  { name: "Arjun Menon", role: "Founder & Audio Engineer" },
  { name: "Priya Nair", role: "Product Designer" },
  { name: "Rahul Sharma", role: "Electronics Engineer" },
  { name: "Sneha Pillai", role: "Customer Experience" },
];

const About = () => {
  return (
    <main className="bg-white">
      {/* ── Hero ── */}
      <section className="pt-36 pb-20 md:pt-52 md:pb-28 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-6">
            Our Story
          </p>
          <h1 className="text-7xl md:text-7xl font-semibold tracking-tighter text-black leading-[1.05] mb-8">
            We build gear for
            <br />
            <span className="text-black/25">
              those who hear the difference.
            </span>
          </h1>
          <p className="max-w-xl text-lg text-black/40 font-medium tracking-tight leading-relaxed">
            Zonyfy Audios was born from a simple frustration — great audio gear
            shouldn't cost a fortune or compromise on performance. We set out to
            change that.
          </p>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/5 border border-black/5">
            {stats.map(({ value, label }, i) => (
              <FadeUp key={label} delay={i * 0.07}>
                <div className="bg-white p-8 text-center">
                  <p className="text-4xl font-semibold tracking-tighter text-black mb-1">
                    {value}
                  </p>
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-black/30">
                    {label}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-4">
                Mission
              </p>
              <h2 className="text-3xl font-semibold tracking-tighter text-black mb-6 leading-tight">
                Making premium audio
                <br />
                <span className="text-black/30">accessible to everyone.</span>
              </h2>
              <p className="text-sm text-black/45 leading-relaxed tracking-tight mb-4">
                We started Zonyfy Audios out of a small workshop in Kerala,
                driven by a passion for pure, powerful sound. What began as
                custom amplifier builds for local studios has grown into a full
                product line trusted by audiophiles across India.
              </p>
              <p className="text-sm text-black/45 leading-relaxed tracking-tight">
                Every product in our lineup is designed in-house, tested
                rigorously, and built to deliver — whether you're running a home
                theatre setup or a professional studio rack.
              </p>
            </FadeUp>

            {/* Visual block */}
            <FadeUp delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                {["Design", "Engineering", "Testing", "Support"].map(
                  (label, i) => (
                    <div
                      key={label}
                      className="border border-black/5 rounded-2xl p-6 flex flex-col gap-8"
                    >
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-black/25">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm font-semibold tracking-tight text-black">
                        {label}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <FadeUp className="mb-14">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-3">
              Values
            </p>
            <h2 className="text-3xl font-semibold tracking-tighter text-black">
              What we stand for.
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/5 border border-black/5">
            {values.map(({ icon: Icon, title, desc }, i) => (
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

      {/* ── Team ── */}
      <section className="border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <FadeUp className="mb-14">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-3">
              People
            </p>
            <h2 className="text-3xl font-semibold tracking-tighter text-black">
              The team behind it.
            </h2>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map(({ name, role }, i) => (
              <FadeUp key={name} delay={i * 0.07}>
                <div className="border border-black/5 rounded-2xl p-6 hover:border-black/10 transition-colors duration-200">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-black/4 flex items-center justify-center mb-4">
                    <span className="text-sm font-semibold text-black/40">
                      {name[0]}
                    </span>
                  </div>
                  <p className="text-sm font-semibold tracking-tight text-black mb-1">
                    {name}
                  </p>
                  <p className="text-xs text-black/35 tracking-tight leading-snug">
                    {role}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-10 pb-24">
          <FadeUp>
            <div className="rounded-3xl border border-black/5 bg-black/2 px-10 py-14 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-semibold tracking-tighter text-black mb-2">
                  Hear it for yourself.
                </h3>
                <p className="text-sm text-black/40 tracking-tight">
                  Free shipping · 30-day returns · 2-year warranty.
                </p>
              </div>
              <Link to="/products" className="shrink-0">
                <button className="flex items-center gap-2 px-7 py-3 bg-black hover:bg-black/80 text-white text-sm font-medium tracking-tight rounded-full transition-all duration-300 cursor-pointer">
                  Shop Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
};

export default About;
