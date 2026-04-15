"use client";

import React, { useState } from "react";
import { cn, getVehicleStatusColor } from "@/lib/utils";
import { VEHICLE_STATUS_COLORS } from "@/lib/constants";
import { mockVehicles } from "@/lib/mock-data";
import {
  Search, Filter, MapPin, RefreshCw, Crosshair, Info,
  Ambulance, Fuel, Clock, User, Heart, ChevronDown,
} from "lucide-react";

export default function FleetMapPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLegend, setShowLegend] = useState(true);
  const [fleetToggle, setFleetToggle] = useState<"private" | "public">("private");

  const filteredVehicles = mockVehicles.filter((v) => {
    const matchesSearch = v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || v.type === filterType;
    const matchesStatus = filterStatus === "All" || v.status === filterStatus;
    const matchesFleet = fleetToggle === "private" ? v.isPrivateFleet : !v.isPrivateFleet;
    return matchesSearch && matchesType && matchesStatus;
  });

  const selected = mockVehicles.find((v) => v.id === selectedVehicle);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Visibility</h1>
          <p className="text-sm text-gray-500 mt-0.5">Live ambulance tracking and fleet overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <Crosshair className="w-4 h-4" /> Zoom to Hospital
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => setShowLegend(!showLegend)} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <Info className="w-4 h-4" /> Legend
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        {/* Left Sidebar: Vehicle List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {/* Fleet Toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 m-3 rounded-lg">
            <button onClick={() => setFleetToggle("private")} className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", fleetToggle === "private" ? "bg-white shadow-sm text-gray-900" : "text-gray-500")}>Private Fleet</button>
            <button onClick={() => setFleetToggle("public")} className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", fleetToggle === "public" ? "bg-white shadow-sm text-gray-900" : "text-gray-500")}>Public Network</button>
          </div>

          {/* Search & Filters */}
          <div className="px-3 pb-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search vehicle..." className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-primary outline-none" />
            </div>
            <div className="flex gap-2">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:border-primary outline-none">
                <option value="All">All Types</option>
                <option value="ALS">ALS</option><option value="BLS">BLS</option><option value="Transport">Transport</option>
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:border-primary outline-none">
                <option value="All">All Status</option>
                <option>Idle</option><option>En Route to Scene</option><option>At Scene</option><option>Transporting Patient</option><option>At This Hospital</option><option>Breakdown</option><option>Off Duty</option>
              </select>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="flex-1 overflow-y-auto">
            {filteredVehicles.map((vehicle) => {
              const statusStyle = VEHICLE_STATUS_COLORS[vehicle.status] || VEHICLE_STATUS_COLORS.Idle;
              return (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id === selectedVehicle ? null : vehicle.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left",
                    selectedVehicle === vehicle.id && "bg-primary-50"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full flex-shrink-0", statusStyle.dot)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 font-mono">{vehicle.registrationNumber}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md", statusStyle.bg, statusStyle.text)}>
                        {vehicle.status}
                      </span>
                      <span className="text-[10px] text-gray-400">{vehicle.type}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
          {/* Simulated Map */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
            {/* Grid lines for map feel */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.08]">
              {Array.from({ length: 40 }).map((_, i) => (
                <React.Fragment key={i}>
                  <line x1={i * 50} y1={0} x2={i * 50} y2="100%" stroke="#0066CC" strokeWidth="0.5" />
                  <line x1={0} y1={i * 50} x2="100%" y2={i * 50} stroke="#0066CC" strokeWidth="0.5" />
                </React.Fragment>
              ))}
            </svg>

            {/* Road simulation */}
            <div className="absolute top-[30%] left-0 right-0 h-1 bg-gray-300/40" />
            <div className="absolute top-[60%] left-0 right-0 h-1 bg-gray-300/40" />
            <div className="absolute left-[25%] top-0 bottom-0 w-1 bg-gray-300/40" />
            <div className="absolute left-[55%] top-0 bottom-0 w-1 bg-gray-300/40" />
            <div className="absolute left-[80%] top-0 bottom-0 w-1 bg-gray-300/40" />

            {/* Hospital marker */}
            <div className="absolute top-[45%] left-[55%] z-10">
              <div className="relative">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white text-xs font-bold">H</span>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-0.5 rounded text-[9px] whitespace-nowrap">
                  City General Hospital
                </div>
              </div>
            </div>

            {/* Vehicle markers */}
            {filteredVehicles.map((vehicle, i) => {
              const positions = [
                { top: "25%", left: "40%" },
                { top: "35%", left: "65%" },
                { top: "55%", left: "30%" },
                { top: "45%", left: "52%" },
                { top: "46%", left: "56%" },
                { top: "70%", left: "75%" },
                { top: "20%", left: "20%" },
                { top: "75%", left: "85%" },
              ];
              const pos = positions[i % positions.length];

              return (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className={cn(
                    "absolute z-10 group transition-transform hover:scale-125",
                    selectedVehicle === vehicle.id && "scale-125"
                  )}
                >
                  <div
                    className={cn("w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white",
                      vehicle.status === "Transporting Patient" && "animate-pulse"
                    )}
                    style={{ backgroundColor: getVehicleStatusColor(vehicle.status) }}
                  >
                    <Ambulance className="w-3.5 h-3.5 text-white" />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white px-2 py-1 rounded text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {vehicle.registrationNumber}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 z-20 animate-fade-in">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Status Legend</h4>
              <div className="space-y-1.5">
                {Object.entries(VEHICLE_STATUS_COLORS).map(([status, style]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", style.dot)} />
                    <span className="text-[10px] text-gray-600">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Vehicle Popup */}
          {selected && (
            <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 bg-white rounded-xl shadow-xl border border-gray-200 animate-slide-in-right z-20">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: getVehicleStatusColor(selected.status) }}>
                      <Ambulance className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold font-mono text-gray-900">{selected.registrationNumber}</p>
                      <span className="text-[10px] text-gray-500">{selected.type} — {selected.station}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedVehicle(null)} className="text-gray-400 hover:text-gray-600">×</button>
                </div>

                <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium mb-3",
                  VEHICLE_STATUS_COLORS[selected.status]?.bg, VEHICLE_STATUS_COLORS[selected.status]?.text)}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", VEHICLE_STATUS_COLORS[selected.status]?.dot)} />
                  {selected.status}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-500"><User className="w-3 h-3 inline mr-1" />Driver</p>
                    <p className="text-xs font-medium">{selected.driver.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-500"><Heart className="w-3 h-3 inline mr-1" />EMT</p>
                    <p className="text-xs font-medium">{selected.emt.name}</p>
                  </div>
                </div>

                {selected.currentPatient && (
                  <div className="bg-red-50 rounded-lg p-2 mb-3">
                    <p className="text-[10px] text-red-600 font-medium">Current Patient</p>
                    <p className="text-xs font-medium text-red-800">{selected.currentPatient.patientName} — {selected.currentPatient.triageCode}</p>
                    <p className="text-[10px] text-red-600">SpO2: {selected.currentPatient.vitals.spo2}% | HR: {selected.currentPatient.vitals.heartRate} | BP: {selected.currentPatient.vitals.bpSystolic}/{selected.currentPatient.vitals.bpDiastolic}</p>
                  </div>
                )}

                {/* Fuel Level */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1"><Fuel className="w-3 h-3" /> Fuel</span>
                    <span className="text-[10px] font-medium">{selected.fuelLevel}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all",
                      selected.fuelLevel > 50 ? "bg-green-500" : selected.fuelLevel > 25 ? "bg-amber-500" : "bg-red-500"
                    )} style={{ width: `${selected.fuelLevel}%` }} />
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Last GPS: {selected.lastGpsUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
