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
   STATUS COLORS
======================= */
const statusColors = {
  Paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
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
  const [entries, setEntries] = useState(10);

  /* =======================
     HANDLERS
  ======================= */
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

  /* =======================
     STATS
  ======================= */
  const stats = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter((i) => i.status === "Paid").length;
    const pending = invoices.filter((i) => i.status === "Pending").length;
    const overdue = invoices.filter((i) => i.status === "Overdue").length;

    return { total, paid, pending, overdue };
  }, [invoices]);

  /* =======================
     PAGINATION
  ======================= */
  const totalPages = Math.ceil(invoices.length / entries);
  const paginated = invoices.slice(
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Invoices
          </h1>

          <button
            onClick={() => setOpen(!open)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl text-white font-semibold"
          >
            <Plus className="inline mr-2" />
            Generate Invoice
          </button>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Invoices", value: stats.total, icon: FileText },
            { label: "Paid", value: stats.paid, icon: CheckCircle },
            { label: "Pending", value: stats.pending, icon: Clock },
            { label: "Overdue", value: stats.overdue, icon: AlertTriangle },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex justify-between items-center"
            >
              <div>
                <p className="text-slate-400 text-sm">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
              <s.icon className="w-8 h-8 text-indigo-400" />
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
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />
              ))}

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
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

              <button className="md:col-span-3 bg-indigo-500 py-3 rounded-xl text-white font-bold">
                Save Invoice
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
                  "Invoice No",
                  "Client",
                  "Amount",
                  "Due Date",
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
                {paginated.map((inv) => (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-slate-700/30"
                  >
                    <td className="px-4 py-3 text-white">{inv.invoiceNo}</td>
                    <td className="px-4 py-3 text-slate-300">{inv.client}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">
                      ₹{inv.amount}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${
                          statusColors[inv.status]
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        {/* DOWNLOAD PDF (UI ONLY) */}
                        <button title="Download PDF">
                          <Download className="w-4 text-slate-300 hover:text-indigo-400" />
                        </button>

                        {/* MARK AS PAID */}
                        {inv.status !== "Paid" && (
                          <button
                            onClick={() => markAsPaid(inv.id)}
                            title="Mark as Paid"
                          >
                            <CheckCircle className="w-4 text-emerald-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {invoices.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              No invoices found
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between text-slate-400 text-sm">
          <span>
            Showing {(page - 1) * entries + 1} to{" "}
            {Math.min(page * entries, invoices.length)} of{" "}
            {invoices.length}
          </span>

          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "text-indigo-400" : ""}
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

export default ManageInvoices;