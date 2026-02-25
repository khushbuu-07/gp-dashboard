import React, { useMemo, useState } from 'react';
import { Download, MessageCircle, Pencil, Plus, Trash2, Search, Filter, X, ChevronDown, Mail, Phone, MapPin, Calendar, User, Code, Briefcase, Users, Activity, Star, UserMinus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

const initialRows = [
    {
        sno: 1,
        name: 'ZIYAUDDIN',
        mobile: '8840256795',
        email: 'AERONEXUSSOLUTION@GMAIL.COM',
        projectInterested: 'INBOUND TELECOM CAMPAIGN',
        projectCode: 'UTC/99810035',
        location: 'LUCKNOW',
        dateOfCall: '21/2/2026',
        attendedBy: 'AARJUGP',
        status: 'ACTIVE',
        remarks: "We've scheduled next call."
    }
];

const statusClass = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-1 ring-emerald-500/20',
    INACTIVE: 'bg-rose-500/10 text-rose-400 border-rose-500/20 ring-1 ring-rose-500/20',
    DEAL: 'bg-amber-500/10 text-amber-400 border-amber-500/20 ring-1 ring-amber-500/20',
};

const statusIcons = {
    ACTIVE: '●',
    INACTIVE: '○',
    DEAL: '★',
};

const ClientsData = () => {
    const [rows, setRows] = useState(initialRows);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        projectInterested: '',
        projectCode: '',
        location: '',
        dateOfCall: '',
        attendedBy: '',
        status: 'ACTIVE',
        remarks: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRow = {
            sno: rows.length + 1,
            ...formData,
            dateOfCall: formData.dateOfCall || new Date().toLocaleDateString('en-GB')
        };
        setRows(prev => [...prev, newRow]);
        setFormData({
            name: '',
            mobile: '',
            email: '',
            projectInterested: '',
            projectCode: '',
            location: '',
            dateOfCall: '',
            attendedBy: '',
            status: 'ACTIVE',
            remarks: ''
        });
        setIsFormOpen(false);
    };

    const handleDelete = (sno) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            setRows(prev =>
                prev
                    .filter(r => r.sno !== sno)
                    .map((r, i) => ({ ...r, sno: i + 1 }))
            );
        }
    };

    const filteredRows = useMemo(() => {
        return rows.filter(row => {
            const matchesSearch = Object.values(row).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesStatus = statusFilter === 'ALL' || row.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [rows, searchTerm, statusFilter]);

    const stats = useMemo(() => ({
        total: rows.length,
        active: rows.filter(r => r.status === 'ACTIVE').length,
        deals: rows.filter(r => r.status === 'DEAL').length,
        inactive: rows.filter(r => r.status === 'INACTIVE').length,
    }), [rows]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header with Stats */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Client Dashboard
                        </h1>
                        <p className="text-slate-400 mt-1">Manage and track your client interactions</p>
                    </div>
                    
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
                    >
                        <span className="flex items-center gap-2">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Add New Client
                        </span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Clients', value: stats.total, color: 'from-blue-500 to-cyan-500', icon: Users },
                        { label: 'Active', value: stats.active, color: 'from-emerald-500 to-teal-500', icon: Activity },
                        { label: 'Deals', value: stats.deals, color: 'from-amber-500 to-orange-500', icon: Star },
                        { label: 'Inactive', value: stats.inactive, color: 'from-rose-500 to-pink-500', icon: UserMinus },
                    ].map((stat, idx) => (
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

                {/* Form Section - Animated */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-white">Add New Client</h2>
                                    <button
                                        onClick={() => setIsFormOpen(false)}
                                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <InputField icon={User} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                                    <InputField icon={Phone} name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
                                    <InputField icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                                    <InputField icon={Briefcase} name="projectInterested" placeholder="Project Interested" value={formData.projectInterested} onChange={handleChange} />
                                    <InputField icon={Code} name="projectCode" placeholder="Project Code" value={formData.projectCode} onChange={handleChange} />
                                    <InputField icon={MapPin} name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
                                    <InputField icon={Calendar} name="dateOfCall" type="date" value={formData.dateOfCall} onChange={handleChange} />
                                    <InputField icon={User} name="attendedBy" placeholder="Attended By" value={formData.attendedBy} onChange={handleChange} />
                                    
                                    <select name="status" value={formData.status} onChange={handleChange}
                                        className="col-span-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                        <option value="DEAL">DEAL</option>
                                    </select>

                                    <textarea name="remarks" value={formData.remarks} onChange={handleChange}
                                        placeholder="Add remarks..."
                                        className="col-span-1 md:col-span-3 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all min-h-[100px]" />

                                    <button type="submit"
                                        className="col-span-1 md:col-span-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                                        Add Client
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                        >
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="DEAL">Deal</option>
                        </select>
                        
                        <button className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-700/50 transition-colors">
                            <Download className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-700">
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Sno</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Mobile</th>
                                    <th className="hidden px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider sm:table-cell">Email</th>
                                    <th className="hidden px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider lg:table-cell">Project</th>
                                    <th className="hidden px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider lg:table-cell">Code</th>
                                    <th className="hidden px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider xl:table-cell">Location</th>
                                    <th className="hidden px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider xl:table-cell">Date</th>
                                    <th className="hidden px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider xl:table-cell">Attended</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="hidden px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider lg:table-cell">Remarks</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                <AnimatePresence>
                                    {filteredRows.map((row, idx) => (
                                        <motion.tr
                                            key={row.sno}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="px-4 py-4 text-slate-300">{row.sno}</td>
                                            <td className="px-4 py-4 font-medium text-white">{row.name}</td>
                                            <td className="px-4 py-4 text-slate-300">{row.mobile}</td>
                                            <td className="hidden px-4 py-4 text-slate-300 sm:table-cell">{row.email}</td>
                                            <td className="hidden px-4 py-4 text-slate-300 lg:table-cell">{row.projectInterested}</td>
                                            <td className="hidden px-4 py-4 text-slate-300 lg:table-cell">{row.projectCode}</td>
                                            <td className="hidden px-4 py-4 text-slate-300 xl:table-cell">{row.location}</td>
                                            <td className="hidden px-4 py-4 text-slate-300 xl:table-cell">{row.dateOfCall}</td>
                                            <td className="hidden px-4 py-4 text-slate-300 xl:table-cell">{row.attendedBy}</td>
                                            <td className="px-4 py-4">
                                                <span className={twMerge(
                                                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border',
                                                    statusClass[row.status]
                                                )}>
                                                    <span className="text-lg">{statusIcons[row.status]}</span>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="hidden max-w-[200px] truncate px-4 py-4 text-slate-300 lg:table-cell">
                                                {row.remarks}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                                                        <Pencil className="w-4 h-4 text-slate-300" />
                                                    </button>
                                                    <button className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                                                        <MessageCircle className="w-4 h-4 text-slate-300" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(row.sno)}
                                                        className="p-2 bg-slate-700 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        
                        {filteredRows.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-slate-400">No clients found</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Helper Components
const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative col-span-1">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
            {...props}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
        />
    </div>
);

export default ClientsData;