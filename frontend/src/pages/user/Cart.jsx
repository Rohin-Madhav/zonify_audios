import React, { useEffect, useState } from "react";
import api from "../../services/Api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ArrowRight, Minus, Package, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCartFromServer } from "../../redux/cartSlice";

// Skeleton row
const CartItemSkeleton = () => (
  <div className="flex items-center gap-4 py-5 border-b border-black/5 animate-pulse">
    <div className="w-16 h-16 rounded-xl bg-black/4 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-black/6 rounded-full w-2/3" />
      <div className="h-3 bg-black/4 rounded-full w-1/4" />
    </div>
    <div className="h-4 bg-black/4 rounded-full w-14" />
  </div>
);

const Cart = () => {
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        const items = res.data.cart.items || [];
        setCart(items);
        dispatch(setCartFromServer(items));
        setTotalQuantity(items.reduce((sum, item) => sum + item.quantity, 0));
        setTotal(res.data.total);
      } catch (err) {
        console.log(err.message);
        toast.error("Cart not found");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, currentQuantity, delta) => {
    const newQty = currentQuantity + delta;

    if (newQty < 1) return;

    try {
      const res = await api.patch("/cart/update", {
        items: [{ product: productId, quantity: newQty }],
      });

      const items = res.data.cart.items || [];

      setCart(items);

      dispatch(setCartFromServer(items));

      const qty = items.reduce((sum, item) => sum + item.quantity, 0);
      setTotalQuantity(qty);

      const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      setTotal(totalPrice);
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);

      const items = res.data.cart.items || [];

      setCart(items);
      dispatch(setCartFromServer(items));

      const qty = items.reduce((sum, item) => sum + item.quantity, 0);
      setTotalQuantity(qty);

      const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      setTotal(totalPrice);

      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to remove item");
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-2">
            Your bag
          </p>
          <div className="flex items-end justify-between">
            <h1 className="text-3xl font-semibold tracking-tighter text-black">
              Cart
            </h1>
            {!loading && (
              <span className="text-xs text-black/30 tracking-tight">
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && cart.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-2xl border border-black/5 flex items-center justify-center mb-4">
              <Package className="w-5 h-5 text-black/25" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium tracking-tight text-black/40 mb-1">
              Your cart is empty
            </p>
            <p className="text-xs text-black/25 tracking-tight mb-6">
              Add some products to get started
            </p>
            <Link to="/products">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-black/80 text-white text-sm font-medium tracking-tight rounded-full transition-all duration-300">
                Browse products
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </motion.div>
        )}

        {/* Cart items */}
        {!loading && cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Items list */}
            <div className="border-t border-black/5">
              {cart.map((c, i) => (
                <motion.div
                  key={c._id}
                  className="flex items-center gap-4 py-5 border-b border-black/5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.06,
                    ease: "easeOut",
                  }}
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl bg-black/2 border border-black/5 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={c.product.images?.[0]}
                      alt={c.product.productName}
                    />
                  </div>

                  {/* Name + qty */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium tracking-tight text-black truncate">
                      {c.product.productName}
                    </p>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(c.product._id, c.quantity, -1)
                      }
                    >
                      <Minus className="w-5 h-5 text-black/25 cursor-pointer" />
                    </button>

                    <span className="text-xs p-2 text-black/30 tracking-tight mt-0.5">
                      Qty: {c.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleUpdateQuantity(c.product._id, c.quantity, 1)
                      }
                    >
                      <Plus className="w-5 h-5 text-black/25 cursor-pointer" />
                    </button>
                  </div>

                  {/* Price */}
                  <p className="text-sm font-semibold tracking-tight text-black shrink-0">
                    ₹{(c.product.price * c.quantity).toLocaleString()}
                  </p>
                  <button onClick={() => handleRemoveItem(c.product._id)}>
                    <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
                  </button>
                </motion.div>
              ))}
              <div></div>
            </div>

            {/* Summary */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-black/30 tracking-tight">
                <span>Subtotal ({totalQuantity} items)</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-black/30 tracking-tight">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-black/5">
                <span className="text-sm font-semibold tracking-tight text-black">
                  Total
                </span>
                <span className="text-sm font-semibold tracking-tight text-black">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link to="/checkout" className="block mt-6">
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-black hover:bg-black/80 text-white text-sm font-medium tracking-tight rounded-xl transition-all duration-300 cursor-pointer">
                Place Order
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>

            {/* Continue shopping */}
            <Link
              to="/products"
              className="block mt-3 text-center text-xs text-black/30 hover:text-black transition-colors tracking-tight"
            >
              Continue shopping
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default Cart;
