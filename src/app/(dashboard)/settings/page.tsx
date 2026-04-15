"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { mockHospital } from "@/lib/mock-data";
import {
  Building2, MapPin, Phone, Mail, User, Bed, Save,
  Plus, X, Settings, Bell, Video, Shield, ToggleLeft,
  ToggleRight, CheckCircle, Upload,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [hospital, setHospital] = useState(mockHospital);
  const [editMode, setEditMode] = useState(false);

  const tabs = [
    { key: "profile", label: "Hospital Profile" },
    { key: "departments", label: "Departments" },
    { key: "fleet", label: "Fleet Network" },
    { key: "notifications", label: "Notifications" },
    { key: "teleconsult", label: "Teleconsult Routing" },
  ];

  const handleSave = () => {
    setEditMode(false);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hospital Profile & Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage hospital configuration and preferences</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap", activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{hospital.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge bg-blue-100 text-blue-700">{hospital.type}</span>
                  {hospital.nabhAccredited && <span className="badge bg-green-100 text-green-700">✓ NABH Accredited</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button onClick={handleSave} className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"><Save className="w-4 h-4" /> Save Changes</button>
                  <button onClick={() => setEditMode(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                </>
              ) : (
                <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-600"><Settings className="w-4 h-4" /> Edit</button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldEdit label="Hospital Name" value={hospital.name} editable={editMode} />
            <FieldEdit label="Type" value={hospital.type} editable={editMode} />
            <div className="col-span-2"><FieldEdit label="Address" value={hospital.address} editable={editMode} /></div>
            <FieldEdit label="Emergency Phone" value={hospital.emergencyPhone} editable={editMode} />
            <FieldEdit label="Medical Director" value={hospital.medicalDirector} editable={editMode} />
            <FieldEdit label="Email" value={hospital.email} editable={editMode} />
            <FieldEdit label="GPS Coordinates" value={`${hospital.gpsCoordinates.lat}, ${hospital.gpsCoordinates.lng}`} editable={false} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Bed className="w-5 h-5 text-primary" /> Bed Capacity</h3>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(hospital.bedCapacity).map(([dept, cap]) => (
                <div key={dept} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 capitalize mb-1">{dept}</p>
                  <p className="text-lg font-bold text-primary">{cap.available}<span className="text-sm font-normal text-gray-400">/{cap.total}</span></p>
                  <p className="text-[10px] text-gray-400">available</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <Upload className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Hospital Logo</p>
              <p className="text-xs text-gray-400">Upload PNG or SVG, max 2MB</p>
            </div>
            <button className="ml-auto px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50">Upload</button>
          </div>
        </div>
      )}

      {activeTab === "departments" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Department Configuration</h3>
            <button className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-600"><Plus className="w-4 h-4" /> Add Department</button>
          </div>
          <table className="data-table">
            <thead><tr><th>Department</th><th>Head of Dept</th><th>Beds</th><th>Phone</th><th>Status</th></tr></thead>
            <tbody>
              {hospital.departments.map((dept) => (
                <tr key={dept.id}>
                  <td className="font-medium">{dept.name}</td>
                  <td>{dept.headOfDept}</td>
                  <td>{dept.bedCount}</td>
                  <td className="font-mono text-xs">{dept.phone}</td>
                  <td>
                    <span className={cn("badge", dept.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                      {dept.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "fleet" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div><h3 className="font-medium text-gray-900">Public Fleet Network</h3><p className="text-xs text-gray-500">Opt in to see all ambulances in the public network</p></div>
            <button className="text-green-600"><ToggleRight className="w-8 h-8" /></button>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Connected Operators</h3>
            {["CureSelect Ambulance — Active", "108 Emergency — Active", "GVK EMRI — Pending"].map((op, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="text-sm">{op.split(" — ")[0]}</span>
                <span className={cn("badge", op.includes("Active") ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>{op.split(" — ")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-2">Notification Preferences</h3>
          <table className="data-table">
            <thead><tr><th>Event</th><th>Push</th><th>SMS</th><th>Email</th></tr></thead>
            <tbody>
              {["Ambulance dispatched to hospital", "Patient ETA < 10 min", "TeleLink incoming", "ePCR received", "Code activation"].map((event) => (
                <tr key={event}>
                  <td className="text-sm">{event}</td>
                  {[1, 2, 3].map((i) => (
                    <td key={i}>
                      <input type="checkbox" defaultChecked={Math.random() > 0.3} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => toast.success("Preferences saved")} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-600">Save Preferences</button>
        </div>
      )}

      {activeTab === "teleconsult" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-2">Teleconsult Routing Rules</h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Routing Mode</label>
            <select className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none">
              <option>Round-robin</option><option>By Specialty</option><option>Manual Queue</option>
            </select>
          </div>
          <p className="text-sm text-gray-500">ERCP doctors will receive TeleLink requests based on the selected routing mode and their availability schedule (configured in Staff & Accounts).</p>
        </div>
      )}
    </div>
  );
}

function FieldEdit({ label, value, editable }: { label: string; value: string; editable: boolean }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {editable ? (
        <input type="text" defaultValue={value} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary outline-none" />
      ) : (
        <p className="text-sm font-medium text-gray-900 py-2">{value}</p>
      )}
    </div>
  );
}
