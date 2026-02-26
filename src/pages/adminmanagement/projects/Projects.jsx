import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Download,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Globe,
  FileText,
  Image,
  X,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import {
  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "../../../redux/api/projectApiSlice";
import { toast } from "../../../utils/toast";
const countries = [
  "Germany",
  "New Zealand",
  "Australia",
  "Romania",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
];

const statusColors = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-1 ring-emerald-500/20",
  AVAILABLE:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-1 ring-emerald-500/20",
  INACTIVE: "bg-rose-500/10 text-rose-400 border-rose-500/20 ring-1 ring-rose-500/20",
  HOLD: "bg-amber-500/10 text-amber-400 border-amber-500/20 ring-1 ring-amber-500/20",
  CLOSED: "bg-slate-500/10 text-slate-400 border-slate-500/20 ring-1 ring-slate-500/20",
};

const countdownText = (end, now) => {
  if (!end) return "-";
  const diff = Math.max(0, new Date(end).getTime() - now);
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d}d ${h}h ${m}m ${sec}s`;
};

const getRawAssetValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value.url || value.path || value.location || "";
  return "";
};

const resolveAssetUrl = (value) => {
  const raw = getRawAssetValue(value);
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;

  const normalizedPath = raw.startsWith("/") ? raw : `/${raw}`;
  const envBase =
    (import.meta?.env?.VITE_API_BASE_URL || import.meta?.env?.VITE_API_URL || "").trim();
  const hostBase = envBase
    ? envBase.replace(/\/api\/v1\/?$/i, "").replace(/\/$/, "")
    : window.location.origin;

  return `${hostBase}${normalizedPath}`;
};

const deriveCountdownEnd = (item) => {
  if (item?.countdownEnd) return item.countdownEnd;
  if (!item?.createdAt || !item?.duration?.value || !item?.duration?.unit) return null;

  const start = new Date(item.createdAt);
  const value = Number(item.duration.value);
  const unit = String(item.duration.unit).toUpperCase();
  if (Number.isNaN(start.getTime()) || Number.isNaN(value)) return null;

  const end = new Date(start);
  if (unit === "DAYS") end.setDate(end.getDate() + value);
  else if (unit === "WEEKS") end.setDate(end.getDate() + value * 7);
  else if (unit === "MONTHS") end.setMonth(end.getMonth() + value);
  else return null;
  return end.toISOString();
};

const mapApiProject = (item, index) => ({
  id: item._id || index + 1,
  _id: item._id,
  title: item.title || "-",
  projectCode: item.projectCode || "-",
  clientCode: item.clientCode || item.client || "-",
  applications: item.totalApplications ?? 0,
  lastActivity: item.lastActivity ? new Date(item.lastActivity).toLocaleString("en-GB") : "-",
  countdownEnd: deriveCountdownEnd(item),
  country: item.country || "-",
  status: String(item.status || "AVAILABLE").toUpperCase(),
  hasPdf: Boolean(
    item.pdf ||
      item.pdfUrl ||
      item.pdfFilePath ||
      item.document ||
      item.file ||
      item.attachments?.pdf,
  ),
  hasImage: Boolean(
    (Array.isArray(item.images) && item.images.length > 0) ||
      item.image ||
      item.imageUrl ||
      item.thumbnail ||
      item.banner ||
      item.attachments?.image,
  ),
  pdfUrl:
    resolveAssetUrl(
      item.pdfUrl ||
        item.pdfFilePath ||
        item.pdf ||
        item.document ||
        item.file ||
        item.attachments?.pdf,
    ),
  imageUrl:
    resolveAssetUrl(
      (Array.isArray(item.images) && item.images[0]) ||
        item.imageUrl ||
        item.image ||
        item.thumbnail ||
        item.banner ||
        item.attachments?.image,
    ),
});

const ManageProjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [nowTs, setNowTs] = useState(Date.now());
  const [formData, setFormData] = useState({
    title: "",
    projectCode: "",
    clientCode: "",
    applications: 1,
    lastActivity: "",
    countdownDays: 30,
    country: "Germany",
    status: "AVAILABLE",
    imageFile: null,
    pdfFile: null,
  });

  const { data, isLoading, isError, error } = useGetProjectsQuery({
    page: 1,
    limit: 1000,
    search: searchTerm,
    status: selectedStatus === "ALL" ? "" : selectedStatus,
  });
  const [addProject, { isLoading: isAdding }] = useAddProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const hasShownLoadToast = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isLoading && !isError && data && !hasShownLoadToast.current) {
      toast.info("Projects loaded");
      hasShownLoadToast.current = true;
    }
  }, [isLoading, isError, data]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Failed to load projects");
    }
  }, [isError, error]);

  const projects = useMemo(() => {
    const source = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.projects)
        ? data.data.projects
        : Array.isArray(data)
          ? data
          : [];
    return source.map(mapApiProject);
  }, [data]);

  const handleInputChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.files?.[0] || null }));

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      projectCode: "",
      clientCode: "",
      applications: 1,
      lastActivity: "",
      countdownDays: 30,
      country: "Germany",
      status: "AVAILABLE",
      imageFile: null,
      pdfFile: null,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      projectCode: project.projectCode || "",
      clientCode: project.clientCode || "",
      applications: project.applications ?? 0,
      lastActivity: "",
      countdownDays: 30,
      country: project.country || "Germany",
      status: project.status || "AVAILABLE",
      imageFile: null,
      pdfFile: null,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Project Title is required");
    if (!formData.projectCode.trim()) return toast.error("Project Code is required");
    if (!formData.clientCode.trim()) return toast.error("Client Code is required");
    if (Number(formData.applications) < 0) return toast.error("Total Applications must be 0 or more");

    const now = new Date();
    const countdownEnd = new Date(
      now.getTime() + Number(formData.countdownDays) * 24 * 60 * 60 * 1000,
    ).toISOString();

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("projectCode", formData.projectCode.trim());
    payload.append("client", formData.clientCode.trim());
    payload.append("clientCode", formData.clientCode.trim());
    payload.append("status", formData.status);
    payload.append("country", formData.country);
    payload.append("totalApplications", String(Number(formData.applications)));
    payload.append(
      "lastActivity",
      formData.lastActivity ? new Date(formData.lastActivity).toISOString() : now.toISOString(),
    );
    payload.append("countdownEnd", countdownEnd);
    payload.append("slug", formData.title.trim().toLowerCase().replace(/\s+/g, "-"));
    payload.append("shortDescription", formData.title.trim());
    payload.append("description", formData.title.trim());
    payload.append("visibility", "PUBLIC");
    payload.append("experienceLevel", "INTERMEDIATE");
    payload.append("budget[min]", "1000");
    payload.append("budget[max]", "3000");
    payload.append("budget[currency]", "USD");
    payload.append("duration[value]", String(Number(formData.countdownDays)));
    payload.append("duration[unit]", "DAYS");
    if (formData.imageFile) payload.append("images", formData.imageFile);
    if (formData.pdfFile) payload.append("pdf", formData.pdfFile);

    try {
      if (editingProject?._id) {
        await updateProject({ _id: editingProject._id, data: payload }).unwrap();
        toast.success("Project updated successfully");
      } else {
        await addProject(payload).unwrap();
        toast.success("Project created successfully");
      }
      setIsAddModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save project");
    }
  };

  const filteredProjects = useMemo(
    () =>
      projects.filter((p) => {
        const matchesSearch = Object.values(p)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;
        return matchesSearch && matchesStatus;
      }),
    [projects, searchTerm, selectedStatus],
  );

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / entriesPerPage));
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );

  const handleDelete = async (id) => {
    try {
      await deleteProject(id).unwrap();
      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 p-6 text-text-muted font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-primary tracking-tight">
              MANAGE PROJECTS
            </h1>
            <p className="text-text-muted mt-1">Track and manage all your projects in one place</p>
          </div>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl font-semibold text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Project
            </span>
          </button>
        </div>

        <div className="bg-dark-850 border border-dark-700/50 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-text-muted">
            <span className="text-sm">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-text-primary focus:border-primary outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm">entries</span>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-9 pr-4 py-2 text-text-primary placeholder:text-text-muted focus:border-primary outline-none"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-text-primary focus:border-primary outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="HOLD">HOLD</option>
              <option value="CLOSED">CLOSED</option>
            </select>
            <button className="p-2 bg-dark-900 border border-dark-700 rounded-lg text-text-muted hover:text-text-primary transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-850 border border-dark-700/50 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-800/50 border-b border-dark-700/50">
                  <th className="sticky left-0 z-30 px-4 py-4 text-left text-xs font-bold text-text-muted uppercase !bg-dark-850">
                    S.No
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-text-muted uppercase">
                    Title
                  </th>
                  <th className="hidden lg:table-cell px-4 py-4 text-left text-xs font-bold text-text-muted uppercase">
                    Project Code
                  </th>
                  <th className="hidden xl:table-cell px-4 py-4 text-left text-xs font-bold text-text-muted uppercase">
                    Client Code
                  </th>
                  <th className="hidden sm:table-cell px-4 py-4 text-left text-xs font-bold text-text-muted uppercase">
                    Apps
                  </th>
                  <th className="hidden xl:table-cell px-4 py-4 text-left text-xs font-bold text-text-muted uppercase">
                    Last Activity
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-text-muted uppercase whitespace-nowrap">
                    Countdown
                  </th>
                  <th className="hidden lg:table-cell px-4 py-4 text-left text-xs font-bold text-text-muted uppercase">
                    Country
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-text-muted uppercase">
                    Files
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-text-muted uppercase">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-text-muted uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-text-muted">
                      Loading projects...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-rose-400">
                      {error?.data?.message || "Failed to load projects"}
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((project, idx) => (
                    <tr key={project.id} className="group hover:bg-dark-700/30 transition-colors">
                      <td className="sticky left-0 z-20 px-4 py-4 text-text-secondary whitespace-nowrap !bg-dark-850 group-hover:!bg-dark-800">
                        {(currentPage - 1) * entriesPerPage + idx + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-text-primary max-w-[200px] truncate">{project.title}</div>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-4">
                        <code className="text-xs bg-dark-900 px-2 py-1 rounded-md text-blue-400 border border-dark-700">
                          {project.projectCode}
                        </code>
                      </td>
                      <td className="hidden xl:table-cell px-4 py-4">
                        <code className="text-xs bg-dark-900 px-2 py-1 rounded-md text-purple-400 border border-dark-700">
                          {project.clientCode}
                        </code>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-4">
                        <span className="bg-dark-900 px-2 py-1 rounded-md text-amber-400 font-mono border border-dark-700">
                          {project.applications}
                        </span>
                      </td>
                      <td className="hidden xl:table-cell px-4 py-4 text-text-muted text-xs">
                        {project.lastActivity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-block bg-dark-900 px-1.5 py-0.5 rounded-md text-amber-400 font-mono whitespace-nowrap border border-dark-700">
                          {countdownText(project.countdownEnd, nowTs)}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-text-muted" />
                          <span className="text-text-muted">{project.country}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {project.hasPdf ? (
                            <button
                              type="button"
                              onClick={() => project.pdfUrl && window.open(project.pdfUrl, "_blank")}
                              title={project.pdfUrl ? "View PDF" : "PDF not available"}
                              className="p-1 bg-rose-500/10 rounded-md"
                            >
                              <FileText className="w-4 h-4 text-rose-400" />
                            </button>
                          ) : null}
                          {project.hasImage ? (
                            <button
                              type="button"
                              onClick={() => project.imageUrl && window.open(project.imageUrl, "_blank")}
                              title={project.imageUrl ? "View Image" : "Image not available"}
                              className="p-1 bg-blue-500/10 rounded-md"
                            >
                              <Image className="w-4 h-4 text-blue-400" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={twMerge(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
                            statusColors[project.status] || statusColors.AVAILABLE,
                          )}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(project)}
                            className="p-1.5 bg-dark-700 rounded-md hover:bg-dark-600 text-text-muted hover:text-text-primary transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            disabled={isDeleting}
                            className="p-1.5 bg-dark-700 rounded-md hover:bg-rose-500/20 text-text-muted hover:text-rose-400 disabled:opacity-60 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-dark-800/50 border-t border-dark-700/50 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-text-muted">
              Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
              {Math.min(currentPage * entriesPerPage, filteredProjects.length)} of{" "}
              {filteredProjects.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-dark-700 bg-dark-800 text-text-muted hover:text-text-primary disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-dark-700 bg-dark-800 text-text-muted hover:text-text-primary disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isAddModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsAddModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-dark-850 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-dark-700 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-text-primary">
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </h2>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 hover:bg-dark-700 rounded-lg text-text-muted hover:text-text-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Project Title *
                      </label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Project Code *
                      </label>
                      <input
                        name="projectCode"
                        value={formData.projectCode}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Client Code *
                      </label>
                      <input
                        name="clientCode"
                        value={formData.clientCode}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Total Applications *
                      </label>
                      <input
                        type="number"
                        min="0"
                        name="applications"
                        value={formData.applications}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Last Activity Date
                      </label>
                      <input
                        type="datetime-local"
                        name="lastActivity"
                        value={formData.lastActivity}
                        onChange={handleInputChange}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Countdown End
                      </label>
                      <select
                        name="countdownDays"
                        value={formData.countdownDays}
                        onChange={handleInputChange}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none"
                      >
                        <option value={30}>30 Days</option>
                        <option value={60}>60 Days</option>
                        <option value={90}>90 Days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none"
                      >
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="HOLD">HOLD</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Project Image
                      </label>
                      <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-text-muted"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-2">
                        Upload PDF
                      </label>
                      <input
                        type="file"
                        name="pdfFile"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-text-muted"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-dark-700">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 px-4 py-3 bg-dark-700 rounded-lg text-text-primary hover:bg-dark-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAdding || isUpdating}
                      className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark rounded-lg text-text-primary font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {editingProject ? "Update Project" : "Save Project"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageProjects;
