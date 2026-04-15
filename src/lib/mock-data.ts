import {
  User, Patient, Vehicle, Trip, IncomingPatient, TeleLinkRequest,
  TeleLinkSession, Epcr, StaffMember, ReferralHospital, Mortuary,
  RoutingRule, ActivityEvent, AppNotification, KPIData, Hospital,
  Department, Vitals, ChartDataPoint,
} from "@/types";

// ===== MOCK USER =====
export const mockUsers: Record<string, User> = {
  admin: {
    id: "USR001",
    username: "admin",
    fullName: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@cityhospital.in",
    phone: "+91 98765 43210",
    role: "hospital_admin",
    hospitalId: "HOSP001",
    hospitalName: "City General Hospital",
    lastLogin: new Date("2026-04-15T08:30:00"),
    isActive: true,
  },
  coordinator: {
    id: "USR002",
    username: "coordinator",
    fullName: "Priya Sharma",
    email: "priya.sharma@cityhospital.in",
    phone: "+91 98765 43211",
    role: "hospital_coordinator",
    department: "Emergency",
    hospitalId: "HOSP001",
    hospitalName: "City General Hospital",
    lastLogin: new Date("2026-04-15T07:00:00"),
    isActive: true,
  },
  doctor: {
    id: "USR003",
    username: "doctor",
    fullName: "Dr. Ananya Reddy",
    email: "ananya.reddy@cityhospital.in",
    phone: "+91 98765 43212",
    role: "ed_doctor",
    department: "Emergency Medicine",
    hospitalId: "HOSP001",
    hospitalName: "City General Hospital",
    lastLogin: new Date("2026-04-15T09:00:00"),
    isActive: true,
  },
};

// ===== MOCK HOSPITAL =====
export const mockHospital: Hospital = {
  id: "HOSP001",
  name: "City General Hospital",
  type: "Private",
  nabhAccredited: true,
  address: "123 MG Road, Koramangala, Bangalore, Karnataka 560034",
  gpsCoordinates: { lat: 12.9352, lng: 77.6245 },
  emergencyPhone: "+91 80 2553 4000",
  medicalDirector: "Dr. Suresh Menon",
  email: "admin@cityhospital.in",
  departments: [
    { id: "DEPT001", name: "Emergency Medicine", headOfDept: "Dr. Vinod Rao", bedCount: 30, phone: "+91 80 2553 4001", isActive: true },
    { id: "DEPT002", name: "ICU", headOfDept: "Dr. Meera Patel", bedCount: 20, phone: "+91 80 2553 4002", isActive: true },
    { id: "DEPT003", name: "Trauma Centre", headOfDept: "Dr. Arun Nair", bedCount: 15, phone: "+91 80 2553 4003", isActive: true },
    { id: "DEPT004", name: "Burns Unit", headOfDept: "Dr. Kavitha S", bedCount: 10, phone: "+91 80 2553 4004", isActive: true },
    { id: "DEPT005", name: "Cardiac Care", headOfDept: "Dr. Ramesh Gupta", bedCount: 25, phone: "+91 80 2553 4005", isActive: true },
    { id: "DEPT006", name: "Paediatrics", headOfDept: "Dr. Sunita Rao", bedCount: 20, phone: "+91 80 2553 4006", isActive: false },
  ],
  bedCapacity: {
    emergency: { total: 30, available: 12 },
    icu: { total: 20, available: 5 },
    trauma: { total: 15, available: 8 },
    burns: { total: 10, available: 7 },
    cardiac: { total: 25, available: 11 },
  },
  specialtyRouting: ["Cardiac", "Trauma", "Burns", "Paediatric", "General Medicine"],
};

