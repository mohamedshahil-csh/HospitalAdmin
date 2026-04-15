"use client";

import React, { useState, useEffect } from "react";
import {
  Activity, Ambulance, UserPlus, Video, FileText, Clock,
  TrendingUp, TrendingDown, ArrowUpRight, Plus, AlertTriangle,
  Heart, Zap, RefreshCw, Eye,
} from "lucide-react";
import { cn, getTriageColor, formatTime, getVitalStatus } from "@/lib/utils";
import {
  mockKPIData, mockIncomingPatients, mockActivities,
  mockIncidentTrendData, mockTriageCategoryData,
} from "@/lib/mock-data";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = {
  Activity, Ambulance, UserPlus, Video, FileText, Clock,
};

export default function DashboardPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showCodeModal, setShowCodeModal] = useState<string | null>(null);

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time hospital operations summary</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          Last updated: {formatTime(lastUpdated)}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {mockKPIData.map((kpi, i) => {
          const Icon = iconMap[kpi.icon] || Activity;
          return (
            <div key={i} className="kpi-card group cursor-pointer">
              {kpi.clickAction ? (
                <Link href={kpi.clickAction} className="block">
                  <KPICardContent kpi={kpi} Icon={Icon} />
                </Link>
              ) : (
                <KPICardContent kpi={kpi} Icon={Icon} />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Incoming Patients - 2/3 width */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
                <h2 className="font-semibold text-gray-900">Live Incoming Patients</h2>
                <span className="badge bg-primary-50 text-primary">{mockIncomingPatients.length} patients</span>
              </div>
              <Link href="/incoming-patients" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Triage</th>
                    <th>Patient</th>
                    <th>Ambulance</th>
                    <th>ETA</th>
                    <th>Chief Complaint</th>
                    <th>SpO2</th>
                    <th>HR</th>
                    <th>BP</th>
                    <th>TeleLink</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockIncomingPatients.sort((a, b) => a.eta - b.eta).map((patient) => {
                    const triage = getTriageColor(patient.triageCode);
                    return (
                      <tr key={patient.id}>
                        <td>
                          <span className={cn("badge", triage.bg, triage.text, triage.border)}>
                            {patient.triageCode}
                          </span>
                        </td>
                        <td>
                          <div>
                            <p className="font-medium text-gray-900">{patient.patientName}</p>
                            <p className="text-xs text-gray-500">{patient.gender}, ~{patient.estimatedAge}y</p>
                          </div>
                        </td>
                        <td className="font-mono text-xs">{patient.ambulanceRegNo}</td>
                        <td>
                          <span className={cn(
                            "font-bold font-mono",
                            patient.eta <= 5 ? "text-red-600 eta-countdown" : patient.eta <= 10 ? "text-amber-600" : "text-gray-700"
                          )}>
                            {patient.eta} min
                          </span>
                        </td>
                        <td className="max-w-[200px] truncate text-sm">{patient.chiefComplaint}</td>
                        <td>
                          <span className={cn(
                            "font-mono font-medium",
                            getVitalStatus("spo2", patient.vitals.spo2) === "critical" ? "vital-critical" :
                            getVitalStatus("spo2", patient.vitals.spo2) === "warning" ? "vital-warning" : "vital-normal"
                          )}>
                            {patient.vitals.spo2}%
                          </span>
                        </td>
                        <td>
                          <span className={cn(
                            "font-mono font-medium",
                            getVitalStatus("hr", patient.vitals.heartRate) === "critical" ? "vital-critical" :
                            getVitalStatus("hr", patient.vitals.heartRate) === "warning" ? "vital-warning" : "vital-normal"
                          )}>
                            {patient.vitals.heartRate}
                          </span>
                        </td>
                        <td>
                          <span className="font-mono text-sm">
                            {patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic}
                          </span>
                        </td>
                        <td>
                          {patient.isTeleLinkActive ? (
                            <div className="flex items-center gap-1">
                              <div className="relative w-3 h-3">
                                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" />
                                <div className="absolute inset-0 rounded-full bg-green-500" />
                              </div>
                              <span className="text-xs text-green-600 font-medium">Active</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td>
                          <Link href="/incoming-patients" className="text-primary hover:text-primary-700 transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed - 1/3 width */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="overflow-y-auto max-h-[480px]">
            {mockActivities.map((event) => {
              const activityIcons: Record<string, React.ElementType> = {
                Ambulance, Video, UserPlus, FileText, AlertTriangle, Plus: Plus,
                UserCheck: UserPlus,
              };
              const Icon = activityIcons[event.icon] || Activity;
              const colorMap: Record<string, string> = {
                dispatch: "bg-blue-100 text-blue-600",
                handoff: "bg-green-100 text-green-600",
                telelink: "bg-purple-100 text-purple-600",
                code: "bg-red-100 text-red-600",
                epcr: "bg-amber-100 text-amber-600",
                booking: "bg-indigo-100 text-indigo-600",
              };
              return (
                <div key={event.id} className="flex items-start gap-3 px-5 py-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", colorMap[event.type] || "bg-gray-100 text-gray-600")}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{event.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{formatTime(event.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions + Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/booking"
              className="flex items-center gap-2 p-3 rounded-xl bg-primary-50 text-primary hover:bg-primary-100 transition-colors group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">New Booking</span>
            </Link>
            {[
              { label: "Code Blue", color: "bg-blue-50 text-blue-600 hover:bg-blue-100", code: "blue" },
              { label: "Code Red", color: "bg-red-50 text-red-600 hover:bg-red-100", code: "red" },
              { label: "Code Trauma", color: "bg-amber-50 text-amber-600 hover:bg-amber-100", code: "trauma" },
            ].map((action) => (
              <button
                key={action.code}
                onClick={() => setShowCodeModal(action.code)}
                className={cn("flex items-center gap-2 p-3 rounded-xl transition-colors group", action.color)}
              >
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Incidents Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Incidents — Last 14 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockIncidentTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }}
              />
              <Line type="monotone" dataKey="value" stroke="#0066CC" strokeWidth={2.5} dot={{ r: 3, fill: "#0066CC" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Triage Category Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">By Triage Category (This Week)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockTriageCategoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#0066CC">
                {mockTriageCategoryData.map((entry, index) => {
                  const colors: Record<string, string> = { RED: "#DC2626", YELLOW: "#EAB308", GREEN: "#16A34A", BLACK: "#111827", BLUE: "#3B82F6", WHITE: "#9CA3AF" };
                  return <rect key={index} fill={colors[entry.name] || "#0066CC"} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Code Activation Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                showCodeModal === "blue" ? "bg-blue-100" : showCodeModal === "red" ? "bg-red-100" : "bg-amber-100"
              )}>
                <AlertTriangle className={cn(
                  "w-6 h-6",
                  showCodeModal === "blue" ? "text-blue-600" : showCodeModal === "red" ? "text-red-600" : "text-amber-600"
                )} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Activate Code {showCodeModal.charAt(0).toUpperCase() + showCodeModal.slice(1)}
                </h3>
                <p className="text-sm text-gray-500">This will alert all relevant staff</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to activate <strong>Code {showCodeModal.charAt(0).toUpperCase() + showCodeModal.slice(1)}</strong>?
              This action will immediately notify all on-duty emergency staff and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCodeModal(null); }}
                className={cn(
                  "flex-1 text-white py-2.5 rounded-lg font-medium transition-colors",
                  showCodeModal === "blue" ? "bg-blue-600 hover:bg-blue-700" :
                  showCodeModal === "red" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
                )}
              >
                Confirm Activation
              </button>
              <button onClick={() => setShowCodeModal(null)} className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KPICardContent({ kpi, Icon }: { kpi: any; Icon: React.ElementType }) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {kpi.delta !== undefined && (
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-medium rounded-full px-2 py-0.5",
            kpi.deltaType === "increase" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {kpi.deltaType === "increase" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {kpi.delta > 0 ? "+" : ""}{kpi.delta}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 animate-count-up">
        {kpi.label === "Avg Response Time" ? `${kpi.value} min` : kpi.value}
      </p>
      <p className="text-xs text-gray-500 mt-1 leading-tight">{kpi.label}</p>
    </>
  );
}
