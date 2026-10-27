"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import EditProfileModal from "@/components/EditProfileModal";
import {
  FiSave,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiUser,
  FiCamera,
} from "react-icons/fi";
import { API_BASE } from "@/lib/config";

interface AdminUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export default function SettingsPage() {
  const [shippingFee, setShippingFee] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load local admin user
    try {
      const stored = localStorage.getItem("admin_user");
      if (stored) setAdminUser(JSON.parse(stored));
    } catch {}

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

    // Fetch fresh admin profile
    if (token) {
      fetch(`${API_BASE}/admin-auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.success && data?.user) {
            setAdminUser(data.user);
            localStorage.setItem("admin_user", JSON.stringify(data.user));
          }
        })
        .catch(() => {});
    }

    // Fetch settings
    fetch(`${API_BASE}/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.data) {
          setShippingFee(data.data.shippingFee ?? 0);
          setFreeShippingThreshold(data.data.freeShippingThreshold ?? 0);
        }
      })
      .catch(() => setErrorMsg("Failed to load settings."))
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (str?: string) => {
    if (!str) return "A";
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    if (shippingFee < 0 || freeShippingThreshold < 0) {
      setErrorMsg("Values must be 0 or more.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token") || "demo_token";
      const res = await fetch(`${API_BASE}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ shippingFee, freeShippingThreshold }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to save.");
      setSuccessMsg("Shipping fee updated successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "46px",
    borderRadius: "10px",
    border: "1px solid #E2D9F3",
    padding: "0 14px",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#FAFBFF",
    fontFamily: "inherit",
    boxSizing: "border-box",
    color: "#1E1B4B",
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: "560px", margin: "0 auto", paddingBottom: "40px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#541A28", margin: "0 0 6px 0" }}>
            Store Settings
          </h1>
          <p style={{ color: "#7E5664", fontSize: "14px", margin: 0 }}>
            Manage store shipping fee and customize admin profile photo.
          </p>
        </div>

        {/* Banners */}
        {successMsg && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", color: "#15803D", fontSize: "14px", fontWeight: 600 }}>
            <FiCheckCircle size={18} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#FFF2F2", border: "1.5px solid #FCA5A5", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", color: "#DC2626", fontSize: "14px", fontWeight: 600 }}>
            <FiAlertCircle size={18} /> {errorMsg}
          </div>
        )}

        {/* Card 1: Admin Profile & Photo */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #EFE8E0",
            boxShadow: "0 2px 14px rgba(84, 26, 40, 0.05)",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", paddingBottom: "12px", borderBottom: "1px solid #F0EAE1" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#541A28", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              <FiUser size={18} color="#BB8E43" /> Admin Profile Photo
            </h2>
            <span style={{ fontSize: "12px", color: "#7E5664" }}>Header Avatar</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  border: "2.5px solid #BB8E43",
                  overflow: "hidden",
                  backgroundColor: "#FAF6EE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(84, 26, 40, 0.12)",
                }}
              >
                {adminUser?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={adminUser.avatar}
                    alt={adminUser.name || "Admin"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #541A28 0%, #7D283C 100%)",
                      color: "#E5C384",
                      fontSize: 18,
                      fontWeight: 800,
                      fontFamily: "Cinzel, serif",
                    }}
                  >
                    {getInitials(adminUser?.name)}
                  </div>
                )}
              </div>

              <div>
                <strong style={{ display: "block", fontSize: "15px", color: "#541A28" }}>
                  {adminUser?.name || "Super Admin"}
                </strong>
                <span style={{ fontSize: "12.5px", color: "#7E5664", display: "block", marginTop: "2px" }}>
                  {adminUser?.email || "gr0184236@gmail.com"}
                </span>
                <span style={{ fontSize: "11px", color: "#BB8E43", fontWeight: 600, display: "inline-block", marginTop: "4px" }}>
                  {adminUser?.avatar ? "● Custom photo active" : "○ Default monogram active"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 18px",
                borderRadius: "10px",
                backgroundColor: "#FAF6EE",
                border: "1.5px solid #BB8E43",
                color: "#541A28",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <FiCamera size={15} color="#BB8E43" />
              Change Photo
            </button>
          </div>
        </div>

        {/* Card 2: Shipping Settings */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6B7280" }}>
            <FiRefreshCw size={28} style={{ animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #EDE9FE", boxShadow: "0 2px 14px rgba(76,61,143,0.06)", padding: "26px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1E1B4B", margin: "0 0 20px 0", paddingBottom: "14px", borderBottom: "1px solid #EDE9FE", display: "flex", alignItems: "center", gap: "10px" }}>
                <FiTruck size={17} color="#4C3D8F" /> Shipping Fee
              </h2>

              {/* Shipping Fee */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4C3D8F", marginBottom: "6px" }}>
                  Shipping Fee (₹) per order
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={shippingFee}
                  onChange={(e) => setShippingFee(Number(e.target.value))}
                  style={inputStyle}
                  placeholder="e.g. 50"
                />
                <span style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "5px", display: "block" }}>
                  Set to 0 for always-free delivery
                </span>
              </div>

              {/* Free Shipping Threshold */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4C3D8F", marginBottom: "6px" }}>
                  Free Shipping Above (₹) — order subtotal
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  style={inputStyle}
                  placeholder="e.g. 999"
                />
                <span style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "5px", display: "block" }}>
                  Orders above this subtotal get free shipping. Set to 0 to disable.
                </span>
              </div>

              {/* Live Preview */}
              <div style={{ backgroundColor: "#F5F3FF", borderRadius: "10px", padding: "14px 16px", fontSize: "13.5px", color: "#5B21B6" }}>
                <strong style={{ display: "block", marginBottom: "4px" }}>Preview</strong>
                {shippingFee === 0
                  ? "✅ Free delivery on all orders"
                  : freeShippingThreshold > 0
                  ? `🚚 ₹${shippingFee} shipping — free above ₹${freeShippingThreshold.toLocaleString("en-IN")}`
                  : `🚚 ₹${shippingFee} shipping on every order`}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={saving}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", borderRadius: "10px", backgroundColor: saving ? "#7C6FCD" : "#4C3D8F", color: "#FFF", fontWeight: 700, fontSize: "15px", border: "none", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(76,61,143,0.35)", fontFamily: "inherit" }}
              >
                {saving ? <><FiRefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><FiSave size={15} /> Save Shipping Fee</>}
                <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
              </button>
            </div>
          </form>
        )}

        {/* Profile & Photo Modal */}
        <EditProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentUser={adminUser}
          onProfileUpdated={(updated) => setAdminUser(updated)}
        />
      </div>
    </AdminShell>
  );
}
