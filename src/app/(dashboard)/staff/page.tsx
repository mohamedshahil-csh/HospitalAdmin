"use client";

import React, { useState } from "react";
import { cn, formatDateTime } from "@/lib/utils";
import { mockStaff } from "@/lib/mock-data";
import { Plus, Search, Edit, ToggleLeft, ToggleRight, Key, X, Save, UserCog } from "lucide-react";
import toast from "react-hot-toast";

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);

  const filtered = mockStaff.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    "Hospital Coordinator": "bg-blue-100 text-blue-700",
    "ED Doctor": "bg-purple-100 text-purple-700",
    Nurse: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff & Sub-Accounts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage hospital staff accounts and permissions</p>
        </div>
        <button onClick={() => { setShowModal(true); setEditingStaff(null); }} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-all">
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search staff..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary outline-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Department</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((staff) => (
                <tr key={staff.id}>
                  <td className="font-medium">{staff.fullName}</td>
                  <td><span className={cn("badge", roleColors[staff.role])}>{staff.role}</span></td>
                  <td className="text-xs">{staff.email}</td>
                  <td className="font-mono text-xs">{staff.phone}</td>
                  <td className="text-sm">{staff.department}</td>
                  <td>
                    <span className={cn("badge", staff.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="text-xs text-gray-500">{staff.lastLogin ? formatDateTime(staff.lastLogin) : "Never"}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditingStaff(staff.id); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-amber-600 transition-colors" title="Reset Password">
                        <Key className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors" title={staff.status === "Active" ? "Deactivate" : "Activate"}>
                        {staff.status === "Active" ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label><input type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" placeholder="Enter full name" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input type="email" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" placeholder="email@hospital.in" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label><input type="tel" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" placeholder="+91..." /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none">
                    <option>Hospital Coordinator</option><option>ED Doctor (ERCP)</option><option>Nurse</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none">
                    <option>Emergency</option><option>Emergency Medicine</option><option>ICU</option><option>Trauma Centre</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Teleconsult Availability (ED Doctors)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs text-gray-500">Days</label><input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs" placeholder="Mon, Tue, Wed..." /></div>
                  <div className="flex gap-2">
                    <div className="flex-1"><label className="text-xs text-gray-500">Start</label><input type="time" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs" defaultValue="08:00" /></div>
                    <div className="flex-1"><label className="text-xs text-gray-500">End</label><input type="time" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs" defaultValue="20:00" /></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => { setShowModal(false); toast.success("Staff member saved"); }} className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-primary-600"><Save className="w-4 h-4" /> Save</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
