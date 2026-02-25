import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Filter,
  LayoutGrid,
  List,
  TrendingUp,
  X,
  Loader2,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import Table from "../../../components/common/Table";
import {
  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "../../../redux/api/projectApiSlice";

const AddProjectModal = ({ isOpen, onClose, onSave, project, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    projectCode: "",
    client: "",
    status: "AVAILABLE",
    country: "India",
    pdf: null,
    images: [],
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        projectCode: project.projectCode || "",
        client: project.client?._id || project.client || "",
        status: project.status || "AVAILABLE",
        country: project.country || "India",
        pdf: null,
        images: [],
      });
    } else {
      setFormData({
        title: "",
        projectCode: "",
        client: "",
        status: "AVAILABLE",
        country: "India",
        pdf: null,
        images: [],
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!formData.client || formData.client.length !== 24) {
      alert("Valid Client ObjectId required");
      return;
    }

    const fd = new FormData();

    fd.append("title", formData.title.trim());
    fd.append("projectCode", formData.projectCode);
    fd.append("client", formData.client);
    fd.append("status", formData.status);
    fd.append("country", formData.country);

    if (formData.pdf) {
      fd.append("pdf", formData.pdf);
    }
    
    formData.images.forEach(img => fd.append("images", img));

    onSave(fd);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-dark-850 rounded-2xl shadow-2xl w-full max-w-2xl border border-dark-600 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-dark-700 text-text-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Add New Project
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary ml-1">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter Project Title"
                className="w-full mt-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-text-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary ml-1">
                Client Code
              </label>
              <input
                type="text"
                name="projectCode"
                value={formData.projectCode}
                onChange={handleChange}
                required
                placeholder="Enter Client Code"
                className="w-full mt-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-text-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary ml-1">
                Client ID
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
                placeholder="MongoDB Client ObjectId"
                className="w-full mt-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-text-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary ml-1">
                Last Activity
              </label>
              <input
                type="text"
                value="Auto generated"
                disabled
                className="w-full mt-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-text-muted cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary ml-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. India"
                className="w-full mt-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-text-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary ml-1">
                Upload PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pdf: e.target.files[0],
                  }))
                }
                className="w-full mt-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
              />
              {formData.pdf && (
                <p className="mt-1 text-xs text-text-muted">
                  Selected: {formData.pdf.name}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary ml-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-text-primary"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="HOLD">HOLD</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-text-secondary ml-1">
                Project Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    images: Array.from(e.target.files),
                  }))
                }
                className="w-full mt-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
              />
              {formData.images.length > 0 && (
                <p className="mt-1 text-xs text-text-muted">
                  {formData.images.length} image(s) selected
                </p>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-sm border border-dark-600 hover:bg-dark-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Projects = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, error } = useGetProjectsQuery();
  const projects = data?.data || [];
  const [addProject, { isLoading: isAdding }] = useAddProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    return projects.filter(project => 
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const handleSave = async (projectData) => {
    try {
      if (editingProject) {
        await updateProject({
          ...projectData,
          _id: editingProject._id,
        }).unwrap();
      } else {
        await addProject(projectData).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save project:", err);
      alert("Failed to save project. Please try again.");
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(projectId).unwrap();
      } catch (err) {
        console.error("Failed to delete project:", err);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "HOLD":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "CLOSED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-dark-700 text-gray-400";
    }
  }, []);

  return (
    <div className="space-y-8 animate-fade-in text-text-primary pt-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-dark-600 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Manage Projects
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>
              Total Projects:{" "}
              <span className="text-text-primary font-bold">
                {projects?.length || 0}
              </span>
            </span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span>
              Active:{" "}
              <span className="text-text-primary font-bold">
                {projects?.filter((p) => p.status === "AVAILABLE").length || 0}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm focus:outline-none focus:border-primary w-full md:w-64 transition-all"
            />
          </div>

          <button className="p-2.5 bg-dark-800 border border-dark-600 rounded-xl hover:bg-dark-700 text-gray-400 hover:text-text-primary transition-colors">
            <Filter className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 bg-dark-800 p-1 rounded-lg border border-dark-600">
          <button
            onClick={() => setViewMode("grid")}
            className={twMerge(
              "p-1.5 rounded transition-colors",
              viewMode === "grid"
                ? "bg-dark-600 text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary",
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={twMerge(
              "p-1.5 rounded transition-colors",
              viewMode === "table"
                ? "bg-dark-600 text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary",
            )}
            aria-label="Table view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <button className="text-xs font-bold text-gray-500 hover:text-text-primary flex items-center gap-1">
          Sort by: Deadline <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-96 text-red-500">
          Error fetching projects: {error?.data?.message || "Unknown error"}
        </div>
      ) : viewMode === "grid" ? (
        /* Project Grid */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="group relative bg-dark-900 rounded-xl overflow-hidden border border-dark-600/50 flex h-64 hover:border-primary/50 transition-all duration-500 shadow-2xl"
            >
              {/* 30% Image Section */}
              <div className="w-[30%] relative overflow-hidden">
                <img
                  src={project.images?.[0]?.url || "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800"}
                  alt={project.title}
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
              </div>

              {/* 70% Data Section */}
              <div className="w-[70%] p-8 flex flex-col relative bg-gradient-to-br from-dark-900 to-dark-800/50">
                {/* Header Row */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-text-primary italic tracking-tighter group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mt-1">
                      CODE: {project.projectCode}
                    </p>
                  </div>
                  <span
                    className={twMerge(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                      getStatusColor(project.status),
                    )}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Middle Row: Client Info */}
                <div className="flex flex-1 gap-8 items-center">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">
                      Client
                    </p>
                    <p className="text-sm font-bold text-yellow-400">
                      {project.client?.name || project.client || "N/A"}
                    </p>
                  </div>
                  <div className="w-px h-10 bg-dark-600/40" />
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">
                      Country
                    </p>
                    <p className="text-sm font-bold text-orange-500">
                      {project.country || "India"}
                    </p>
                  </div>
                </div>

                {/* Footer Row: Actions */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.pdf?.url && (
                      <a
                        href={project.pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-blue-400 transition-colors"
                        title="View PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-primary transition-colors"
                      title="Edit Project"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      disabled={isDeleting}
                      className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-text-muted hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Project Card */}
          {filteredProjects.length === 0 ? (
            <div className="col-span-2 text-center py-20 text-text-muted">
              No projects found
            </div>
          ) : null}

          {/* Aesthetic Add Button */}
          <div
            onClick={() => handleOpenModal()}
            className="border-2 border-dashed border-dark-600/50 rounded-xl flex flex-col items-center justify-center p-8 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group h-64 bg-dark-900"
          >
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-all border border-primary/20 group-hover:border-primary/40">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">
              Add New Project
            </span>
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-16rem)]">
          {/* Table view - would need columnDefs defined */}
          <div className="text-center text-text-muted py-20">
            Table view is currently being configured
          </div>
        </div>
      )}

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        project={editingProject}
        isLoading={isAdding || isUpdating}
      />
    </div>
  );
};

export default Projects;