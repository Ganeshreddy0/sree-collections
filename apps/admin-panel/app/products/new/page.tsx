"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const API_BASE = "http://localhost:5000/api";

/* ─── Types ─────────────────────────────── */
type ProductType = "Single Product" | "Variable Product";

interface VariantRow {
  key: string; // size + '-' + colour
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
  // 1. Product Information
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

  // 2. Product Display Settings
  featured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  displayOrder: string;

  // 3. Pricing & Stock
  productType: ProductType;
  mrp: string;
  sellingPrice: string;
  discountType: "Percentage" | "Fixed" | "None";
  discountValue: string;
  taxType: string;
  quantity: string;
  quantityAlert: string;

  // 4. Variant Attributes (for single or variable)
  size: string;
  colour: string;
  weight: string;
  pattern: string;
  style: string;
  material: string;

  // 7. Additional Info
  fabric: string;
  careInstructions: string;
  specifications: string;
  shippingInfo: string;
  returnPolicy: string;
  dimensions: string;
  tags: string;
}

const PRESET_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];
const PRESET_COLOURS = [
  { name: "Black", hex: "#111827" },
  { name: "White", hex: "#FFFFFF", border: true },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Green", hex: "#16A34A" },
  { name: "Grey", hex: "#6B7280" },
  { name: "Yellow", hex: "#CA8A04" },
  { name: "Pink", hex: "#DB2777" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Maroon", hex: "#541A28" },
  { name: "Gold", hex: "#C5A059" },
  { name: "Beige", hex: "#D8C4AA" },
];

const INITIAL_FORM: FormState = {
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

  featured: false,
  isNewArrival: true,
  isBestSeller: false,
  displayOrder: "0",

  productType: "Single Product",
  mrp: "200",
  sellingPrice: "150",
  discountType: "Percentage",
  discountValue: "25",
  taxType: "GST 5%",
  quantity: "100",
  quantityAlert: "5",

  size: "M",
  colour: "Red",
  weight: "Medium",
  pattern: "Solid",
  style: "Casual",
  material: "Cotton",

  fabric: "100% Pure Organic Cotton",
  careInstructions: "Machine wash cold with like colours, tumble dry low, warm iron if needed.",
  specifications: "Regular fit, breathable fabric, double-stitched seams for durability.",
  shippingInfo: "Dispatched within 24-48 hours. Free express shipping across India on orders above ₹999.",
  returnPolicy: "Easy 7-day hassle-free return and exchange policy from delivery date.",
  dimensions: "30 x 20 x 4 cm",
  tags: "casual, premium, summer, festive, trending",
};

/* ─── Helper: Reusable Section Card ─────────────── */
function SectionCard({
  icon,
  title,
  children,
  badge,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  badge?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="sc-section" style={{ background: "#FFFFFF", marginBottom: 20 }}>
      <div
        className="sc-section-header"
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon && <span style={{ color: "#EE5F2B" }}>{icon}</span>}
          <span style={{ fontSize: 14, fontWeight: 700, color: "#541A28" }}>{title}</span>
          {badge && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 12,
                background: "#F1E6D6",
                color: "#541A28",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed(!collapsed);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9CA3AF",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Toggle section"
        >
          {collapsed ? <FiPlus size={16} /> : <FiMinus size={16} />}
        </button>
      </div>
      {!collapsed && <div className="sc-section-body">{children}</div>}
    </div>
  );
}

/* ─── Helper: Reusable Field ────────────────────── */
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

/* ─── Helper: Styled Select ─────────────────────── */
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

/* ─── Main Create Product Page ──────────────────── */
export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  // Dynamic dropdown options from backend
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([
    { id: "1", name: "Casual Wear" },
    { id: "2", name: "Saree" },
    { id: "3", name: "Jewellery" },
    { id: "4", name: "Decorative Items" },
  ]);
  const [allSubCategories, setAllSubCategories] = useState<{ name: string; category: string }[]>([
    { name: "Casual", category: "Casual Wear" },
    { name: "Formal", category: "Casual Wear" },
    { name: "Silk Saree", category: "Saree" },
    { name: "Traditional", category: "Saree" },
    { name: "Earrings", category: "Jewellery" },
    { name: "Chains", category: "Jewellery" },
    { name: "Balloons", category: "Decorative Items" },
  ]);
  const [brands, setBrands] = useState<string[]>(["Zara", "Chanderi", "Pochampally", "Caratlane", "---"]);

  // Gallery images & featured image
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80",
  ]);
  const [featuredImage, setFeaturedImage] = useState<string>(
    "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80"
  );

  // Variable product attributes
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L"]);
  const [customSizeInput, setCustomSizeInput] = useState<string>("");

  const [selectedColours, setSelectedColours] = useState<string[]>(["Black", "Red"]);
  const [customColourInput, setCustomColourInput] = useState<string>("");

  // Variants table state
  const [variants, setVariants] = useState<VariantRow[]>([]);

  // Per-colour image galleries
  const [colourImages, setColourImages] = useState<ColourImageGroup[]>([
    {
      colour: "Black",
      images: ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80"],
      primaryImage: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80",
    },
    {
      colour: "Red",
      images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80"],
      primaryImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80",
    },
  ]);

  // Loading & feedback states
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingColour, setUploadingColour] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Load dynamic backend options ── */
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data && Array.isArray(d.data) && d.data.length > 0) {
          setCategories(d.data.map((c: { _id?: string; id?: string; name: string }) => ({
            id: (c._id || c.id || c.name).toString(),
            name: c.name,
          })));
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/sub-categories`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data && Array.isArray(d.data) && d.data.length > 0) {
          setAllSubCategories(d.data.map((s: { name: string; category?: string }) => ({
            name: s.name,
            category: s.category || "",
          })));
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/brands`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data && Array.isArray(d.data) && d.data.length > 0) {
          const list = d.data.map((b: { name: string }) => b.name);
          if (!list.includes("---")) list.push("---");
          setBrands(list);
        }
      })
      .catch(() => {});
  }, []);

  /* ── Filter subcategories based on chosen category ── */
  const filteredSubCategories = useMemo(() => {
    const matched = allSubCategories.filter(
      (s) =>
        s.category &&
        (s.category.toLowerCase() === form.category.toLowerCase() ||
          s.category === form.category)
    );
    if (matched.length > 0) return matched.map((s) => s.name);
    // If no direct link found in subcategory category field, return all names or default list
    return allSubCategories.map((s) => s.name);
  }, [allSubCategories, form.category]);

  /* ── Form field updater ── */
  const set = (key: keyof FormState, value: unknown) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "productName") {
        const raw = String(value);
        updated.slug = raw
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      return updated;
    });
    // Clear field-level error
    if (errors[key]) {
      setErrors((prev) => {
        const clone = { ...prev };
        delete clone[key];
        return clone;
      });
    }
  };

  /* ── Sync colourImages state with selectedColours ── */
  useEffect(() => {
    setColourImages((prev) => {
      const result: ColourImageGroup[] = [];
      for (const col of selectedColours) {
        const existing = prev.find((g) => g.colour.toLowerCase() === col.toLowerCase());
        if (existing) {
          result.push(existing);
        } else {
          result.push({
            colour: col,
            images: [],
            primaryImage: "",
          });
        }
      }
      return result;
    });
  }, [selectedColours]);

  /* ── Recalculate variants table when sizes, colours, or base prices change ── */
  useEffect(() => {
    if (form.productType !== "Variable Product") {
      setVariants([]);
      return;
    }

    setVariants((prev) => {
      const prevMap = new Map<string, VariantRow>();
      prev.forEach((v) => prevMap.set(v.key, v));

      const newVariants: VariantRow[] = [];
      const prefix = (form.productCode || "PT001").trim().toUpperCase();

      for (const size of selectedSizes) {
        for (const colour of selectedColours) {
          const key = `${size}-${colour}`;
          const cleanSize = size.replace(/\s+/g, "").toUpperCase();
          const cleanCol = colour.replace(/\s+/g, "").toUpperCase();
          const defaultSku = `${prefix}-${cleanCol}-${cleanSize}`;

          if (prevMap.has(key)) {
            const old = prevMap.get(key)!;
            newVariants.push({
              ...old,
              sku: old.sku || defaultSku,
            });
          } else {
            newVariants.push({
              key,
              size,
              colour,
              sku: defaultSku,
              mrp: form.mrp || "200",
              sellingPrice: form.sellingPrice || "150",
              discountType: form.discountType,
              discountValue: form.discountValue,
              stock: form.quantity || "50",
              isActive: true,
            });
          }
        }
      }

      return newVariants;
    });
  }, [
    form.productType,
    form.productCode,
    form.mrp,
    form.sellingPrice,
    form.discountType,
    form.discountValue,
    form.quantity,
    selectedSizes,
    selectedColours,
  ]);

  /* ── Update single variant row field ── */
  const updateVariantRow = (key: string, field: keyof VariantRow, value: unknown) => {
    setVariants((prev) =>
      prev.map((v) => (v.key === key ? { ...v, [field]: value } : v))
    );
  };

  /* ── Remove single variant row ── */
  const removeVariantRow = (key: string) => {
    setVariants((prev) => prev.filter((v) => v.key !== key));
  };

  /* ── Size attribute additions ── */
  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const handleAddCustomSize = () => {
    const val = customSizeInput.trim();
    if (!val) return;
    if (!selectedSizes.includes(val)) {
      setSelectedSizes((prev) => [...prev, val]);
    }
    setCustomSizeInput("");
  };

  /* ── Colour attribute additions ── */
  const toggleColour = (col: string) => {
    setSelectedColours((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleAddCustomColour = () => {
    const val = customColourInput.trim();
    if (!val) return;
    if (!selectedColours.includes(val)) {
      setSelectedColours((prev) => [...prev, val]);
    }
    setCustomColourInput("");
  };

  /* ── Gallery Image Upload via /api/upload ── */
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setFeedback(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      // Validate file size: 10MB
      if (files[i].size > 10 * 1024 * 1024) {
        setFeedback({
          type: "error",
          message: `File "${files[i].name}" exceeds maximum allowed size of 10MB`,
        });
        setUploadingGallery(false);
        return;
      }
      formData.append("images", files[i]);
    }

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.urls) && data.urls.length > 0) {
        setImages((prev) => [...prev, ...data.urls]);
        if (!featuredImage) setFeaturedImage(data.urls[0]);
      } else {
        // Local object URL fallback
        for (let i = 0; i < files.length; i++) {
          const url = URL.createObjectURL(files[i]);
          setImages((prev) => [...prev, url]);
          if (!featuredImage && i === 0) setFeaturedImage(url);
        }
      }
    } catch {
      for (let i = 0; i < files.length; i++) {
        const url = URL.createObjectURL(files[i]);
        setImages((prev) => [...prev, url]);
        if (!featuredImage && i === 0) setFeaturedImage(url);
      }
    } finally {
      setUploadingGallery(false);
    }
  };

  /* ── Per-Colour Image Upload via /api/upload ── */
  const handleColourImageUpload = async (
    colour: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingColour(colour);
    setFeedback(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 10 * 1024 * 1024) {
        setFeedback({
          type: "error",
          message: `File "${files[i].name}" exceeds 10MB limit`,
        });
        setUploadingColour(null);
        return;
      }
      formData.append("images", files[i]);
    }

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const newUrls: string[] =
        data.success && Array.isArray(data.urls)
          ? data.urls
          : Array.from(files).map((f) => URL.createObjectURL(f));

      setColourImages((prev) =>
        prev.map((group) => {
          if (group.colour === colour) {
            const updatedImages = [...group.images, ...newUrls];
            const primary = group.primaryImage || updatedImages[0] || "";
            return {
              ...group,
              images: updatedImages,
              primaryImage: primary,
            };
          }
          return group;
        })
      );

      // Also ensure images are in overall gallery if needed
      setImages((prev) => {
        const setUrls = new Set(prev);
        newUrls.forEach((u) => setUrls.add(u));
        return Array.from(setUrls);
      });
    } catch {
      const fallbackUrls = Array.from(files).map((f) => URL.createObjectURL(f));
      setColourImages((prev) =>
        prev.map((group) => {
          if (group.colour === colour) {
            const updatedImages = [...group.images, ...fallbackUrls];
            return {
              ...group,
              images: updatedImages,
              primaryImage: group.primaryImage || updatedImages[0] || "",
            };
          }
          return group;
        })
      );
    } finally {
      setUploadingColour(null);
    }
  };

  /* ── Set Primary Image for Colour ── */
  const setPrimaryColourImage = (colour: string, imgUrl: string) => {
    setColourImages((prev) =>
      prev.map((g) => (g.colour === colour ? { ...g, primaryImage: imgUrl } : g))
    );
  };

  /* ── Remove Colour Image ── */
  const removeColourImage = (colour: string, imgUrl: string) => {
    setColourImages((prev) =>
      prev.map((g) => {
        if (g.colour === colour) {
          const filtered = g.images.filter((img) => img !== imgUrl);
          const primary =
            g.primaryImage === imgUrl ? (filtered[0] || "") : g.primaryImage;
          return { ...g, images: filtered, primaryImage: primary };
        }
        return g;
      })
    );
  };

  /* ── Dynamic Discount Calculations ── */
  const baseMrpNum = Number(form.mrp) || 0;
  const baseSellingNum = Number(form.sellingPrice) || 0;
  const baseDiscountValNum = Number(form.discountValue) || 0;

  const calculatedDiscountPrice = useMemo(() => {
    if (form.discountType === "Percentage" && baseDiscountValNum > 0) {
      return Math.max(0, baseSellingNum - (baseSellingNum * baseDiscountValNum) / 100);
    }
    if (form.discountType === "Fixed" && baseDiscountValNum > 0) {
      return Math.max(0, baseSellingNum - baseDiscountValNum);
    }
    return null;
  }, [form.discountType, baseDiscountValNum, baseSellingNum]);

  const discountPercentDisplay = useMemo(() => {
    if (baseMrpNum > 0 && baseSellingNum < baseMrpNum) {
      return Math.round(((baseMrpNum - baseSellingNum) / baseMrpNum) * 100);
    }
    return null;
  }, [baseMrpNum, baseSellingNum]);

  /* ── Comprehensive Form Validation ── */
  const validateForm = useCallback((): boolean => {
    const errs: Record<string, string> = {};

    if (!form.productName.trim()) {
      errs.productName = "Product Name is required";
    }

    if (!form.productCode.trim()) {
      errs.productCode = "Product Code / SKU Prefix is required";
    }

    if (!form.category) {
      errs.category = "Category is required";
    }

    if (baseMrpNum < 0) {
      errs.mrp = "MRP cannot be negative";
    }

    if (baseSellingNum < 0) {
      errs.sellingPrice = "Selling price cannot be negative";
    }

    if (baseMrpNum > 0 && baseSellingNum > baseMrpNum) {
      errs.sellingPrice = "Selling price should not exceed MRP";
    }

    if (form.productType === "Single Product") {
      if (Number(form.quantity) < 0) {
        errs.quantity = "Stock quantity cannot be negative";
      }
    }

    if (form.productType === "Variable Product") {
      if (variants.length === 0) {
        errs.variants = "Please select at least one Size and one Colour to generate variants";
      } else {
        const skuSet = new Set<string>();
        for (let i = 0; i < variants.length; i++) {
          const v = variants[i];
          if (!v.sku || !v.sku.trim()) {
            errs.variants = `SKU is required for variant ${v.size}/${v.colour}`;
            break;
          }
          if (skuSet.has(v.sku.trim())) {
            errs.variants = `Duplicate variant SKU detected: ${v.sku}`;
            break;
          }
          skuSet.add(v.sku.trim());

          const varMrp = Number(v.mrp) || 0;
          const varSell = Number(v.sellingPrice) || 0;
          if (varSell < 0 || varMrp < 0) {
            errs.variants = `Prices for ${v.size}/${v.colour} cannot be negative`;
            break;
          }
          if (varMrp > 0 && varSell > varMrp) {
            errs.variants = `Selling price cannot exceed MRP for ${v.size}/${v.colour}`;
            break;
          }
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form, baseMrpNum, baseSellingNum, variants]);

  /* ── Form Submission ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setFeedback({
        type: "error",
        message: "Please correct the highlighted errors before submitting.",
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    // Prepare variants payload if variable product
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

    // Calculate total quantity for variable product
    const totalQty =
      form.productType === "Variable Product"
        ? finalVariants.reduce((sum, v) => sum + (v.stock || 0), 0)
        : Number(form.quantity) || 0;

    // Filter colourImages to only include ones that have images
    const activeColourImages = colourImages
      .filter((ci) => selectedColours.includes(ci.colour) && ci.images.length > 0)
      .map((ci) => ({
        colour: ci.colour,
        images: ci.images,
        primaryImage: ci.primaryImage || ci.images[0] || "",
      }));

    // Find category doc id if category matches a known category
    const catObj = categories.find((c) => c.name === form.category);
    const categoryVal = catObj ? catObj.id : form.category;

    const payload = {
      productName: form.productName.trim(),
      title: form.productName.trim(),
      slug: form.slug.trim() || form.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      productCode: form.productCode.trim(),
      sku: form.productCode.trim(),
      sellingType: form.sellingType,
      category: categoryVal,
      categoryName: form.category,
      subCategory: form.subCategory,
      brand: form.brand,
      unit: form.unit,
      status: form.status,
      isActive: form.status === "Active",
      description: form.description,

      // Display settings
      featured: form.featured,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      displayOrder: Number(form.displayOrder) || 0,
      featuredImage: featuredImage || (images.length > 0 ? images[0] : ""),

      // Pricing & stock
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

      // Attributes (simple product)
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

      // Variants
      variants: finalVariants,

      // Images
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80"],
      colourImages: activeColourImages,

      // Additional info
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
          message: `Product "${form.productName}" added successfully to database! Redirecting...`,
        });
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Failed to create product in backend.",
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
      {/* ── Page Header ── */}
      <div className="sc-page-header">
        <div>
          <h1 className="sc-page-title">Add New Product</h1>
          <div className="sc-breadcrumbs">
            <span>Products</span>
            <span>›</span>
            <span style={{ color: "#3B2C24", fontWeight: 600 }}>Create Product</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/" className="sc-btn-cancel" style={{ display: "inline-flex", alignItems: "center" }}>
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="sc-btn-submit"
            style={{
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {submitting ? (
              <>Saving Product...</>
            ) : (
              <>
                <FiCheck size={16} /> Save Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Feedback Banner ── */}
      {feedback && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            borderRadius: "6px",
            marginBottom: "20px",
            fontSize: "13px",
            fontWeight: 500,
            background: feedback.type === "success" ? "#DCFCE7" : "#FEE2E2",
            color: feedback.type === "success" ? "#15803D" : "#B91C1C",
            border: `1px solid ${feedback.type === "success" ? "#86EFAC" : "#FCA5A5"}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {feedback.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ── Form Start ── */}
      <form onSubmit={handleSubmit} noValidate>
        {/* ============================================================
            SECTION 1: Product Information
           ============================================================ */}
        <SectionCard icon={<FiTag size={16} />} title="1. Product Information">
          <div className="sc-form-grid" style={{ marginBottom: 16 }}>
            <Field label="Product Name" required error={errors.productName}>
              <input
                required
                value={form.productName}
                onChange={(e) => set("productName", e.target.value)}
                placeholder="e.g. Royal Kanjeevaram Silk Saree"
                style={{ borderColor: errors.productName ? "#DC2626" : undefined }}
              />
            </Field>

            <Field label="Product Code / SKU Prefix" required error={errors.productCode} hint="Unique product identifier">
              <input
                required
                value={form.productCode}
                onChange={(e) => set("productCode", e.target.value)}
                placeholder="e.g. PT009 or SC-SR-01"
                style={{ borderColor: errors.productCode ? "#DC2626" : undefined }}
              />
            </Field>
          </div>

          <div className="sc-form-grid-3" style={{ marginBottom: 16 }}>
            <Field label="Category" required error={errors.category}>
              <div style={{ position: "relative" }}>
                <SelectInput
                  value={form.category}
                  onChange={(v) => {
                    set("category", v);
                    // Reset subcategory to first available or empty
                    const subs = allSubCategories.filter(
                      (s) => s.category.toLowerCase() === v.toLowerCase()
                    );
                    set("subCategory", subs[0]?.name || "");
                  }}
                  options={categories.map((c) => ({ label: c.name, value: c.name }))}
                />
                <Link
                  href="/categories/new"
                  style={{
                    position: "absolute",
                    right: 32,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 11,
                    color: "#16A34A",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  + New
                </Link>
              </div>
            </Field>

            <Field label="Subcategory" hint="Filtered by category">
              <SelectInput
                value={form.subCategory}
                onChange={(v) => set("subCategory", v)}
                options={filteredSubCategories}
                placeholder="Select Subcategory"
              />
            </Field>

            <Field label="Brand">
              <SelectInput
                value={form.brand}
                onChange={(v) => set("brand", v)}
                options={brands}
              />
            </Field>
          </div>

          <div className="sc-form-grid-3" style={{ marginBottom: 16 }}>
            <Field label="Selling Type">
              <SelectInput
                value={form.sellingType}
                onChange={(v) => set("sellingType", v)}
                options={["B2C", "B2B", "Both"]}
              />
            </Field>

            <Field label="Unit of Measurement">
              <SelectInput
                value={form.unit}
                onChange={(v) => set("unit", v)}
                options={["Pc", "Meter", "Kg", "Set", "Pair"]}
              />
            </Field>

            <Field label="Product Status">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 38,
                  border: "1px solid #D8C4AA",
                  borderRadius: 6,
                  padding: "0 12px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                {(["Active", "Inactive"] as const).map((s) => (
                  <label
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      cursor: "pointer",
                      fontWeight: form.status === s ? 700 : 400,
                      color: form.status === s ? "#541A28" : "#6B5A51",
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      checked={form.status === s}
                      onChange={() => set("status", s)}
                      style={{ accentColor: "#541A28" }}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </Field>
          </div>

          <Field label="Product Description">
            <div style={{ border: "1px solid #D8C4AA", borderRadius: 6, overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  padding: "6px 10px",
                  borderBottom: "1px solid #EFE8E0",
                  background: "#FAFAF8",
                  flexWrap: "wrap",
                }}
              >
                {["B", "I", "U", "S", "• List", "1. List", "Quote", "Code"].map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2D7CB",
                      borderRadius: 4,
                      cursor: "pointer",
                      padding: "2px 8px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#541A28",
                    }}
                    onClick={() => {
                      // Small text decoration prefix/suffix helper
                      if (tool === "B") set("description", `${form.description} **bold** `);
                      if (tool === "I") set("description", `${form.description} *italic* `);
                      if (tool === "• List") set("description", `${form.description}\n- Item 1\n- Item 2\n`);
                    }}
                  >
                    {tool}
                  </button>
                ))}
              </div>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Provide detailed description of fabric, design, embroidery, and styling tips..."
                style={{
                  width: "100%",
                  minHeight: 90,
                  padding: "10px 12px",
                  border: "none",
                  outline: "none",
                  resize: "vertical",
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </Field>
        </SectionCard>

        {/* ============================================================
            SECTION 2: Product Display Settings
           ============================================================ */}
        <SectionCard icon={<FiStar size={16} />} title="2. Product Display Settings" badge="Visibility">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 16,
            }}
          >
            {/* Featured Product */}
            <div
              style={{
                border: "1px solid #E2D7CB",
                borderRadius: 8,
                padding: "12px 16px",
                background: form.featured ? "#FFF8F2" : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderColor: form.featured ? "#EE5F2B" : "#E2D7CB",
                transition: "all 0.2s",
              }}
            >
              <div>
                <strong style={{ display: "block", fontSize: 13, color: "#2B1B20" }}>Featured Product</strong>
                <span style={{ fontSize: 11, color: "#6B5A51" }}>Showcase in Featured grid</span>
              </div>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "#EE5F2B" }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: form.featured ? "#EE5F2B" : "#9CA3AF" }}>
                  {form.featured ? "YES" : "NO"}
                </span>
              </label>
            </div>

            {/* New Arrival */}
            <div
              style={{
                border: "1px solid #E2D7CB",
                borderRadius: 8,
                padding: "12px 16px",
                background: form.isNewArrival ? "#F3FAF4" : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderColor: form.isNewArrival ? "#16A34A" : "#E2D7CB",
                transition: "all 0.2s",
              }}
            >
              <div>
                <strong style={{ display: "block", fontSize: 13, color: "#2B1B20" }}>New Arrival</strong>
                <span style={{ fontSize: 11, color: "#6B5A51" }}>Badge as New Collection</span>
              </div>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={form.isNewArrival}
                  onChange={(e) => set("isNewArrival", e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "#16A34A" }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: form.isNewArrival ? "#16A34A" : "#9CA3AF" }}>
                  {form.isNewArrival ? "YES" : "NO"}
                </span>
              </label>
            </div>

            {/* Best Seller */}
            <div
              style={{
                border: "1px solid #E2D7CB",
                borderRadius: 8,
                padding: "12px 16px",
                background: form.isBestSeller ? "#FAF6EE" : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderColor: form.isBestSeller ? "#C5A059" : "#E2D7CB",
                transition: "all 0.2s",
              }}
            >
              <div>
                <strong style={{ display: "block", fontSize: 13, color: "#2B1B20" }}>Best Seller</strong>
                <span style={{ fontSize: 11, color: "#6B5A51" }}>Top trending badge</span>
              </div>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={form.isBestSeller}
                  onChange={(e) => set("isBestSeller", e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "#C5A059" }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: form.isBestSeller ? "#C5A059" : "#9CA3AF" }}>
                  {form.isBestSeller ? "YES" : "NO"}
                </span>
              </label>
            </div>

            {/* Display Order */}
            <div
              style={{
                border: "1px solid #E2D7CB",
                borderRadius: 8,
                padding: "8px 16px",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <strong style={{ display: "block", fontSize: 13, color: "#2B1B20" }}>Display Order</strong>
                <span style={{ fontSize: 11, color: "#6B5A51" }}>Lower numbers appear first</span>
              </div>
              <input
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={(e) => set("displayOrder", e.target.value)}
                style={{
                  width: 70,
                  height: 34,
                  textAlign: "center",
                  borderRadius: 4,
                  border: "1px solid #D8C4AA",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              />
            </div>
          </div>
        </SectionCard>

        {/* ============================================================
            SECTION 3: Pricing and Stock
           ============================================================ */}
        <SectionCard icon={<FiDollarSign size={16} />} title="3. Pricing & Stock">
          {/* Product Type Toggle */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#2B1B20", display: "block", marginBottom: 8 }}>
              Product Type <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <div
              style={{
                display: "inline-flex",
                border: "1px solid #D8C4AA",
                borderRadius: 6,
                padding: 3,
                background: "#FAF6F0",
                gap: 4,
              }}
            >
              {(["Single Product", "Variable Product"] as ProductType[]).map((t) => {
                const isActive = form.productType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("productType", t)}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 4,
                      border: "none",
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      background: isActive ? "#541A28" : "transparent",
                      color: isActive ? "#FFFFFF" : "#541A28",
                      transition: "all 0.2s",
                    }}
                  >
                    {t === "Single Product" ? "Simple / Single Product" : "Variable Product (Sizes & Colours)"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing fields */}
          <div className="sc-form-grid-3" style={{ marginBottom: 16 }}>
            <Field label="MRP (Original Price ₹)" required error={errors.mrp} hint="Max retail price">
              <input
                type="number"
                min="0"
                step="any"
                value={form.mrp}
                onChange={(e) => set("mrp", e.target.value)}
                placeholder="200"
                style={{ borderColor: errors.mrp ? "#DC2626" : undefined }}
              />
            </Field>

            <Field label="Selling Price (₹)" required error={errors.sellingPrice} hint="Actual sale price">
              <input
                type="number"
                min="0"
                step="any"
                value={form.sellingPrice}
                onChange={(e) => set("sellingPrice", e.target.value)}
                placeholder="150"
                style={{ borderColor: errors.sellingPrice ? "#DC2626" : undefined }}
              />
            </Field>

            <Field label="Tax Rate">
              <SelectInput
                value={form.taxType}
                onChange={(v) => set("taxType", v)}
                options={["GST 5%", "GST 12%", "GST 18%", "GST 28%", "No Tax"]}
              />
            </Field>
          </div>

          <div className="sc-form-grid-3" style={{ marginBottom: 16 }}>
            <Field label="Discount Type">
              <SelectInput
                value={form.discountType}
                onChange={(v) => set("discountType", v as "Percentage" | "Fixed" | "None")}
                options={["Percentage", "Fixed", "None"]}
              />
            </Field>

            <Field label={`Discount Value (${form.discountType === "Percentage" ? "%" : "₹"})`}>
              <input
                type="number"
                min="0"
                value={form.discountValue}
                onChange={(e) => set("discountValue", e.target.value)}
                placeholder="0"
                disabled={form.discountType === "None"}
              />
            </Field>

            {/* Live Discount Calculation Summary */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "8px 14px",
                background: "#FAF6F0",
                borderRadius: 6,
                border: "1px solid #EFE8E0",
              }}
            >
              <span style={{ fontSize: 11, color: "#8C7A6B", fontWeight: 600 }}>PRICE CALCULATION</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: "#541A28" }}>
                  ₹{calculatedDiscountPrice !== null ? calculatedDiscountPrice.toFixed(2) : baseSellingNum.toFixed(2)}
                </span>
                {baseMrpNum > baseSellingNum && (
                  <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>
                    ₹{baseMrpNum}
                  </span>
                )}
                {discountPercentDisplay !== null && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A" }}>
                    ({discountPercentDisplay}% OFF)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Simple Product Stock Quantity */}
          {form.productType === "Single Product" && (
            <div className="sc-form-grid" style={{ marginBottom: 10 }}>
              <Field label="Stock Quantity" required error={errors.quantity}>
                <input
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) => set("quantity", e.target.value)}
                  placeholder="100"
                />
              </Field>

              <Field label="Low Stock Alert Threshold">
                <input
                  type="number"
                  min="0"
                  value={form.quantityAlert}
                  onChange={(e) => set("quantityAlert", e.target.value)}
                  placeholder="5"
                />
              </Field>
            </div>
          )}

          {form.productType === "Variable Product" && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 6,
                backgroundColor: "#FFF8F2",
                border: "1px solid #FED7AA",
                fontSize: 12,
                color: "#9A3412",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FiInfo size={16} />
              <span>
                For Variable Products, inventory and individual prices are managed per variant in the section below.
                Total stock will automatically sum all active variants.
              </span>
            </div>
          )}
        </SectionCard>

        {/* ============================================================
            SECTION 4: Variant Attributes (Dynamic Variable Products)
           ============================================================ */}
        {form.productType === "Variable Product" && (
          <SectionCard
            icon={<FiLayers size={16} />}
            title="4. Variant Attributes & Combination Generator"
            badge={`${variants.length} Variants Generated`}
          >
            {/* Attribute 1: Sizes */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#2B1B20", display: "block", marginBottom: 6 }}>
                Select Sizes <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                {PRESET_SIZES.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: isSelected ? "1.5px solid #541A28" : "1px solid #D8C4AA",
                        background: isSelected ? "#F1E6D6" : "#FFFFFF",
                        color: isSelected ? "#541A28" : "#4B5563",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {sz} {isSelected && "✓"}
                    </button>
                  );
                })}

                {/* Custom size input */}
                <div style={{ display: "flex", gap: 4 }}>
                  <input
                    type="text"
                    placeholder="Custom size..."
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomSize();
                      }
                    }}
                    style={{
                      height: 32,
                      width: 110,
                      padding: "0 8px",
                      borderRadius: 4,
                      border: "1px solid #D8C4AA",
                      fontSize: 12,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    style={{
                      height: 32,
                      padding: "0 10px",
                      borderRadius: 4,
                      border: "none",
                      background: "#541A28",
                      color: "#FFFFFF",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Attribute 2: Colours */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#2B1B20", display: "block", marginBottom: 6 }}>
                Select Colours <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                {PRESET_COLOURS.map((col) => {
                  const isSelected = selectedColours.includes(col.name);
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => toggleColour(col.name)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: isSelected ? "1.5px solid #EE5F2B" : "1px solid #D8C4AA",
                        background: isSelected ? "#FFF7ED" : "#FFFFFF",
                        color: isSelected ? "#9A3412" : "#4B5563",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          backgroundColor: col.hex,
                          border: col.border ? "1px solid #9CA3AF" : "none",
                          display: "inline-block",
                        }}
                      />
                      <span>{col.name}</span>
                      {isSelected && <span style={{ color: "#EE5F2B" }}>✓</span>}
                    </button>
                  );
                })}

                {/* Custom colour input */}
                <div style={{ display: "flex", gap: 4 }}>
                  <input
                    type="text"
                    placeholder="Custom colour..."
                    value={customColourInput}
                    onChange={(e) => setCustomColourInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomColour();
                      }
                    }}
                    style={{
                      height: 32,
                      width: 120,
                      padding: "0 8px",
                      borderRadius: 4,
                      border: "1px solid #D8C4AA",
                      fontSize: 12,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColour}
                    style={{
                      height: 32,
                      padding: "0 10px",
                      borderRadius: 4,
                      border: "none",
                      background: "#EE5F2B",
                      color: "#FFFFFF",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Error banner if variants validation failed */}
            {errors.variants && (
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: "#FEE2E2",
                  color: "#B91C1C",
                  fontSize: 12,
                  marginBottom: 14,
                  fontWeight: 600,
                }}
              >
                ⚠️ {errors.variants}
              </div>
            )}

            {/* Generated Variants Table */}
            {variants.length > 0 ? (
              <div style={{ overflowX: "auto", border: "1px solid #E2D7CB", borderRadius: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#FAF6F0", borderBottom: "1px solid #E2D7CB", textAlign: "left" }}>
                      <th style={{ padding: "10px 12px", color: "#541A28", fontWeight: 700 }}>Active</th>
                      <th style={{ padding: "10px 12px", color: "#541A28", fontWeight: 700 }}>Variant</th>
                      <th style={{ padding: "10px 12px", color: "#541A28", fontWeight: 700 }}>Variant SKU *</th>
                      <th style={{ padding: "10px 12px", color: "#541A28", fontWeight: 700 }}>MRP (₹)</th>
                      <th style={{ padding: "10px 12px", color: "#541A28", fontWeight: 700 }}>Selling (₹) *</th>
                      <th style={{ padding: "10px 12px", color: "#541A28", fontWeight: 700 }}>Stock Qty</th>
                      <th style={{ padding: "10px 12px", color: "#541A28", fontWeight: 700 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v) => (
                      <tr
                        key={v.key}
                        style={{
                          borderBottom: "1px solid #F3ECE2",
                          background: v.isActive ? "#FFFFFF" : "#F9FAFB",
                          opacity: v.isActive ? 1 : 0.6,
                        }}
                      >
                        {/* Status Checkbox */}
                        <td style={{ padding: "8px 12px" }}>
                          <input
                            type="checkbox"
                            checked={v.isActive}
                            onChange={(e) => updateVariantRow(v.key, "isActive", e.target.checked)}
                            style={{ accentColor: "#541A28", cursor: "pointer", width: 16, height: 16 }}
                          />
                        </td>

                        {/* Variant label */}
                        <td style={{ padding: "8px 12px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 8px",
                              borderRadius: 4,
                              background: "#FAF0E6",
                              color: "#541A28",
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            {v.colour} / {v.size}
                          </span>
                        </td>

                        {/* SKU */}
                        <td style={{ padding: "8px 12px" }}>
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => updateVariantRow(v.key, "sku", e.target.value)}
                            style={{
                              height: 30,
                              padding: "0 8px",
                              borderRadius: 4,
                              border: "1px solid #D8C4AA",
                              width: 140,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          />
                        </td>

                        {/* MRP */}
                        <td style={{ padding: "8px 12px" }}>
                          <input
                            type="number"
                            min="0"
                            value={v.mrp}
                            onChange={(e) => updateVariantRow(v.key, "mrp", e.target.value)}
                            style={{
                              height: 30,
                              padding: "0 8px",
                              borderRadius: 4,
                              border: "1px solid #D8C4AA",
                              width: 80,
                              fontSize: 12,
                            }}
                          />
                        </td>

                        {/* Selling Price */}
                        <td style={{ padding: "8px 12px" }}>
                          <input
                            type="number"
                            min="0"
                            value={v.sellingPrice}
                            onChange={(e) => updateVariantRow(v.key, "sellingPrice", e.target.value)}
                            style={{
                              height: 30,
                              padding: "0 8px",
                              borderRadius: 4,
                              border: "1px solid #D8C4AA",
                              width: 80,
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#541A28",
                            }}
                          />
                        </td>

                        {/* Stock */}
                        <td style={{ padding: "8px 12px" }}>
                          <input
                            type="number"
                            min="0"
                            value={v.stock}
                            onChange={(e) => updateVariantRow(v.key, "stock", e.target.value)}
                            style={{
                              height: 30,
                              padding: "0 8px",
                              borderRadius: 4,
                              border: "1px solid #D8C4AA",
                              width: 70,
                              fontSize: 12,
                            }}
                          />
                        </td>

                        {/* Delete single combination */}
                        <td style={{ padding: "8px 12px" }}>
                          <button
                            type="button"
                            onClick={() => removeVariantRow(v.key)}
                            title="Remove this combination"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#DC2626",
                              padding: 4,
                            }}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                style={{
                  padding: "24px",
                  textAlign: "center",
                  background: "#FAF6F0",
                  borderRadius: 8,
                  color: "#6B5A51",
                  fontSize: 13,
                }}
              >
                Select at least one Size and one Colour above to generate combinations.
              </div>
            )}
          </SectionCard>
        )}

        {/* ============================================================
            SECTION 5: Variant-Specific Image Management (Per-Colour)
           ============================================================ */}
        {form.productType === "Variable Product" && selectedColours.length > 0 && (
          <SectionCard
            icon={<FiImage size={16} />}
            title="5. Variant-Specific Image Management (Per-Colour Galleries)"
            badge="Essential"
          >
            <p style={{ fontSize: 12, color: "#6B5A51", marginBottom: 16 }}>
              Upload specific photos for each colour. When a customer selects that colour on the website, only these
              matching images will be displayed.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {colourImages.map((group) => (
                <div
                  key={group.colour}
                  style={{
                    border: "1px solid #E2D7CB",
                    borderRadius: 8,
                    padding: 16,
                    background: "#FDFAF5",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          backgroundColor:
                            PRESET_COLOURS.find((c) => c.name === group.colour)?.hex || "#541A28",
                          border: "1px solid #D8C4AA",
                          display: "inline-block",
                        }}
                      />
                      <strong style={{ fontSize: 14, color: "#541A28" }}>{group.colour}</strong>
                      <span style={{ fontSize: 11, color: "#8C7A6B" }}>
                        ({group.images.length} {group.images.length === 1 ? "image" : "images"})
                      </span>
                    </div>

                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        borderRadius: 4,
                        border: "1px solid #541A28",
                        background: "#541A28",
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: uploadingColour === group.colour ? "wait" : "pointer",
                      }}
                    >
                      <FiUploadCloud size={14} />
                      <span>{uploadingColour === group.colour ? "Uploading..." : `Add ${group.colour} Photos`}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingColour === group.colour}
                        style={{ display: "none" }}
                        onChange={(e) => handleColourImageUpload(group.colour, e)}
                      />
                    </label>
                  </div>

                  {/* Thumbnail Row */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    {group.images.map((imgUrl, i) => {
                      const isPrimary = group.primaryImage === imgUrl;
                      return (
                        <div
                          key={i}
                          style={{
                            position: "relative",
                            width: 90,
                            height: 90,
                            borderRadius: 6,
                            overflow: "hidden",
                            border: isPrimary ? "2.5px solid #EE5F2B" : "1px solid #D8C4AA",
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />

                          {/* Primary Badge */}
                          {isPrimary && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                insetInline: 0,
                                background: "rgba(238, 95, 43, 0.9)",
                                color: "#FFFFFF",
                                fontSize: 9,
                                fontWeight: 800,
                                textAlign: "center",
                                padding: "2px 0",
                                textTransform: "uppercase",
                              }}
                            >
                              Primary
                            </div>
                          )}

                          {/* Action Buttons Overlay */}
                          <div
                            style={{
                              position: "absolute",
                              top: 3,
                              right: 3,
                              display: "flex",
                              gap: 3,
                            }}
                          >
                            {!isPrimary && (
                              <button
                                type="button"
                                title="Set as primary for this colour"
                                onClick={() => setPrimaryColourImage(group.colour, imgUrl)}
                                style={{
                                  background: "#FFFFFF",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: 20,
                                  height: 20,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                }}
                              >
                                <FiStar size={11} color="#C5A059" />
                              </button>
                            )}

                            <button
                              type="button"
                              title="Delete photo"
                              onClick={() => removeColourImage(group.colour, imgUrl)}
                              style={{
                                background: "#DC2626",
                                border: "none",
                                borderRadius: "50%",
                                width: 20,
                                height: 20,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              }}
                            >
                              <FiX size={11} color="#FFFFFF" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {group.images.length === 0 && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#9CA3AF",
                          padding: "16px 0",
                          fontStyle: "italic",
                        }}
                      >
                        No images uploaded yet for {group.colour}. Click &quot;Add {group.colour} Photos&quot; to upload.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ============================================================
            SECTION 6: Overall Product Gallery
           ============================================================ */}
        <SectionCard icon={<FiImage size={16} />} title="6. Overall Product Gallery">
          <p style={{ fontSize: 12, color: "#6B5A51", marginBottom: 14 }}>
            Upload general product images. Click the star icon on any image to mark it as the Main / Featured Image.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {images.map((src, i) => {
              const isMain = featuredImage === src;
              return (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    width: 90,
                    height: 90,
                    borderRadius: 6,
                    overflow: "hidden",
                    border: isMain ? "2.5px solid #EE5F2B" : "1px solid #E2D7CB",
                    backgroundColor: "#FAF6F0",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                  {isMain && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        insetInline: 0,
                        background: "rgba(238, 95, 43, 0.95)",
                        color: "#FFFFFF",
                        fontSize: 9,
                        fontWeight: 800,
                        textAlign: "center",
                        padding: "2px 0",
                        textTransform: "uppercase",
                      }}
                    >
                      Featured
                    </div>
                  )}

                  {/* Overlay buttons */}
                  <div style={{ position: "absolute", top: 3, right: 3, display: "flex", gap: 4 }}>
                    {!isMain && (
                      <button
                        type="button"
                        title="Set as featured main image"
                        onClick={() => setFeaturedImage(src)}
                        style={{
                          background: "#FFFFFF",
                          border: "none",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      >
                        <FiStar size={11} color="#C5A059" />
                      </button>
                    )}

                    <button
                      type="button"
                      title="Remove image"
                      onClick={() => {
                        const remaining = images.filter((_, j) => j !== i);
                        setImages(remaining);
                        if (isMain) setFeaturedImage(remaining[0] || "");
                      }}
                      style={{
                        background: "#DC2626",
                        border: "none",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiX size={11} color="#fff" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Upload Box */}
            <label
              className="sc-upload-box"
              style={{
                cursor: uploadingGallery ? "wait" : "pointer",
                opacity: uploadingGallery ? 0.6 : 1,
                width: 90,
                height: 90,
              }}
            >
              <FiUploadCloud size={20} style={{ color: "#541A28" }} />
              <span style={{ fontSize: 11, fontWeight: 600 }}>
                {uploadingGallery ? "Uploading..." : "Add Images"}
              </span>
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

        {/* ============================================================
            SECTION 7: Product Details & Additional Information
           ============================================================ */}
        <SectionCard icon={<FiInfo size={16} />} title="7. Product Details & Additional Specifications">
          <div className="sc-form-grid" style={{ marginBottom: 16 }}>
            <Field label="Fabric & Material Composition">
              <input
                value={form.fabric}
                onChange={(e) => set("fabric", e.target.value)}
                placeholder="e.g. 100% Pure Mulberry Silk with Zari Border"
              />
            </Field>

            <Field label="Care Instructions">
              <input
                value={form.careInstructions}
                onChange={(e) => set("careInstructions", e.target.value)}
                placeholder="e.g. Dry Clean Only / Gentle Hand Wash"
              />
            </Field>
          </div>

          <div className="sc-form-grid" style={{ marginBottom: 16 }}>
            <Field label="Product Specifications">
              <input
                value={form.specifications}
                onChange={(e) => set("specifications", e.target.value)}
                placeholder="e.g. Length: 6.3m (including 0.8m blouse piece)"
              />
            </Field>

            <Field label="Shipping & Dispatch Details">
              <input
                value={form.shippingInfo}
                onChange={(e) => set("shippingInfo", e.target.value)}
                placeholder="e.g. Ships in 2-3 business days across India"
              />
            </Field>
          </div>

          <div className="sc-form-grid-3" style={{ marginBottom: 16 }}>
            <Field label="Return & Exchange Policy">
              <input
                value={form.returnPolicy}
                onChange={(e) => set("returnPolicy", e.target.value)}
                placeholder="e.g. 7-Day Hassle-Free Exchange"
              />
            </Field>

            <Field label="Weight & Dimensions">
              <input
                value={form.dimensions}
                onChange={(e) => set("dimensions", e.target.value)}
                placeholder="e.g. 600g (30x20x5 cm)"
              />
            </Field>

            <Field label="Tags & Search Keywords" hint="Comma-separated">
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="e.g. silk, saree, festive, bridal"
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Action Buttons ── */}
        <div className="sc-form-actions" style={{ marginTop: 24, paddingBottom: 40 }}>
          <Link href="/" className="sc-btn-cancel">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="sc-btn-submit"
            style={{
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
              padding: "0 28px",
              height: 40,
              fontSize: 14,
            }}
          >
            {submitting ? "Saving to Database..." : "Publish Product"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
