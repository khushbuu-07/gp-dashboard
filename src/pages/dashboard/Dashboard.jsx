
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, CreditCard, RefreshCw, MoreHorizontal, Users, Briefcase, TrendingUp, ChevronDown, FileText, Phone } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Dashboard = () => {
    // Global Projects Admin Data - Projects Performance
    const projectData = [
        { name: 'Jan', projects: 45, revenue: 125000 },
        { name: 'Feb', projects: 52, revenue: 145000 },
        { name: 'Mar', projects: 48, revenue: 138000 },
        { name: 'Apr', projects: 61, revenue: 168000 },
        { name: 'May', projects: 58, revenue: 162000 },
        { name: 'Jun', projects: 65, revenue: 185000 },
        { name: 'Jul', projects: 72, revenue: 210000 },
        { name: 'Aug', projects: 68, revenue: 198000 },
        { name: 'Sep', projects: 75, revenue: 225000 },
        { name: 'Oct', projects: 82, revenue: 245000 },
        { name: 'Nov', projects: 78, revenue: 235000 },
        { name: 'Dec', projects: 85, revenue: 258000 },
    ];

    // Active Projects by Category
    const projectCategories = [
        { name: 'Data Entry', count: 24, change: '+12.5%', revenue: '₹2,45,000', color: '#1A6DD9' },
        { name: 'Call Center', count: 18, change: '+8.2%', revenue: '₹1,85,000', color: '#F0C419' },
        { name: 'Software Dev', count: 15, change: '+15.3%', revenue: '₹3,20,000', color: '#1A6DD9' },
        { name: 'Backend Projects', count: 12, change: '+5.1%', revenue: '₹1,45,000', color: '#F0C419' },
    ];

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">

            {/* Top Header */}
            <div className="flex justify-between items-end pb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-text-muted text-sm mt-1 font-medium">Welcome back! Monitor your outsourcing projects and business metrics.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-text-muted text-xs font-bold hover:text-text-primary hover:border-primary/50 transition-colors"> Export </button>
                    <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/30 transition-all flex items-center gap-2 hover:shadow-primary/40">
                        <RefreshCw className="w-3 h-3" /> Refresh Data
                    </button>
                </div>
            </div>

            {/* Top Grid: Cards + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Col: Stats Cards */}
                <div className="space-y-6">
                    {/* Total Revenue Card */}
                    <div className="bg-gradient-to-br from-dark-800 via-dark-800/95 to-dark-900 rounded-3xl p-6 border border-dark-600/50 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <div>
                                <h3 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</h3>
                                <p className="text-text-primary font-bold text-sm">This Month</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Wallet className="w-5 h-5 text-primary" />
                            </div>
                        </div>

                        <div className="mb-6 z-10 relative">
                            <p className="text-2xl font-bold text-text-primary tracking-tight mb-2">₹25,58,000</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-yellow bg-yellow/10 px-2 py-1 rounded border border-yellow/30">
                                    <TrendingUp className="w-3 h-3 inline mr-1" /> +18.5%
                                </span>
                                <span className="text-[10px] text-text-muted">vs last month</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button className="py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all duration-300">View Report</button>
                            <button className="py-3 bg-gradient-to-r from-dark-700 to-dark-800 text-text-muted rounded-xl text-sm font-bold border border-dark-600/50 hover:bg-gradient-to-r hover:from-dark-600 hover:to-dark-700 hover:text-text-primary hover:border-primary/40 active:scale-95 transition-all duration-300">Export</button>
                        </div>
                    </div>

                    {/* Active Projects List */}
                    <div className="bg-gradient-to-br from-dark-800 via-dark-800/95 to-dark-900 rounded-3xl p-6 border border-dark-600/50 shadow-xl hover:border-primary/30 hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="text-text-primary font-bold text-sm">Active Projects</h3>
                            <MoreHorizontal className="text-text-muted w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-4 relative z-10">
                            {projectCategories.map((category, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-dark-700/50 p-2 rounded-xl transition-colors -mx-2 hover:border-l-2 hover:border-primary/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-text-primary shadow-sm" style={{ backgroundColor: category.color }}>
                                            {category.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-primary">{category.name}</p>
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide">{category.count} Projects</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{category.revenue}</p>
                                        <p className={twMerge("text-[10px] font-bold", category.change.startsWith('+') ? "text-yellow" : "text-red-500")}>{category.change}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle Col: Main Chart */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chart Card */}
                    <div className="bg-gradient-to-br from-dark-800 via-dark-800/95 to-dark-900 rounded-3xl p-8 border border-dark-600/50 shadow-2xl relative h-[420px] flex flex-col overflow-hidden group hover:border-primary/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="flex justify-between items-start mb-8 z-10 relative">
                            <div>
                                <h2 className="text-3xl font-bold text-text-primary tracking-tight flex items-center gap-2">
                                    85 Active Projects
                                    <span className="text-sm font-bold text-yellow bg-yellow/10 px-2.5 py-1 rounded-lg border border-yellow/30 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> +12.5%
                                    </span>
                                </h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <Briefcase className="w-3 h-3 text-text-primary" />
                                    </div>
                                    <span className="text-text-muted text-sm font-bold">Total Projects This Month</span>
                                </div>
                            </div>

                            <div className="flex bg-dark-900 rounded-xl p-1 border border-dark-600">
                                {['1M', '3M', '6M', '1Y', 'ALL'].map((t) => (
                                    <button key={t} className={twMerge("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", t === '1M' ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-primary hover:bg-dark-800")}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={projectData}>
                                    <defs>
                                        <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#1A6DD9" stopOpacity={0.4} />
                                            <stop offset="50%" stopColor="#F0C419" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#1A6DD9" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="strokeProjects" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#1A6DD9" />
                                            <stop offset="50%" stopColor="#F0C419" />
                                            <stop offset="100%" stopColor="#1A6DD9" />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A3441" strokeOpacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} orientation="right" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#151A23', border: '1px solid #1A6DD9', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                        itemStyle={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}
                                        cursor={{ stroke: '#1A6DD9', strokeWidth: 1, strokeDasharray: '5 5' }}
                                    />
                                    <Area type="monotone" dataKey="projects" stroke="url(#strokeProjects)" strokeWidth={3} fillOpacity={1} fill="url(#colorProjects)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bottom Row: Assets & Exchange */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Revenue by Category */}
                        <div className="bg-gradient-to-br from-dark-800 via-dark-800/95 to-dark-900 rounded-3xl p-6 border border-dark-600/50 shadow-xl hover:border-primary/30 hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <h3 className="text-text-primary font-bold text-sm">Revenue by Category</h3>
                                <MoreHorizontal className="text-text-muted w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                            </div>
                            <div className="h-40 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={projectData.slice(0, 6)}>
                                        <Bar dataKey="revenue" fill="url(#barRevenue)" radius={[6, 6, 0, 0]} barSize={14} />
                                        <defs>
                                            <linearGradient id="barRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#1A6DD9" stopOpacity={1} />
                                                <stop offset="50%" stopColor="#F0C419" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#1A6DD9" stopOpacity={0.8} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: '#151A23', border: '1px solid #1A6DD9', borderRadius: '8px' }}
                                            formatter={(value) => [`₹${(value / 1000).toFixed(0)}K`, 'Revenue']}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-dark-800 via-dark-800/95 to-dark-900 rounded-3xl p-6 border border-dark-600/50 shadow-xl relative overflow-hidden hover:border-primary/30 hover:shadow-primary/10 transition-all duration-300 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <h3 className="text-text-primary font-bold text-sm">Quick Actions</h3>
                                <RefreshCw className="text-text-muted w-4 h-4 cursor-pointer hover:text-primary hover:rotate-180 transition-all duration-500" />
                            </div>

                            <div className="space-y-3 relative z-10">
                                <button className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <Briefcase className="w-4 h-4" /> Create New Project
                                </button>
                                <button className="w-full py-3 bg-gradient-to-r from-yellow to-yellow-light text-[#2E2EFF] rounded-xl text-sm font-bold shadow-lg shadow-yellow/30 hover:shadow-yellow/40 active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <Users className="w-4 h-4" /> Manage Clients
                                </button>
                                <button className="w-full py-3 bg-dark-700 text-text-muted rounded-xl text-sm font-bold border border-dark-600 hover:bg-dark-600 hover:text-text-primary hover:border-primary/40 active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <Phone className="w-4 h-4" /> Call Back Requests
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