// ===== MOCK VEHICLES (8 ambulances) =====
export const mockVehicles: Vehicle[] = [
  {
    id: "VEH001", registrationNumber: "KA01AB1234", type: "ALS", status: "Transporting Patient",
    driver: { id: "C001", name: "Ravi Kumar", phone: "+91 98001 11001" },
    emt: { id: "C002", name: "Suresh Babu", phone: "+91 98001 11002", qualification: "AEMT" },
    currentPatient: {
      id: "IP001", triageCode: "RED", patientName: "Mohan Das", gender: "Male", estimatedAge: 45,
      ambulanceRegNo: "KA01AB1234", eta: 8, chiefComplaint: "Chest Pain - suspected STEMI",
      symptoms: ["Severe chest pain", "Diaphoresis", "Shortness of breath"],
      vitals: { timestamp: new Date(), spo2: 92, heartRate: 118, bpSystolic: 85, bpDiastolic: 55, temperature: 37.2, rbs: 245 },
      isTeleLinkActive: true, driver: "Ravi Kumar", emt: "Suresh Babu", createdAt: new Date(),
    },
    fuelLevel: 72, lastGpsUpdate: new Date(), position: { lat: 12.9445, lng: 77.6100 },
    station: "Station Alpha", operator: "CureSelect Ambulance", isPrivateFleet: true,
  },
  {
    id: "VEH002", registrationNumber: "KA01CD5678", type: "BLS", status: "En Route to Scene",
    driver: { id: "C003", name: "Venkatesh R", phone: "+91 98001 11003" },
    emt: { id: "C004", name: "Manjunath K", phone: "+91 98001 11004", qualification: "EMT-B" },
    fuelLevel: 88, lastGpsUpdate: new Date(), position: { lat: 12.9550, lng: 77.6350 },
    station: "Station Alpha", operator: "CureSelect Ambulance", isPrivateFleet: true,
  },
  {
    id: "VEH003", registrationNumber: "KA02EF9012", type: "ALS", status: "At Scene",
    driver: { id: "C005", name: "Ganesh Hegde", phone: "+91 98001 11005" },
    emt: { id: "C006", name: "Deepak Shetty", phone: "+91 98001 11006", qualification: "Paramedic" },
    fuelLevel: 55, lastGpsUpdate: new Date(), position: { lat: 12.9200, lng: 77.5950 },
    station: "Station Beta", operator: "108 Emergency", isPrivateFleet: false,
  },
  {
    id: "VEH004", registrationNumber: "KA03GH3456", type: "BLS", status: "Idle",
    driver: { id: "C007", name: "Pratap Singh", phone: "+91 98001 11007" },
    emt: { id: "C008", name: "Santosh M", phone: "+91 98001 11008", qualification: "EMT-B" },
    fuelLevel: 95, lastGpsUpdate: new Date(), position: { lat: 12.9352, lng: 77.6245 },
    station: "Station Alpha", operator: "CureSelect Ambulance", isPrivateFleet: true,
  },
  {
    id: "VEH005", registrationNumber: "KA04IJ7890", type: "ALS", status: "At This Hospital",
    driver: { id: "C009", name: "Ramesh Yadav", phone: "+91 98001 11009" },
    emt: { id: "C010", name: "Naveen Kumar", phone: "+91 98001 11010", qualification: "AEMT" },
    fuelLevel: 40, lastGpsUpdate: new Date(), position: { lat: 12.9355, lng: 77.6248 },
    station: "Station Alpha", operator: "CureSelect Ambulance", isPrivateFleet: true,
  },
  {
    id: "VEH006", registrationNumber: "KA05KL2345", type: "Transport", status: "Off Duty",
    driver: { id: "C011", name: "Srinivas P", phone: "+91 98001 11011" },
    emt: { id: "C012", name: "Anil Kumar", phone: "+91 98001 11012", qualification: "EMT-B" },
    fuelLevel: 60, lastGpsUpdate: new Date(), position: { lat: 12.9100, lng: 77.6400 },
    station: "Station Beta", operator: "108 Emergency", isPrivateFleet: false,
  },
  {
    id: "VEH007", registrationNumber: "KA06MN6789", type: "ALS", status: "Transporting Patient",
    driver: { id: "C013", name: "Manoj Tiwari", phone: "+91 98001 11013" },
    emt: { id: "C014", name: "Kiran Raj", phone: "+91 98001 11014", qualification: "Paramedic" },
    currentPatient: {
      id: "IP003", triageCode: "YELLOW", patientName: "Lakshmi Devi", gender: "Female", estimatedAge: 62,
      ambulanceRegNo: "KA06MN6789", eta: 15, chiefComplaint: "Fall - suspected hip fracture",
      symptoms: ["Right hip pain", "Unable to bear weight", "Swelling"],
      vitals: { timestamp: new Date(), spo2: 97, heartRate: 88, bpSystolic: 145, bpDiastolic: 82, temperature: 36.8 },
      isTeleLinkActive: false, driver: "Manoj Tiwari", emt: "Kiran Raj", createdAt: new Date(),
    },
    fuelLevel: 65, lastGpsUpdate: new Date(), position: { lat: 12.9600, lng: 77.5800 },
    station: "Station Alpha", operator: "CureSelect Ambulance", isPrivateFleet: true,
  },
  {
    id: "VEH008", registrationNumber: "KA07OP0123", type: "BLS", status: "Breakdown",
    driver: { id: "C015", name: "Harish S", phone: "+91 98001 11015" },
    emt: { id: "C016", name: "Vikram M", phone: "+91 98001 11016", qualification: "EMT-B" },
    fuelLevel: 30, lastGpsUpdate: new Date(Date.now() - 3600000), position: { lat: 12.9000, lng: 77.6500 },
    station: "Station Beta", operator: "108 Emergency", isPrivateFleet: false,
  },
];

