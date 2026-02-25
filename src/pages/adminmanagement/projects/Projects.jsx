import React, { useMemo, useState } from 'react';
import { 
    Search, Filter, Download, Edit, Trash2, Plus, 
    ChevronLeft, ChevronRight, Clock, Globe, FileText,
    Image, MoreVertical, Eye, Copy, Archive, RefreshCw,
    X, Save, Calendar, Hash, Users, MapPin, Tag,
    FileCheck, FileImage, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const initialProjects = [
    {
        id: 1,
        title: 'TELECOM CHAT SUPPORT',
        projectCode: '45627882/GN/26',
        clientCode: '677838829',
        applications: 1,
        lastActivity: '23/2/2026, 1:40:29 pm',
        countdown: { days: 87, hours: 15, minutes: 42, seconds: 22 },
        country: 'Germany',
        status: 'Available',
        hasPdf: true,
        hasImage: true,
    },
    {
        id: 2,
        title: 'Travel Chat Support',
        projectCode: 'NZ/672782662/26',
        clientCode: '56276782',
        applications: 10,
        lastActivity: '22/2/2026, 8:55:27 pm',
        countdown: { days: 85, hours: 7, minutes: 27, seconds: 22 },
        country: 'New Zealand',
        status: 'Available',
        hasPdf: true,
        hasImage: true,
    },
    {
        id: 3,
        title: 'Telecom KYC Chat Support',
        projectCode: 'TLC/5672621/26',
        clientCode: '5727882',
        applications: 25,
        lastActivity: '16/2/2026, 11:55:07 pm',
        countdown: { days: 69, hours: 21, minutes: 25, seconds: 22 },
        country: 'Germany',
        status: 'Available',
        hasPdf: true,
        hasImage: true,
    },
    {
        id: 4,
        title: 'Healthcare Chat Support',
        projectCode: 'AUS/54526752/26',
        clientCode: '3234123/26',
        applications: 18,
        lastActivity: '16/2/2026, 10:42:50 pm',
        countdown: { days: 64, hours: 6, minutes: 14, seconds: 22 },
        country: 'Australia',
        status: 'Available',
        hasPdf: true,
        hasImage: true,
    },
    {
        id: 5,
        title: 'KYC Chat Support',
        projectCode: 'ROM/672889027/26',
        clientCode: '6789272/RQ/26',
        applications: 18,
        lastActivity: '13/2/2026',
        countdown: { days: 50, hours: 2, minutes: 4, seconds: 22 },
        country: 'Romania',
        status: 'Available',
        hasPdf: true,
        hasImage: true,
    },
];

const statusColors = {
    'Available': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-1 ring-emerald-500/20',
    'In Progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20 ring-1 ring-amber-500/20',
    'Completed': 'bg-blue-500/10 text-blue-400 border-blue-500/20 ring-1 ring-blue-500/20',
    'On Hold': 'bg-rose-500/10 text-rose-400 border-rose-500/20 ring-1 ring-rose-500/20',
};

const countries = [
    'Germany', 'New Zealand', 'Australia', 'Romania', 'United States',
    'United Kingdom', 'Canada', 'India', 'Singapore', 'Japan',
    'France', 'Italy', 'Spain', 'Netherlands', 'Sweden'
];

const ManageProjects = () => {
    const [projects, setProjects] = useState(initialProjects);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        projectCode: '',
        clientCode: '',
        applications: 1,
        lastActivity: '',
        countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
        country: 'Germany',
        status: 'Available',
        hasPdf: false,
        hasImage: false,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCountdownChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            countdown: {
                ...prev.countdown,
                [name]: parseInt(value) || 0
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Format last activity date
        const now = new Date();
        const formattedDate = formData.lastActivity 
            ? new Date(formData.lastActivity).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })
            : now.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });

        const newProject = {
            id: projects.length + 1,
            ...formData,
            lastActivity: formattedDate,
            applications: parseInt(formData.applications) || 1,
        };

        setProjects(prev => [...prev, newProject]);
        
        // Reset form
        setFormData({
            title: '',
            projectCode: '',
            clientCode: '',
            applications: 1,
            lastActivity: '',
            countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
            country: 'Germany',
            status: 'Available',
            hasPdf: false,
            hasImage: false,
        });
        
        setIsAddModalOpen(false);
    };

    // Filter projects based on search and status
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = Object.values(project).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesStatus = selectedStatus === 'ALL' || project.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [projects, searchTerm, selectedStatus]);

    // Pagination
    const totalPages = Math.ceil(filteredProjects.length / entriesPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            setProjects(prev => prev.filter(p => p.id !== id));
        }
    };

    const CountdownTimer = ({ countdown }) => {
        return (
            <div className="flex items-center gap-1 font-mono text-sm">
                <span className="bg-slate-800 px-1.5 py-0.5 rounded-md text-amber-400">{countdown.days}d</span>
                <span className="text-slate-500">:</span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded-md text-amber-400">{countdown.hours}h</span>
                <span className="text-slate-500">:</span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded-md text-amber-400">{countdown.minutes}m</span>
                <span className="text-slate-500">:</span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded-md text-amber-400">{countdown.seconds}s</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            MANAGE PROJECTS
                        </h1>
                        <p className="text-slate-400 mt-1">Track and manage all your projects in one place</p>
                    </div>
                    
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
                    >
                        <span className="flex items-center gap-2">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Add New Project
                        </span>
                    </button>
                </div>

                {/* Controls Bar */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        
                        {/* Entries Selector */}
                        <div className="flex items-center gap-2 text-slate-300">
                            <span className="text-sm">Show</span>
                            <select 
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-sm">entries</span>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                            >
                                <option value="ALL">All Status</option>
                                <option value="Available">Available</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                            </select>

                            <button className="p-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                                <Download className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Projects Table */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-700">
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                                    <th className="hidden lg:table-cell px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Code</th>
                                    <th className="hidden xl:table-cell px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Client Code</th>
                                    <th className="hidden sm:table-cell px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Apps</th>
                                    <th className="hidden xl:table-cell px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Activity</th>
                                    <th className="hidden 2xl:table-cell px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Countdown</th>
                                    <th className="hidden lg:table-cell px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Country</th>
                                    <th className="hidden md:table-cell px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Files</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                <AnimatePresence>
                                    {paginatedProjects.map((project, idx) => (
                                        <motion.tr
                                            key={project.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-white max-w-[200px] truncate" title={project.title}>
                                                    {project.title}
                                                </div>
                                            </td>
                                            <td className="hidden lg:table-cell px-4 py-4">
                                                <code className="text-xs bg-slate-900 px-2 py-1 rounded-md text-blue-400">
                                                    {project.projectCode}
                                                </code>
                                            </td>
                                            <td className="hidden xl:table-cell px-4 py-4">
                                                <code className="text-xs bg-slate-900 px-2 py-1 rounded-md text-purple-400">
                                                    {project.clientCode}
                                                </code>
                                            </td>
                                            <td className="hidden sm:table-cell px-4 py-4">
                                                <span className="bg-slate-900 px-2 py-1 rounded-md text-amber-400 font-mono">
                                                    {project.applications}
                                                </span>
                                            </td>
                                            <td className="hidden xl:table-cell px-4 py-4 text-slate-300 text-xs">
                                                {project.lastActivity}
                                            </td>
                                            <td className="hidden 2xl:table-cell px-4 py-4">
                                                <CountdownTimer countdown={project.countdown} />
                                            </td>
                                            <td className="hidden lg:table-cell px-4 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Globe className="w-3 h-3 text-slate-500" />
                                                    <span className="text-slate-300">{project.country}</span>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-4">
                                                <div className="flex gap-2">
                                                    {project.hasPdf && (
                                                        <div className="p-1 bg-rose-500/10 rounded-md" title="PDF Available">
                                                            <FileText className="w-4 h-4 text-rose-400" />
                                                        </div>
                                                    )}
                                                    {project.hasImage && (
                                                        <div className="p-1 bg-blue-500/10 rounded-md" title="Image Available">
                                                            <Image className="w-4 h-4 text-blue-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={twMerge(
                                                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
                                                    statusColors[project.status]
                                                )}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors group/tooltip relative">
                                                        <Eye className="w-4 h-4 text-slate-300" />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                                                            View
                                                        </span>
                                                    </button>
                                                    <button className="p-1.5 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors group/tooltip relative">
                                                        <Edit className="w-4 h-4 text-slate-300" />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity">
                                                            Edit
                                                        </span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(project.id)}
                                                        className="p-1.5 bg-slate-700 rounded-md hover:bg-rose-500/20 transition-colors group/tooltip relative"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-slate-300 group-hover:text-rose-400" />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity">
                                                            Delete
                                                        </span>
                                                    </button>
                                                    <button className="p-1.5 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors group/tooltip relative">
                                                        <Copy className="w-4 h-4 text-slate-300" />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity">
                                                            Duplicate
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {paginatedProjects.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-slate-400">No projects found</p>
                            </div>
                        )}
                    </div>

                    {/* Table Footer with Pagination */}
                    <div className="bg-slate-900/50 border-t border-slate-700 px-4 py-3 flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                            Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filteredProjects.length)} of {filteredProjects.length} entries
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={twMerge(
                                    "p-2 rounded-lg border border-slate-700 transition-colors",
                                    currentPage === 1 
                                        ? "bg-slate-800/50 text-slate-600 cursor-not-allowed" 
                                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                )}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={twMerge(
                                        "px-3 py-1 rounded-lg text-sm transition-colors",
                                        currentPage === i + 1
                                            ? "bg-blue-500 text-white"
                                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className={twMerge(
                                    "p-2 rounded-lg border border-slate-700 transition-colors",
                                    currentPage === totalPages 
                                        ? "bg-slate-800/50 text-slate-600 cursor-not-allowed" 
                                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                )}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Add Project Modal - Enhanced with all fields */}
                <AnimatePresence>
                    {isAddModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-slate-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Add New Project</h2>
                                    <button 
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                                            <Tag className="w-5 h-5" />
                                            Basic Information
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Project Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="e.g., TELECOM CHAT SUPPORT"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Country *
                                                </label>
                                                <select
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                >
                                                    {countries.map(country => (
                                                        <option key={country} value={country}>{country}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Codes Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                                            <Hash className="w-5 h-5" />
                                            Codes & Identifiers
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Project Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="projectCode"
                                                    value={formData.projectCode}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="e.g., 45627882/GN/26"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Client Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="clientCode"
                                                    value={formData.clientCode}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="e.g., 677838829"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Applications & Activity */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
                                            <Activity className="w-5 h-5" />
                                            Applications & Activity
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Number of Applications *
                                                </label>
                                                <input
                                                    type="number"
                                                    name="applications"
                                                    value={formData.applications}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="1"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Last Activity Date
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    name="lastActivity"
                                                    value={formData.lastActivity}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Countdown Timer */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
                                            <Clock className="w-5 h-5" />
                                            Countdown Timer
                                        </h3>
                                        
                                        <div className="grid grid-cols-4 gap-2">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Days</label>
                                                <input
                                                    type="number"
                                                    name="days"
                                                    value={formData.countdown.days}
                                                    onChange={handleCountdownChange}
                                                    min="0"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Hours</label>
                                                <input
                                                    type="number"
                                                    name="hours"
                                                    value={formData.countdown.hours}
                                                    onChange={handleCountdownChange}
                                                    min="0"
                                                    max="23"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Minutes</label>
                                                <input
                                                    type="number"
                                                    name="minutes"
                                                    value={formData.countdown.minutes}
                                                    onChange={handleCountdownChange}
                                                    min="0"
                                                    max="59"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Seconds</label>
                                                <input
                                                    type="number"
                                                    name="seconds"
                                                    value={formData.countdown.seconds}
                                                    onChange={handleCountdownChange}
                                                    min="0"
                                                    max="59"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status & Files */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                                            <FileCheck className="w-5 h-5" />
                                            Status & Files
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Status *
                                                </label>
                                                <select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                >
                                                    <option value="Available">Available</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="On Hold">On Hold</option>
                                                </select>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    File Attachments
                                                </label>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="hasPdf"
                                                            checked={formData.hasPdf}
                                                            onChange={handleInputChange}
                                                            className="w-4 h-4 text-blue-500 bg-slate-900 border-slate-700 rounded focus:ring-blue-500"
                                                        />
                                                        <span className="text-slate-300">PDF Available</span>
                                                    </label>
                                                    
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="hasImage"
                                                            checked={formData.hasImage}
                                                            onChange={handleInputChange}
                                                            className="w-4 h-4 text-blue-500 bg-slate-900 border-slate-700 rounded focus:ring-blue-500"
                                                        />
                                                        <span className="text-slate-300">Image Available</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex gap-3 pt-4 border-t border-slate-700">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 px-4 py-3 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Project
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageProjects;