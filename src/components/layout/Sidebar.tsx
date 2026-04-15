"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useAuthStore } from "@/hooks/useAuth";
import {
  LayoutDashboard, Ambulance, Map, UserPlus, Video, FileText,
  Users, BarChart3, Settings, UserCog, Network, ChevronLeft,
  ChevronRight, Activity,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Ambulance, Map, UserPlus, Video, FileText,
  Users, BarChart3, Settings, UserCog, Network, Activity,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, sidebarCollapsed, toggleSidebar } = useAuthStore();

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300",
        "bg-gradient-to-b from-[#0F172A] via-[#111827] to-[#1E293B] shadow-xl",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
          <Activity className="w-5 h-5 text-white" />
        </div>

        {!sidebarCollapsed && (
          <div className="animate-fade-in">
            <h1 className="text-white font-semibold text-lg">TeleEMS</h1>
            <p className="text-gray-400 text-xs">Healthcare System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
                sidebarCollapsed && "justify-center px-2",

                // Active state
                isActive
                  ? "bg-blue-600/20 text-white shadow-md"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {/* Active left indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-blue-500 rounded-r-full" />
              )}

              <Icon
                className={cn(
                  "w-5 h-5 transition-all",
                  isActive ? "text-blue-400" : "group-hover:text-white"
                )}
              />

              {!sidebarCollapsed && (
                <span className="truncate text-sm font-medium tracking-wide">
                  {item.title}
                </span>
              )}

              {/* Badge */}
              {item.badge && !sidebarCollapsed && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}

              {/* Tooltip (collapsed) */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center py-3 border-t border-white/10 text-gray-400 hover:text-white transition"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <ChevronLeft className="w-4 h-4" />
            <span>Collapse</span>
          </div>
        )}
      </button>
    </aside>
  );
}
