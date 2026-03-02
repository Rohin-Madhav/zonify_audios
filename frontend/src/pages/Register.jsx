import React, { useState } from "react";
import api from "../services/Api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";

const fields = [
  { name: "name",     type: "text",     placeholder: "Full name",     icon: User  },
  { name: "email",    type: "email",    placeholder: "Email address", icon: Mail  },
  { name: "phone",    type: "text",     placeholder: "Phone number",  icon: Phone },
  { name: "password", type: "password", placeholder: "Password",      icon: Lock  },
];

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("Registration successful");
      navigate("/login");
    } catch (error) {
      console.log(error.message);
      toast.error("Registration failed");
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
          <p className="text-sm text-black/35 tracking-tight mt-2">Create your account</p>
        </div>

        {/* Form Card */}
        <div className="border border-black/5 rounded-2xl p-8 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {fields.map(({ name, type, placeholder, icon: Icon }, i) => (
              <motion.div
                key={name}
                className="relative"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
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

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 bg-black hover:bg-black/80 disabled:bg-black/20 text-white text-sm font-medium tracking-tight rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Login redirect */}
        <p className="text-center text-xs text-black/30 tracking-tight mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-black hover:underline font-medium">
            Sign in
          </Link>
        </p>

      </motion.div>
    </main>
  );
};

export default Register;