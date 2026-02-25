import React, { useMemo, useState } from "react";
import { Search, Filter, CheckCircle, Clock, AlertCircle, Loader2, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  useGetFormsQuery,
  useLazyGetFormByFormIdQuery,
  useUpdateFormStatusMutation,
  useAssignFormMutation,
  useDeleteFormMutation,
} from "../../../redux/api/clientApiSlice";

const ClientQueries = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedFormId, setSelectedFormId] = useState(null);

  const { data, isLoading, isError, error } = useGetFormsQuery({
    page: 1,
    limit: 1000,
    search: searchTerm,
    status: statusFilter === "ALL" ? "" : statusFilter,
  });
  const [getFormByFormId, { data: selectedForm, isFetching: isDetailLoading }] =
    useLazyGetFormByFormIdQuery();
  const [updateFormStatus, { isLoading: isUpdatingStatus }] = useUpdateFormStatusMutation();
  const [assignForm, { isLoading: isAssigning }] = useAssignFormMutation();
  const [deleteForm, { isLoading: isDeleting }] = useDeleteFormMutation();

  const forms = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const filteredForms = forms;

  const stats = useMemo(() => {
    const pending = forms.filter((f) => f.status === "NEW").length;
    const inProgress = forms.filter((f) => f.status === "IN_PROGRESS").length;
    const resolved = forms.filter((f) => f.status === "RESOLVED").length;
    return { pending, inProgress, resolved };
  }, [forms]);

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "IN_PROGRESS":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "NEW":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const handleView = async (formId) => {
    setSelectedFormId(formId);
    await getFormByFormId(formId);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateFormStatus({ id, status }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to update status");
    }
  };

  const handleAssign = async (id) => {
    const userId = window.prompt("Enter userId to assign:");
    if (!userId) return;
    try {
      await assignForm({ id, userId }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to assign");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this form?")) return;
    try {
      await deleteForm(id).unwrap();
      if (selectedFormId) setSelectedFormId(null);
    } catch (err) {
      alert(err?.data?.message || "Failed to delete");
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
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Form ID..."
              className="pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-sm focus:outline-none focus:border-primary w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-sm focus:outline-none focus:border-primary"
            >
              <option value="ALL">All</option>
              <option value="NEW">NEW</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-sm text-text-muted">New</p>
          </div>
        </div>
        <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.inProgress}</p>
            <p className="text-sm text-text-muted">In Progress</p>
          </div>
        </div>
        <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.resolved}</p>
            <p className="text-sm text-text-muted">Resolved</p>
          </div>
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-600/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="h-56 flex items-center justify-center text-text-muted">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading queries...
          </div>
        ) : isError ? (
          <div className="h-56 flex items-center justify-center text-red-400">
            {error?.data?.message || "Failed to fetch queries"}
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-dark-800 text-text-muted font-medium uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Form ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Updated At</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600/30">
              {filteredForms.map((form) => (
                <tr key={form._id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-primary">{form.formId}</td>
                  <td className="px-6 py-4">
                    {[form.firstName, form.lastName].filter(Boolean).join(" ") || "-"}
                  </td>
                  <td className="px-6 py-4 text-text-muted">{form.email || "-"}</td>
                  <td className="px-6 py-4 text-text-muted">{form.country || "-"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={twMerge(
                        "px-2.5 py-1 rounded-lg text-xs font-bold border",
                        getStatusColor(form.status),
                      )}
                    >
                      {form.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {form.createdAt ? new Date(form.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {form.updatedAt ? new Date(form.updatedAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleView(form.formId)}
                        className="text-primary hover:text-primary-light font-medium text-xs uppercase tracking-wide"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleStatusChange(form._id, "NEW")}
                        disabled={isUpdatingStatus}
                        className="text-xs px-2 py-1 rounded border border-dark-500 hover:border-primary disabled:opacity-60"
                      >
                        Mark NEW
                      </button>
                      <button
                        onClick={() => handleStatusChange(form._id, "IN_PROGRESS")}
                        disabled={isUpdatingStatus}
                        className="text-xs px-2 py-1 rounded border border-dark-500 hover:border-primary disabled:opacity-60"
                      >
                        Mark IN_PROGRESS
                      </button>
                      <button
                        onClick={() => handleStatusChange(form._id, "RESOLVED")}
                        disabled={isUpdatingStatus}
                        className="text-xs px-2 py-1 rounded border border-dark-500 hover:border-primary disabled:opacity-60"
                      >
                        Mark RESOLVED
                      </button>
                      <button
                        onClick={() => handleAssign(form._id)}
                        disabled={isAssigning}
                        className="text-xs px-2 py-1 rounded border border-dark-500 hover:border-primary disabled:opacity-60"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => handleDelete(form._id)}
                        disabled={isDeleting}
                        className="text-xs px-2 py-1 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedFormId ? (
        <div className="bg-dark-900 border border-dark-600/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Form Details</h2>
            <button
              onClick={() => setSelectedFormId(null)}
              className="p-1.5 rounded-lg hover:bg-dark-800 text-text-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {isDetailLoading ? (
            <div className="text-text-muted flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading details...
            </div>
          ) : selectedForm ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p>
                <span className="text-text-muted">Form ID:</span> {selectedForm.formId}
              </p>
              <p>
                <span className="text-text-muted">Name:</span>{" "}
                {[selectedForm.firstName, selectedForm.lastName].filter(Boolean).join(" ") || "-"}
              </p>
              <p>
                <span className="text-text-muted">Email:</span> {selectedForm.email || "-"}
              </p>
              <p>
                <span className="text-text-muted">Country:</span> {selectedForm.country || "-"}
              </p>
              <p>
                <span className="text-text-muted">Status:</span> {selectedForm.status}
              </p>
              <p>
                <span className="text-text-muted">Profile File:</span>{" "}
                {selectedForm.profileFilePath || "N/A"}
              </p>
              <p>
                <span className="text-text-muted">Created:</span>{" "}
                {selectedForm.createdAt
                  ? new Date(selectedForm.createdAt).toLocaleString()
                  : "-"}
              </p>
              <p>
                <span className="text-text-muted">Updated:</span>{" "}
                {selectedForm.updatedAt
                  ? new Date(selectedForm.updatedAt).toLocaleString()
                  : "-"}
              </p>
            </div>
          ) : (
            <div className="text-text-muted">No details found for {selectedFormId}</div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ClientQueries;
