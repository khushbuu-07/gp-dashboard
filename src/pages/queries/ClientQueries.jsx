import React, { useState } from 'react';
import {
    MessageSquare, Clock, AlertCircle, CheckCircle2,
    ShieldCheck, ArrowRight, MoreVertical, LifeBuoy
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import Table from '../../components/common/Table';

const ClientQueries = () => {
    // Column Definitions for Queries Table
    const [columnDefs] = useState([
        {
            headerName: 'TICKET ID',
            field: 'id',
            width: 140,
            cellRenderer: (params) => (
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary/20 rounded-full mr-1" />
                    <LifeBuoy className="w-3.5 h-3.5 text-primary/60" />
                    <span className="text-primary font-black text-[11px] tracking-widest uppercase">{params.value}</span>
                </div>
            )
        },
        {
            headerName: 'CLIENT / SOURCE NODE',
            field: 'client',
            minWidth: 240,
            flex: 1,
            cellRenderer: (params) => (
                <div className="flex items-center gap-4 h-full">
                    <div className="w-10 h-10 rounded-2xl bg-dark-700 border border-white/10 flex items-center justify-center text-[11px] font-black text-primary shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {params.data.avatar}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-text-primary text-[14px] tracking-tight leading-none mb-1.5">{params.value}</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-green-500" />
                            <span className="text-[9px] text-text-muted font-black uppercase tracking-widest">Active Link</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            headerName: 'COMMAND SUBJECT',
            field: 'subject',
            minWidth: 320,
            flex: 1.5,
            cellRenderer: (params) => (
                <span className="text-slate-300 font-medium truncate text-[13px] italic">"{params.value}"</span>
            )
        },
        {
            headerName: 'PRIORITY',
            field: 'priority',
            width: 140,
            cellRenderer: (params) => {
                const colors = {
                    'Critical': 'text-red-500 bg-red-500/10 border-red-500/30',
                    'High': 'text-orange-500 bg-orange-500/10 border-orange-500/30',
                    'Medium': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
                    'Low': 'text-blue-400 bg-blue-400/10 border-blue-400/30'
                };
                return (
                    <div className="flex items-center">
                        <span className={twMerge("px-3 py-1 rounded-md font-black text-[10px] uppercase tracking-[0.25em] border shadow-sm", colors[params.value])}>
                            {params.value}
                        </span>
                    </div>
                );
            }
        },
        {
            headerName: 'LIVE STATUS',
            field: 'status',
            width: 150,
            cellRenderer: (params) => {
                const styles = {
                    'Resolved': 'bg-green-500/10 text-green-400 border-green-400/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]',
                    'Pending': 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
                    'Processing': 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20 shadow-[0_0_15_rgba(234,179,8,0.15)]'
                };
                return (
                    <span className={twMerge("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-2", styles[params.value])}>
                        <div className={twMerge("w-2 h-2 rounded-full animate-ping absolute opacity-50",
                            params.value === 'Resolved' ? "bg-green-400" : params.value === 'Pending' ? "bg-red-500" : "bg-yellow-400"
                        )} />
                        <div className={twMerge("w-2 h-2 rounded-full relative z-10",
                            params.value === 'Resolved' ? "bg-green-400" : params.value === 'Pending' ? "bg-red-500" : "bg-yellow-400"
                        )} />
                        {params.value}
                    </span>
                );
            }
        },
        {
            headerName: 'TRANSMITTED',
            field: 'date',
            width: 170,
            cellRenderer: (params) => (
                <div className="flex flex-col text-[11px] text-text-muted leading-tight font-mono">
                    <span className="font-bold text-text-primary/80">{params.value}</span>
                    <span className="uppercase tracking-widest mt-1 opacity-50 text-[9px]">{params.data.time}</span>
                </div>
            )
        },
        {
            headerName: 'OPS',
            width: 100,
            cellRenderer: () => (
                <div className="flex items-center gap-2 h-full justify-center">
                    <button className="p-2.5 rounded-xl bg-dark-900 border border-white/10 text-text-muted hover:text-primary hover:border-primary hover:bg-primary/5 transition-all shadow-xl active:scale-90 group">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-dark-900 border border-white/10 text-text-muted hover:text-text-primary transition-all shadow-xl active:scale-90">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ]);

    // Enhanced Mock Data
    const rowData = [
        { id: 'QRY-9921', client: 'Telecom Chat Support', subject: 'Billing discrepancy in Jan report', priority: 'High', status: 'Pending', date: '20/02/2026', time: '11:45:02', avatar: 'TC' },
        { id: 'QRY-8842', client: 'Healthcare Chat Support', subject: 'New agent onboarding request', priority: 'Medium', status: 'Processing', date: '19/02/2026', time: '16:20:11', avatar: 'HC' },
        { id: 'QRY-7712', client: 'Germany KYC Outsource', subject: 'API connection timeout issues', priority: 'Critical', status: 'Pending', date: '20/02/2026', time: '09:12:55', avatar: 'GK' },
        { id: 'QRY-6651', client: 'Global Logistics', subject: 'Dashboard access for manager', priority: 'Low', status: 'Resolved', date: '18/02/2026', time: '14:00:33', avatar: 'GL' },
        { id: 'QRY-5542', client: 'Finance Team B', subject: 'Quarterly audit log export', priority: 'Medium', status: 'Resolved', date: '17/02/2026', time: '10:15:00', avatar: 'FT' },
        { id: 'QRY-4431', client: 'Australian Case Filing', subject: 'Incomplete client record 5521', priority: 'High', status: 'Processing', date: '20/02/2026', time: '13:30:12', avatar: 'AC' },
        { id: 'QRY-2211', client: 'India Payroll Hub', subject: 'Overtime calculation bug report', priority: 'Critical', status: 'Pending', date: '20/02/2026', time: '14:45:19', avatar: 'IP' },
    ];

    return (
        <div className="space-y-8 pt-6 animate-fade-in font-sans text-text-primary h-[calc(100vh-8rem)] flex flex-col pb-10">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 px-4 gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase italic">Support Command</h1>
                    <p className="text-text-muted font-medium text-sm italic opacity-80">Managing global delivery node queries and operational support tickets.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-dark-850/60 backdrop-blur-xl border border-white/5 px-8 py-3 rounded-2xl hidden xl:flex items-center gap-8 shadow-2xl">
                        <div className="text-center group cursor-help">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-1 group-hover:text-primary transition-colors">Response Avg</p>
                            <p className="text-lg font-black text-text-primary tracking-widest italic leading-none">14:20s</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center group cursor-help">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-1 group-hover:text-green-400 transition-colors">SLA Health</p>
                            <p className="text-lg font-black text-green-400 tracking-widest italic leading-none">98.2%</p>
                        </div>
                    </div>
                    <button className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 flex items-center gap-4 transition-all active:scale-95 group">
                        <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Open New Ticket
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
                {[
                    { label: 'Unresolved', value: 12, icon: Clock, color: 'text-red-500', shadow: 'shadow-red-500/5' },
                    { label: 'Processing', value: 8, icon: AlertCircle, color: 'text-yellow-500', shadow: 'shadow-yellow-500/5' },
                    { label: 'Resolved', value: 24, icon: CheckCircle2, color: 'text-green-500', shadow: 'shadow-green-500/5' },
                    { label: 'Total Volume', value: 142, icon: ShieldCheck, color: 'text-primary', shadow: 'shadow-primary/5' },
                ].map((stat, i) => (
                    <div key={i} className={twMerge(
                        "bg-dark-800/40 p-7 rounded-[2.5rem] border border-white/5 shadow-2xl flex items-center justify-between group hover:border-primary/40 hover:bg-dark-800/60 transition-all cursor-pointer relative overflow-hidden",
                        stat.shadow
                    )}>
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-2">{stat.label}</p>
                            <h3 className="text-3xl font-black text-text-primary italic tracking-tighter leading-none">{stat.value}</h3>
                        </div>
                        <div className={twMerge("p-4 rounded-2xl bg-dark-950 border border-white/5 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-inner", stat.color)}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-1 w-full px-4 min-h-0">
                <Table
                    rowData={rowData}
                    columnDefs={columnDefs}
                    paginationPageSize={10}
                />
            </div>
        </div>
    );
};

export default ClientQueries;