// ===== MOCK INCOMING PATIENTS (4 patients) =====
export const mockIncomingPatients: IncomingPatient[] = [
  {
    id: "IP001", triageCode: "RED", patientName: "Mohan Das", gender: "Male", estimatedAge: 45,
    ambulanceRegNo: "KA01AB1234", eta: 8, chiefComplaint: "Chest Pain - suspected STEMI",
    symptoms: ["Severe chest pain radiating to left arm", "Diaphoresis", "Shortness of breath", "Nausea"],
    vitals: { timestamp: new Date(), spo2: 92, heartRate: 118, bpSystolic: 85, bpDiastolic: 55, temperature: 37.2, rbs: 245 },
    isTeleLinkActive: true, driver: "Ravi Kumar", emt: "Suresh Babu", createdAt: new Date(Date.now() - 600000),
  },
  {
    id: "IP002", triageCode: "RED", patientName: "UNKNOWN", gender: "Male", estimatedAge: 30,
    ambulanceRegNo: "KA02EF9012", eta: 22, chiefComplaint: "RTA - Multiple trauma",
    symptoms: ["Head laceration", "Right femur deformity", "Abdominal guarding", "GCS 9"],
    vitals: { timestamp: new Date(), spo2: 88, heartRate: 132, bpSystolic: 78, bpDiastolic: 45, temperature: 36.1, rbs: 110 },
    isTeleLinkActive: true, driver: "Ganesh Hegde", emt: "Deepak Shetty", createdAt: new Date(Date.now() - 300000),
  },
  {
    id: "IP003", triageCode: "YELLOW", patientName: "Lakshmi Devi", gender: "Female", estimatedAge: 62,
    ambulanceRegNo: "KA06MN6789", eta: 15, chiefComplaint: "Fall - suspected hip fracture",
    symptoms: ["Right hip pain", "Unable to bear weight", "Swelling", "Bruising"],
    vitals: { timestamp: new Date(), spo2: 97, heartRate: 88, bpSystolic: 145, bpDiastolic: 82, temperature: 36.8 },
    isTeleLinkActive: false, driver: "Manoj Tiwari", emt: "Kiran Raj", createdAt: new Date(Date.now() - 900000),
  },
  {
    id: "IP004", triageCode: "GREEN", patientName: "Anwar Sheikh", gender: "Male", estimatedAge: 28,
    ambulanceRegNo: "KA01CD5678", eta: 35, chiefComplaint: "Allergic reaction - mild",
    symptoms: ["Urticaria", "Mild facial swelling", "Itching"],
    vitals: { timestamp: new Date(), spo2: 98, heartRate: 92, bpSystolic: 128, bpDiastolic: 78, temperature: 37.0 },
    isTeleLinkActive: false, driver: "Venkatesh R", emt: "Manjunath K", createdAt: new Date(Date.now() - 120000),
  },
];

// ===== MOCK ACTIVITY FEED =====
export const mockActivities: ActivityEvent[] = [
  { id: "ACT001", message: "Ambulance KA01AB1234 dispatched for chest pain emergency", timestamp: new Date(Date.now() - 180000), icon: "Ambulance", type: "dispatch" },
  { id: "ACT002", message: "TeleLink session started — ERCP Dr. Ananya Reddy with EMT Suresh Babu", timestamp: new Date(Date.now() - 300000), icon: "Video", type: "telelink" },
  { id: "ACT003", message: "Patient handoff received — Smt. Padma Iyer (MRN: CGH2024-1847)", timestamp: new Date(Date.now() - 900000), icon: "UserPlus", type: "handoff" },
  { id: "ACT004", message: "ePCR received — Incident #TE-20260415-042 (RTA victim)", timestamp: new Date(Date.now() - 1500000), icon: "FileText", type: "epcr" },
  { id: "ACT005", message: "Ambulance KA02EF9012 dispatched for RTA on Outer Ring Road", timestamp: new Date(Date.now() - 1800000), icon: "Ambulance", type: "dispatch" },
  { id: "ACT006", message: "Code Trauma activated by Dr. Vinod Rao — Bay 3", timestamp: new Date(Date.now() - 2400000), icon: "AlertTriangle", type: "code" },
  { id: "ACT007", message: "New ambulance booking created — IFT to Metro Hospital", timestamp: new Date(Date.now() - 3600000), icon: "Plus", type: "booking" },
  { id: "ACT008", message: "TeleLink session completed — Patient stabilised, ETA 12 min", timestamp: new Date(Date.now() - 4200000), icon: "Video", type: "telelink" },
  { id: "ACT009", message: "Ambulance KA07OP0123 reported breakdown on NH44", timestamp: new Date(Date.now() - 5400000), icon: "AlertTriangle", type: "dispatch" },
  { id: "ACT010", message: "Patient discharge — Ramesh Kumar (MRN: CGH2024-1820)", timestamp: new Date(Date.now() - 7200000), icon: "UserCheck", type: "handoff" },
];

