import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, PhoneCall, Trash2, Pencil } from "lucide-react";
import {
  useGetRequestCallsQuery,
  useAddRequestCallMutation,
  useUpdateRequestCallMutation,
  useDeleteRequestCallMutation,
} from "../../../redux/api/clientApiSlice";
import { toast } from "../../../utils/toast";

const ClientCallbackData = () => {
    const [searchInput, setSearchInput] = useState("");
    const [searchApplied, setSearchApplied] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: "", email: "", phone: "" });
    const { data, isLoading, isError, error, refetch } = useGetRequestCallsQuery({
        page: 1,
        limit: 1000,
    });
    const [addRequestCall, { isLoading: isAdding }] = useAddRequestCallMutation();
    const [updateRequestCall, { isLoading: isUpdating }] = useUpdateRequestCallMutation();
    const [deleteRequestCall, { isLoading: isDeleting }] = useDeleteRequestCallMutation();
    const hasShownLoadToast = useRef(false);

    const rows = useMemo(() => {
        const source = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return source.map((item, index) => ({
            id: index + 1,
            _id: item._id,
            name: item.name || "-",
            email: item.email || "-",
            phone: item.phone || "-",
            dateOfCalling: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-GB")
                : "-",
            remarks: item.remarks || item.status || "-",
        }));
    }, [data]);

    useEffect(() => {
        if (!isLoading && !isError && data && !hasShownLoadToast.current) {
            toast.info("Callback requests loaded");
            hasShownLoadToast.current = true;
        }
    }, [isLoading, isError, data]);

    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message || "Failed to load callback requests");
        }
    }, [isError, error]);

    const filteredRows = useMemo(() => {
        const q = searchApplied.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) =>
            [r.name, r.email, r.phone, r.remarks].join(' ').toLowerCase().includes(q)
        );
    }, [rows, searchApplied]);

    const handleDelete = async (id) => {
        try {
            await deleteRequestCall(id).unwrap();
            refetch();
            toast.success("Request deleted successfully");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete request");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addRequestCall(formData).unwrap();
            refetch();
            toast.success("Request created successfully");
            setFormData({ name: "", email: "", phone: "" });
            setIsAddOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create request");
        }
    };

    const handleOpenEdit = (row) => {
        setEditingId(row._id);
        setEditFormData({
            name: row.name || "",
            email: row.email || "",
            phone: row.phone || "",
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingId) return;
        try {
            await updateRequestCall({
                id: editingId,
                data: {
                    name: editFormData.name,
                    email: editFormData.email,
                    phone: editFormData.phone,
                },
            }).unwrap();
            refetch();
            toast.success("Request updated successfully");
            setIsEditOpen(false);
            setEditingId(null);
            setEditFormData({ name: "", email: "", phone: "" });
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update request");
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 p-6 text-text-muted font-sans">
            <div className="bg-dark-850 border border-dark-700/50 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-4 justify-between mb-6">
                <h1 className="text-4xl font-bold text-text-primary tracking-tight">Client Callback Data</h1>
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search clients..."
                        className="px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary w-64"
                    />
                    <button onClick={() => setSearchApplied(searchInput)} className="px-5 py-2.5 rounded-xl bg-dark-900 text-text-primary font-bold hover:bg-dark-800 transition-colors">Apply</button>
                    <button onClick={() => { setSearchInput(''); setSearchApplied(''); }} className="px-5 py-2.5 rounded-xl bg-dark-700 text-text-primary font-bold hover:bg-dark-600 transition-colors">Clear</button>
                    <button onClick={() => setIsAddOpen((p) => !p)} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-text-primary font-bold transition-colors">Add Request</button>
                </div>
            </div>

            {isAddOpen ? (
                <form onSubmit={handleAdd} className="bg-dark-850 border border-dark-700/50 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                    <input
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Name"
                        className="px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                        required
                    />
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        placeholder="Email"
                        className="px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                        required
                    />
                    <input
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="Phone"
                        className="px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                        required
                    />
                    <button type="submit" disabled={isAdding} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-text-primary font-bold disabled:opacity-60 transition-colors">
                        {isAdding ? "Saving..." : "Save"}
                    </button>
                </form>
            ) : null}

            {isEditOpen ? (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-dark-850 border border-dark-700 rounded-2xl p-5 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-text-primary">Edit Callback Request</h2>
                            <button
                                onClick={() => {
                                    setIsEditOpen(false);
                                    setEditingId(null);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-dark-700 text-text-primary hover:bg-dark-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-3">
                            <input
                                value={editFormData.name}
                                onChange={(e) =>
                                    setEditFormData((p) => ({ ...p, name: e.target.value }))
                                }
                                placeholder="Name"
                                className="px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                                required
                            />
                            <input
                                type="email"
                                value={editFormData.email}
                                onChange={(e) =>
                                    setEditFormData((p) => ({ ...p, email: e.target.value }))
                                }
                                placeholder="Email"
                                className="px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                                required
                            />
                            <input
                                value={editFormData.phone}
                                onChange={(e) =>
                                    setEditFormData((p) => ({ ...p, phone: e.target.value }))
                                }
                                placeholder="Phone"
                                className="px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-text-primary font-bold disabled:opacity-60 transition-colors"
                            >
                                {isUpdating ? "Updating..." : "Update"}
                            </button>
                        </form>
                    </div>
                </div>
            ) : null}

            <div className="bg-dark-850 border border-dark-700/50 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-[1200px] w-full text-sm">
                        <thead className="bg-dark-800/50 border-b border-dark-700/50">
                            <tr className="text-text-muted font-bold uppercase text-xs tracking-wider">
                                {['#', 'Your Name', 'Your Email', 'Phone Number', 'Date of Calling', 'Remarks', 'Action'].map((h, index) => (
                                    <th key={h} className={`text-left px-4 py-3.5 font-bold whitespace-nowrap ${index === 0 ? 'sticky left-0 z-30 !bg-dark-850' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                                        <span className="inline-flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Loading callback requests...
                                        </span>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-red-400">
                                        {error?.data?.message || "Failed to load callback requests"}
                                    </td>
                                </tr>
                            ) : filteredRows.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                                        No callback requests found
                                    </td>
                                </tr>
                            ) : filteredRows.map((row) => (
                                <tr key={row.id} className="group hover:bg-dark-700/30 transition-colors">
                                    <td className="sticky left-0 z-20 px-4 py-3.5 whitespace-nowrap text-text-secondary !bg-dark-850 group-hover:!bg-dark-800">{row.id}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-text-primary">{row.name}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap text-text-muted">{row.email}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap text-text-muted">{row.phone}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap text-text-muted">{row.dateOfCalling}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[380px] truncate text-text-muted">{row.remarks}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`tel:${row.phone}`}
                                                className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
                                            >
                                                <PhoneCall className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => handleOpenEdit(row)}
                                                disabled={isUpdating}
                                                className="p-2 rounded-lg bg-dark-700 text-text-muted hover:text-text-primary disabled:opacity-60 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(row._id)}
                                                disabled={isDeleting}
                                                className="p-2 rounded-lg bg-dark-700 text-text-muted hover:text-rose-400 disabled:opacity-60 transition-colors"
                                            >
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
