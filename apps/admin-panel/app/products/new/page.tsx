"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { FiMinus, FiPlus, FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const API_BASE = "http://localhost:5000/api";

/* ─── Types ─────────────────────────────── */
type ProductType = "Single Product" | "Variable Product";

interface FormState {
  // Product Information
  productName: string;
  slug: string;
  productCode: string;
  sellingType: string;
  category: string;
  subCategory: string;
  brand: string;
  unit: string;
  status: "Active" | "Inactive";
  description: string;

  // Pricing & Stock
  productType: ProductType;
  quantity: string;
  price: string;
  taxType: string;
  discountType: string;
  discountValue: string;
  quantityAlert: string;

  // Variant Attributes
  variantType: ProductType;
  size: string;
  colour: string;
  weight: string;
  pattern: string;
  style: string;
  material: string;
}

const INITIAL: FormState = {
  productName: "",
  slug: "",
  productCode: "",
  sellingType: "B2C",
  category: "Casual Wear",
  subCategory: "Casual",
  brand: "Zara",
  unit: "Pc",
  status: "Active",
  description: "",
  productType: "Single Product",
  quantity: "100",
  price: "150",
  taxType: "GST 5%",
  discountType: "Percentage",
  discountValue: "0",
  quantityAlert: "5",
  variantType: "Single Product",
  size: "M",
  colour: "Red",
  weight: "Medium",
  pattern: "Solid",
  style: "Casual",
  material: "Cotton",
};

/* ─── Small reusable helpers ─────────────── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="sc-form-field">
      <label>
        {label}
        {required && <span style={{ color: "#DC2626" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingRight: 28, width: "100%" }}
      >
        <option value="">{placeholder ?? "Select"}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "#9CA3AF",
          fontSize: 12,
        }}
      >
        ▾
      </span>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sc-section">
      <div className="sc-section-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon && <span style={{ color: "#16A34A" }}>{icon}</span>}
          <span>{title}</span>
        </div>
        <button
          type="button"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}
        >
          <FiMinus size={16} />
        </button>
      </div>
      <div className="sc-section-body">{children}</div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────── */
