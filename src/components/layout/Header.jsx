import useAuth from "@/features/auth/useAuth";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  FiBell,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiHeart,
} from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LOGOS from "@/constants/images";
import SearchBar from "../ui/SearchBar";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ GET QUERY FROM URL
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";

  const lastSearchRef = useRef("");

  const handleSearchSubmit = (query) => {
    if (!query || query === lastSearchRef.current) return;

    lastSearchRef.current = query;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // ✅ USER INITIALS
  const initials = useMemo(() => {
    if (!user?.name) return "MC";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  // ✅ CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-gray-100">

      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col gap-3">

        {/* ✅ TOP ROW */}
        <div className="flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link to="/" className="flex-shrink-0 active:scale-95">
            <img
              src={LOGOS.MARKCARE_LOGO}
              alt="MarkCare"
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* ✅ DESKTOP SEARCH */}
          <div className="hidden md:block flex-1 max-w-lg">
            <SearchBar
              placeholder="Search for services, lifts, or RO plants..."
              value={queryFromUrl}
              onSearch={handleSearchSubmit}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 md:gap-4" ref={dropdownRef}>
            {/* WISHLIST */}
            <button onClick={() => navigate("/wishlist")} className="relative p-2 cursor-pointer text-gray-500 hover:bg-gray-100 rounded-full">
              <FiHeart className="text-xl" />
            </button>

            {/* NOTIFICATION */}
            <button className="relative p-2 cursor-pointer text-gray-500 hover:bg-gray-100 rounded-full">
              <FiBell className="text-xl" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>

            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-50 border hover:border-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>

                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-gray-700 truncate max-w-[80px]">
                    {user?.name?.split(" ")[0] || "Account"}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase">
                    Pro User
                  </p>
                </div>

                <FiChevronDown
                  className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* DROPDOWN */}
              {open && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border overflow-hidden">

                  <div className="px-5 py-4 border-b bg-gray-50">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.name || "MarkCare User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || "user@markcare.com"}
                    </p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-blue-50 rounded-xl"
                    >
                      <FiUser /> My Profile
                    </button>

                    <button
                      onClick={() => navigate("/settings")}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-blue-50 rounded-xl"
                    >
                      <FiSettings /> Settings
                    </button>
                  </div>

                  <div className="p-2 border-t">
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <FiLogOut /> Sign out
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ MOBILE SEARCH (NEW) */}
        <div className="block md:hidden">
          <SearchBar
            placeholder="Search..."
            value={queryFromUrl}
            onSearch={handleSearchSubmit}
          />
        </div>

      </div>
    </header>
  );
};

export default Header;



