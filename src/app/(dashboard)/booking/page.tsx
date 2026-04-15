"use client";

import React, { useState } from "react";
import {
  Plus, Search, Filter, Eye, X, MapPin, Phone, Clock,
  ChevronRight, ChevronLeft, Check, Ambulance, User,
  AlertTriangle, FileText, Send, Loader2, Navigation,
} from "lucide-react";
import { cn, getTriageColor, formatDateTime } from "@/lib/utils";
import { URGENCY_LEVELS, BLOOD_GROUPS, TRIP_STATUS_COLORS } from "@/lib/constants";
import { mockTrips, mockVehicles } from "@/lib/mock-data";
import toast from "react-hot-toast";

type WizardStep = 1 | 2 | 3 | 4 | 5;

export default function BookingPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [activeTab, setActiveTab] = useState<"booking" | "trips">("trips");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showDetailPanel, setShowDetailPanel] = useState<string | null>(null);
  const [showTrackModal, setShowTrackModal] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    incidentType: "Emergency" as "Emergency" | "IFT",
    urgency: "RED",
    numberOfPatients: 1,
    notes: "",
    patientName: "",
    mrn: "",
    age: "",
    gender: "Male",
    bloodGroup: "Unknown",
    informerName: "",
    informerRelation: "",
    informerPhone: "",
    isMLC: false,
    firNumber: "",
    policeStation: "",
    officerName: "",
    originHospital: "",
    destinationHospital: "",
    transferReason: "",
    patientSummary: "",
    pickupAddress: "City General Hospital, 123 MG Road, Koramangala, Bangalore",
    landmark: "",
    selectedVehicle: "",
    autoDispatch: true,
  });

  const filteredTrips = mockTrips.filter((trip) => {
    const matchesSearch = trip.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = () => {
    toast.success("Ambulance booking confirmed! Trip ID: TRP-20260415-005");
    setShowWizard(false);
    setWizardStep(1);
  };

  const availableVehicles = mockVehicles.filter((v) => v.status === "Idle" || v.status === "At This Hospital");

  const stepLabels = ["Incident", "Patient", "Pickup", "Vehicle", "Confirm"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ambulance Booking</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create new bookings and manage active trips</p>
        </div>
        <button
          onClick={() => { setShowWizard(true); setActiveTab("booking"); }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          <Plus className="w-4 h-4" /> New Booking
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: "trips", label: "Trip Management" },
          { key: "booking", label: "New Booking" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as any); if (tab.key === "booking") setShowWizard(true); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trip Management Table */}
      {activeTab === "trips" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Filters */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search trip ID, patient..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary outline-none"
            >
              <option value="All">All Status</option>
              {["Pending", "Dispatched", "En Route", "At Scene", "Transporting", "At Hospital", "Completed", "Cancelled"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Patient</th>
                  <th>Pickup</th>
                  <th>Destination</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>ETA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => (
                  <tr key={trip.id}>
                    <td className="font-mono text-xs font-medium text-primary">{trip.id}</td>
                    <td>
                      <p className="font-medium text-gray-900">{trip.patient.name}</p>
                      {trip.patient.mrn && <p className="text-xs text-gray-400">MRN: {trip.patient.mrn}</p>}
                    </td>
                    <td className="max-w-[160px] truncate text-xs">{trip.pickupLocation.address}</td>
                    <td className="max-w-[160px] truncate text-xs">{trip.destination.address}</td>
                    <td className="font-mono text-xs">{trip.vehicle?.registrationNumber || "—"}</td>
                    <td>
                      <span className={cn("badge", TRIP_STATUS_COLORS[trip.status])}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="font-mono text-sm">{trip.eta ? `${trip.eta} min` : "—"}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setShowDetailPanel(trip.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {trip.status !== "Completed" && trip.status !== "Cancelled" && (
                          <button
                            onClick={() => setShowTrackModal(trip.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-green-600 transition-colors"
                            title="Track on Map"
                          >
                            <Navigation className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Share via SMS"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Showing {filteredTrips.length} trips</p>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-primary text-white">1</button>
              <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden animate-fade-in">
            {/* Wizard Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">New Ambulance Booking</h2>
              <button onClick={() => setShowWizard(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                {stepLabels.map((label, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                        wizardStep > i + 1 ? "bg-green-500 text-white" :
                        wizardStep === i + 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                      )}>
                        {wizardStep > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={cn("text-sm font-medium hidden sm:inline", wizardStep === i + 1 ? "text-gray-900" : "text-gray-400")}>{label}</span>
                    </div>
                    {i < 4 && <div className={cn("flex-1 h-0.5 mx-2", wizardStep > i + 1 ? "bg-green-500" : "bg-gray-200")} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {/* Step 1: Incident Details */}
              {wizardStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type</label>
                    <div className="flex gap-3">
                      {["Emergency", "IFT"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setForm({ ...form, incidentType: type as any })}
                          className={cn(
                            "flex-1 py-3 rounded-xl border-2 font-medium transition-all",
                            form.incidentType === type ? "border-primary bg-primary-50 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"
                          )}
                        >
                          {type === "IFT" ? "Inter-Facility Transfer" : type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                    <div className="grid grid-cols-2 gap-2">
                      {URGENCY_LEVELS.map((level) => (
                        <button
                          key={level.value}
                          onClick={() => setForm({ ...form, urgency: level.value })}
                          className={cn(
                            "py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-2",
                            form.urgency === level.value ? "border-primary bg-primary-50" : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className={cn("w-3 h-3 rounded-full", level.color)} />
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Patients</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setForm({ ...form, numberOfPatients: Math.max(1, form.numberOfPatients - 1) })} className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-50">−</button>
                      <span className="text-xl font-bold w-8 text-center">{form.numberOfPatients}</span>
                      <button onClick={() => setForm({ ...form, numberOfPatients: form.numberOfPatients + 1 })} className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-50">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none" placeholder="Any additional information..." />
                  </div>
                </div>
              )}

              {/* Step 2: Patient Details */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Name</label>
                      <input type="text" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" placeholder="Enter patient name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">MRN Lookup</label>
                      <div className="flex gap-2">
                        <input type="text" value={form.mrn} onChange={(e) => setForm({ ...form, mrn: e.target.value })} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" placeholder="MRN number" />
                        <button className="px-3 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"><Search className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
                      <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" placeholder="Age" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                      <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none">
                        <option>Male</option><option>Female</option><option>Unknown</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
                      <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none">
                        {BLOOD_GROUPS.map((bg) => <option key={bg}>{bg}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.isMLC} onChange={(e) => setForm({ ...form, isMLC: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm font-medium text-gray-700">Medico-Legal Case (MLC)</span>
                      </label>
                    </div>
                    {form.isMLC && (
                      <>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">FIR Number</label><input type="text" value={form.firNumber} onChange={(e) => setForm({ ...form, firNumber: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Police Station</label><input type="text" value={form.policeStation} onChange={(e) => setForm({ ...form, policeStation: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" /></div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Pickup Location */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Pickup Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input type="text" value={form.pickupAddress} onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Landmark (optional)</label>
                    <input type="text" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" placeholder="Near landmark..." />
                  </div>
                  {/* Map Placeholder */}
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 h-52 bg-gradient-to-br from-green-50 to-blue-50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-10 h-10 text-red-500 mx-auto mb-2 animate-bounce" />
                        <p className="text-sm text-gray-600 font-medium">Koramangala, Bangalore</p>
                        <p className="text-xs text-gray-400">12.9352°N, 77.6245°E</p>
                      </div>
                    </div>
                    {/* Simulated map grid */}
                    <svg className="absolute inset-0 w-full h-full opacity-10">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <React.Fragment key={i}>
                          <line x1={i * 40} y1={0} x2={i * 40} y2="100%" stroke="#0066CC" strokeWidth="0.5" />
                          <line x1={0} y1={i * 20} x2="100%" y2={i * 20} stroke="#0066CC" strokeWidth="0.5" />
                        </React.Fragment>
                      ))}
                    </svg>
                  </div>
                </div>
              )}

              {/* Step 4: Vehicle Assignment */}
              {wizardStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  {/* Auto-dispatch suggestion */}
                  <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Ambulance className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Recommended — Auto Dispatch</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700"><strong>KA03GH3456</strong> — BLS — ETA 5 min</p>
                        <p className="text-xs text-green-600">Crew: Driver Pratap Singh + EMT Santosh M</p>
                      </div>
                      <button
                        onClick={() => setForm({ ...form, selectedVehicle: "VEH004", autoDispatch: true })}
                        className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          form.autoDispatch && form.selectedVehicle === "VEH004" ? "bg-green-600 text-white" : "bg-white text-green-700 border border-green-300 hover:bg-green-100")}
                      >
                        {form.autoDispatch && form.selectedVehicle === "VEH004" ? <><Check className="w-4 h-4 inline mr-1" />Selected</> : "Confirm Auto-Dispatch"}
                      </button>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-400 my-2">— OR assign manually —</div>

                  {/* Available vehicles table */}
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="data-table">
                      <thead><tr><th>Vehicle</th><th>Type</th><th>Status</th><th>Crew</th><th>Action</th></tr></thead>
                      <tbody>
                        {availableVehicles.map((v) => (
                          <tr key={v.id} className={cn(form.selectedVehicle === v.id ? "bg-primary-50" : "")}>
                            <td className="font-mono text-sm font-medium">{v.registrationNumber}</td>
                            <td><span className="badge bg-gray-100 text-gray-700">{v.type}</span></td>
                            <td><span className="badge bg-green-100 text-green-700">{v.status}</span></td>
                            <td className="text-xs">{v.driver.name} + {v.emt.name}</td>
                            <td>
                              <button
                                onClick={() => setForm({ ...form, selectedVehicle: v.id, autoDispatch: false })}
                                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                  form.selectedVehicle === v.id ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}
                              >
                                {form.selectedVehicle === v.id ? "Selected" : "Assign"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Step 5: Confirm & Submit */}
              {wizardStep === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Incident Type", value: form.incidentType },
                      { label: "Urgency", value: form.urgency },
                      { label: "Patient", value: form.patientName || "Unknown" },
                      { label: "Age / Gender", value: `${form.age || "—"} / ${form.gender}` },
                      { label: "Pickup", value: form.pickupAddress },
                      { label: "Vehicle", value: form.selectedVehicle ? availableVehicles.find(v => v.id === form.selectedVehicle)?.registrationNumber || "Auto-Dispatch" : "Auto-Dispatch" },
                      { label: "MLC", value: form.isMLC ? "Yes" : "No" },
                      { label: "Patients", value: String(form.numberOfPatients) },
                    ].map((item) => (
                      <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                        <p className="text-sm font-medium text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {form.notes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-0.5">Notes</p>
                      <p className="text-sm text-gray-700">{form.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wizard Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => wizardStep > 1 ? setWizardStep((wizardStep - 1) as WizardStep) : setShowWizard(false)}
                className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> {wizardStep === 1 ? "Cancel" : "Back"}
              </button>
              {wizardStep < 5 ? (
                <button
                  onClick={() => setWizardStep((wizardStep + 1) as WizardStep)}
                  className="flex items-center gap-1 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" /> Confirm Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Track on Map Modal */}
      {showTrackModal && (
        <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Live Tracking</h3>
              <button onClick={() => setShowTrackModal(null)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="relative h-64 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                    <Ambulance className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Vehicle in transit</p>
                  <p className="text-xs text-gray-500">ETA: 8 minutes</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <button onClick={() => setShowTrackModal(null)} className="w-full py-2.5 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Slide-over */}
      {showDetailPanel && (
        <div className="fixed inset-0 z-[90] bg-black/30 flex justify-end" onClick={() => setShowDetailPanel(null)}>
          <div className="w-full max-w-md bg-white h-full shadow-2xl animate-slide-in-right overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Trip Details</h3>
              <button onClick={() => setShowDetailPanel(null)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            {(() => {
              const trip = mockTrips.find((t) => t.id === showDetailPanel);
              if (!trip) return <p className="p-6 text-gray-500">Trip not found</p>;
              return (
                <div className="p-6 space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Trip ID</p>
                    <p className="font-mono font-bold text-primary">{trip.id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Patient</p><p className="text-sm font-medium">{trip.patient.name}</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Status</p><span className={cn("badge mt-1", TRIP_STATUS_COLORS[trip.status])}>{trip.status}</span></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Type</p><p className="text-sm font-medium">{trip.incidentType}</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Urgency</p><p className="text-sm font-medium">{trip.urgency}</p></div>
                  </div>
                  {/* Timeline */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Trip Timeline</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Dispatched", time: trip.dispatchedAt },
                        { label: "At Scene", time: trip.atSceneAt },
                        { label: "Left Scene", time: trip.departedSceneAt },
                        { label: "At Hospital", time: trip.arrivedHospitalAt },
                        { label: "Completed", time: trip.completedAt },
                      ].filter((e) => e.time).map((event, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{event.label}</p>
                            <p className="text-xs text-gray-500">{event.time ? formatDateTime(event.time) : ""}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
