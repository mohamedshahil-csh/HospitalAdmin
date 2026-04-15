"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  booking: "Ambulance Booking",
  "fleet-map": "Fleet Visibility",
  "incoming-patients": "Incoming Patients",
  telelink: "TeleLink Console",
  epcr: "ePCR Records",
  "patient-history": "Patient History",
  reports: "Reports & Analytics",
  settings: "Hospital Settings",
  staff: "Staff & Accounts",
  "referral-network": "Referral Network",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 px-6 py-2.5 text-sm border-b" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
      <Link href="/dashboard" className="hover:text-primary transition-colors" style={{ color: 'var(--text-muted)' }}>
        <Home className="w-4 h-4" />
      </Link>
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = routeLabels[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const isLast = index === segments.length - 1;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            {isLast ? (
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            ) : (
              <Link href={href} className="hover:text-primary transition-colors" style={{ color: 'var(--text-muted)' }}>
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