export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80",
  ]);
  const [categories, setCategories] = useState<string[]>(["Casual Wear", "Saree", "Jewellery", "Decorative Items"]);
  const [subCategories, setSubCategories] = useState<string[]>(["Formal", "Casual", "Traditional", "Silk Saree", "Earrings", "Chains"]);
  const [brands, setBrands] = useState<string[]>(["Zara", "Chanderi", "Pochampally", "Caratlane", "---"]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load dynamic options from backend
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data && Array.isArray(d.data)) {
          setCategories(d.data.map((c: { name: string }) => c.name));
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/sub-categories`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data && Array.isArray(d.data)) {
          setSubCategories(d.data.map((s: { name: string }) => s.name));
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/brands`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data && Array.isArray(d.data)) {
          setBrands([...d.data.map((b: { name: string }) => b.name), "---"]);
        }
      })
      .catch(() => {});
  }, []);

  const set = (key: keyof FormState, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto-generate slug from product name if slug was matching previous product name
      if (key === "productName") {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      return updated;
    });
  };

  // Image file upload via backend /api/upload
  const handleImageAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setFeedback(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.urls)) {
        setImages((prev) => [...prev, ...data.urls]);
      } else {
        // Fallback to local object URL
        for (let i = 0; i < files.length; i++) {
          setImages((prev) => [...prev, URL.createObjectURL(files[i])]);
        }
      }
    } catch (err) {
      // Fallback preview
      for (let i = 0; i < files.length; i++) {
        setImages((prev) => [...prev, URL.createObjectURL(files[i])]);
      }
    } finally {
      setUploading(false);
    }
  };

  // Submit complete product to backend /api/products
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName.trim()) {
      setFeedback({ type: "error", message: "Product Name is required" });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const payload = {
      productName: form.productName,
      title: form.productName,
      slug: form.slug || form.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      productCode: form.productCode || `PT${Date.now().toString().slice(-4)}`,
      sku: form.productCode || `PT${Date.now().toString().slice(-4)}`,
      sellingType: form.sellingType,
      category: form.category,
      categoryName: form.category,
      subCategory: form.subCategory,
      brand: form.brand,
      unit: form.unit,
      status: form.status,
      isActive: form.status === "Active",
      description: form.description,
      productType: form.productType,
      quantity: Number(form.quantity) || 0,
      stock: Number(form.quantity) || 0,
      price: Number(form.price) || 0,
      taxType: form.taxType,
      discountType: form.discountType,
      discountValue: Number(form.discountValue) || 0,
      quantityAlert: Number(form.quantityAlert) || 5,
      variantType: form.variantType,
      attributes: {
        size: form.size,
        colour: form.colour,
        weight: form.weight,
        pattern: form.pattern,
        style: form.style,
        material: form.material,
      },
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80"],
    };

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer super_admin_authenticated",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({
          type: "success",
          message: `Product "${form.productName}" created successfully! Redirecting to products...`,
        });
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Failed to create product in backend",
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Network error connecting to backend";
      setFeedback({ type: "error", message: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell>
      {/* ── Page header ── */}
      <div className="sc-page-header">
        <div>
          <h1 className="sc-page-title">Create Product</h1>
          <div className="sc-breadcrumbs">
            <span>Products</span>
            <span>›</span>
            <span style={{ color: "#3B2C24", fontWeight: 500 }}>Create Products</span>
          </div>
        </div>
        <Link href="/" className="sc-btn-add">
          Back to Products
        </Link>
      </div>

      {/* ── Alert message banner ── */}
      {feedback && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "13px",
            fontWeight: 500,
            background: feedback.type === "success" ? "#DCFCE7" : "#FEE2E2",
            color: feedback.type === "success" ? "#15803D" : "#B91C1C",
            border: `1px solid ${feedback.type === "success" ? "#86EFAC" : "#FCA5A5"}`,
          }}
        >
          {feedback.type === "success" ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit}>
        {/* 1. Product Information */}
        <SectionCard icon={<FiPlus size={14} />} title="Product Information">
          <div className="sc-form-grid" style={{ marginBottom: 16 }}>
            <Field label="Product Name" required>
              <input
                required
                value={form.productName}
                onChange={(e) => set("productName", e.target.value)}
                placeholder="e.g. Tack Pant"
              />
            </Field>
            <Field label="Slug" required>
              <input
                required
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="e.g. tack-pant"
              />
            </Field>
            <Field label="Product Code" required>
              <input
                required
                value={form.productCode}
                onChange={(e) => set("productCode", e.target.value)}
                placeholder="e.g. PT009"
              />
            </Field>
            <Field label="Selling Type" required>
              <SelectInput
                value={form.sellingType}
                onChange={(v) => set("sellingType", v)}
                options={["B2B", "B2C", "Both"]}
              />
            </Field>
          </div>

          <div className="sc-form-grid" style={{ marginBottom: 16 }}>
            <Field label="Category" required>
              <div style={{ position: "relative" }}>
                <SelectInput
                  value={form.category}
                  onChange={(v) => set("category", v)}
                  options={categories}
                />
                <Link
                  href="/categories/new"
                  style={{
                    position: "absolute",
                    right: 36,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    color: "#16A34A",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  + Add New
                </Link>
              </div>
            </Field>
            <Field label="Sub Category">
              <SelectInput
                value={form.subCategory}
                onChange={(v) => set("subCategory", v)}
                options={subCategories}
              />
            </Field>
            <Field label="Brand">
              <SelectInput
                value={form.brand}
                onChange={(v) => set("brand", v)}
                options={brands}
              />
            </Field>
            <Field label="Unit" required>
              <SelectInput
                value={form.unit}
                onChange={(v) => set("unit", v)}
                options={["Pc", "Kg", "Meter", "Set"]}
              />
            </Field>
            <Field label="Status">
              <SelectInput
                value={form.status}
                onChange={(v) => set("status", v as "Active" | "Inactive")}
                options={["Active", "Inactive"]}
              />
            </Field>
          </div>

          <Field label="Description">
            <div style={{ border: "1px solid #E2D7CB", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  padding: "6px 10px",
                  borderBottom: "1px solid #E2D7CB",
                  background: "#FAFAF8",
                  flexWrap: "wrap",
                }}
              >
                {["B", "I", "U", "S", "🔗", "≡", "≔", "≬", "<>"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 6px",
                      fontSize: t.length === 1 ? 13 : 11,
                      fontWeight: "B I S".includes(t) ? 700 : 400,
                      fontStyle: t === "I" ? "italic" : "normal",
                      textDecoration: t === "U" ? "underline" : t === "S" ? "line-through" : "none",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Type your message"
                style={{
                  width: "100%",
                  height: 80,
                  padding: "10px 12px",
                  border: "none",
                  outline: "none",
                  resize: "vertical",
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "4px 12px",
                  borderTop: "1px solid #E2D7CB",
                  background: "#FAFAF8",
                }}
              >
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>Maximum 60 Words</span>
              </div>
            </div>
          </Field>
        </SectionCard>

        {/* 2. Pricing & Stocks */}
        <SectionCard icon={<FiPlus size={14} />} title="Pricing & Stocks">
          <Field label="Product Type" required>
            <div
              className="sc-radio-group"
              style={{ height: "auto", padding: 0, border: "none", background: "transparent" }}
            >
              {(["Single Product", "Variable Product"] as ProductType[]).map((t) => (
                <label key={t} className="sc-radio-label">
                  <input
                    type="radio"
                    name="productType"
                    checked={form.productType === t}
                    onChange={() => set("productType", t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </Field>
          <div style={{ height: 12 }} />
          <div className="sc-form-grid-3" style={{ marginBottom: 16 }}>
            <Field label="Quantity" required>
              <input
                required
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                type="number"
                min="0"
              />
            </Field>
            <Field label="Price" required>
              <input
                required
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                type="number"
                min="0"
                step="any"
              />
            </Field>
            <Field label="Tax Type" required>
              <SelectInput
                value={form.taxType}
                onChange={(v) => set("taxType", v)}
                options={["GST 5%", "GST 12%", "GST 18%", "No Tax"]}
              />
            </Field>
          </div>
          <div className="sc-form-grid-3">
            <Field label="Discount Type" required>
              <SelectInput
                value={form.discountType}
                onChange={(v) => set("discountType", v)}
                options={["Percentage", "Fixed", "None"]}
              />
            </Field>
            <Field label="Discount Value" required>
              <input
                value={form.discountValue}
                onChange={(e) => set("discountValue", e.target.value)}
                type="number"
                min="0"
              />
            </Field>
            <Field label="Quantity Alert" required>
              <input
                value={form.quantityAlert}
                onChange={(e) => set("quantityAlert", e.target.value)}
                type="number"
                min="0"
              />
            </Field>
          </div>
        </SectionCard>

        {/* 3. Variant Attributes */}
        <SectionCard icon={<FiPlus size={14} />} title="Variant Attributes">
          <Field label="Product Type" required>
            <div
              className="sc-radio-group"
              style={{ height: "auto", padding: 0, border: "none", background: "transparent" }}
            >
              {(["Single Product", "Variable Product"] as ProductType[]).map((t) => (
                <label key={t} className="sc-radio-label">
                  <input
                    type="radio"
                    name="variantType"
                    checked={form.variantType === t}
                    onChange={() => set("variantType", t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </Field>
          <div style={{ height: 12 }} />
          <div className="sc-form-grid-3" style={{ marginBottom: 16 }}>
            <Field label="Size">
              <SelectInput
                value={form.size}
                onChange={(v) => set("size", v)}
                options={["XS", "S", "M", "L", "XL", "XXL", "Free Size"]}
              />
            </Field>
            <Field label="Colour">
              <SelectInput
                value={form.colour}
                onChange={(v) => set("colour", v)}
                options={["Red", "Green", "Yellow", "Blue", "Black", "White", "Multicolor"]}
              />
            </Field>
            <Field label="Weight">
              <SelectInput
                value={form.weight}
                onChange={(v) => set("weight", v)}
                options={["Light", "Medium", "Heavy"]}
              />
            </Field>
          </div>
          <div className="sc-form-grid-3">
            <Field label="Pattern">
              <SelectInput
                value={form.pattern}
                onChange={(v) => set("pattern", v)}
                options={["Solid", "Striped", "Printed", "Checked", "Floral"]}
              />
            </Field>
            <Field label="Style">
              <SelectInput
                value={form.style}
                onChange={(v) => set("style", v)}
                options={["Casual", "Formal", "Sport", "Traditional", "Festive"]}
              />
            </Field>
            <Field label="Material">
              <SelectInput
                value={form.material}
                onChange={(v) => set("material", v)}
                options={["Cotton", "Synthetic", "Silk", "Wool", "Linen"]}
              />
            </Field>
          </div>
        </SectionCard>

        {/* 4. Images */}
        <SectionCard icon={<FiPlus size={14} />} title="Images">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {images.map((src, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid #E2D7CB",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "#DC2626",
                    border: "none",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiX size={10} color="#fff" />
                </button>
              </div>
            ))}

            {/* Upload box */}
            <label
              className="sc-upload-box"
              style={{
                cursor: uploading ? "wait" : "pointer",
                opacity: uploading ? 0.6 : 1,
              }}
            >
              <FiPlus size={18} style={{ color: "#541A28" }} />
              <span>{uploading ? "Uploading..." : "Add Image"}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                style={{ display: "none" }}
                onChange={handleImageAdd}
              />
            </label>
          </div>
        </SectionCard>

        {/* ── Form Actions ── */}
        <div className="sc-form-actions">
          <Link href="/" className="sc-btn-cancel">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="sc-btn-submit"
            style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
          >
            {submitting ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
