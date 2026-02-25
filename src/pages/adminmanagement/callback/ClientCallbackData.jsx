import React, { useMemo, useState } from "react";
import { Loader2, PhoneCall, Trash2, Pencil } from "lucide-react";
import {
  useGetRequestCallsQuery,
  useAddRequestCallMutation,
  useUpdateRequestCallMutation,
  useDeleteRequestCallMutation,
} from "../../../redux/api/clientApiSlice";

const ClientCallbackData = () => {
    const [searchInput, setSearchInput] = useState("");
    const [searchApplied, setSearchApplied] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const { data, isLoading, isError, error, refetch } = useGetRequestCallsQuery({
        page: 1,
        limit: 1000,
    });
    const [addRequestCall, { isLoading: isAdding }] = useAddRequestCallMutation();
    const [updateRequestCall, { isLoading: isUpdating }] = useUpdateRequestCallMutation();
    const [deleteRequestCall, { isLoading: isDeleting }] = useDeleteRequestCallMutation();

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

    const filteredRows = useMemo(() => {
        const q = searchApplied.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) =>
            [r.name, r.email, r.phone, r.remarks].join(' ').toLowerCase().includes(q)
        );
    }, [rows, searchApplied]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this callback request?")) return;
        try {
            await deleteRequestCall(id).unwrap();
            refetch();
        } catch (err) {
            alert(err?.data?.message || "Failed to delete request");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addRequestCall(formData).unwrap();
            refetch();
            setFormData({ name: "", email: "", phone: "" });
            setIsAddOpen(false);
        } catch (err) {
            alert(err?.data?.message || "Failed to create request");
        }
    };

    const handleUpdateEmail = async (row) => {
        const email = window.prompt("Update email", row.email || "");
        if (!email) return;
        try {
            await updateRequestCall({ id: row._id, data: { email } }).unwrap();
            refetch();
        } catch (err) {
            alert(err?.data?.message || "Failed to update request");
        }
    };

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
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
                    <button onClick={() => setIsAddOpen((p) => !p)} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold">Add Request</button>
                </div>
            </div>

            {isAddOpen ? (
                <form onSubmit={handleAdd} className="bg-dark-900 border border-dark-600/60 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Name"
                        className="px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-xl text-sm focus:outline-none focus:border-primary"
                        required
                    />
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        placeholder="Email"
                        className="px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-xl text-sm focus:outline-none focus:border-primary"
                        required
                    />
                    <input
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="Phone"
                        className="px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-xl text-sm focus:outline-none focus:border-primary"
                        required
                    />
                    <button type="submit" disabled={isAdding} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold disabled:opacity-60">
                        {isAdding ? "Saving..." : "Save"}
                    </button>
                </form>
            ) : null}

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
                                <tr key={row.id} className="border-b border-dark-600/30 hover:bg-dark-800/50">
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.id}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold">{row.name}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.email}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.phone}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">{row.dateOfCalling}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap max-w-[380px] truncate">{row.remarks}</td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`tel:${row.phone}`}
                                                className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
                                            >
                                                <PhoneCall className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => handleUpdateEmail(row)}
                                                disabled={isUpdating}
                                                className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-primary disabled:opacity-60"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(row._id)}
                                                disabled={isDeleting}
                                                className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-red-500 disabled:opacity-60"
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
