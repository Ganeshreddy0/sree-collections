"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiX,
  FiSave,
  FiUploadCloud,
  FiImage,
  FiRefreshCw,
  FiAlertCircle,
  FiCheck,
  FiTag,
} from "react-icons/fi";

const API = "http://localhost:5000/api";
const AUTH = "Bearer super_admin_authenticated";

export interface CategoryData {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  status: "Active" | "Inactive";
  description?: string;
  image?: string;
  featured?: boolean;
  tag?: string;
  badge?: string;
  startingPrice?: string;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  category: CategoryData | null;
  onClose: () => void;
  onSaveSuccess: (updatedCategory: CategoryData) => void;
}

export default function EditCategoryModal({
  isOpen,
  category,
  onClose,
  onSaveSuccess,
}: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [tag, setTag] = useState("");
  const [startingPrice, setStartingPrice] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Synchronize modal state whenever category changes or modal opens
  useEffect(() => {
    if (category && isOpen) {
      setName(category.name || "");
      setSlug(category.slug || "");
      setStatus(category.status || "Active");
      setDescription(category.description || "");
      setImage(category.image || "");
      setFeatured(Boolean(category.featured));
      setTag(category.tag || category.badge || "");
      setStartingPrice(category.startingPrice || "");
      setError(null);
      setSuccessMsg(null);
    }
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  // Helper to re-generate slug from current name
  const handleRegenerateSlug = () => {
    const generated = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(generated);
  };

  // Helper to handle direct file upload
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API}/upload/single`, {
        method: "POST",
        headers: {
          Authorization: AUTH,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to upload image");
      }

      setImage(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API}/categories/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH,
        },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          status,
          description: description.trim(),
          image: image.trim(),
          featured,
          tag: tag.trim(),
          badge: tag.trim(),
          startingPrice: startingPrice.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update category");
      }

      setSuccessMsg("Category updated successfully!");
      try {
        localStorage.setItem("category_updated_at", Date.now().toString());
        new BroadcastChannel("cms_sync").postMessage("category_updated");
      } catch {
        /* noop */
      }
      onSaveSuccess({
        id: category.id,
        _id: category._id,
        name: data.data.name || name.trim(),
        slug: data.data.slug || slug.trim(),
        status: data.data.status || status,
        description: data.data.description || description.trim(),
        image: data.data.image || image.trim(),
        featured: data.data.featured ?? featured,
        tag: data.data.tag ?? tag.trim(),
        badge: data.data.badge ?? tag.trim(),
        startingPrice: data.data.startingPrice ?? startingPrice.trim(),
      });

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update category");
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(35, 23, 20, 0.55)",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.2)",
          border: "1px solid #EFE8E0",
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          animation: "scaleIn 0.18s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 22px",
            borderBottom: "1px solid #F3ECE2",
            backgroundColor: "#FAF6F0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                backgroundColor: "#F4EBE2",
                color: "#541A28",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiTag size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#3B2C24" }}>
                Edit Category
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#8C7A6B" }}>
                Update category details and visibility
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9CA3AF",
              padding: 4,
              display: "flex",
              borderRadius: "4px",
            }}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: "calc(90vh - 140px)" }}>
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#FEE2E2",
                  color: "#991B1B",
                  padding: "10px 14px",
                  borderRadius: 6,
                  marginBottom: 16,
                  fontSize: 13,
                }}
              >
                <FiAlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#DCFCE7",
                  color: "#166534",
                  padding: "10px 14px",
                  borderRadius: 6,
                  marginBottom: 16,
                  fontSize: 13,
                }}
              >
                <FiCheck size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Category Name & Slug */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3B2C24", marginBottom: 6 }}>
                  Category Name <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarees"
                  style={{
                    width: "100%",
                    height: 38,
                    padding: "0 12px",
                    borderRadius: 6,
                    border: "1px solid #D8C4AA",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#3B2C24" }}>Category Slug</label>
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    title="Auto-generate from Name"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#541A28",
                      cursor: "pointer",
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      padding: 0,
                    }}
                  >
                    <FiRefreshCw size={11} /> Sync
                  </button>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. sarees"
                  style={{
                    width: "100%",
                    height: 38,
                    padding: "0 12px",
                    borderRadius: 6,
                    border: "1px solid #D8C4AA",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "#FAF9F5",
                  }}
                />
              </div>
            </div>

            {/* Status & Featured */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3B2C24", marginBottom: 6 }}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                  style={{
                    width: "100%",
                    height: 38,
                    padding: "0 12px",
                    borderRadius: 6,
                    border: "1px solid #D8C4AA",
                    fontSize: 13,
                    outline: "none",
                    backgroundColor: "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  <option value="Active">🟢 Active (Visible)</option>
                  <option value="Inactive">🔴 Inactive (Hidden)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3B2C24", marginBottom: 6 }}>
                  Homepage Visibility
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    height: 38,
                    padding: "0 12px",
                    borderRadius: 6,
                    border: "1px solid #D8C4AA",
                    fontSize: 13,
                    backgroundColor: "#FAF9F5",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    style={{ accentColor: "#541A28", width: 16, height: 16, cursor: "pointer" }}
                  />
                  <span style={{ color: "#3B2C24", fontWeight: 500 }}>Featured Collection</span>
                </label>
              </div>
            </div>

            {/* Storefront Card Pill Tags (Badge & Starting Price) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3B2C24", marginBottom: 6 }}>
                  Card Tag / Badge <span style={{ fontSize: 11, fontWeight: 400, color: "#8C7A6B" }}>(Top-Left Pill)</span>
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. ETHNIC, NEW, FEATURED, SALE"
                  style={{
                    width: "100%",
                    height: 38,
                    padding: "0 12px",
                    borderRadius: 6,
                    border: "1px solid #D8C4AA",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {/* Quick Presets */}
                <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
                  {["ETHNIC", "NEW", "FEATURED", "SALE", "TRENDING", "ROYAL"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTag(preset)}
                      style={{
                        padding: "2px 7px",
                        borderRadius: 10,
                        fontSize: 10,
                        fontWeight: 600,
                        border: "1px solid #D8C4AA",
                        backgroundColor: tag.toUpperCase() === preset ? "#541A28" : "#FAF9F5",
                        color: tag.toUpperCase() === preset ? "#FFFFFF" : "#541A28",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3B2C24", marginBottom: 6 }}>
                  Starting Price <span style={{ fontSize: 11, fontWeight: 400, color: "#8C7A6B" }}>(Bottom-Right Pill)</span>
                </label>
                <input
                  type="text"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  placeholder="e.g. 120.25USD or $49.00"
                  style={{
                    width: "100%",
                    height: 38,
                    padding: "0 12px",
                    borderRadius: 6,
                    border: "1px solid #D8C4AA",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ fontSize: 11, color: "#8C7A6B", marginTop: 4, display: "block" }}>
                  Shown inside the &quot;Start From&quot; card pill
                </span>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3B2C24", marginBottom: 6 }}>
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description for storefront category banner..."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #D8C4AA",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Category Image */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3B2C24", marginBottom: 6 }}>
                Category Image / Banner
              </label>

              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                {/* Preview Box */}
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 8,
                    border: "1px dashed #D8C4AA",
                    backgroundColor: "#FAF6F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={name}
                      fill
                      unoptimized
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <FiImage size={24} style={{ color: "#B8A392" }} />
                  )}
                </div>

                {/* Input & Upload Controls */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Paste image URL (https://... or /Categories/bag.png)"
                    style={{
                      width: "100%",
                      height: 36,
                      padding: "0 10px",
                      borderRadius: 6,
                      border: "1px solid #D8C4AA",
                      fontSize: 12,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        height: 30,
                        padding: "0 12px",
                        borderRadius: 5,
                        backgroundColor: "#F4EBE2",
                        color: "#541A28",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: uploading ? "not-allowed" : "pointer",
                      }}
                    >
                      <FiUploadCloud size={14} />
                      <span>{uploading ? "Uploading..." : "Upload File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        disabled={uploading}
                        style={{ display: "none" }}
                      />
                    </label>

                    {image && (
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#DC2626",
                          fontSize: 12,
                          cursor: "pointer",
                          padding: "4px 8px",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
              padding: "14px 22px",
              backgroundColor: "#FAF6F0",
              borderTop: "1px solid #F3ECE2",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                height: 36,
                padding: "0 16px",
                borderRadius: 6,
                border: "1px solid #D8C4AA",
                backgroundColor: "#FFFFFF",
                color: "#4B5563",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                height: 36,
                padding: "0 18px",
                borderRadius: 6,
                border: "none",
                backgroundColor: "#541A28",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "opacity 0.15s ease",
                opacity: saving ? 0.75 : 1,
              }}
            >
              <FiSave size={14} />
              <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
