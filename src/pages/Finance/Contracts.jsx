import React, { useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  FileText,
  Activity,
  CheckCircle,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =======================
   STATUS COLORS
======================= */
const statusColors = {
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const emptyForm = {
  contractId: "",
  client: "",
  value: "",
  paymentTerms: "",
  startDate: "",
  endDate: "",
  status: "Active",
};

const ManageContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);

  /* =======================
     HANDLERS
  ======================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setContracts((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...form } : c))
      );
    } else {
      setContracts([{ id: Date.now(), ...form }, ...contracts]);
    }

    setForm(emptyForm);
    setEditId(null);
    setOpen(false);
  };

  const handleEdit = (contract) => {
    setForm(contract);
    setEditId(contract.id);
    setOpen(true);
  };

  const handleDelete = (id) =>
    setContracts((prev) => prev.filter((c) => c.id !== id));

  /* =======================
     STATS
  ======================= */
  const stats = useMemo(() => {
    const total = contracts.length;
    const active = contracts.filter((c) => c.status === "Active").length;
    const completed = contracts.filter((c) => c.status === "Completed").length;
    const totalValue = contracts.reduce(
      (sum, c) => sum + Number(c.value || 0),
      0
    );

    return { total, active, completed, totalValue };
  }, [contracts]);

  /* =======================
     PAGINATION
  ======================= */
  const totalPages = Math.ceil(contracts.length / entries);
  const paginated = contracts.slice(
    (page - 1) * entries,
    page * entries
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
            Contracts
          </h1>

          <button
            onClick={() => setOpen(!open)}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-cyan-500 rounded-xl text-white font-semibold"
          >
            <Plus className="inline mr-2" />
            Add Contract
          </button>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Contracts", value: stats.total, icon: FileText },
            { label: "Active", value: stats.active, icon: Activity },
            { label: "Completed", value: stats.completed, icon: CheckCircle },
            {
              label: "Total Value",
              value: `₹${stats.totalValue}`,
              icon: IndianRupee,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex justify-between items-center"
            >
              <div>
                <p className="text-slate-400 text-sm">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
              <s.icon className="w-8 h-8 text-amber-400" />
            </div>
          ))}
        </div>

        {/* FORM (Same Page) */}
        <AnimatePresence>
          {open && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                ["contractId", "Contract ID"],
                ["client", "Client Name"],
                ["value", "Total Value"],
                ["paymentTerms", "Payment Terms"],
              ].map(([name, label]) => (
                <input
                  key={name}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={label}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />
              ))}

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />

              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              >
                {Object.keys(statusColors).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <button className="md:col-span-3 bg-amber-500 py-3 rounded-xl text-white font-bold">
                Save Contract
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* TABLE */}
        <div className="overflow-x-auto bg-slate-800/60 border border-slate-700 rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/70">
              <tr>
                {[
                  "Contract ID",
                  "Client",
                  "Value",
                  "Payment Terms",
                  "Duration",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs uppercase text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              <AnimatePresence>
                {paginated.map((c) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-slate-700/30"
                  >
                    <td className="px-4 py-3 text-white">{c.contractId}</td>
                    <td className="px-4 py-3 text-slate-300">{c.client}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">
                      ₹{c.value}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {c.paymentTerms}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {c.startDate} – {c.endDate}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${
                          statusColors[c.status]
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => handleEdit(c)}>
                          <Edit className="w-4 text-slate-300" />
                        </button>
                        <button onClick={() => handleDelete(c.id)}>
                          <Trash2 className="w-4 text-rose-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {contracts.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              No contracts found
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between text-slate-400 text-sm">
          <span>
            Showing {(page - 1) * entries + 1} to{" "}
            {Math.min(page * entries, contracts.length)} of{" "}
            {contracts.length}
          </span>

          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "text-amber-400" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageContracts;