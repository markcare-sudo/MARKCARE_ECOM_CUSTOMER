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
            <footer className="bg-white border-t py-10">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
                    <p>© 2026 MarkCare E-Commerce. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default CustomerLayout;