// ===== MOCK TELELINK REQUESTS =====
export const mockTeleLinkRequests: TeleLinkRequest[] = [
  {
    id: "TLR001", triageCode: "RED", patientBrief: "45M - Chest pain, diaphoresis, SpO2 92%, HR 118, BP 85/55 - Suspected STEMI",
    ambulanceId: "KA01AB1234", requestingEmt: "Suresh Babu", waitTime: 0, isSOS: true, status: "Active", createdAt: new Date(Date.now() - 300000),
  },
  {
    id: "TLR002", triageCode: "RED", patientBrief: "30M - RTA, multiple trauma, GCS 9, SpO2 88% - Head laceration + suspected femur fracture",
    ambulanceId: "KA02EF9012", requestingEmt: "Deepak Shetty", waitTime: 3, isSOS: false, status: "Pending", createdAt: new Date(Date.now() - 180000),
  },
];

// ===== MOCK KPI DATA =====
export const mockKPIData: KPIData[] = [
  { label: "Total Incidents Today", value: 24, delta: 3, deltaType: "increase", icon: "Activity" },
  { label: "Active Ambulances", value: 6, icon: "Ambulance", clickAction: "/fleet-map" },
  { label: "Patients Incoming", value: 4, delta: 1, deltaType: "increase", icon: "UserPlus" },
  { label: "TeleLink Sessions", value: 7, icon: "Video" },
  { label: "ePCRs Received", value: 18, delta: -2, deltaType: "decrease", icon: "FileText" },
  { label: "Avg Response Time", value: 12, icon: "Clock" },
];

// ===== MOCK TRIPS =====
export const mockTrips: Trip[] = [
  {
    id: "TRP-20260415-001",
    incidentType: "Emergency",
    urgency: "RED",
    patient: {
      id: "P001",
      name: "Mohan Das",
      mrn: "CGH2024-1901",
      age: 45,
      gender: "Male",
      bloodGroup: "O+",
      medicalHistory: { conditions: ["Diabetes", "Hypertension"], medications: ["Metformin", "Amlodipine"], allergies: ["Penicillin"] }
    },
    pickupLocation: { address: "42, 3rd Cross, JP Nagar, Bangalore", lat: 12.9100, lng: 77.5900 },
    destination: { address: "City General Hospital, Koramangala", lat: 12.9352, lng: 77.6245 },
    vehicle: mockVehicles[0],
    status: "Transporting",
    dispatchedAt: new Date(Date.now() - 1200000),
    atSceneAt: new Date(Date.now() - 600000),
    departedSceneAt: new Date(Date.now() - 300000),
    eta: 8,
    numberOfPatients: 1,
    isMLC: false,
  },
  {
    id: "TRP-20260415-002",
    incidentType: "Emergency",
    urgency: "RED",
    patient: {
      id: "P002",
      name: "Unknown Male",
      age: 30,
      gender: "Male",
      medicalHistory: { conditions: [], medications: [], allergies: [] }
    },
    pickupLocation: { address: "Outer Ring Road, near Marathahalli Bridge", lat: 12.9550, lng: 77.7000 },
    destination: { address: "City General Hospital, Koramangala", lat: 12.9352, lng: 77.6245 },
    vehicle: mockVehicles[2],
    status: "At Scene",
    dispatchedAt: new Date(Date.now() - 1800000),
    atSceneAt: new Date(Date.now() - 900000),
    eta: 22,
    numberOfPatients: 1,
    isMLC: true,
    mlcDetails: { firNumber: "FIR-2026-04877", policeStation: "Marathahalli PS", officerName: "SI Raju" },
  },
  {
    id: "TRP-20260415-003",
    incidentType: "Emergency",
    urgency: "ORANGE",
    patient: {
      id: "P003",
      name: "Lakshmi Devi",
      mrn: "CGH2024-1899",
      age: 62,
      gender: "Female",
      bloodGroup: "B+",
      medicalHistory: { conditions: ["Osteoporosis", "Hypothyroidism"], medications: ["Calcium", "Levothyroxine"], allergies: [] }
    },
    pickupLocation: { address: "78, 2nd Main, Jayanagar 4th Block", lat: 12.9250, lng: 77.5800 },
    destination: { address: "City General Hospital, Koramangala", lat: 12.9352, lng: 77.6245 },
    vehicle: mockVehicles[6],
    status: "Transporting",
    dispatchedAt: new Date(Date.now() - 2400000),
    atSceneAt: new Date(Date.now() - 1500000),
    departedSceneAt: new Date(Date.now() - 600000),
    eta: 15,
    numberOfPatients: 1,
    isMLC: false,
  },
  {
    id: "TRP-20260415-004",
    incidentType: "IFT",
    urgency: "GREEN",
    patient: {
      id: "P004",
      name: "Subramaniam V",
      mrn: "CGH2024-1845",
      age: 58,
      gender: "Male",
      bloodGroup: "A+",
      medicalHistory: { conditions: ["COPD"], medications: ["Salbutamol inhaler"], allergies: ["Aspirin"] }
    },
    pickupLocation: { address: "City General Hospital, Koramangala", lat: 12.9352, lng: 77.6245 },
    destination: { address: "NIMHANS, Hosur Road, Bangalore", lat: 12.9416, lng: 77.5967 },
    status: "Completed",
    dispatchedAt: new Date(Date.now() - 14400000),
    atSceneAt: new Date(Date.now() - 13800000),
    departedSceneAt: new Date(Date.now() - 13200000),
    arrivedHospitalAt: new Date(Date.now() - 10800000),
    completedAt: new Date(Date.now() - 10800000),
    numberOfPatients: 1,
    isMLC: false,
    iftDetails: {
      originHospital: "City General Hospital",
      destinationHospital: "NIMHANS",
      transferReason: "Neurosurgery consult",
      patientSummary: "58M with acute subdural hematoma, GCS 13, stable vitals"
    },
  },
  {
    id: "TRP-20260414-005",
    incidentType: "Emergency",
    urgency: "RED",
    patient: {
      id: "P005",
      name: "Fatima Begum",
      age: 35,
      gender: "Female",
      bloodGroup: "O-",
      medicalHistory: { conditions: ["Asthma"], medications: ["Budesonide inhaler"], allergies: ["Sulfa drugs"] }
    },
    pickupLocation: { address: "15, 1st Cross, Shivaji Nagar", lat: 12.9850, lng: 77.6050 },
    destination: { address: "City General Hospital, Koramangala", lat: 12.9352, lng: 77.6245 },
    status: "Completed",
    dispatchedAt: new Date(Date.now() - 86400000),
    completedAt: new Date(Date.now() - 82800000),
    numberOfPatients: 1,
    isMLC: false,
  },

  // ==================== TEST DATA FOR CANCEL / MODIFY UI ====================

  // 1. Pure Pending Trip (No vehicle assigned) → Best for testing Cancel UI
  {
    id: "TRP-20260415-006",
    incidentType: "Emergency",
    urgency: "RED",
    patient: {
      id: "P006",
      name: "Ramesh Kumar",
      mrn: "CGH2024-1923",
      age: 52,
      gender: "Male",
      bloodGroup: "AB+",
      medicalHistory: {
        conditions: ["Heart Disease"],
        medications: ["Aspirin", "Atorvastatin"],
        allergies: ["Morphine"]
      }
    },
    pickupLocation: {
      address: "No. 27, 5th Main, Malleshwaram, Bangalore",
      lat: 13.0050,
      lng: 77.5650
    },
    destination: {
      address: "City General Hospital, Koramangala",
      lat: 12.9352,
      lng: 77.6245
    },
    // vehicle is omitted → becomes undefined (correct)
    status: "Pending",
    // dispatchedAt omitted → undefined
    // eta omitted → undefined
    numberOfPatients: 1,
    isMLC: false,
    notes: "Severe chest pain, waiting for ambulance assignment",
  },

  // 2. Vehicle Assigned but NOT yet Dispatched → Tests your requirement
  {
    id: "TRP-20260415-007",
    incidentType: "Emergency",
    urgency: "ORANGE",
    patient: {
      id: "P007",
      name: "Priya Sharma",
      mrn: "CGH2024-1931",
      age: 41,
      gender: "Female",
      bloodGroup: "O+",
      medicalHistory: { conditions: ["Migraine", "Anemia"], medications: ["Sumatriptan"], allergies: [] }
    },
    pickupLocation: {
      address: "BTM 2nd Stage, Near Silk Board, Bangalore",
      lat: 12.9166,
      lng: 77.6101
    },
    destination: {
      address: "City General Hospital, Koramangala",
      lat: 12.9352,
      lng: 77.6245
    },
    vehicle: mockVehicles[1],           // Vehicle is assigned
    status: "Pending",
    dispatchedAt: undefined,            // Explicitly undefined (safe)
    eta: undefined,
    numberOfPatients: 1,
    isMLC: false,
    notes: "Vehicle KA04AB7788 assigned, waiting for crew confirmation",
  },
];

