"use client";

import React, { useState, useMemo } from "react";
import { cn, getVehicleStatusColor } from "@/lib/utils";
import { VEHICLE_STATUS_COLORS } from "@/lib/constants";
import { mockVehicles } from "@/lib/mock-data";
import {
  Search, RefreshCw, Crosshair, Info,
  Ambulance, Fuel, Clock, User, Heart,
} from "lucide-react";

export default function FleetMapPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"All" | "ALS" | "BLS" | "Transport">("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLegend, setShowLegend] = useState(true);
  const [fleetToggle, setFleetToggle] = useState<"private" | "public">("private");

  // Improved filtering with useMemo for better performance
  const filteredVehicles = useMemo(() => {
    return mockVehicles.filter((v) => {
      const matchesSearch = v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "All" || v.type === filterType;
      const matchesStatus = filterStatus === "All" || v.status === filterStatus;
      const matchesFleet = fleetToggle === "private" ? v.isPrivateFleet : !v.isPrivateFleet;

      return matchesSearch && matchesType && matchesStatus && matchesFleet;
    });
  }, [searchTerm, filterType, filterStatus, fleetToggle]);

  const selected = mockVehicles.find((v) => v.id === selectedVehicle);

  const emergencyActive = filteredVehicles.some(v => v.status === "Transporting Patient");

  return (
    <div className="space-y-4">
      {/* 🚨 Emergency Alert */}
      {emergencyActive && (
        <div className="bg-red-500/10 border border-red-400 text-red-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 animate-pulse">
          🚨 Emergency Transport Active
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fleet Command Center</h1>
          <p className="text-sm text-gray-500">Live ambulance tracking</p>
        </div>

        <div className="flex gap-2">
          <button className="btn">
            <Crosshair className="w-4 h-4" /> Focus
          </button>
          <button className="btn">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => setShowLegend(!showLegend)} className="btn">
            <Info className="w-4 h-4" /> Legend
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-160px)]">

        {/* LEFT PANEL */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 flex flex-col overflow-hidden">

          {/* Fleet Toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 m-3 rounded-lg">
            <button
              onClick={() => setFleetToggle("private")}
              className={cn("flex-1 py-1.5 text-xs rounded-md",
                fleetToggle === "private" ? "bg-white shadow text-gray-900" : "text-gray-500")}
            >
              Private
            </button>
            <button
              onClick={() => setFleetToggle("public")}
              className={cn("flex-1 py-1.5 text-xs rounded-md",
                fleetToggle === "public" ? "bg-white shadow text-gray-900" : "text-gray-500")}
            >
              Public
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                placeholder="Search registration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="px-3 pb-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-500 mb-1">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full p-2 border rounded-lg bg-white"
              >
                <option value="All">All</option>
                <option value="ALS">ALS</option>
                <option value="BLS">BLS</option>
                <option value="Transport">Transport</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white"
              >
                <option value="All">All Status</option>
                {Object.keys(VEHICLE_STATUS_COLORS).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="flex-1 overflow-y-auto px-2">
            {filteredVehicles.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No vehicles found</p>
            ) : (
              filteredVehicles.map((v) => {
                const status = VEHICLE_STATUS_COLORS[v.status] || { dot: "bg-gray-400", bg: "bg-gray-100", text: "text-gray-700" };

                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v.id)}
                    className={cn(
                      "w-full text-left p-3 mb-2 rounded-xl transition-all hover:bg-gray-100",
                      selectedVehicle === v.id && "bg-blue-50 border border-blue-200 shadow"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", status.dot)} />
                      <p className="font-mono text-sm font-semibold">{v.registrationNumber}</p>
                    </div>

                    <div className="flex justify-between mt-1 text-xs">
                      <span className={cn("px-1.5 py-0.5 rounded", status.bg, status.text)}>
                        {v.status}
                      </span>
                      <span className="text-gray-400">{v.type}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* MAP AREA */}
        <div className="lg:col-span-4 relative rounded-2xl overflow-hidden shadow-xl bg-[#0B1120]">

          {/* Dark Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E293B]" />

          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full">
              {Array.from({ length: 40 }).map((_, i) => (
                <React.Fragment key={i}>
                  <line x1={i * 50} y1="0" x2={i * 50} y2="100%" stroke="white" />
                  <line x1="0" y1={i * 50} x2="100%" y2={i * 50} stroke="white" />
                </React.Fragment>
              ))}
            </svg>
          </div>

          {/* Ambulances on Map - Clickable */}
          {filteredVehicles.map((v, i) => {
            const positions = [
              { top: "25%", left: "40%" },
              { top: "45%", left: "60%" },
              { top: "60%", left: "30%" },
              { top: "35%", left: "75%" },
            ];
            const pos = positions[i % positions.length];

            return (
              <button
                key={v.id}
                style={pos as React.CSSProperties}
                onClick={() => setSelectedVehicle(v.id)}   // ← This was the main fix
                className="absolute group hover:scale-125 transition-transform duration-200 z-10"
              >
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                    style={{ backgroundColor: getVehicleStatusColor(v.status) }}
                  >
                    <Ambulance className="w-5 h-5 text-white" />
                  </div>

                  {/* Emergency Ping Effect */}
                  {v.status === "Transporting Patient" && (
                    <div className="absolute inset-0 border-2 border-red-400 rounded-full animate-ping" />
                  )}
                </div>
              </button>
            );
          })}

          {/* Legend */}
          {showLegend && (
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur rounded-xl p-3 text-xs shadow">
              {Object.entries(VEHICLE_STATUS_COLORS).map(([s, st]) => (
                <div key={s} className="flex items-center gap-2 py-0.5">
                  <div className={cn("w-2 h-2 rounded-full", st.dot)} />
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* Vehicle Details Panel */}
          {selected && (
            <div className="absolute bottom-4 right-4 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20">
              {/* Top Gradient */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500" />

              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
                      style={{ backgroundColor: getVehicleStatusColor(selected.status) }}
                    >
                      <Ambulance className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold font-mono text-lg text-gray-900">
                        {selected.registrationNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selected.type} • {selected.station}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="text-2xl text-gray-400 hover:text-gray-600 leading-none"
                  >
                    ×
                  </button>
                </div>

                {/* Status */}
                <div
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4",
                    VEHICLE_STATUS_COLORS[selected.status]?.bg || "bg-gray-100",
                    VEHICLE_STATUS_COLORS[selected.status]?.text || "text-gray-700"
                  )}
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      VEHICLE_STATUS_COLORS[selected.status]?.dot || "bg-gray-500"
                    )}
                  />
                  {selected.status}
                </div>

                {/* Driver & EMT */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mb-1">
                      <User className="w-3 h-3" /> Driver
                    </p>
                    <p className="font-semibold text-sm">{selected.driver.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mb-1">
                      <Heart className="w-3 h-3" /> EMT
                    </p>
                    <p className="font-semibold text-sm">{selected.emt.name}</p>
                  </div>
                </div>

                {/* Current Patient */}
                {selected.currentPatient && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <p className="text-red-600 text-xs font-semibold mb-2">🚨 CURRENT PATIENT</p>
                    <p className="font-semibold">
                      {selected.currentPatient.patientName} — {selected.currentPatient.triageCode}
                    </p>
                    <p className="text-xs text-red-700 mt-2">
                      SpO2: {selected.currentPatient.vitals.spo2}% |
                      HR: {selected.currentPatient.vitals.heartRate} |
                      BP: {selected.currentPatient.vitals.bpSystolic}/{selected.currentPatient.vitals.bpDiastolic}
                    </p>
                  </div>
                )}

                {/* Fuel */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Fuel className="w-3 h-3" /> Fuel Level
                    </span>
                    <span className="font-medium">{selected.fuelLevel}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        selected.fuelLevel > 50 ? "bg-green-500" :
                          selected.fuelLevel > 25 ? "bg-amber-500" : "bg-red-500"
                      )}
                      style={{ width: `${selected.fuelLevel}%` }}
                    />
                  </div>
                </div>

                {/* Last GPS */}
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last updated: {selected.lastGpsUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}