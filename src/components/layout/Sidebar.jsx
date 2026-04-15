import React, { useState, useEffect, useRef, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as Icons from "react-icons/fi";
import LOGOS from "@/constants/images";

const MENU_ORDER = {
  DASHBOARD: 1,
  SAMPLES: 2,
  WORKFLOW: 3,
  INVENTORY: 4,
  REPORTS: 5,
  BILLING: 6,
  USERS: 7,
  TENANT: 8,
  AUDIT: 9,
  EMAILS: 10,
  SETTINGS: 11,
};

const getModuleIcon = (code) => {
  const iconMap = {
    DASHBOARD: Icons.FiPieChart,
    USERS: Icons.FiUsers,
    BILLING: Icons.FiCreditCard,
    TENANT: Icons.FiLayers,
    INVENTORY: Icons.FiPackage,
    REPORTS: Icons.FiBarChart2,
    SETTINGS: Icons.FiSettings,
    SAMPLES: Icons.FiDroplet,
    WORKFLOW: Icons.FiGitMerge,
    AUDIT: Icons.FiClipboard,
    EMAILS: Icons.FiMail,
  };
  return iconMap[code] || Icons.FiBox;
};

const Sidebar = ({ menuItems = [], collapsed = false, toggleSidebar, onLogout }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef();

  // 1. Sort items
  const sortedMenuItems = useMemo(() => {
    return [...menuItems].sort((a, b) => {
      const orderA = MENU_ORDER[a.code] || 99;
      const orderB = MENU_ORDER[b.code] || 99;
      return orderA - orderB;
    });
  }, [menuItems]);

  // 2. ✅ LOGIC: Auto-open menus based on current URL path
  useEffect(() => {
    const currentPath = location.pathname;
    const newOpenMenus = { ...openMenus };

    sortedMenuItems.forEach((module) => {
      // If the current URL matches the module path or any of its feature paths
      const isModuleActive = currentPath.startsWith(module.path);

      if (isModuleActive && module.features?.length > 0) {
        newOpenMenus[module.id] = true;
      }
    });

    setOpenMenus(newOpenMenus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, sortedMenuItems]); // Sync when path changes

  // 3. Handle Outside Clicks for Profile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. Manual Toggle Logic
  const handleToggle = (moduleId, hasFeatures) => {
    if (collapsed || !hasFeatures) return;
    setOpenMenus((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <aside className={`h-screen bg-white text-gray-700 flex flex-col transition-all duration-300 border-r border-gray-200 overflow-hidden ${collapsed ? "w-16" : "w-64"}`}>

      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 shrink-0">
        {!collapsed && <img src={LOGOS.MARKCARE_LOGO} alt="iQLIMS" className="h-7 w-auto transition-all" />}
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 text-xl transition-colors">
          <Icons.FiMenu />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 no-scrollbar">
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        {sortedMenuItems.map((module) => {
          const ModuleIcon = getModuleIcon(module.code);
          const hasFeatures = module.features && module.features.length > 0;
          const isOpen = openMenus[module.id];
          const isActive = location.pathname.startsWith(module.path);

          return (
            <div key={module.id} className="group">
              <div className="relative">
                <NavLink
                  to={hasFeatures ? "#" : module.path}
                  onClick={(e) => {
                    if (hasFeatures) {
                      e.preventDefault();
                      handleToggle(module.id, hasFeatures);
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <ModuleIcon className={`text-xl shrink-0 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                  {!collapsed && (
                    <span className={`flex-1 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis ${isActive ? "font-semibold" : ""}`}>
                      {module.name}
                    </span>
                  )}
                  {!collapsed && hasFeatures && (
                    <Icons.FiChevronRight className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
                  )}
                </NavLink>

                {collapsed && (
                  <div className="fixed left-20 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity whitespace-nowrap uppercase tracking-wider font-bold">
                    {module.name}
                  </div>
                )}
              </div>

              {/* Sub-menu: Only show if NOT collapsed and is OPEN */}
              {!collapsed && hasFeatures && isOpen && (
                <div className="ml-9 mt-1 space-y-1 border-l border-gray-100 pl-4 animate-in slide-in-from-top-2 duration-200">
                  {module.features.map((feat) => (
                    <NavLink
                      key={feat.id}
                      to={`${module.path}/${feat.code.toLowerCase().replace(/_/g, "-")}`}
                      className={({ isActive: isSubActive }) =>
                        `block py-2 text-xs transition-all ${isSubActive ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-800"
                        }`
                      }
                    >
                      {feat.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="mt-auto bg-gray-50 border-t border-gray-200" ref={profileRef}>
        <div className="relative p-4">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${collapsed ? "justify-center" : "bg-white hover:bg-gray-100 border border-gray-200 shadow-sm"
              }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shrink-0 ring-2 ring-white">
              AD
            </div>
            {!collapsed && (
              <div className="text-left overflow-hidden flex-1">
                <p className="text-xs font-black truncate tracking-tight text-gray-800 uppercase">Admin User</p>
                <p className="text-[10px] text-gray-500 truncate">System Manager</p>
              </div>
            )}
            {!collapsed && <Icons.FiMoreVertical className="text-gray-400" />}
          </button>

          {showProfileMenu && (
            <div className="absolute bottom-full mb-3 left-3 right-3 bg-white text-gray-800 rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
              <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors">
                <Icons.FiUser className="text-blue-600" /> My Profile
              </button>
              <div className="h-px bg-gray-100 my-1 mx-4" />
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center gap-3 font-bold transition-colors"
              >
                <Icons.FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;