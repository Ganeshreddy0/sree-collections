"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FiSearch,
  FiMenu,
  FiX,
  FiChevronDown,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCheckCircle,
  FiShoppingBag,
  FiFilter,
} from "react-icons/fi";
import { FaFacebookF, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { API_BASE } from "@/lib/config";
import "./categories.css";
import {
  DEFAULT_PRICE_BUCKETS,
  SORT_OPTIONS,
  readUrlFilters,
  writeUrlFilters,
} from "@/lib/categoryFilters";
import {
  ProductCard,
  ProductCardSkeleton,
  formatInr,
  type Product,
} from "@/components/categories/CategoryPageComponents";
import { CategoryFiltersSidebar } from "@/components/categories/CategoryFiltersSidebar";

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

  const pillsBarRef = useRef<HTMLDivElement>(null);
  const subPillsBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && pillsBarRef.current) {
      const activeEl = pillsBarRef.current.querySelector(".cat-mobile-pill-active") as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (typeof window !== "undefined" && subPillsBarRef.current) {
      const activeEl = subPillsBarRef.current.querySelector(".cat-mobile-subpill-active") as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [selectedSubCategory]);

  useEffect(() => {
    if (!sortOpen) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest(".cat-sort-wrap")) {
        setSortOpen(false);
      }
    };
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, [sortOpen]);

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

  // Mobile 2 columns: balanced alternating tall/short distribution
  const mobCol1: Product[] = [];
  const mobCol2: Product[] = [];

  products.forEach((p, idx) => {
    if (idx % 2 === 0) {
      const i = mobCol1.length;
      mobCol1.push({ ...p, isTall: i % 2 === 1 });
    } else {
      const i = mobCol2.length;
      mobCol2.push({ ...p, isTall: i % 2 === 0 });
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

        <div
          className="cat-actions-row"
          style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", width: "100%", justifyContent: "flex-end" }}
        >
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

          <div className="cat-sort-wrap" style={{ position: "relative" }}>
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
                className="cat-sort-dropdown"
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
        ref={pillsBarRef}
        className="cat-mobile-pills-bar"
        style={{
          display: "none",
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto 10px auto",
          padding: "6px 16px 10px 16px",
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
              className={`cat-mobile-pill-btn ${active ? "cat-mobile-pill-active" : ""}`}
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

      {/* Quick Mobile Subcategory Pill Slider */}
      {isParticularCategory && subCategoriesList.length > 0 && (
        <div
          ref={subPillsBarRef}
          className="cat-mobile-subpills-bar"
          style={{
            display: "none",
            width: "100%",
            maxWidth: "1440px",
            margin: "0 auto 12px auto",
            padding: "0 16px 8px 16px",
            boxSizing: "border-box",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            gap: "8px",
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedSubCategory("")}
            className={`cat-mobile-subpill-btn ${!selectedSubCategory ? "cat-mobile-subpill-active" : ""}`}
            style={{
              flexShrink: 0,
              padding: "6px 14px",
              borderRadius: "999px",
              backgroundColor: !selectedSubCategory ? "#5D2030" : "#FFFFFF",
              color: !selectedSubCategory ? "#FFFFFF" : "#5D2030",
              border: !selectedSubCategory ? "1.5px solid #5D2030" : "1px solid #DECDBE",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: !selectedSubCategory ? 700 : 500,
              fontSize: "12px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            All {selectedCategory}
          </button>
          {subCategoriesList.map((sub) => {
            const active = selectedSubCategory.toLowerCase() === sub.toLowerCase();
            return (
              <button
                key={sub}
                type="button"
                onClick={() =>
                  setSelectedSubCategory((prev) =>
                    prev.toLowerCase() === sub.toLowerCase() ? "" : sub
                  )
                }
                className={`cat-mobile-subpill-btn ${active ? "cat-mobile-subpill-active" : ""}`}
                style={{
                  flexShrink: 0,
                  padding: "6px 14px",
                  borderRadius: "999px",
                  backgroundColor: active ? "#5D2030" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#5D2030",
                  border: active ? "1.5px solid #5D2030" : "1px solid #DECDBE",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: active ? 700 : 500,
                  fontSize: "12px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: active ? "0 2px 6px rgba(93,32,48,0.2)" : "none",
                }}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}

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
        <CategoryFiltersSidebar
          mobileFiltersOpen={mobileFiltersOpen}
          mounted={mounted}
          hasActiveFilters={hasActiveFilters}
          clearAllFilters={clearAllFilters}
          categoriesList={categoriesList}
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
          isParticularCategory={isParticularCategory}
          subCategoriesList={subCategoriesList}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
          priceBuckets={priceBuckets}
          checkedPrices={checkedPrices}
          togglePrice={togglePrice}
          sizesList={sizesList}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          coloursList={coloursList}
          selectedColour={selectedColour}
          setSelectedColour={setSelectedColour}
          brandsList={brandsList}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          fabricsList={fabricsList}
          selectedFabric={selectedFabric}
          setSelectedFabric={setSelectedFabric}
          inStockOnly={inStockOnly}
          setInStockOnly={setInStockOnly}
        />

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
              {/* Desktop Column 1: Short, Short, Tall, Short, Short, Tall */}
              <div
                className="cat-desktop-col-1"
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

              {/* Desktop Column 2: Tall, Short, Short, Tall, Short, Short */}
              <div
                className="cat-desktop-col-2"
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

              {/* Desktop Column 3: Short, Tall, Short, Short, Tall, Short */}
              <div
                className="cat-desktop-col-3"
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

              {/* Mobile Column 1: balanced alternating tall/short distribution */}
              <div
                className="cat-mobile-col-1"
                style={{
                  display: "none",
                  flexDirection: "column",
                  gap: "12px",
                  minWidth: 0,
                }}
              >
                {mobCol1.map((p) => (
                  <ProductCard
                    key={`mob1-${p.id}`}
                    product={p}
                    qty={cartMap[p.id]?.quantity || 0}
                    onQtyChange={(delta) => handleQtyChange(p, delta)}
                  />
                ))}
              </div>

              {/* Mobile Column 2: balanced alternating tall/short distribution */}
              <div
                className="cat-mobile-col-2"
                style={{
                  display: "none",
                  flexDirection: "column",
                  gap: "12px",
                  minWidth: 0,
                }}
              >
                {mobCol2.map((p) => (
                  <ProductCard
                    key={`mob2-${p.id}`}
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

    </div>
  );
}
