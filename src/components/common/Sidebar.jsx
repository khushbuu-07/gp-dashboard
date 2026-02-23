import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Table, Phone, Briefcase, Users, FolderOpen, PhoneCall, LogOut, Hexagon, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { twMerge } from 'tailwind-merge';

const Sidebar = () => {
    const { logout } = useAuth();

    // Sidebar items matching the requested structure
    const items = [
        { path: '/', label: 'DASHBOARD', icon: LayoutDashboard },
        { path: '/blogs', label: 'BLOGS', icon: FileText },
        { path: '/all-projects', label: 'ALL PROJECTS', icon: FolderOpen },
        { path: '/clients-data', label: 'CLIENT DATA', icon: Users },
        { path: '/tables', label: 'CLIENT MANAGEMENT', icon: Table },
        { path: '/client-callback-data', label: 'CLIENT CALLBACK DATA', icon: PhoneCall },
        { path: '/queries', label: 'CLIENT QUERY', icon: Phone },
        { path: '/projects', label: 'MANAGE PROJECTS', icon: Briefcase },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-dark-850 border-r border-dark-600/30 flex flex-col z-50 text-text-secondary font-sans shadow-2xl">
            {/* Header/Logo */}
            <div className="p-8 pb-4 flex items-center gap-3 border-b border-dark-700/50">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Hexagon className="w-6 h-6 text-text-primary fill-text-primary/20" />
                </div>
                <div>
                    <span className="text-xl font-bold text-text-primary tracking-tighter block leading-none">
                        GLOBAL<span className="text-primary font-black">PROJECTS</span>
                    </span>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1 block">
                        Admin Panel
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                <div className="px-4 mb-9 text-[18px] font-bold text-text-primary uppercase tracking-[0.4em]">Main Menu</div>
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            twMerge(
                                "flex items-center gap-4 px-4 py-3.5 text-[13px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-inner shadow-primary/5"
                                    : "text-text-secondary hover:bg-dark-700 hover:text-text-primary"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={twMerge("w-4.5 h-4.5 transition-transform duration-300", isActive ? "scale-110 text-primary" : "group-hover:scale-110 group-hover:text-primary")} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Live Stats Promo */}
                <div className="mt-[20px] mx-2 bg-dark-800/50 p-5 rounded-2xl border border-dark-700/50 relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
                    <div className="relative z-10">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mb-4 text-primary">
                            <Zap className="w-4 h-4" />
                        </div>
                        <h4 className="text-text-primary font-bold text-xs mb-1 uppercase tracking-wider">Live Insights</h4>
                        <p className="text-[10px] text-text-muted mb-4 font-medium leading-relaxed">85 active projects under management.</p>
                        <button className="w-full py-2 bg-dark-700 hover:bg-primary hover:text-white text-primary rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border border-primary/20">
                            Check Activity
                        </button>
                    </div>
                </div>
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-dark-700/50 bg-dark-900/10">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-[11px] font-bold text-text-muted hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all uppercase tracking-widest group"
                >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

