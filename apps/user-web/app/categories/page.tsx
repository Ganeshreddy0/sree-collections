"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCheckCircle,
  FiShoppingBag,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { FaFacebookF, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api";

interface Product {
  id: string;
  name: string;
  price: string;
  rawPrice: number;
  mrp: number;
  image: string;
  category: string;
  isTall: boolean;
  colours: string[];
  featured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  discountLabel: string;
  productType: string;
}

const SORT_OPTIONS = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "New Arrivals",
];

const DEFAULT_PRICE_BUCKETS = [
  { label: "All Prices" },
  { label: "Under ₹2,000" },
  { label: "₹2,000 - ₹5,000" },
  { label: "Above ₹5,000" },
];

const COLOUR_HEX: Record<string, string> = {
  maroon: "#800000",
  red: "#C0392B",
  green: "#1E7B34",
  blue: "#1F4E79",
  navy: "#1B2A4A",
  black: "#1A1A1A",
  white: "#F5F5F5",
  cream: "#F5E6C8",
  gold: "#C9A227",
  yellow: "#E1B12C",
  pink: "#D46A8C",
  purple: "#6C3483",
  orange: "#E67E22",
  brown: "#6B3E26",
  grey: "#7F8C8D",
  gray: "#7F8C8D",
  beige: "#D4C4A8",
};

function colourToHex(name: string): string {
  const key = name.toLowerCase().trim();
  if (COLOUR_HEX[key]) return COLOUR_HEX[key];
  for (const [k, hex] of Object.entries(COLOUR_HEX)) {
    if (key.includes(k)) return hex;
  }
  return "#BB8E43";
}

function formatInr(amount: number): string {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function readUrlFilters() {
  if (typeof window === "undefined") {
    return {
      category: "All Products",
      size: "",
      colour: "",
      brand: "",
      fabric: "",
      subCategory: "",
      prices: ["All Prices"] as string[],
      sort: "Featured",
      search: "",
      inStock: false,
    };
  }
  const sp = new URLSearchParams(window.location.search);
  const prices = sp.get("price");
  return {
    category: sp.get("category") || "All Products",
    size: sp.get("size") || "",
    colour: sp.get("colour") || "",
    brand: sp.get("brand") || "",
    fabric: sp.get("fabric") || "",
    subCategory: sp.get("subCategory") || "",
    prices: prices ? prices.split(";").filter(Boolean) : ["All Prices"],
    sort: sp.get("sort") || "Featured",
    search: sp.get("search") || "",
    inStock: sp.get("inStock") === "true",
  };
}

function writeUrlFilters(state: {
  category: string;
  size: string;
  colour: string;
  brand: string;
  fabric: string;
  subCategory: string;
  prices: string[];
  sort: string;
  search: string;
  inStock: boolean;
}) {
  if (typeof window === "undefined") return;
  const sp = new URLSearchParams();
  if (state.category && state.category !== "All Products") {
    sp.set("category", state.category);
  }
  if (state.subCategory) sp.set("subCategory", state.subCategory);
  if (state.size) sp.set("size", state.size);
  if (state.colour) sp.set("colour", state.colour);
  if (state.brand) sp.set("brand", state.brand);
  if (state.fabric) sp.set("fabric", state.fabric);
  if (state.prices.length && !state.prices.includes("All Prices")) {
    sp.set("price", state.prices.join(";"));
  }
  if (state.sort && state.sort !== "Featured") sp.set("sort", state.sort);
  if (state.search.trim()) sp.set("search", state.search.trim());
  if (state.inStock) sp.set("inStock", "true");
  const qs = sp.toString();
  const next = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, "", next);
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "17px",
        fontWeight: 700,
        color: "#5A2035",
        textDecoration: "none",
        lineHeight: 1.2,
        paddingBottom: active ? "3px" : undefined,
        borderBottom: active ? "2.5px solid #5A2035" : undefined,
        transition: "opacity 0.2s",
      }}
      className="cat-nav-link"
    >
      {children}
    </a>
  );
}

