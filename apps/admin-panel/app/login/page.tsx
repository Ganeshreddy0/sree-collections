"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiMail, FiLock, FiShield, FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { API_BASE } from "@/lib/config";

type LoginMode = "password" | "otp";
type View = "login" | "forgot_email" | "forgot_otp" | "forgot_reset" | "success_reset";

interface OtpInputProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={6}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      placeholder="000000"
      autoFocus
      style={{
        width: "100%",
        height: "56px",
        textAlign: "center",
        letterSpacing: "14px",
        fontFamily: "monospace",
        fontSize: "26px",
        fontWeight: 700,
        padding: "0 16px",
        borderRadius: "10px",
        border: "2px solid #541A28",
        outline: "none",
        background: "#FFF9F5",
        color: "#541A28",
        boxSizing: "border-box",
      }}
    />
  );
}

function InputField({
  type,
  value,
  onChange,
  placeholder,
  icon,
  showToggle,
  showVal,
  onToggle,
  disabled,
  autoFocus,
}: {
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  showToggle?: boolean;
  showVal?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <div style={{ position: "relative" }}>
      {icon && (
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#541A2888", pointerEvents: "none", display: "flex" }}>
          {icon}
        </span>
      )}
      <input
        type={showToggle ? (showVal ? "text" : "password") : type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        style={{
          width: "100%",
          height: "48px",
          padding: `0 ${showToggle ? 44 : 16}px 0 ${icon ? 42 : 16}px`,
          borderRadius: "10px",
          border: "1.5px solid #541A28",
          fontSize: "14px",
          color: "#1F1418",
          outline: "none",
          boxSizing: "border-box",
          background: disabled ? "#F5F0EE" : "#FFFFFF",
          opacity: disabled ? 0.7 : 1,
        }}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#541A28", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
        >
          {showVal ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      )}
    </div>
  );
}

function AlertBox({ type, message }: { type: "error" | "success" | "info"; message: string }) {
  const colors = {
    error:   { bg: "#FFF2F2", border: "#FFAAAA", text: "#B22222" },
    success: { bg: "#F0FFF4", border: "#68D391",  text: "#276749" },
    info:    { bg: "#EBF8FF", border: "#90CDF4",  text: "#2A4365" },
  };
  const c = colors[type];
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: c.text, fontWeight: 500, lineHeight: 1.5, wordBreak: "break-word" }}>
      {message}
    </div>
  );
}

function PrimaryBtn({ children, loading, disabled, onClick, style }: { children: React.ReactNode; loading?: boolean; disabled?: boolean; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        width: "100%",
        height: "48px",
        borderRadius: "24px",
        backgroundColor: loading || disabled ? "#9B6874" : "#541A28",
        color: "#FFFFFF",
        fontSize: "15px",
        fontWeight: 600,
        border: "none",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s, opacity 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

const DotGrid = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 8px)", gap: "10px", opacity: 0.55 }}>
    {Array.from({ length: 16 }).map((_, i) => (
      <span key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#7E5664", display: "inline-block" }} />
    ))}
  </div>
);

