// ===== AUTH & USER TYPES =====
export type UserRole = "hospital_admin" | "hospital_coordinator" | "ed_doctor";

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  department?: string;
  hospitalId: string;
  hospitalName: string;
  avatar?: string;
  lastLogin: Date;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpiresAt: Date | null;
  login: (username: string, password: string) => Promise<{ success: boolean; mfaRequired: boolean }>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  resetSessionTimer: () => void;
}

// ===== PATIENT TYPES =====
export type TriageCode = "BLACK" | "RED" | "YELLOW" | "GREEN" | "WHITE" | "BLUE";
export type Gender = "Male" | "Female" | "Unknown";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "Unknown";
export type Outcome = "Alive" | "DOA" | "Refusal" | "Transferred" | "Stabilised" | "Deteriorated";

export interface Patient {
  id: string;
  name: string;
  mrn?: string;
  abhaId?: string;
  aadhaar?: string;
  age?: number;
  gender: Gender;
  bloodGroup?: BloodGroup;
  phone?: string;
  address?: string;
  insurance?: string;
  medicalHistory: MedicalHistory;
}

export interface MedicalHistory {
  conditions: string[];
  medications: string[];
  allergies: string[];
  surgeries?: string[];
  phrReference?: string;
}

// ===== VITALS TYPES =====
export interface Vitals {
  timestamp: Date;
  spo2: number;
  heartRate: number;
  bpSystolic: number;
  bpDiastolic: number;
  temperature?: number;
  rbs?: number;
  respiratoryRate?: number;
  gcs?: number;
}

export interface VitalTrend {
  vital: string;
  direction: "up" | "down" | "stable";
  values: { time: Date; value: number }[];
}

// ===== AMBULANCE / VEHICLE TYPES =====
export type VehicleType = "ALS" | "BLS" | "Transport";
export type VehicleStatus =
  | "Idle"
  | "En Route to Scene"
  | "At Scene"
  | "Transporting Patient"
  | "At This Hospital"
  | "Breakdown"
  | "Off Duty";

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: VehicleType;
  status: VehicleStatus;
  driver: CrewMember;
  emt: CrewMember;
  currentPatient?: IncomingPatient;
  fuelLevel: number;
  lastGpsUpdate: Date;
  position: { lat: number; lng: number };
  station: string;
  operator: string;
  isPrivateFleet: boolean;
}

export interface CrewMember {
  id: string;
  name: string;
  phone: string;
  qualification?: string;
  photo?: string;
}

// ===== TRIP TYPES =====
export type TripStatus =
  | "Pending"
  | "Dispatched"
  | "En Route"
  | "At Scene"
  | "Transporting"
  | "At Hospital"
  | "Completed"
  | "Cancelled"
  | "Breakdown";

export type IncidentType = "Emergency" | "IFT";
export type UrgencyLevel = "RED" | "ORANGE" | "GREEN" | "WHITE";

export interface Trip {
  id: string;
  incidentType: IncidentType;
  urgency: UrgencyLevel;
  patient: Patient;
  pickupLocation: Location;
  destination: Location;
  vehicle?: Vehicle;
  status: TripStatus;
  dispatchedAt?: Date;
  atSceneAt?: Date;
  departedSceneAt?: Date;
  arrivedHospitalAt?: Date;
  completedAt?: Date;
  eta?: number;
  notes?: string;
  numberOfPatients: number;
  isMLC: boolean;
  mlcDetails?: MLCDetails;
  iftDetails?: IFTDetails;
}

export interface Location {
  address: string;
  landmark?: string;
  lat: number;
  lng: number;
}

export interface MLCDetails {
  firNumber: string;
  policeStation: string;
  officerName: string;
}

export interface IFTDetails {
  originHospital: string;
  destinationHospital: string;
  transferReason: string;
  patientSummary: string;
}

// ===== INCOMING PATIENT (ED BOARD) =====
export interface IncomingPatient {
  id: string;
  triageCode: TriageCode;
  patientName: string;
  gender: Gender;
  estimatedAge?: number;
  ambulanceRegNo: string;
  eta: number;
  chiefComplaint: string;
  symptoms: string[];
  vitals: Vitals;
  vitalTrends?: VitalTrend[];
  isTeleLinkActive: boolean;
  driver: string;
  emt: string;
  createdAt: Date;
}

// ===== TELELINK TYPES =====
export type TeleLinkStatus = "Pending" | "Active" | "Completed" | "Declined" | "Deferred";
export type SessionOutcome = "Stabilised" | "Deteriorated" | "Transferred" | "DOA";

export interface TeleLinkRequest {
  id: string;
  triageCode: TriageCode;
  patientBrief: string;
  ambulanceId: string;
  requestingEmt: string;
  waitTime: number;
  isSOS: boolean;
  status: TeleLinkStatus;
  createdAt: Date;
}

export interface TeleLinkSession {
  id: string;
  patient: Patient;
  ambulanceId: string;
  emt: string;
  ercpDoctor: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  outcome?: SessionOutcome;
  clinicalNotes: string;
  prescriptions: string;
  vitalsStream: Vitals[];
  hasRecording: boolean;
  isActive: boolean;
}

