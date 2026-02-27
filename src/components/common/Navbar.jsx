import React, { useEffect, useRef, useState } from 'react';
import { Search, Bell, Sun, Moon, ChevronDown, User, LogOut, Settings, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { twMerge } from 'tailwind-merge';

const Navbar = ({ onMenuClick, isSidebarCollapsed }) => {
    const { user, logout } = useAuth();
    
    const actualUser = user?.user || user;
    const userName = actualUser?.name;
    const userRole = actualUser?.role;
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const [isLightMode, setIsLightMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'light' : false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isLightMode) {
            root.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            root.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        }
    }, [isLightMode]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className={twMerge(
            "fixed top-0 h-20 z-40 transition-all duration-300",
            // Adjust left and right based on sidebar state
            isSidebarCollapsed ? "left-20" : "left-64",
            "right-0",
            // Mobile: full width
            "md:left-auto",
            isSidebarCollapsed ? "md:left-20" : "md:left-64"
        )}>
            <div className="h-full w-full px-4 md:px-8 flex items-center justify-between bg-dark-900/90 backdrop-blur-md border-b border-dark-600/30 shadow-lg">
                
                {/* Left section */}
                <div className="flex items-center flex-1 gap-4 min-w-0">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg bg-dark-800 border border-dark-600/30 hover:bg-dark-700 hover:border-primary/50 text-text-muted hover:text-text-primary transition-all md:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Welcome Text */}
                    <div className="hidden lg:block">
                        <h2 className="text-lg font-semibold text-text-primary">
                            Welcome back, {userName || 'Admin'}
                        </h2>
                        <p className="text-xs text-text-muted">
                            {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-600/30 rounded-lg text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        />
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsLightMode(!isLightMode)}
                        className="p-2 rounded-lg bg-dark-800 border border-dark-600/30 hover:bg-dark-700 transition-all"
                    >
                        {isLightMode ? 
                            <Moon className="w-4 h-4 text-text-muted" /> : 
                            <Sun className="w-4 h-4 text-text-muted" />
                        }
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg bg-dark-800 border border-dark-600/30 hover:bg-dark-700 transition-all">
                        <Bell className="w-4 h-4 text-text-muted" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                    </button>

                    {/* Profile */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-dark-800 border border-dark-600/30 hover:bg-dark-700 transition-all"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-yellow flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                    {userName?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-text-primary">{userName || 'Admin User'}</p>
                                <p className="text-xs text-text-muted">{userRole || 'Administrator'}</p>
                            </div>
                            <ChevronDown className={twMerge(
                                "w-4 h-4 text-text-muted transition-transform",
                                isProfileOpen && "rotate-180"
                            )} />
                        </button>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-600/30 rounded-lg shadow-xl py-1 z-50">
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-dark-700 hover:text-text-primary transition-colors">
                                    <User className="w-4 h-4" />
                                    Profile
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-dark-700 hover:text-text-primary transition-colors">
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                                <div className="my-1 border-t border-dark-600/30" />
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;