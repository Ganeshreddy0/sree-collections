"use client";

import React, { useState } from "react";
import { FiLock, FiEye, FiEyeOff, FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { API_BASE } from "@/lib/config";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      setError("You are not logged in. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to change password.");
        return;
      }

      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          boxShadow: "0 20px 40px rgba(84, 26, 40, 0.2)",
          width: "100%",
          maxWidth: 440,
          border: "1px solid #EFE8E0",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #F0EAE1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#FDFAF5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#541A2812",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#541A28",
              }}
            >
              <FiLock size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#541A28" }}>
                Change Password
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: "#888" }}>
                Update your admin credentials securely
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888",
              padding: 4,
              display: "flex",
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "22px 24px" }}>
          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                background: "#FFF2F2",
                border: "1px solid #FFAAAA",
                borderRadius: 8,
                color: "#B22222",
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FiAlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                background: "#F0FFF4",
                border: "1px solid #68D391",
                borderRadius: 8,
                color: "#276749",
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FiCheckCircle size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Current Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#541A28", marginBottom: 6 }}>
                Current Password <span style={{ color: "#E53E3E" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  style={{
                    width: "100%",
                    height: 44,
                    padding: "0 40px 0 14px",
                    borderRadius: 8,
                    border: "1.5px solid #D8C4AA",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#888",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                  }}
                >
                  {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#541A28", marginBottom: 6 }}>
                New Password <span style={{ color: "#E53E3E" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  style={{
                    width: "100%",
                    height: 44,
                    padding: "0 40px 0 14px",
                    borderRadius: 8,
                    border: "1.5px solid #D8C4AA",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#888",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                  }}
                >
                  {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <span style={{ fontSize: 11, color: "#888", marginTop: 4, display: "block" }}>
                Must be at least 8 characters long
              </span>
            </div>

            {/* Confirm New Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#541A28", marginBottom: 6 }}>
                Confirm New Password <span style={{ color: "#E53E3E" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  minLength={8}
                  style={{
                    width: "100%",
                    height: 44,
                    padding: "0 40px 0 14px",
                    borderRadius: 8,
                    border: "1.5px solid #D8C4AA",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#888",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                  }}
                >
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: "1px solid #D8C4AA",
                background: "#FFF",
                color: "#541A28",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                border: "none",
                background: loading ? "#9B6874" : "#541A28",
                color: "#FFF",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
