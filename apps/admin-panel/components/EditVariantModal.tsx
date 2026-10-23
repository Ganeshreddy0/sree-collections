"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiAlertCircle, FiCheck } from "react-icons/fi";
import { API_BASE as API } from "@/lib/config";

const AUTH = "Bearer super_admin_authenticated";

export interface VariantData {
  id: string;
  _id?: string;
  name: string;
  value: string;
  values?: string[];
  status: "Active" | "Inactive";
}

interface EditVariantModalProps {
  isOpen: boolean;
  variant: VariantData | null;
  onClose: () => void;
  onSaveSuccess: (updated: VariantData) => void;
}

export default function EditVariantModal({
  isOpen,
  variant,
  onClose,
  onSaveSuccess,
}: EditVariantModalProps) {
  const [name, setName] = useState("");
  const [values, setValues] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (variant && isOpen) {
      setName(variant.name || "");
      setValues(variant.value || (Array.isArray(variant.values) ? variant.values.join(", ") : ""));
      setStatus(variant.status || "Active");
      setError(null);
      setSuccessMsg(null);
    }
  }, [variant, isOpen]);

  if (!isOpen || !variant) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Variant attribute name is required");
      return;
    }
    if (!values.trim()) {
      setError("Please provide comma-separated values");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const parsedValues = values.split(",").map((v) => v.trim()).filter(Boolean);

    try {
      const res = await fetch(`${API}/variants/${variant.id || variant._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH,
        },
        body: JSON.stringify({
          name: name.trim(),
          values: parsedValues,
          valueString: parsedValues.join(", "),
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update variant attribute");
      }

      setSuccessMsg("Variant attribute updated successfully!");
      onSaveSuccess({
        id: variant.id,
        _id: variant._id,
        name: data.data?.name || name.trim(),
        value: data.data?.valueString || parsedValues.join(", "),
        values: data.data?.values || parsedValues,
        status: data.data?.status || status,
      });

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update variant attribute");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(15, 10, 8, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "520px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #EFEAE4",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #F3EDE7",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(180deg, #FDFBF7 0%, #FAF5EE 100%)",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#3B2C24", fontFamily: "var(--font-cinzel), serif" }}>
              Edit Variant Attribute
            </h3>
            <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#8C7A6B" }}>
              Update attribute name, available values, and status
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              border: "none",
              background: "#F2ECE4",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#541A28",
            }}
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                color: "#991B1B",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FiAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                marginBottom: "16px",
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "#F0FDF4",
                border: "1px solid #86EFAC",
                color: "#166534",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FiCheck size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Attribute Name */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3B2C24", marginBottom: "6px" }}>
              Attribute Name <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Size, Colour, Material"
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #E5D7C5",
                padding: "0 14px",
                fontSize: "14px",
                outline: "none",
                backgroundColor: "#FAF8F5",
              }}
            />
          </div>

          {/* Values */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3B2C24", marginBottom: "6px" }}>
              Values (comma-separated) <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              value={values}
              onChange={(e) => setValues(e.target.value)}
              placeholder="e.g. S, M, L, XL or Red, Blue, Green"
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #E5D7C5",
                padding: "0 14px",
                fontSize: "14px",
                outline: "none",
                backgroundColor: "#FAF8F5",
              }}
            />
            <span style={{ fontSize: "12px", color: "#8C7A6B", marginTop: "4px", display: "block" }}>
              Separate each value with a comma (e.g. XS, S, M, L, XL)
            </span>
          </div>

          {/* Status */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3B2C24", marginBottom: "6px" }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #E5D7C5",
                padding: "0 14px",
                fontSize: "14px",
                outline: "none",
                backgroundColor: "#FAF8F5",
              }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                height: "40px",
                padding: "0 18px",
                borderRadius: "8px",
                border: "1px solid #E5D7C5",
                background: "#F7F3EE",
                color: "#685F53",
                fontSize: "13.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                height: "40px",
                padding: "0 22px",
                borderRadius: "8px",
                border: "none",
                background: "#541A28",
                color: "#FFFFFF",
                fontSize: "13.5px",
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                opacity: saving ? 0.7 : 1,
              }}
            >
              <FiSave size={15} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
