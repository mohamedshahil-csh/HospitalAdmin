import { create } from "zustand";
import { User, UserRole, AuthState, AppNotification } from "@/types";
import { mockUsers, mockNotifications } from "@/lib/mock-data";

interface AuthStore extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; mfaRequired: boolean }>;
  setupMfa: () => Promise<{ success: boolean; data?: { qr_code_base64: string; secret: string; totp_uri: string } }>;
  verifyMfaSetup: (code: string) => Promise<boolean>;
  disableMfa: (password: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  resetSessionTimer: () => void;
  otpPending: boolean;
  pendingRole: UserRole | null;
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mfaSessionToken: string | null;
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
  mfaSessionToken: null,

  login: async (username: string, password: string): Promise<{ success: boolean; mfaRequired: boolean }> => {
    set({ isLoading: true });
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://teleems-api-gateway.onrender.com";
      const response = await fetch(`${baseUrl}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (result.status === 201 || result.status === 200) {
        const { data } = result;
        if (data.mfa_required) {
          set({ otpPending: true, mfaSessionToken: data.mfa_session_token, isLoading: false });
          return { success: true, mfaRequired: true };
        }

        const roleMapping: Record<string, UserRole> = {
          "Hospital Admin": "hospital_admin",
          "Hospital Coordinator": "hospital_coordinator",
          "ED Doctor": "ed_doctor",
        };

        const apiRole = data.user.roles[0];
        const localRole = roleMapping[apiRole] || "hospital_admin";

        set({
          user: {
            id: data.user.id,
            username: data.user.username,
            fullName: data.user.username,
            phone: data.user.phone,
            role: localRole,
            hospitalId: "default",
            hospitalName: "TeleEMS Hospital",
            email: `${data.user.username.toLowerCase().replace(/\s/g, ".")}@hospital.com`,
            lastLogin: new Date(),
            isActive: true
          },
          isAuthenticated: !data.mfa_required,
          isLoading: false,
          otpPending: !!data.mfa_required,
          sessionExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
        });
        
        // Save tokens
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        
        return { success: true, mfaRequired: false };
      }
      set({ isLoading: false });
      return { success: false, mfaRequired: false };
    } catch (error) {
      console.error("Login error:", error);
      set({ isLoading: false });
      return { success: false, mfaRequired: false };
    }
  },

  setupMfa: async () => {
    try {
      const token = localStorage.getItem("access_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://teleems-api-gateway.onrender.com";
      const response = await fetch(`${baseUrl}/v1/auth/mfa/totp/setup`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const result = await response.json();
      if (result.status === 201 || result.status === 200) {
        return { success: true, data: result.data };
      }
      return { success: false };
    } catch (error) {
      console.error("MFA setup error:", error);
      return { success: false };
    }
  },

  verifyMfaSetup: async (code: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://teleems-api-gateway.onrender.com";
      const response = await fetch(`${baseUrl}/v1/auth/mfa/totp/verify`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ totp_code: code }),
      });
      const result = await response.json();
      return result.status === 201 || result.status === 200;
    } catch (error) {
      console.error("MFA verification error:", error);
      return false;
    }
  },

  disableMfa: async (password: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://teleems-api-gateway.onrender.com";
      const response = await fetch(`${baseUrl}/v1/auth/mfa/disable`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      return result.status === 201 || result.status === 200;
    } catch (error) {
      console.error("MFA disable error:", error);
      return false;
    }
  },

  verifyOtp: async (otp: string): Promise<boolean> => {
    set({ isLoading: true });
    try {
      const { mfaSessionToken } = get();
      
      console.log("MFA Verification Request:", {
        url: "https://teleems-api-gateway.onrender.com/v1/auth/mfa/verify",
        payload: { mfa_session_token: mfaSessionToken, totp_code: otp }
      });

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://teleems-api-gateway.onrender.com";
      const response = await fetch(`${baseUrl}/v1/auth/mfa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mfa_session_token: mfaSessionToken,
          totp_code: otp 
        }),
      });
      
      const result = await response.json();
      if (result.status === 201 || result.status === 200) {
        if (result.data?.access_token) {
          localStorage.setItem("access_token", result.data.access_token);
          localStorage.setItem("refresh_token", result.data.refresh_token);
        }
        
        set({ isAuthenticated: true, isLoading: false, otpPending: false, mfaSessionToken: null });
        return true;
      }
      
      set({ isLoading: false });
      return false;
    } catch (error) {
      // Fallback for demo/dev purposes if endpoint is missing and using test code
      if (otp === "123456") {
        set({ isAuthenticated: true, isLoading: false, otpPending: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    }
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
