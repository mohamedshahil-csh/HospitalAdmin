"use client";

import React, { useState, useEffect } from "react";
import { cn, formatDateTime } from "@/lib/utils";
import { mockHospital } from "@/lib/mock-data";
import { Plus, Search, Edit, ToggleLeft, ToggleRight, Key, X, Save, UserCog, ShieldCheck, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function StaffPage() {
  const { createStaff, fetchStaff, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All");

  const roles = [
    { label: "All Staff", value: "All" },
    { label: "Admin", value: "Hospital Admin" },
    { label: "Coordinators", value: "Hospital Coordinator" },
    { label: "Doctors", value: "Hospital ED Doctor (ERCP)" },
    { label: "Nurses", value: "Hospital Nurse" }
  ];
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "ED_DOCTOR",
    metadata: {
      specialization: "",
      license_number: "",
      department: "Emergency Operations",
      designation: "",
      shift: "Rotational"
    }
  });

  useEffect(() => {
    loadStaff();
  }, [selectedRole]);

  const loadStaff = async () => {
    setIsDataLoading(true);
    const result = await fetchStaff(selectedRole === "All" ? undefined : selectedRole);
    if (result.success && result.data) {
      setStaffList(result.data);
    } else {
      toast.error(result.message || "Failed to load staff list");
    }
    setIsDataLoading(false);
  };

  const filtered = staffList.filter((s) =>
    (s.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (s.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (s.username?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const roleMapping: Record<string, string> = {
    "Hospital Admin": "hospital_admin",
    "HOSPITAL_ADMIN": "hospital_admin",
    "Hospital Coordinator": "hospital_coordinator",
    "HOSPITAL_COORDINATOR": "hospital_coordinator",
    "ED Doctor": "ed_doctor",
    "Hospital ED Doctor (ERCP)": "ed_doctor",
    "ED_DOCTOR": "ed_doctor",
    "Nurse": "nurse",
    "NURSE": "nurse",
    "FLEET_OPERATOR": "fleet_operator",
    "CURESELECT_ADMIN": "hospital_admin",
    "CCE": "hospital_coordinator"
  };

  const roleColors: Record<string, string> = {
    "hospital_admin": "bg-red-100 text-red-700",
    "hospital_coordinator": "bg-blue-100 text-blue-700",
    "ed_doctor": "bg-purple-100 text-purple-700",
    "nurse": "bg-green-100 text-green-700",
    "fleet_operator": "bg-orange-100 text-orange-700",
    "default": "bg-gray-100 text-gray-700",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("meta.")) {
      const metaField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        metadata: { ...prev.metadata, [metaField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.username || !formData.email || !formData.phone || (!editingStaff && !formData.password)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Include the current admin's ID as org_id
      const payload = {
        ...formData,
        org_id: user?.id
      };

      const response = await createStaff(payload);
      if (response.success) {
        toast.success(response.message || "Staff member added successfully");
        setShowModal(false);
        setFormData({
          name: "", username: "", email: "", phone: "", password: "", role: "ED_DOCTOR",
          metadata: { specialization: "", license_number: "", department: "Emergency Operations", designation: "", shift: "Rotational" }
        });
        loadStaff(); // Refresh list
      } else {
        toast.error(response.message || "Failed to create staff member");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff & Sub-Accounts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage hospital staff accounts and permissions</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setEditingStaff(null); }} 
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="flex flex-col gap-4 border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => setSelectedRole(r.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                selectedRole === r.value
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search staff by name, email or username..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
            />
          </div>
        </div>

        <div className="overflow-x-auto text-gray-800">
          <table className="data-table w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-800 font-bold">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isDataLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm text-gray-500 font-medium font-bold">Fetching staff accounts...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No staff members found
                  </td>
                </tr>
              ) : filtered.map((staff) => {
                const apiRole = staff.roles?.[0] || "Unknown";
                const localRole = roleMapping[apiRole] || "default";
                return (
                  <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{staff.name || "Unnamed Staff"}</span>
                        <span className="text-[10px] text-gray-400 font-mono uppercase">ID: {staff.id.split("-")[0]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("badge px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", roleColors[localRole])}>
                        {apiRole}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs space-y-0.5">
                        <span className="text-gray-900 font-medium">{staff.email}</span>
                        <span className="text-gray-500 font-mono">{staff.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {staff.metadata?.department || staff.metadata?.hospital?.name || "General Access"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("badge", staff.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                      {staff.lastActiveAt ? formatDateTime(new Date(staff.lastActiveAt)) : "Never"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditingStaff(staff.id); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors">
                          <Key className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                          {staff.status === "ACTIVE" ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto animate-modal-in overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl">
                  <UserCog className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{editingStaff ? "Edit Staff Account" : "Add New Staff Account"}</h3>
                  <p className="text-xs text-gray-500 font-medium">Create secure credentials and assign clinical roles</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-200 text-gray-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 flex items-center gap-2 pb-2 border-b border-gray-50">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Account Credentials</span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} type="text" className="form-input-premium" placeholder="e.g. Dr. John Smith" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Username</label>
                  <input name="username" value={formData.username} onChange={handleInputChange} type="text" className="form-input-premium" placeholder="john.smith24" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input name="email" value={formData.email} onChange={handleInputChange} type="email" className="form-input-premium" placeholder="john@hospital.com" />
                </div>
                {!editingStaff && (
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                    <input name="password" value={formData.password} onChange={handleInputChange} type="password" className="form-input-premium" placeholder="••••••••" />
                  </div>
                )}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="form-input-premium" placeholder="+91 99999 00000" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Assigned Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="form-input-premium bg-white">
                    <option value="ED_DOCTOR">ED Doctor (ERCP)</option>
                    <option value="HOSPITAL_COORDINATOR">Hospital Coordinator</option>
                    <option value="NURSE">Nurse</option>
                  </select>
                </div>
                <div className="col-span-2 flex items-center gap-2 mt-4 pb-2 border-b border-gray-50">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Professional Profile</span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Specialization</label>
                  <input name="meta.specialization" value={formData.metadata.specialization} onChange={handleInputChange} type="text" className="form-input-premium" placeholder="e.g. Cardiology" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">License Number</label>
                  <input name="meta.license_number" value={formData.metadata.license_number} onChange={handleInputChange} type="text" className="form-input-premium uppercase" placeholder="MC-12345" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Department</label>
                  <select name="meta.department" value={formData.metadata.department} onChange={handleInputChange} className="form-input-premium bg-white">
                    {mockHospital.departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                    <option value="Other">Other Access</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Shift Type</label>
                  <select name="meta.shift" value={formData.metadata.shift} onChange={handleInputChange} className="form-input-premium bg-white">
                    <option value="Day">Day Shift</option>
                    <option value="Night">Night Shift</option>
                    <option value="Rotational">Rotational</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-4 px-8 py-6 border-t border-gray-50 bg-gray-50/30">
              <button onClick={handleSave} disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> {editingStaff ? "Update Account" : "Create Account"}</>}
              </button>
              <button onClick={() => setShowModal(false)} className="px-6 py-3 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-white hover:text-gray-700 hover:border-gray-300 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .form-input-premium {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          border: 1px solid #E2E8F0;
          font-size: 0.875rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          color: #1A202C;
          background-color: #F8FAFC;
        }
        .form-input-premium:focus {
          border-color: #3b82f6;
          background-color: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .animate-modal-in {
          animation: modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F1F5F9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
