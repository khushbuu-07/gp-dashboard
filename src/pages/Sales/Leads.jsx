import React, { useMemo, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRightLeft,
  Globe,
  Users,
  Activity,
  Star,
  UserMinus,
  MessageCircle,
  Instagram,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAddLeadMutation,
  useDeleteLeadMutation,
  useGetLeadsQuery,
  useUpdateLeadMutation,
  useUpdateLeadStatusMutation,
} from "../../redux/api/leadsApiSlice";
import { toast } from "../../utils/toast";

const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Converted", "Lost"];
const SOURCE_OPTIONS = ["Website", "Whatsapp", "Facebook", "Instagram", "LinkedIn", "Google Ads"];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  source: "Website",
  status: "New",
  interestedIn: "",
  date: "",
};

const toApiStatus = (status) => String(status || "new").toLowerCase();
const toApiSource = (source) => String(source || "website").toLowerCase();

const toUiStatus = (status) => {
  const value = String(status || "new").toLowerCase();
  if (value === "contacted") return "Contacted";
  if (value === "qualified") return "Qualified";
  if (value === "converted") return "Converted";
  if (value === "lost") return "Lost";
  return "New";
};

const toUiSource = (source) => {
  const value = String(source || "").toLowerCase();
  if (value === "whatsapp") return "Whatsapp";
  if (value === "facebook") return "Facebook";
  if (value === "instagram") return "Instagram";
  if (value === "linkedin") return "LinkedIn";
  if (value === "google ads") return "Google Ads";
  return "Website";
};

