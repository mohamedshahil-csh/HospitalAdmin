import { create } from "zustand";
import { User, UserRole, AuthState, AppNotification } from "@/types";
import { mockUsers, mockNotifications } from "@/lib/mock-data";

interface AuthStore extends AuthState {
  otpPending: boolean;
  pendingRole: UserRole | null;
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  sessionExpiresAt: null,
  otpPending: false,
  pendingRole: null,
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.read).length,
  sidebarCollapsed: false,

  login: async (username: string, _password: string, role: UserRole): Promise<boolean> => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));

    const roleKey = role === "hospital_admin" ? "admin" : role === "hospital_coordinator" ? "coordinator" : "doctor";
    const user = mockUsers[roleKey];

    if (user) {
      set({ otpPending: true, pendingRole: role, isLoading: false });
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  verifyOtp: async (otp: string): Promise<boolean> => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));

    if (otp === "123456" || otp.length === 6) {
      const role = get().pendingRole;
      const roleKey = role === "hospital_admin" ? "admin" : role === "hospital_coordinator" ? "coordinator" : "doctor";
      const user = mockUsers[roleKey];

      set({
        user: { ...user, role: role! },
        isAuthenticated: true,
        isLoading: false,
        otpPending: false,
        sessionExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
      });
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      sessionExpiresAt: null,
      otpPending: false,
      pendingRole: null,
    });
  },

  resetSessionTimer: () => {
    set({ sessionExpiresAt: new Date(Date.now() + 30 * 60 * 1000) });
  },

  markNotificationRead: (id: string) => {
    const notifications = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  },

  markAllRead: () => {
    set({
      notifications: get().notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    });
  },

  toggleSidebar: () => {
    set({ sidebarCollapsed: !get().sidebarCollapsed });
  },
}));

// Hook for role-based access
export function useAuth() {
  const store = useAuthStore();

  const hasAccess = (allowedRoles: UserRole[]): boolean => {
    if (!store.user) return false;
    return allowedRoles.includes(store.user.role);
  };

  const isAdmin = store.user?.role === "hospital_admin";
  const isCoordinator = store.user?.role === "hospital_coordinator";
  const isDoctor = store.user?.role === "ed_doctor";

  return {
    ...store,
    hasAccess,
    isAdmin,
    isCoordinator,
    isDoctor,
  };
}
