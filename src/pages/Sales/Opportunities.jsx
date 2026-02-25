import React, { useMemo, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRightLeft,
  FolderKanban,
  Activity,
  Star,
  UserMinus,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

/* =======================
   STAGE COLORS
======================= */
const stageColors = {
  Prospecting: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Negotiation: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Proposal Sent": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Lost: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const emptyForm = {
  opportunityName: "",
  client: "",
  expectedValue: "",
  probability: "",
  closeDate: "",
  stage: "Prospecting",
};

const ManageOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  /* =======================
     HANDLERS
  ======================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === editId ? { ...o, ...form } : o))
      );
    } else {
      setOpportunities([{ id: Date.now(), ...form }, ...opportunities]);
    }

    setForm(emptyForm);
    setEditId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (opp) => {
    setForm(opp);
    setEditId(opp.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) =>
    setOpportunities((prev) => prev.filter((o) => o.id !== id));

  const handleStageChange = (id, stage) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, stage } : o))
    );
  };

  const convertToProject = (opp) => {
    setProjects((prev) => [
      {
        projectId: Date.now(),
        name: opp.opportunityName,
        client: opp.client,
        value: opp.expectedValue,
      },
      ...prev,
    ]);

    setOpportunities((prev) => prev.filter((o) => o.id !== opp.id));
  };

  /* =======================
     STATS
  ======================= */
  const stats = useMemo(() => {
    const total = opportunities.length;
    const active = opportunities.filter(
      (o) => !["Won", "Lost"].includes(o.stage)
    ).length;
    const closed = opportunities.filter((o) => o.stage === "Lost").length;
    const converted = projects.length;

    return { total, active, closed, converted };
  }, [opportunities, projects]);

  /* =======================
     FILTER + PAGINATION
  ======================= */
  const filtered = useMemo(() => {
    return opportunities.filter((o) =>
      Object.values(o).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [opportunities, search]);

  const totalPages = Math.ceil(filtered.length / entries);
  const paginated = filtered.slice(
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Opportunity Management
          </h1>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold"
          >
            <Plus className="inline mr-2" />
            Add Opportunity
          </button>
        </div>

        {/* STATS (SAME AS LEADS UI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Opportunities", value: stats.total, icon: Users },
            { label: "Active", value: stats.active, icon: Activity },
            { label: "Converted to Projects", value: stats.converted, icon: Star },
            { label: "Closed", value: stats.closed, icon: UserMinus },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex justify-between items-center"
            >
              <div>
                <p className="text-slate-400 text-sm">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
              <s.icon className="w-8 h-8 text-emerald-400" />
            </div>
          ))}
        </div>

        {/* FORM (SAME PAGE) */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                ["opportunityName", "Opportunity Name"],
                ["client", "Client Name"],
                ["expectedValue", "Expected Value"],
                ["probability", "Probability %"],
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
                {Object.keys(stageColors).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <button className="md:col-span-3 bg-emerald-500 py-3 rounded-xl text-white font-bold">
                Save Opportunity
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* CONTROLS */}
        <div className="flex justify-between bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
          <div className="text-slate-300">
            Show{" "}
            <select
              value={entries}
              onChange={(e) => setEntries(+e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 ml-2"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities..."
              className="bg-slate-900 border border-slate-700 rounded-lg pl-9 py-2 text-white"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-slate-800/60 border border-slate-700 rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/70">
              <tr>
                {[
                  "Opportunity",
                  "Client",
                  "Value",
                  "Probability",
                  "Close Date",
                  "Stage",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              <AnimatePresence>
                {paginated.map((opp) => (
                  <motion.tr
                    key={opp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-slate-700/30"
                  >
                    <td className="px-4 py-3 text-white">{opp.opportunityName}</td>
                    <td className="px-4 py-3 text-slate-300">{opp.client}</td>
                    <td className="px-4 py-3 text-emerald-400">₹{opp.expectedValue}</td>
                    <td className="px-4 py-3 text-blue-400">{opp.probability}%</td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(opp.closeDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={opp.stage}
                        onChange={(e) =>
                          handleStageChange(opp.id, e.target.value)
                        }
                        className={twMerge(
                          "px-2 py-1 text-xs rounded-full border bg-slate-900",
                          stageColors[opp.stage]
                        )}
                      >
                        {Object.keys(stageColors).map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => handleEdit(opp)}>
                          <Edit className="w-4 text-slate-300" />
                        </button>
                        <button onClick={() => handleDelete(opp.id)}>
                          <Trash2 className="w-4 text-rose-400" />
                        </button>
                        <button
                          onClick={() => convertToProject(opp)}
                          title="Convert to Project"
                        >
                          <FolderKanban className="w-4 text-emerald-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between text-slate-400 text-sm">
          <span>
            Showing {(page - 1) * entries + 1} to{" "}
            {Math.min(page * entries, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "text-emerald-400" : ""}
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

export default ManageOpportunities;