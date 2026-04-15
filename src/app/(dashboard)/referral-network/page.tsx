"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { mockReferralHospitals, mockMortuaries, mockRoutingRules } from "@/lib/mock-data";
import { Plus, Edit, Trash2, Network, Building2, MapPin, Phone, X, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function ReferralNetworkPage() {
  const [activeTab, setActiveTab] = useState("hospitals");
  const [showModal, setShowModal] = useState(false);

  const tabs = [
    { key: "hospitals", label: "Referral Hospitals" },
    { key: "mortuaries", label: "Mortuaries" },
    { key: "routing", label: "Routing Rules" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referral Network</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage outgoing referral hospitals and routing rules</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-all">
          <Plus className="w-4 h-4" /> Add {activeTab === "hospitals" ? "Hospital" : activeTab === "mortuaries" ? "Mortuary" : "Rule"}
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "hospitals" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockReferralHospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                    <span className={cn("badge text-[10px]", hospital.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>{hospital.status}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex flex-wrap gap-1 mb-2">
                  {hospital.specialty.map((s, i) => (
                    <span key={i} className="badge bg-blue-50 text-blue-600 text-[10px]">{s}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {hospital.address}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {hospital.coordinatorName} — {hospital.coordinatorPhone}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{hospital.distance} km away</span>
                  <span className="badge bg-gray-100 text-gray-600 text-[10px]">{hospital.notificationPreference}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "mortuaries" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Address</th><th>Contact</th><th>Vehicle Available</th><th>Actions</th></tr></thead>
            <tbody>
              {mockMortuaries.map((m) => (
                <tr key={m.id}>
                  <td className="font-medium">{m.name}</td>
                  <td className="text-xs">{m.address}</td>
                  <td className="font-mono text-xs">{m.contact}</td>
                  <td><span className={cn("badge", m.vehicleAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>{m.vehicleAvailable ? "Yes" : "No"}</span></td>
                  <td><div className="flex gap-1"><button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Edit className="w-3.5 h-3.5" /></button><button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "routing" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="data-table">
            <thead><tr><th>Incident Type</th><th>Primary Hospital</th><th>Fallback Hospital</th><th>Actions</th></tr></thead>
            <tbody>
              {mockRoutingRules.map((rule) => (
                <tr key={rule.id}>
                  <td className="font-medium">{rule.incidentType}</td>
                  <td><span className="badge bg-green-100 text-green-700">{rule.primaryHospital}</span></td>
                  <td><span className="badge bg-amber-100 text-amber-700">{rule.fallbackHospital}</span></td>
                  <td><button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Edit className="w-3.5 h-3.5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Add Referral Hospital</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital Name</label><input type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label><input type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Coordinator Name</label><input type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label><input type="tel" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Specialties</label><input type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" placeholder="Cardiac, Trauma, Burns..." /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Notification Preference</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none">
                  <option>SMS</option><option>Call</option><option>App</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => { setShowModal(false); toast.success("Referral hospital added"); }} className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-primary-600"><Save className="w-4 h-4" /> Save</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
