import React, { useState } from "react";
import { 
    Plus, MoreVertical, Search, Filter, Download, 
    Users, CheckCircle, Shield, UserCog,
    Clock, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserFormModal from "./component/UserFormModal";
import ResetPasswordModal from "./component/ResetPasswordModal";
import UserDetailsDrawer from "./component/UserDetailsDrawer";

// Dummy data
const dummyUsers = [
    {
        id: 1,
        name: "Admin User",
        email: "admin@mail.com",
        role: "admin",
        status: true,
        lastLogin: "2 hours ago",
        phone: "+1 234 567 890",
        department: "IT Administration"
    },
    {
        id: 2,
        name: "Sales Manager",
        email: "sales@mail.com",
        role: "sales",
        status: true,
        lastLogin: "1 day ago",
        phone: "+1 234 567 891",
        department: "Sales Department"
    },
    {
        id: 3,
        name: "Project Manager",
        email: "pm@mail.com",
        role: "pm",
        status: false,
        lastLogin: "3 days ago",
        phone: "+1 234 567 892",
        department: "Project Management"
    },
    {
        id: 4,
        name: "Finance Manager",
        email: "finance@mail.com",
        role: "finance",
        status: true,
        lastLogin: "5 hours ago",
        phone: "+1 234 567 893",
        department: "Finance Department"
    }
];

const UserManagement = () => {
    const [users, setUsers] = useState(dummyUsers);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const toggleStatus = (id) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === id ? { ...u, status: !u.status } : u
            )
        );
    };

    const handleCreateUser = (userData) => {
        const newUser = {
            id: users.length + 1,
            ...userData,
            status: true,
            lastLogin: "Just now",
        };
        setUsers([...users, newUser]);
        setShowForm(false);
    };

    const handleUpdateUser = (userData) => {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userData } : u));
        setShowForm(false);
        setSelectedUser(null);
    };

    const handleResetPassword = (newPassword) => {
        // Handle password reset logic here
        console.log(`Password reset for ${selectedUser.name}: ${newPassword}`);
        setShowReset(false);
        setSelectedUser(null);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Stats calculation
    const stats = [
        { 
            label: 'Total Users', 
            value: users.length, 
            icon: Users, 
            color: 'from-blue-500 to-cyan-500' 
        },
        { 
            label: 'Active Users', 
            value: users.filter(u => u.status).length, 
            icon: CheckCircle, 
            color: 'from-emerald-500 to-teal-500' 
        },
        { 
            label: 'Admins', 
            value: users.filter(u => u.role === 'admin').length, 
            icon: Shield, 
            color: 'from-purple-500 to-pink-500' 
        },
        { 
            label: 'Sales Team', 
            value: users.filter(u => u.role === 'sales').length, 
            icon: UserCog, 
            color: 'from-amber-500 to-orange-500' 
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/10 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Identity & Access
                        </h1>
                        <p className="text-slate-400 mt-1">Manage users, roles, and permissions</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-700/50 transition-colors">
                            <Download className="w-5 h-5 text-slate-400" />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedUser(null);
                                setShowForm(true);
                            }}
                            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Create User
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl`} />
                            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 overflow-hidden">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-slate-400 text-sm">{stat.label}</p>
                                        <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl opacity-80`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        
                        <div className="flex gap-2 w-full md:w-auto">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                            >
                                <option value="ALL">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="sales">Sales</option>
                                <option value="pm">Project Manager</option>
                                <option value="finance">Finance</option>
                            </select>
                            
                            <button className="p-3 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
                                <Filter className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-700">
                                    {['User', 'Role', 'Status', 'Last Login', 'Actions'].map((header, idx) => (
                                        <th key={idx} className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                <AnimatePresence>
                                    {filteredUsers.map((user, idx) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center">
                                                        <span className="text-sm font-bold text-white">
                                                            {user.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white">{user.name}</div>
                                                        <div className="text-xs text-slate-400">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                                                    ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                                                    ${user.role === 'sales' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                                                    ${user.role === 'pm' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                                                    ${user.role === 'finance' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                                                `}>
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(user.id)}
                                                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                                                        user.status ? 'bg-emerald-500' : 'bg-slate-600'
                                                    }`}
                                                >
                                                    <div
                                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                                                            user.status ? 'translate-x-6' : ''
                                                        }`}
                                                    />
                                                </button>
                                            </td>

                                            <td className="px-6 py-4 text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-slate-500" />
                                                    {user.lastLogin}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDrawer(true);
                                                    }}
                                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <MoreVertical className="w-5 h-5 text-slate-400" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">No users found</p>
                            </div>
                        )}
                    </div>

                    {/* Table Footer */}
                    <div className="bg-slate-900/50 border-t border-slate-700 px-6 py-4 flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                            Showing {filteredUsers.length} of {users.length} users
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm">1</button>
                            <button className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm">2</button>
                            <button className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm">3</button>
                            <button className="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Modals */}
                <AnimatePresence>
                    {showForm && (
                        <UserFormModal
                            user={selectedUser}
                            onClose={() => {
                                setShowForm(false);
                                setSelectedUser(null);
                            }}
                            onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
                        />
                    )}

                    {showReset && (
                        <ResetPasswordModal
                            user={selectedUser}
                            onClose={() => {
                                setShowReset(false);
                                setSelectedUser(null);
                            }}
                            onConfirm={handleResetPassword}
                        />
                    )}

                    {showDrawer && (
                        <UserDetailsDrawer
                            user={selectedUser}
                            onClose={() => {
                                setShowDrawer(false);
                                setSelectedUser(null);
                            }}
                            onEdit={() => {
                                setShowDrawer(false);
                                setShowForm(true);
                            }}
                            onReset={() => {
                                setShowDrawer(false);
                                setShowReset(true);
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserManagement;