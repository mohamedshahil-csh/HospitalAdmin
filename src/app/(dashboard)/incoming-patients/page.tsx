"use client";

import React, { useState, useEffect } from "react";
import { cn, getTriageColor, getVitalStatus, formatTime } from "@/lib/utils";
import { mockIncomingPatients } from "@/lib/mock-data";
import {
  Monitor, MonitorOff, AlertTriangle, Clock, Activity,
  Eye, Zap, ChevronDown, X, TrendingUp, TrendingDown,
  Minus, RefreshCw, Maximize2, Minimize2,
} from "lucide-react";

export default function IncomingPatientsPage() {
  const [tvMode, setTvMode] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [etaCountdowns, setEtaCountdowns] = useState<Record<string, number>>({});

  // Clock + ETA countdown
  useEffect(() => {
    const initial: Record<string, number> = {};
    mockIncomingPatients.forEach((p) => { initial[p.id] = p.eta * 60; });
    setEtaCountdowns(initial);

    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setEtaCountdowns((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => { if (next[k] > 0) next[k]--; });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return "ARRIVED";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const VitalDisplay = ({ label, value, unit, vital }: { label: string; value: number; unit: string; vital: string }) => {
    const status = getVitalStatus(vital, value);
    const trend = Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable";
    return (
      <div className={cn("text-center", tvMode ? "p-2" : "")}>
        <p className={cn("text-[10px] text-gray-500 mb-0.5", tvMode && "text-gray-400 text-xs")}>{label}</p>
        <div className="flex items-center justify-center gap-0.5">
          <span className={cn(
            "font-bold font-mono",
            tvMode ? "text-lg" : "text-sm",
            status === "critical" ? "text-red-500" : status === "warning" ? "text-amber-500" : "text-green-600"
          )}>{value}</span>
          {trend === "up" && <TrendingUp className={cn("w-3 h-3", status === "critical" ? "text-red-400" : "text-green-400")} />}
          {trend === "down" && <TrendingDown className={cn("w-3 h-3", status === "critical" ? "text-red-400" : "text-amber-400")} />}
          {trend === "stable" && <Minus className="w-3 h-3 text-gray-400" />}
        </div>
        <p className={cn("text-[9px] text-gray-400", tvMode && "text-[10px]")}>{unit}</p>
      </div>
    );
  };

  const patientCards = mockIncomingPatients.sort((a, b) => {
    const order: Record<string, number> = { BLACK: 0, RED: 1, YELLOW: 2, GREEN: 3, WHITE: 4, BLUE: 5 };
    return (order[a.triageCode] || 5) - (order[b.triageCode] || 5);
  });

  return (
    <div className={cn(tvMode ? "tv-mode p-6" : "space-y-6")}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {tvMode && (
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mr-2">
              <Activity className="w-6 h-6 text-primary-300" />
            </div>
          )}
          <div>
            <h1 className={cn("font-bold", tvMode ? "text-3xl text-white" : "text-2xl text-gray-900")}>ED Pre-Alert Board</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={cn("text-sm", tvMode ? "text-gray-400" : "text-gray-500")}>
                {patientCards.length} incoming patients
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
                <span className={cn("text-xs", tvMode ? "text-gray-500" : "text-gray-400")}>
                  Updated: {formatTime(lastUpdated)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {tvMode && (
            <div className="text-right mr-4">
              <p className="text-3xl font-bold text-white font-mono">
                {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
              </p>
              <p className="text-xs text-gray-500">
                {currentTime.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
          )}
          <button
            onClick={() => setTvMode(!tvMode)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              tvMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-900 text-white hover:bg-gray-800"
            )}
          >
            {tvMode ? <><Minimize2 className="w-4 h-4" /> Exit TV Mode</> : <><Maximize2 className="w-4 h-4" /> TV Display Mode</>}
          </button>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className={cn("grid gap-4", tvMode ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-2")}>
        {patientCards.map((patient) => {
          const triage = getTriageColor(patient.triageCode);
          const countdown = etaCountdowns[patient.id] || 0;
          const isArriving = countdown < 120;

          return (
            <div
              key={patient.id}
              className={cn(
                "rounded-xl overflow-hidden transition-all hover:shadow-lg",
                tvMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100 shadow-sm",
                isArriving && "ring-2 ring-red-500/50"
              )}
            >
              <div className="flex">
                {/* Triage Color Bar */}
                <div className={cn("w-2 flex-shrink-0", triage.bg)} />

                <div className="flex-1 p-4">
                  {/* Top Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("badge text-xs", triage.bg, triage.text, triage.border)}>{patient.triageCode}</span>
                      <span className={cn("font-mono text-xs", tvMode ? "text-gray-400" : "text-gray-500")}>{patient.ambulanceRegNo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* ETA Countdown */}
                      <div className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono font-bold",
                        isArriving ? "bg-red-100 text-red-600 eta-countdown" : "bg-gray-100 text-gray-700",
                        tvMode && (isArriving ? "bg-red-900/50 text-red-400" : "bg-gray-800 text-gray-300")
                      )}>
                        <Clock className="w-3.5 h-3.5" />
                        <span className={cn(tvMode ? "text-lg" : "text-sm")}>{formatCountdown(countdown)}</span>
                      </div>
                      {patient.isTeleLinkActive && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                          <div className="relative w-2.5 h-2.5">
                            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" />
                            <div className="absolute inset-0 rounded-full bg-green-500" />
                          </div>
                          <span className="text-[10px] font-medium">TeleLink</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="mb-3">
                    <h3 className={cn("font-semibold", tvMode ? "text-white text-lg" : "text-gray-900")}>
                      {patient.patientName}
                      {patient.patientName === "UNKNOWN" && (
                        <span className={cn("font-normal text-sm ml-2", tvMode ? "text-gray-500" : "text-gray-400")}>
                          — {patient.gender}, Est. Age {patient.estimatedAge}
                        </span>
                      )}
                    </h3>
                    <p className={cn("text-sm mt-0.5", tvMode ? "text-gray-300" : "text-gray-600")}>{patient.chiefComplaint}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {patient.symptoms.slice(0, 3).map((s, i) => (
                        <span key={i} className={cn("text-[10px] px-2 py-0.5 rounded-full",
                          tvMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                        )}>{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Vitals Row */}
                  <div className={cn("grid grid-cols-5 gap-1 p-2 rounded-lg", tvMode ? "bg-gray-800" : "bg-gray-50")}>
                    <VitalDisplay label="SpO2" value={patient.vitals.spo2} unit="%" vital="spo2" />
                    <VitalDisplay label="HR" value={patient.vitals.heartRate} unit="bpm" vital="hr" />
                    <VitalDisplay label="BP" value={patient.vitals.bpSystolic} unit={`/${patient.vitals.bpDiastolic}`} vital="bpSys" />
                    {patient.vitals.temperature && <VitalDisplay label="Temp" value={patient.vitals.temperature} unit="°C" vital="temp" />}
                    {patient.vitals.rbs && <VitalDisplay label="RBS" value={patient.vitals.rbs} unit="mg/dL" vital="rbs" />}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3">
                    <p className={cn("text-[10px]", tvMode ? "text-gray-500" : "text-gray-400")}>
                      Crew: {patient.driver} + {patient.emt}
                    </p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedPatient(patient.id)} className={cn(
                        "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                        tvMode ? "bg-primary/20 text-primary-300 hover:bg-primary/30" : "bg-primary-50 text-primary hover:bg-primary-100"
                      )}>
                        <Eye className="w-3.5 h-3.5 inline mr-1" /> Details
                      </button>
                      <div className="relative group">
                        <button className={cn(
                          "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1",
                          tvMode ? "bg-red-900/30 text-red-400 hover:bg-red-900/50" : "bg-red-50 text-red-600 hover:bg-red-100"
                        )}>
                          <Zap className="w-3.5 h-3.5" /> Code <ChevronDown className="w-3 h-3" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                          {["Code Red", "Code Blue", "Code Trauma"].map((code) => (
                            <button key={code} className="w-full px-4 py-2 text-xs text-left hover:bg-gray-50 text-gray-700 whitespace-nowrap">{code}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (() => {
        const patient = mockIncomingPatients.find((p) => p.id === selectedPatient);
        if (!patient) return null;
        const triage = getTriageColor(patient.triageCode);

        return (
          <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden animate-fade-in">
              <div className={cn("px-6 py-4 flex items-center justify-between", triage.bg)}>
                <div>
                  <h3 className={cn("text-lg font-bold", triage.text)}>{patient.patientName}</h3>
                  <p className={cn("text-sm opacity-80", triage.text)}>{patient.chiefComplaint}</p>
                </div>
                <button onClick={() => setSelectedPatient(null)} className={cn("p-1 rounded-lg hover:bg-white/20", triage.text)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Ambulance</p><p className="text-sm font-mono font-medium">{patient.ambulanceRegNo}</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">ETA</p><p className="text-sm font-mono font-bold">{formatCountdown(etaCountdowns[patient.id] || 0)}</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Gender / Age</p><p className="text-sm font-medium">{patient.gender}, ~{patient.estimatedAge}y</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">TeleLink</p><p className="text-sm font-medium">{patient.isTeleLinkActive ? "🟢 Active" : "—"}</p></div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Current Vitals</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "SpO2", value: `${patient.vitals.spo2}%`, vital: "spo2", raw: patient.vitals.spo2 },
                      { label: "Heart Rate", value: `${patient.vitals.heartRate} bpm`, vital: "hr", raw: patient.vitals.heartRate },
                      { label: "Blood Pressure", value: `${patient.vitals.bpSystolic}/${patient.vitals.bpDiastolic} mmHg`, vital: "bpSys", raw: patient.vitals.bpSystolic },
                      ...(patient.vitals.temperature ? [{ label: "Temperature", value: `${patient.vitals.temperature}°C`, vital: "temp", raw: patient.vitals.temperature }] : []),
                      ...(patient.vitals.rbs ? [{ label: "RBS", value: `${patient.vitals.rbs} mg/dL`, vital: "rbs", raw: patient.vitals.rbs }] : []),
                    ].map((v) => {
                      const status = getVitalStatus(v.vital, v.raw);
                      return (
                        <div key={v.label} className={cn("p-3 rounded-lg border",
                          status === "critical" ? "bg-red-50 border-red-200" : status === "warning" ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"
                        )}>
                          <p className="text-xs text-gray-500 mb-0.5">{v.label}</p>
                          <p className={cn("text-lg font-bold font-mono",
                            status === "critical" ? "text-red-600" : status === "warning" ? "text-amber-600" : "text-green-600"
                          )}>{v.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Symptoms</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {patient.symptoms.map((s, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Crew</h4>
                  <p className="text-sm text-gray-600">Driver: {patient.driver} • EMT: {patient.emt}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