// ===== MOCK ePCR RECORDS =====
export const mockEpcrs: Epcr[] = Array.from({ length: 22 }, (_, i) => {
  const triageCodes: Array<"RED" | "YELLOW" | "GREEN" | "BLACK" | "BLUE"> = ["RED", "YELLOW", "GREEN", "RED", "YELLOW", "GREEN", "BLACK", "BLUE", "RED", "YELLOW"];
  const outcomes: Array<"Alive" | "DOA" | "Refusal"> = ["Alive", "Alive", "Alive", "Alive", "DOA", "Refusal", "Alive", "Alive"];
  const names = ["Ramesh Kumar", "Priya Nair", "Abdul Kareem", "Sunita Rao", "Vijay Malhotra", "Anita Desai", "Mohammed Hussain", "Kavita Sharma", "Rajendra Prasad", "Meenakshi Iyer", "Arjun Reddy", "Deepa Menon", "Suresh Patel", "Lakshmi Narayanan", "Ganesh Rao", "Padma Iyer", "Sanjay Gupta", "Revathi Krishnan", "Amith Kumar", "Nandini S", "Prakash Rao", "Geeta Devi"];
  const complaints = ["Chest Pain", "RTA - Head Injury", "Burn injury - 20% BSA", "Breathing difficulty", "Fall - Hip fracture", "Seizure", "Snake bite", "Poisoning - Organophosphate", "Cardiac arrest", "Stroke - Left hemiparesis", "Diabetic emergency", "Assault - Stab wound", "Drowning", "Allergic reaction", "Labour - Premature", "RTA - Pedestrian", "Fall from height", "Chemical burn", "Electric shock", "Heat stroke", "Abdominal pain", "Drug overdose"];

  return {
    id: `EPCR-2026${String(4 - Math.floor(i / 10)).padStart(2, "0")}${String(15 - (i % 28)).padStart(2, "0")}-${String(i + 1).padStart(3, "0")}`,
    incidentDate: new Date(Date.now() - i * 86400000 * (0.5 + Math.random())),
    patient: {
      id: `PAT${String(i + 100).padStart(3, "0")}`,
      name: names[i % names.length],
      mrn: i % 3 === 0 ? `CGH2024-${1800 + i}` : undefined,
      age: 20 + Math.floor(Math.random() * 60),
      gender: i % 3 === 0 ? "Female" as const : "Male" as const,
      medicalHistory: { conditions: [], medications: [], allergies: [] },
    },
    ambulanceRegNo: mockVehicles[i % mockVehicles.length].registrationNumber,
    triageCode: triageCodes[i % triageCodes.length],
    outcome: outcomes[i % outcomes.length],
    handoffTime: new Date(Date.now() - i * 86400000 * (0.5 + Math.random()) + 3600000),
    receivedBy: ["Dr. Vinod Rao", "Dr. Meera Patel", "Dr. Arun Nair", "Nurse Rekha"][i % 4],
    status: i < 3 ? "Pending Acknowledgement" as const : "Acknowledged" as const,
    sections: {
      header: {
        incidentId: `TE-20260415-${String(i + 1).padStart(3, "0")}`,
        ambulanceNo: mockVehicles[i % mockVehicles.length].registrationNumber,
        date: new Date(Date.now() - i * 86400000),
        shift: i % 2 === 0 ? "Day" : "Night",
        station: i % 2 === 0 ? "Station Alpha" : "Station Beta",
        fleetOperator: i % 2 === 0 ? "CureSelect Ambulance" : "108 Emergency",
      },
      crew: {
        driver: mockVehicles[i % mockVehicles.length].driver,
        emt: mockVehicles[i % mockVehicles.length].emt,
      },
      incident: {
        category: complaints[i % complaints.length],
        triageCode: triageCodes[i % triageCodes.length],
        location: { address: `Location ${i + 1}, Bangalore`, lat: 12.9 + Math.random() * 0.1, lng: 77.55 + Math.random() * 0.1 },
        callerName: "Caller " + (i + 1),
        callerPhone: `+91 98001 ${String(20000 + i).padStart(5, "0")}`,
        dispatchTime: new Date(Date.now() - i * 86400000 - 7200000),
        sceneArrivalTime: new Date(Date.now() - i * 86400000 - 6600000),
        sceneDepartureTime: new Date(Date.now() - i * 86400000 - 5400000),
        hospitalArrivalTime: new Date(Date.now() - i * 86400000 - 3600000),
      },
      patient: {
        name: names[i % names.length],
        age: 20 + Math.floor(Math.random() * 60),
        gender: i % 3 === 0 ? "Female" as const : "Male" as const,
        abhaId: i % 4 === 0 ? `AB${String(i).padStart(12, "0")}` : undefined,
        aadhaar: i % 3 === 0 ? `${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}` : undefined,
      },
      medicalHistory: {
        conditions: i % 2 === 0 ? ["Diabetes", "Hypertension"] : ["Asthma"],
        medications: i % 2 === 0 ? ["Metformin 500mg", "Amlodipine 5mg"] : ["Salbutamol inhaler"],
        allergies: i % 3 === 0 ? ["Penicillin"] : [],
      },
      primaryAssessment: {
        gcsTotal: 15 - Math.floor(Math.random() * 6),
        gcsEye: 4 - Math.floor(Math.random() * 2),
        gcsVerbal: 5 - Math.floor(Math.random() * 2),
        gcsMotor: 6 - Math.floor(Math.random() * 2),
        avpu: (["Alert", "Voice", "Pain", "Unresponsive"] as const)[Math.min(Math.floor(Math.random() * 2), 3)],
        pupilLeft: "3mm reactive",
        pupilRight: "3mm reactive",
        triageCode: triageCodes[i % triageCodes.length],
      },
      vitalsTimeline: Array.from({ length: 4 }, (_, j) => ({
        timestamp: new Date(Date.now() - i * 86400000 - (4 - j) * 900000),
        spo2: 94 + Math.floor(Math.random() * 6),
        heartRate: 70 + Math.floor(Math.random() * 40),
        bpSystolic: 110 + Math.floor(Math.random() * 40),
        bpDiastolic: 65 + Math.floor(Math.random() * 20),
        temperature: 36.5 + Math.random(),
        rbs: 90 + Math.floor(Math.random() * 80),
      })),
      careData: {
        chiefComplaint: complaints[i % complaints.length],
        hpiNarrative: `Patient presented with ${complaints[i % complaints.length].toLowerCase()}. Onset approximately 30 minutes prior to EMS arrival. Patient was found in a conscious state with vitals as recorded.`,
        interventions: [
          { time: new Date(Date.now() - i * 86400000 - 6000000), intervention: "IV access established - 18G cannula, RL started", by: "EMT" },
          { time: new Date(Date.now() - i * 86400000 - 5400000), intervention: "O2 supplementation via NRB mask at 15L/min", by: "EMT" },
        ],
        criticalityNotes: "Patient monitored continuously during transport. Vitals remained stable.",
      },
      medicationsGiven: [
        { drug: "Normal Saline", dose: "500ml", route: "IV", time: new Date(Date.now() - i * 86400000 - 6000000), administeredBy: "EMT Suresh" },
      ],
      inventoryUsed: [
        { item: "IV Cannula 18G", quantity: 1, batchNo: "BN20260101", expiry: new Date("2027-12-31") },
        { item: "IV Set", quantity: 1, batchNo: "BN20260102", expiry: new Date("2027-06-30") },
        { item: "Normal Saline 500ml", quantity: 1, batchNo: "BN20260103", expiry: new Date("2027-09-30") },
      ],
      telelink: i % 3 === 0 ? { sessionId: `TLS${i}`, ercpName: "Dr. Ananya Reddy", duration: 8, adviceGiven: "Continue monitoring. Administer aspirin 300mg if no contraindications." } : {},
      photos: [],
      valuables: { atScene: "Wallet, mobile phone, gold chain", atHandoff: "Wallet, mobile phone, gold chain", scenePhotos: [], handoffPhotos: [] },
      handoff: {
        receivingHospital: "City General Hospital",
        receivingClinician: ["Dr. Vinod Rao", "Dr. Meera Patel", "Dr. Arun Nair"][i % 3],
        time: new Date(Date.now() - i * 86400000 - 3600000),
        gpsStamp: { lat: 12.9352, lng: 77.6245 },
      },
      outcome: {
        outcome: outcomes[i % outcomes.length],
        clinicalImpression: `Patient ${outcomes[i % outcomes.length] === "Alive" ? "transferred to ED in stable condition" : outcomes[i % outcomes.length]}. Further workup recommended.`,
      },
      signatures: {
        emtSignature: "data:image/svg+xml;base64,signature_placeholder",
        clinicianSignature: i < 3 ? undefined : "data:image/svg+xml;base64,signature_placeholder",
      },
      mlcSection: i === 1 ? { isMLC: true, firNumber: "FIR-2026-04877", policeStation: "Marathahalli PS", officerName: "SI Raju", officerPhone: "+91 98001 33001" } : undefined,
    },
  };
});