const ManageLeads = () => {
  const { data: rawLeads = [], isLoading, isError, error, refetch } = useGetLeadsQuery();
  const [addLead, { isLoading: isAdding }] = useAddLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();
  const [updateLeadStatus, { isLoading: isUpdatingStatus }] = useUpdateLeadStatusMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [form, setForm] = useState(emptyForm);
  const [isDarkMode] = useState(true);

  const leads = useMemo(
    () =>
      (Array.isArray(rawLeads) ? rawLeads : []).map((lead) => ({
        id: lead._id,
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        source: toUiSource(lead.source),
        status: toUiStatus(lead.status),
        interestedIn: lead.interestedIn || "",
        date: lead.createdAt || lead.updatedAt || new Date().toISOString(),
      })),
    [rawLeads]
  );

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        lead.interestedIn.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "ALL" || lead.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, selectedStatus]);

  const paginatedLeads = useMemo(
    () => filteredLeads.slice((page - 1) * entries, page * entries),
    [filteredLeads, page, entries]
  );

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (lead) => {
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      interestedIn: lead.interestedIn,
      date: lead.date ? new Date(lead.date).toISOString().slice(0, 10) : "",
    });
    setEditId(lead.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this lead?");
    if (!ok) return;
    try {
      await deleteLead(id).unwrap();
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete lead");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      status: toApiStatus(form.status),
      source: toApiSource(form.source),
      interestedIn: form.interestedIn,
    };

    try {
      if (editId) {
        await updateLead({ id: editId, data: payload }).unwrap();
      } else {
        await addLead(payload).unwrap();
      }
      setIsFormOpen(false);
      setEditId(null);
      setForm(emptyForm);
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save lead");
    }
  };

  const handleCopy = (lead) => {
    navigator.clipboard.writeText(JSON.stringify(lead));
    toast.success("Lead copied to clipboard");
  };

  const handleConvertToClient = async (lead) => {
    try {
      await updateLeadStatus({ id: lead.id, status: "converted" }).unwrap();
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to convert lead");
    }
  };

  const handleStatusChange = async (lead, value) => {
    try {
      await updateLeadStatus({ id: lead.id, status: toApiStatus(value) }).unwrap();
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case "Website":
        return <Globe className="w-4 text-blue-400" />;
      case "Whatsapp":
        return <MessageCircle className="w-4 text-green-400" />;
      case "Instagram":
        return <Instagram className="w-4 text-pink-400" />;
      case "Google Ads":
        return <Search className="w-4 text-yellow-400" />;
      default:
        return <Globe className="w-4 text-gray-400" />;
    }
  };

  const stats = useMemo(
    () => ({
      total: leads.length,
      active: leads.filter((l) => l.status === "New").length,
      deals: leads.filter((l) => l.status === "Converted").length,
      inactive: leads.filter((l) => l.status === "Lost").length,
    }),
    [leads]
  );

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / entries));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-h-screen p-6 transition-all ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900"
          : "bg-gradient-to-br from-sky-200 via-white to-sky-200"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h1
            className={`text-3xl md:text-4xl font-bold ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                : "text-sky-700"
            }`}
          >
            Lead Management
          </h1>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`group relative px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 ${
              isDarkMode
                ? "bg-gradient-to-r from-primary to-cyan-500 text-white shadow-primary/25 hover:shadow-primary/40"
                : "bg-gradient-to-r from-sky-400 to-sky-600 text-white shadow-sky-400/25 hover:shadow-sky-400/40"
            }`}
          >
            <span className="flex items-center gap-2">
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              Add New Lead
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: stats.total, icon: Users, color: "from-primary to-cyan-500" },
            { label: "Daily Leads", value: stats.active, icon: Activity, color: "from-emerald-500 to-teal-500" },
            { label: "Deals", value: stats.deals, icon: Star, color: "from-amber-500 to-orange-500" },
            { label: "Lost", value: stats.inactive, icon: UserMinus, color: "from-rose-500 to-pink-500" },
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl`} />
              <div className="relative rounded-2xl p-6 overflow-hidden border backdrop-blur-xl bg-dark-800/50 border-dark-600/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1 text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl opacity-80`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border rounded-2xl p-6 shadow-2xl backdrop-blur-xl bg-dark-800/50 border-dark-600/30">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">{editId ? "Edit Lead" : "Add New Lead"}</h2>
                  <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-lg transition-colors hover:bg-slate-700">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "name", placeholder: "Full Name", type: "text" },
                    { name: "phone", placeholder: "Mobile Number", type: "text" },
                    { name: "email", placeholder: "Email Address", type: "email" },
                    { name: "interestedIn", placeholder: "Project Interested", type: "text" },
                    { name: "source", type: "select", options: SOURCE_OPTIONS },
                    { name: "status", type: "select", options: STATUS_OPTIONS },
                    { name: "date", type: "date" },
                  ].map((field) =>
                    field.type === "select" ? (
                      <select
                        key={field.name}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        className="bg-dark-900/50 border rounded-xl px-4 py-3 outline-none transition-all border-dark-600/30 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        key={field.name}
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="rounded-xl px-4 py-3 outline-none transition-all bg-dark-900/50 border border-dark-600/30 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    )
                  )}

                  <button
                    type="submit"
                    disabled={isAdding || isUpdating}
                    className="col-span-1 md:col-span-3 py-3 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-primary to-cyan-500 text-white hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60"
                  >
                    {isAdding || isUpdating ? "Saving..." : editId ? "Update Lead" : "Add Lead"}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row gap-4 justify-between rounded-xl p-4 border bg-dark-800/60 border-dark-600/30">
          <div className="flex items-center gap-2 text-slate-300">
            Show
            <select
              value={entries}
              onChange={(e) => {
                setEntries(+e.target.value);
                setPage(1);
              }}
              className="rounded px-2 py-1 outline-none bg-dark-900 border border-dark-600/30 text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            entries
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                className="pl-9 py-2 rounded-lg outline-none bg-dark-900 border border-dark-600/30 text-white"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-lg px-3 py-2 outline-none bg-dark-900 border border-dark-600/30 text-white"
            >
              <option value="ALL">All Status</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <button className="p-2 rounded-lg border bg-dark-900 border-dark-600/30 text-white">
              <Download className="w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border bg-dark-800 border-dark-600/30">
          <table className="min-w-full text-sm">
            <thead className="bg-dark-900">
              <tr>
                {["Name", "Email", "Phone", "Source", "Interest", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              <AnimatePresence>
                {paginatedLeads.map((lead) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group transition-colors hover:bg-slate-700/30"
                  >
                    <td className="px-4 py-3 text-white">{lead.name}</td>
                    <td className="px-4 py-3 text-blue-400">{lead.email}</td>
                    <td className="px-4 py-3 text-purple-400">{lead.phone || "-"}</td>
                    <td className="px-4 py-3">{getSourceIcon(lead.source)}</td>
                    <td className="px-4 py-3 text-slate-300">{lead.interestedIn}</td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead, e.target.value)}
                        disabled={isUpdatingStatus}
                        className="rounded-full px-2 py-1 text-xs border outline-none transition-all bg-dark-900 border-dark-600/30 text-white focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {lead.date ? new Date(lead.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(lead)}>
                          <Edit className="w-4 text-slate-300" />
                        </button>
                        <button disabled={isDeleting} onClick={() => handleDelete(lead.id)}>
                          <Trash2 className="w-4 text-rose-400" />
                        </button>
                        <button onClick={() => handleCopy(lead)}>
                          <Copy className="w-4 text-slate-300" />
                        </button>
                        <button
                          onClick={() => handleConvertToClient(lead)}
                          className="p-1.5 bg-emerald-500/20 rounded-md hover:bg-emerald-500/30"
                          title="Convert to Client"
                        >
                          <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {isLoading && <div className="p-6 text-slate-300">Loading leads...</div>}
          {isError && (
            <div className="p-6 text-rose-400">{error?.data?.message || "Failed to fetch leads"}</div>
          )}
          {!isLoading && !isError && filteredLeads.length === 0 && (
            <div className="p-6 text-slate-300">No leads found</div>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-slate-400">
          <span>
            Showing {filteredLeads.length ? (page - 1) * entries + 1 : 0} to{" "}
            {Math.min(page * entries, filteredLeads.length)} of {filteredLeads.length}
          </span>
          <div className="flex gap-2 items-center">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "text-blue-400" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageLeads;

