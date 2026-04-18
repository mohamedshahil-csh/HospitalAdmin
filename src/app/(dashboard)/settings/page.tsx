"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { mockHospital } from "@/lib/mock-data";
import { useAuthStore, useAuth } from "@/hooks/useAuth";
import {
  Building2, MapPin, Phone, Mail, User, Bed, Save,
  Plus, X, Settings, Bell, Video, Shield, ToggleLeft,
  ToggleRight, CheckCircle, Upload, Lock, Eye, EyeOff
} from "lucide-react";
import toast from "react-hot-toast";
export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const [activeTab, setActiveTab] = useState("profile");
  const [hospital, setHospital] = useState(mockHospital);
  const [editMode, setEditMode] = useState(false);
  const searchParams = useSearchParams();

  const { user, fetchProfile } = useAuth();
  
  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tabs.some(t => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { key: "profile", label: "Hospital Profile" },
    { key: "departments", label: "Departments" },
    { key: "fleet", label: "Fleet Network" },
    { key: "notifications", label: "Notifications" },
    { key: "teleconsult", label: "Teleconsult Routing" },
    { key: "security", label: "Security & MFA" },
    { key: "password", label: "Change Password" },
  ];

  const handleSave = () => {
    setEditMode(false);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hospital Profile & Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage hospital configuration and preferences</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap", activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.hospitalName || user?.fullName || hospital.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge bg-blue-100 text-blue-700">{hospital.type}</span>
                  {hospital.nabhAccredited && <span className="badge bg-green-100 text-green-700">✓ NABH Accredited</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button onClick={handleSave} className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"><Save className="w-4 h-4" /> Save Changes</button>
                  <button onClick={() => setEditMode(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                </>
              ) : (
                <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-600"><Settings className="w-4 h-4" /> Edit</button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldEdit label="Hospital Name" value={user?.hospitalName || hospital.name} editable={editMode} />
            <FieldEdit label="Type" value={"null"} editable={editMode} />
            <div className="col-span-2"><FieldEdit label="Address" value={"null"} editable={editMode} /></div>
            <FieldEdit label="Emergency Phone" value={"null"} editable={editMode} />
            <FieldEdit label="Medical Director" value={"null"} editable={editMode} />
            <FieldEdit label="Email" value={user?.email || hospital.email} editable={editMode} />
            <FieldEdit label="GPS Coordinates" value={"null, null"} editable={false} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Bed className="w-5 h-5 text-primary" /> Bed Capacity</h3>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(hospital.bedCapacity).map(([dept, cap]) => (
                <div key={dept} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 capitalize mb-1">{dept}</p>
                  <p className="text-lg font-bold text-primary">{cap.available}<span className="text-sm font-normal text-gray-400">/{cap.total}</span></p>
                  <p className="text-[10px] text-gray-400">available</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <Upload className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Hospital Logo</p>
              <p className="text-xs text-gray-400">Upload PNG or SVG, max 2MB</p>
            </div>
            <button className="ml-auto px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50">Upload</button>
          </div>
        </div>
      )}

      {activeTab === "departments" && (
        <DepartmentManagement hospital={hospital} setHospital={setHospital} />
      )}

      {activeTab === "fleet" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div><h3 className="font-medium text-gray-900">Public Fleet Network</h3><p className="text-xs text-gray-500">Opt in to see all ambulances in the public network</p></div>
            <button className="text-green-600"><ToggleRight className="w-8 h-8" /></button>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Connected Operators</h3>
            {["CureSelect Ambulance — Active", "108 Emergency — Active", "GVK EMRI — Pending"].map((op, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="text-sm">{op.split(" — ")[0]}</span>
                <span className={cn("badge", op.includes("Active") ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>{op.split(" — ")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-2">Notification Preferences</h3>
          <table className="data-table">
            <thead><tr><th>Event</th><th>Push</th><th>SMS</th><th>Email</th></tr></thead>
            <tbody>
              {["Ambulance dispatched to hospital", "Patient ETA < 10 min", "TeleLink incoming", "ePCR received", "Code activation"].map((event) => (
                <tr key={event}>
                  <td className="text-sm">{event}</td>
                  {[1, 2, 3].map((i) => (
                    <td key={i}>
                      <input type="checkbox" defaultChecked={Math.random() > 0.3} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => toast.success("Preferences saved")} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-600">Save Preferences</button>
        </div>
      )}

      {activeTab === "teleconsult" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-2">Teleconsult Routing Rules</h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Routing Mode</label>
            <select className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-primary outline-none">
              <option>Round-robin</option><option>By Specialty</option><option>Manual Queue</option>
            </select>
          </div>
          <p className="text-sm text-gray-500">ERCP doctors will receive TeleLink requests based on the selected routing mode and their availability schedule (configured in Staff & Accounts).</p>
        </div>
      )}

      {activeTab === "security" && <SecuritySettings />}
      {activeTab === "password" && <PasswordSettings />}
    </div>
  );
}

function PasswordSettings() {
  const { changePassword } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    // Complex validation
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
      toast.error("Password must include at least one uppercase letter, one number, and one special character (!@#$%^&*)");
      return;
    }

    setIsLoading(true);
    const { success, message } = await changePassword(currentPassword, newPassword);
    if (success) {
      toast.success(message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(message || "Failed to update password");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Change Password</h3>
          <p className="text-sm text-gray-500">Update your account security credentials</p>
        </div>
      </div>

      <form onSubmit={handleUpdatePassword} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-xl border border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-xl border border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-xl border border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? "Updating..." : (
              <>
                <Save className="w-4 h-4" />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function SecuritySettings() {
  const { setupMfa, verifyMfaSetup, disableMfa } = useAuthStore();
  const [mfaData, setMfaData] = useState<{ qr_code_base64: string; secret: string; totp_uri: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);

  const handleInitiateSetup = async () => {
    setIsLoading(true);
    const { success, data } = await setupMfa();
    if (success && data) {
      setMfaData(data);
    } else {
      toast.error("Failed to initiate MFA setup");
    }
    setIsLoading(false);
  };

  const handleVerifySetup = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    setIsLoading(true);
    const success = await verifyMfaSetup(verificationCode);
    if (success) {
      toast.success("MFA Setup Successful!");
      setIsSetupComplete(true);
    } else {
      toast.error("Invalid verification code");
    }
    setIsLoading(false);
  };

  const handleDisableMfa = async () => {
    if (!disablePassword) {
      toast.error("Please enter your password to disable MFA");
      return;
    }
    setIsLoading(true);
    const success = await disableMfa(disablePassword);
    if (success) {
      toast.success("MFA Disabled Successfully");
      setIsSetupComplete(false);
      setMfaData(null);
      setShowDisableConfirm(false);
      setDisablePassword("");
    } else {
      toast.error("Failed to disable MFA. Please check your password.");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Multi-Factor Authentication (MFA)</h3>
          <p className="text-sm text-gray-500">Enhance your account security with TOTP authentication</p>
        </div>
      </div>

      {!mfaData && !isSetupComplete && (
        <div className="bg-gray-50 rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
          <p className="text-sm text-gray-600 mb-4">MFA is currently disabled for your account. We highly recommend enabling it to protect your hospital data.</p>
          <button
            onClick={handleInitiateSetup}
            disabled={isLoading}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Initiating..." : "Enable MFA Setup"}
          </button>
        </div>
      )}

      {mfaData && !isSetupComplete && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
              <img src={mfaData.qr_code_base64} alt="MFA QR Code" className="w-48 h-48" />
              <p className="mt-4 text-xs font-mono text-gray-400 select-all">{mfaData.secret}</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Scan QR Code</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                1. Open your authenticator app (e.g., Google Authenticator, Authy).<br/>
                2. Scan the QR code shown here.<br/>
                3. Enter the 6-digit code from the app below to verify.
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] rounded-xl border border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
              <button
                onClick={handleVerifySetup}
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Confirm & Enable"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSetupComplete && (
        <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-bold text-green-900 mb-1">MFA is Active</h4>
          <p className="text-sm text-green-700">Your account is now protected with multi-factor authentication.</p>
          <button
            onClick={() => { setMfaData(null); setIsSetupComplete(false); }}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Reset UI (For Demo)
          </button>
          
          <div className="mt-8 pt-8 border-t border-gray-100">
            {!showDisableConfirm ? (
              <button
                onClick={() => setShowDisableConfirm(true)}
                className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors"
              >
                Disable Multi-Factor Authentication
              </button>
            ) : (
              <div className="space-y-4 max-w-sm mx-auto">
                <p className="text-sm text-gray-600 font-medium">Enter password to disable MFA</p>
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-sm"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDisableConfirm(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDisableMfa}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50"
                  >
                    {isLoading ? "Disabling..." : "Confirm Disable"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FieldEdit({ label, value, editable }: { label: string; value: string; editable: boolean }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {editable ? (
        <input type="text" defaultValue={value} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary outline-none" />
      ) : (
        <p className="text-sm font-medium text-gray-900 py-2">{value}</p>
      )}
    </div>
  );
}

function DepartmentManagement({ hospital, setHospital }: { hospital: any; setHospital: any }) {
  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", head: "", beds: "", phone: "" });

  const handleAddDept = () => {
    if (!newDept.name || !newDept.head) {
      toast.error("Please fill in department name and head");
      return;
    }
    const dept = {
      id: `DEPT${String(hospital.departments.length + 1).padStart(3, "0")}`,
      name: newDept.name,
      headOfDept: newDept.head,
      bedCount: parseInt(newDept.beds) || 0,
      phone: newDept.phone,
      isActive: true
    };
    setHospital({ ...hospital, departments: [...hospital.departments, dept] });
    setShowModal(false);
    setNewDept({ name: "", head: "", beds: "", phone: "" });
    toast.success("Department added successfully");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/30">
        <div>
          <h3 className="font-bold text-gray-900">Hospital Departments</h3>
          <p className="text-xs text-gray-500">Configure clinical departments and bed capacities</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-600 shadow-sm transition-all active:scale-95">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead className="bg-gray-50/50 italic">
            <tr><th>Department Name</th><th>Head of Dept</th><th>Bed Count</th><th>Contact Ext.</th><th>Status</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {hospital.departments.map((dept: any) => (
              <tr key={dept.id} className="hover:bg-gray-50/30">
                <td className="font-bold text-gray-800">{dept.name}</td>
                <td className="text-gray-600">{dept.headOfDept}</td>
                <td className="font-mono text-primary font-bold">{dept.bedCount}</td>
                <td className="font-mono text-xs text-gray-500">{dept.phone}</td>
                <td>
                  <span className={cn("badge", dept.isActive ? "bg-green-100 text-green-700 font-bold" : "bg-gray-100 text-gray-500")}>
                    {dept.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-modal-in overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">New Department</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Department Name</label><input type="text" value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} className="form-input-premium" placeholder="e.g. Critical Care" /></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Head of Department</label><input type="text" value={newDept.head} onChange={e => setNewDept({...newDept, head: e.target.value})} className="form-input-premium" placeholder="e.g. Dr. Sarah Connor" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Total Beds</label><input type="number" value={newDept.beds} onChange={e => setNewDept({...newDept, beds: e.target.value})} className="form-input-premium" placeholder="0" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Contact Phone</label><input type="tel" value={newDept.phone} onChange={e => setNewDept({...newDept, phone: e.target.value})} className="form-input-premium" placeholder="+91..." /></div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30 flex gap-3">
              <button onClick={handleAddDept} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all">Create Department</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .form-input-premium {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          border: 1px solid #E2E8F0;
          font-size: 0.875rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          color: #1A202C;
          background-color: #F8FAFC;
        }
        .form-input-premium:focus {
          border-color: var(--primary);
          background-color: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .animate-modal-in {
          animation: modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
