"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuth";
import { initTheme } from "@/hooks/useTheme";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumb from "./Breadcrumb";
import { Toaster } from "react-hot-toast";
import { SESSION_TIMEOUT_WARNING, SESSION_TIMEOUT } from "@/lib/constants";
import { AlertTriangle, Clock } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, resetSessionTimer, sidebarCollapsed } = useAuthStore();
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [countdown, setCountdown] = useState(300);

  // Initialize theme from localStorage/system preference
  useEffect(() => {
    initTheme();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Session timeout logic
  const handleActivity = useCallback(() => {
    if (isAuthenticated) {
      resetSessionTimer();
      setShowTimeoutWarning(false);
      setCountdown(300);
    }
  }, [isAuthenticated, resetSessionTimer]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, handleActivity));

    const warningTimer = setTimeout(() => {
      setShowTimeoutWarning(true);
    }, SESSION_TIMEOUT_WARNING);

    const logoutTimer = setTimeout(() => {
      logout();
      router.push("/login");
    }, SESSION_TIMEOUT);

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [isAuthenticated, handleActivity, logout, router]);

  // Countdown timer for warning modal
  useEffect(() => {
    if (!showTimeoutWarning) return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          logout();
          router.push("/login");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showTimeoutWarning, logout, router]);

  // Show loading or redirect while not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-medical-bg">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-60"}`}>
        <Header />
        <Breadcrumb />
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: { background: "#1F2937", color: "#F9FAFB", borderRadius: "12px", padding: "12px 16px", fontSize: "14px" },
          success: { iconTheme: { primary: "#16A34A", secondary: "#fff" } },
          error: { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
        }}
      />

      {/* Session Timeout Warning Modal */}
      {showTimeoutWarning && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Session Timeout Warning</h3>
                <p className="text-sm text-gray-500">Your session is about to expire</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-4 mb-6">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600 font-mono">
                {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
              </span>
              <span className="text-sm text-amber-700 ml-2">remaining</span>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              You will be automatically logged out due to inactivity. Click below to continue your session.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleActivity}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Continue Session
              </button>
              <button
                onClick={() => { logout(); router.push("/login"); }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
