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
  FiFilter,
} from "react-icons/fi";
import { FaFacebookF, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { API_BASE } from "@/lib/config";

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
  const subCategory = sp.get("subCategory") || "";
  const rawCat = sp.get("category") || sp.get("slug") || "";
  let category = "All Products";

  if (rawCat && rawCat !== "All Products") {
    const lower = rawCat.toLowerCase().trim();
    if (lower === "casual-wear" || lower === "casual wear" || lower === "casual") category = "Casual Wear";
    else if (lower === "decorative-items" || lower === "decorative items" || lower === "decorative") category = "Decorative Items";
    else if (lower === "ethnic-lehengas" || lower === "ethnic lehengas" || lower === "lehenga" || lower === "lehengas") category = "Ethnic Lehengas";
    else if (lower === "jewellery" || lower === "jewelry") category = "Jewellery";
    else if (lower === "saree" || lower === "sarees") category = "Saree";
    else if (lower === "watches" || lower === "watch") category = "watches";
    else if (lower === "shades" || lower === "premium shades") category = "premium shades";
    else {
      category = rawCat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  // If subCategory was passed without a category, infer parent category
  if (category === "All Products" && subCategory) {
    const subLower = subCategory.toLowerCase();
    if (subLower.includes("denim") || subLower.includes("linen") || subLower.includes("active") || subLower.includes("casual") || subLower.includes("formal") || subLower.includes("street")) {
      category = "Casual Wear";
    } else if (subLower.includes("temple") || subLower.includes("earring") || subLower.includes("chain") || subLower.includes("jewel")) {
      category = "Jewellery";
    } else if (subLower.includes("decor") || subLower.includes("party")) {
      category = "Decorative Items";
    } else if (subLower.includes("saree") || subLower.includes("traditional")) {
      category = "Saree";
    } else if (subLower.includes("ethnic") || subLower.includes("kurta")) {
      category = "Casual Wear";
    }
  }

  return {
    category,
    size: sp.get("size") || "",
    colour: sp.get("colour") || "",
    brand: sp.get("brand") || "",
    fabric: sp.get("fabric") || "",
    subCategory,
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
      className={`cat-card-wrap ${product.isTall ? "cat-card-tall" : "cat-card-short"}`}
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
        minWidth: 0,
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
        className="cat-card-img"
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

      <div className="cat-card-body" style={{ padding: "10px 2px 2px 2px" }}>
        <h3
          className="cat-card-title"
          style={{
            fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 600,
            fontSize: "13.5px",
            lineHeight: "18px",
            minHeight: "18px",
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
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "11px",
                color: "#9E7A54",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Price:
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                color: "#5D2030",
              }}
            >
              {product.price}
            </span>
            {showMrp && (
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "11px",
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

function ProductCardSkeleton({ isTall = false }: { isTall?: boolean }) {
  const imgHeight = isTall ? 340 : 230;
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1.5px solid #EAE3D9",
        padding: "12px",
        boxSizing: "border-box",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: `${imgHeight}px`,
          borderRadius: "12px",
          backgroundColor: "#F4EFEA",
          animation: "sc-skeleton-pulse 1.6s ease-in-out infinite",
        }}
      />
      <div style={{ padding: "4px 2px" }}>
        <div
          style={{
            width: "75%",
            height: "18px",
            borderRadius: "4px",
            backgroundColor: "#F4EFEA",
            marginBottom: "10px",
            animation: "sc-skeleton-pulse 1.6s ease-in-out infinite",
          }}
        />
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F4EFEA", animation: "sc-skeleton-pulse 1.6s ease-in-out infinite" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F4EFEA", animation: "sc-skeleton-pulse 1.6s ease-in-out infinite" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F4EFEA", animation: "sc-skeleton-pulse 1.6s ease-in-out infinite" }} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "20px",
              borderRadius: "4px",
              backgroundColor: "#F4EFEA",
              animation: "sc-skeleton-pulse 1.6s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "90px",
              height: "32px",
              borderRadius: "999px",
              backgroundColor: "#F4EFEA",
              animation: "sc-skeleton-pulse 1.6s ease-in-out infinite",
            }}
          />
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
      className="cat-sidebar-heading"
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
  // Always use safe SSR defaults for initial state to avoid hydration mismatch

  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColour, setSelectedColour] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedFabric, setSelectedFabric] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [checkedPrices, setCheckedPrices] = useState<string[]>(["All Prices"]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Featured");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartMap, setCartMap] = useState<Record<string, { product: Product; quantity: number }>>({});
  const [cartCount, setCartCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read URL params after mount to avoid hydration mismatch
  useEffect(() => {
    const handleUrlChange = () => {
      const urlState = readUrlFilters();
      setSelectedCategory(urlState.category);
      setSelectedSubCategory(urlState.subCategory);
      setSelectedSize(urlState.size);
      setSelectedColour(urlState.colour);
      setSelectedBrand(urlState.brand);
      setSelectedFabric(urlState.fabric);
      setInStockOnly(urlState.inStock);
      setCheckedPrices(urlState.prices);
      setSortBy(urlState.sort);
      setSearchQuery(urlState.search);
      setSearchInput(urlState.search);
      setSearchOpen(Boolean(urlState.search));
    };

    handleUrlChange();
    setMounted(true);

    const handleCategorySearch = (e: any) => {
      const q = typeof e?.detail === "string" ? e.detail : "";
      setSearchQuery(q);
      setSearchInput(q);
      setSearchOpen(Boolean(q));
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("sreeCategorySearch", handleCategorySearch);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("sreeCategorySearch", handleCategorySearch);
    };
  }, []);

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
    if (!mounted) return;
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
    mounted,
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

  const isParticularCategory = Boolean(selectedCategory && selectedCategory !== "All Products");

  const handleCategorySelect = (cat: string) => {
    if (cat === selectedCategory) return;
    setSelectedCategory(cat);
    setSelectedSubCategory("");
    setSelectedSize("");
    setSelectedColour("");
    setSelectedBrand("");
    setSelectedFabric("");
    setCheckedPrices(["All Prices"]);
  };

  // 1. Fetch available categories list on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchCategoriesList() {
      try {
        const [filtersRes, catsRes, allSubsRes] = await Promise.all([
          fetch(`${API_BASE}/products/filters`),
          fetch(`${API_BASE}/categories?status=Active`),
          fetch(`${API_BASE}/sub-categories?status=Active`),
        ]);

        const filtersJson = filtersRes.ok ? await filtersRes.json() : null;
        const catsJson = catsRes.ok ? await catsRes.json() : null;
        const allSubsJson = allSubsRes.ok ? await allSubsRes.json() : null;

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

        // Subcategory validation against active subcategories present in categories page
        const allActiveSubs: Array<{ name: string; category: string }> = Array.isArray(allSubsJson?.data)
          ? allSubsJson.data
          : [];

        const urlState = readUrlFilters();
        if (urlState.subCategory && allActiveSubs.length > 0) {
          const matched = allActiveSubs.find(
            (s) => s.name.trim().toLowerCase() === urlState.subCategory.trim().toLowerCase()
          );
          if (!matched) {
            // If subcategory is not matched with the subcategories present in categories page,
            // open categories page! (Clear subcategory and show all products)
            setSelectedSubCategory("");
            setSelectedCategory("All Products");
          } else {
            // Matched! Ensure correct category is selected and normalize name
            if (matched.category && (!urlState.category || urlState.category === "All Products")) {
              setSelectedCategory(matched.category);
            }
            setSelectedSubCategory(matched.name);
          }
        }
      } catch {
        // Keep empty dynamic lists; products fetch still works
      }
    }
    fetchCategoriesList();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load category-specific facets (subcategories, sizes, colours, brands, fabrics, price buckets)
  // ONLY when a particular category is selected!
  useEffect(() => {
    let isMounted = true;
    async function loadCategoryFacets() {
      if (!selectedCategory || selectedCategory === "All Products") {
        // When on All Products: clear secondary filter lists so only categories show in sidebar
        setSubCategoriesList([]);
        setSizesList([]);
        setColoursList([]);
        setBrandsList([]);
        setFabricsList([]);
        setPriceBuckets(DEFAULT_PRICE_BUCKETS);
        return;
      }

      try {
        const [filterRes, subRes] = await Promise.all([
          fetch(`${API_BASE}/products/filters?category=${encodeURIComponent(selectedCategory)}`),
          fetch(`${API_BASE}/sub-categories?status=Active&category=${encodeURIComponent(selectedCategory)}`),
        ]);

        const filterJson = filterRes.ok ? await filterRes.json() : null;
        const subJson = subRes.ok ? await subRes.json() : null;

        if (!isMounted) return;

        const facetData = filterJson?.data || filterJson || {};

        if (Array.isArray(facetData.sizes)) setSizesList(facetData.sizes);
        else setSizesList([]);

        if (Array.isArray(facetData.colours)) setColoursList(facetData.colours);
        else setColoursList([]);

        if (Array.isArray(facetData.brands)) setBrandsList(facetData.brands);
        else setBrandsList([]);

        if (Array.isArray(facetData.fabrics)) setFabricsList(facetData.fabrics);
        else setFabricsList([]);

        if (Array.isArray(facetData.priceBuckets) && facetData.priceBuckets.length > 0) {
          setPriceBuckets(facetData.priceBuckets.map((b: { label: string }) => ({ label: b.label })));
        } else {
          setPriceBuckets(DEFAULT_PRICE_BUCKETS);
        }

        // Subcategories from SubCategory endpoint + facetData
        const subFromApi: string[] = Array.isArray(subJson?.data)
          ? subJson.data.map((s: any) => s.name).filter(Boolean)
          : [];
        const subFromFacets: string[] = Array.isArray(facetData.subCategories)
          ? facetData.subCategories
          : [];

        const mergedSubs = Array.from(new Set([...subFromApi, ...subFromFacets]));
        setSubCategoriesList(mergedSubs);

        // If a subcategory is currently selected, check if it matches the subcategories present in this category
        if (selectedSubCategory && mergedSubs.length > 0) {
          const matchedSub = mergedSubs.find(
            (s) => s.trim().toLowerCase() === selectedSubCategory.trim().toLowerCase()
          );
          if (!matchedSub) {
            // Not matched with the sub categories present in categories page:
            // Clear subcategory to open the category/categories page instead of an empty product list
            setSelectedSubCategory("");
          } else if (matchedSub !== selectedSubCategory) {
            setSelectedSubCategory(matchedSub);
          }
        }
      } catch {
        /* ignore */
      }
    }
    loadCategoryFacets();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedSubCategory]);

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
    window.dispatchEvent(new CustomEvent("sreeCategorySearchCleared"));
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

      {/* Shared SiteHeader is rendered globally in layout.tsx */}

      {/* Mobile Expandable Search Bar (categories-specific product search) */}



      {/* TOP BAR: Heading & Results inline */}
      <div
        className="cat-top-bar"
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
          className="cat-title-row"
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <h1
            className="cat-page-title"
            suppressHydrationWarning
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
            className="cat-results-count"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "20px",
              color: "#5D2030",
              fontWeight: 500,
            }}
          >
            Showing {totalCount} results
          </span>
          {searchQuery && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "999px",
                backgroundColor: "#FBF5EC",
                border: "1.5px solid #BB8E43",
                fontSize: "13px",
                color: "#5D2030",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
              }}
            >
              <span>for &ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearchQuery("");
                  window.dispatchEvent(new CustomEvent("sreeCategorySearchCleared"));
                  const sp = new URLSearchParams(window.location.search);
                  sp.delete("search");
                  const qs = sp.toString();
                  window.history.replaceState(null, "", qs ? `/categories?${qs}` : "/categories");
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#BB8E43",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 2px",
                }}
                title="Clear search"
                aria-label="Clear search"
              >
                <FiX size={14} />
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", width: "100%", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="cat-mobile-filter-btn"
            style={{
              display: "none",
              alignItems: "center",
              gap: "8px",
              height: "46px",
              padding: "0 18px",
              borderRadius: "14px",
              border: "1.5px solid #BB8E43",
              backgroundColor: mobileFiltersOpen ? "#BB8E43" : "transparent",
              color: mobileFiltersOpen ? "#FFFFFF" : "#5D2030",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <FiFilter size={16} />
            <span>{mobileFiltersOpen ? "Hide Filters" : "Filter & Refine"}</span>
            {hasActiveFilters && (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: mobileFiltersOpen ? "#FFFFFF" : "#BB8E43",
                }}
              />
            )}
          </button>

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
      </div>

      {/* Quick Mobile Category Pill Slider */}
      <div
        className="cat-mobile-pills-bar"
        style={{
          display: "none",
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto 12px auto",
          padding: "6px 16px 14px 16px",
          boxSizing: "border-box",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          gap: "8px",
        }}
      >
        {categoriesList.map((cat) => {
          const active =
            selectedCategory.toLowerCase() === cat.toLowerCase() ||
            (selectedCategory === "All Products" && cat === "All Products");
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              style={{
                flexShrink: 0,
                padding: "8px 18px",
                borderRadius: "999px",
                backgroundColor: active ? "#BB8E43" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#5D2030",
                border: active ? "1.5px solid #BB8E43" : "1px solid #DECDBE",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: active ? 700 : 500,
                fontSize: "13.5px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: active ? "0 2px 8px rgba(187,142,67,0.25)" : "none",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* MAIN LAYOUT */}
      <div
        className="cat-main-layout"
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto 80px",
          padding: "0 28px",
          display: "flex",
          gap: "32px",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        {/* SIDEBAR */}
        <aside
          className={`cat-sidebar ${mobileFiltersOpen ? "cat-sidebar-open" : "cat-sidebar-closed"}`}
          style={{
            width: "220px",
            minWidth: "220px",
            maxWidth: "220px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "36px",
            position: "sticky",
            top: "24px",
            boxSizing: "border-box",
          }}
        >
          {mounted && hasActiveFilters && (
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
                    onClick={() => handleCategorySelect(cat)}
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
                    onClick={() => handleCategorySelect(cat)}
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

          {/* Conditional Display: Respective Filters ONLY when a particular category is selected */}
          {isParticularCategory ? (
            <>
              {/* Subcategories for Selected Category */}
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
                      flexWrap: "wrap",
                      gap: "10px",
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
                            fontSize: s.length > 4 ? "12px" : "15px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            boxShadow: active
                              ? "0 4px 12px rgba(187,142,67,0.3)"
                              : "none",
                            border: active ? "none" : "1.5px solid #E3D7C5",
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
            </>
          ) : (
            /* Elegant prompt shown when on All Products (First showing only categories) */
            <div
              style={{
                padding: "20px 18px",
                borderRadius: "14px",
                backgroundColor: "#FBF5EC",
                border: "1.5px dashed #BB8E43",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px" }}>✨</span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#5D2030",
                  }}
                >
                  Select a Category
                </span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#7A685D",
                  lineHeight: 1.5,
                  margin: 0,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Choose any category above to reveal tailored subcategories, sizes, price ranges, and brands.
              </p>
            </div>
          )}
        </aside>

        {/* PRODUCT GRID - Exact 3-column masonry with calculated height alignment */}
        <main
          className="cat-product-grid"
          style={{
            flex: 1,
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {loading ? (
            <>
              <style>{`
                @keyframes sc-skeleton-pulse {
                  0%, 100% { opacity: 0.55; }
                  50% { opacity: 1; }
                }
              `}</style>
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={`cat-skel-${i}`} isTall={i === 1 || i === 4} />
              ))}
            </>
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
                  gap: "20px",
                  minWidth: 0,
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
                  gap: "20px",
                  minWidth: 0,
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
                  gap: "20px",
                  minWidth: 0,
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
          className="cat-float-cart"
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#5D2030",
            borderRadius: "999px",
            boxShadow: "0 8px 32px rgba(93,32,48,0.35)",
            padding: "12px 22px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            zIndex: 998,
            border: "1.5px solid #BB8E43",
            maxWidth: "calc(100vw - 24px)",
            boxSizing: "border-box",
            flexWrap: "nowrap",
          }}
        >
          <div
            className="cat-float-cart-label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "14px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <FiShoppingBag size={16} color="#BB8E43" />
            <span>
              {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
            </span>
          </div>
          <div
            className="cat-float-cart-actions"
            style={{ display: "flex", gap: "8px", flexShrink: 0 }}
          >
            <a
              href="/cart"
              className="cat-float-cart-btn"
              style={{
                backgroundColor: "transparent",
                border: "1.5px solid #BB8E43",
                color: "#BB8E43",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "12px",
                fontWeight: 700,
                padding: "7px 14px",
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
              className="cat-float-cart-btn cat-float-cart-btn-primary"
              style={{
                backgroundColor: "#BB8E43",
                border: "none",
                color: "#FFFFFF",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "12px",
                fontWeight: 700,
                padding: "7px 14px",
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

      {/* STYLES — desktop (≥992) unchanged; tablet/mobile compressed */}
      <style>{`
        @media (min-width: 992px) {
          .cat-desktop-nav { display: flex !important; }
          .cat-mobile-inline-search { display: none !important; }
          .mobile-header-actions { display: none !important; }
          .cat-mobile-filter-btn { display: none !important; }
          .cat-mobile-pills-bar { display: none !important; }
          .cat-sidebar { display: flex !important; }
        }
        @media (max-width: 991px) {
          .cat-desktop-nav { display: none !important; }
          .cat-desktop-search-expanded { display: none !important; }
          .cat-mobile-inline-search { display: flex !important; }
          .mobile-header-actions { display: flex !important; }
          .cat-hamburger { display: flex !important; }
          .cat-mobile-filter-btn { display: inline-flex !important; }
          .cat-mobile-pills-bar { display: flex !important; }
          .cat-logo { height: 50px !important; max-width: 200px !important; }
          .cat-top-bar { margin: 12px auto 14px !important; padding: 0 16px !important; gap: 12px !important; }
          .cat-page-title { font-size: 30px !important; }
          .cat-results-count { font-size: 14px !important; }
          .cat-title-row { gap: 10px !important; width: 100% !important; justify-content: space-between !important; }
          .cat-sort-btn { width: 150px !important; height: 46px !important; border-radius: 12px !important; }
          .cat-sort-btn span { font-size: 14px !important; }
          .cat-main-layout { flex-direction: column !important; padding: 0 16px !important; gap: 20px !important; margin-bottom: 48px !important; }
          .cat-sidebar { width: 100% !important; min-width: 100% !important; max-width: 100% !important; position: static !important; gap: 22px !important; }
          .cat-sidebar.cat-sidebar-closed { display: none !important; }
          .cat-sidebar.cat-sidebar-open {
            display: flex !important;
            background-color: #FFFFFF !important;
            padding: 22px 18px !important;
            border-radius: 18px !important;
            border: 1.5px solid #DECDBE !important;
            box-shadow: 0 8px 24px rgba(93,32,48,0.06) !important;
          }
          .cat-sidebar-heading { font-size: 20px !important; margin-bottom: 12px !important; }
          .cat-product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 12px !important; width: 100% !important; }
          .cat-card-wrap { padding: 8px !important; border-radius: 12px !important; }
          .cat-card-tall .cat-card-img { height: 260px !important; }
          .cat-card-short .cat-card-img { height: 160px !important; }
          .cat-card-title { font-size: 13.5px !important; line-height: 18px !important; height: 18px !important; }
          .cat-card-body { padding: 8px 2px 2px !important; }
        }
        @media (max-width: 640px) {
          .cat-logo { height: 42px !important; max-width: 170px !important; }
          .cat-top-bar { margin: 8px auto 12px !important; padding: 0 12px !important; }
          .cat-page-title { font-size: 24px !important; }
          .cat-results-count { font-size: 12.5px !important; }
          .cat-sort-btn { width: auto !important; flex: 1 !important; max-width: 100% !important; height: 44px !important; }
          .cat-mobile-filter-btn { flex: 1 !important; height: 44px !important; justify-content: center !important; }
          .cat-main-layout { padding: 0 12px !important; gap: 16px !important; }
          .cat-sidebar-heading { font-size: 18px !important; margin-bottom: 10px !important; }
          .cat-product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }
          .cat-card-wrap { padding: 6px !important; border-radius: 10px !important; }
          .cat-card-tall .cat-card-img { height: 190px !important; }
          .cat-card-short .cat-card-img { height: 130px !important; }
          .cat-card-title { font-size: 12px !important; line-height: 16px !important; height: 16px !important; }
          .cat-card-img { border-radius: 8px !important; }
          .cat-float-cart {
            bottom: 14px !important;
            padding: 8px 12px !important;
            gap: 8px !important;
            width: calc(100vw - 20px) !important;
            max-width: 420px !important;
            justify-content: space-between !important;
          }
          .cat-float-cart-label { font-size: 11px !important; gap: 5px !important; }
          .cat-float-cart-label svg { width: 14px !important; height: 14px !important; }
          .cat-float-cart-btn { font-size: 11px !important; padding: 6px 10px !important; }
        }
        @media (max-width: 380px) {
          .cat-product-grid { grid-template-columns: 1fr !important; }
          .cat-card-tall .cat-card-img,
          .cat-card-short .cat-card-img { height: 220px !important; }
          .cat-card-title { font-size: 14px !important; line-height: 18px !important; height: 18px !important; }
        }
        .cat-nav-link {
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }
        .cat-nav-link:hover {
          background: rgba(186, 142, 67, 0.15) !important;
          color: #BA8E43 !important;
          border-radius: 9999px !important;
          transform: translateY(-1px) !important;
        }
        .cat-active-nav-pill:hover {
          background: #a47b36 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 14px rgba(186, 142, 67, 0.35) !important;
        }
        .cat-sort-btn:hover { background-color: #FBF5EC !important; }
        .cat-sort-item:hover { background-color: #FBF5EC !important; }
        .cat-sidebar-link:hover { color: #BB8E43 !important; transform: translateX(4px); }
        .cat-card-wrap { transition: box-shadow 0.25s ease, transform 0.25s ease; }
        .cat-card-wrap:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(187,142,67,0.18); }
        .cat-cart-btn:hover { background-color: #BB8E43 !important; color: #FFFFFF !important; border-color: #BB8E43 !important; transform: scale(1.04); }
        .cat-social-btn:hover { background-color: #5D2030 !important; color: #FFFFFF !important; }
      `}</style>
    </div>
  );
}
