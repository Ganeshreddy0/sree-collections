"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import AdminShell from "@/components/AdminShell";
import {
  FiSave, FiRefreshCw, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX,
  FiUpload, FiEye, FiEyeOff, FiChevronDown, FiChevronUp, FiAlertCircle,
  FiImage, FiExternalLink, FiInstagram, FiFacebook,
} from "react-icons/fi";
import { FaWhatsapp, FaPinterest } from "react-icons/fa";

function isLikelyImageUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("blob:")
  ) {
    return true;
  }
  return /\.(jpeg|jpg|png|webp|gif|svg|avif)($|\?)/i.test(trimmed);
}

function normalizeImageSrc(src: string): string {
  if (!src) return "";
  const trimmed = src.trim();
  if (trimmed.startsWith("http") || trimmed.startsWith("blob:") || trimmed.startsWith("data:")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
}

function renderSocialOrCustomIcon(iconName: string, size = 18) {
  const lower = iconName.toLowerCase().trim();
  if (lower.includes("instagram")) return <FiInstagram size={size} color="#E1306C" />;
  if (lower.includes("facebook")) return <FiFacebook size={size} color="#1877F2" />;
  if (lower.includes("whatsapp")) return <FaWhatsapp size={size} color="#25D366" />;
  if (lower.includes("pinterest")) return <FaPinterest size={size} color="#BD081C" />;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 6px",
        background: "#F0E7D8",
        color: "#5A2035",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
      }}
    >
      {iconName}
    </span>
  );
}

const API = "http://localhost:5000/api";
const AUTH = "Bearer super_admin_authenticated";

type HomepageItem = {
  itemId: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  imageUrl: string;
  imageAlt: string;
  linkUrl: string;
  ctaText: string;
  bgColor: string;
  displayOrder: number;
  isActive: boolean;
  metadata: Record<string, unknown>;
};

type HomepageSection = {
  _id?: string;
  sectionId: string;
  displayName: string;
  title: string;
  subtitle: string;
  description: string;
  badgeText: string;
  mediaUrl: string;
  mediaAlt: string;
  secondaryMediaUrl: string;
  secondaryMediaAlt: string;
  tertiaryMediaUrl: string;
  tertiaryMediaAlt: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  displayOrder: number;
  isActive: boolean;
  settings: Record<string, unknown>;
  items: HomepageItem[];
};

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 9999,
        backgroundColor: type === "success" ? "#16A34A" : "#DC2626",
        color: "#FFFFFF", padding: "14px 22px", borderRadius: 12,
        fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center",
        gap: 10, boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
        animation: "slideUp 0.3s ease",
      }}
    >
      {type === "success" ? <FiCheck size={16} /> : <FiAlertCircle size={16} />}
      {message}
    </div>
  );
}

function ImageUploader({
  label, value, onChange, hint,
}: { label: string; value: string; onChange: (url: string) => void; hint?: string }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert("File must be under 10MB"); return; }
    setUploading(true);
    const form = new FormData();
    form.append("image", file);
    try {
      const res = await fetch(`${API}/upload/single`, { method: "POST", body: form });
      const data = await res.json();
      if (data.success && data.url) onChange(data.url);
      else alert("Upload failed. Falling back to local preview.");
    } catch {
      // Fallback: use object URL
      onChange(URL.createObjectURL(file));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#5A2035", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </label>
      {value && (
        <div style={{ position: "relative", marginBottom: 8, borderRadius: 8, overflow: "hidden", border: "1px solid #E5D7C5", background: "#FDFAF5", minHeight: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
          {isLikelyImageUrl(value) ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={normalizeImageSrc(value)}
              alt={label}
              style={{ maxHeight: 120, maxWidth: "100%", objectFit: "contain", display: "block", margin: "0 auto" }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#F5EFE6", borderRadius: 6 }}>
              {renderSocialOrCustomIcon(value, 20)}
              <span style={{ fontSize: 13, fontWeight: 600, color: "#5A2035" }}>Icon: {value}</span>
            </div>
          )}
          <button
            onClick={() => onChange("")}
            title="Remove image"
            style={{ position: "absolute", top: 4, right: 4, background: "#DC2626", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <FiX size={12} />
          </button>
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or upload →"
          style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #E5D7C5", fontSize: 13, background: "#FDFAF5", outline: "none" }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            background: "#5A2035", color: "#FFFFFF", border: "none", borderRadius: 8,
            padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center",
            gap: 6, fontSize: 13, fontWeight: 600, opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? <FiRefreshCw size={14} className="spinning" /> : <FiUpload size={14} />}
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={handleUpload} style={{ display: "none" }} />
      </div>
      {hint && <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "#A8926B" }}>{hint}</p>}
    </div>
  );
}

function Field({
  label, value, onChange, multiline = false, placeholder = "", type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string; type?: string;
}) {
  const sharedStyle: React.CSSProperties = {
    width: "100%", padding: "9px 13px", borderRadius: 8,
    border: "1px solid #E5D7C5", fontSize: 13, background: "#FDFAF5",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
    color: "#2F2C24",
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#5A2035", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} rows={3}
          style={{ ...sharedStyle, resize: "vertical" }}
        />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={sharedStyle} />
      )}
    </div>
  );
}

