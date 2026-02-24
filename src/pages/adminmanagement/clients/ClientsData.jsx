import React, { useMemo, useState } from 'react';
import { Download, MessageCircle, Pencil, Plus, Trash2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const initialRows = [
    { sno: 1, name: 'ZIYAUDDIN', mobile: '8840256795', email: 'AERONEXUSSOLUTION@GMAIL.COM', projectInterested: 'INBOUND TELECOM CAMPAIGN', projectCode: 'UTC/99810035', location: 'LUCKNOW', dateOfCall: '21/2/2026', attendedBy: 'AARJUGP', status: 'ACTIVE', remarks: "We've scheduled next call." },
    { sno: 2, name: 'YASHWANT', mobile: '8639633329', email: 'YASHWANTKAKARLA22@GMAIL.COM', projectInterested: 'CHAT PROCESS', projectCode: 'NDY', location: 'HYDERABAD', dateOfCall: '16/10/2025', attendedBy: 'AARJUGP', status: 'INACTIVE', remarks: 'busy-3 times no response' },
    { sno: 3, name: 'ZAHEESH MOIDEEN', mobile: '9845001214', email: 'ZAHEESH@GMAIL.COM', projectInterested: 'BPO PROCESS', projectCode: 'NOT DECIDED', location: 'BANGALORE', dateOfCall: '15/10/2025', attendedBy: 'AARJUGP', status: 'INACTIVE', remarks: 'not interested currently' },
    { sno: 4, name: 'SRINIVASH RAO JADAV', mobile: '8867405669', email: 'TRUSTLINK777@GMAIL.COM', projectInterested: 'BPO PROCESS', projectCode: 'NDY', location: 'BANGALORE', dateOfCall: '16/10/2025', attendedBy: 'AARJUGP', status: 'INACTIVE', remarks: 'na - follow up next week' },
    { sno: 5, name: 'ASUTOSH SAMANTARAY', mobile: '9337432436 / 8374460909', email: 'ASUTOSH@KALINGAITS.COM', projectInterested: 'BPO PROCESS', projectCode: 'NOT DECIDED', location: 'BHUVNESHWAR ODISHA', dateOfCall: '10/2/2026', attendedBy: 'AARJUGP', status: 'DEAL', remarks: 'NA - docs pending' },
    { sno: 6, name: 'RAMKANT SHARMA', mobile: '9453963078', email: 'RAMAKANTSHARMA945@GMAIL.COM', projectInterested: 'BPO PROCESS', projectCode: 'NOT DECIDED', location: 'KANNAUJ UP', dateOfCall: '17/11/2025', attendedBy: 'AARJUGP', status: 'INACTIVE', remarks: 'will connect next month' },
    { sno: 7, name: 'SHUBH UPADHAYA', mobile: '8790864837', email: 'SHUBHUPADHYA6@GMAIL.COM', projectInterested: 'INBOUND PROCESS', projectCode: 'NOT DECIDED', location: 'TAMILNADU', dateOfCall: '11/10/2025', attendedBy: 'AARJUGP', status: 'INACTIVE', remarks: 'will connect after discussion' },
    { sno: 8, name: 'SAM KRISHNAN K.', mobile: '7904373361', email: 'KANIDHANCOMPANY@GMAIL.COM', projectInterested: 'BPO PROCESS', projectCode: 'NOT DECIDED', location: 'HOSUR TAMILNADU', dateOfCall: '20/2/2026', attendedBy: 'AARJUGP', status: 'INACTIVE', remarks: 'NA-10 days follow up' },
];

const statusClass = {
    ACTIVE: 'bg-green-500/15 text-green-500 border-green-500/30',
    INACTIVE: 'bg-red-500/15 text-red-500 border-red-500/30',
    DEAL: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
};

const ClientsData = () => {
    const [rows, setRows] = useState(initialRows);
    const [searchInput, setSearchInput] = useState('');
    const [searchApplied, setSearchApplied] = useState('');

    const filteredRows = useMemo(() => {
        const q = searchApplied.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) =>
            [r.name, r.mobile, r.email, r.projectInterested, r.projectCode, r.location]
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
    }, [rows, searchApplied]);

    const handleAdd = () => {
        const nextSno = rows.length + 1;
        setRows((prev) => [
            ...prev,
            {
                sno: nextSno,
                name: `NEW CLIENT ${nextSno}`,
                mobile: `90000000${nextSno}`,
                email: `newclient${nextSno}@mail.com`,
                projectInterested: 'CHAT PROCESS',
                projectCode: 'NOT DECIDED',
                location: 'NEW DELHI',
                dateOfCall: '21/2/2026',
                attendedBy: 'AARJUGP',
                status: 'ACTIVE',
                remarks: 'newly added',
            },
        ]);
    };

    const handleDelete = (sno) => {
        setRows((prev) => prev.filter((r) => r.sno !== sno).map((r, i) => ({ ...r, sno: i + 1 })));
    };

    const handleExport = () => {
        const headers = ['Sno', 'Name', 'Mobile', 'Email', 'Project Interested', 'Project Code', 'Location', 'Date of Call', 'Attended By', 'Status', 'Remarks'];
        const lines = filteredRows.map((r) =>
            [r.sno, r.name, r.mobile, r.email, r.projectInterested, r.projectCode, r.location, r.dateOfCall, r.attendedBy, r.status, r.remarks]
                .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                .join(',')
        );
        const csv = [headers.join(','), ...lines].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clients-data.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <div className="bg-dark-800/80 border border-dark-600 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <h1 className="text-4xl font-extrabold tracking-tight">Clients Data</h1>
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search clients..."
                        className="px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-xl text-sm focus:outline-none focus:border-primary w-64"
                    />
                    <button onClick={() => setSearchApplied(searchInput)} className="px-5 py-2.5 rounded-xl bg-dark-900 text-text-primary font-bold">Apply</button>
                    <button onClick={() => { setSearchInput(''); setSearchApplied(''); }} className="px-5 py-2.5 rounded-xl bg-dark-700 text-text-primary font-bold">Clear</button>
                    <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl bg-dark-900 text-text-primary font-bold flex items-center gap-2"><Plus className="w-4 h-4" />Add</button>
                    <button onClick={handleExport} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold flex items-center gap-2"><Download className="w-4 h-4" />Export</button>
                </div>
            </div>

            <div className="bg-dark-900 border border-dark-600/60 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[1700px] w-full text-sm">
                        <thead className="bg-dark-800 border-b border-dark-600/60">
                            <tr className="text-primary uppercase text-xs tracking-wider">
                                {['Sno', 'Name', 'Mobile', 'Email', 'Project Interested', 'Project Code', 'Location', 'Date of Call', 'Attended By', 'Status', 'Remarks', 'Actions', 'Send Message'].map((h) => (
                                    <th key={h} className="text-left px-4 py-3.5 font-bold whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row) => (
                                <tr key={row.sno} className="border-b border-dark-600/30 hover:bg-dark-800/50">
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.sno}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold">{row.name}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.mobile}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[260px] truncate">{row.email}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[220px] truncate">{row.projectInterested}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.projectCode}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.location}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.dateOfCall}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.attendedBy}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <span className={twMerge('px-3 py-1 rounded-full text-xs font-bold border', statusClass[row.status])}>{row.status}</span>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[220px] truncate">{row.remarks}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-primary"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(row.sno)} className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-semibold flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4" />
                                            Send
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientsData;
