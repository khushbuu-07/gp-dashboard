import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Code,
  Briefcase,
  Users,
  Activity,
  Star,
  UserMinus,
  Loader2,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetClientsQuery,
  useAddClientMutation,
  useUpdateClientMutation,
} from "../../../redux/api/clientApiSlice";
import { toast } from "../../../utils/toast";

const statusClass = {
  active:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-1 ring-emerald-500/20",
  prospect:
    "bg-amber-500/10 text-amber-400 border-amber-500/20 ring-1 ring-amber-500/20",
  inactive:
    "bg-rose-500/10 text-rose-400 border-rose-500/20 ring-1 ring-rose-500/20",
};

const statusIcons = {
  active: "●",
  prospect: "★",
  inactive: "○",
};

const normalizeStatus = (status) => String(status || "active").toLowerCase();

const ClientsData = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    projectInterested: "",
    projectCode: "",
    location: "",
    dateOfCall: "",
    attendedBy: "",
    status: "active",
    remarks: "",
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active",
  });

  const { data, isLoading, isError, error } = useGetClientsQuery({
    page: 1,
    limit: 1000,
  });
  const [addClient, { isLoading: isAdding }] = useAddClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const hasShownLoadToast = useRef(false);

  const rows = useMemo(() => {
    const source = Array.isArray(data?.clients)
      ? data.clients
      : Array.isArray(data?.data?.clients)
        ? data.data.clients
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

    return source.map((client, idx) => ({
      _id: client._id,
      sno: idx + 1,
      name: client.name || client.fullName || client.clientName || "",
      mobile: client.mobile || client.phone || "",
      email: client.email || "",
      projectInterested:
        client.projectInterested || client.projectName || client.interestedProject || "",
      projectCode: client.projectCode || client.code || "",
      location: client.location || client.address?.city || client.city || "",
      dateOfCall: client.date || client.dateOfCall || client.createdAt || "",
      attendedBy: client.attendedBy || client.callerName || "",
      status: normalizeStatus(client.status),
      remarks: client.remarks || client.note || client.notes || "",
      raw: client,
    }));
  }, [data]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.mobile?.trim()) {
        toast.error("Phone number is required");
        return;
      }

      await addClient({
        name: formData.name,
        phone: formData.mobile.trim(),
        email: formData.email,
        company: formData.projectInterested || "",
        projectInterested: formData.projectInterested,
        projectCode: formData.projectCode,
        location: formData.location,
        date: formData.dateOfCall || new Date().toISOString(),
        attendedBy: formData.attendedBy || "",
        status: normalizeStatus(formData.status),
        remarks: formData.remarks,
      }).unwrap();

      setFormData({
        name: "",
        mobile: "",
        email: "",
        projectInterested: "",
        projectCode: "",
        location: "",
        dateOfCall: "",
        attendedBy: "",
        status: "active",
        remarks: "",
      });
      setIsFormOpen(false);
      toast.success("Client added successfully");
    } catch (err) {
      console.error("Failed to add client:", err);
      toast.error(err?.data?.message || "Failed to add client");
    }
  };

  const handleOpenEdit = (row) => {
    setEditingClientId(row._id);
    setEditFormData({
      name: row.name || "",
      email: row.email || "",
      phone: row.mobile || "",
      status: normalizeStatus(row.status),
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingClientId) return;
    try {
      await updateClient({
        _id: editingClientId,
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        status: normalizeStatus(editFormData.status),
      }).unwrap();
      toast.success("Client updated successfully");
      setIsEditOpen(false);
      setEditingClientId(null);
      setEditFormData({
        name: "",
        email: "",
        phone: "",
        status: "active",
      });
    } catch (err) {
      console.error("Failed to update client:", err);
      toast.error(err?.data?.message || "Failed to update client");
    }
  };

  useEffect(() => {
    if (!isLoading && !isError && data && !hasShownLoadToast.current) {
      toast.info("Clients loaded");
      hasShownLoadToast.current = true;
    }
  }, [isLoading, isError, data]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Failed to load clients");
    }
  }, [isError, error]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      );
      const matchesStatus =
        statusFilter === "all" || normalizeStatus(row.status) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((r) => normalizeStatus(r.status) === "active").length,
      prospects: rows.filter((r) => normalizeStatus(r.status) === "prospect").length,
      inactive: rows.filter((r) => normalizeStatus(r.status) === "inactive").length,
    }),
    [rows],
  );

  return (
    <div className="min-h-screen bg-dark-900 p-6 text-text-muted font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-primary tracking-tight">
              Client Dashboard
            </h1>
            <p className="text-text-muted mt-1">Manage and track your client interactions</p>
          </div>

          <button
            onClick={() => setIsFormOpen((prev) => !prev)}
            className="group relative px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add New Client
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Clients", value: stats.total, color: "from-blue-500 to-cyan-500", icon: Users },
            { label: "Active", value: stats.active, color: "from-emerald-500 to-teal-500", icon: Activity },
            { label: "Prospects", value: stats.prospects, color: "from-amber-500 to-orange-500", icon: Star },
            { label: "Inactive", value: stats.inactive, color: "from-rose-500 to-pink-500", icon: UserMinus },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />
              <div className="relative bg-dark-850 border border-dark-700/50 rounded-2xl p-6 overflow-hidden hover:border-dark-600 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-muted text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-text-primary mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl opacity-80`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-dark-850 border border-dark-700/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-text-primary">Add New Client</h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-text-muted hover:text-text-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField icon={User} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                  <InputField icon={Phone} name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
                  <InputField icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                  <InputField icon={Briefcase} name="projectInterested" placeholder="Project Interested" value={formData.projectInterested} onChange={handleChange} />
                  <InputField icon={Code} name="projectCode" placeholder="Project Code" value={formData.projectCode} onChange={handleChange} />
                  <InputField icon={MapPin} name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
                  <InputField icon={Calendar} name="dateOfCall" type="date" value={formData.dateOfCall} onChange={handleChange} />
                  <InputField icon={User} name="attendedBy" placeholder="Attended By" value={formData.attendedBy} onChange={handleChange} />

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="col-span-1 bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="active">active</option>
                    <option value="prospect">prospect</option>
                    <option value="inactive">inactive</option>
                  </select>

                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Add remarks..."
                    className="col-span-1 md:col-span-3 bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[100px]"
                  />

                  <button
                    type="submit"
                    disabled={isAdding}
                    className="col-span-1 md:col-span-3 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    Add Client
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isEditOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-dark-850 border border-dark-700/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-text-primary">Edit Client</h2>
                  <button
                    onClick={() => {
                      setIsEditOpen(false);
                      setEditingClientId(null);
                    }}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-text-muted hover:text-text-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <InputField
                    icon={User}
                    name="name"
                    placeholder="Full Name"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                  <InputField
                    icon={Mail}
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                  <InputField
                    icon={Phone}
                    name="phone"
                    placeholder="Phone Number"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    required
                  />
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="col-span-1 bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="active">active</option>
                    <option value="prospect">prospect</option>
                    <option value="inactive">inactive</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="col-span-1 md:col-span-4 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    Update Client
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-850 border border-dark-700/50 rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-dark-850 border border-dark-700/50 rounded-xl px-4 py-3 text-text-primary focus:border-primary outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactive</option>
            </select>

            <button className="p-3 bg-dark-850 border border-dark-700/50 rounded-xl hover:bg-dark-700 transition-colors text-text-muted hover:text-text-primary">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-850 border border-dark-700/50 rounded-2xl overflow-hidden shadow-2xl"
        >
          {isLoading ? (
            <div className="py-16 flex items-center justify-center text-text-muted">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading clients...
            </div>
          ) : isError ? (
            <div className="py-16 text-center text-rose-400">
              {error?.data?.message || "Failed to load clients"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm sticky-first-col">
                <thead>
                  <tr className="bg-dark-800/50 border-b border-dark-700/50">
                    <th className="sticky left-0 z-30 px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider !bg-dark-850">Sno</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Name</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Mobile</th>
                    <th className="hidden px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider sm:table-cell">Email</th>
                    <th className="hidden px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider lg:table-cell">Project</th>
                    <th className="hidden px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider lg:table-cell">Code</th>
                    <th className="hidden px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider xl:table-cell">Location</th>
                    <th className="hidden px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider xl:table-cell">Date</th>
                    <th className="hidden px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider xl:table-cell">Attended</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                    <th className="hidden px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider lg:table-cell">Remarks</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700/50">
                  <AnimatePresence>
                    {filteredRows.map((row, idx) => (
                      <motion.tr
                        key={row._id || row.sno}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="group hover:bg-dark-700/30 transition-colors"
                      >
                        <td className="sticky left-0 z-20 px-4 py-4 text-text-secondary !bg-dark-850 group-hover:!bg-dark-800">{row.sno}</td>
                        <td className="px-4 py-4 font-medium text-text-primary">{row.name}</td>
                        <td className="px-4 py-4 text-text-muted">{row.mobile}</td>
                        <td className="hidden px-4 py-4 text-text-muted sm:table-cell">{row.email}</td>
                        <td className="hidden px-4 py-4 text-text-muted lg:table-cell">{row.projectInterested}</td>
                        <td className="hidden px-4 py-4 text-text-muted lg:table-cell">{row.projectCode}</td>
                        <td className="hidden px-4 py-4 text-text-muted xl:table-cell">{row.location}</td>
                        <td className="hidden px-4 py-4 text-text-muted xl:table-cell">
                          {row.dateOfCall ? new Date(row.dateOfCall).toLocaleDateString("en-GB") : "-"}
                        </td>
                        <td className="hidden px-4 py-4 text-text-muted xl:table-cell">{row.attendedBy || "-"}</td>
                        <td className="px-4 py-4">
                          <span
                            className={twMerge(
                              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border",
                              statusClass[normalizeStatus(row.status)] || statusClass.active,
                            )}
                          >
                            <span className="text-lg">
                              {statusIcons[normalizeStatus(row.status)] || statusIcons.active}
                            </span>
                            {normalizeStatus(row.status)}
                          </span>
                        </td>
                        <td className="hidden max-w-[200px] truncate px-4 py-4 text-text-muted lg:table-cell">
                          {row.remarks}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEdit(row)}
                              disabled={isUpdating}
                              className="p-2 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors disabled:opacity-60 text-text-muted hover:text-text-primary"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-text-muted hover:text-text-primary">
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filteredRows.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-text-muted">No clients found</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative col-span-1">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
    <input
      {...props}
      className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
    />
  </div>
);

export default ClientsData;