// ===== MOCK NOTIFICATIONS =====
export const mockNotifications: AppNotification[] = [
  { id: "N001", title: "Incoming Patient", message: "Ambulance KA01AB1234 - RED triage patient, ETA 8 min", type: "danger", timestamp: new Date(Date.now() - 60000), read: false, actionUrl: "/incoming-patients" },
  { id: "N002", title: "TeleLink Request", message: "EMT Suresh Babu requesting TeleLink for chest pain patient", type: "warning", timestamp: new Date(Date.now() - 300000), read: false, actionUrl: "/telelink" },
  { id: "N003", title: "ePCR Received", message: "ePCR for incident TE-20260415-042 received and pending acknowledgement", type: "info", timestamp: new Date(Date.now() - 900000), read: false, actionUrl: "/epcr" },
  { id: "N004", title: "Ambulance Breakdown", message: "Vehicle KA07OP0123 reported breakdown on NH44", type: "danger", timestamp: new Date(Date.now() - 5400000), read: true },
  { id: "N005", title: "Shift Change", message: "Night shift crew logged in at Station Alpha", type: "info", timestamp: new Date(Date.now() - 7200000), read: true },
];

// ===== MOCK STAFF =====
export const mockStaff: StaffMember[] = [
  { id: "STF001", fullName: "Priya Sharma", role: "Hospital Coordinator", email: "priya.sharma@cityhospital.in", phone: "+91 98765 43211", department: "Emergency", status: "Active", lastLogin: new Date(Date.now() - 3600000) },
  { id: "STF002", fullName: "Dr. Ananya Reddy", role: "ED Doctor", email: "ananya.reddy@cityhospital.in", phone: "+91 98765 43212", department: "Emergency Medicine", status: "Active", lastLogin: new Date(Date.now() - 7200000), teleconsultSchedule: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], startTime: "08:00", endTime: "20:00" } },
  { id: "STF003", fullName: "Dr. Vinod Rao", role: "ED Doctor", email: "vinod.rao@cityhospital.in", phone: "+91 98765 43213", department: "Emergency Medicine", status: "Active", lastLogin: new Date(Date.now() - 14400000), teleconsultSchedule: { days: ["Mon", "Wed", "Fri"], startTime: "08:00", endTime: "16:00" } },
  { id: "STF004", fullName: "Rekha Naik", role: "Nurse", email: "rekha.naik@cityhospital.in", phone: "+91 98765 43214", department: "Emergency", status: "Active", lastLogin: new Date(Date.now() - 28800000) },
  { id: "STF005", fullName: "Dr. Meera Patel", role: "ED Doctor", email: "meera.patel@cityhospital.in", phone: "+91 98765 43215", department: "ICU", status: "Active", lastLogin: new Date(Date.now() - 43200000), teleconsultSchedule: { days: ["Tue", "Thu", "Sat"], startTime: "20:00", endTime: "08:00" } },
  { id: "STF006", fullName: "Sunil Kumar", role: "Hospital Coordinator", email: "sunil.kumar@cityhospital.in", phone: "+91 98765 43216", department: "Emergency", status: "Inactive" },
  { id: "STF007", fullName: "Nurse Geetha", role: "Nurse", email: "geetha@cityhospital.in", phone: "+91 98765 43217", department: "Trauma Centre", status: "Active", lastLogin: new Date(Date.now() - 86400000) },
];

