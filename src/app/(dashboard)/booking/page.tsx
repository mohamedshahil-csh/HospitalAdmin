"use client";

import React, { useState } from "react";
import {
  Plus, Search, Eye, X, MapPin,
  ChevronRight, ChevronLeft, Check, Ambulance,
  Send, Navigation, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { URGENCY_LEVELS, BLOOD_GROUPS, TRIP_STATUS_COLORS } from "@/lib/constants";
import { mockTrips, mockVehicles } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";


type WizardStep = 1 | 2 | 3 | 4 | 5;

export default function BookingPage() {
  const { user } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [activeTab, setActiveTab] = useState<"booking" | "trips">("trips");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showDetailPanel, setShowDetailPanel] = useState<string | null>(null);
  const [showTrackModal, setShowTrackModal] = useState<string | null>(null);
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
    isMLC: false,
    firNumber: "",
    policeStation: "",
    pickupAddress: `${user?.hospitalName || "City General Hospital"}, 123 MG Road, Koramangala, Bangalore`,
    landmark: "",
    selectedVehicle: "",
    autoDispatch: true,
  });

  const filteredTrips = mockTrips.filter((trip) => {
    const matchesSearch =
      trip.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableVehicles = mockVehicles.filter((v) => v.status === "Idle" || v.status === "At This Hospital");

  const stepLabels = ["Incident", "Patient", "Pickup", "Vehicle", "Confirm"];

  const handleSubmit = () => {
    toast.success("Ambulance booking confirmed! Trip ID: TRP-20260415-005");
    setShowWizard(false);
    setWizardStep(1);
    // Reset form if needed
    setForm({
      incidentType: "Emergency",
      urgency: "RED",
      numberOfPatients: 1,
      notes: "",
      patientName: "",
      mrn: "",
      age: "",
      gender: "Male",
      bloodGroup: "Unknown",
      isMLC: false,
      firNumber: "",
      policeStation: "",
      pickupAddress: `${user?.hospitalName || "City General Hospital"}, 123 MG Road, Koramangala, Bangalore`,
      landmark: "",
      selectedVehicle: "",
      autoDispatch: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ambulance Booking</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create new bookings and manage active trips</p>
        </div>
        <button
          onClick={() => {
            setShowWizard(true);
            setActiveTab("booking");
            setWizardStep(1);
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-all"
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
            onClick={() => {
              setActiveTab(tab.key as any);
              if (tab.key === "booking") {
                setShowWizard(true);
                setWizardStep(1);
              }
            }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trip Management */}
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

          {/* Table */}
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
                        <button onClick={() => setShowDetailPanel(trip.id)} className="p-1.5 rounded-lg hover:bg-gray-100">
                          <Eye className="w-4 h-4" />
                        </button>
                        {trip.status !== "Completed" && trip.status !== "Cancelled" && (
                          <button onClick={() => setShowTrackModal(trip.id)} className="p-1.5 rounded-lg hover:bg-gray-100">
                            <Navigation className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-gray-100">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================== WIZARD MODAL ====================== */}
      {showWizard && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">

            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">New Ambulance Booking</h2>
                <p className="text-sm text-gray-500">Step {wizardStep} of 5 • {stepLabels[wizardStep - 1]}</p>
              </div>
              <button onClick={() => setShowWizard(false)} className="p-2 hover:bg-gray-200 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Progress */}
            <div className="px-8 py-5 bg-white border-b">
              <div className="flex justify-between relative">
                {stepLabels.map((label, i) => (
                  <div key={i} className="flex flex-col items-center z-10">
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium border-4 border-white",
                      wizardStep > i + 1 ? "bg-green-500 text-white" :
                        wizardStep === i + 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
                    )}>
                      {wizardStep > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
                    </div>
                    <span className="text-xs mt-2 text-gray-500 hidden md:block">{label}</span>
                  </div>
                ))}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                <div
                  className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-300"
                  style={{ width: `${((wizardStep - 1) / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Incident */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Incident Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Emergency", "IFT"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setForm({ ...form, incidentType: type as any })}
                          className={cn("py-4 rounded-2xl border-2 font-medium",
                            form.incidentType === type ? "border-primary bg-primary/5" : "border-gray-200"
                          )}
                        >
                          {type === "IFT" ? "Inter-Facility Transfer" : "Emergency"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Urgency Level</label>
                    <div className="grid grid-cols-2 gap-3">
                      {URGENCY_LEVELS.map((level: any) => (
                        <button
                          key={level.value || level}
                          onClick={() => setForm({ ...form, urgency: level.value || level })}
                          className={cn("py-3 px-4 rounded-xl border-2 text-left",
                            form.urgency === (level.value || level) ? "border-red-500 bg-red-50" : "border-gray-200"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", level.color || "bg-red-500")} />
                            {level.label || level}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Patients</label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setForm({ ...form, numberOfPatients: Math.max(1, form.numberOfPatients - 1) })} className="w-12 h-12 rounded-2xl border text-2xl hover:bg-gray-50">-</button>
                      <span className="text-3xl font-bold w-12 text-center">{form.numberOfPatients}</span>
                      <button onClick={() => setForm({ ...form, numberOfPatients: form.numberOfPatients + 1 })} className="w-12 h-12 rounded-2xl border text-2xl hover:bg-gray-50">+</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Patient Details */}
              {wizardStep === 2 && (
                <div className="space-y-5">
                  <input
                    type="text"
                    placeholder="Patient Full Name"
                    value={form.patientName}
                    onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MRN (if known)" value={form.mrn} onChange={(e) => setForm({ ...form, mrn: e.target.value })} className="px-4 py-3 rounded-xl border border-gray-300 focus:border-primary outline-none" />
                    <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="px-4 py-3 rounded-xl border border-gray-300 focus:border-primary outline-none" />
                  </div>
                  {/* Add more patient fields as needed */}
                </div>
              )}

              {/* Step 3: Pickup */}
              {wizardStep === 3 && (
                <div className="space-y-5">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-400" />
                    <input
                      type="text"
                      value={form.pickupAddress}
                      onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                      className="w-full pl-12 py-3 rounded-xl border border-gray-300 focus:border-primary outline-none"
                      placeholder="Pickup Address"
                    />
                  </div>
                  <input type="text" placeholder="Landmark (optional)" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary outline-none" />
                </div>
              )}

              {/* Step 4: Vehicle */}
              {wizardStep === 4 && (
                <div className="space-y-6">
                  <div className="p-5 bg-green-50 border border-green-200 rounded-2xl">
                    <p className="font-medium text-green-800">Auto Dispatch Recommended</p>
                    <p className="text-sm text-green-600 mt-1">Nearest ambulance will be assigned automatically</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-3">Or choose manually:</p>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {availableVehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          onClick={() => setForm({ ...form, selectedVehicle: vehicle.id, autoDispatch: false })}
                          className={cn(
                            "p-4 rounded-2xl border cursor-pointer transition-all",
                            form.selectedVehicle === vehicle.id ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <p className="font-mono font-medium">{vehicle.registrationNumber}</p>
                          <p className="text-sm text-gray-600">{vehicle.type} • {vehicle.driver.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Confirm */}
              {wizardStep === 5 && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">Booking Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">Incident:</span> {form.incidentType}</div>
                    <div><span className="text-gray-500">Urgency:</span> {form.urgency}</div>
                    <div><span className="text-gray-500">Patient:</span> {form.patientName || "Not specified"}</div>
                    <div><span className="text-gray-500">Pickup:</span> {form.pickupAddress}</div>
                    <div><span className="text-gray-500">Vehicle:</span> {form.selectedVehicle ? "Manual" : "Auto Dispatch"}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="p-6 border-t flex justify-between bg-white">
              <button
                onClick={() => {
                  if (wizardStep === 1) setShowWizard(false);
                  else setWizardStep((wizardStep - 1) as WizardStep);
                }}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
              >
                {wizardStep === 1 ? "Cancel" : "Back"}
              </button>

              <button
                onClick={() => {
                  if (wizardStep < 5) {
                    setWizardStep((wizardStep + 1) as WizardStep);
                  } else {
                    handleSubmit();
                  }
                }}
                className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 flex items-center gap-2"
              >
                {wizardStep === 5 ? "Confirm Booking" : "Next"}
                {wizardStep < 5 && <ChevronRight className="w-4 h-4" />}
              </button>
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
                            <p className="text-xs text-gray-500">
                              {event.time ? new Date(event.time).toLocaleString() : ""}
                            </p>                          </div>
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
