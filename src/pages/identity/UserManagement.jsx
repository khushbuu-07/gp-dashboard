import React, { useMemo, useState } from "react";
import { 
    Plus, MoreVertical, Search, Filter, Download, 
    Users, CheckCircle, Shield, UserCog,
    Clock, ChevronLeft, ChevronRight, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserFormModal from "./component/UserFormModal";
import ResetPasswordModal from "./component/ResetPasswordModal";
import UserDetailsDrawer from "./component/UserDetailsDrawer";
import {
    useAddUserMutation,
    useDeleteUserMutation,
    useGetUsersQuery,
    useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import { toast } from "../../utils/toast";

const normalizeRole = (role) => {
    const value = String(role || "").toLowerCase();
    if (value === "super_admin") return "SUPER_ADMIN";
    if (value === "operations_manager") return "OPERATIONS_MANAGER";
    if (value === "hr_manager") return "HR_MANAGER";
    if (value === "content_manager") return "CONTENT_MANAGER";
    if (value === "sales_manager" || value === "sales") return "SALES_MANAGER";
    if (value === "project_manager" || value === "pm") return "PROJECT_MANAGER";
    if (value === "finance_manager" || value === "finance") return "FINANCE_MANAGER";
    if (value === "admin") return "ADMIN";
    if (value === "employee") return "employee";
    return (role || "employee");
};

const toApiRole = (role) => {
    const value = String(role || "");
    const normalized = value.toLowerCase();
    if (normalized === "sales") return "SALES_MANAGER";
    if (normalized === "pm") return "PROJECT_MANAGER";
    if (normalized === "finance") return "FINANCE_MANAGER";
    if (normalized === "admin") return "ADMIN";
    if (
        [
            "SUPER_ADMIN", 
            "ADMIN",
            "SALES_MANAGER",
            "OPERATIONS_MANAGER",
            "FINANCE_MANAGER",
            "HR_MANAGER",
            "CONTENT_MANAGER",
        ].includes(value)
    ) {
        return value;
    }
    return role;
};

const roleLabel = (role) => {
    if (role === "SUPER_ADMIN") return "Super Admin";
    if (role === "ADMIN") return "Admin";
    if (role === "SALES_MANAGER") return "Sales Manager";
    if (role === "PROJECT_MANAGER") return "Project Manager";
    if (role === "FINANCE_MANAGER") return "Finance Manager";
    if (role === "OPERATIONS_MANAGER") return "Operations Manager";
    if (role === "HR_MANAGER") return "HR Manager";
    if (role === "CONTENT_MANAGER") return "Content Manager";
    if (role === "employee") return "Employee";
    return role;
};

const toApiStatus = (status) => {
    if (typeof status === "boolean") return status ? "active" : "inactive";
    const value = String(status || "").toLowerCase();
    return value === "inactive" ? "inactive" : "active";
};

const relativeTime = (iso) => {
    if (!iso) return "Never";
    const timestamp = new Date(iso).getTime();
    if (Number.isNaN(timestamp)) return "Never";
    const diffMs = Date.now() - timestamp;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
};

const UserManagement = () => {
    const { data, isLoading, isError, error, refetch } = useGetUsersQuery({ page: 1, limit: 100 });
    const [addUser, { isLoading: isCreating }] = useAddUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [userOverrides, setUserOverrides] = useState({});
    const [deletedUserIds, setDeletedUserIds] = useState(new Set());
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const users = useMemo(() => {
        const source = Array.isArray(data?.users)
            ? data.users.filter((u) => !u?.isDeleted && !deletedUserIds.has(u?._id))
            : [];
        return source.map((user) => {
            const base = {
                id: user._id,
                name: user.name || "-",
                email: user.email || "-",
                role: normalizeRole(user.role),
                status: String(user.status || "").toLowerCase() === "active",
                lastLogin: relativeTime(user.lastLogin || user.updatedAt || user.createdAt),
                phone: user.phone || "",
                department: user.department || "",
            };
            return { ...base, ...(userOverrides[user._id] || {}) };
        });
    }, [data, userOverrides, deletedUserIds]);

    const toggleStatus = (id) => {
        setUserOverrides((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] || {}),
                status: !(prev[id]?.status ?? users.find((u) => u.id === id)?.status),
            },
        }));
    };

    const handleCreateUser = async (userData) => {
        try {
            await addUser({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
                role: toApiRole(userData.role),
                status: toApiStatus(userData.status),
            }).unwrap();
            setShowForm(false);
            setSelectedUser(null);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create user");
        }
    };

    const handleUpdateUser = async (userData) => {
        if (!selectedUser?.id) return;
        try {
            await updateUser({
                id: selectedUser.id,
                data: {
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    status: toApiStatus(userData.status),
                    role: toApiRole(userData.role),
                },
            }).unwrap();

            setShowForm(false);
            setSelectedUser(null);
            await refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update user");
        }
    };

    const handleResetPassword = (newPassword) => {
        // Handle password reset logic here
        console.log(`Password reset for ${selectedUser.name}: ${newPassword}`);
        setShowReset(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = async (id) => {
        if (!id) return;
        const ok = window.confirm("Are you sure you want to delete this user?");
        if (!ok) return;
        try {
            await deleteUser(id).unwrap();
            setDeletedUserIds((prev) => new Set(prev).add(id));
            setUserOverrides((prev) => {
                if (!prev[id]) return prev;
                const next = { ...prev };
                delete next[id];
                return next;
            });
            if (selectedUser?.id === id) {
                setShowDrawer(false);
                setSelectedUser(null);
            }
            await refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete user");
        }
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
            value: users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length, 
            icon: Shield, 
            color: 'from-purple-500 to-pink-500' 
        },
        { 
            label: 'Sales Team', 
            value: users.filter(u => u.role === 'SALES_MANAGER').length, 
            icon: UserCog, 
            color: 'from-amber-500 to-orange-500' 
        },
    ];

    return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/10 to-slate-900 p-6 [.light_&]:bg-slate-100">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent [.light_&]:from-blue-600 [.light_&]:to-purple-600">
                            Identity & Access
                        </h1>
                        <p className="text-slate-400 mt-1 [.light_&]:text-slate-500">Manage users, roles, and permissions</p>

                    </div>

                    <div className="flex gap-3">
                        <button className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-700/50 transition-colors [.light_&]:bg-white [.light_&]:border-slate-200 [.light_&]:hover:bg-slate-100">
                            <Download className="w-5 h-5 text-slate-400 [.light_&]:text-slate-500" />
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
                            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 overflow-hidden [.light_&]:bg-white/70 [.light_&]:border-slate-200">

                                <div className="flex justify-between items-start">
                                    <div>
                                         <p className="text-slate-400 text-sm [.light_&]:text-slate-500">{stat.label}</p>
                                        <p className="text-3xl font-bold text-white mt-1 [.light_&]:text-slate-900">{stat.value}</p>
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
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 [.light_&]:bg-white/70 [.light_&]:border-slate-200">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 [.light_&]:text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all [.light_&]:bg-white [.light_&]:border-slate-200 [.light_&]:text-slate-900 [.light_&]:placeholder-slate-400"

                            />
                        </div>
                        
                        <div className="flex gap-2 w-full md:w-auto">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                                               className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all [.light_&]:bg-white [.light_&]:border-slate-200 [.light_&]:text-slate-900"

                            >
                                <option value="ALL">All Roles</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SALES_MANAGER">Sales Manager</option>
                                <option value="OPERATIONS_MANAGER">Operations Manager</option>
                                <option value="FINANCE_MANAGER">Finance Manager</option>
                                <option value="HR_MANAGER">HR Manager</option>
                                <option value="CONTENT_MANAGER">Content Manager</option>
                            </select>
                            
                            <button className="p-3 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors [.light_&]:bg-white [.light_&]:border-slate-200 [.light_&]:hover:bg-slate-100">
                                <Filter className="w-5 h-5 text-slate-400 [.light_&]:text-slate-500" />

                            </button>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl [.light_&]:bg-white/70 [.light_&]:border-slate-200 [.light_&]:shadow-slate-200/50"

                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                                               <tr className="bg-slate-900/50 border-b border-slate-700 [.light_&]:bg-slate-50/50 [.light_&]:border-slate-200">

                                    {['User', 'Mobile', 'Role', 'Status', 'Last Login', 'Actions'].map((header, idx) => (
                                                                                <th key={idx} className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider [.light_&]:text-slate-500">

                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                                                        <tbody className="divide-y divide-slate-700 [.light_&]:divide-slate-200">

                                <AnimatePresence>
                                    {filteredUsers.map((user, idx) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                                                                        className="group hover:bg-slate-700/30 transition-colors [.light_&]:hover:bg-slate-50"

                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center [.light_&]:from-slate-200 [.light_&]:to-slate-300">
                                                        <span className="text-sm font-bold text-white [.light_&]:text-slate-600">

                                                            {user.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white [.light_&]:text-slate-900">{user.name}</div>
                                                        <div className="text-xs text-slate-400 [.light_&]:text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300 [.light_&]:text-slate-600">
                                                {user.phone || "-"}
                                            </td>

                                            <td className="px-6 py-4 text-white [.light_&]:text-slate-900">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                                                    ${user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                                                    ${user.role === 'SALES_MANAGER' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                                                    ${user.role === 'OPERATIONS_MANAGER' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                                                    ${user.role === 'FINANCE_MANAGER' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                                                    ${user.role === 'HR_MANAGER' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                                                    ${user.role === 'CONTENT_MANAGER' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : ''}
                                                    ${user.role === 'employee' ? 'bg-slate-500/10 text-slate-300 border-slate-500/20' : ''}
                                                `}>
                                                    {roleLabel(user.role)}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-white [.light_&]:text-slate-900">
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

                                            <td className="px-6 py-4 text-white [.light_&]:text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-slate-500 [.light_&]:text-slate-400" />
                                                    {user.lastLogin}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={isDeleting}
                                                        className="p-2 hover:bg-rose-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-rose-400" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowDrawer(true);
                                                        }}
                                                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                                    >
                                                        <MoreVertical className="w-5 h-5 text-slate-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {isLoading && (
                            <div className="text-center py-12">
                                <p className="text-slate-400">Loading users...</p>
                            </div>
                        )}

                        {isError && (
                            <div className="text-center py-12">
                                <p className="text-rose-400">{error?.data?.message || "Failed to load users"}</p>
                            </div>
                        )}

                        {!isLoading && !isError && filteredUsers.length === 0 && (
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
                            isLoading={isCreating || isUpdating}
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
                            onDelete={() => {
                                handleDeleteUser(selectedUser?.id);
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
