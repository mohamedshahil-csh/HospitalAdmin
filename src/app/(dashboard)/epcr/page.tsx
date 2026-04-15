"use client";

import React, { useState } from "react";
import { cn, getTriageColor, formatDateTime, formatDate, maskAadhaar } from "@/lib/utils";
import { mockEpcrs } from "@/lib/mock-data";
import {
  Search, Filter, Eye, Printer, Download, Link2, CheckCircle,
  FileText, X, ChevronDown, Clock, MapPin, User, Heart, Activity,
  Pill, Camera, Package, Video, Award, Shield, AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function EpcrPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [triageFilter, setTriageFilter] = useState("All");
  const [selectedEpcr, setSelectedEpcr] = useState<string | null>(null);
  const [showAckModal, setShowAckModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = mockEpcrs.filter((e) => {
    const matchesSearch =
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.patient.mrn && e.patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "All" || e.status === statusFilter;
    const matchesTriage = triageFilter === "All" || e.triageCode === triageFilter;
    return matchesSearch && matchesStatus && matchesTriage;
  });

  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const selectedRecord = mockEpcrs.find((e) => e.id === selectedEpcr);

  const outcomeColors: Record<string, string> = {
    Alive: "bg-green-100 text-green-700",
    DOA: "bg-gray-900 text-white",
    Refusal: "bg-amber-100 text-amber-700",
  };

  if (selectedRecord) {
    const s = selectedRecord.sections;
    return (
      <div className="space-y-4">
        {/* Sticky Actions Bar */}
        <div className="sticky top-0 z-20 bg-medical-bg py-3 border-b border-gray-200 -mx-6 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedEpcr(null)} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedRecord.id}</h2>
                <p className="text-xs text-gray-500">{formatDateTime(selectedRecord.incidentDate)}</p>
              </div>
              <span className={cn("badge", getTriageColor(selectedRecord.triageCode).bg, getTriageColor(selectedRecord.triageCode).text)}>
                {selectedRecord.triageCode}
              </span>
              <span className={cn("badge", outcomeColors[selectedRecord.outcome])}>{selectedRecord.outcome}</span>
            </div>
            <div className="flex items-center gap-2">
              {selectedRecord.status === "Pending Acknowledgement" && (
                <button onClick={() => setShowAckModal(true)} className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-4 h-4" /> Acknowledge Receipt
                </button>
              )}
              <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" /> PDF
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <Link2 className="w-4 h-4" /> Link MRN
              </button>
            </div>
          </div>
        </div>

        {/* ePCR Sections */}
        <div className="space-y-4 max-w-5xl">
          {/* Section 1: Header */}
          <EpcrSection title="1. Incident Header" icon={<FileText className="w-4 h-4" />}>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Incident ID" value={s.header.incidentId} />
              <Field label="Ambulance" value={s.header.ambulanceNo} />
              <Field label="Date" value={formatDate(s.header.date)} />
              <Field label="Shift" value={s.header.shift} />
              <Field label="Station" value={s.header.station} />
              <Field label="Fleet Operator" value={s.header.fleetOperator} />
            </div>
          </EpcrSection>

          {/* Section 2: Crew */}
          <EpcrSection title="2. Crew Details" icon={<User className="w-4 h-4" />}>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Driver" value={s.crew.driver.name} extra={s.crew.driver.phone} />
              <Field label="EMT" value={s.crew.emt.name} extra={s.crew.emt.phone} />
              {s.crew.doctor && <Field label="Doctor" value={s.crew.doctor.name} />}
            </div>
          </EpcrSection>

          {/* Section 3: Incident */}
          <EpcrSection title="3. Incident Details" icon={<AlertTriangle className="w-4 h-4" />}>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Category" value={s.incident.category} />
              <Field label="Triage" value={s.incident.triageCode} badge />
              <Field label="Caller" value={`${s.incident.callerName} (${s.incident.callerPhone})`} />
              <Field label="Dispatch Time" value={formatDateTime(s.incident.dispatchTime)} />
              <Field label="Scene Arrival" value={formatDateTime(s.incident.sceneArrivalTime)} />
              <Field label="Hospital Arrival" value={formatDateTime(s.incident.hospitalArrivalTime)} />
            </div>
          </EpcrSection>

          {/* Section 4: Patient */}
          <EpcrSection title="4. Patient Demographics" icon={<User className="w-4 h-4" />}>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Name" value={s.patient.name} />
              <Field label="Age" value={String(s.patient.age)} />
              <Field label="Gender" value={s.patient.gender} />
              {s.patient.abhaId && <Field label="ABHA ID" value={s.patient.abhaId} />}
              {s.patient.aadhaar && <Field label="Aadhaar" value={maskAadhaar(s.patient.aadhaar)} />}
            </div>
          </EpcrSection>

          {/* Section 5: Medical History */}
          <EpcrSection title="5. Medical History" icon={<Heart className="w-4 h-4" />}>
            <div className="space-y-2">
              <div><span className="text-xs text-gray-500">Conditions: </span>
                {s.medicalHistory.conditions.map((c, i) => (
                  <span key={i} className="badge bg-blue-100 text-blue-700 mr-1">{c}</span>
                ))}
                {s.medicalHistory.conditions.length === 0 && <span className="text-sm text-gray-400">None reported</span>}
              </div>
              <div><span className="text-xs text-gray-500">Medications: </span>
                {s.medicalHistory.medications.map((m, i) => (
                  <span key={i} className="badge bg-purple-100 text-purple-700 mr-1">{m}</span>
                ))}
              </div>
              <div><span className="text-xs text-gray-500">Allergies: </span>
                {s.medicalHistory.allergies.map((a, i) => (
                  <span key={i} className="badge bg-red-100 text-red-700 mr-1">{a}</span>
                ))}
                {s.medicalHistory.allergies.length === 0 && <span className="text-sm text-gray-400">NKDA</span>}
              </div>
            </div>
          </EpcrSection>

          {/* Section 6: Primary Assessment */}
          <EpcrSection title="6. Primary Assessment" icon={<Activity className="w-4 h-4" />}>
            <div className="grid grid-cols-4 gap-3">
              <Field label="GCS Total" value={`${s.primaryAssessment.gcsTotal}/15`} highlight />
              <Field label="Eye" value={`E${s.primaryAssessment.gcsEye}`} />
              <Field label="Verbal" value={`V${s.primaryAssessment.gcsVerbal}`} />
              <Field label="Motor" value={`M${s.primaryAssessment.gcsMotor}`} />
              <Field label="AVPU" value={s.primaryAssessment.avpu} />
              <Field label="Left Pupil" value={s.primaryAssessment.pupilLeft} />
              <Field label="Right Pupil" value={s.primaryAssessment.pupilRight} />
            </div>
          </EpcrSection>

          {/* Section 7: Vitals Timeline */}
          <EpcrSection title="7. Vitals Timeline" icon={<Heart className="w-4 h-4" />}>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Time</th><th>SpO2 (%)</th><th>HR (bpm)</th><th>BP (mmHg)</th><th>Temp (°C)</th><th>RBS (mg/dL)</th></tr></thead>
                <tbody>
                  {s.vitalsTimeline.map((v, i) => (
                    <tr key={i}>
                      <td className="font-mono text-xs">{formatDateTime(v.timestamp)}</td>
                      <td className="font-mono">{v.spo2}</td>
                      <td className="font-mono">{v.heartRate}</td>
                      <td className="font-mono">{v.bpSystolic}/{v.bpDiastolic}</td>
                      <td className="font-mono">{v.temperature?.toFixed(1)}</td>
                      <td className="font-mono">{v.rbs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </EpcrSection>

          {/* Section 8: Care Data */}
          <EpcrSection title="8. Chief Complaint & Care" icon={<FileText className="w-4 h-4" />}>
            <div className="space-y-3">
              <Field label="Chief Complaint" value={s.careData.chiefComplaint} />
              <div><p className="text-xs text-gray-500 mb-1">HPI Narrative</p><p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{s.careData.hpiNarrative}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">Interventions</p>
                {s.careData.interventions.map((int, i) => (
                  <div key={i} className="flex items-center gap-2 py-1"><Clock className="w-3 h-3 text-gray-400" /><span className="text-xs text-gray-500">{formatDateTime(int.time)}</span><span className="text-sm">{int.intervention}</span><span className="text-xs text-gray-400">by {int.by}</span></div>
                ))}
              </div>
            </div>
          </EpcrSection>

          {/* Section 9: Medications */}
          <EpcrSection title="9. Medications Given" icon={<Pill className="w-4 h-4" />}>
            <table className="data-table"><thead><tr><th>Drug</th><th>Dose</th><th>Route</th><th>Time</th><th>By</th></tr></thead>
              <tbody>{s.medicationsGiven.map((m, i) => (<tr key={i}><td>{m.drug}</td><td>{m.dose}</td><td>{m.route}</td><td className="text-xs">{formatDateTime(m.time)}</td><td>{m.administeredBy}</td></tr>))}</tbody>
            </table>
          </EpcrSection>

          {/* Section 10: Inventory */}
          <EpcrSection title="10. Inventory Used" icon={<Package className="w-4 h-4" />}>
            <table className="data-table"><thead><tr><th>Item</th><th>Qty</th><th>Batch No.</th><th>Expiry</th></tr></thead>
              <tbody>{s.inventoryUsed.map((item, i) => (<tr key={i}><td>{item.item}</td><td>{item.quantity}</td><td className="font-mono text-xs">{item.batchNo}</td><td className="text-xs">{formatDate(item.expiry)}</td></tr>))}</tbody>
            </table>
          </EpcrSection>

          {/* Section 11: TeleLink */}
          <EpcrSection title="11. TeleLink Session" icon={<Video className="w-4 h-4" />}>
            {s.telelink.sessionId ? (
              <div className="grid grid-cols-3 gap-3">
                <Field label="Session ID" value={s.telelink.sessionId} />
                <Field label="ERCP Doctor" value={s.telelink.ercpName || "—"} />
                <Field label="Duration" value={`${s.telelink.duration || 0} min`} />
                {s.telelink.adviceGiven && <div className="col-span-3"><Field label="Advice Given" value={s.telelink.adviceGiven} /></div>}
              </div>
            ) : <p className="text-sm text-gray-400">No TeleLink session for this incident</p>}
          </EpcrSection>

          {/* Sections 12-17 simplified */}
          <EpcrSection title="12-13. Photos & Valuables" icon={<Camera className="w-4 h-4" />}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Valuables at Scene" value={s.valuables.atScene} />
              <Field label="Valuables at Handoff" value={s.valuables.atHandoff} />
            </div>
          </EpcrSection>

          <EpcrSection title="14. Handoff" icon={<Award className="w-4 h-4" />}>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Hospital" value={s.handoff.receivingHospital} />
              <Field label="Clinician" value={s.handoff.receivingClinician} />
              <Field label="Time" value={formatDateTime(s.handoff.time)} />
            </div>
          </EpcrSection>

          <EpcrSection title="15. Outcome" icon={<CheckCircle className="w-4 h-4" />}>
            <div className="space-y-2">
              <span className={cn("badge", outcomeColors[s.outcome.outcome])}>{s.outcome.outcome}</span>
              <p className="text-sm text-gray-700">{s.outcome.clinicalImpression}</p>
            </div>
          </EpcrSection>

          <EpcrSection title="16. Signatures" icon={<Award className="w-4 h-4" />}>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-2">EMT Signature</p>
                {s.signatures.emtSignature ? <div className="h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">Signed ✓</div> : <p className="text-sm text-gray-400">Pending</p>}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-2">Clinician Signature</p>
                {s.signatures.clinicianSignature ? <div className="h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">Signed ✓</div> : <p className="text-sm text-gray-400">Pending</p>}
              </div>
            </div>
          </EpcrSection>

          {s.mlcSection && (
            <EpcrSection title="17. MLC Section" icon={<Shield className="w-4 h-4" />}>
              <div className="grid grid-cols-3 gap-3">
                <Field label="FIR Number" value={s.mlcSection.firNumber} />
                <Field label="Police Station" value={s.mlcSection.policeStation} />
                <Field label="Officer" value={`${s.mlcSection.officerName} (${s.mlcSection.officerPhone})`} />
              </div>
            </EpcrSection>
          )}
        </div>

        {/* Acknowledge Modal */}
        {showAckModal && (
          <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4 animate-fade-in">
              <h3 className="text-lg font-bold mb-2">Acknowledge ePCR Receipt</h3>
              <p className="text-sm text-gray-600 mb-4">By acknowledging, you confirm receipt of this ePCR for patient <strong>{selectedRecord.patient.name}</strong>.</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Digital Signature</p>
                <div className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-400">Click to sign</div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowAckModal(false); toast.success("ePCR acknowledged successfully"); }} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700">Acknowledge</button>
                <button onClick={() => setShowAckModal(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ePCR Records</h1>
        <p className="text-sm text-gray-500 mt-0.5">View and manage electronic Patient Care Reports</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search ePCR ID, patient, MRN..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary outline-none">
            <option value="All">All Status</option>
            <option>Acknowledged</option><option>Pending Acknowledgement</option>
          </select>
          <select value={triageFilter} onChange={(e) => setTriageFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary outline-none">
            <option value="All">All Triage</option>
            <option>RED</option><option>YELLOW</option><option>GREEN</option><option>BLACK</option><option>BLUE</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>ePCR ID</th><th>Date</th><th>Patient</th><th>Ambulance</th><th>Triage</th><th>Outcome</th><th>Received By</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {paginated.map((epcr) => {
                const triage = getTriageColor(epcr.triageCode);
                return (
                  <tr key={epcr.id}>
                    <td className="font-mono text-xs font-medium text-primary">{epcr.id}</td>
                    <td className="text-xs">{formatDate(epcr.incidentDate)}</td>
                    <td>
                      <p className="font-medium">{epcr.patient.name}</p>
                      {epcr.patient.mrn && <p className="text-[10px] text-gray-400">MRN: {epcr.patient.mrn}</p>}
                    </td>
                    <td className="font-mono text-xs">{epcr.ambulanceRegNo}</td>
                    <td><span className={cn("badge text-[10px]", triage.bg, triage.text)}>{epcr.triageCode}</span></td>
                    <td><span className={cn("badge text-[10px]", outcomeColors[epcr.outcome])}>{epcr.outcome}</span></td>
                    <td className="text-xs">{epcr.receivedBy}</td>
                    <td>
                      <span className={cn("badge text-[10px]", epcr.status === "Acknowledged" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                        {epcr.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => setSelectedEpcr(epcr.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">Previous</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={cn("px-3 py-1.5 text-sm rounded-lg", currentPage === i + 1 ? "bg-primary text-white" : "border border-gray-300 hover:bg-gray-50")}>{i + 1}</button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EpcrSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
        {icon}
        <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, value, extra, badge, highlight }: { label: string; value: string; extra?: string; badge?: boolean; highlight?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5">
      <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
      {badge ? (
        <span className={cn("badge text-xs", getTriageColor(value).bg, getTriageColor(value).text)}>{value}</span>
      ) : (
        <p className={cn("text-sm font-medium", highlight ? "text-primary text-lg" : "text-gray-900")}>{value}</p>
      )}
      {extra && <p className="text-[10px] text-gray-400 mt-0.5">{extra}</p>}
    </div>
  );
}
