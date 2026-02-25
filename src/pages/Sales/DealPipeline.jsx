import React, { useMemo, useState } from "react";
import {
  Plus,
  X,
  Trash2,
  FolderKanban,
  Activity,
  Star,
  UserMinus,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =======================
   PIPELINE STAGES
======================= */
const stages = [
  "New",
  "Proposal Sent",
  "Negotiation",
  "Final Discussion",
  "Won",
  "Lost",
];

const emptyForm = {
  dealName: "",
  client: "",
  value: "",
  closeDate: "",
  stage: "New",
};

const ManageDealPipeline = () => {
  const [deals, setDeals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [dragged, setDragged] = useState(null);

  /* =======================
     STATS
  ======================= */
  const stats = useMemo(() => {
    const total = deals.length;
    const active = deals.filter(
      (d) => !["Won", "Lost"].includes(d.stage)
    ).length;
    const won = deals.filter((d) => d.stage === "Won").length;
    const lost = deals.filter((d) => d.stage === "Lost").length;

    return { total, active, won, lost };
  }, [deals]);

  /* =======================
     HANDLERS
  ======================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setDeals([{ id: Date.now(), ...form }, ...deals]);
    setForm(emptyForm);
    setOpen(false);
  };

  const handleDelete = (id) =>
    setDeals((prev) => prev.filter((d) => d.id !== id));

  const handleDrop = (stage) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dragged ? { ...d, stage } : d
      )
    );
    setDragged(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Deal Pipeline
          </h1>

          <button
            onClick={() => setOpen(!open)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-semibold"
          >
            <Plus className="inline mr-2" />
            Add Deal
          </button>
        </div>

        {/* STATS (Same UI Feel) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Deals", value: stats.total, icon: Users },
            { label: "Active Deals", value: stats.active, icon: Activity },
            { label: "Won Deals", value: stats.won, icon: Star },
            { label: "Lost Deals", value: stats.lost, icon: UserMinus },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex justify-between items-center"
            >
              <div>
                <p className="text-slate-400 text-sm">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
              <s.icon className="w-8 h-8 text-purple-400" />
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
                ["dealName", "Deal Name"],
                ["client", "Client Name"],
                ["value", "Deal Value"],
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
                name="closeDate"
                value={form.closeDate}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />

              <select
                name="stage"
                value={form.stage}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              >
                {stages.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <button className="md:col-span-3 bg-purple-500 py-3 rounded-xl text-white font-bold">
                Save Deal
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* KANBAN BOARD */}
    {/* DEAL PIPELINE TABLE */}
<div className="overflow-x-auto bg-slate-800/60 border border-slate-700 rounded-2xl">
  <table className="min-w-full text-sm">
    <thead className="bg-slate-900/70">
      <tr>
        {[
          "Deal",
          "Client",
          "Value",
          "Close Date",
          "Stage",
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
        {deals.map((deal) => (
          <motion.tr
            key={deal.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="group hover:bg-slate-700/30"
          >
            {/* DEAL NAME */}
            <td className="px-4 py-3 text-white font-medium">
              {deal.dealName}
            </td>

            {/* CLIENT */}
            <td className="px-4 py-3 text-slate-300">
              {deal.client}
            </td>

            {/* VALUE */}
            <td className="px-4 py-3 text-emerald-400 font-semibold">
              ₹{deal.value}
            </td>

            {/* CLOSE DATE */}
            <td className="px-4 py-3 text-slate-300">
              {new Date(deal.closeDate).toLocaleDateString()}
            </td>

            {/* STAGE */}
            <td className="px-4 py-3">
              <select
                value={deal.stage}
                onChange={(e) =>
                  setDeals((prev) =>
                    prev.map((d) =>
                      d.id === deal.id
                        ? { ...d, stage: e.target.value }
                        : d
                    )
                  )
                }
                className="bg-slate-900 border border-slate-700 rounded-full px-3 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {[
                  "New",
                  "Proposal Sent",
                  "Negotiation",
                  "Final Discussion",
                  "Won",
                  "Lost",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </td>

            {/* ACTIONS */}
            <td className="px-4 py-3">
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                {/* MARK WON */}
                <button
                  onClick={() =>
                    setDeals((prev) =>
                      prev.map((d) =>
                        d.id === deal.id
                          ? { ...d, stage: "Won" }
                          : d
                      )
                    )
                  }
                  title="Mark as Won"
                >
                  <Star className="w-4 text-amber-400" />
                </button>

                {/* MARK LOST */}
                <button
                  onClick={() =>
                    setDeals((prev) =>
                      prev.map((d) =>
                        d.id === deal.id
                          ? { ...d, stage: "Lost" }
                          : d
                      )
                    )
                  }
                  title="Mark as Lost"
                >
                  <UserMinus className="w-4 text-rose-400" />
                </button>

                {/* DELETE */}
                <button
                  onClick={() =>
                    setDeals((prev) =>
                      prev.filter((d) => d.id !== deal.id)
                    )
                  }
                  title="Delete Deal"
                >
                  <Trash2 className="w-4 text-slate-400 hover:text-rose-400" />
                </button>
              </div>
            </td>
          </motion.tr>
        ))}
      </AnimatePresence>
    </tbody>
  </table>

  {deals.length === 0 && (
    <div className="py-12 text-center text-slate-400">
      No deals found
    </div>
  )}
</div>
      </div>
    </motion.div>
  );
};

export default ManageDealPipeline;