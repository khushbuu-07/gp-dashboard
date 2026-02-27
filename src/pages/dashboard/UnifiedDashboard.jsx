import React from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, Users, DollarSign, Activity, 
    ArrowUp, ArrowDown, MoreVertical, RefreshCw,
    Calendar, Download, Filter, Eye, ShoppingCart,
    BarChart3, PieChart, Clock, Target
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const SimpleDashboard = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    // Stats data
    const stats = [
        {
            title: 'Total Revenue',
            value: '$124,563',
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'from-emerald-500 to-teal-500',
            bgColor: 'bg-emerald-500/10',
            textColor: 'text-emerald-400'
        },
        {
            title: 'Active Users',
            value: '2,846',
            change: '+8.2%',
            trend: 'up',
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-400'
        },
        {
            title: 'Conversion Rate',
            value: '24.8%',
            change: '-2.1%',
            trend: 'down',
            icon: TrendingUp,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            textColor: 'text-purple-400'
        },
        {
            title: 'Avg. Session',
            value: '4m 32s',
            change: '+5.3%',
            trend: 'up',
            icon: Activity,
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-500/10',
            textColor: 'text-amber-400'
        }
    ];

    // Recent activity data
    const recentActivities = [
        { id: 1, action: 'New user registered', user: 'John Doe', time: '2 minutes ago', status: 'completed' },
        { id: 2, action: 'Project created', user: 'Jane Smith', time: '15 minutes ago', status: 'pending' },
        { id: 3, action: 'Payment received', user: 'Mike Johnson', time: '1 hour ago', status: 'completed' },
        { id: 4, action: 'Support ticket opened', user: 'Sarah Wilson', time: '3 hours ago', status: 'in-progress' },
        { id: 5, action: 'Server backup completed', user: 'System', time: '5 hours ago', status: 'completed' },
    ];

    // Chart data (placeholder)
    const chartData = [65, 45, 75, 55, 85, 70, 90];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-yellow bg-clip-text text-transparent">
                        Welcome back, Admin
                    </h1>
                    <p className="text-text-muted text-sm mt-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Here's what's happening with your projects today
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-dark-800 border border-dark-600/30 rounded-xl text-text-muted hover:text-text-primary hover:border-primary/50 transition-all flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        Last 30 days
                        <Filter className="w-3 h-3 ml-2" />
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all flex items-center gap-2 text-sm shadow-lg shadow-primary/25">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -4, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative group"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl`} />
                        <div className="relative bg-dark-800/50 backdrop-blur-sm border border-dark-600/30 rounded-2xl p-6 overflow-hidden hover:border-primary/30 transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-text-muted text-sm mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                                </div>
                                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4">
                                <span className={twMerge(
                                    "flex items-center gap-1 text-xs font-medium",
                                    stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                                )}>
                                    {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                    {stat.change}
                                </span>
                                <span className="text-text-muted text-xs">vs last month</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-dark-800/50 backdrop-blur-sm border border-dark-600/30 rounded-2xl p-6 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-text-primary">Revenue Overview</h2>
                            <p className="text-text-muted text-xs mt-1">Monthly performance metrics</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
                                <RefreshCw className="w-4 h-4 text-text-muted" />
                            </button>
                            <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4 text-text-muted" />
                            </button>
                        </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="h-64 flex items-end justify-between gap-2">
                        {chartData.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ height: 0 }}
                                animate={{ height: `${value}%` }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg hover:from-primary-dark transition-all relative group/chart"
                            >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark-700 text-text-primary text-xs py-1 px-2 rounded opacity-0 group-hover/chart:opacity-100 transition whitespace-nowrap">
                                    ${value}k
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Chart Labels */}
                    <div className="flex justify-between mt-4 text-xs text-text-muted">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                    </div>
                </motion.div>

                {/* Side Panel */}
                <motion.div variants={itemVariants} className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600/30 rounded-2xl p-6 hover:border-primary/30 transition-all">
                        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-dark-700/50 rounded-xl hover:bg-dark-700 transition-colors group">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <ShoppingCart className="w-4 h-4 text-primary" />
                                </div>
                                <span className="flex-1 text-left text-text-primary">New Project</span>
                                <span className="text-xs text-text-muted">→</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-dark-700/50 rounded-xl hover:bg-dark-700 transition-colors group">
                                <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                                    <Users className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="flex-1 text-left text-text-primary">Add Team Member</span>
                                <span className="text-xs text-text-muted">→</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-dark-700/50 rounded-xl hover:bg-dark-700 transition-colors group">
                                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                                    <BarChart3 className="w-4 h-4 text-purple-400" />
                                </div>
                                <span className="flex-1 text-left text-text-primary">Generate Report</span>
                                <span className="text-xs text-text-muted">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Goals */}
                    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600/30 rounded-2xl p-6 hover:border-primary/30 transition-all">
                        <h2 className="text-lg font-semibold text-text-primary mb-4">Monthly Goals</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-text-muted">Revenue Target</span>
                                    <span className="text-text-primary font-medium">78%</span>
                                </div>
                                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '78%' }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-text-muted">User Acquisition</span>
                                    <span className="text-text-primary font-medium">45%</span>
                                </div>
                                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '45%' }}
                                        transition={{ delay: 0.6, duration: 0.8 }}
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="bg-dark-800/50 backdrop-blur-sm border border-dark-600/30 rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
                        <p className="text-text-muted text-xs mt-1">Latest actions and updates</p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary-dark transition-colors">
                        View All
                    </button>
                </div>

                <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-3 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors"
                        >
                            <div className={twMerge(
                                "w-2 h-2 rounded-full",
                                activity.status === 'completed' ? 'bg-emerald-400' :
                                activity.status === 'pending' ? 'bg-amber-400' : 'bg-blue-400'
                            )} />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                                <p className="text-xs text-text-muted">by {activity.user}</p>
                            </div>
                            <span className="text-xs text-text-muted">{activity.time}</span>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-4 h-4 text-text-muted hover:text-primary" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Footer Note */}
            <motion.div variants={itemVariants} className="text-center text-text-muted text-sm py-4">
                <p>Simple Dashboard • Fully compatible with your theme • {new Date().getFullYear()}</p>
            </motion.div>
        </motion.div>
    );
};

export default SimpleDashboard;