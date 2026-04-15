"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuth";
import { UserRole } from "@/types";
import { ROLE_LABELS } from "@/lib/constants";
import {
  Activity, Eye, EyeOff, Lock, User, Shield, ArrowRight,
  Mail, KeyRound, Building2, Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Step = "credentials" | "otp" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const { login, verifyOtp, isLoading } = useAuthStore();

  const [step, setStep] = useState<Step>("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("hospital_admin");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    const success = await login(username, password, role);
    if (success) {
      setStep("otp");
      toast.success("OTP sent to registered mobile");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    const success = await verifyOtp(otpString);
    if (success) {
      toast.success("Login successful!");
      router.push("/dashboard");
    } else {
      toast.error("Invalid OTP. Try again.");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password reset link sent to " + forgotEmail);
    setStep("credentials");
  };

  return (
    <>
    <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: "#1F2937", color: "#F9FAFB", borderRadius: "12px", fontSize: "14px" } }} />
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-white/5 rounded-full" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center mb-8 shadow-xl">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">TeleEMS</h1>
          <p className="text-xl text-primary-100 mb-2">Emergency Medical Services Platform</p>
          <p className="text-sm text-primary-200 mb-12">by CureSelect Healthcare LLP</p>

          <div className="grid grid-cols-3 gap-6 max-w-md">
            {[
              { icon: "🚑", label: "Fleet Management", desc: "Real-time ambulance tracking" },
              { icon: "📹", label: "TeleLink", desc: "Live teleconsultation" },
              { icon: "📋", label: "ePCR", desc: "Digital patient records" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-1">{item.label}</h3>
                <p className="text-primary-200 text-[10px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TeleEMS</h1>
              <p className="text-xs text-gray-500">CureSelect Healthcare LLP</p>
            </div>
          </div>

          {/* Credentials Step */}
          {step === "credentials" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
                <p className="text-gray-500 text-sm">Sign in to your Hospital Admin account</p>
              </div>

              {/* Role Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sign in as</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["hospital_admin", "hospital_coordinator", "ed_doctor"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                        role === r
                          ? "border-primary bg-primary-50 text-primary shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-center mb-1.5">
                        {r === "hospital_admin" ? <Building2 className="w-5 h-5" /> :
                         r === "hospital_coordinator" ? <Shield className="w-5 h-5" /> :
                         <User className="w-5 h-5" />}
                      </div>
                      <span className="text-[11px] font-medium leading-tight block">{ROLE_LABELS[r]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      id="login-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button type="button" onClick={() => setStep("forgot")} className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4 mx-auto">
                  <KeyRound className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verify OTP</h2>
                <p className="text-gray-500 text-sm text-center">Enter the 6-digit code sent to your registered mobile</p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify & Login <ArrowRight className="w-4 h-4" /></>}
                </button>

                <div className="text-center">
                  <button type="button" className="text-sm text-primary hover:underline">Resend OTP</button>
                  <span className="text-gray-300 mx-2">|</span>
                  <button type="button" onClick={() => { setStep("credentials"); setOtp(["", "", "", "", "", ""]); }} className="text-sm text-gray-500 hover:underline">
                    Back to login
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Forgot Password Step */}
          {step === "forgot" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4 mx-auto">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Reset Password</h2>
                <p className="text-gray-500 text-sm text-center">Enter your email to receive a password reset link</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      placeholder="Enter your registered email"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-primary to-primary-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                  Send Reset Link
                </button>
                <button type="button" onClick={() => setStep("credentials")} className="w-full text-sm text-gray-500 hover:underline text-center py-2">
                  Back to login
                </button>
              </form>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-8">
            © 2026 CureSelect Healthcare LLP. All rights reserved.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