function SectionTab({ section, active, onClick }: { section: HomepageSection; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", padding: "10px 14px", background: active ? "#5A2035" : "transparent",
        color: active ? "#FFFFFF" : "#4A3828", border: "none", borderRadius: 8,
        cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500,
        transition: "all 0.2s", textAlign: "left", gap: 8,
      }}
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {section.displayName}
      </span>
      <span
        style={{
          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
          background: section.isActive ? "#16A34A" : "#DC2626",
        }}
      />
    </button>
  );
}

type NewItemForm = Omit<HomepageItem, "metadata"> & { metadata: Record<string, unknown> };

function ItemsManager({ section, onRefresh }: { section: HomepageSection; onRefresh: () => void }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<NewItemForm>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const resetForm = () => { setForm({}); setShowAddForm(false); setEditingId(null); };

  const handleEdit = (item: HomepageItem) => {
    setEditingId(item.itemId);
    setForm({ ...item });
    setShowAddForm(false);
  };

  const handleSaveItem = async () => {
    if (!form.itemId?.trim()) { alert("itemId is required"); return; }
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API}/homepage/admin/${section.sectionId}/items/${editingId}`
        : `${API}/homepage/admin/${section.sectionId}/items`;

      const res = await fetch(url, {
        method,
        headers: { Authorization: AUTH, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { 
        // Broadcast to storefront tabs
        localStorage.setItem("cms_updated_at", Date.now().toString());
        try { new BroadcastChannel("cms_sync").postMessage("updated"); } catch { /* unsupported */ }
        resetForm(); onRefresh(); }
      else alert(data.message || "Failed to save item.");
    } catch { alert("Network error saving item."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm(`Delete item "${itemId}"?`)) return;
    setDeleting(itemId);
    try {
      const res = await fetch(`${API}/homepage/admin/${section.sectionId}/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: AUTH },
      });
      const data = await res.json();
      if (data.success) {
        // Broadcast to storefront tabs
        localStorage.setItem("cms_updated_at", Date.now().toString());
        try { new BroadcastChannel("cms_sync").postMessage("updated"); } catch { /* unsupported */ }
        onRefresh();
      }
      else alert(data.message || "Failed to delete item.");
    } catch { alert("Network error deleting item."); }
    finally { setDeleting(null); }
  };

  const activeItems = section.items.filter(i => i.isActive !== false);
  const inactiveItems = section.items.filter(i => i.isActive === false);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#2F2C24" }}>
          Items / Cards ({section.items.length})
        </h4>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setForm({}); }}
          style={{
            background: "#5A2035", color: "#fff", border: "none", borderRadius: 8,
            padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <FiPlus size={13} /> Add Item
        </button>
      </div>

      {/* Add / Edit Form */}
      {(showAddForm || editingId) && (
        <div style={{ background: "#FBF3E6", borderRadius: 12, padding: 18, border: "1px solid #E5D7C5", marginBottom: 16 }}>
          <h5 style={{ margin: "0 0 14px 0", fontSize: 13, color: "#5A2035", fontWeight: 700 }}>
            {editingId ? `Edit Item: ${editingId}` : "Add New Item"}
          </h5>
          {!editingId && (
            <Field label="Item ID *" value={form.itemId || ""} onChange={v => setForm(p => ({ ...p, itemId: v }))} placeholder="unique-item-id" />
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Title" value={form.title || ""} onChange={v => setForm(p => ({ ...p, title: v }))} />
            <Field label="Subtitle" value={form.subtitle || ""} onChange={v => setForm(p => ({ ...p, subtitle: v }))} />
            <Field label="Badge" value={form.badge || ""} onChange={v => setForm(p => ({ ...p, badge: v }))} />
            <Field label="Link URL" value={form.linkUrl || ""} onChange={v => setForm(p => ({ ...p, linkUrl: v }))} />
            <Field label="CTA Text" value={form.ctaText || ""} onChange={v => setForm(p => ({ ...p, ctaText: v }))} />
            <Field label="Display Order" value={String(form.displayOrder ?? "")} onChange={v => setForm(p => ({ ...p, displayOrder: parseInt(v) || 0 }))} type="number" />
          </div>
          <Field label="Description" value={form.description || ""} onChange={v => setForm(p => ({ ...p, description: v }))} multiline />
          <ImageUploader label="Image URL" value={form.imageUrl || ""} onChange={v => setForm(p => ({ ...p, imageUrl: v }))} />
          <Field label="Image Alt Text" value={form.imageAlt || ""} onChange={v => setForm(p => ({ ...p, imageAlt: v }))} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#5A2035", textTransform: "uppercase", letterSpacing: "0.5px" }}>Active</label>
            <input type="checkbox" checked={form.isActive !== false} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} style={{ width: 16, height: 16 }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleSaveItem} disabled={saving}
              style={{ background: "#5A2035", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? <FiRefreshCw size={13} /> : <FiSave size={13} />} {saving ? "Saving…" : "Save Item"}
            </button>
            <button onClick={resetForm} style={{ background: "transparent", color: "#685F53", border: "1px solid #E5D7C5", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items Table */}
      {section.items.length === 0 ? (
        <p style={{ color: "#A8926B", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No items yet. Click "Add Item" to create the first one.</p>
      ) : (
        <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #E5D7C5" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#F7F1E8" }}>
              <tr>
                {["ID", "Title", "Image", "Order", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "9px 12px", fontSize: 11, fontWeight: 700, color: "#5A2035", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...activeItems, ...inactiveItems].map((item, idx) => (
                <tr
                  key={item.itemId}
                  style={{ background: idx % 2 === 0 ? "#FDFAF5" : "#FFFFFF", opacity: item.isActive ? 1 : 0.55 }}
                >
                  <td style={{ padding: "9px 12px", fontSize: 12, color: "#5A2035", fontWeight: 600 }}>{item.itemId}</td>
                  <td style={{ padding: "9px 12px", fontSize: 13, color: "#2F2C24", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.title || item.description?.substring(0, 40) || <span style={{ color: "#A8926B" }}>—</span>}
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    {isLikelyImageUrl(item.imageUrl) ? (
                      <img
                        src={normalizeImageSrc(item.imageUrl)}
                        alt={item.imageAlt || item.title}
                        style={{ width: 40, height: 30, objectFit: "cover", borderRadius: 4, display: "block" }}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : item.imageUrl ? (
                      <div style={{ width: 40, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "#FDF8F0", borderRadius: 4, border: "1px solid #E5D7C5" }}>
                        {renderSocialOrCustomIcon(item.imageUrl, 16)}
                      </div>
                    ) : (
                      <FiImage size={16} color="#C4B49A" />
                    )}
                  </td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: "#685F53" }}>{item.displayOrder}</td>
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ background: item.isActive ? "#16A34A" : "#DC2626", color: "#fff", padding: "2px 9px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{ background: "#EEF2FF", color: "#4338CA", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <FiEdit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.itemId)}
                        disabled={deleting === item.itemId}
                        style={{ background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4, opacity: deleting === item.itemId ? 0.6 : 1 }}
                      >
                        {deleting === item.itemId ? <FiRefreshCw size={12} /> : <FiTrash2 size={12} />} Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectionEditor({ section, onUpdated }: { section: HomepageSection; onUpdated: () => void }) {
  const [local, setLocal] = useState<HomepageSection>({ ...section });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => { setLocal({ ...section }); }, [section]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/homepage/admin/${local.sectionId}`, {
        method: "PUT",
        headers: { Authorization: AUTH, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: local.title, subtitle: local.subtitle, description: local.description,
          badgeText: local.badgeText, mediaUrl: local.mediaUrl, mediaAlt: local.mediaAlt,
          secondaryMediaUrl: local.secondaryMediaUrl, secondaryMediaAlt: local.secondaryMediaAlt,
          tertiaryMediaUrl: local.tertiaryMediaUrl, tertiaryMediaAlt: local.tertiaryMediaAlt,
          ctaText: local.ctaText, ctaLink: local.ctaLink,
          secondaryCtaText: local.secondaryCtaText, secondaryCtaLink: local.secondaryCtaLink,
          displayOrder: local.displayOrder, isActive: local.isActive, settings: local.settings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Broadcast to storefront tabs so they re-fetch immediately
        localStorage.setItem("cms_updated_at", Date.now().toString());
        try { new BroadcastChannel("cms_sync").postMessage("updated"); } catch { /* unsupported */ }
        setToast({ message: `"${section.displayName}" saved successfully!`, type: "success" });
        onUpdated();
      } else {
        setToast({ message: data.message || "Failed to save section.", type: "error" });
      }
    } catch {
      setToast({ message: "Network error. Could not save changes.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof HomepageSection, value: unknown) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Section Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#2F2C24" }}>{section.displayName}</h2>
          <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#A8926B" }}>sectionId: <code>{section.sectionId}</code></p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Active Toggle */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#F7F1E8", borderRadius: 20, padding: "6px 14px", border: "1px solid #E5D7C5", cursor: "pointer" }}
            onClick={() => set("isActive", !local.isActive)}
          >
            {local.isActive ? <FiEye size={14} color="#16A34A" /> : <FiEyeOff size={14} color="#DC2626" />}
            <span style={{ fontSize: 13, fontWeight: 700, color: local.isActive ? "#16A34A" : "#DC2626" }}>
              {local.isActive ? "Visible" : "Hidden"}
            </span>
          </div>
          {/* Save Button */}
          <button
            onClick={handleSave} disabled={saving}
            style={{
              background: "#5A2035", color: "#FFFFFF", border: "none", borderRadius: 10,
              padding: "10px 22px", cursor: "pointer", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 8, opacity: saving ? 0.7 : 1,
              boxShadow: "0 4px 14px rgba(90, 32, 53, 0.22)",
            }}
          >
            {saving ? <FiRefreshCw size={14} /> : <FiSave size={14} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <Field label="Title / Heading" value={local.title} onChange={v => set("title", v)} placeholder="Main heading text" />
        <Field label="Subtitle" value={local.subtitle} onChange={v => set("subtitle", v)} placeholder="Secondary heading or label" />
        <Field label="Badge / Label Text" value={local.badgeText} onChange={v => set("badgeText", v)} placeholder="e.g. Discover By Category" />
        <Field label="Display Order" value={String(local.displayOrder)} onChange={v => set("displayOrder", parseInt(v) || 0)} type="number" placeholder="1-12" />
        <Field label="Primary CTA Text" value={local.ctaText} onChange={v => set("ctaText", v)} placeholder="SHOP NOW" />
        <Field label="Primary CTA Link" value={local.ctaLink} onChange={v => set("ctaLink", v)} placeholder="#featured or /categories" />
        <Field label="Secondary CTA Text" value={local.secondaryCtaText} onChange={v => set("secondaryCtaText", v)} placeholder="EXPLORE MORE" />
        <Field label="Secondary CTA Link" value={local.secondaryCtaLink} onChange={v => set("secondaryCtaLink", v)} placeholder="#categories" />
      </div>
      <Field label="Description / Body Text" value={local.description} onChange={v => set("description", v)} multiline placeholder="Supporting text shown in this section" />

      {/* Media Section */}
      <div style={{ background: "#F7F1E8", borderRadius: 12, padding: 18, border: "1px solid #E5D7C5", marginBottom: 20 }}>
        <h4 style={{ margin: "0 0 16px 0", fontSize: 14, fontWeight: 700, color: "#5A2035" }}>Media & Images</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
          <ImageUploader
            label="Primary Media (Image / Logo)"
            value={local.mediaUrl}
            onChange={v => set("mediaUrl", v)}
            hint="Main image, hero image, logo, or delivery truck"
          />
          <ImageUploader
            label="Secondary Media"
            value={local.secondaryMediaUrl}
            onChange={v => set("secondaryMediaUrl", v)}
            hint="Second image, hero column 2, pill image 2, etc."
          />
          <Field label="Primary Media Alt Text" value={local.mediaAlt} onChange={v => set("mediaAlt", v)} placeholder="Accessible alt description" />
          <Field label="Secondary Media Alt Text" value={local.secondaryMediaAlt} onChange={v => set("secondaryMediaAlt", v)} placeholder="Accessible alt description" />
          {(local.tertiaryMediaUrl !== undefined) && (
            <>
              <ImageUploader
                label="Tertiary Media (Hero Col 3, etc.)"
                value={local.tertiaryMediaUrl}
                onChange={v => set("tertiaryMediaUrl", v)}
                hint="Third image slot (e.g. hero column 3)"
              />
              <Field label="Tertiary Media Alt Text" value={local.tertiaryMediaAlt} onChange={v => set("tertiaryMediaAlt", v)} placeholder="Accessible alt description" />
            </>
          )}
        </div>
      </div>

      {/* Settings (JSON) for advanced config */}
      {Object.keys(local.settings || {}).length > 0 && (
        <div style={{ background: "#F7F1E8", borderRadius: 12, padding: 18, border: "1px solid #E5D7C5", marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: 14, fontWeight: 700, color: "#5A2035" }}>Advanced Settings</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            {Object.entries(local.settings || {}).map(([key, val]) => (
              <Field
                key={key}
                label={key.replace(/_/g, ' ')}
                value={String(val)}
                onChange={v => set("settings", { ...(local.settings || {}), [key]: v })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Items Manager */}
      <ItemsManager section={local} onRefresh={onUpdated} />
    </div>
  );
}

export default function HomepageCMSPage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/homepage/admin`, {
        headers: { Authorization: AUTH },
      });
      const data = await res.json();
      if (data.success) {
        setSections(data.ordered || Object.values(data.data || {}));
        if (!activeSectionId && data.ordered?.length) {
          setActiveSectionId(data.ordered[0].sectionId);
        }
      } else {
        setError(data.message || "Failed to load homepage sections.");
      }
    } catch {
      setError("Could not connect to the backend. Ensure the server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  }, [activeSectionId]);

  useEffect(() => { fetchSections(); }, []);

  const handleSeedDefault = async () => {
    if (!confirm("Re-seed all sections with default data? Existing edits will be overwritten.")) return;
    setSeeding(true);
    try {
      const res = await fetch(`${API}/homepage/admin/seed-default`, {
        method: "POST",
        headers: { Authorization: AUTH, "Content-Type": "application/json" },
        body: JSON.stringify({ forceReseed: true }),
      });
      const data = await res.json();
      if (data.success) { await fetchSections(); alert("Default data seeded successfully!"); }
      else alert(data.message || "Seeding failed.");
    } catch { alert("Network error during seeding."); }
    finally { setSeeding(false); }
  };

  const activeSection = sections.find(s => s.sectionId === activeSectionId);

  return (
    <AdminShell>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#2F2C24" }}>Homepage CMS</h1>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#A8926B" }}>
            Manage all non-exempt homepage sections. <strong style={{ color: "#5A2035" }}>Featured Collection is protected and excluded.</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={fetchSections} disabled={loading}
            style={{ background: "#F7F1E8", color: "#5A2035", border: "1px solid #E5D7C5", borderRadius: 8, padding: "9px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}
          >
            <FiRefreshCw size={14} className={loading ? "spinning" : ""} /> Refresh
          </button>
          <button
            onClick={handleSeedDefault} disabled={seeding}
            style={{ background: "#F7F1E8", color: "#685F53", border: "1px solid #E5D7C5", borderRadius: 8, padding: "9px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, opacity: seeding ? 0.7 : 1 }}
          >
            {seeding ? <FiRefreshCw size={14} className="spinning" /> : <FiExternalLink size={14} />} Reset Defaults
          </button>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            style={{ background: "#5A2035", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            <FiEye size={14} /> Preview Site
          </a>
        </div>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", borderRadius: 10, padding: 16, marginBottom: 20, color: "#DC2626", display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
          <FiAlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, flexDirection: "column", gap: 16 }}>
          <FiRefreshCw size={32} color="#5A2035" className="spinning" />
          <p style={{ color: "#A8926B", fontSize: 14 }}>Loading homepage sections…</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start" }}>
          {/* Section Sidebar */}
          <div style={{ background: "#FDFAF5", borderRadius: 14, border: "1px solid #E5D7C5", padding: 12, position: "sticky", top: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#A8926B", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 10px 6px" }}>
              Sections ({sections.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {sections.map(s => (
                <SectionTab
                  key={s.sectionId}
                  section={s}
                  active={s.sectionId === activeSectionId}
                  onClick={() => setActiveSectionId(s.sectionId)}
                />
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "12px 14px", background: "#F0E8D8", borderRadius: 8, border: "1px solid #DBC49A" }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#5A2035", marginBottom: 4 }}>🔒 Protected</p>
              <p style={{ margin: 0, fontSize: 11, color: "#7A6A50" }}>Featured Collection is excluded per Rule A and cannot be managed here.</p>
            </div>
          </div>

          {/* Section Editor */}
          <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E5D7C5", padding: 28 }}>
            {activeSection ? (
              <SectionEditor
                key={activeSection.sectionId}
                section={activeSection}
                onUpdated={fetchSections}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#A8926B", fontSize: 14 }}>
                Select a section from the sidebar to start editing.
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
