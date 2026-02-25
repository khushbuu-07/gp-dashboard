import React, { useMemo } from "react";
import {
  IndianRupee,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* =======================
   SAMPLE DATA (Replace with API)
======================= */
const monthlyRevenue = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 150000 },
  { month: "Mar", revenue: 180000 },
  { month: "Apr", revenue: 140000 },
  { month: "May", revenue: 220000 },
  { month: "Jun", revenue: 260000 },
];

const projectRevenue = [
  { name: "Hotel Website", value: 300000 },
  { name: "CRM System", value: 220000 },
  { name: "E-commerce", value: 180000 },
  { name: "Mobile App", value: 140000 },
];

const clientRevenue = [
  { name: "Client A", value: 250000 },
  { name: "Client B", value: 190000 },
  { name: "Client C", value: 160000 },
];

const outstandingData = [
  { name: "Received", value: 720000 },
  { name: "Outstanding", value: 280000 },
];

const COLORS = ["#22c55e", "#f97316"];

const RevenueReports = () => {
  /* =======================
     SUMMARY STATS
  ======================= */
  const stats = useMemo(() => {
    const totalRevenue = monthlyRevenue.reduce(
      (sum, m) => sum + m.revenue,
      0
    );
    const outstanding = outstandingData.find(
      (d) => d.name === "Outstanding"
    ).value;

    return {
      totalRevenue,
      outstanding,
      clients: clientRevenue.length,
      projects: projectRevenue.length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Revenue Reports
        </h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Revenue",
              value: `₹${stats.totalRevenue}`,
              icon: IndianRupee,
            },
            {
              label: "Outstanding Amount",
              value: `₹${stats.outstanding}`,
              icon: AlertTriangle,
            },
            {
              label: "Active Clients",
              value: stats.clients,
              icon: Users,
            },
            {
              label: "Projects",
              value: stats.projects,
              icon: TrendingUp,
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
              <s.icon className="w-8 h-8 text-emerald-400" />
            </div>
          ))}
        </div>

        {/* MONTHLY REVENUE */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Monthly Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PROJECT + CLIENT REVENUE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PROJECT WISE */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Project-wise Revenue
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectRevenue}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* CLIENT WISE */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Client-wise Revenue
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientRevenue}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OUTSTANDING AMOUNT */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Outstanding Amount
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={outstandingData}
                dataKey="value"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
              >
                {outstandingData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueReports;