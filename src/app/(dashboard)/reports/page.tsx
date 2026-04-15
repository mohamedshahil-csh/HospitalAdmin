"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { mockIncidentTrendData, mockTriageCategoryData } from "@/lib/mock-data";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Download, FileSpreadsheet, Mail, Calendar, BarChart3, Clock, Video, Ambulance, Wrench } from "lucide-react";

const COLORS = ["#DC2626", "#EAB308", "#16A34A", "#111827", "#3B82F6", "#9CA3AF"];

const responseTimeData = Array.from({ length: 14 }, (_, i) => ({
  name: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
  dispatchToScene: 8 + Math.floor(Math.random() * 8),
  sceneToHospital: 15 + Math.floor(Math.random() * 12),
}));

const teleLinkData = Array.from({ length: 14 }, (_, i) => ({
  name: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
  sessions: 3 + Math.floor(Math.random() * 8),
}));

const ambulancePerformance = [
  { vehicle: "KA01AB1234", trips: 42, avgEta: "11 min", breakdowns: 0, aliveRate: "95%" },
  { vehicle: "KA01CD5678", trips: 38, avgEta: "13 min", breakdowns: 1, aliveRate: "92%" },
  { vehicle: "KA02EF9012", trips: 35, avgEta: "14 min", breakdowns: 0, aliveRate: "97%" },
  { vehicle: "KA03GH3456", trips: 30, avgEta: "9 min", breakdowns: 0, aliveRate: "93%" },
  { vehicle: "KA06MN6789", trips: 28, avgEta: "12 min", breakdowns: 2, aliveRate: "89%" },
];

const outcomeData = [
  { name: "Alive", value: 85 },
  { name: "DOA", value: 8 },
  { name: "Refusal", value: 7 },
];

const OUTCOME_COLORS = ["#16A34A", "#111827", "#D97706"];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("incidents");

  const tabs = [
    { key: "incidents", label: "Incident Volume", icon: BarChart3 },
    { key: "response", label: "Response Time", icon: Clock },
    { key: "telelink", label: "TeleLink Utilisation", icon: Video },
    { key: "ambulance", label: "Ambulance Performance", icon: Ambulance },
    { key: "custom", label: "Custom Report", icon: Wrench },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Comprehensive operational analytics and insights</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap", activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "incidents" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Incidents by Day</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mockIncidentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }} />
                  <Bar dataKey="value" fill="#0066CC" radius={[4, 4, 0, 0]} name="Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">By Triage Category</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={mockTriageCategoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {mockTriageCategoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">By Outcome</h3>
            <div className="flex items-center gap-8">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={outcomeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
                      {outcomeData.map((_, i) => <Cell key={i} fill={OUTCOME_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {outcomeData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: OUTCOME_COLORS[i] }} />
                    <span className="text-sm text-gray-700">{d.name}: <strong>{d.value}%</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "response" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="kpi-card"><p className="text-sm text-gray-500 mb-1">Avg Dispatch-to-Scene</p><p className="text-3xl font-bold text-primary">12 min</p></div>
            <div className="kpi-card"><p className="text-sm text-gray-500 mb-1">Avg Scene-to-Hospital</p><p className="text-3xl font-bold text-primary">22 min</p></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Response Time Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" unit=" min" />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }} />
                <Legend />
                <Line type="monotone" dataKey="dispatchToScene" stroke="#0066CC" strokeWidth={2} name="Dispatch → Scene" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="sceneToHospital" stroke="#16A34A" strokeWidth={2} name="Scene → Hospital" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "telelink" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="kpi-card"><p className="text-sm text-gray-500 mb-1">Total Sessions</p><p className="text-3xl font-bold text-primary">64</p></div>
            <div className="kpi-card"><p className="text-sm text-gray-500 mb-1">Avg Duration</p><p className="text-3xl font-bold text-primary">9.2 min</p></div>
            <div className="kpi-card"><p className="text-sm text-gray-500 mb-1">Escalation Rate</p><p className="text-3xl font-bold text-amber-600">12%</p></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Sessions per Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teleLinkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }} />
                <Bar dataKey="sessions" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "ambulance" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Vehicle Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Vehicle</th><th>Trips</th><th>Avg ETA Accuracy</th><th>Breakdowns</th><th>Patient Alive Rate</th></tr></thead>
              <tbody>
                {ambulancePerformance.map((a) => (
                  <tr key={a.vehicle}>
                    <td className="font-mono font-medium">{a.vehicle}</td>
                    <td>{a.trips}</td>
                    <td>{a.avgEta}</td>
                    <td><span className={cn("badge", a.breakdowns === 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{a.breakdowns}</span></td>
                    <td className="font-medium">{a.aliveRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "custom" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Custom Report Builder</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date Range</label>
              <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Dimension</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none">
                <option>Date Range</option><option>Triage Code</option><option>Vehicle</option><option>Outcome</option><option>Ambulance Operator</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Metric</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none">
                <option>Count</option><option>Avg Response Time</option><option>TeleLink Sessions</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Triage Filter</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none">
                <option>All</option><option>RED</option><option>YELLOW</option><option>GREEN</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors">Generate Report</button>
            <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors"><FileSpreadsheet className="w-4 h-4" /> Export Excel</button>
            <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors"><Download className="w-4 h-4" /> Export PDF</button>
            <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors"><Mail className="w-4 h-4" /> Schedule Email</button>
          </div>
        </div>
      )}
    </div>
  );
}
