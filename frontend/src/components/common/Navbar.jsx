import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const links = [
        { name: 'Store', href: '/products' },
        { name: 'About', href: '/about' },
        { name: 'Support', href: '/contact' },
    ];

    return (
        <>
            <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white/80 backdrop-blur-md border-b border-black/5' : 'bg-white'
            }`}>
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex items-center justify-between h-12">

                        {/* Logo */}
                        <Link to="/" className="opacity-90 hover:opacity-100 transition-opacity">
                            <span className="font-semibold tracking-tighter text-lg text-black">zonyfy_audios</span>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-10">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-sm font-medium text-black/70 hover:text-black transition-colors tracking-tight"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center gap-6">
                            <Link to="/cart" className="relative opacity-70 hover:opacity-100 transition-opacity">
                                {/* Fixed: w-4.5 h-4.5 is invalid in Tailwind v4 → use w-5 h-5 */}
                                <ShoppingBag className="w-4 4-5 stroke-[1.5]" />
                                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-black text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                                    0
                                </span>
                            </Link>

                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden opacity-70 hover:opacity-100 transition-opacity"
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                              <div>
                            <Link to="/login" className="hidden md:block text-sm font-medium text-black/70 hover:text-black transition-colors tracking-tight">
                                Sign In
                            </Link>
                        </div>
                        </div>
                      
                    </div>
                </div>
            </nav>

            {/* Mobile Menu — outside <nav> to avoid z-index / stacking context issues */}
            <div
                className={`fixed inset-0 top-12 bg-white z-40 md:hidden transition-transform duration-500 ease-in-out ${
                    isOpen ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="flex flex-col px-10 py-8 gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-semibold text-black/90 border-b border-black/5 pb-4"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-semibold text-black/90"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;