// ===== MOCK REFERRAL HOSPITALS =====
export const mockReferralHospitals: ReferralHospital[] = [
  { id: "RH001", name: "NIMHANS", specialty: ["Neurology", "Neurosurgery", "Psychiatry"], coordinatorName: "Dr. Suresh M", coordinatorPhone: "+91 80 2699 5000", distance: 5.2, address: "Hosur Road, Bangalore", status: "Active", notificationPreference: "App" },
  { id: "RH002", name: "Victoria Hospital", specialty: ["General Medicine", "Trauma", "Orthopaedic"], coordinatorName: "Dr. Lakshman K", coordinatorPhone: "+91 80 2670 1150", distance: 8.1, address: "Fort Road, Bangalore", status: "Active", notificationPreference: "SMS" },
  { id: "RH003", name: "Jayadeva Institute", specialty: ["Cardiac", "Cardiothoracic Surgery"], coordinatorName: "Dr. Ramana Rao", coordinatorPhone: "+91 80 2653 4251", distance: 3.8, address: "9th Block, Jayanagar", status: "Active", notificationPreference: "Call" },
  { id: "RH004", name: "Kidwai Memorial", specialty: ["Oncology", "Radiation Therapy"], coordinatorName: "Dr. Aisha Khan", coordinatorPhone: "+91 80 2656 0708", distance: 6.5, address: "Hosur Road, Bangalore", status: "Active", notificationPreference: "App" },
  { id: "RH005", name: "KC General Hospital", specialty: ["Paediatric", "Obstetric"], coordinatorName: "Dr. Padma N", coordinatorPhone: "+91 80 2234 5607", distance: 12.0, address: "Malleshwaram, Bangalore", status: "Inactive", notificationPreference: "SMS" },
];

