"use client";

import React, { useState } from "react";
import { cn, getTriageColor, formatDate, formatDateTime } from "@/lib/utils";
import { mockEpcrs } from "@/lib/mock-data";
import { Search, Eye, X, ChevronRight, User, Heart, FileText, Clock, Activity } from "lucide-react";

export default function PatientHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Build patient list from ePCR records (deduplicated by name)
  const patientMap = new Map<string, any>();
  mockEpcrs.forEach((epcr) => {
    const key = epcr.patient.name;
    if (!patientMap.has(key)) {
      patientMap.set(key, {
        ...epcr.patient,
        incidents: [],
      });
    }
    patientMap.get(key).incidents.push(epcr);
  });
  const patients = Array.from(patientMap.values());

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.mrn && p.mrn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedPatientData = patients.find((p) => p.id === selectedPatient);

  if (selectedPatientData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedPatient(null)} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Patient Record</h1>
        </div>

        {/* Patient Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
              {selectedPatientData.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{selectedPatientData.name}</h2>
              <div className="flex items-center gap-4 mt-1">
                {selectedPatientData.mrn && <span className="text-sm text-gray-500">MRN: <strong>{selectedPatientData.mrn}</strong></span>}
                <span className="text-sm text-gray-500">Age: <strong>{selectedPatientData.age}</strong></span>
                <span className="text-sm text-gray-500">Gender: <strong>{selectedPatientData.gender}</strong></span>
                {selectedPatientData.bloodGroup && <span className="text-sm text-gray-500">Blood Group: <strong className="text-red-600">{selectedPatientData.bloodGroup}</strong></span>}
              </div>
            </div>
          </div>
        </div>

        {/* Medical History Summary */}
        {selectedPatientData.medicalHistory && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /> Medical History</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Conditions</p>
                <div className="flex flex-wrap gap-1">
                  {selectedPatientData.medicalHistory.conditions.length > 0 ?
                    selectedPatientData.medicalHistory.conditions.map((c: string, i: number) => (
                      <span key={i} className="badge bg-blue-100 text-blue-700">{c}</span>
                    )) : <span className="text-sm text-gray-400">None</span>}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Medications</p>
                <div className="flex flex-wrap gap-1">
                  {selectedPatientData.medicalHistory.medications.length > 0 ?
                    selectedPatientData.medicalHistory.medications.map((m: string, i: number) => (
                      <span key={i} className="badge bg-purple-100 text-purple-700">{m}</span>
                    )) : <span className="text-sm text-gray-400">None</span>}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Allergies</p>
                <div className="flex flex-wrap gap-1">
                  {selectedPatientData.medicalHistory.allergies.length > 0 ?
                    selectedPatientData.medicalHistory.allergies.map((a: string, i: number) => (
                      <span key={i} className="badge bg-red-100 text-red-700">{a}</span>
                    )) : <span className="text-sm text-gray-400">NKDA</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Incident Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Incident Timeline</h3>
          <div className="relative pl-6">
            <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200" />
            {selectedPatientData.incidents.map((incident: any, i: number) => {
              const triage = getTriageColor(incident.triageCode);
              return (
                <div key={i} className="relative mb-6 last:mb-0">
                  <div className={cn("absolute -left-3.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold", triage.bg, triage.text)}>
                    {i + 1}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 ml-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("badge text-[10px]", triage.bg, triage.text)}>{incident.triageCode}</span>
                        <span className="text-xs text-gray-500">{formatDate(incident.incidentDate)}</span>
                      </div>
                      <span className="font-mono text-[10px] text-gray-400">{incident.id}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{incident.sections.careData.chiefComplaint}</p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="text-xs"><span className="text-gray-500">Ambulance:</span> <span className="font-mono">{incident.ambulanceRegNo}</span></div>
                      <div className="text-xs"><span className="text-gray-500">Outcome:</span> <span className="font-medium">{incident.outcome}</span></div>
                      <div className="text-xs"><span className="text-gray-500">Received:</span> {incident.receivedBy}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient History</h1>
        <p className="text-sm text-gray-500 mt-0.5">Search and view patient records and incident history</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name, MRN, ABHA ID..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Patient Name</th><th>MRN</th><th>Age / Gender</th><th>Incidents</th><th>Last Visit</th><th>Last Triage</th><th>Action</th></tr></thead>
            <tbody>
              {filteredPatients.map((patient) => {
                const lastIncident = patient.incidents[0];
                const triage = getTriageColor(lastIncident.triageCode);
                return (
                  <tr key={patient.id}>
                    <td className="font-medium">{patient.name}</td>
                    <td className="font-mono text-xs">{patient.mrn || "—"}</td>
                    <td className="text-sm">{patient.age} / {patient.gender}</td>
                    <td><span className="badge bg-gray-100 text-gray-700">{patient.incidents.length}</span></td>
                    <td className="text-xs">{formatDate(lastIncident.incidentDate)}</td>
                    <td><span className={cn("badge text-[10px]", triage.bg, triage.text)}>{lastIncident.triageCode}</span></td>
                    <td>
                      <button onClick={() => setSelectedPatient(patient.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
