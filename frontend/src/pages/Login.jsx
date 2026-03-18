import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/Api";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import {setCartFromServer} from "../redux/cartSlice"


const fields = [
  { name: "email",    type: "email",    placeholder: "Email address", icon: Mail },
  { name: "password", type: "password", placeholder: "Password",      icon: Lock },
];

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
    
      const {token,user} = res.data

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role",user.role)
      
 if (user.role === "user") {
  const cartRes = await api.get("/cart");
  const items = cartRes.data?.cart?.items || [];
  dispatch(setCartFromServer(items));
}
      toast.success("Login successful");
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
    } catch (err) {
      console.log(err.message);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-24">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >

        {/* Brand */}
        <div className="mb-10 text-center">
          <Link to="/">
            <span className="font-semibold tracking-tighter text-2xl text-black">Zonyfy_audios</span>
          </Link>
          <p className="text-sm text-black/35 tracking-tight mt-2">Welcome back</p>
        </div>

        {/* Form Card */}
        <div className="border border-black/5 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-3">
            {fields.map(({ name, type, placeholder, icon: Icon }, i) => (
              <motion.div
                key={name}
                className="relative"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              >
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/25" strokeWidth={1.5} />
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm tracking-tight text-black placeholder-black/25 bg-black/2 border border-black/5 rounded-xl outline-none focus:border-black/20 focus:bg-white transition-all duration-200"
                />
              </motion.div>
            ))}

            {/* Forgot password */}
            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-xs text-black/30 hover:text-black transition-colors tracking-tight">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-black hover:bg-black/80 disabled:bg-black/20 text-white text-sm font-medium tracking-tight rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Register redirect */}
        <p className="text-center text-xs text-black/30 tracking-tight mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-black hover:underline font-medium">
            Create one
          </Link>
        </p>

      </motion.div>
    </main>
  );
};

export default Login;