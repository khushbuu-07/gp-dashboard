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
  Save,
  Globe,
  Users,
  Activity,
  Star,
  UserMinus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

/* =======================
   STATUS COLORS
======================= */
const statusColors = {
  New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Converted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Lost: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  source: "Website",
  status: "New",
  interestedIn: "",
  date: "",
};

const ManageLeads = () => {
  const [leads, setLeads] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [form, setForm] = useState(emptyForm);
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark Mode Toggle

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (lead) => {
    setForm(lead);
    setEditId(lead.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) =>
    setLeads((prev) => prev.filter((l) => l.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setLeads((prev) =>
        prev.map((l) => (l.id === editId ? { ...l, ...form } : l))
      );
    } else {
      setLeads([{ id: Date.now(), ...form }, ...leads]);
    }
    setIsFormOpen(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleCopy = (lead) => {
    navigator.clipboard.writeText(JSON.stringify(lead));
    alert("Lead copied to clipboard!");
  };

  const handleConvertToClient = (lead) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === lead.id ? { ...l, status: "Converted" } : l
      )
    );
  };
    const getSourceIcon = (source) => {
    switch (source) {
      case "Website":
        return <Globe className="w-4 text-blue-400" />;
      case "WhatsApp":
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
        {/* HEADER */}
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
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40"
                : "bg-gradient-to-r from-sky-400 to-sky-600 text-white shadow-sky-400/25 hover:shadow-sky-400/40"
            }`}
          >
            <span className="flex items-center gap-2">
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              Add New Lead
            </span>
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Leads",
              value: stats.total,
              icon: Users,
              color: isDarkMode
                ? "from-blue-500 to-cyan-500"
                : "from-sky-400 to-sky-600",
            },
            {
              label: "Daily Leads",
              value: stats.active,
              icon: Activity,
              color: isDarkMode
                ? "from-emerald-500 to-teal-500"
                : "from-sky-300 to-sky-500",
            },
            {
              label: "Deals",
              value: stats.deals,
              icon: Star,
              color: isDarkMode
                ? "from-amber-500 to-orange-500"
                : "from-sky-300 to-sky-500",
            },
            {
              label: "Lost",
              value: stats.inactive,
              icon: UserMinus,
              color: isDarkMode
                ? "from-rose-500 to-pink-500"
                : "from-sky-200 to-sky-400",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl`}
              />
              <div
                className={`relative rounded-2xl p-6 overflow-hidden border backdrop-blur-xl ${
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-white/70 border-sky-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-slate-400" : "text-sky-600"
                      }`}
                    >
                      {stat.label}
                    </p>
                    <p
                      className={`text-3xl font-bold mt-1 ${
                        isDarkMode ? "text-white" : "text-sky-700"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl opacity-80`}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add New Client Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className={`border rounded-2xl p-6 shadow-2xl backdrop-blur-xl ${
                  isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white/80 border-sky-300"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-sky-700"
                    }`}
                  >
                    Add New Lead
                  </h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? "hover:bg-slate-700" : "hover:bg-sky-200"
                    }`}
                  >
                    <X
                      className={`w-5 h-5 ${
                        isDarkMode ? "text-slate-400" : "text-sky-700"
                      }`}
                    />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {[
                    { name: "name", placeholder: "Full Name", type: "text" },
                    { name: "phone", placeholder: "Mobile Number", type: "text" },
                    { name: "email", placeholder: "Email Address", type: "email" },
                    { name: "interestedIn", placeholder: "Project Interested", type: "text" },
                    { name: "source", placeholder: "Source", type: "select", options: ["Website","Whatsapp","Facebook","Instagram", "LinkedIn"] },
                    { name: "status", placeholder: "Status", type: "select", options: ["New","Contacted","Converted","Lost"] },
                    { name: "date", type: "date" }
                  ].map((field) => (
                    field.type === "select" ? (
                      <select
                        key={field.name}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        className={`bg-slate-900/50 border rounded-xl px-4 py-3 outline-none transition-all ${
                          isDarkMode
                            ? "border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            : "border-sky-300 text-sky-700 bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        }`}
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
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
                        className={`rounded-xl px-4 py-3 outline-none transition-all ${
                          isDarkMode
                            ? "bg-slate-900/50 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            : "bg-white border border-sky-300 text-sky-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        }`}
                      />
                    )
                  ))}

                  <button
                    type="submit"
                    className={`col-span-1 md:col-span-3 py-3 rounded-xl font-bold transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                        : "bg-gradient-to-r from-sky-400 to-sky-600 text-white hover:shadow-lg hover:shadow-sky-400/25"
                    }`}
                  >
                    Add Client
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div
          className={`flex flex-col md:flex-row gap-4 justify-between rounded-xl p-4 border ${
            isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white/60 border-sky-300"
          }`}
        >
          <div className={`flex items-center gap-2 ${isDarkMode ? "text-slate-300" : "text-sky-700"}`}>
            Show
            <select
              value={entries}
              onChange={(e) => setEntries(+e.target.value)}
              className={`rounded px-2 py-1 outline-none ${
                isDarkMode ? "bg-slate-900 border border-slate-700 text-white" : "bg-white border border-sky-300 text-sky-700"
              }`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            entries
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 ${isDarkMode ? "text-slate-500" : "text-sky-500"}`} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className={`pl-9 py-2 rounded-lg outline-none ${
                  isDarkMode ? "bg-slate-900 border border-slate-700 text-white" : "bg-white border border-sky-300 text-sky-700"
                }`}
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`rounded-lg px-3 py-2 outline-none ${
                isDarkMode ? "bg-slate-900 border border-slate-700 text-white" : "bg-white border border-sky-300 text-sky-700"
              }`}
            >
              <option value="ALL">All Status</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Converted</option>
              <option>Lost</option>
            </select>

            <button
              className={`p-2 rounded-lg border ${
                isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-sky-300 text-sky-700"
              }`}
            >
              <Download className="w-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          className={`overflow-x-auto rounded-xl border ${
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-sky-300"
          }`}
        >
          <table className="min-w-full text-sm">
            <thead className={`${isDarkMode ? "bg-slate-900" : "bg-sky-100"}`}>
              <tr>
                {["Name","Email","Phone","Source","Interest","Status","Date","Actions"].map((h) => (
                  <th key={h} className={`px-4 py-3 text-left text-xs ${isDarkMode ? "text-slate-400" : "text-sky-700"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? "divide-slate-700" : "divide-sky-200"}`}>
              <AnimatePresence>
                {leads.slice((page - 1) * entries, page * entries).map((lead) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`group hover:${isDarkMode ? "bg-slate-700/30" : "bg-sky-100/50"}`}
                  >
                    <td className={`px-4 py-3 ${isDarkMode ? "text-white" : "text-sky-700"}`}>{lead.name}</td>
                    <td className={`px-4 py-3 ${isDarkMode ? "text-blue-400" : "text-sky-600"}`}>{lead.email}</td>
                    <td className={`px-4 py-3 ${isDarkMode ? "text-purple-400" : "text-sky-500"}`}>{lead.phone}</td>
                    <td className="px-4 py-3">{getSourceIcon(lead.source)}</td>
                    <td className={`px-4 py-3 ${isDarkMode ? "text-slate-300" : "text-sky-600"}`}>{lead.interestedIn}</td>
                   <td className="px-4 py-3">
  <select
    value={lead.status}
    onChange={(e) =>
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id ? { ...l, status: e.target.value } : l
        )
      )
    }
    className={`rounded-full px-2 py-1 text-xs border outline-none transition-all ${
      isDarkMode
        ? "bg-slate-900 border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        : "bg-white border border-sky-300 text-sky-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
    }`}
  >
    <option value="New">New</option>
    <option value="Contacted">Contacted</option>
    <option value="Converted">Converted</option>
    <option value="Lost">Lost</option>
  </select>
</td>
                    <td className={`px-4 py-3 ${isDarkMode ? "text-slate-300" : "text-sky-600"}`}>{new Date(lead.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => handleEdit(lead)}>
                          <Edit className={`w-4 ${isDarkMode ? "text-slate-300" : "text-sky-700"}`} />
                        </button>
                        <button onClick={() => handleDelete(lead.id)}>
                          <Trash2 className={`w-4 ${isDarkMode ? "text-rose-400" : "text-red-500"}`} />
                        </button>
                        <button onClick={() => handleCopy(lead)}>
                          <Copy className={`w-4 ${isDarkMode ? "text-slate-300" : "text-sky-700"}`} />
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
        </div>

        {/* Pagination */}
        <div className={`flex justify-between items-center text-sm ${isDarkMode ? "text-slate-400" : "text-sky-700"}`}>
          <span>
            Showing {(page - 1) * entries + 1} to {Math.min(page * entries, leads.length)} of {leads.length}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft /></button>
            {[...Array(Math.ceil(leads.length / entries))].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? (isDarkMode ? "text-blue-400" : "text-sky-700") : ""}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(Math.ceil(leads.length / entries), p + 1))}><ChevronRight /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageLeads;
