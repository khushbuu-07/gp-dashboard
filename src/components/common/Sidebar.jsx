import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { ChevronDown, ChevronRight, LogOut, Hexagon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SIDEBAR_CONFIG } from "../../config/sidebar.config";
import { ROLE_ACCESS } from "../../config/roles.map";

const Sidebar = ({ className }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});

  // Handle both direct user object and nested user structure
  // When login stores response.data, it's { user: { id, name, email, role }, token }
  const actualUser = user?.user || user;
  const userRole = actualUser?.role;
  
  // Normalize role key to match ROLE_ACCESS keys (uppercase with underscore)
  const normalizedRole = userRole ? userRole.toUpperCase().replace("-", "_") : "ADMIN";
  const allowedKeys = ROLE_ACCESS[normalizedRole] || [];
  
  // Debug: Log role information
  console.log('=== Sidebar Debug ===');
  console.log('Full user object:', user);
  console.log('Actual user:', actualUser);
  console.log('User role:', userRole);
  console.log('Normalized role:', normalizedRole);
  console.log('ROLE_ACCESS keys:', Object.keys(ROLE_ACCESS));
  console.log('Allowed keys for role:', allowedKeys);

  const hasAccess = (key) => {
    if (allowedKeys.includes("*")) return true;
    return allowedKeys.includes(key);
  };

  const filteredSidebar = SIDEBAR_CONFIG.filter((item) =>
    hasAccess(item.key)
  );
  
  console.log('Filtered sidebar items count:', filteredSidebar.length);

  const groupedSections = filteredSidebar.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <aside
      className={twMerge(
        "fixed left-0 top-0 h-screen w-[23rem] overflow-hidden overflow-y-auto bg-dark-850 border-r border-dark-600/30 flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="p-8 flex items-center gap-3 border-b border-dark-700/50">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
          <Hexagon className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold text-Black block">
            GLOBAL{" "}<span className="text-primary">PROJECTS</span>
          </span>
          <span className="text-[10px] text-gray-400 uppercase">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        {Object.entries(groupedSections).map(([section, items]) => (
          <div key={section}>
            <h3 className="text-xs text-gray-400 font-bold uppercase mb-3">
              {section}
            </h3>

            {items.map((item) => {
              if (item.type === "item") {
                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    className={({ isActive }) =>
                      twMerge(
                        "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-400 hover:text-black hover:bg-dark-700"
                      )
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                );
              }

              if (item.type === "menu") {
                const isOpen = openMenus[item.label];

                return (
                  <div key={item.key}>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className="w-full flex items-center gap-4 px-4 py-3 text-sm font-semibold text-gray-400 hover:text-black hover:bg-dark-700 rounded-xl"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      <div className="ml-auto">
                        {isOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.key}
                            to={child.path}
                            className={({ isActive }) =>
                              twMerge(
                                "flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition",
                                isActive
                                  ? "text-primary bg-primary/5"
                                  : "text-gray-500 hover:text-black"
                              )
                            }
                          >
                            <child.icon className="w-3.5 h-3.5" />
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-dark-700/50">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
