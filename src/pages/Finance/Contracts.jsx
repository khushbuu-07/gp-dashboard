import React, { useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Activity,
  CheckCircle,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =======================
   STATUS COLORS (Unified)
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
  const [page, setPage] = useState(1);
  const entries = 10;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setContracts([{ id: Date.now(), ...form }, ...contracts]);
    setForm(emptyForm);
    setOpen(false);
  };

  const stats = useMemo(() => {
    return {
      total: contracts.length,
      active: contracts.filter((c) => c.status === "Active").length,
      completed: contracts.filter((c) => c.status === "Completed").length,
      totalValue: contracts.reduce((s, c) => s + Number(c.value || 0), 0),
    };
  }, [contracts]);

  const totalPages = Math.ceil(contracts.length / entries);
  const paginated = contracts.slice(
    (page - 1) * entries,
    page * entries
  );

  return (
    <div className="space-y-8 pt-6 animate-fade-in text-text-primary pb-10">

      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-dark-600 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-1">
            Contract Management
          </h1>
          <p className="text-text-muted text-sm">
            Centralized control of all active and completed contracts
          </p>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> New Contract
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Contracts", value: stats.total, icon: FileText },
          { label: "Active", value: stats.active, icon: Activity },
          { label: "Completed", value: stats.completed, icon: CheckCircle },
          { label: "Total Value", value: `₹${stats.totalValue}`, icon: IndianRupee },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-dark-800 p-6 rounded-3xl border border-dark-600/50 shadow-xl"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  {s.label}
                </p>
                <h3 className="text-3xl font-black mt-1">{s.value}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <s.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FORM */}
      <AnimatePresence>
        {open && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-800 p-6 rounded-3xl border border-dark-600/50 grid md:grid-cols-3 gap-4"
          >
            {[
              ["contractId", "Contract ID"],
              ["client", "Client Name"],
              ["value", "Contract Value"],
              ["paymentTerms", "Payment Terms"],
            ].map(([name, label]) => (
              <input
                key={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={label}
                className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted"
              />
            ))}

            <input type="date" name="startDate" onChange={handleChange} className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary" />
            <input type="date" name="endDate" onChange={handleChange} className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary" />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary"
            >
              {Object.keys(statusColors).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <button className="md:col-span-3 bg-primary py-3 rounded-xl text-white font-bold">
              Save Contract
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* TABLE */}
      <div className="bg-dark-800 rounded-3xl border border-dark-600/50 overflow-x-auto shadow-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-dark-900/70">
            <tr>
              {["Contract ID","Client","Value","Terms","Duration","Status","Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs uppercase text-text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-dark-700">
            {paginated.map((c) => (
              <tr key={c.id} className="hover:bg-dark-700/40 transition">
                <td className="px-4 py-3">{c.contractId}</td>
                <td className="px-4 py-3 text-text-muted">{c.client}</td>
                <td className="px-4 py-3 text-emerald-400 font-semibold">₹{c.value}</td>
                <td className="px-4 py-3 text-text-muted">{c.paymentTerms}</td>
                <td className="px-4 py-3 text-text-muted">{c.startDate} – {c.endDate}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Edit className="w-4 text-text-muted hover:text-primary cursor-pointer" />
                  <Trash2 className="w-4 text-rose-400 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contracts.length === 0 && (
          <div className="py-14 text-center text-text-muted">
            No contracts found
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between text-text-muted text-sm">
        <span>
          Showing {(page - 1) * entries + 1} to {Math.min(page * entries, contracts.length)} of {contracts.length}
        </span>
        <div className="flex gap-2">
          <ChevronLeft />
          <ChevronRight />
        </div>
      </div>
    </div>
  );
};

export default ManageContracts;