export const mockMortuaries: Mortuary[] = [
  { id: "MOR001", name: "Victoria Hospital Mortuary", address: "Fort Road, Bangalore", contact: "+91 80 2670 1160", vehicleAvailable: true },
  { id: "MOR002", name: "BBMP Mortuary - Koramangala", address: "Koramangala, Bangalore", contact: "+91 80 2553 9090", vehicleAvailable: false },
];

export const mockRoutingRules: RoutingRule[] = [
  { id: "RR001", incidentType: "Burns > 15% BSA", primaryHospital: "Victoria Hospital", fallbackHospital: "City General Hospital" },
  { id: "RR002", incidentType: "Cardiac — STEMI", primaryHospital: "Jayadeva Institute", fallbackHospital: "City General Hospital" },
  { id: "RR003", incidentType: "Neurosurgery", primaryHospital: "NIMHANS", fallbackHospital: "Victoria Hospital" },
  { id: "RR004", incidentType: "Paediatric Emergency", primaryHospital: "KC General Hospital", fallbackHospital: "City General Hospital" },
  { id: "RR005", incidentType: "Oncology", primaryHospital: "Kidwai Memorial", fallbackHospital: "Victoria Hospital" },
];

// ===== MOCK CHART DATA =====
export const mockIncidentTrendData: ChartDataPoint[] = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(Date.now() - (13 - i) * 86400000);
  return {
    name: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    value: 15 + Math.floor(Math.random() * 15),
  };
});

export const mockTriageCategoryData: ChartDataPoint[] = [
  { name: "RED", value: 8 },
  { name: "YELLOW", value: 14 },
  { name: "GREEN", value: 22 },
  { name: "BLACK", value: 2 },
  { name: "BLUE", value: 3 },
  { name: "WHITE", value: 6 },
];