function ProductCard({
  product,
  qty,
  onQtyChange,
}: {
  product: Product;
  qty: number;
  onQtyChange: (delta: number) => void;
}) {
  const imgHeight = product.isTall ? 572 : 230;
  const productUrl = `/products/${product.id}`;
  const showMrp = product.mrp > 0 && product.mrp > product.rawPrice;

  return (
    <div
      className="cat-card-wrap"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest("button") && !target.closest("a")) {
          window.location.href = productUrl;
        }
      }}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: qty > 0 ? "1.5px solid #BB8E43" : "1.5px solid #E3D7C5",
        padding: "12px",
        boxSizing: "border-box",
        position: "relative",
        cursor: "pointer",
        transition: "border-color 0.2s ease",
      }}
    >
      {(product.featured || product.isNewArrival || product.discountLabel) && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {product.discountLabel && (
            <span
              style={{
                backgroundColor: "#5D2030",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: 999,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {product.discountLabel}
            </span>
          )}
          {product.isNewArrival && (
            <span
              style={{
                backgroundColor: "#BB8E43",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: 999,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              New
            </span>
          )}
          {product.featured && !product.isNewArrival && (
            <span
              style={{
                backgroundColor: "#BB8E43",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: 999,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Featured
            </span>
          )}
        </div>
      )}

      <a
        href={productUrl}
        style={{
          display: "block",
          width: "100%",
          height: `${imgHeight}px`,
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#F5EFE5",
          cursor: "pointer",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/Categories/product_formal_shirt.jpg";
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.3s ease",
          }}
        />
      </a>

      <div style={{ padding: "10px 2px 2px 2px" }}>
        <h3
          style={{
            fontFamily: "'Blacker Display', 'Playfair Display', Georgia, serif",
            fontWeight: 600,
            fontSize: "17px",
            lineHeight: "22px",
            height: "22px",
            color: "#5D2030",
            margin: "0 0 6px 0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <a href={productUrl} style={{ color: "inherit", textDecoration: "none" }}>
            {product.name}
          </a>
        </h3>

        {product.colours.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            {product.colours.slice(0, 5).map((c) => (
              <span
                key={c}
                title={c}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: colourToHex(c),
                  border: "1px solid #E3D7C5",
                  display: "inline-block",
                }}
              />
            ))}
            {product.colours.length > 5 && (
              <span
                style={{
                  fontSize: 11,
                  color: "#8A7B6F",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                +{product.colours.length - 5}
              </span>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "13px",
                color: "#5D2030",
                fontWeight: 400,
              }}
            >
              Price:
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: "15px",
                color: "#5D2030",
              }}
            >
              {product.price}
            </span>
            {showMrp && (
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "12px",
                  color: "#8A7B6F",
                  textDecoration: "line-through",
                }}
              >
                {formatInr(product.mrp)}
              </span>
            )}
          </div>

          {/* Cart action: only cart icon when qty === 0; stepper (- count +) when qty > 0 */}
          {qty === 0 ? (
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              className="cat-cart-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                onQtyChange(1);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "1.5px solid #BB8E43",
                color: "#BB8E43",
                cursor: "pointer",
                transition: "all 0.2s ease",
                padding: 0,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#BB8E43";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#BB8E43";
              }}
            >
              <FiShoppingCart size={17} />
            </button>
          ) : (
            <div
              className="cat-qty-stepper"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#BB8E43",
                borderRadius: "999px",
                padding: "4px 8px",
                boxShadow: "0 2px 8px rgba(187, 142, 67, 0.25)",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={(e) => {
                  e.stopPropagation();
                  onQtyChange(-1);
                }}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <FiMinus size={13} strokeWidth={2.5} />
              </button>

              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#FFFFFF",
                  minWidth: "18px",
                  textAlign: "center",
                  userSelect: "none",
                  lineHeight: 1,
                }}
              >
                {qty}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={(e) => {
                  e.stopPropagation();
                  onQtyChange(1);
                }}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <FiPlus size={13} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      onClick={onChange}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "3px",
          border: checked ? "1.5px solid #BB8E43" : "1.5px solid #99887C",
          backgroundColor: checked ? "#BB8E43" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.8 7L9 1"
              stroke="#FFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 500,
          fontSize: "16px",
          color: "#5D2030",
        }}
      >
        {label}
      </span>
    </label>
  );
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "'Playfair Display', 'Blacker Display', Georgia, serif",
        fontWeight: 700,
        fontSize: "30px",
        lineHeight: "100%",
        color: "#5D2030",
        margin: "0 0 20px 0",
      }}
    >
      {children}
    </h2>
  );
}

