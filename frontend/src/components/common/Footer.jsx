import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const links = {
        Company: [
            { name: 'About', href: '/about' },
            { name: 'Blog', href: '/blog' },
        ],
        Support: [
            { name: 'Contact', href: '/contact' },
        ],
        SocialMedias: [
            { name: <Facebook/>, href: '#' },
            { name: <Youtube/>, href: '#' },
            { name: <Instagram/>, href: '#' },
        ]
    };

    return (
        <footer className="border-t border-black/5 bg-white">

            {/* Main */}
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 space-y-3">
                        <Link to="/">
                            <span className="font-semibold tracking-tighter text-xl text-black">Zonyfy_audios</span>
                        </Link>
                        <p className="text-sm text-black/50 leading-relaxed max-w-45">
                            Premium audio gear for those who hear the difference.
                        </p>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([group, items]) => (
                        <div key={group} className="space-y-4">
                            <h4 className="text-xs font-semibold tracking-widest uppercase text-black/40">{group}</h4>
                            <ul className="space-y-3">
                                {items.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            to={item.href}
                                            className="text-sm text-black/60 hover:text-black transition-colors tracking-tight"
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

            {/* Bottom bar */}
            <div className="border-t border-black/5">
                <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-black/30">© {new Date().getFullYear()} Zonyfy_audios. All rights reserved.</p>
                </div>
            </div>

        </footer>
    );
};

export default Footer;