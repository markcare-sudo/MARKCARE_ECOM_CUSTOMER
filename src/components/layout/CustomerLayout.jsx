import { Outlet, Link } from "react-router-dom";
import { FiShoppingCart, FiUser, FiSearch, FiHeart } from "react-icons/fi";
import Header from "./Header";
import CartDrawer from "@/features/products/pages/CartDrawer";
import { useState } from "react";

const CustomerLayout = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* TOP NAVBAR */}
            {/* <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    
                    <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
                        MARKCARE<span className="text-slate-800">.</span>
                    </Link>

                  
                    <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
                        <input
                            type="text"
                            placeholder="Search for products, brands..."
                            className="w-full bg-slate-100 border-none rounded-full py-2 px-10 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-slate-400" />
                    </div>

                    
                    <div className="flex items-center gap-5 text-slate-600">
                        <Link to="/wishlist" className="hover:text-blue-600"><FiHeart size={22} /></Link>
                        <Link to="/cart" className="hover:text-blue-600 relative">
                            <FiShoppingCart size={22} />
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
                        </Link>
                        <Link to="/profile" className="hover:text-blue-600"><FiUser size={22} /></Link>
                    </div>
                </div>
            </header> */}

            <Header onOpenCart={() => setIsCartOpen(true)} />

            {/* MAIN CONTENT */}
            <main className="flex-1">
                <Outlet />
            </main>

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            {/* FOOTER */}
            <footer className="bg-white border-t py-10 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
                    <p>© 2026 MarkCare E-Commerce. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default CustomerLayout;