// ===== ePCR TYPES =====
export type EpcrStatus = "Acknowledged" | "Pending Acknowledgement";

export interface Epcr {
  id: string;
  incidentDate: Date;
  patient: Patient;
  ambulanceRegNo: string;
  triageCode: TriageCode;
  outcome: Outcome;
  handoffTime: Date;
  receivedBy: string;
  status: EpcrStatus;
  sections: EpcrSections;
}

export interface EpcrSections {
  header: {
    incidentId: string;
    ambulanceNo: string;
    date: Date;
    shift: string;
    station: string;
    fleetOperator: string;
  };
  crew: {
    driver: CrewMember;
    emt: CrewMember;
    doctor?: CrewMember;
  };
  incident: {
    category: string;
    triageCode: TriageCode;
    location: Location;
    callerName: string;
    callerPhone: string;
    dispatchTime: Date;
    sceneArrivalTime: Date;
    sceneDepartureTime: Date;
    hospitalArrivalTime: Date;
  };
  patient: {
    name: string;
    age: number;
    gender: Gender;
    abhaId?: string;
    aadhaar?: string;
    phone?: string;
    address?: string;
  };
  medicalHistory: MedicalHistory;
  primaryAssessment: {
    gcsTotal: number;
    gcsEye: number;
    gcsVerbal: number;
    gcsMotor: number;
    avpu: "Alert" | "Voice" | "Pain" | "Unresponsive";
    pupilLeft: string;
    pupilRight: string;
    triageCode: TriageCode;
  };
  vitalsTimeline: Vitals[];
  careData: {
    chiefComplaint: string;
    hpiNarrative: string;
    interventions: { time: Date; intervention: string; by: string }[];
    criticalityNotes: string;
  };
  medicationsGiven: {
    drug: string;
    dose: string;
    route: string;
    time: Date;
    administeredBy: string;
  }[];
  inventoryUsed: {
    item: string;
    quantity: number;
    batchNo: string;
    expiry: Date;
  }[];
  telelink: {
    sessionId?: string;
    ercpName?: string;
    duration?: number;
    adviceGiven?: string;
  };
  photos: {
    url: string;
    caption: string;
    type: "scene" | "patient" | "document";
  }[];
  valuables: {
    atScene: string;
    atHandoff: string;
    scenePhotos: string[];
    handoffPhotos: string[];
  };
  handoff: {
    receivingHospital: string;
    receivingClinician: string;
    time: Date;
    gpsStamp: { lat: number; lng: number };
  };
  outcome: {
    outcome: Outcome;
    clinicalImpression: string;
  };
  signatures: {
    emtSignature?: string;
    clinicianSignature?: string;
  };
  mlcSection?: {
    isMLC: boolean;
    firNumber: string;
    policeStation: string;
    officerName: string;
    officerPhone: string;
  };
}

// ===== HOSPITAL & SETTINGS =====
export type HospitalType = "Government" | "Private" | "Trust";

export interface Hospital {
  id: string;
  name: string;
  type: HospitalType;
  nabhAccredited: boolean;
  address: string;
  gpsCoordinates: { lat: number; lng: number };
  emergencyPhone: string;
  medicalDirector: string;
  email: string;
  logo?: string;
  departments: Department[];
  bedCapacity: BedCapacity;
  specialtyRouting: string[];
}

export interface Department {
  id: string;
  name: string;
  headOfDepartment: string;
  totalBedsCapacity: number;
  contactPhone: string;
  hospitalId: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BedCapacity {
  emergency: { total: number; available: number };
  icu: { total: number; available: number };
  trauma: { total: number; available: number };
  burns: { total: number; available: number };
  cardiac: { total: number; available: number };
}

// ===== STAFF =====
export type StaffRole = "Hospital Coordinator" | "ED Doctor" | "Nurse";

export interface StaffMember {
  id: string;
  fullName: string;
  role: StaffRole;
  email: string;
  phone: string;
  department: string;
  status: "Active" | "Inactive";
  lastLogin?: Date;
  teleconsultSchedule?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

// ===== REFERRAL NETWORK =====
export interface ReferralHospital {
  id: string;
  name: string;
  specialty: string[];
  coordinatorName: string;
  coordinatorPhone: string;
  distance: number;
  address: string;
  status: "Active" | "Inactive";
  notificationPreference: "SMS" | "Call" | "App";
}

export interface Mortuary {
  id: string;
  name: string;
  address: string;
  contact: string;
  vehicleAvailable: boolean;
}

export interface RoutingRule {
  id: string;
  incidentType: string;
  primaryHospital: string;
  fallbackHospital: string;
}

// ===== NOTIFICATION =====
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "danger";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// ===== ACTIVITY =====
export interface ActivityEvent {
  id: string;
  message: string;
  timestamp: Date;
  icon: string;
  type: "dispatch" | "handoff" | "telelink" | "code" | "epcr" | "booking";
}

// ===== REPORT TYPES =====
export interface KPIData {
  label: string;
  value: number;
  delta?: number;
  deltaType?: "increase" | "decrease";
  icon: string;
  clickAction?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// ===== NAV ITEM =====
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
  badge?: number;
}
