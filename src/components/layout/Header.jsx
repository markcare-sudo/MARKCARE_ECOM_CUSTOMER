import useAuth from "@/features/auth/useAuth";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  FiBell,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiPackage,
  FiMapPin,
} from "react-icons/fi";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LOGOS from "@/constants/images";
import SearchBar from "../ui/SearchBar";
import { useCart } from "@/context/CartContext"; // Added context for dynamic badge

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart(); // Use real cart count
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";

  // Dynamic Initials
  const initials = useMemo(() => {
    if (!user?.name) return "U";
    return user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }, [user]);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (query) => {
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-white border-b border-gray-100 shadow-sm">
      {/* 1. TOP UTILITY BAR (Desktop Only - Optional but professional) */}
      <div className="hidden md:block bg-gray-900 text-[11px] py-1.5 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <p>MarkCare: India's Trusted Service Marketplace</p>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-white">Help Center</Link>
            <Link to="/track-order" className="hover:text-white">Track Order</Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER ROW */}
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-8">

        {/* LOGO */}
        <Link to="/" className="flex-shrink-0 transition-transform active:scale-95">
          <img src={LOGOS.MARKCARE_LOGO} alt="MarkCare" className="h-8 md:h-10 w-auto" />
        </Link>

        {/* SEARCH BAR (Desktop) */}
        <div className="hidden md:block flex-1 max-w-2xl">
          <SearchBar
            placeholder="Search for RO services, lifts, industrial plants..."
            value={queryFromUrl}
            onSearch={handleSearchSubmit}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-1 md:gap-3">

          {/* Wishlist - Hidden on very small mobile to save space */}
          <Link
            to="/account/wishlist"
            className="hidden sm:flex p-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors"
          >
            <FiHeart size={22} />
          </Link>

          {/* Cart with dynamic Badge */}
          <Link
            to={`${location.pathname}?cart=open`}
            className="relative p-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors"
          >
            <FiShoppingCart size={22} />
            {cart?.items?.length > 0 && (
              <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center border-2 border-white">
                {cart.items.length}
              </span>
            )}
          </Link>

          <div className="hidden sm:block h-8 w-[1px] bg-gray-100 mx-1"></div>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {initials}
                </div>
                <FiChevronDown className={`text-gray-400 transition-transform hidden md:block ${open ? "rotate-180" : ""}`} />
              </button>

              {/* DROPDOWN MENU */}
              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Verified Account</p>
                  </div>
                  <DropdownLink to="/account/profile" icon={<FiUser />} label="My Profile" />
                  <DropdownLink to="/account/addresses" icon={<FiMapPin />} label="My Address" />
                  <DropdownLink to="/account/orders" icon={<FiPackage />} label="Orders & Bookings" />
                  <DropdownLink to="/account/settings" icon={<FiSettings />} label="Settings" />
                  <div className="border-t border-gray-50 mt-2 pt-2">
                    <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* 3. MOBILE SEARCH BAR (Fixed at bottom of header) */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar
          placeholder="What are you looking for?"
          value={queryFromUrl}
          onSearch={handleSearchSubmit}
        />
      </div>

      {/* 4. NAVIGATION LINKS (Production standard for Category discovery) */}
      <div className="hidden md:block border-t border-gray-50 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex gap-8 items-center text-xs font-bold text-gray-600 uppercase tracking-wide">
          <Link to="/services" className="flex items-center gap-2 hover:text-blue-600"><FiMenu /> All Categories</Link>
          <Link to="/category/ro-plants" className="hover:text-blue-600">RO Plants</Link>
          <Link to="/category/elevators" className="hover:text-blue-600">Elevators</Link>
          <Link to="/category/spare-parts" className="hover:text-blue-600">Spare Parts</Link>
          <Link to="/offers" className="text-red-500 hover:text-red-600">🔥 Hot Deals</Link>
        </div>
      </div>
    </header>
  );
};

// Helper Dropdown Component
const DropdownLink = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
    {icon} {label}
  </Link>
);

export default Header;