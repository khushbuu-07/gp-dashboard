import React, { useEffect, useRef, useState } from 'react';
import { Search, Bell, Sun, Moon, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { twMerge } from 'tailwind-merge';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [active, setActive] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const [isLightMode, setIsLightMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'light';
        return window.matchMedia('(prefers-color-scheme: light)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isLightMode) {
            root.classList.add('light');
            localStorage.setItem('theme', 'light');
            return;
        }
        root.classList.remove('light');
        localStorage.setItem('theme', 'dark');
    }, [isLightMode]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') setIsProfileOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 h-20 z-40 pl-72 transition-all duration-300 pointer-events-none bg-transparent">
            <div className="h-full w-full px-8 flex items-center justify-between pointer-events-auto backdrop-blur-md bg-dark-900/90 border-b border-dark-600/50 shadow-lg [.light_&]:bg-white/90 [.light_&]:border-slate-200">

                {/* Enhanced Search - Pill Style */}
                <div className="flex-1 max-w-xl relative group focus-within:max-w-2xl transition-all duration-500">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors duration-300" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search projects, clients, data..."
                        className="block w-full pl-14 pr-6 py-3 bg-dark-800/90 border border-dark-600 rounded-xl text-sm placeholder-text-muted text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-dark-800 focus:border-primary transition-all duration-300 hover:border-primary/50 shadow-lg [.light_&]:bg-slate-100 [.light_&]:border-slate-200 [.light_&]:text-slate-900 [.light_&]:placeholder-slate-500 [.light_&]:focus:bg-white"
                        onFocus={() => setActive(true)}
                        onBlur={() => setActive(false)}
                    />
                    <div className={twMerge("absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-primary/20 rounded-lg text-[10px] text-primary font-mono opacity-0 transition-opacity duration-300 border border-primary/30", active && "opacity-100")}>
                        /
                    </div>
                </div>

                {/* Actions & Profile */}
                <div className="flex items-center gap-6 ml-8">
                    {/* Quick Stats */}
                    <div className="hidden xl:flex items-center gap-4 border-r border-dark-600 pr-8 mr-2 [.light_&]:border-slate-200">
                        <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Live Projects
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
                            <Sun className="w-4 h-4 text-yellow" />
                            85 Active
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative p-3 rounded-xl bg-dark-800 border border-dark-600 hover:bg-dark-700 hover:border-primary/50 text-text-muted hover:text-text-primary transition-all duration-200 group shadow-lg hover:shadow-primary/20 [.light_&]:bg-white [.light_&]:border-slate-200 [.light_&]:text-slate-500 [.light_&]:hover:bg-slate-100 [.light_&]:hover:border-primary/40 [.light_&]:hover:text-slate-900">
                            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-dark-800 animate-pulse [.light_&]:border-white"></span>
                        </button>
                        <button
                            onClick={() => setIsLightMode((prev) => !prev)}
                            className="p-3 rounded-xl bg-dark-800 border border-dark-600 hover:bg-dark-700 hover:border-primary/50 text-text-muted hover:text-text-primary transition-all duration-200 hover:rotate-90 shadow-lg hover:shadow-primary/20 [.light_&]:bg-white [.light_&]:border-slate-200 [.light_&]:text-slate-500 [.light_&]:hover:bg-slate-100 [.light_&]:hover:border-primary/40 [.light_&]:hover:text-slate-900"
                            aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
                            title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="relative" ref={profileRef}>
                        {/* Profile Dropdown Trigger */}
                        <button
                            onClick={() => setIsProfileOpen((prev) => !prev)}
                            className="flex items-center gap-4 pl-2 cursor-pointer group bg-dark-800 pr-2 pl-4 py-2 rounded-xl border border-dark-600 hover:border-primary transition-all shadow-lg hover:shadow-primary/20 [.light_&]:bg-white [.light_&]:border-slate-200"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors [.light_&]:text-slate-900">{user?.name || 'Admin User'}</p>
                                <p className="text-[10px] text-text-muted font-bold tracking-wide uppercase">{user?.role || 'Admin'}</p>
                            </div>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-dark-700 p-0.5 border border-dark-600 overflow-hidden group-hover:scale-105 transition-transform group-hover:border-primary [.light_&]:bg-slate-100 [.light_&]:border-slate-200">
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-yellow flex items-center justify-center text-white font-bold text-xs">
                                        {user?.name?.charAt(0) || 'A'}
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-dark-900 rounded-full flex items-center justify-center border border-dark-600 [.light_&]:bg-white [.light_&]:border-slate-200">
                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                </div>
                            </div>
                            <ChevronDown className={twMerge("w-4 h-4 text-text-muted group-hover:text-primary transition-all", isProfileOpen && "rotate-180")} />
                        </button>

                        {/* Profile Popup Drawer */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-64 rounded-xl bg-dark-800 border border-dark-600 shadow-2xl p-2 z-50 animate-standard [.light_&]:bg-white [.light_&]:border-slate-200">
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-dark-700/70 transition-colors [.light_&]:hover:bg-slate-100">
                                    <User className="w-4 h-4" />
                                    Profile
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-dark-700/70 transition-colors [.light_&]:hover:bg-slate-100">
                                    <Settings className="w-4 h-4" />
                                    Account Settings
                                </button>
                                <div className="my-1 border-t border-dark-600/60 [.light_&]:border-slate-200" />
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
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

