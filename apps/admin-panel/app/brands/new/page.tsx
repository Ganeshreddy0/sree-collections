"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { FiPlus, FiMinus, FiChevronDown } from "react-icons/fi";

import { API_BASE as API } from "@/lib/config";
const AUTH = "Bearer super_admin_authenticated";

export default function AddBrandPage() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [countryOrigin, setCountryOrigin] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/brands`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH,
        },
        body: JSON.stringify({
          name: brandName.trim(),
          brandName: brandName.trim(),
          countryOrigin: countryOrigin.trim(),
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create brand");
      }
      router.push("/brands");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell>
      {/* Page header */}
      <div className="sc-page-header">
        <div>
          <h1 className="sc-page-title">Brands</h1>
          <div className="sc-breadcrumbs">
            <span>Products</span>
            <span>›</span>
            <span style={{ color: "#3B2C24", fontWeight: 500 }}>Create Brands</span>
          </div>
        </div>
        <Link href="/brands" className="sc-btn-add">Back to Brands</Link>
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
              <span>Add Brands</span>
            </div>
            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
              <FiMinus size={16} />
            </button>
          </div>
          <div className="sc-section-body">
            {/* Brand Name */}
            <div className="sc-form-field" style={{ marginBottom: 16 }}>
              <label>
                Brand Name <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Sree Silk"
              />
            </div>

            {/* Country Origin */}
            <div className="sc-form-field" style={{ marginBottom: 16 }}>
              <label>Country Origin</label>
              <input
                type="text"
                value={countryOrigin}
                onChange={(e) => setCountryOrigin(e.target.value)}
                placeholder="e.g. India"
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
          <Link href="/brands" className="sc-btn-cancel">Cancel</Link>
          <button type="submit" className="sc-btn-submit" disabled={loading}>
            {loading ? "Adding..." : "Add Brand"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
