import React, { useMemo, useState } from "react";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Activity,
  IndianRupee,
  CalendarClock,
  Repeat,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =======================
   STATUS COLORS
======================= */
const statusColors = {
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const emptyForm = {
  client: "",
  amount: "",
  nextDue: "",
  mode: "Auto",
  status: "Active",
};

const ManageRecurringPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState(emptyForm);

  /* =======================
     HANDLERS
  ======================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    setPayouts([
      {
        id: Date.now(),
        ...form,
        history: [
          {
            date: new Date().toISOString(),
            amount: form.amount,
            status: "Paid",
          },
        ],
      },
      ...payouts,
    ]);

    setForm(emptyForm);
    setOpen(false);
  };

  /* =======================
     STATS
  ======================= */
  const stats = useMemo(() => {
    const total = payouts.length;
    const active = payouts.filter((p) => p.status === "Active").length;
    const monthlyRevenue = payouts.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
    const dueThisMonth = payouts.filter((p) => {
      const due = new Date(p.nextDue);
      const now = new Date();
      return (
        due.getMonth() === now.getMonth() &&
        due.getFullYear() === now.getFullYear()
      );
    }).length;

    return { total, active, monthlyRevenue, dueThisMonth };
  }, [payouts]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Recurring Payouts
          </h1>

          <button
            onClick={() => setOpen(!open)}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white font-semibold"
          >
            <Plus className="inline mr-2" />
            Add Recurring Payout
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Subscriptions", value: stats.total, icon: Repeat },
            { label: "Active", value: stats.active, icon: Activity },
            {
              label: "Monthly Revenue",
              value: `₹${stats.monthlyRevenue}`,
              icon: IndianRupee,
            },
            {
              label: "Due This Month",
              value: stats.dueThisMonth,
              icon: CalendarClock,
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
              <s.icon className="w-8 h-8 text-teal-400" />
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
                placeholder="Monthly Amount"
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />

              <input
                type="date"
                name="nextDue"
                value={form.nextDue}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />

              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              >
                <option>Auto</option>
                <option>Manual</option>
              </select>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              >
                <option>Active</option>
                <option>Paused</option>
              </select>

              <button className="md:col-span-3 bg-teal-500 py-3 rounded-xl text-white font-bold">
                Save Recurring Payout
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
                  "Monthly Amount",
                  "Next Due",
                  "Mode",
                  "Status",
                  "History",
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
              {payouts.map((p) => (
                <React.Fragment key={p.id}>
                  <tr className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-white">{p.client}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">
                      ₹{p.amount}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(p.nextDue).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.mode}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${
                          statusColors[p.status]
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setExpanded(expanded === p.id ? null : p.id)
                        }
                      >
                        {expanded === p.id ? (
                          <ChevronUp className="w-4" />
                        ) : (
                          <ChevronDown className="w-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* PAYMENT HISTORY */}
                  <AnimatePresence>
                    {expanded === p.id && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={6} className="px-6 py-4 bg-slate-900/50">
                          <h4 className="text-slate-300 text-sm mb-2">
                            Payment History
                          </h4>
                          {p.history.map((h, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-sm text-slate-400 mb-1"
                            >
                              <span>
                                {new Date(h.date).toLocaleDateString()}
                              </span>
                              <span>₹{h.amount}</span>
                              <span className="text-emerald-400">
                                {h.status}
                              </span>
                            </div>
                          ))}
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {payouts.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              No recurring payouts found
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ManageRecurringPayouts;