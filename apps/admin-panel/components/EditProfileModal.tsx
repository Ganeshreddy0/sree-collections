"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FiUser,
  FiCamera,
  FiUpload,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiRefreshCw,
  FiLink,
} from "react-icons/fi";
import { API_BASE } from "@/lib/config";

interface AdminUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AdminUser | null;
  onProfileUpdated: (updatedUser: AdminUser) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [name, setName] = useState(currentUser?.name || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentUser?.name || "");
      setAvatar(currentUser?.avatar || "");
      setShowUrlInput(false);
      setUrlInput("");
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const getInitials = (str?: string) => {
    if (!str) return "A";
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError("File size must be under 8MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_BASE}/upload/single`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to upload image.");
      }

      setAvatar(data.url);
      setSuccess("Photo uploaded! Click 'Save Changes' to update profile.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setAvatar(urlInput.trim());
    setUrlInput("");
    setShowUrlInput(false);
    setSuccess("Image URL applied! Click 'Save Changes' to confirm.");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleRemovePhoto = () => {
    setAvatar("");
    setError(null);
    setSuccess("Photo removed. Default monogram avatar will be used.");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin-auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim() || currentUser?.name || "Admin",
          avatar: avatar.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save profile.");
      }

      const updatedUser: AdminUser = {
        ...(currentUser || {}),
        name: data.user?.name || name.trim(),
        email: data.user?.email || currentUser?.email,
        avatar: data.user?.avatar || avatar.trim(),
      };

      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_user", JSON.stringify(updatedUser));
      }

      onProfileUpdated(updatedUser);
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(31, 20, 24, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving && !uploading) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#FFFFFF",
          borderRadius: "18px",
          boxShadow: "0 20px 50px rgba(84, 26, 40, 0.25)",
          border: "1px solid #EFE8E0",
          overflow: "hidden",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <style>{`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #541A28 0%, #3D121D 100%)",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "rgba(187, 142, 67, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E5C384",
              }}
            >
              <FiUser size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#FFFFFF" }}>
                Admin Profile &amp; Photo
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "rgba(255, 255, 255, 0.75)" }}>
                Personalize your admin avatar &amp; details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving || uploading}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#FFFFFF",
              transition: "background 0.2s",
            }}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} style={{ padding: "24px" }}>
          {/* Notifications */}
          {error && (
            <div
              style={{
                backgroundColor: "#FFF2F2",
                border: "1.5px solid #FCA5A5",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 18,
                color: "#DC2626",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FiAlertCircle size={16} /> {error}
            </div>
          )}

          {success && (
            <div
              style={{
                backgroundColor: "#F0FDF4",
                border: "1.5px solid #86EFAC",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 18,
                color: "#15803D",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FiCheckCircle size={16} /> {success}
            </div>
          )}

          {/* Avatar Preview Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "18px 0 22px",
              borderBottom: "1px solid #F0EAE1",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "3px solid #BB8E43",
                boxShadow: "0 8px 24px rgba(84, 26, 40, 0.15)",
                overflow: "hidden",
                background: "#FDFAF5",
                marginBottom: 16,
              }}
            >
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt="Admin Avatar Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    // Fallback on broken image
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
                    fontSize: 32,
                    fontWeight: 800,
                    letterSpacing: "1px",
                    fontFamily: "Cinzel, serif",
                  }}
                >
                  {getInitials(name || currentUser?.name)}
                </div>
              )}

              {uploading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                  }}
                >
                  <FiRefreshCw size={24} style={{ animation: "spin 1s linear infinite" }} />
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            {/* Action Buttons for Avatar */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid #BB8E43",
                  backgroundColor: "#FAF6EE",
                  color: "#541A28",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <FiCamera size={14} color="#BB8E43" />
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                disabled={uploading || saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid #D8C4AA",
                  backgroundColor: "#FFFFFF",
                  color: "#541A28",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <FiLink size={13} />
                Link URL
              </button>

              {avatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={uploading || saving}
                  title="Remove avatar and use monogram"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #FCA5A5",
                    backgroundColor: "#FFF5F5",
                    color: "#DC2626",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <FiTrash2 size={13} />
                  Remove
                </button>
              )}
            </div>

            {/* Image URL input expander */}
            {showUrlInput && (
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 6,
                  width: "100%",
                  maxWidth: "360px",
                }}
              >
                <input
                  type="url"
                  placeholder="Paste direct image link (https://...)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  style={{
                    flex: 1,
                    height: 36,
                    padding: "0 10px",
                    borderRadius: 6,
                    border: "1px solid #D8C4AA",
                    fontSize: 12.5,
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  style={{
                    padding: "0 12px",
                    height: 36,
                    borderRadius: 6,
                    backgroundColor: "#541A28",
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Admin Name Field */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#541A28",
                marginBottom: 6,
              }}
            >
              Admin Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Super Admin"
              required
              style={{
                width: "100%",
                height: 44,
                padding: "0 14px",
                borderRadius: 8,
                border: "1px solid #D8C4AA",
                fontSize: 14,
                color: "#1F1418",
                outline: "none",
                backgroundColor: "#FDFAF5",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Email (Read only) */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#7E5664",
                marginBottom: 6,
              }}
            >
              Registered Email
            </label>
            <input
              type="email"
              value={currentUser?.email || "gr0184236@gmail.com"}
              disabled
              style={{
                width: "100%",
                height: 44,
                padding: "0 14px",
                borderRadius: 8,
                border: "1px solid #EFE8E0",
                fontSize: 14,
                color: "#888",
                backgroundColor: "#F5F2EC",
                boxSizing: "border-box",
                cursor: "not-allowed",
              }}
            />
          </div>

          {/* Footer buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving || uploading}
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: "1px solid #D8C4AA",
                backgroundColor: "#FFFFFF",
                color: "#541A28",
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #541A28 0%, #7D283C 100%)",
                color: "#FFFFFF",
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 14px rgba(84, 26, 40, 0.25)",
              }}
            >
              {saving && <FiRefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
