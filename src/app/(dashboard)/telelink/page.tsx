"use client";

import React, { useState } from "react";
import { cn, getTriageColor, formatTime, formatDateTime } from "@/lib/utils";
import { mockTeleLinkRequests, mockIncomingPatients } from "@/lib/mock-data";
import {
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor,
  AlertTriangle, Clock, User, Heart, Activity, FileText,
  Send, ChevronUp, Pill, TrendingUp, TrendingDown, Minus,
  Search, Filter, Eye, X, Maximize2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TeleLinkPage() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [activeTab, setActiveTab] = useState<"queue" | "history">("queue");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [vitalTab, setVitalTab] = useState<"vitals" | "patient" | "notes">("vitals");

  const handleAccept = (id: string) => {
    setActiveSession(id);
    toast.success("TeleLink session started");
  };

  const handleEndCall = () => {
    setActiveSession(null);
    toast.success("TeleLink session ended. Notes saved.");
  };

  // Session history mock
  const sessionHistory = Array.from({ length: 8 }, (_, i) => ({
    id: `TLS-${String(i + 1).padStart(3, "0")}`,
    dateTime: new Date(Date.now() - i * 7200000),
    patient: ["Mohan Das", "Fatima Begum", "Ramesh Kumar", "Lakshmi Devi", "Abdul Kareem", "Priya Nair", "Vijay M", "Sunita R"][i],
    ambulance: ["KA01AB1234", "KA02EF9012", "KA03GH3456", "KA06MN6789", "KA01CD5678", "KA04IJ7890", "KA01AB1234", "KA02EF9012"][i],
    emt: ["Suresh Babu", "Deepak Shetty", "Santosh M", "Kiran Raj", "Manjunath K", "Naveen Kumar", "Suresh Babu", "Deepak Shetty"][i],
    duration: [8, 12, 5, 15, 7, 10, 6, 9][i],
    outcome: (["Stabilised", "Stabilised", "Transferred", "Stabilised", "Deteriorated", "Stabilised", "Stabilised", "DOA"] as const)[i],
    hasRecording: i < 5,
  }));

  const outcomeColors: Record<string, string> = {
    Stabilised: "bg-green-100 text-green-700",
    Deteriorated: "bg-red-100 text-red-700",
    Transferred: "bg-blue-100 text-blue-700",
    DOA: "bg-gray-900 text-white",
  };

  // If active session, show full session view
  if (activeSession) {
    const request = mockTeleLinkRequests.find((r) => r.id === activeSession);
    const patient = mockIncomingPatients[0]; // Use first incoming patient as mock

    return (
      <div className="h-[calc(100vh-180px)] flex gap-4">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative rounded-xl overflow-hidden bg-gray-900">
            {/* Main Video (EMT Feed) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <Video className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400 text-sm">Ambulance Camera Feed</p>
                <p className="text-gray-500 text-xs mt-1">EMT: {request?.requestingEmt || "Suresh Babu"}</p>
                <p className="text-gray-600 text-xs mt-0.5">KA01AB1234</p>
              </div>
            </div>

            {/* Self PiP */}
            <div className="absolute bottom-4 right-4 w-40 h-28 rounded-lg bg-gray-800 border-2 border-gray-700 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center mx-auto mb-1">
                  <User className="w-5 h-5 text-primary-300" />
                </div>
                <p className="text-gray-400 text-[10px]">Dr. Ananya Reddy</p>
              </div>
            </div>

            {/* Session Info */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="relative w-3 h-3">
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50" />
                <div className="absolute inset-0 rounded-full bg-red-500" />
              </div>
              <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">LIVE • 04:32</span>
            </div>

            {/* Patient Brief */}
            <div className="absolute top-4 right-4">
              <div className={cn("badge text-xs", getTriageColor(request?.triageCode || "RED").bg, getTriageColor(request?.triageCode || "RED").text)}>
                {request?.triageCode}
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-3 py-4">
            <button onClick={() => setIsMuted(!isMuted)} className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-colors", isMuted ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300")}>
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsCameraOn(!isCameraOn)} className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-colors", !isCameraOn ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300")}>
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button onClick={handleEndCall} className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg">
              <PhoneOff className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <Monitor className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors" title="Escalate to Specialist">
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Sidebar - Vitals & Patient Info */}
        <div className="w-80 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {[
              { key: "vitals", label: "Vitals", icon: Heart },
              { key: "patient", label: "Patient", icon: User },
              { key: "notes", label: "Notes", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setVitalTab(tab.key as any)}
                className={cn("flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border-b-2",
                  vitalTab === tab.key ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {vitalTab === "vitals" && (
              <div className="space-y-3">
                {[
                  { label: "SpO2", value: patient.vitals.spo2, unit: "%", color: "text-blue-600", trend: "down" as const },
                  { label: "Heart Rate", value: patient.vitals.heartRate, unit: "bpm", color: "text-red-600", trend: "up" as const },
                  { label: "BP Systolic", value: patient.vitals.bpSystolic, unit: "mmHg", color: "text-purple-600", trend: "down" as const },
                  { label: "BP Diastolic", value: patient.vitals.bpDiastolic, unit: "mmHg", color: "text-purple-500", trend: "stable" as const },
                  { label: "Temperature", value: patient.vitals.temperature || 37.2, unit: "°C", color: "text-amber-600", trend: "stable" as const },
                  { label: "RBS", value: patient.vitals.rbs || 245, unit: "mg/dL", color: "text-green-600", trend: "up" as const },
                ].map((vital) => (
                  <div key={vital.label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{vital.label}</span>
                      {vital.trend === "up" ? <TrendingUp className="w-3.5 h-3.5 text-red-400" /> :
                       vital.trend === "down" ? <TrendingDown className="w-3.5 h-3.5 text-amber-400" /> :
                       <Minus className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={cn("text-2xl font-bold font-mono", vital.color)}>{vital.value}</span>
                      <span className="text-xs text-gray-400">{vital.unit}</span>
                    </div>
                    {/* Mini sparkline placeholder */}
                    <div className="mt-2 h-6 bg-gray-200/50 rounded flex items-end px-0.5 pb-0.5 gap-px">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className={cn("flex-1 rounded-sm", vital.color.replace("text-", "bg-"))} style={{ height: `${20 + Math.random() * 80}%`, opacity: 0.3 + (i / 20) * 0.7 }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {vitalTab === "patient" && (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Name</p><p className="text-sm font-medium">{patient.patientName}</p></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Gender</p><p className="text-sm font-medium">{patient.gender}</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Est. Age</p><p className="text-sm font-medium">~{patient.estimatedAge}y</p></div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Chief Complaint</p><p className="text-sm font-medium">{patient.chiefComplaint}</p></div>
                <div><p className="text-xs font-semibold text-gray-700 mb-1.5">Symptoms</p>
                  <div className="flex flex-wrap gap-1">{patient.symptoms.map((s, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{s}</span>
                  ))}</div>
                </div>
              </div>
            )}

            {vitalTab === "notes" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Clinical Notes</label>
                  <textarea value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} rows={5} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary outline-none resize-none" placeholder="Enter clinical observations..." />
                  <p className="text-[10px] text-gray-400 mt-1">Auto-saved</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1 block"><Pill className="w-3.5 h-3.5" /> Prescription / Instructions</label>
                  <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary outline-none resize-none" placeholder="Advise aspirin 300mg..." />
                </div>
                <button className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-1">
                  <Send className="w-3.5 h-3.5" /> Save Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Queue / History View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">TeleLink Console</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage teleconsultation requests and sessions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab("queue")} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", activeTab === "queue" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}>
          Incoming Queue ({mockTeleLinkRequests.length})
        </button>
        <button onClick={() => setActiveTab("history")} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", activeTab === "history" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}>
          Session History
        </button>
      </div>

      {activeTab === "queue" && (
        <div className="space-y-3">
          {mockTeleLinkRequests.sort((a, b) => (a.isSOS ? -1 : 1) - (b.isSOS ? -1 : 1)).map((req) => {
            const triage = getTriageColor(req.triageCode);
            return (
              <div
                key={req.id}
                className={cn(
                  "bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md",
                  req.isSOS ? "border-red-300 ring-2 ring-red-200 animate-pulse" : "border-gray-100 shadow-sm"
                )}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {req.isSOS && (
                        <span className="badge bg-red-600 text-white animate-pulse">🆘 SOS</span>
                      )}
                      <span className={cn("badge", triage.bg, triage.text)}>{req.triageCode}</span>
                      <span className="text-xs text-gray-500 font-mono">{req.ambulanceId}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {req.waitTime === 0 ? "Just now" : `${req.waitTime} min ago`}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{req.patientBrief}</p>
                  <p className="text-xs text-gray-500">Requesting EMT: <strong>{req.requestingEmt}</strong></p>
                  <div className="flex items-center gap-2 mt-4">
                    <button onClick={() => handleAccept(req.id)} className="flex items-center gap-1.5 bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      <Phone className="w-4 h-4" /> Accept
                    </button>
                    <button className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors">
                      <Clock className="w-4 h-4" /> Defer
                    </button>
                    <button className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      <X className="w-4 h-4" /> Decline
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date/Time</th><th>Patient</th><th>Ambulance</th><th>EMT</th><th>Duration</th><th>Outcome</th><th>Recording</th>
                </tr>
              </thead>
              <tbody>
                {sessionHistory.map((s) => (
                  <tr key={s.id}>
                    <td className="text-xs">{formatDateTime(s.dateTime)}</td>
                    <td className="font-medium">{s.patient}</td>
                    <td className="font-mono text-xs">{s.ambulance}</td>
                    <td className="text-sm">{s.emt}</td>
                    <td className="font-mono text-sm">{s.duration} min</td>
                    <td><span className={cn("badge", outcomeColors[s.outcome])}>{s.outcome}</span></td>
                    <td>{s.hasRecording ? <Video className="w-4 h-4 text-primary" /> : <span className="text-gray-400">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
