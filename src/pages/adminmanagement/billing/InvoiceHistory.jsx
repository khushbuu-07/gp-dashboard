import React, { useState } from 'react';
import { Search, Filter, Download, ExternalLink, FileText, CheckCircle2, Clock, AlertCircle, Eye, MoreVertical } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const InvoiceHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const invoices = [
        { id: 'INV-2024-001', client: 'Acme Corp', date: '2024-02-20', amount: 1500.00, status: 'Paid', type: 'Project' },
        { id: 'INV-2024-002', client: 'Global Tech', date: '2024-02-18', amount: 2450.50, status: 'Pending', type: 'Consulting' },
        { id: 'INV-2024-003', client: 'Nebula Solutions', date: '2024-02-15', amount: 890.00, status: 'Overdue', type: 'Maintenance' },
        { id: 'INV-2024-004', client: 'Zion Systems', date: '2024-02-10', amount: 3200.00, status: 'Paid', type: 'Implementation' },
        { id: 'INV-2024-005', client: 'Quantum Labs', date: '2024-02-05', amount: 1250.00, status: 'Paid', type: 'Support' },
        { id: 'INV-2024-006', client: 'Solaris Group', date: '2024-02-01', amount: 4800.00, status: 'Pending', type: 'Project' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'Overdue': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-text-muted bg-dark-700/50 border-dark-600/50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Paid': return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'Pending': return <Clock className="w-3.5 h-3.5" />;
            case 'Overdue': return <AlertCircle className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">Invoice History</h2>
                    <p className="text-text-muted text-sm">Review, track, and manage all your past generated invoices.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-text-primary rounded-xl transition-all border border-dark-600">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Export All</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search invoices by ID or Client..."
                        className="w-full bg-dark-850/50 border border-dark-600/30 rounded-2xl pl-12 pr-4 py-3.5 text-text-primary focus:border-primary/50 outline-none transition-all backdrop-blur-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-2 bg-dark-850/50 border border-dark-600/30 rounded-2xl text-text-secondary hover:text-text-primary hover:bg-dark-800 transition-all backdrop-blur-sm">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-bold">Filters</span>
                    </button>
                    <select className="bg-dark-850/50 border border-dark-600/30 rounded-2xl px-6 py-2 text-text-secondary hover:text-text-primary hover:bg-dark-800 transition-all outline-none backdrop-blur-sm cursor-pointer appearance-none">
                        <option>Status: All</option>
                        <option>Paid</option>
                        <option>Pending</option>
                        <option>Overdue</option>
                    </select>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-dark-850/50 border border-dark-600/30 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-900/50 border-b border-dark-700/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Invoice ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Client</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Due Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700/30">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-dark-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="text-text-primary font-bold text-sm tracking-tight">{invoice.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary text-sm font-medium">{invoice.client}</td>
                                    <td className="px-6 py-4 text-text-muted text-sm">{invoice.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-text-primary font-bold text-sm">${invoice.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-dark-900/50 border border-dark-700/50 rounded-full text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                            {invoice.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={twMerge(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                            getStatusColor(invoice.status)
                                        )}>
                                            {getStatusIcon(invoice.status)}
                                            {invoice.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="View Details">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-text-muted hover:text-text-primary hover:bg-dark-700 rounded-lg transition-all" title="Download PDF">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-text-muted hover:text-text-primary hover:bg-dark-700 rounded-lg transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-850/50 border border-dark-600/30 rounded-2xl p-6 backdrop-blur-sm">
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Total Outstanding</p>
                    <div className="flex items-end gap-3">
                        <h4 className="text-2xl font-black text-text-primary">$12,450.00</h4>
                        <span className="text-amber-400 text-[10px] font-bold mb-1">+5.2%</span>
                    </div>
                </div>
                <div className="bg-dark-850/50 border border-dark-600/30 rounded-2xl p-6 backdrop-blur-sm">
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Collected (30 days)</p>
                    <div className="flex items-end gap-3">
                        <h4 className="text-2xl font-black text-emerald-400">$45,800.00</h4>
                        <span className="text-emerald-400 text-[10px] font-bold mb-1">+12.8%</span>
                    </div>
                </div>
                <div className="bg-dark-850/50 border border-dark-600/30 rounded-2xl p-6 backdrop-blur-sm">
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Avg. Collection Time</p>
                    <div className="flex items-end gap-3">
                        <h4 className="text-2xl font-black text-text-primary">14 Days</h4>
                        <span className="text-emerald-400 text-[10px] font-bold mb-1">-2 Days</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceHistory;
