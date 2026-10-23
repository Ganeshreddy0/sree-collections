"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import {
  FiMinus,
  FiPlus,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiUploadCloud,
  FiStar,
  FiTrash2,
  FiImage,
  FiLayers,
  FiDollarSign,
  FiTag,
  FiInfo,
  FiCheck,
} from "react-icons/fi";
import { API_BASE } from "@/lib/config";

/* ─── Types ─────────────────────────────── */
type ProductType = "Single Product" | "Variable Product";

interface VariantRow {
  key: string;
  sku: string;
  size: string;
  colour: string;
  mrp: string;
  sellingPrice: string;
  discountType: "Percentage" | "Fixed" | "None";
  discountValue: string;
  stock: string;
  isActive: boolean;
}

interface ColourImageGroup {
  colour: string;
  images: string[];
  primaryImage: string;
}

interface FormState {
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

  featured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  displayOrder: string;

  productType: ProductType;
  mrp: string;
  sellingPrice: string;
  discountType: "Percentage" | "Fixed" | "None";
  discountValue: string;
  taxType: string;
  quantity: string;
  quantityAlert: string;

  size: string;
  colour: string;
  weight: string;
  pattern: string;
  style: string;
  material: string;

  fabric: string;
  careInstructions: string;
  specifications: string;
  shippingInfo: string;
  returnPolicy: string;
  dimensions: string;
  tags: string;
}

