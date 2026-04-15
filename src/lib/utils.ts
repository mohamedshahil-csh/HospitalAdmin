import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function getTriageColor(code: string): { bg: string; text: string; border?: string } {
  const colors: Record<string, { bg: string; text: string; border?: string }> = {
    BLACK: { bg: "bg-gray-900", text: "text-white" },
    RED: { bg: "bg-red-600", text: "text-white" },
    YELLOW: { bg: "bg-yellow-400", text: "text-gray-900" },
    GREEN: { bg: "bg-green-500", text: "text-white" },
    WHITE: { bg: "bg-gray-100", text: "text-gray-700", border: "border border-gray-300" },
    BLUE: { bg: "bg-blue-500", text: "text-white" },
  };
  return colors[code] || colors.GREEN;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Pending: "bg-gray-400",
    Dispatched: "bg-blue-500",
    "En Route": "bg-blue-600",
    "At Scene": "bg-orange-500",
    Transporting: "bg-red-500",
    "At Hospital": "bg-purple-500",
    Completed: "bg-green-500",
    Cancelled: "bg-gray-600",
    Breakdown: "bg-gray-900",
  };
  return colors[status] || "bg-gray-400";
}

export function getVehicleStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Idle: "#9CA3AF",
    "En Route to Scene": "#3B82F6",
    "At Scene": "#F97316",
    "Transporting Patient": "#DC2626",
    "At This Hospital": "#8B5CF6",
    Breakdown: "#111827",
    "Off Duty": "#FFFFFF",
  };
  return colors[status] || "#9CA3AF";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11).toUpperCase();
}

export function maskAadhaar(aadhaar: string): string {
  if (aadhaar.length < 4) return aadhaar;
  return "XXXX-XXXX-" + aadhaar.slice(-4);
}

export function calculateETA(minutes: number): string {
  if (minutes <= 0) return "Arrived";
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

export function getVitalStatus(vital: string, value: number): "normal" | "warning" | "critical" {
  const ranges: Record<string, { normal: [number, number]; warning: [number, number] }> = {
    spo2: { normal: [95, 100], warning: [90, 94] },
    hr: { normal: [60, 100], warning: [50, 120] },
    bpSys: { normal: [90, 140], warning: [80, 160] },
    bpDia: { normal: [60, 90], warning: [50, 100] },
    temp: { normal: [36.1, 37.5], warning: [35, 38.5] },
    rbs: { normal: [70, 140], warning: [55, 200] },
  };
  const range = ranges[vital];
  if (!range) return "normal";
  if (value >= range.normal[0] && value <= range.normal[1]) return "normal";
  if (value >= range.warning[0] && value <= range.warning[1]) return "warning";
  return "critical";
}
