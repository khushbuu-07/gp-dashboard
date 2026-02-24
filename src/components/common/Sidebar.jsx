import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Table, Phone, Briefcase, Users, FolderOpen, PhoneCall, LogOut, Hexagon, Zap,
    BarChart2, Shield, PieChart, UserSquare, UserCheck, UserCog, ClipboardCheck, Building2, Settings, Activity,
    ChevronDown, ChevronRight, CreditCard, History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { twMerge } from 'tailwind-merge';

const Sidebar = ({ className }) => {
    const { logout } = useAuth();
    const location = useLocation();
    const [openMenus, setOpenMenus] = React.useState({});

    const toggleMenu = (label) => {
        setOpenMenus(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const navItems = [
        { type: 'heading', label: 'Main' },
        { path: '/dashboard/overview', label: 'Unified Overview', icon: Activity },

        { type: 'heading', label: 'Management' },
        // { path: '/dashboard/management', label: 'Dashboard', icon: LayoutDashboard },

        {
            label: 'Project Management',
            icon: Briefcase,
            subItems: [
                { path: '/management/projects', label: 'Manage Projects', icon: Briefcase },
                { path: '/management/all-projects', label: 'All Projects', icon: FolderOpen },
            ]
        },

        {
            label: 'Client Management',
            icon: Users,
            subItems: [
                { path: '/management/clients', label: 'Client Data', icon: Users },
                { path: '/management/queries', label: 'Client Queries', icon: Phone },
                { path: '/management/callback', label: 'Callback Data', icon: PhoneCall },
                { path: '/management/tables', label: 'Client Management', icon: Table },
                { path: '/management/billing/generate', label: 'Bill Generate', icon: CreditCard },
                { path: '/management/billing/history', label: 'Invoice History', icon: History },
            ]
        },

        { type: 'heading', label: 'Evaluation' },
        {
            label: 'Evaluation',
            icon: BarChart2,
            subItems: [
                { path: '/dashboard/evaluation', label: 'Dashboard', icon: BarChart2 },
                { path: '/evaluation/agent', label: 'Agent Evaluation', icon: UserCheck },
                { path: '/evaluation/tl', label: 'TL Evaluation', icon: UserCog },
                { path: '/evaluation/qa', label: 'QA Evaluation', icon: ClipboardCheck },
                { path: '/evaluation/center', label: 'Center Evaluation', icon: Building2 },
                { path: '/evaluation/admin', label: 'Manage Admin', icon: Settings },
                { path: '/evaluation/charts', label: 'Chart View', icon: PieChart },
            ]
        },

        { type: 'heading', label: 'Identity' },
        { path: '/dashboard/identity', label: 'Identity Hub', icon: Shield },
        { path: '/identity/overview', label: 'Center Data', icon: UserSquare },

        { type: 'heading', label: 'Blogs' },
        { path: '/management/blogs', label: 'Blogs', icon: FileText },

    ];

    // Auto-open menus if a child is active
    React.useEffect(() => {
        navItems.forEach(item => {
            if (item.subItems?.some(sub => location.pathname === sub.path)) {
                setOpenMenus(prev => ({ ...prev, [item.label]: true }));
            }
        });
    }, [location.pathname]);

    return (
        <aside className={twMerge("fixed left-0 top-0 h-screen w-[23rem] bg-dark-850 border-r border-dark-600/30 flex flex-col z-50 text-text-secondary shadow-2xl transition-all duration-300 overflow-y-auto overflow-x-hidden", className)}>
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
            <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1">
                {navItems.map((item, index) => {
                    if (item.type === 'heading') {
                        const isActive =
                            (item.label === 'Main' && location.pathname.includes('/dashboard/overview')) ||
                            (item.label === 'Management' && (location.pathname.includes('/management') || location.pathname.includes('/dashboard/management'))) ||
                            (item.label === 'Evaluation' && (location.pathname.includes('/evaluation') || location.pathname.includes('/dashboard/evaluation'))) ||
                            (item.label === 'Identity' && (location.pathname.includes('/identity') || location.pathname.includes('/dashboard/identity')));

                        return (
                            <div key={index} className="px-4 pt-6 pb-2 flex items-center gap-2">
                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />}
                                <h3 className={twMerge("text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300", isActive ? "text-primary" : "text-text-muted")}>
                                    {item.label}
                                </h3>
                            </div>
                        );
                    }

                    if (item.subItems) {
                        const isMenuOpen = openMenus[item.label];
                        const isAnyChildActive = item.subItems.some(sub => location.pathname === sub.path);

                        return (
                            <div key={item.label} className="space-y-1">
                                <button
                                    onClick={() => toggleMenu(item.label)}
                                    className={twMerge(
                                        "w-full flex items-center gap-4 px-4 py-3.5 text-[13px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 group relative",
                                        isAnyChildActive
                                            ? "bg-primary/5 text-primary border border-primary/10"
                                            : "text-text-secondary hover:bg-dark-700 hover:text-text-primary"
                                    )}
                                >
                                    <item.icon className={twMerge("w-4.5 h-4.5 transition-transform duration-300", isAnyChildActive ? "scale-110 text-primary" : "group-hover:scale-110 group-hover:text-primary")} />
                                    <span>{item.label}</span>
                                    <div className="ml-auto flex items-center gap-2">
                                        {isMenuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </div>
                                </button>

                                {isMenuOpen && (
                                    <div className="ml-6 space-y-1 border-l border-dark-700/50 pl-2 transition-all duration-300 animate-standard">
                                        {item.subItems.map((subItem) => (
                                            <NavLink
                                                key={subItem.path}
                                                to={subItem.path}
                                                className={({ isActive }) =>
                                                    twMerge(
                                                        "flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 group relative",
                                                        isActive
                                                            ? "text-primary bg-primary/5"
                                                            : "text-text-muted hover:text-text-primary hover:bg-dark-700/50"
                                                    )
                                                }
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <subItem.icon className={twMerge("w-3.5 h-3.5", isActive ? "text-primary" : "group-hover:text-primary")} />
                                                        <span>{subItem.label}</span>
                                                        {isActive && (
                                                            <div className="ml-auto w-1 h-3 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                                                        )}
                                                    </>
                                                )}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
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
                    );
                })}

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
