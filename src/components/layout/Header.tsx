"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";
import { cn, formatTime } from "@/lib/utils";
import {
  Bell, ChevronDown, LogOut, User, Lock, Wifi, WifiOff,
  CheckCheck, ExternalLink, Sun, Moon,
} from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { user, notifications, unreadCount, markNotificationRead, markAllRead, logout } = useAuthStore();
  const { isDark, toggle: toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isConnected] = useState(true);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 h-16 border-b flex items-center justify-between px-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Left: Hospital Name */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{user.hospitalName}</h2>
        </div>
      </div>

      {/* Right: Status + Theme + Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* WebSocket Status */}
        <div className="flex items-center gap-1.5 text-xs">
          {isConnected ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
              <Wifi className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-600 font-medium hidden lg:inline">Connected</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <WifiOff className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-500 font-medium hidden lg:inline">Disconnected</span>
            </>
          )}
        </div>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="relative p-2 rounded-xl transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <div className="relative w-5 h-5">
            <Sun className={cn(
              "w-5 h-5 absolute inset-0 transition-all duration-300",
              isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100 text-amber-500"
            )} />
            <Moon className={cn(
              "w-5 h-5 absolute inset-0 transition-all duration-300",
              isDark ? "opacity-100 rotate-0 scale-100 text-blue-400" : "opacity-0 -rotate-90 scale-0"
            )} />
          </div>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-count-up">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 rounded-xl shadow-xl border animate-slide-in-right overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-tertiary)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={cn(
                      "px-4 py-3 border-b cursor-pointer transition-colors",
                      !notif.read && (isDark ? "bg-blue-900/20" : "bg-blue-50/50")
                    )}
                    style={{ borderColor: 'var(--border-secondary)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                        notif.type === "danger" ? "bg-red-500" :
                        notif.type === "warning" ? "bg-amber-500" :
                        notif.type === "success" ? "bg-green-500" : "bg-blue-500"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{notif.title}</p>
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>{notif.message}</p>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{formatTime(notif.timestamp)}</p>
                      </div>
                      {notif.actionUrl && (
                        <Link href={notif.actionUrl} className="text-primary hover:text-primary-600">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
              {user.fullName.split(" ").map((n) => n[0]).join("").substring(0, 2)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>{user.fullName}</p>
              <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", ROLE_COLORS[user.role])}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
            <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl border animate-slide-in-right overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-tertiary)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user.fullName}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{user.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <User className="w-4 h-4" /> Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <Lock className="w-4 h-4" /> Change Password
                </button>
                <div className="border-t my-1" style={{ borderColor: 'var(--border-primary)' }} />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
