import { Link, Outlet, useLocation } from "react-router-dom";
import {
    FiUser,
    FiMapPin,
    FiShoppingBag,
    FiHeart,
    FiLogOut,
    FiChevronRight
} from "react-icons/fi";

const AccountLayout = ({ children }) => {
    const location = useLocation();

    const menuItems = [
        { label: "My Profile", path: "/account/profile", icon: <FiUser /> },
        { label: "Manage Addresses", path: "/account/addresses", icon: <FiMapPin /> },
        { label: "My Orders", path: "/account/orders", icon: <FiShoppingBag /> },
        { label: "Wishlist", path: "/account/wishlist", icon: <FiHeart /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-4 md:py-8">
            <div className="max-w-7xl px-4 mx-auto flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <aside className="hidden md:block w-full md:w-80 flex-shrink-0">
                    <div className="bg-white rounded shadow-sm border border-slate-100 overflow-hidden">

                        {/* User Header */}
                        <div className="p-6 bg-indigo-600 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold text-xl">
                                JS
                            </div>
                            <div className="text-white">
                                <p className="text-xs opacity-80 uppercase tracking-wider font-semibold">Hello,</p>
                                <p className="font-bold text-lg">John Sharma</p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="p-2">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center justify-between p-4 rounded-xl transition-all group ${isActive
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 font-semibold">
                                            <span className={`text-xl ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                                                {item.icon}
                                            </span>
                                            {item.label}
                                        </div>
                                        <FiChevronRight className={`transition-transform ${isActive ? "rotate-90 text-indigo-600" : "text-slate-300"}`} />
                                    </Link>
                                );
                            })}

                            <hr className="my-2 border-slate-100" />

                            <button className="w-full flex items-center gap-3 p-4 text-red-500 font-semibold hover:bg-red-50 rounded-xl transition-all">
                                <FiLogOut className="text-xl" />
                                Logout
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Right Side Main Content */}
                <main className="flex-grow shadow-sm border border-slate-100 bg-white p-4 md:p-6 min-h-[600px]">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default AccountLayout;