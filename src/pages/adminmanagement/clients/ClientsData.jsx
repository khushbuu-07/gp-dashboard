import React, { useMemo, useState } from 'react';
import { Download, MessageCircle, Pencil, Plus, Trash2, X, Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useGetClientsQuery, useAddClientMutation, useUpdateClientMutation, useDeleteClientMutation } from '../../../redux/api/clientApiSlice';

// Modal Component for Add/Edit
const ClientModal = ({ isOpen, onClose, onSave, client, isLoading }) => {
    const [formData, setFormData] = useState(
        {
            name: '', email: '', phone: '', companyName: '', address: '', city: '', state: '', pincode: '', status: 'active'
        }
    );

    React.useEffect(() => {
        if (client) {
            setFormData({
                name: client.name || '',
                email: client.email || '',
                phone: client.phone || '',
                companyName: client.companyName || '',
                address: client.address || '',
                city: client.city || '',
                state: client.state || '',
                pincode: client.pincode || '',
                status: client.status || 'active'
            });
        } else {
            setFormData({
                name: '', email: '', phone: '', companyName: '', address: '', city: '', state: '', pincode: '', status: 'active'
            });
        }
    }, [client]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-dark-850 rounded-2xl shadow-2xl w-full max-w-2xl border border-dark-600 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-dark-700 text-text-muted transition-colors">
                    <X className="w-5 h-5" />
                </button>
                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="text-2xl font-bold text-text-primary mb-6">{client ? 'Edit Client' : 'Add New Client'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {Object.keys(formData).filter(k => !['_id', '__v', 'createdAt', 'updatedAt', 'sno'].includes(k)).map(key => (
                             <div key={key}>
                                <label className="text-sm font-medium text-text-secondary ml-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                {key === 'status' ? (
                                    <select
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        className="w-full mt-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-text-primary"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="prospect">Prospect</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        placeholder={`Enter ${key}`}
                                        required={['name', 'email', 'phone'].includes(key)}
                                        className="w-full mt-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-text-primary"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            {client ? 'Save Changes' : 'Add Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const statusClass = {
    active: 'bg-green-500/15 text-green-500 border-green-500/30',
    inactive: 'bg-red-500/15 text-red-500 border-red-500/30',
    prospect: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
};

const ClientsData = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchApplied, setSearchApplied] = useState('');

    const { data, isLoading, isError, error } = useGetClientsQuery();
    const [addClient, { isLoading: isAdding }] = useAddClientMutation();
    const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
    const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

    const filteredRows = useMemo(() => {
        const clients = data?.data?.clients || [];
        const clientData = clients.map((c, i) => ({ ...c, sno: i + 1 }));
        const q = searchApplied.trim().toLowerCase();
        if (!q) return clientData;
        return clientData.filter((r) =>
            Object.values(r).some(val => String(val).toLowerCase().includes(q))
        );
    }, [data, searchApplied]);

    const handleOpenModal = (client = null) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingClient(null);
        setIsModalOpen(false);
    };

    const handleSave = async (clientData) => {
        try {
            if (editingClient) {
                await updateClient({ ...clientData, _id: editingClient._id }).unwrap();
            } else {
                await addClient(clientData).unwrap();
            }
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save client:', err);
            // You can show a toast notification here
        }
    };

    const handleDelete = async (clientId) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await deleteClient(clientId).unwrap();
            } catch (err) {
                console.error('Failed to delete client:', err);
            }
        }
    };

    const handleExport = () => {
        const headers = ['Sno', 'Name', 'Phone', 'Email', 'Company', 'City', 'Status', 'Created At'];
        const lines = filteredRows.map((r) =>
            [r.sno, r.name, r.phone, r.email, r.companyName, r.city, r.status, r.createdAt]
                .map((v) => `"${String(v || '').replace(/"/g, '""')}"`)
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
                    <button onClick={() => handleOpenModal()} className="px-5 py-2.5 rounded-xl bg-dark-900 text-text-primary font-bold flex items-center gap-2"><Plus className="w-4 h-4" />Add</button>
                    <button onClick={handleExport} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold flex items-center gap-2"><Download className="w-4 h-4" />Export</button>
                </div>
            </div>

            <div className="bg-dark-900 border border-dark-600/60 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-96">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : isError ? (
                        <div className="flex justify-center items-center h-96 text-red-500">
                            Error fetching data: {error?.data?.message || 'Unknown error'}
                        </div>
                    ) : (
                        <table className="min-w-[1700px] w-full text-sm">
                            <thead className="bg-dark-800 border-b border-dark-600/60">
                                <tr className="text-primary uppercase text-xs tracking-wider">
                                    {['Sno', 'Name', 'Phone', 'Email', 'Company', 'City', 'State', 'Pincode', 'Status', 'Created At', 'Actions', 'Send Message'].map((h) => (
                                        <th key={h} className="text-left px-4 py-3.5 font-bold whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row) => (
                                    <tr key={row._id} className="border-b border-dark-600/30 hover:bg-dark-800/50">
                                        <td className="px-4 py-3.5 whitespace-nowrap">{row.sno}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap font-semibold">{row.name}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">{row.phone}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap max-w-[260px] truncate">{row.email}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">{row.companyName || '-'}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">{row.city || '-'}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">{row.state || '-'}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">{row.pincode || '-'}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <span className={twMerge('px-3 py-1 rounded-full text-xs font-bold border capitalize', statusClass[row.status?.toLowerCase()] || 'bg-dark-700 text-gray-400')}>{row.status}</span>
                                        </td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">{new Date(row.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleOpenModal(row)} className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-primary"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(row._id)} disabled={isDeleting} className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-red-500 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
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
                    )}
                </div>
            </div>
            <ClientModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                client={editingClient}
                isLoading={isAdding || isUpdating}
            />
        </div>
    );
};

export default ClientsData;
