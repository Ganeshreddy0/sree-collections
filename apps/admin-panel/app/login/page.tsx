"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@sreecollections.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem("admin_token", "super_admin_authenticated");
    localStorage.setItem(
      "admin_user",
      JSON.stringify({ name: "Super Admin", email, role: "admin" })
    );
    router.push("/");
  };

  const DotGrid = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 8px)", gap: "10px", opacity: 0.65 }}>
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#7E5664", display: "inline-block" }}
        />
      ))}
    </div>
  );

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
      {/* Decorative Dots Top-Right */}
      <div style={{ position: "absolute", top: "40px", right: "60px" }}>
        <DotGrid />
      </div>

      {/* Decorative Dots Bottom-Left */}
      <div style={{ position: "absolute", bottom: "40px", left: "60px" }}>
        <DotGrid />
      </div>

      {/* Main Container */}
      <div style={{ width: "100%", maxWidth: "440px", padding: "20px", display: "flex", flexDirection: "column" }}>
        {/* Header Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <Image
            src="/logo.png"
            alt="sreecollections"
            width={380}
            height={90}
            priority
            style={{ width: "auto", height: "80px", objectFit: "contain" }}
          />
        </div>

        {/* Title */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "26px",
              fontWeight: 700,
              color: "#541A28",
              marginBottom: "8px",
            }}
          >
            Sign In
          </h1>
          <p style={{ fontSize: "14px", color: "#541A28", margin: 0, fontWeight: 500 }}>
            Access the Dreamspos panel using your email and passcode.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                width: "100%",
                height: "48px",
                padding: "0 16px",
                borderRadius: "10px",
                border: "1.5px solid #541A28",
                fontSize: "14px",
                color: "#1F1418",
                outline: "none",
                boxSizing: "border-box",
                background: "#FFFFFF",
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: "100%",
                height: "48px",
                padding: "0 46px 0 16px",
                borderRadius: "10px",
                border: "1.5px solid #541A28",
                fontSize: "14px",
                color: "#1F1418",
                outline: "none",
                boxSizing: "border-box",
                background: "#FFFFFF",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#541A28",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {/* Remember Me */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: "#541A28", cursor: "pointer" }}
            />
            <label htmlFor="remember" style={{ fontSize: "14px", fontWeight: 500, color: "#1F1418", cursor: "pointer" }}>
              Remember Me
            </label>
          </div>

          {/* Sign In Button */}
          <div style={{ marginTop: "12px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "24px",
                backgroundColor: "#541A28",
                color: "#FFFFFF",
                fontSize: "15px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.2s",
                boxShadow: "0 2px 4px rgba(84, 26, 40, 0.2)",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
