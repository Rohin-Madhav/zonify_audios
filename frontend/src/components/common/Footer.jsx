import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const links = {
  Store: [
    { name: "All Products", href: "/products" },
    { name: "New Arrivals", href: "/new" },
    { name: "Best Sellers", href: "/best-sellers" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ],
  Social_Media: [
    { name: <Instagram/>, href: "/#" },
    { name: <Facebook/>, href: "/#" },
    { name: <Youtube/>, href: "/#" },
  ],
};

const Footer = () => {
  return (
    <footer className="border-t border-black/5 bg-white">

      {/* Main */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-10">

          {/* Brand — full width on mobile */}
          <div className="space-y-2">
            <Link to="/">
              <span className="font-semibold tracking-tighter text-xl text-black">Zonyfy_audios</span>
            </Link>
            <p className="text-sm text-black/40 leading-relaxed max-w-xs">
              Premium audio gear for those who hear the difference.
            </p>
          </div>

          {/* Link columns — always 3 cols */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10">
            {Object.entries(links).map(([group, items]) => (
              <div key={group} className="space-y-3">
                <h4 className="text-[10px] font-semibold tracking-widest uppercase text-black/30">
                  {group}
                </h4>
                <ul className="space-y-2.5">
                  {items.map((item, idx) => (
                    <li key={`${group}-${idx}`}>
                      <Link
                        to={item.href}
                        className="text-xs sm:text-sm text-black/50 hover:text-black transition-colors tracking-tight"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-black/30">
            © {new Date().getFullYear()} Zonyfy_audios. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-black/30 hover:text-black/60 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-black/30 hover:text-black/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;