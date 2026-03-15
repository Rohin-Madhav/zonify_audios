import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';

const PaymentFailed = () => {
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
          {/* Animated Error Icon */}
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
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AlertCircle className="w-12 h-12 text-black/60" strokeWidth={1.5} />
              </motion.div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-black mb-4">
              Payment Failed
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-black/40 tracking-tight mb-2">
              We couldn't process your payment.
            </p>
            <p className="text-sm text-black/30 tracking-tight mb-8">
              Please try again or use a different payment method.
            </p>
          </motion.div>

          {/* Error Details Box */}
          <motion.div
            className="border border-black/5 rounded-2xl p-6 bg-black/2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-xs text-black/30 tracking-tight mb-3">
              What could have gone wrong?
            </p>
            <ul className="space-y-2 text-sm text-black/40 tracking-tight text-left">
              <li className="flex items-start gap-2">
                <span className="text-black/20 mt-1">•</span>
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black/20 mt-1">•</span>
                <span>Incorrect card or payment details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black/20 mt-1">•</span>
                <span>Transaction declined by your bank</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black/20 mt-1">•</span>
                <span>Network or technical issue</span>
              </li>
            </ul>
          </motion.div>

          {/* CTA Buttons */}
          <motion.button
            onClick={() => navigate('/checkout')}
            className="group flex items-center justify-center gap-2 px-7 py-3 w-full bg-black hover:bg-black/80 text-white text-sm font-medium tracking-tight rounded-full transition-all duration-300 cursor-pointer mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Try Again
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            onClick={() => navigate('/products')}
            className="group flex items-center justify-center gap-1.5 px-7 py-3 w-full text-sm font-medium tracking-tight text-black/50 hover:text-black border border-black/10 hover:border-black/20 rounded-full transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Back to Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </motion.button>

          {/* Support Info */}
          <motion.div
            className="mt-12 pt-8 border-t border-black/5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-xs text-black/30 tracking-tight mb-3">
              Still having issues?
            </p>
            <p className="text-sm font-semibold text-black tracking-tight mb-4">
              Contact our support team
            </p>
            <div className="flex flex-col items-center gap-2 text-xs text-black/40 tracking-tight">
              <span>support@yourstore.com</span>
              <span className="text-black/10">•</span>
              <span>+1 (800) 123-4567</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default PaymentFailed;