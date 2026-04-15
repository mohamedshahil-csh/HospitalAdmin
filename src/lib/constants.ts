import { NavItem, UserRole } from "@/types";

export const APP_NAME = "TeleEMS";
export const COMPANY_NAME = "CureSelect Healthcare LLP";
export const SESSION_TIMEOUT_WARNING = 25 * 60 * 1000; // 25 minutes
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const AUTO_REFRESH_INTERVAL = 10 * 1000; // 10 seconds

export const TRIAGE_CODES = ["BLACK", "RED", "YELLOW", "GREEN", "WHITE", "BLUE"] as const;

export const TRIAGE_LABELS: Record<string, string> = {
  BLACK: "Deceased / Expectant",
  RED: "Immediate - Life Threatening",
  YELLOW: "Delayed - Urgent",
  GREEN: "Minor - Walking Wounded",
  WHITE: "Non-Emergency",
  BLUE: "Psychiatric / Behavioral",
};

export const URGENCY_LEVELS = [
  { value: "RED", label: "RED - Life Threatening", color: "bg-red-600" },
  { value: "ORANGE", label: "ORANGE - Urgent", color: "bg-orange-500" },
  { value: "GREEN", label: "GREEN - Minor", color: "bg-green-500" },
  { value: "WHITE", label: "WHITE - Non-Emergency", color: "bg-gray-200" },
] as const;

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"] as const;

export const SPECIALTIES = [
  "Cardiac", "Burns", "Trauma", "Obstetric", "Paediatric",
  "Neurology", "Orthopaedic", "General Medicine", "Toxicology",
] as const;

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", roles: ["hospital_admin", "hospital_coordinator", "ed_doctor"] },
  { title: "Ambulance Booking", href: "/booking", icon: "Ambulance", roles: ["hospital_admin", "hospital_coordinator"] },
  { title: "Fleet Visibility", href: "/fleet-map", icon: "Map", roles: ["hospital_admin", "hospital_coordinator"] },
  { title: "Incoming Patients", href: "/incoming-patients", icon: "UserPlus", roles: ["hospital_admin", "hospital_coordinator", "ed_doctor"] },
  { title: "TeleLink Console", href: "/telelink", icon: "Video", roles: ["hospital_admin", "ed_doctor"] },
  { title: "ePCR Records", href: "/epcr", icon: "FileText", roles: ["hospital_admin", "hospital_coordinator", "ed_doctor"] },
  { title: "Patient History", href: "/patient-history", icon: "Users", roles: ["hospital_admin", "hospital_coordinator", "ed_doctor"] },
  { title: "Reports & Analytics", href: "/reports", icon: "BarChart3", roles: ["hospital_admin"] },
  { title: "Hospital Settings", href: "/settings", icon: "Settings", roles: ["hospital_admin"] },
  { title: "Staff & Accounts", href: "/staff", icon: "UserCog", roles: ["hospital_admin"] },
  { title: "Referral Network", href: "/referral-network", icon: "Network", roles: ["hospital_admin"] },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  hospital_admin: "Hospital Admin",
  hospital_coordinator: "Hospital Coordinator",
  ed_doctor: "ED Doctor (ERCP)",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  hospital_admin: "bg-primary text-white",
  hospital_coordinator: "bg-blue-600 text-white",
  ed_doctor: "bg-purple-600 text-white",
};

export const VEHICLE_STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Idle: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  "En Route to Scene": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "At Scene": { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  "Transporting Patient": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  "At This Hospital": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  Breakdown: { bg: "bg-gray-900", text: "text-white", dot: "bg-gray-900" },
  "Off Duty": { bg: "bg-white border", text: "text-gray-500", dot: "bg-white border border-gray-300" },
};

export const TRIP_STATUS_COLORS: Record<string, string> = {
  Pending: "bg-gray-400 text-white",
  Dispatched: "bg-blue-500 text-white",
  "En Route": "bg-blue-600 text-white",
  "At Scene": "bg-orange-500 text-white",
  Transporting: "bg-red-500 text-white",
  "At Hospital": "bg-purple-500 text-white",
  Completed: "bg-green-500 text-white",
  Cancelled: "bg-gray-600 text-white",
  Breakdown: "bg-gray-900 text-white",
};
