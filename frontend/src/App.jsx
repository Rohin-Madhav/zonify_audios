import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCartFromServer } from "./redux/cartSlice";
import Layout from "./components/layoutes/Layout";
import Home from "./pages/User/Home";
import About from "./pages/User/About";
import Contact from "./pages/User/Contact";
import Products from "./pages/User/Products";
import Blog from "./pages/User/Blog";
import ProductDetails from "./pages/User/ProductDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/User/Cart";
import api from "./services/Api";
import Checkout from "./pages/User/Checkout";
import MyOrders from "./pages/User/MyOrders";
import PaymentSuccess from "./pages/User/Payments/PaymentSuccess";
import PaymentFailed from "./pages/User/Payments/PaymentFailed";
import AdminLayout from "./components/layoutes/adminLayout/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRoute from "./components/common/admin-common/AdminRoute";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import Customers from "./pages/Admin/Customers";
import AdminPayments from "./pages/Admin/AdminPayments";

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
