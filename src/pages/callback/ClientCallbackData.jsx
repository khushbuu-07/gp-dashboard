import React, { useMemo, useState } from 'react';
import { PhoneCall, Trash2 } from 'lucide-react';

const initialRows = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '9876543210', dateOfCalling: '21/2/2026', remarks: 'Requested callback at 5 PM' },
    { id: 2, name: 'Sneha Verma', email: 'sneha.verma@outlook.com', phone: '9865032147', dateOfCalling: '20/2/2026', remarks: 'Wants pricing details' },
    { id: 3, name: 'Amit Kumar', email: 'amit.kumar@yahoo.com', phone: '9123456789', dateOfCalling: '19/2/2026', remarks: 'Interested in chat process' },
    { id: 4, name: 'Pooja Singh', email: 'pooja.singh@gmail.com', phone: '9988123456', dateOfCalling: '18/2/2026', remarks: 'Asked for documents list' },
    { id: 5, name: 'Imran Ali', email: 'imran.ali@mail.com', phone: '9011223344', dateOfCalling: '17/2/2026', remarks: 'Follow-up required next week' },
    { id: 6, name: 'Neha Patel', email: 'neha.patel@mail.com', phone: '9001122334', dateOfCalling: '16/2/2026', remarks: 'No answer on first attempt' },
];

const ClientCallbackData = () => {
    const [rows, setRows] = useState(initialRows);
    const [searchInput, setSearchInput] = useState('');
    const [searchApplied, setSearchApplied] = useState('');

    const filteredRows = useMemo(() => {
        const q = searchApplied.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) =>
            [r.name, r.email, r.phone, r.remarks].join(' ').toLowerCase().includes(q)
        );
    }, [rows, searchApplied]);

    const handleDelete = (id) => {
        setRows((prev) => prev.filter((r) => r.id !== id).map((r, i) => ({ ...r, id: i + 1 })));
    };

    return (
        <div className="space-y-6 pt-6 animate-fade-in font-sans text-text-primary">
            <div className="bg-dark-800/80 border border-dark-600 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <h1 className="text-4xl font-extrabold tracking-tight">Client Callback Data</h1>
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search clients..."
                        className="px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-xl text-sm focus:outline-none focus:border-primary w-64"
                    />
                    <button onClick={() => setSearchApplied(searchInput)} className="px-5 py-2.5 rounded-xl bg-dark-900 text-text-primary font-bold">Apply</button>
                    <button onClick={() => { setSearchInput(''); setSearchApplied(''); }} className="px-5 py-2.5 rounded-xl bg-dark-700 text-text-primary font-bold">Clear</button>
                </div>
            </div>

            <div className="bg-dark-900 border border-dark-600/60 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[1200px] w-full text-sm">
                        <thead className="bg-dark-800 border-b border-dark-600/60">
                            <tr className="text-primary uppercase text-xs tracking-wider">
                                {['#', 'Your Name', 'Your Email', 'Phone Number', 'Date of Calling', 'Remarks', 'Action'].map((h) => (
                                    <th key={h} className="text-left px-4 py-3.5 font-bold whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row) => (
                                <tr key={row.id} className="border-b border-dark-600/30 hover:bg-dark-800/50">
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.id}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold">{row.name}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.email}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.phone}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.dateOfCalling}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[380px] truncate">{row.remarks}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20">
                                                <PhoneCall className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
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

export default ClientCallbackData;
