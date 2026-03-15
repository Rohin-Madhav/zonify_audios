import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <main className="bg-white">
      {/* Subtle bg glow */}
      <div className="pointer-events-none fixed inset-0 flex items-start justify-center">
        <div className="w-150 h-100 bg-black/2 rounded-full blur-3xl mt-24" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Animated Checkmark */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 border-2 border-black/10 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
              <motion.svg
                className="w-12 h-12 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-black mb-4">
              Payment Successful
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-black/40 tracking-tight mb-2">
              Your payment has been processed successfully.
            </p>
            <p className="text-sm text-black/30 tracking-tight mb-8">
              Thank you for your order. You can track it anytime.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            onClick={() => navigate('/myOrders')}
            className="group flex items-center justify-center gap-2 px-7 py-3 w-full bg-black hover:bg-black/80 text-white text-sm font-medium tracking-tight rounded-full transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            View My Orders
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            onClick={() => navigate('/products')}
            className="group mt-3 flex items-center justify-center gap-1.5 px-7 py-3 w-full text-sm font-medium tracking-tight text-black/50 hover:text-black border border-black/10 hover:border-black/20 rounded-full transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </motion.button>

          {/* Trust Info */}
          <motion.div
            className="mt-12 pt-8 border-t border-black/5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <p className="text-xs text-black/30 tracking-tight mb-3">
              A confirmation email has been sent to your inbox
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-black/40">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 border border-black/20 rounded" />
                Secure payment
              </span>
              <span className="text-black/10">•</span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 border border-black/20 rounded" />
                Fast delivery
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default PaymentSuccess;