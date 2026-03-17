import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mail, User, MessageSquare, ArrowRight } from "lucide-react";
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const serviceID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const templateParams = {
      from_name:  formData.name,
      from_email: formData.email,
      message:    formData.message,
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((err) => {
        console.error("FAILED...", err);
        toast.error("Failed to send message.");
      })
      .finally(() => setLoading(false));
  };

  const fields = [
    { name: "name",    type: "text",  placeholder: "Your name",      icon: User,          el: "input"    },
    { name: "email",   type: "email", placeholder: "Email address",  icon: Mail,          el: "input"    },
    { name: "message", type: "text",  placeholder: "Your message…",  icon: MessageSquare, el: "textarea" },
  ];

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-3">
            Get in touch
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-black leading-tight">
            We'd love to
            <br />
            <span className="text-black/25">hear from you.</span>
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">

          {/* Left — info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm text-black/40 leading-relaxed tracking-tight max-w-xs">
              Have a question about our products, an order, or just want to say hello? Drop us a message and we'll get back to you within 24 hours.
            </p>

            <div className="space-y-5">
              {[
                { label: "Email",   value: "support@zonifyaudios.com" },
                { label: "Hours",   value: "Mon – Fri, 9am – 6pm" },
                { label: "Returns", value: "30-day hassle-free returns" },
              ].map(({ label, value }) => (
                <div key={label} className="border-b border-black/5 pb-5">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-black/25 mb-1">{label}</p>
                  <p className="text-sm text-black/60 tracking-tight">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              {fields.map(({ name, type, placeholder, icon: Icon, el }, i) => (
                <motion.div
                  key={name}
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07, ease: "easeOut" }}
                >
                  <Icon
                    className={`absolute left-3.5 w-4 h-4 text-black/25 ${el === "textarea" ? "top-3.5" : "top-1/2 -translate-y-1/2"}`}
                    strokeWidth={1.5}
                  />
                  {el === "textarea" ? (
                    <textarea
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required
                      rows={5}
                      className="w-full pl-10 pr-4 py-2.5 text-sm tracking-tight text-black placeholder-black/25 bg-black/2 border border-black/5 rounded-xl outline-none focus:border-black/20 focus:bg-white transition-all duration-200 resize-none"
                    />
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm tracking-tight text-black placeholder-black/25 bg-black/2 border border-black/5 rounded-xl outline-none focus:border-black/20 focus:bg-white transition-all duration-200"
                    />
                  )}
                </motion.div>
              ))}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-black hover:bg-black/80 disabled:bg-black/20 text-white text-sm font-medium tracking-tight rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send message
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </main>
  );
};

export default Contact;