export default function AdminLoginPage() {
  const router = useRouter();

  // ─── Redirect if already logged in ───────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.replace("/");
    }
  }, [router]);

  // ─── Login state ──────────────────────────────────────────────────────────
  const [view, setView] = useState<View>("login");
  const [loginMode, setLoginMode] = useState<LoginMode>("password");

  // Password login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP login
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);

  // Forgot password
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNew, setFpNew] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [showFpNew, setShowFpNew] = useState(false);
  const [showFpConfirm, setShowFpConfirm] = useState(false);
  const [fpCooldown, setFpCooldown] = useState(0);
  const [fpOtpVerified, setFpOtpVerified] = useState(false);

  // Shared
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // ─── Cooldown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setTimeout(() => setOtpCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCooldown]);

  useEffect(() => {
    if (fpCooldown <= 0) return;
    const t = setTimeout(() => setFpCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [fpCooldown]);

  const clearMessages = () => { setError(null); setInfo(null); };

  // ─── Persist auth token ───────────────────────────────────────────────────
  const persistAuth = (token: string, user: { name: string; email: string; role: string }) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(user));
  };

  // ─── Password Login ───────────────────────────────────────────────────────
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Invalid credentials.");
        return;
      }
      persistAuth(data.token, data.user);
      router.push("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP Login: Send OTP ──────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!otpEmail.trim()) { setError("Please enter your email."); return; }
    if (otpCooldown > 0) return;
    clearMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail.trim() }),
      });
      const data = await res.json();
      if (res.status === 429) { setError(data.message); return; }
      setOtpSent(true);
      setOtpCooldown(60);
      setInfo(data.message || "OTP sent! Check your email.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP Login: Verify OTP ────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) { setError("Please enter the 6-digit OTP."); return; }
    clearMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail.trim(), otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.message); return; }
      persistAuth(data.token, data.user);
      router.push("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Forgot Password: Send OTP ────────────────────────────────────────────
  const handleForgotSendOtp = async () => {
    if (!fpEmail.trim()) { setError("Please enter your email."); return; }
    if (fpCooldown > 0) return;
    clearMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail.trim() }),
      });
      const data = await res.json();
      if (res.status === 429) { setError(data.message); return; }
      setView("forgot_otp");
      setFpCooldown(60);
      setInfo("OTP sent to your email. Check your inbox.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Forgot Password: Verify OTP ─────────────────────────────────────────
  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fpOtp.length !== 6) { setError("Enter the 6-digit OTP."); return; }
    clearMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail.trim(), otp: fpOtp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.message); return; }
      setFpOtpVerified(true);
      setView("forgot_reset");
      setInfo("OTP verified! Set your new password below.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Forgot Password: Reset ───────────────────────────────────────────────
  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fpNew.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (fpNew !== fpConfirm) { setError("Passwords do not match."); return; }
    clearMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail.trim(), otp: fpOtp, newPassword: fpNew, confirmPassword: fpConfirm }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.message); return; }
      setView("success_reset");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Back to login ────────────────────────────────────────────────────────
  const goBackToLogin = () => {
    setView("login");
    setFpEmail(""); setFpOtp(""); setFpNew(""); setFpConfirm("");
    setFpOtpVerified(false); setFpCooldown(0);
    clearMessages();
  };

  // ─── Render helpers ───────────────────────────────────────────────────────
  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    height: "40px",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
    background: active ? "#541A28" : "transparent",
    color: active ? "#FFFFFF" : "#541A28",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Decorative dots */}
      <div style={{ position: "absolute", top: "40px", right: "60px" }}><DotGrid /></div>
      <div style={{ position: "absolute", bottom: "40px", left: "60px" }}><DotGrid /></div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: "440px", padding: "20px", display: "flex", flexDirection: "column" }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <Image src="/logo.png" alt="Sree Collections" width={380} height={90} priority style={{ width: "auto", height: "80px", objectFit: "contain" }} />
        </div>

        {/* ── SUCCESS RESET VIEW ────────────────────────────────────────────── */}
        {view === "success_reset" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0FFF4", border: "2px solid #68D391", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <FiShield size={30} color="#276749" />
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, color: "#541A28", marginBottom: 8 }}>Password Reset!</h2>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 28 }}>Your password has been reset successfully. Please sign in with your new password.</p>
            <PrimaryBtn onClick={goBackToLogin}>Back to Sign In</PrimaryBtn>
          </div>
        )}

        {/* ── FORGOT PASSWORD: ENTER EMAIL ─────────────────────────────────── */}
        {view === "forgot_email" && (
          <>
            <button onClick={goBackToLogin} style={{ background: "none", border: "none", color: "#541A28", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0 }}>
              <FiArrowLeft size={15} /> Back to Sign In
            </button>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, color: "#541A28", marginBottom: 6 }}>Forgot Password</h1>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.6 }}>Enter your admin email address and we'll send you an OTP to reset your password.</p>
            {error && <div style={{ marginBottom: 14 }}><AlertBox type="error" message={error} /></div>}
            {info && <div style={{ marginBottom: 14 }}><AlertBox type="info" message={info} /></div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputField type="email" value={fpEmail} onChange={setFpEmail} placeholder="Admin Email" icon={<FiMail size={16} />} autoFocus />
              <PrimaryBtn loading={loading} disabled={fpCooldown > 0} onClick={handleForgotSendOtp}>
                {loading ? "Sending…" : fpCooldown > 0 ? `Resend in ${fpCooldown}s` : "Send OTP"}
              </PrimaryBtn>
            </div>
          </>
        )}

        {/* ── FORGOT PASSWORD: VERIFY OTP ──────────────────────────────────── */}
        {view === "forgot_otp" && (
          <>
            <button onClick={() => { setView("forgot_email"); clearMessages(); }} style={{ background: "none", border: "none", color: "#541A28", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0 }}>
              <FiArrowLeft size={15} /> Back
            </button>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, color: "#541A28", marginBottom: 6 }}>Enter OTP</h1>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.6 }}>
              We sent a 6-digit OTP to <strong>{fpEmail}</strong>. It's valid for 10 minutes.
            </p>
            {error && <div style={{ marginBottom: 14 }}><AlertBox type="error" message={error} /></div>}
            {info && <div style={{ marginBottom: 14 }}><AlertBox type="success" message={info} /></div>}
            <form onSubmit={handleForgotVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <OtpInput value={fpOtp} onChange={setFpOtp} disabled={loading} />
              <PrimaryBtn loading={loading}>
                {loading ? "Verifying…" : "Verify OTP"}
              </PrimaryBtn>
              <button
                type="button"
                onClick={() => { clearMessages(); handleForgotSendOtp(); }}
                disabled={fpCooldown > 0 || loading}
                style={{ background: "none", border: "none", color: fpCooldown > 0 ? "#AAA" : "#541A28", fontSize: 13, fontWeight: 600, cursor: fpCooldown > 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <FiRefreshCw size={13} /> {fpCooldown > 0 ? `Resend in ${fpCooldown}s` : "Resend OTP"}
              </button>
            </form>
          </>
        )}

        {/* ── FORGOT PASSWORD: SET NEW PASSWORD ────────────────────────────── */}
        {view === "forgot_reset" && (
          <>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, color: "#541A28", marginBottom: 6 }}>Set New Password</h1>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.6 }}>Choose a strong new password (min. 8 characters).</p>
            {error && <div style={{ marginBottom: 14 }}><AlertBox type="error" message={error} /></div>}
            {info && <div style={{ marginBottom: 14 }}><AlertBox type="success" message={info} /></div>}
            <form onSubmit={handleForgotReset} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputField
                type="password" value={fpNew} onChange={setFpNew}
                placeholder="New Password" icon={<FiLock size={16} />}
                showToggle showVal={showFpNew} onToggle={() => setShowFpNew(!showFpNew)}
                disabled={loading} autoFocus
              />
              <InputField
                type="password" value={fpConfirm} onChange={setFpConfirm}
                placeholder="Confirm New Password" icon={<FiLock size={16} />}
                showToggle showVal={showFpConfirm} onToggle={() => setShowFpConfirm(!showFpConfirm)}
                disabled={loading}
              />
              <PrimaryBtn loading={loading}>{loading ? "Resetting…" : "Reset Password"}</PrimaryBtn>
            </form>
          </>
        )}

        {/* ── LOGIN VIEW ─────────────────────────────────────────────────────── */}
        {view === "login" && (
          <>
            {/* Title */}
            <div style={{ marginBottom: "20px" }}>
              <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "26px", fontWeight: 700, color: "#541A28", marginBottom: "6px" }}>
                Sign In
              </h1>
              <p style={{ fontSize: "13px", color: "#666", margin: 0, lineHeight: 1.6 }}>
                Access the Sree Collections admin panel.
              </p>
            </div>

            {/* Mode Toggle */}
            <div style={{ display: "flex", background: "#F5ECEC", borderRadius: 10, padding: 4, marginBottom: 22, gap: 4 }}>
              <button type="button" style={tabStyle(loginMode === "password")} onClick={() => { setLoginMode("password"); clearMessages(); setOtpSent(false); setOtpCode(""); }}>
                🔑 Password
              </button>
              <button type="button" style={tabStyle(loginMode === "otp")} onClick={() => { setLoginMode("otp"); clearMessages(); }}>
                📱 OTP Login
              </button>
            </div>

            {/* Alerts */}
            {error && <div style={{ marginBottom: 14 }}><AlertBox type="error" message={error} /></div>}
            {info  && <div style={{ marginBottom: 14 }}><AlertBox type="info"  message={info} /></div>}

            {/* ── Password Login Form ────────────────────────────────────────── */}
            {loginMode === "password" && (
              <form onSubmit={handlePasswordLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <InputField
                  type="email" value={email} onChange={setEmail}
                  placeholder="Admin Email" icon={<FiMail size={16} />}
                  autoFocus
                />
                <InputField
                  type="password" value={password} onChange={setPassword}
                  placeholder="Password" icon={<FiLock size={16} />}
                  showToggle showVal={showPassword} onToggle={() => setShowPassword(!showPassword)}
                />

                {/* Remember Me + Forgot */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 500, color: "#1F1418", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ width: 15, height: 15, accentColor: "#541A28", cursor: "pointer" }}
                    />
                    Remember Me
                  </label>
                  <button
                    type="button"
                    onClick={() => { setView("forgot_email"); clearMessages(); }}
                    style={{ background: "none", border: "none", color: "#541A28", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "underline", padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div style={{ marginTop: 6 }}>
                  <PrimaryBtn loading={loading}>{loading ? "Signing In…" : "Sign In"}</PrimaryBtn>
                </div>
              </form>
            )}

            {/* ── OTP Login ─────────────────────────────────────────────────── */}
            {loginMode === "otp" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {!otpSent ? (
                  <>
                    <InputField
                      type="email" value={otpEmail} onChange={setOtpEmail}
                      placeholder="Admin Email" icon={<FiMail size={16} />}
                      autoFocus
                    />
                    <PrimaryBtn loading={loading} disabled={otpCooldown > 0} onClick={handleSendOtp}>
                      {loading ? "Sending…" : otpCooldown > 0 ? `Resend in ${otpCooldown}s` : "Send OTP"}
                    </PrimaryBtn>
                  </>
                ) : (
                  <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.6 }}>
                      OTP sent to <strong>{otpEmail}</strong>. Enter the 6-digit code below.
                    </p>
                    <OtpInput value={otpCode} onChange={setOtpCode} disabled={loading} />
                    <PrimaryBtn loading={loading}>{loading ? "Verifying…" : "Verify & Sign In"}</PrimaryBtn>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtpCode(""); clearMessages(); }}
                        style={{ background: "none", border: "none", color: "#541A28", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 5 }}
                      >
                        <FiArrowLeft size={13} /> Change email
                      </button>
                      <button
                        type="button"
                        onClick={() => { clearMessages(); setOtpCode(""); handleSendOtp(); }}
                        disabled={otpCooldown > 0 || loading}
                        style={{ background: "none", border: "none", color: otpCooldown > 0 ? "#AAA" : "#541A28", fontSize: 13, fontWeight: 600, cursor: otpCooldown > 0 ? "default" : "pointer", display: "flex", alignItems: "center", gap: 5 }}
                      >
                        <FiRefreshCw size={13} /> {otpCooldown > 0 ? `Resend ${otpCooldown}s` : "Resend OTP"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
