import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle, 
    DollarSign, Shield, TrendingUp, Users, MoreVertical, Calendar,
    Download, Filter, RefreshCw, Clock, PieChart as PieChartIcon,
    ArrowRight, Layers
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { twMerge } from 'tailwind-merge';

const UnifiedDashboard = () => {
    const navigate = useNavigate();
    // Mock Data combining metrics from all domains
    const overallHealthData = [
        { name: 'Mon', revenue: 4000, quality: 85 },
        { name: 'Tue', revenue: 3000, quality: 88 },
        { name: 'Wed', revenue: 2000, quality: 92 },
        { name: 'Thu', revenue: 2780, quality: 90 },
        { name: 'Fri', revenue: 1890, quality: 85 },
        { name: 'Sat', revenue: 2390, quality: 94 },
        { name: 'Sun', revenue: 3490, quality: 96 },
    ];

    const kpiData = [
        {
            title: 'Management Console',
            path: '/dashboard/management',
            metric: '₹25.5L',
            description: 'Revenue This Month',
            trend: '+5.2%',
            trendDirection: 'up',
            icon: DollarSign,
            color: 'primary',
            sparkline: [{ v: 5 }, { v: 10 }, { v: 8 }, { v: 15 }, { v: 12 }, { v: 18 }, { v: 14 }],
        },
        {
            title: 'Evaluation System',
            path: '/dashboard/evaluation',
            metric: '92.4%',
            description: 'Avg. Quality Score',
            trend: '-0.8%',
            trendDirection: 'down',
            icon: CheckCircle,
            color: 'blue-500',
            sparkline: [{ v: 90 }, { v: 92 }, { v: 91 }, { v: 94 }, { v: 93 }, { v: 95 }, { v: 92 }],
        },
        {
            title: 'Identity Control',
            path: '/dashboard/identity',
            metric: '24/24',
            description: 'Centers Online',
            trend: '+0.0%',
            trendDirection: 'flat',
            icon: Shield,
            color: 'purple-500',
            sparkline: [{ v: 100 }, { v: 100 }, { v: 99 }, { v: 100 }, { v: 100 }, { v: 98 }, { v: 100 }],
        },
    ];

    const topPerformers = [
        { name: 'Sarah Miller', value: '98.2% QS', change: 2.1, avatar: 'S', color: 'bg-green-500' },
        { name: 'Robert Fox', value: '112% Target', change: 1.5, avatar: 'R', color: 'bg-blue-500' },
        { name: 'Emily Davis', value: '3.2m AHT', change: -0.8, avatar: 'E', color: 'bg-yellow-500' },
    ];

    const revenueSourceData = [
        { name: 'Direct', value: 45, color: '#3b82f6' },
        { name: 'Referral', value: 30, color: '#10b981' },
        { name: 'Social', value: 15, color: '#f59e0b' },
        { name: 'Organic', value: 10, color: '#8b5cf6' },
    ];

    const recentActivities = [
        { id: 1, user: 'Admin User', action: 'Updated security protocols', time: '10 min ago', icon: Shield, color: 'text-purple-400' },
        { id: 2, user: 'Sarah Miller', action: 'Closed Ticket #8821', time: '32 min ago', icon: CheckCircle, color: 'text-green-400' },
        { id: 3, user: 'System', action: 'Automated backup completed', time: '1 hr ago', icon: Activity, color: 'text-blue-400' },
        { id: 4, user: 'Robert Fox', action: 'New client onboarding', time: '2 hrs ago', icon: Users, color: 'text-yellow-400' },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-dark-800/80 backdrop-blur-sm p-3 rounded-xl border border-dark-600 shadow-2xl">
                    <p className="text-xs text-text-muted font-bold">{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} style={{ color: p.color }} className="text-sm font-bold">
                            {`${p.name}: ${p.name === 'Revenue' ? '₹' : ''}${p.value.toLocaleString()}${p.name === 'Quality' ? '%' : ''}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 pt-6 animate-fade-in text-text-primary pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-dark-600 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Unified Control Center</h1>
                    <p className="text-text-muted text-sm flex items-center gap-2"><Layers className="w-4 h-4" /> Centralized command for Management, Evaluation, and Identity systems.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-dark-800 border border-dark-600 rounded-xl hover:bg-dark-700 text-text-muted hover:text-text-primary transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-dark-800 border border-dark-600 rounded-xl hover:bg-dark-700 text-text-muted hover:text-text-primary transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                    <div className="ml-2 flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 font-bold text-xs">
                        <Activity className="w-3 h-3" /> Healthy
                    </div>
                </div>
            </div>

            {/* Top Level KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpiData.map((kpi, i) => (
                    <div 
                        key={i} 
                        onClick={() => navigate(kpi.path)}
                        className={`bg-dark-800 p-6 rounded-3xl border border-dark-600/50 relative overflow-hidden group hover:border-${kpi.color}/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-${kpi.color}/10 hover:-translate-y-1`}
                    >
                        <div className={`absolute -right-6 -top-6 w-32 h-32 bg-${kpi.color}/5 rounded-full blur-3xl group-hover:bg-${kpi.color}/10 transition-all`}></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 bg-${kpi.color}/10 rounded-xl text-${kpi.color} group-hover:scale-110 transition-transform`}><kpi.icon className="w-6 h-6" /></div>
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{kpi.title}</span>
                            </div>
                            <div className={twMerge(
                                "flex items-center gap-1 text-xs font-bold",
                                kpi.trendDirection === 'up' && 'text-green-400',
                                kpi.trendDirection === 'down' && 'text-red-400',
                                kpi.trendDirection === 'flat' && 'text-text-muted'
                            )}>
                                {kpi.trendDirection === 'up' && <ArrowUpRight className="w-3 h-3" />}
                                {kpi.trendDirection === 'down' && <ArrowDownRight className="w-3 h-3" />}
                                {kpi.trend}
                            </div>
                        </div>
                        <div className="mt-4 flex items-end justify-between relative z-10">
                            <div>
                                <h3 className="text-4xl font-black text-white">{kpi.metric}</h3>
                                <p className="text-sm text-text-muted mt-1">{kpi.description}</p>
                            </div>
                            <div className="w-24 h-12 -mb-2 -mr-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={kpi.sparkline}>
                                        <Line type="monotone" dataKey="v" stroke={`var(--color-${kpi.color})`} strokeWidth={2.5} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        <div className={`mt-6 pt-4 border-t border-dark-700/50 flex items-center justify-between text-${kpi.color} opacity-60 group-hover:opacity-100 transition-opacity`}>
                            <span className="text-xs font-bold uppercase tracking-wider">Enter Module</span>
                            <div className={`p-1.5 rounded-full bg-${kpi.color}/10 group-hover:bg-${kpi.color}/20 transition-colors`}>
                                <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Combined Analytics Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-dark-800 p-8 rounded-3xl border border-dark-600/50 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Cross-Domain Performance</h3>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span>Revenue</span>
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Quality</span>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={overallHealthData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-green-500)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--color-green-500)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-dark-700)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-dark-600)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                                <Area type="monotone" dataKey="quality" name="Quality" stroke="var(--color-green-500)" fillOpacity={1} fill="url(#colorQuality)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Distribution */}
                <div className="bg-dark-800 p-6 rounded-3xl border border-dark-600/50 shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold">Revenue Source</h3>
                        <button className="text-text-muted hover:text-primary"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1 min-h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={revenueSourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {revenueSourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                            <div className="text-center">
                                <p className="text-2xl font-black text-white">100%</p>
                                <p className="text-[10px] text-text-muted uppercase tracking-wider">Total</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Critical Alerts Feed */}
                <div className="bg-dark-800 p-6 rounded-3xl border border-dark-600/50 shadow-xl flex flex-col h-full">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" /> Critical Attention
                    </h3>
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                        {[
                            { type: 'Identity', msg: 'New login from unknown IP', time: '10m ago', color: 'purple-400' },
                            { type: 'Evaluation', msg: 'Agent AGT-004 score dropped to 68%', time: '1h ago', color: 'blue-400' },
                            { type: 'Management', msg: 'Project NET/10979 pending approval', time: '2h ago', color: 'primary' },
                            { type: 'Identity', msg: 'Center CTR-003 maintenance scheduled', time: '5h ago', color: 'purple-400' },
                        ].map((alert, i) => (
                            <div key={i} className={`flex gap-3 p-3 rounded-xl bg-dark-900/50 border border-dark-700 hover:border-${alert.color}/50 transition-colors`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-${alert.color}/10 text-${alert.color}`}>
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium leading-tight">{alert.msg}</p>
                                    <p className="text-[10px] text-text-muted mt-1">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performers */}
                <div className="bg-dark-800 p-6 rounded-3xl border border-dark-600/50 shadow-xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" /> Top Performers
                    </h3>
                    <div className="space-y-3">
                        {topPerformers.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-dark-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${p.color}`}>{p.avatar}</div>
                                    <div>
                                        <p className="font-bold text-sm">{p.name}</p>
                                        <p className="text-xs text-text-muted">{p.value}</p>
                                    </div>
                                </div>
                                <div className={twMerge("text-xs font-bold flex items-center gap-1", p.change > 0 ? 'text-green-400' : 'text-red-400')}>
                                    {p.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {Math.abs(p.change)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="bg-dark-800 p-6 rounded-3xl border border-dark-600/50 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" /> Recent Activity
                        </h3>
                        <button className="text-xs text-primary font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-0">
                        {recentActivities.map((activity, i) => (
                            <div key={activity.id} className="flex gap-4 items-start relative pb-6 last:pb-0">
                                {i !== recentActivities.length - 1 && (
                                    <div className="absolute left-[11px] top-8 bottom-0 w-px bg-dark-700"></div>
                                )}
                                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center bg-dark-800 border-2 border-dark-700 ${activity.color}`}>
                                    <activity.icon className="w-3 h-3" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-text-primary">{activity.action}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-text-muted font-medium">{activity.user}</span>
                                        <span className="w-1 h-1 bg-dark-600 rounded-full"></span>
                                        <span className="text-[10px] text-text-muted">{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnifiedDashboard;