import React, { useMemo, useState } from "react";
import {
  Plus,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =======================
   STATUS COLORS (Unified)
======================= */
const statusColors = {
  Paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Overdue: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const emptyForm = {
  invoiceNo: "",
  client: "",
  amount: "",
  dueDate: "",
  status: "Pending",
};

const ManageInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const entries = 10;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setInvoices([{ id: Date.now(), ...form }, ...invoices]);
    setForm(emptyForm);
    setOpen(false);
  };

  const markAsPaid = (id) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "Paid" } : inv
      )
    );
  };

  const stats = useMemo(() => {
    return {
      total: invoices.length,
      paid: invoices.filter((i) => i.status === "Paid").length,
      pending: invoices.filter((i) => i.status === "Pending").length,
      overdue: invoices.filter((i) => i.status === "Overdue").length,
    };
  }, [invoices]);

  const totalPages = Math.ceil(invoices.length / entries);
  const paginated = invoices.slice(
    (page - 1) * entries,
    page * entries
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-dark-900 p-6 text-text-primary"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-dark-600 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Invoices
          </h1>

          <button
            onClick={() => setOpen(!open)}
            className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl text-white font-semibold transition"
          >
            <Plus className="inline mr-2" />
            Generate Invoice
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Invoices", value: stats.total, icon: FileText },
            { label: "Paid", value: stats.paid, icon: CheckCircle },
            { label: "Pending", value: stats.pending, icon: Clock },
            { label: "Overdue", value: stats.overdue, icon: AlertTriangle },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-dark-800/60 border border-dark-600/50 rounded-2xl p-6 flex justify-between items-center"
            >
              <div>
                <p className="text-text-muted text-sm">{s.label}</p>
                <p className="text-3xl font-black">{s.value}</p>
              </div>
              <s.icon className="w-8 h-8 text-primary" />
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
              className="bg-dark-800/60 border border-dark-600/50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                ["invoiceNo", "Invoice Number"],
                ["client", "Client Name"],
                ["amount", "Invoice Amount"],
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

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary"
              />

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
                Save Invoice
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* TABLE */}
        <div className="overflow-x-auto bg-dark-800/60 border border-dark-600/50 rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-dark-900/70">
              <tr>
                {["Invoice No","Client","Amount","Due Date","Status","Actions"].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs uppercase text-text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-700">
              <AnimatePresence>
                {paginated.map((inv) => (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-dark-700/40 transition"
                  >
                    <td className="px-4 py-3">{inv.invoiceNo}</td>
                    <td className="px-4 py-3 text-text-secondary">{inv.client}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">
                      ₹{inv.amount}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <Download className="w-4 text-text-muted hover:text-primary cursor-pointer" />
                        {inv.status !== "Paid" && (
                          <CheckCircle
                            onClick={() => markAsPaid(inv.id)}
                            className="w-4 text-emerald-400 cursor-pointer"
                          />
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {invoices.length === 0 && (
            <div className="py-12 text-center text-text-muted">
              No invoices found
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between text-text-muted text-sm">
          <span>
            Showing {(page - 1) * entries + 1} to{" "}
            {Math.min(page * entries, invoices.length)} of {invoices.length}
          </span>

          <div className="flex gap-2">
            <ChevronLeft />
            <ChevronRight />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ManageInvoices;