export default function CategoriesPage() {
  const initial = readUrlFilters();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initial.category);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initial.subCategory);
  const [selectedSize, setSelectedSize] = useState(initial.size);
  const [selectedColour, setSelectedColour] = useState(initial.colour);
  const [selectedBrand, setSelectedBrand] = useState(initial.brand);
  const [selectedFabric, setSelectedFabric] = useState(initial.fabric);
  const [inStockOnly, setInStockOnly] = useState(initial.inStock);
  const [checkedPrices, setCheckedPrices] = useState<string[]>(initial.prices);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState(initial.sort);
  const [searchOpen, setSearchOpen] = useState(Boolean(initial.search));
  const [searchQuery, setSearchQuery] = useState(initial.search);
  const [searchInput, setSearchInput] = useState(initial.search);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartMap, setCartMap] = useState<Record<string, { product: Product; quantity: number }>>({});
  const [cartCount, setCartCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState<string[]>(["All Products"]);
  const [subCategoriesList, setSubCategoriesList] = useState<string[]>([]);
  const [sizesList, setSizesList] = useState<string[]>([]);
  const [coloursList, setColoursList] = useState<string[]>([]);
  const [brandsList, setBrandsList] = useState<string[]>([]);
  const [fabricsList, setFabricsList] = useState<string[]>([]);
  const [priceBuckets, setPriceBuckets] = useState(DEFAULT_PRICE_BUCKETS);

  const syncUrl = useCallback(() => {
    writeUrlFilters({
      category: selectedCategory,
      size: selectedSize,
      colour: selectedColour,
      brand: selectedBrand,
      fabric: selectedFabric,
      subCategory: selectedSubCategory,
      prices: checkedPrices,
      sort: sortBy,
      search: searchQuery,
      inStock: inStockOnly,
    });
  }, [
    selectedCategory,
    selectedSize,
    selectedColour,
    selectedBrand,
    selectedFabric,
    selectedSubCategory,
    checkedPrices,
    sortBy,
    searchQuery,
    inStockOnly,
  ]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  // 1. Fetch filter facets + active categories
  useEffect(() => {
    let isMounted = true;
    async function fetchFilters() {
      try {
        const [filtersRes, catsRes, subRes] = await Promise.all([
          fetch(`${API_BASE}/products/filters`),
          fetch(`${API_BASE}/categories?status=Active`),
          fetch(`${API_BASE}/sub-categories?status=Active`),
        ]);

        const filtersJson = filtersRes.ok ? await filtersRes.json() : null;
        const catsJson = catsRes.ok ? await catsRes.json() : null;
        const subJson = subRes.ok ? await subRes.json() : null;

        if (!isMounted) return;

        const facetData = filtersJson?.data || filtersJson || {};
        const facetCategories: { name: string }[] = Array.isArray(facetData.categories)
          ? facetData.categories
          : Array.isArray(filtersJson?.categories)
            ? filtersJson.categories
            : [];

        const adminCats: string[] = Array.isArray(catsJson?.data)
          ? catsJson.data.map((c: any) => c.name).filter(Boolean)
          : [];

        const mergedCats = Array.from(
          new Set([
            "All Products",
            ...adminCats,
            ...facetCategories.map((c) => c.name).filter(Boolean),
          ])
        );
        setCategoriesList(mergedCats);

        if (Array.isArray(facetData.sizes) && facetData.sizes.length > 0) {
          setSizesList(facetData.sizes);
        } else if (Array.isArray(filtersJson?.sizes)) {
          setSizesList(filtersJson.sizes);
        }

        if (Array.isArray(facetData.colours)) setColoursList(facetData.colours);
        if (Array.isArray(facetData.brands)) setBrandsList(facetData.brands);
        if (Array.isArray(facetData.fabrics)) setFabricsList(facetData.fabrics);

        if (Array.isArray(facetData.priceBuckets) && facetData.priceBuckets.length > 0) {
          setPriceBuckets(
            facetData.priceBuckets.map((b: { label: string }) => ({ label: b.label }))
          );
        }

        if (Array.isArray(subJson?.data)) {
          setSubCategoriesList(
            subJson.data.map((s: any) => s.name).filter(Boolean)
          );
        } else if (Array.isArray(facetData.subCategories)) {
          setSubCategoriesList(facetData.subCategories);
        }
      } catch {
        // Keep empty dynamic lists; products fetch still works
      }
    }
    fetchFilters();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter subcategories for the selected category
  useEffect(() => {
    let isMounted = true;
    async function loadSubs() {
      if (!selectedCategory || selectedCategory === "All Products") {
        try {
          const res = await fetch(`${API_BASE}/sub-categories?status=Active`);
          const json = await res.json();
          if (isMounted && json.success) {
            setSubCategoriesList(
              (json.data || []).map((s: any) => s.name).filter(Boolean)
            );
          }
        } catch {
          /* ignore */
        }
        return;
      }
      try {
        const res = await fetch(
          `${API_BASE}/sub-categories?status=Active&category=${encodeURIComponent(selectedCategory)}`
        );
        const json = await res.json();
        if (isMounted && json.success) {
          setSubCategoriesList(
            (json.data || []).map((s: any) => s.name).filter(Boolean)
          );
        }
      } catch {
        /* ignore */
      }
    }
    loadSubs();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  // 2. Fetch products whenever filters or search change
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setLoading(true);
      setFetchError(null);
      try {
        const params = new URLSearchParams();
        params.append("status", "Active");
        params.append("limit", "100");
        if (selectedCategory && selectedCategory !== "All Products") {
          params.append("category", selectedCategory);
        }
        if (selectedSubCategory) params.append("subCategory", selectedSubCategory);
        if (selectedSize) params.append("size", selectedSize);
        if (selectedColour) params.append("colour", selectedColour);
        if (selectedBrand) params.append("brand", selectedBrand);
        if (selectedFabric) params.append("fabric", selectedFabric);
        if (inStockOnly) params.append("inStock", "true");
        if (checkedPrices.length > 0 && !checkedPrices.includes("All Prices")) {
          params.append("priceRange", checkedPrices.join(";"));
        }
        if (sortBy) params.append("sort", sortBy);
        if (searchQuery.trim()) params.append("search", searchQuery.trim());

        const res = await fetch(`${API_BASE}/products?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (isMounted) {
          const rawItems = json.data || json.products || [];
          const mapped: Product[] = rawItems.map((p: any, idx: number) => {
            const selling =
              Number(p.sellingPrice) ||
              Number(p.rawPrice) ||
              (typeof p.price === "number" ? p.price : 0) ||
              0;
            const mrp = Number(p.mrp) || 0;
            let discountLabel = "";
            if (mrp > selling && selling > 0) {
              const pct = Math.round(((mrp - selling) / mrp) * 100);
              if (pct > 0) discountLabel = `${pct}% OFF`;
            } else if (p.discountType === "Percentage" && Number(p.discountValue) > 0) {
              discountLabel = `${Number(p.discountValue)}% OFF`;
            }

            const colours: string[] = Array.isArray(p.selectedColours)
              ? p.selectedColours.filter(Boolean)
              : Array.isArray(p.colourImages)
                ? p.colourImages.map((c: any) => c.colour).filter(Boolean)
                : p.attributes?.colour
                  ? [p.attributes.colour]
                  : [];

            const img =
              p.featuredImage ||
              p.image ||
              p.img ||
              (Array.isArray(p.images) && p.images[0]) ||
              "/Categories/product_formal_shirt.jpg";

            return {
              id: String(p.id || p._id || `item_${idx}`),
              name: p.productName || p.name || p.title || "Product",
              price: formatInr(selling),
              rawPrice: selling,
              mrp,
              image: img,
              category: p.categoryName || p.category || "General",
              isTall: false,
              colours,
              featured: Boolean(p.featured),
              isNewArrival: p.isNewArrival !== false && Boolean(p.isNewArrival),
              isBestSeller: Boolean(p.isBestSeller),
              discountLabel,
              productType: p.productType || "Single Product",
            };
          });

          setProducts(mapped);
          setTotalCount(json.total !== undefined ? json.total : mapped.length);
        }
      } catch (err) {
        console.error("Error loading products from backend:", err);
        if (isMounted) {
          setFetchError("Unable to load products. Please check your connection and try again.");
          setProducts([]);
          setTotalCount(0);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedSize,
    selectedColour,
    selectedBrand,
    selectedFabric,
    inStockOnly,
    checkedPrices,
    sortBy,
    searchQuery,
    reloadKey,
  ]);

  // Load cart from localStorage on mount (supports both Array and Object format)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sree_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        const map: Record<string, { product: Product; quantity: number }> = {};
        if (Array.isArray(parsed)) {
          parsed.forEach((item: any) => {
            const pid = item.productId || item.id || item._id;
            if (pid) {
              const qty = item.quantity || item.qty || 1;
              const numericPrice =
                typeof item.price === "number"
                  ? item.price
                  : parseFloat(String(item.price || "0").replace(/[^0-9.]/g, "")) || 0;
              map[pid] = {
                product: {
                  id: pid,
                  name: item.name || item.title || "Product",
                  price: formatInr(numericPrice),
                  rawPrice: numericPrice,
                  mrp: Number(item.mrp) || 0,
                  image: item.image || "/Categories/product_formal_shirt.jpg",
                  category: item.category || "General",
                  isTall: false,
                  colours: item.colour ? [item.colour] : [],
                  featured: false,
                  isNewArrival: false,
                  isBestSeller: false,
                  discountLabel: "",
                  productType: "Single Product",
                },
                quantity: qty,
              };
            }
          });
        } else if (typeof parsed === "object" && parsed !== null) {
          Object.entries(parsed).forEach(([key, val]: [string, any]) => {
            const qty = val.quantity || val.qty || 1;
            map[key] = { product: val, quantity: qty };
          });
        }
        setCartMap(map);
        const total = Object.values(map).reduce((sum, i) => sum + i.quantity, 0);
        setCartCount(total);
      }
    } catch (e) {
      console.error("Failed to parse cart on mount:", e);
    }
  }, []);

  const handleQtyChange = (product: Product, delta: number) => {
    // Variable products need colour/size selection on the PDP
    if (
      product.productType === "Variable Product" &&
      delta > 0 &&
      !(cartMap[product.id]?.quantity)
    ) {
      setToastMessage("Select colour & size on the product page");
      setTimeout(() => setToastMessage(null), 2200);
      window.setTimeout(() => {
        window.location.href = `/products/${product.id}`;
      }, 400);
      return;
    }

    setCartMap((prev) => {
      const current = prev[product.id];
      const currentQty = current ? current.quantity : 0;
      const newQty = currentQty + delta;
      const updated = { ...prev };

      if (newQty <= 0) {
        delete updated[product.id];
      } else {
        updated[product.id] = { product, quantity: newQty };
      }

      const cartArray = Object.values(updated).map((entry) => ({
        productId: entry.product.id,
        id: entry.product.id,
        name: entry.product.name,
        price: entry.product.rawPrice || 0,
        quantity: entry.quantity,
        image: entry.product.image,
        category: entry.product.category,
        variantId: null,
        colour: "",
        size: "",
      }));

      try {
        localStorage.setItem("sree_cart", JSON.stringify(cartArray));
      } catch {
        /* ignore */
      }

      const total = Object.values(updated).reduce((s, i) => s + i.quantity, 0);
      setCartCount(total);

      if (currentQty === 0 && delta > 0) {
        setToastMessage(`"${product.name}" added to cart!`);
        setTimeout(() => setToastMessage(null), 2500);
      }

      return updated;
    });
  };

  const clearAllFilters = () => {
    setSelectedCategory("All Products");
    setSelectedSubCategory("");
    setSelectedSize("");
    setSelectedColour("");
    setSelectedBrand("");
    setSelectedFabric("");
    setInStockOnly(false);
    setCheckedPrices(["All Prices"]);
    setSearchQuery("");
    setSearchInput("");
    setSortBy("Featured");
  };

  const hasActiveFilters =
    selectedCategory !== "All Products" ||
    Boolean(selectedSubCategory) ||
    Boolean(selectedSize) ||
    Boolean(selectedColour) ||
    Boolean(selectedBrand) ||
    Boolean(selectedFabric) ||
    inStockOnly ||
    !checkedPrices.includes("All Prices") ||
    Boolean(searchQuery.trim());

  const togglePrice = (label: string) => {
    if (label === "All Prices") {
      setCheckedPrices(["All Prices"]);
      return;
    }
    const withoutAll = checkedPrices.filter((l) => l !== "All Prices");
    const next = withoutAll.includes(label)
      ? withoutAll.filter((l) => l !== label)
      : [...withoutAll, label];
    setCheckedPrices(next.length === 0 ? ["All Prices"] : next);
  };

  // Distribute products into 3 columns following the alternating tall/short masonry rhythm
  const col1: Product[] = [];
  const col2: Product[] = [];
  const col3: Product[] = [];

  products.forEach((p, idx) => {
    const col = idx % 3;
    if (col === 0) {
      const i = col1.length;
      col1.push({ ...p, isTall: i % 3 === 2 });
    } else if (col === 1) {
      const i = col2.length;
      col2.push({ ...p, isTall: i % 3 === 0 });
    } else {
      const i = col3.length;
      col3.push({ ...p, isTall: i % 3 === 1 });
    }
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF6EE",
        overflowX: "hidden",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            backgroundColor: "#5D2030",
            color: "#FFFFFF",
            padding: "14px 22px",
            borderRadius: "12px",
            border: "1.5px solid #BB8E43",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "15px",
            fontWeight: 600,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FiCheckCircle size={18} color="#BB8E43" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 50,
        }}
      >
        <a href="/" style={{ display: "inline-block", flexShrink: 0 }}>
          <img
            src="/homepage/logo2_trans.png"
            alt="Sree Collections"
            style={{ height: "68px", width: "auto", objectFit: "contain" }}
          />
        </a>
        <nav
          className="cat-desktop-nav"
          style={{ display: "none", alignItems: "center", gap: "28px" }}
        >
          <NavLink href="/">Home</NavLink>
          <NavLink href="/#about">About</NavLink>
          <NavLink href="/categories" active>
            Categories
          </NavLink>
          <a
            href="/#contact"
            className="cat-contact-btn"
            style={{
              backgroundColor: "#BB8E43",
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              padding: "12px 28px",
              borderRadius: "999px",
              textDecoration: "none",
            }}
          >
            Contact Us
          </a>

          {/* Search Toggle */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {searchOpen && (
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery(searchInput);
                  }
                }}
                autoFocus
                style={{
                  width: "200px",
                  height: "36px",
                  padding: "0 14px",
                  borderRadius: "999px",
                  border: "1.5px solid #BB8E43",
                  backgroundColor: "#FFFFFF",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "13px",
                  color: "#5D2030",
                  outline: "none",
                  marginRight: "8px",
                }}
              />
            )}
            <button
              aria-label="Search"
              onClick={() => {
                if (searchOpen && searchInput.trim()) {
                  setSearchQuery(searchInput);
                } else {
                  setSearchOpen(!searchOpen);
                }
              }}
              style={{
                color: "#5A2035",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FiSearch size={22} />
            </button>
          </div>

          <a
            href="/cart"
            aria-label="Cart"
            style={{
              color: "#5A2035",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiShoppingCart size={22} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-7px",
                  right: "-7px",
                  backgroundColor: "#BB8E43",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  fontWeight: 700,
                  width: "17px",
                  height: "17px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </a>
        </nav>
        <button
          className="cat-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            color: "#5A2035",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 200,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: "280px",
              height: "100%",
              backgroundColor: "#FCF8F2",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img
                src="/homepage/logo2_trans.png"
                alt="Logo"
                style={{ height: "48px" }}
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <FiX size={22} />
              </button>
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "10px",
              }}
            >
              <a
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: "17px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 500,
                  color: "#3D3028",
                }}
              >
                Home
              </a>
              <a
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: "17px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 500,
                  color: "#3D3028",
                }}
              >
                About
              </a>
              <a
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: "17px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  color: "#5A2035",
                }}
              >
                Categories
              </a>
              <a
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "16px", fontWeight: 500 }}
              >
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* TOP BAR: Heading & Results inline */}
      <div
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "24px auto 32px",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', 'Blacker Display', Georgia, serif",
              fontWeight: 700,
              fontSize: "48px",
              lineHeight: "100%",
              color: "#5D2030",
              margin: 0,
            }}
          >
            {selectedCategory}
          </h1>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "20px",
              color: "#5D2030",
              fontWeight: 500,
            }}
          >
            Showing {totalCount} results
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <button
            id="sort-dropdown-btn"
            onClick={() => setSortOpen(!sortOpen)}
            className="cat-sort-btn"
            style={{
              width: "224px",
              height: "60px",
              borderRadius: "16px",
              border: "2px solid #BB8E43",
              backgroundColor: "transparent",
              padding: "0 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                fontFamily:
                  "'Playfair Display', 'Blacker Display', Georgia, serif",
                fontSize: "18px",
                fontWeight: 600,
                color: "#5D2030",
              }}
            >
              {sortBy}
            </span>
            <FiChevronDown
              size={20}
              color="#BB8E43"
              style={{
                transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>
          {sortOpen && (
            <div
              style={{
                position: "absolute",
                top: "68px",
                right: 0,
                width: "224px",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1.5px solid #BB8E43",
                boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                zIndex: 80,
                overflow: "hidden",
                padding: "8px 0",
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setSortBy(opt);
                    setSortOpen(false);
                  }}
                  className="cat-sort-item"
                  style={{
                    padding: "11px 18px",
                    fontFamily:
                      "'Playfair Display', 'Blacker Display', Georgia, serif",
                    fontSize: "15px",
                    color: sortBy === opt ? "#BB8E43" : "#5D2030",
                    backgroundColor:
                      sortBy === opt ? "#FBF5EC" : "transparent",
                    fontWeight: sortBy === opt ? 600 : 400,
                    cursor: "pointer",
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div
        className="cat-main-layout"
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto 80px",
          padding: "0 40px",
          display: "flex",
          gap: "48px",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        {/* SIDEBAR */}
        <aside
          className="cat-sidebar"
          style={{
            width: "220px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "36px",
            position: "sticky",
            top: "24px",
          }}
        >
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              style={{
                alignSelf: "flex-start",
                background: "none",
                border: "none",
                color: "#BB8E43",
                fontSize: 14,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                marginTop: -8,
              }}
            >
              Clear all filters
            </button>
          )}

          {/* Categories */}
          <div>
            <SidebarHeading>Categories</SidebarHeading>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              {categoriesList.map((cat) => {
                const active =
                  selectedCategory.toLowerCase() === cat.toLowerCase() ||
                  (selectedCategory === "All Products" && cat === "All Products");
                return active ? (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSubCategory("");
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 24px",
                      borderRadius: "999px",
                      backgroundColor: "#BB8E43",
                      color: "#FFFFFF",
                      fontFamily:
                        "'Playfair Display', 'Blacker Display', Georgia, serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(187,142,67,0.28)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cat}
                  </button>
                ) : (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSubCategory("");
                    }}
                    className="cat-sidebar-link"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 0",
                      fontFamily:
                        "'Playfair Display', 'Blacker Display', Georgia, serif",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#5D2030",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                      transition: "color 0.2s ease, transform 0.2s ease",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategories */}
          {subCategoriesList.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <SidebarHeading>Subcategory</SidebarHeading>
                {selectedSubCategory && (
                  <button
                    type="button"
                    onClick={() => setSelectedSubCategory("")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#BB8E43",
                      fontSize: 13,
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                      marginBottom: 18,
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                {subCategoriesList.map((sub) => {
                  const active =
                    selectedSubCategory.toLowerCase() === sub.toLowerCase();
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() =>
                        setSelectedSubCategory((prev) =>
                          prev.toLowerCase() === sub.toLowerCase() ? "" : sub
                        )
                      }
                      className={active ? undefined : "cat-sidebar-link"}
                      style={
                        active
                          ? {
                              display: "inline-flex",
                              padding: "6px 18px",
                              borderRadius: 999,
                              backgroundColor: "#BB8E43",
                              color: "#FFFFFF",
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontWeight: 600,
                              fontSize: 14,
                              border: "none",
                              cursor: "pointer",
                            }
                          : {
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px 0",
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontWeight: 500,
                              fontSize: 15,
                              color: "#5D2030",
                              textAlign: "left",
                            }
                      }
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div>
            <SidebarHeading>Price Range</SidebarHeading>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {priceBuckets.map(({ label }) => (
                <CheckboxRow
                  key={label}
                  label={label}
                  checked={checkedPrices.includes(label)}
                  onChange={() => togglePrice(label)}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          {sizesList.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <SidebarHeading>Size</SidebarHeading>
                {selectedSize && (
                  <button
                    onClick={() => setSelectedSize("")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#BB8E43",
                      fontSize: "13px",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                      marginBottom: "18px",
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "14px",
                }}
              >
                {sizesList.map((s) => {
                  const active = selectedSize.toLowerCase() === s.toLowerCase();
                  return (
                    <button
                      key={s}
                      onClick={() =>
                        setSelectedSize((prev) =>
                          prev.toLowerCase() === s.toLowerCase() ? "" : s
                        )
                      }
                      style={{
                        minWidth: "36px",
                        height: "36px",
                        padding: "0 10px",
                        borderRadius: s.length > 3 ? "999px" : "50%",
                        backgroundColor: active ? "#BB8E43" : "transparent",
                        color: active ? "#FFFFFF" : "#5D2030",
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontWeight: active ? 700 : 600,
                        fontSize: s.length > 4 ? "12px" : "16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        boxShadow: active
                          ? "0 4px 12px rgba(187,142,67,0.3)"
                          : "none",
                        border: "none",
                      }}
                      title={
                        active
                          ? `Click to clear size ${s}`
                          : `Filter by size ${s}`
                      }
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colour */}
          {coloursList.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <SidebarHeading>Colour</SidebarHeading>
                {selectedColour && (
                  <button
                    type="button"
                    onClick={() => setSelectedColour("")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#BB8E43",
                      fontSize: 13,
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                      marginBottom: 18,
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {coloursList.map((c) => {
                  const active =
                    selectedColour.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      onClick={() =>
                        setSelectedColour((prev) =>
                          prev.toLowerCase() === c.toLowerCase() ? "" : c
                        )
                      }
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: colourToHex(c),
                        border: active
                          ? "2.5px solid #5D2030"
                          : "1.5px solid #E3D7C5",
                        boxShadow: active
                          ? "0 0 0 2px #BB8E43"
                          : "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Brand */}
          {brandsList.length > 0 && (
            <div>
              <SidebarHeading>Brand</SidebarHeading>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {brandsList.map((b) => (
                  <CheckboxRow
                    key={b}
                    label={b}
                    checked={selectedBrand.toLowerCase() === b.toLowerCase()}
                    onChange={() =>
                      setSelectedBrand((prev) =>
                        prev.toLowerCase() === b.toLowerCase() ? "" : b
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Fabric */}
          {fabricsList.length > 0 && (
            <div>
              <SidebarHeading>Fabric</SidebarHeading>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {fabricsList.map((f) => (
                  <CheckboxRow
                    key={f}
                    label={f}
                    checked={selectedFabric.toLowerCase() === f.toLowerCase()}
                    onChange={() =>
                      setSelectedFabric((prev) =>
                        prev.toLowerCase() === f.toLowerCase() ? "" : f
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <div>
            <SidebarHeading>Availability</SidebarHeading>
            <CheckboxRow
              label="In stock only"
              checked={inStockOnly}
              onChange={() => setInStockOnly((v) => !v)}
            />
          </div>
        </aside>

        {/* PRODUCT GRID - Exact 3-column masonry with calculated height alignment */}
        <main
          className="cat-product-grid"
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {loading ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "80px 24px",
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#5D2030",
                fontSize: 18,
              }}
            >
              Loading products…
            </div>
          ) : fetchError ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "80px 24px",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1.5px solid #BB8E43",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 24,
                  color: "#5D2030",
                  marginBottom: 12,
                }}
              >
                Something went wrong
              </h3>
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 15,
                  color: "#7D5D4E",
                  marginBottom: 20,
                }}
              >
                {fetchError}
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                style={{
                  backgroundColor: "#BB8E43",
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "10px 24px",
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
            </div>
          ) : totalCount === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "80px 24px",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1.5px solid #BB8E43",
              }}
            >
              <h3
                style={{
                  fontFamily:
                    "'Playfair Display', 'Blacker Display', Georgia, serif",
                  fontSize: "24px",
                  color: "#5D2030",
                  marginBottom: "12px",
                }}
              >
                No Products Found
              </h3>
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "15px",
                  color: "#7D5D4E",
                  maxWidth: "460px",
                  margin: "0 auto 20px",
                }}
              >
                No products match the selected filters. Try choosing a different
                category, size, or price range.
              </p>
              <button
                onClick={clearAllFilters}
                style={{
                  backgroundColor: "#BB8E43",
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "10px 24px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Column 1: Short, Short, Tall, Short, Short, Tall */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {col1.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    qty={cartMap[p.id]?.quantity || 0}
                    onQtyChange={(delta) => handleQtyChange(p, delta)}
                  />
                ))}
              </div>

              {/* Column 2: Tall, Short, Short, Tall, Short, Short */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {col2.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    qty={cartMap[p.id]?.quantity || 0}
                    onQtyChange={(delta) => handleQtyChange(p, delta)}
                  />
                ))}
              </div>

              {/* Column 3: Short, Tall, Short, Short, Tall, Short */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {col3.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    qty={cartMap[p.id]?.quantity || 0}
                    onQtyChange={(delta) => handleQtyChange(p, delta)}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* FLOATING CART BAR */}
      {cartCount > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#5D2030",
            borderRadius: "999px",
            boxShadow: "0 8px 32px rgba(93,32,48,0.35)",
            padding: "14px 28px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            zIndex: 998,
            border: "1.5px solid #BB8E43",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            <FiShoppingBag size={18} color="#BB8E43" />
            <span>
              {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <a
              href="/cart"
              style={{
                backgroundColor: "transparent",
                border: "1.5px solid #BB8E43",
                color: "#BB8E43",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "13px",
                fontWeight: 700,
                padding: "8px 20px",
                borderRadius: "999px",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
            >
              View Cart
            </a>
            <a
              href="/checkout"
              style={{
                backgroundColor: "#BB8E43",
                border: "none",
                color: "#FFFFFF",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "13px",
                fontWeight: 700,
                padding: "8px 20px",
                borderRadius: "999px",
                textDecoration: "none",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Place Order
            </a>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ borderTop: "1.5px solid #5D2030" }} />
      <footer
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "50px 40px 36px",
          boxSizing: "border-box",
        }}
      >
        <div
          className="cat-footer-top"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "32px",
            marginBottom: "48px",
          }}
        >
          <a href="/">
            <img
              src="/homepage/logo2_trans.png"
              alt="Sree Collections"
              style={{ height: "72px", width: "auto", objectFit: "contain" }}
            />
          </a>
          <a
            href="/#contact"
            className="cat-contact-btn"
            style={{
              backgroundColor: "#BB8E43",
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              padding: "13px 36px",
              borderRadius: "999px",
              textDecoration: "none",
            }}
          >
            Contact Us
          </a>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#5D2030",
              }}
            >
              <FiMapPin size={15} />
              <span>1985 Mulberry Oak, Suite 41, Chattahoochee, GA 30545</span>
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#5D2030",
                }}
              >
                <FiPhone size={14} />
                <span>+91 86765 43210</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#5D2030",
                }}
              >
                <FiMail size={14} />
                <span>sreecollections47@gmail.com</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              {[
                { icon: <FaFacebookF size={13} />, label: "Facebook" },
                { icon: <FaInstagram size={13} />, label: "Instagram" },
                { icon: <FaYoutube size={13} />, label: "YouTube" },
                { icon: <FaWhatsapp size={13} />, label: "WhatsApp" },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="cat-social-btn"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "1px solid #5D2030",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#5D2030",
                    transition: "all 0.2s ease",
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid #E3D7C5",
            paddingTop: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "12px",
            color: "#8A7B6F",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              "About Us",
              "Contact Us",
              "Careers",
              "Privacy Policy",
              "Terms & Conditions",
            ].map((l) => (
              <a key={l} href="#" className="cat-footer-link">
                {l}
              </a>
            ))}
          </div>
          <span style={{ textTransform: "none", letterSpacing: 0 }}>
            &copy; {new Date().getFullYear()} Sree Collections. All Rights Reserved.
          </span>
        </div>
      </footer>

      {/* STYLES */}
      <style>{`
        @media (min-width: 992px) { .cat-desktop-nav { display: flex !important; } }
        @media (max-width: 991px) { .cat-hamburger { display: flex !important; } }
        @media (max-width: 900px) {
          .cat-main-layout { flex-direction: column !important; padding: 0 20px !important; }
          .cat-sidebar { width: 100% !important; position: static !important; }
          .cat-product-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) { .cat-product-grid { grid-template-columns: 1fr !important; } }
        .cat-nav-link:hover { opacity: 0.75; }
        .cat-contact-btn:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .cat-sort-btn:hover { background-color: #FBF5EC !important; }
        .cat-sort-item:hover { background-color: #FBF5EC !important; }
        .cat-sidebar-link:hover { color: #BB8E43 !important; transform: translateX(4px); }
        .cat-card-wrap { transition: box-shadow 0.25s ease, transform 0.25s ease; }
        .cat-card-wrap:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(187,142,67,0.18); }
        .cat-cart-btn:hover { background-color: #BB8E43 !important; color: #FFFFFF !important; border-color: #BB8E43 !important; transform: scale(1.04); }
        .cat-social-btn:hover { background-color: #5D2030 !important; color: #FFFFFF !important; }
        .cat-footer-link { color: #8A7B6F; text-decoration: none; }
        .cat-footer-link:hover { color: #5D2030; text-decoration: underline; }
      `}</style>
    </div>
  );
}
