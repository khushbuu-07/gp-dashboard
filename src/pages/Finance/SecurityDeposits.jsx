import React, { useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Wallet,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =======================
   REFUND STATUS COLORS
======================= */
const statusColors = {
  Held: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Refunded: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Partial: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const emptyForm = {
  client: "",
  amount: "",
  heldSince: "",
  refundStatus: "Held",
};

const ManageSecurityDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  /* =======================
     HANDLERS
  ======================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setDeposits((prev) =>
        prev.map((d) => (d.id === editId ? { ...d, ...form } : d))
      );
    } else {
      setDeposits([{ id: Date.now(), ...form }, ...deposits]);
    }

    setForm(emptyForm);
    setEditId(null);
    setOpen(false);
  };

  const handleEdit = (deposit) => {
    setForm(deposit);
    setEditId(deposit.id);
    setOpen(true);
  };

  const handleDelete = (id) =>
    setDeposits((prev) => prev.filter((d) => d.id !== id));

  const markRefunded = (id) => {
    setDeposits((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, refundStatus: "Refunded" } : d
      )
    );
  };

  /* =======================
     STATS
  ======================= */
  const stats = useMemo(() => {
    const total = deposits.length;
    const refunded = deposits.filter((d) => d.refundStatus === "Refunded").length;
    const active = deposits.filter((d) => d.refundStatus !== "Refunded").length;
    const totalAmount = deposits.reduce(
      (sum, d) => sum + Number(d.amount || 0),
      0
    );

    return { total, refunded, active, totalAmount };
  }, [deposits]);

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
            Security Deposits
          </h1>

          <button
            onClick={() => setOpen(!open)}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-cyan-500 rounded-xl text-white font-semibold"
          >
            <Plus className="inline mr-2" />
            Add Deposit
          </button>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Deposits", value: stats.total, icon: Wallet },
            { label: "Active Deposits", value: stats.active, icon: Calendar },
            { label: "Refunded", value: stats.refunded, icon: CheckCircle },
            {
              label: "Total Amount Held",
              value: `₹${stats.totalAmount}`,
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

        {/* FORM */}
        <AnimatePresence>
          {open && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <input
                name="client"
                value={form.client}
                onChange={handleChange}
                placeholder="Client Name"
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />

              <input
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Deposit Amount"
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />

              <input
                type="date"
                name="heldSince"
                value={form.heldSince}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />

              <select
                name="refundStatus"
                value={form.refundStatus}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              >
                <option>Held</option>
                <option>Partial</option>
                <option>Refunded</option>
              </select>

              <button className="md:col-span-3 bg-amber-500 py-3 rounded-xl text-white font-bold">
                Save Deposit
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
                  "Client",
                  "Deposit Amount",
                  "Held Since",
                  "Refund Status",
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
                {deposits.map((d) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-slate-700/30"
                  >
                    <td className="px-4 py-3 text-white">{d.client}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">
                      ₹{d.amount}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(d.heldSince).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${
                          statusColors[d.refundStatus]
                        }`}
                      >
                        {d.refundStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        {d.refundStatus !== "Refunded" && (
                          <button
                            onClick={() => markRefunded(d.id)}
                            title="Mark as Refunded"
                          >
                            <CheckCircle className="w-4 text-emerald-400" />
                          </button>
                        )}
                        <button onClick={() => handleEdit(d)}>
                          <Edit className="w-4 text-slate-300" />
                        </button>
                        <button onClick={() => handleDelete(d.id)}>
                          <Trash2 className="w-4 text-rose-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {deposits.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              No security deposits found
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ManageSecurityDeposits;