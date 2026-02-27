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
  Partial: "bg-primary/10 text-blue-400 border-primary/20",
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

  const stats = useMemo(() => {
    const total = deposits.length;
    const refunded = deposits.filter(
      (d) => d.refundStatus === "Refunded"
    ).length;
    const active = deposits.filter(
      (d) => d.refundStatus !== "Refunded"
    ).length;
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
      className="min-h-screen bg-dark-900 p-6 text-text-primary"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-dark-600 pb-6">
          <h1 className="text-4xl font-extrabold">
            Security Deposits
          </h1>

          <button
            onClick={() => setOpen(!open)}
            className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl text-white font-semibold transition"
          >
            <Plus className="inline mr-2" />
            Add Deposit
          </button>
        </div>

        {/* STATS */}
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
              <input
                name="client"
                value={form.client}
                onChange={handleChange}
                placeholder="Client Name"
                className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted"
              />

              <input
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Deposit Amount"
                className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary"
              />

              <input
                type="date"
                name="heldSince"
                value={form.heldSince}
                onChange={handleChange}
                className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary"
              />

              <select
                name="refundStatus"
                value={form.refundStatus}
                onChange={handleChange}
                className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary"
              >
                <option>Held</option>
                <option>Partial</option>
                <option>Refunded</option>
              </select>

              <button className="md:col-span-3 bg-primary py-3 rounded-xl text-white font-bold">
                Save Deposit
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* TABLE */}
        <div className="overflow-x-auto bg-dark-800/60 border border-dark-600/50 rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-dark-900/70">
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
                    className="px-4 py-3 text-left text-xs uppercase text-text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-700">
              <AnimatePresence>
                {deposits.map((d) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-dark-700/40 transition"
                  >
                    <td className="px-4 py-3">{d.client}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">
                      ₹{d.amount}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(d.heldSince).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${statusColors[d.refundStatus]}`}
                      >
                        {d.refundStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        {d.refundStatus !== "Refunded" && (
                          <CheckCircle
                            onClick={() => markRefunded(d.id)}
                            className="w-4 text-emerald-400 cursor-pointer"
                          />
                        )}
                        <Edit className="w-4 text-text-muted cursor-pointer" />
                        <Trash2 className="w-4 text-rose-400 cursor-pointer" />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {deposits.length === 0 && (
            <div className="py-12 text-center text-text-muted">
              No security deposits found
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ManageSecurityDeposits;