const DEFAULT_PRESET_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];
const DEFAULT_PRESET_COLOURS = [
  { name: "Black", hex: "#111827" },
  { name: "White", hex: "#FFFFFF", border: true },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Green", hex: "#16A34A" },
  { name: "Gold", hex: "#D97706" },
  { name: "Maroon", hex: "#7F1D1D" },
  { name: "Pink", hex: "#DB2777" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Orange", hex: "#EA580C" },
  { name: "Purple", hex: "#7E22CE" },
  { name: "Silver", hex: "#94A3B8" },
];

const INITIAL_FORM: FormState = {
  productName: "",
  slug: "",
  productCode: "",
  sellingType: "Retail",
  category: "",
  subCategory: "",
  brand: "",
  unit: "Pc",
  status: "Active",
  description: "",

  featured: false,
  isNewArrival: false,
  isBestSeller: false,
  displayOrder: "0",

  productType: "Single Product",
  mrp: "0",
  sellingPrice: "0",
  discountType: "None",
  discountValue: "0",
  taxType: "Inclusive",
  quantity: "1",
  quantityAlert: "5",

  size: "Free Size",
  colour: "Red",
  weight: "",
  pattern: "",
  style: "",
  material: "",

  fabric: "",
  careInstructions: "",
  specifications: "",
  shippingInfo: "",
  returnPolicy: "",
  dimensions: "",
  tags: "",
};

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="sc-section-card">
      <div className="sc-section-header" onClick={() => setCollapsed(!collapsed)}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="sc-section-icon">{icon}</span>
          <span className="sc-section-title">{title}</span>
        </div>
        <button
          type="button"
          className="sc-collapse-btn"
          aria-label={collapsed ? "Expand section" : "Collapse section"}
        >
          {collapsed ? <FiPlus size={14} /> : <FiMinus size={14} />}
        </button>
      </div>
      {!collapsed && <div className="sc-section-body">{children}</div>}
    </div>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sc-form-field">
      <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>
          {label}
          {required && <span style={{ color: "#DC2626", fontWeight: 700 }}> *</span>}
        </span>
        {hint && <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400 }}>{hint}</span>}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: 11, color: "#DC2626", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
          <FiAlertCircle size={12} /> {error}
        </span>
      )}
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
  options: { label: string; value: string }[] | string[];
  placeholder?: string;
}) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          paddingRight: 28,
          width: "100%",
          height: 38,
          borderRadius: 6,
          border: "1px solid #D8C4AA",
          backgroundColor: "#FFFFFF",
          fontSize: 13,
          color: "#2B1B20",
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const lbl = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      <span
        style={{
          position: "absolute",
          right: 12,
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = (params?.id as string) || "";

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<{ name: string; category: string }[]>([]);
  const [brands, setBrands] = useState<string[]>(["Zara", "Chanderi", "Pochampally", "Caratlane", "---"]);

  const [images, setImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string>("");

  const [PRESET_SIZES, setPresetSizes] = useState<string[]>(DEFAULT_PRESET_SIZES);
  const [PRESET_COLOURS, setPresetColours] = useState(DEFAULT_PRESET_COLOURS);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState<string>("");

  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [customColourInput, setCustomColourInput] = useState<string>("");

  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [colourImages, setColourImages] = useState<ColourImageGroup[]>([]);

  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingColour, setUploadingColour] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories, subcategories, brands, and variant presets
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setCategories(d.data.map((c: any) => ({ id: c._id || c.id, name: c.name })));
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/sub-categories`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setAllSubCategories(d.data.map((s: any) => ({ name: s.name, category: s.category })));
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/brands`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setBrands(d.data.map((b: any) => b.name));
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/variants`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          d.data.forEach((v: any) => {
            const vName = String(v.name || "").toLowerCase();
            const vals = Array.isArray(v.values) ? v.values : String(v.valueString || "").split(",").map((s) => s.trim()).filter(Boolean);
            if (vals.length > 0) {
              if (vName.includes("size")) {
                setPresetSizes(Array.from(new Set([...vals, ...DEFAULT_PRESET_SIZES])));
              } else if (vName.includes("col")) {
                const mapped = vals.map((colName: string) => ({
                  name: colName,
                  hex: DEFAULT_PRESET_COLOURS.find((c) => c.name.toLowerCase() === colName.toLowerCase())?.hex || "#7F1D1D",
                }));
                setPresetColours(mapped);
              }
            }
          });
        }
      })
      .catch(() => {});
  }, []);

  // Fetch product data to edit
  useEffect(() => {
    if (!productId) return;
    setLoadingProduct(true);

    fetch(`${API_BASE}/products/${productId}`)
      .then((r) => r.json())
      .then((res) => {
        if (!res.success || !res.data) {
          throw new Error(res.message || "Product not found");
        }
        const p = res.data;

        const isVariable = p.productType === "Variable Product" || p.variantType === "Variable Product" || (Array.isArray(p.variants) && p.variants.length > 0);

        setForm({
          productName: p.productName || p.title || "",
          slug: p.slug || "",
          productCode: p.productCode || p.sku || "",
          sellingType: p.sellingType || "Retail",
          category: p.categoryName || p.category || "",
          subCategory: p.subCategory || "",
          brand: p.brand || "",
          unit: p.unit || "Pc",
          status: p.isActive === false ? "Inactive" : "Active",
          description: p.description || "",

          featured: Boolean(p.featured),
          isNewArrival: Boolean(p.isNewArrival),
          isBestSeller: Boolean(p.isBestSeller),
          displayOrder: String(p.displayOrder || 0),

          productType: isVariable ? "Variable Product" : "Single Product",
          mrp: String(p.mrp || p.price || 0),
          sellingPrice: String(p.sellingPrice || p.price || 0),
          discountType: p.discountType || "None",
          discountValue: String(p.discountValue || 0),
          taxType: p.taxType || "Inclusive",
          quantity: String(p.stock !== undefined ? p.stock : (p.quantity || 0)),
          quantityAlert: String(p.quantityAlert || 5),

          size: p.attributes?.size || p.size || "Free Size",
          colour: p.attributes?.colour || p.colour || "Red",
          weight: p.attributes?.weight || p.weight || "",
          pattern: p.attributes?.pattern || p.pattern || "",
          style: p.attributes?.style || p.style || "",
          material: p.attributes?.material || p.material || "",

          fabric: p.fabric || "",
          careInstructions: p.careInstructions || "",
          specifications: p.specifications || "",
          shippingInfo: p.shippingInfo || "",
          returnPolicy: p.returnPolicy || "",
          dimensions: p.dimensions || "",
          tags: Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || ""),
        });

        if (Array.isArray(p.images) && p.images.length > 0) {
          setImages(p.images);
        }
        if (p.featuredImage) {
          setFeaturedImage(p.featuredImage);
        } else if (Array.isArray(p.images) && p.images.length > 0) {
          setFeaturedImage(p.images[0]);
        }

        if (Array.isArray(p.selectedSizes)) setSelectedSizes(p.selectedSizes);
        if (Array.isArray(p.selectedColours)) setSelectedColours(p.selectedColours);

        if (Array.isArray(p.colourImages)) {
          setColourImages(p.colourImages);
        }

        if (Array.isArray(p.variants) && p.variants.length > 0) {
          setVariants(
            p.variants.map((v: any) => ({
              key: `${v.size}-${v.colour}`,
              sku: v.sku || "",
              size: v.size || "",
              colour: v.colour || "",
              mrp: String(v.mrp || p.mrp || 0),
              sellingPrice: String(v.sellingPrice || p.sellingPrice || 0),
              discountType: v.discountType || "None",
              discountValue: String(v.discountValue || 0),
              stock: String(v.stock !== undefined ? v.stock : 0),
              isActive: v.isActive !== false,
            }))
          );
        }
      })
      .catch((err) => {
        setFeedback({ type: "error", message: err.message || "Failed to load product details" });
      })
      .finally(() => {
        setLoadingProduct(false);
      });
  }, [productId]);

  const set = (field: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const filteredSubCategories = useMemo(() => {
    if (!form.category) return [];
    return allSubCategories
      .filter((s) => s.category.toLowerCase() === form.category.toLowerCase())
      .map((s) => s.name);
  }, [form.category, allSubCategories]);

  const baseMrpNum = Number(form.mrp) || 0;
  const baseSellingNum = Number(form.sellingPrice) || 0;
  const baseDiscountValNum = Number(form.discountValue) || 0;

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const handleAddCustomSize = () => {
    const val = customSizeInput.trim();
    if (val && !selectedSizes.includes(val)) {
      setSelectedSizes((prev) => [...prev, val]);
      if (!PRESET_SIZES.includes(val)) setPresetSizes((prev) => [...prev, val]);
      setCustomSizeInput("");
    }
  };

  const toggleColour = (colName: string) => {
    setSelectedColours((prev) => {
      const exists = prev.includes(colName);
      const next = exists ? prev.filter((c) => c !== colName) : [...prev, colName];
      if (!exists) {
        setColourImages((cImg) => {
          if (cImg.some((ci) => ci.colour === colName)) return cImg;
          return [...cImg, { colour: colName, images: [], primaryImage: "" }];
        });
      }
      return next;
    });
  };

  const handleAddCustomColour = () => {
    const val = customColourInput.trim();
    if (val && !selectedColours.includes(val)) {
      setSelectedColours((prev) => [...prev, val]);
      setPresetColours((prev) => [...prev, { name: val, hex: "#888888" }]);
      setColourImages((cImg) => [...cImg, { colour: val, images: [], primaryImage: "" }]);
      setCustomColourInput("");
    }
  };

  // Recompute variants if attributes change
  useEffect(() => {
    if (form.productType !== "Variable Product") return;
    if (selectedSizes.length === 0 || selectedColours.length === 0) return;

    setVariants((prev) => {
      const prevMap = new Map(prev.map((v) => [v.key, v]));
      const newVariants: VariantRow[] = [];

      for (const colour of selectedColours) {
        for (const size of selectedSizes) {
          const key = `${size}-${colour}`;
          const prefix = form.productCode.trim() || "SKU";
          const cleanSize = size.replace(/\s+/g, "").toUpperCase();
          const cleanCol = colour.replace(/\s+/g, "").toUpperCase();
          const defaultSku = `${prefix}-${cleanCol}-${cleanSize}`;

          if (prevMap.has(key)) {
            newVariants.push(prevMap.get(key)!);
          } else {
            newVariants.push({
              key,
              size,
              colour,
              sku: defaultSku,
              mrp: form.mrp || "0",
              sellingPrice: form.sellingPrice || "0",
              discountType: form.discountType,
              discountValue: form.discountValue,
              stock: form.quantity || "10",
              isActive: true,
            });
          }
        }
      }
      return newVariants;
    });
  }, [selectedSizes, selectedColours, form.productType]);

  const updateVariantRow = (key: string, field: keyof VariantRow, value: unknown) => {
    setVariants((prev) =>
      prev.map((v) => (v.key === key ? { ...v, [field]: value } : v))
    );
  };

  // Upload handler for Gallery images
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`${API_BASE}/upload/single`, {
          method: "POST",
          headers: { Authorization: "Bearer super_admin_authenticated" },
          body: formData,
        });
        const data = await res.json();
        return data.url || data.imageUrl || data.secure_url;
      });

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean);
      setImages((prev) => [...prev, ...uploadedUrls]);
      if (!featuredImage && uploadedUrls.length > 0) {
        setFeaturedImage(uploadedUrls[0]);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to upload image(s)" });
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveImage = (imgUrl: string) => {
    setImages((prev) => prev.filter((img) => img !== imgUrl));
    if (featuredImage === imgUrl) {
      setFeaturedImage(images.find((img) => img !== imgUrl) || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const finalVariants =
      form.productType === "Variable Product"
        ? variants.map((v) => ({
            sku: v.sku.trim(),
            size: v.size,
            colour: v.colour,
            mrp: Number(v.mrp) || 0,
            sellingPrice: Number(v.sellingPrice) || 0,
            discountType: v.discountType,
            discountValue: Number(v.discountValue) || 0,
            stock: Number(v.stock) || 0,
            isActive: v.isActive,
          }))
        : [];

    const totalQty =
      form.productType === "Variable Product"
        ? finalVariants.reduce((sum, v) => sum + (v.stock || 0), 0)
        : Number(form.quantity) || 0;

    const payload = {
      productName: form.productName.trim(),
      title: form.productName.trim(),
      slug: form.slug.trim() || form.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      productCode: form.productCode.trim(),
      sku: form.productCode.trim(),
      sellingType: form.sellingType,
      category: form.category,
      categoryName: form.category,
      subCategory: form.subCategory,
      brand: form.brand,
      unit: form.unit,
      status: form.status,
      isActive: form.status === "Active",
      description: form.description,

      featured: form.featured,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      displayOrder: Number(form.displayOrder) || 0,
      featuredImage: featuredImage || (images.length > 0 ? images[0] : ""),

      productType: form.productType,
      mrp: baseMrpNum,
      sellingPrice: baseSellingNum,
      price: baseSellingNum || baseMrpNum,
      taxType: form.taxType,
      discountType: form.discountType,
      discountValue: baseDiscountValNum,
      quantity: totalQty,
      stock: totalQty,
      quantityAlert: Number(form.quantityAlert) || 5,

      variantType: form.productType,
      attributes: {
        size: form.size,
        colour: form.colour,
        weight: form.weight,
        pattern: form.pattern,
        style: form.style,
        material: form.material,
      },
      selectedSizes: form.productType === "Variable Product" ? selectedSizes : [form.size],
      selectedColours: form.productType === "Variable Product" ? selectedColours : [form.colour],

      variants: finalVariants,
      images: images.length > 0 ? images : [],
      colourImages,

      fabric: form.fabric,
      careInstructions: form.careInstructions,
      specifications: form.specifications,
      shippingInfo: form.shippingInfo,
      returnPolicy: form.returnPolicy,
      weight: form.weight,
      dimensions: form.dimensions,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: "PUT",
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
          message: `Product "${form.productName}" updated successfully! Redirecting...`,
        });
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Failed to update product.",
        });
      }
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Network error updating product",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <AdminShell>
        <div style={{ padding: "60px 20px", textAlign: "center", color: "#685F53" }}>
          <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Loading Product Details...</div>
          <p style={{ fontSize: "14px", color: "#9CA3AF" }}>Please wait while we fetch the product information.</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {/* ── Page Header ── */}
      <div className="sc-page-header">
        <div>
          <h1 className="sc-page-title">Edit Product: {form.productName || productId}</h1>
          <div className="sc-breadcrumbs">
            <Link href="/" style={{ color: "#8C7A6B" }}>
              Products
            </Link>
            <span>›</span>
            <span style={{ color: "#3B2C24", fontWeight: 500 }}>Edit</span>
          </div>
        </div>
        <div className="sc-action-buttons">
          <Link href="/" className="sc-btn-cancel">
            Back to Products
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          className={`sc-feedback-banner ${feedback.type}`}
          style={{
            marginBottom: 20,
            padding: "14px 18px",
            borderRadius: 8,
            backgroundColor: feedback.type === "success" ? "#F0FDF4" : "#FEF2F2",
            border: feedback.type === "success" ? "1px solid #86EFAC" : "1px solid #FCA5A5",
            color: feedback.type === "success" ? "#166534" : "#991B1B",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {feedback.type === "success" ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* SECTION 1: Product Information */}
        <SectionCard icon={<FiTag size={16} />} title="1. Product Information">
          <div className="sc-form-grid" style={{ marginBottom: 16 }}>
            <Field label="Product Name" required error={errors.productName}>
              <input
                value={form.productName}
                onChange={(e) => set("productName", e.target.value)}
                placeholder="e.g. Kanjivaram Pure Silk Saree"
              />
            </Field>

            <Field label="Product Code / SKU Prefix" required error={errors.productCode}>
              <input
                value={form.productCode}
                onChange={(e) => set("productCode", e.target.value)}
                placeholder="e.g. KNJ-SILK-001"
              />
            </Field>
          </div>

          <div className="sc-form-grid-3" style={{ marginBottom: 16 }}>
            <Field label="Category" required error={errors.category}>
              <SelectInput
                value={form.category}
                onChange={(v) => {
                  set("category", v);
                  set("subCategory", "");
                }}
                options={categories.map((c) => ({ label: c.name, value: c.name }))}
                placeholder="Select Category"
              />
            </Field>

            <Field label="Sub Category">
              <SelectInput
                value={form.subCategory}
                onChange={(v) => set("subCategory", v)}
                options={filteredSubCategories.length > 0 ? filteredSubCategories : ["Traditional", "Modern", "Designer"]}
                placeholder="Select Sub Category"
              />
            </Field>

            <Field label="Brand">
              <SelectInput
                value={form.brand}
                onChange={(v) => set("brand", v)}
                options={brands}
                placeholder="Select Brand"
              />
            </Field>
          </div>

          <div className="sc-form-grid" style={{ marginBottom: 16 }}>
            <Field label="Unit">
              <SelectInput
                value={form.unit}
                onChange={(v) => set("unit", v)}
                options={["Pc", "Set", "Box", "Pair", "Metre"]}
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
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Enter comprehensive product story, styling tips, etc."
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #D8C4AA",
                fontFamily: "inherit",
                fontSize: 13,
              }}
            />
          </Field>
        </SectionCard>

        {/* SECTION 2: Pricing & Stock */}
        <SectionCard icon={<FiDollarSign size={16} />} title="2. Pricing & Stock">
          <div className="sc-form-grid-3" style={{ marginBottom: 16 }}>
            <Field label="Product Type">
              <SelectInput
                value={form.productType}
                onChange={(v) => set("productType", v as ProductType)}
                options={["Single Product", "Variable Product"]}
              />
            </Field>

            <Field label="MRP (₹)" required error={errors.mrp}>
              <input
                type="number"
                min="0"
                value={form.mrp}
                onChange={(e) => set("mrp", e.target.value)}
              />
            </Field>

            <Field label="Selling Price (₹)" required error={errors.sellingPrice}>
              <input
                type="number"
                min="0"
                value={form.sellingPrice}
                onChange={(e) => set("sellingPrice", e.target.value)}
              />
            </Field>
          </div>

          <div className="sc-form-grid-3" style={{ marginBottom: 16 }}>
            <Field label="Discount Type">
              <SelectInput
                value={form.discountType}
                onChange={(v) => set("discountType", v as any)}
                options={["None", "Percentage", "Fixed"]}
              />
            </Field>

            <Field label="Discount Value">
              <input
                type="number"
                min="0"
                value={form.discountValue}
                onChange={(e) => set("discountValue", e.target.value)}
              />
            </Field>

            <Field label="Stock Quantity" required={form.productType === "Single Product"}>
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
              />
            </Field>
          </div>
        </SectionCard>

        {/* SECTION 3: Variable Product Variants */}
        {form.productType === "Variable Product" && (
          <SectionCard icon={<FiLayers size={16} />} title="3. Product Variants & Attributes">
            {/* Size Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2B1B20", marginBottom: 8 }}>
                Select Available Sizes
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {PRESET_SIZES.map((sz) => {
                  const sel = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: sel ? "2px solid #541A28" : "1px solid #D8C4AA",
                        backgroundColor: sel ? "#541A28" : "#FFFFFF",
                        color: sel ? "#FFFFFF" : "#2B1B20",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8, maxWidth: 300 }}>
                <input
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  placeholder="Custom size (e.g. 38, 40)"
                  style={{ height: 34, padding: "0 10px", borderRadius: 4, border: "1px solid #D8C4AA", fontSize: 12 }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomSize}
                  style={{ padding: "0 14px", backgroundColor: "#F2ECE4", border: "1px solid #D8C4AA", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Colour Selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2B1B20", marginBottom: 8 }}>
                Select Available Colours
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {PRESET_COLOURS.map((col) => {
                  const sel = selectedColours.includes(col.name);
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => toggleColour(col.name)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: sel ? "2px solid #541A28" : "1px solid #D8C4AA",
                        backgroundColor: sel ? "#541A28" : "#FFFFFF",
                        color: sel ? "#FFFFFF" : "#2B1B20",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: col.hex, border: "1px solid rgba(0,0,0,0.2)" }} />
                      {col.name}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8, maxWidth: 300 }}>
                <input
                  value={customColourInput}
                  onChange={(e) => setCustomColourInput(e.target.value)}
                  placeholder="Custom colour (e.g. Lavender)"
                  style={{ height: 34, padding: "0 10px", borderRadius: 4, border: "1px solid #D8C4AA", fontSize: 12 }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomColour}
                  style={{ padding: "0 14px", backgroundColor: "#F2ECE4", border: "1px solid #D8C4AA", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Variants Matrix Table */}
            {variants.length > 0 && (
              <div style={{ overflowX: "auto", marginTop: 16 }}>
                <table className="sc-table" style={{ fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th>Variant (Size/Colour)</th>
                      <th>SKU</th>
                      <th>Selling Price (₹)</th>
                      <th>Stock Qty</th>
                      <th>Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v) => (
                      <tr key={v.key}>
                        <td style={{ fontWeight: 600 }}>
                          {v.size} / {v.colour}
                        </td>
                        <td>
                          <input
                            value={v.sku}
                            onChange={(e) => updateVariantRow(v.key, "sku", e.target.value)}
                            style={{ height: 30, padding: "0 8px", width: 140, border: "1px solid #D8C4AA", borderRadius: 4 }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={v.sellingPrice}
                            onChange={(e) => updateVariantRow(v.key, "sellingPrice", e.target.value)}
                            style={{ height: 30, padding: "0 8px", width: 100, border: "1px solid #D8C4AA", borderRadius: 4 }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => updateVariantRow(v.key, "stock", e.target.value)}
                            style={{ height: 30, padding: "0 8px", width: 80, border: "1px solid #D8C4AA", borderRadius: 4 }}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={v.isActive}
                            onChange={(e) => updateVariantRow(v.key, "isActive", e.target.checked)}
                            style={{ accentColor: "#541A28" }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        )}

        {/* SECTION 4: Gallery Images */}
        <SectionCard icon={<FiImage size={16} />} title="4. Product Images & Gallery">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            {images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  width: 100,
                  height: 100,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: featuredImage === img ? "3px solid #541A28" : "1px solid #E5D7C5",
                }}
              >
                <img src={img} alt="Product preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(220, 38, 38, 0.9)",
                    border: "none",
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <FiX size={12} />
                </button>
                {featuredImage !== img && (
                  <button
                    type="button"
                    onClick={() => setFeaturedImage(img)}
                    style={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      right: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      background: "rgba(0,0,0,0.6)",
                      color: "#FFF",
                      border: "none",
                      borderRadius: 4,
                      padding: "2px 0",
                      cursor: "pointer",
                    }}
                  >
                    Set Primary
                  </button>
                )}
              </div>
            ))}

            <label
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
                border: "2px dashed #D8C4AA",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: uploadingGallery ? "not-allowed" : "pointer",
                backgroundColor: "#FAF8F5",
                color: "#8C7A6B",
                fontSize: 11,
              }}
            >
              <FiUploadCloud size={20} />
              <span>{uploadingGallery ? "Uploading..." : "Add Images"}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploadingGallery}
                style={{ display: "none" }}
                onChange={handleGalleryUpload}
              />
            </label>
          </div>
        </SectionCard>

        {/* SECTION 5: Additional Specifications */}
        <SectionCard icon={<FiInfo size={16} />} title="5. Additional Details & Specs">
          <div className="sc-form-grid" style={{ marginBottom: 16 }}>
            <Field label="Fabric & Material">
              <input
                value={form.fabric}
                onChange={(e) => set("fabric", e.target.value)}
                placeholder="e.g. 100% Pure Mulberry Silk"
              />
            </Field>

            <Field label="Care Instructions">
              <input
                value={form.careInstructions}
                onChange={(e) => set("careInstructions", e.target.value)}
                placeholder="e.g. Dry Clean Only"
              />
            </Field>
          </div>

          <div className="sc-form-grid" style={{ marginBottom: 16 }}>
            <Field label="Specifications">
              <input
                value={form.specifications}
                onChange={(e) => set("specifications", e.target.value)}
                placeholder="e.g. Length: 6.3m with Blouse Piece"
              />
            </Field>

            <Field label="Tags (comma-separated)">
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="e.g. silk, saree, wedding, bridal"
              />
            </Field>
          </div>
        </SectionCard>

        {/* Submit Actions */}
        <div className="sc-form-actions" style={{ marginTop: 24, paddingBottom: 40, display: "flex", gap: 12 }}>
          <Link href="/" className="sc-btn-cancel">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="sc-btn-submit"
            style={{
              padding: "0 28px",
              height: 40,
              fontSize: 14,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Saving..." : "Update Product"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
