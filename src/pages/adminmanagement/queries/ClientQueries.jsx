import React, { useState } from 'react';
import { Search, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const ClientQueries = () => {
    const queries = [
        { id: 'QRY-001', client: 'TechFlow Solutions', subject: 'API Integration Error', status: 'Pending', priority: 'High', date: '2024-02-22', agent: 'Sarah M.' },
        { id: 'QRY-002', client: 'Global Ventures', subject: 'Billing Discrepancy', status: 'Resolved', priority: 'Medium', date: '2024-02-21', agent: 'Mike R.' },
        { id: 'QRY-003', client: 'Nexus Corp', subject: 'Feature Request: Dark Mode', status: 'In Progress', priority: 'Low', date: '2024-02-20', agent: 'Sarah M.' },
        { id: 'QRY-004', client: 'Alpha Dynamics', subject: 'Login Issues', status: 'Pending', priority: 'High', date: '2024-02-22', agent: 'John D.' },
        { id: 'QRY-005', client: 'Beta Systems', subject: 'Data Export Format', status: 'Resolved', priority: 'Low', date: '2024-02-19', agent: 'Mike R.' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'In Progress': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'Pending': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-dark-600 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Client Queries</h1>
                    <p className="text-text-muted text-sm">Manage and track client support tickets.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input type="text" placeholder="Search queries..." className="pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-sm focus:outline-none focus:border-primary w-64" />
                    </div>
                    <button className="p-2 bg-dark-800 border border-dark-600 rounded-xl hover:bg-dark-700 transition-colors">
                        <Filter className="w-4 h-4 text-text-muted" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-xl text-red-500"><AlertCircle className="w-6 h-6" /></div>
                    <div><p className="text-2xl font-bold">12</p><p className="text-sm text-text-muted">Pending High Priority</p></div>
                </div>
                <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><Clock className="w-6 h-6" /></div>
                    <div><p className="text-2xl font-bold">8</p><p className="text-sm text-text-muted">In Progress</p></div>
                </div>
                <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><CheckCircle className="w-6 h-6" /></div>
                    <div><p className="text-2xl font-bold">145</p><p className="text-sm text-text-muted">Resolved This Month</p></div>
                </div>
            </div>

            <div className="bg-dark-900 border border-dark-600/60 rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-dark-800 text-text-muted font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Assigned To</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-600/30">
                        {queries.map((query) => (
                            <tr key={query.id} className="hover:bg-dark-800/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-primary">{query.id}</td>
                                <td className="px-6 py-4 font-bold">{query.client}</td>
                                <td className="px-6 py-4">{query.subject}</td>
                                <td className="px-6 py-4">
                                    <span className={twMerge("px-2.5 py-1 rounded-lg text-xs font-bold border", getStatusColor(query.status))}>
                                        {query.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={twMerge("font-bold", query.priority === 'High' ? "text-red-400" : query.priority === 'Medium' ? "text-yellow-400" : "text-blue-400")}>
                                        {query.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-text-muted">{query.date}</td>
                                <td className="px-6 py-4">{query.agent}</td>
                                <td className="px-6 py-4">
                                    <button className="text-primary hover:text-primary-light font-medium text-xs uppercase tracking-wide">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientQueries;