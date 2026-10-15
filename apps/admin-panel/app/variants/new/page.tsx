"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { FiPlus, FiMinus, FiChevronDown } from "react-icons/fi";

const API = "http://localhost:5000/api";
const AUTH = "Bearer super_admin_authenticated";

export default function AddVariantPage() {
  const router = useRouter();
  const [attributeName, setAttributeName] = useState("");
  const [values, setValues] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attributeName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/variants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH,
        },
        body: JSON.stringify({
          name: attributeName.trim(),
          attributeName: attributeName.trim(),
          values: values.split(",").map((v) => v.trim()).filter(Boolean),
          valueString: values.trim(),
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create variant attribute");
      }
      router.push("/variants");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create variant attribute");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell>
      {/* Page header */}
      <div className="sc-page-header">
        <div>
          <h1 className="sc-page-title">Variant Attributes</h1>
          <div className="sc-breadcrumbs">
            <span>Products</span>
            <span>›</span>
            <span style={{ color: "#3B2C24", fontWeight: 500 }}>Create Variant Attribute</span>
          </div>
        </div>
        <Link href="/variants" className="sc-btn-add">Back to Variant Attributes</Link>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="sc-section">
          <div className="sc-section-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#16A34A", display: "flex" }}><FiPlus size={14} /></span>
              <span>Add Variant Attribute</span>
            </div>
            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
              <FiMinus size={16} />
            </button>
          </div>
          <div className="sc-section-body">
            {/* Attribute Name */}
            <div className="sc-form-field" style={{ marginBottom: 16 }}>
              <label>
                Attribute Name <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={attributeName}
                onChange={(e) => setAttributeName(e.target.value)}
                placeholder="e.g. Size"
              />
            </div>

            {/* Values */}
            <div className="sc-form-field" style={{ marginBottom: 16 }}>
              <label>Values (Comma separated)</label>
              <input
                type="text"
                value={values}
                onChange={(e) => setValues(e.target.value)}
                placeholder="e.g. XS, S, M, L, XL, XXL"
              />
            </div>

            {/* Status */}
            <div className="sc-form-field">
              <label>Status</label>
              <div style={{ position: "relative" }}>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                  style={{ width: "100%", paddingRight: 32 }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <FiChevronDown
                  size={13}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9CA3AF" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sc-form-actions">
          <Link href="/variants" className="sc-btn-cancel">Cancel</Link>
          <button type="submit" className="sc-btn-submit" disabled={loading}>
            {loading ? "Adding..." : "Add Variant Attribute"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
