"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { FiPlus, FiMinus, FiChevronDown } from "react-icons/fi";

import { API_BASE as API } from "@/lib/config";
const AUTH = "Bearer super_admin_authenticated";

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH,
        },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim(), status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create category");
      }
      router.push("/categories");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell>
      {/* Page header */}
      <div className="sc-page-header">
        <div>
          <h1 className="sc-page-title">Category</h1>
          <div className="sc-breadcrumbs">
            <span>Products</span>
            <span>›</span>
            <span style={{ color: "#3B2C24", fontWeight: 500 }}>Create Category</span>
          </div>
        </div>
        <Link href="/categories" className="sc-btn-add">Back to Category</Link>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Section Card */}
        <div className="sc-section">
          <div className="sc-section-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#16A34A", display: "flex" }}><FiPlus size={14} /></span>
              <span>Add Category</span>
            </div>
            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
              <FiMinus size={16} />
            </button>
          </div>
          <div className="sc-section-body">
            {/* Category Name */}
            <div className="sc-form-field" style={{ marginBottom: 16 }}>
              <label>
                Category Name <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Sarees"
              />
            </div>

            {/* Slug */}
            <div className="sc-form-field" style={{ marginBottom: 16 }}>
              <label>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. sarees"
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
          <Link href="/categories" className="sc-btn-cancel">Cancel</Link>
          <button type="submit" className="sc-btn-submit" disabled={loading}>
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
