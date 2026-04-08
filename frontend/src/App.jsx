import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCartFromServer } from "./redux/cartSlice";
import Layout from "./components/layoutes/Layout";
import Home from "./pages/user/Home";
import About from "./pages/user/About";
import Contact from "./pages/user/Contact";
import Products from "./pages/user/Products";
import Blog from "./pages/user/Blog";
import ProductDetails from "./pages/user/ProductDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/user/Cart";
import api from "./services/Api";
import Checkout from "./pages/user/Checkout";
import MyOrders from "./pages/user/MyOrders";
import PaymentSuccess from "./pages/user/payments/PaymentSuccess";
import PaymentFailed from "./pages/user/payments/PaymentFailed";
import AdminLayout from "./components/layoutes/adminLayout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/common/admin-common/AdminRoute";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import Customers from "./pages/admin/Customers";
import AdminPayments from "./pages/admin/AdminPayments";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await api.get("/cart");
        console.log("FULL RESPONSE:", res.data);
        console.log("CART ITEMS:", res.data.cart.items);
        dispatch(setCartFromServer(res.data.cart.items));
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/myOrders" element={<MyOrders />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
