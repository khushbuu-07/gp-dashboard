import React, { useMemo } from "react";
import {
  Trophy,
  UserMinus,
  IndianRupee,
  Percent,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/*
  Expected input:
  props.closedDeals = [
    {
      id,
      dealName,
      client,
      value,
      closeDate,
      stage: "Won" | "Lost"
    }
  ]
*/

const ManageClosedDeals = ({ closedDeals = [] }) => {
  /* =======================
     STATS CALCULATION
  ======================= */
  const stats = useMemo(() => {
    const wonDeals = closedDeals.filter((d) => d.stage === "Won");
    const lostDeals = closedDeals.filter((d) => d.stage === "Lost");

    const revenue = wonDeals.reduce(
      (sum, d) => sum + Number(d.value || 0),
      0
    );

    const winRate =
      closedDeals.length === 0
        ? 0
        : Math.round((wonDeals.length / closedDeals.length) * 100);

    return {
      won: wonDeals.length,
      lost: lostDeals.length,
      revenue,
      winRate,
    };
  }, [closedDeals]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Closed Deals
        </h1>

        {/* STATS SECTION (Same UI Feel) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Won Deals",
              value: stats.won,
              icon: Trophy,
              color: "text-emerald-400",
            },
            {
              label: "Lost Deals",
              value: stats.lost,
              icon: UserMinus,
              color: "text-rose-400",
            },
            {
              label: "Revenue",
              value: `₹${stats.revenue}`,
              icon: IndianRupee,
              color: "text-amber-400",
            },
            {
              label: "Win Rate %",
              value: `${stats.winRate}%`,
              icon: Percent,
              color: "text-blue-400",
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
              <s.icon className={`w-8 h-8 ${s.color}`} />
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-slate-800/60 border border-slate-700 rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/70">
              <tr>
                {[
                  "Deal",
                  "Client",
                  "Value",
                  "Closed Date",
                  "Result",
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
                {closedDeals.map((deal) => (
                  <motion.tr
                    key={deal.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-700/30"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {deal.dealName}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {deal.client}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-400">
                      ₹{deal.value}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(deal.closeDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          deal.stage === "Won"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-rose-500/20 text-rose-400"
                        }`}
                      >
                        {deal.stage}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {closedDeals.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              No closed deals found
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ManageClosedDeals;