"use client";

import React, { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiHeart,
  FiPhone,
  FiMail,
  FiShoppingBag,
  FiCheck,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { API_BASE } from "@/lib/config";

/* ─────────────────────────────────────────────
   Product Interface
───────────────────────────────────────────── */
interface BackendProduct {
  id: string;
  code: string;
  name: string;
  price: number;
  rawPrice: number;
  mrp: number;
  category: string;
  categoryName: string;
  subCategory: string;
  brand: string;
  image: string;
  images: string[];
  badge?: string | null;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function fmtPrice(p: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(p);
}

/* ─────────────────────────────────────────────
   Product Card Component
───────────────────────────────────────────── */
function ProductCard({
  product,
  onAddToCart,
}: {
  product: BackendProduct;
  onAddToCart: (p: BackendProduct) => void;
}) {
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image || "/Categories/product_formal_shirt.jpg");
  const [addedAnim, setAddedAnim] = useState(false);

  useEffect(() => {
    setImgSrc(product.image || "/Categories/product_formal_shirt.jpg");
  }, [product.image]);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const productUrl = `/products/${product.id}`;

  return (
    <div
      className="srch-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        window.location.href = productUrl;
      }}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 18px 42px rgba(90,32,53,0.14)"
          : "0 4px 18px rgba(90,32,53,0.07)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
        cursor: "pointer",
        position: "relative",
        breakInside: "avoid",
        marginBottom: "24px",
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            zIndex: 3,
            backgroundColor:
              product.badge === "SALE" || product.badge.includes("OFF") || product.badge === "Sale"
                ? "#4A1525"
                : "#BB8E43",
            color: "#FFF",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {product.badge}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setWished(!wished);
        }}
        className="srch-wish-btn"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 3,
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.92)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          transition: "all 0.2s ease",
          opacity: hovered ? 1 : 0.8,
        }}
        aria-label="Wishlist"
      >
        <FiHeart
          size={16}
          style={{
            color: wished ? "#5A2035" : "#888",
            fill: wished ? "#5A2035" : "none",
            transition: "all 0.2s",
          }}
        />
      </button>

      {/* Product Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/5",
          overflow: "hidden",
          backgroundColor: "#F5F0EA",
        }}
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc("/Categories/product_formal_shirt.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>

      {/* Card Details */}
      <div style={{ padding: "14px 14px 16px 14px" }}>
        <p
          style={{
            fontSize: "12px",
            color: "#A08060",
            margin: "0 0 4px 0",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {product.category || "Collection"}
        </p>

        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "15px",
            fontWeight: 700,
            color: "#2F2C24",
            margin: "0 0 10px 0",
            lineHeight: 1.35,
            minHeight: "38px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Action Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <button
            onClick={handleAdd}
            className="srch-add-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: addedAnim ? "#5A2035" : "transparent",
              border: `1.5px solid ${addedAnim ? "#5A2035" : "#BB8E43"}`,
              color: addedAnim ? "#FFFFFF" : "#BB8E43",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              padding: "7px 14px",
              borderRadius: "999px",
              cursor: "pointer",
              transition: "all 0.22s ease",
              textTransform: "uppercase",
            }}
            aria-label="Add to cart"
          >
            {addedAnim ? <FiCheck size={13} strokeWidth={2.5} /> : <FiShoppingBag size={13} />}
            {addedAnim ? "Added" : "Add"}
          </button>

          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#5A2035",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {fmtPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span
                style={{
                  fontSize: "11px",
                  color: "#9A8A7A",
                  textDecoration: "line-through",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {fmtPrice(product.mrp)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Search Page Component
───────────────────────────────────────────── */
function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("category") ?? null;

  const [inputVal, setInputVal] = useState(urlQuery);
  const [activeCategory, setActiveCategory] = useState<string | null>(urlCategory);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize cart count from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sree_cart");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const count = arr.reduce((sum: number, it: any) => sum + (Number(it.quantity) || 1), 0);
          setCartCount(count);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // 1. Fetch any 5 categories from backend ONLY
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE}/categories?status=Active`);
        if (res.ok) {
          const json = await res.json();
          const items: any[] = json.data || json || [];
          const sorted = items
            .filter((c: any) => {
              const name = typeof c === "string" ? c : c.name;
              return Boolean(name) && !name.toLowerCase().includes("test");
            })
            .sort((a: any, b: any) => {
              const countA = typeof a.itemCount === "number" ? a.itemCount : 0;
              const countB = typeof b.itemCount === "number" ? b.itemCount : 0;
              return countB - countA;
            });

          const catNames: string[] = sorted.map((c: any) => (typeof c === "string" ? c : c.name));
          // Take any 5 categories from backend
          const fiveCategories = catNames.slice(0, 5);
          if (isMounted && fiveCategories.length > 0) {
            setCategories(fiveCategories);
            return;
          }
        }

        // Fallback: fetch from /products/filters
        const facetRes = await fetch(`${API_BASE}/products/filters`);
        if (facetRes.ok) {
          const facetJson = await facetRes.json();
          const facetData = facetJson?.data || facetJson || {};
          const facetCats: string[] = (facetData.categories || [])
            .map((c: any) => c.name)
            .filter((name: string) => Boolean(name) && name !== "All Products" && !name.toLowerCase().includes("test"));

          const fiveCategories = facetCats.slice(0, 5);
          if (isMounted && fiveCategories.length > 0) {
            setCategories(fiveCategories);
          }
        }
      } catch {
        /* ignore */
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch products from MongoDB database based on search query and category
  const loadProducts = useCallback(async (queryStr: string, catStr: string | null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("status", "Active");
      params.append("limit", "100");

      if (queryStr.trim()) {
        params.append("search", queryStr.trim());
      }
      if (catStr && catStr !== "All Products") {
        params.append("category", catStr);
      }

      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const rawItems: any[] = json.data || json.products || [];
      const mapped: BackendProduct[] = rawItems.map((p: any, idx: number) => {
        const selling =
          Number(p.sellingPrice) ||
          Number(p.rawPrice) ||
          (typeof p.price === "number" ? p.price : 0) ||
          0;
        const mrp = Number(p.mrp) || 0;

        let badge: string | null = p.badge || null;
        if (!badge) {
          if (mrp > selling && selling > 0) {
            badge = "SALE";
          } else if (p.isNewArrival) {
            badge = "NEW";
          } else if (p.featured) {
            badge = "FEATURED";
          } else if (p.isBestSeller) {
            badge = "BESTSELLER";
          }
        }

        const mainImg =
          p.featuredImage ||
          p.image ||
          p.img ||
          (Array.isArray(p.images) && p.images[0]) ||
          (Array.isArray(p.colourImages) && p.colourImages[0]?.primaryImage) ||
          "/Categories/product_formal_shirt.jpg";

        return {
          id: String(p.id || p._id || `item_${idx}`),
          code: p.productCode || p.sku || `PRD-${idx + 1}`,
          name: p.productName || p.name || p.title || "Product",
          price: selling,
          rawPrice: selling,
          mrp,
          category: p.categoryName || (typeof p.category === "string" ? p.category : "Collection"),
          categoryName: p.categoryName || (typeof p.category === "string" ? p.category : "Collection"),
          subCategory: p.subCategory || "",
          brand: p.brand || "",
          image: mainImg,
          images: Array.isArray(p.images) ? p.images : [],
          badge,
          featured: Boolean(p.featured),
          isNewArrival: Boolean(p.isNewArrival),
          isBestSeller: Boolean(p.isBestSeller),
        };
      });

      setProducts(mapped);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when URL params change
  useEffect(() => {
    setInputVal(urlQuery);
    setActiveCategory(urlCategory);
    loadProducts(urlQuery, urlCategory);
  }, [urlQuery, urlCategory, loadProducts]);

  // Handle Search Submission
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = inputVal.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (activeCategory) params.set("category", activeCategory);

    const qs = params.toString();
    router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
    loadProducts(q, activeCategory);
  }

  // Handle Clear Search
  function handleClearSearch() {
    setInputVal("");
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    const qs = params.toString();
    router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
    loadProducts("", activeCategory);
    inputRef.current?.focus();
  }

  // Handle Category Chip Click
  function handleCategoryClick(catName: string) {
    const nextCat = activeCategory === catName ? null : catName;
    setActiveCategory(nextCat);

    const params = new URLSearchParams();
    if (inputVal.trim()) params.set("q", inputVal.trim());
    if (nextCat) params.set("category", nextCat);

    const qs = params.toString();
    router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
    loadProducts(inputVal.trim(), nextCat);
  }

  // Add to cart handler
  const handleAddToCart = (product: BackendProduct) => {
    try {
      const raw = localStorage.getItem("sree_cart");
      const cart: any[] = raw ? JSON.parse(raw) : [];

      const existingIdx = cart.findIndex((i: any) => i.id === product.id);
      if (existingIdx >= 0) {
        cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          rawPrice: product.price,
          quantity: 1,
          image: product.image,
          category: product.category,
        });
      }

      localStorage.setItem("sree_cart", JSON.stringify(cart));
      const total = cart.reduce((s: number, i: any) => s + (Number(i.quantity) || 1), 0);
      setCartCount(total);

      setToastMessage(`"${product.name}" added to cart!`);
      setTimeout(() => setToastMessage(null), 2500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF6EE",
        color: "#2F2C24",
        overflowX: "hidden",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: "#5D2030",
            color: "#FFFFFF",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "14px",
            fontWeight: 600,
            padding: "14px 24px",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(93,32,48,0.35)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid #BB8E43",
            animation: "srchFadeUp 0.3s ease",
          }}
        >
          <FiShoppingBag size={17} color="#BB8E43" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ═══════════ HEADER ═══════════ */}
      <header
        style={{
          width: "100%",
          maxWidth: "1360px",
          margin: "0 auto",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <a href="/" style={{ display: "inline-block", flexShrink: 0 }}>
          <img
            src="/homepage/logo2_trans.png"
            alt="Sree Collections"
            style={{ height: "66px", width: "auto", objectFit: "contain" }}
          />
        </a>

        {/* Desktop Nav */}
        <nav
          className="srch-desktop-nav"
          style={{ display: "none", alignItems: "center", gap: "36px" }}
        >
          {[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Categories", href: "/categories" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="srch-nav-link"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "17px",
                fontWeight: 700,
                color: "#5A2035",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
            >
              {label}
            </a>
          ))}

          <a
            href="/contact"
            className="srch-contact-btn"
            style={{
              backgroundColor: "#BB8E43",
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              padding: "11px 26px",
              borderRadius: "999px",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(187,142,67,0.25)",
              transition: "all 0.2s ease",
            }}
          >
            Contact Us
          </a>

          {/* Search Icon — active on this page */}
          <button
            aria-label="Search"
            onClick={() => inputRef.current?.focus()}
            style={{
              color: "#BB8E43",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiSearch size={21} strokeWidth={2.5} />
          </button>

          {/* Cart Icon */}
          <a
            href="/cart"
            aria-label="Cart"
            style={{
              color: "#5A2035",
              display: "flex",
              alignItems: "center",
              padding: "4px",
              position: "relative",
              textDecoration: "none",
            }}
          >
            <FiShoppingCart size={21} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-8px",
                  backgroundColor: "#BB8E43",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  fontWeight: 700,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(187,142,67,0.4)",
                }}
              >
                {cartCount}
              </span>
            )}
          </a>
        </nav>

        {/* Mobile Right Actions: Cart + Hamburger */}
        <div
          className="mobile-header-actions"
          style={{
            display: "none",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <a
            href="/cart"
            aria-label="Cart"
            style={{
              color: "#5A2035",
              display: "flex",
              alignItems: "center",
              padding: "6px",
              position: "relative",
              textDecoration: "none",
            }}
          >
            <FiShoppingCart size={21} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-4px",
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
                  boxShadow: "0 2px 6px rgba(187,142,67,0.4)",
                }}
              >
                {cartCount}
              </span>
            )}
          </a>

          <button
            className="srch-hamburger mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            style={{
              color: "#5A2035",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
            }}
          >
            {mobileMenuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
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
              backgroundColor: "#FAF6EE",
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
                <FiX size={22} color="#5A2035" />
              </button>
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                marginTop: "10px",
              }}
            >
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Categories", href: "/categories" },
                { label: "Cart", href: "/cart" },
                { label: "Contact Us", href: "/contact" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: "17px",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 500,
                    color: "#3D3028",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ═══════════ HERO SEARCH SECTION ═══════════ */}
      <section
        style={{
          width: "100%",
          maxWidth: "860px",
          margin: "20px auto 40px auto",
          padding: "0 24px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Hero headline */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(26px, 4.5vw, 44px)",
            fontWeight: 700,
            color: "#5A2035",
            lineHeight: 1.25,
            margin: "0 0 12px 0",
          }}
        >
          Looking for something special?{" "}
          <em style={{ fontStyle: "italic", color: "#BB8E43" }}>
            Your perfect find is just a search away.
          </em>
        </h1>

        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            color: "#8A7B6F",
            lineHeight: 1.65,
            margin: "0 0 32px 0",
            maxWidth: "540px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Search across our curated Indian fashion, exquisite jewellery, and
          beautiful décor collections — all in one place.
        </p>

        {/* ── Search Bar ── */}
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0",
            maxWidth: "680px",
            margin: "0 auto 28px auto",
            boxShadow: "0 6px 26px rgba(90,32,53,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1.5px solid #E4D7C8",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              padding: "0 20px",
              gap: "12px",
            }}
          >
            <FiSearch size={20} color="#BB8E43" strokeWidth={2.2} />
            <input
              ref={inputRef}
              type="text"
              id="srch-input"
              placeholder="Search"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "15px",
                color: "#2F2C24",
                padding: "16px 0",
              }}
            />
            {inputVal && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9A8573",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px",
                  borderRadius: "50%",
                  transition: "background 0.2s",
                }}
                aria-label="Clear search"
              >
                <FiX size={17} strokeWidth={2.2} />
              </button>
            )}
          </div>

          <button
            type="submit"
            id="srch-submit-btn"
            style={{
              backgroundColor: "#BB8E43",
              color: "#FFFFFF",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              padding: "16px 32px",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.2s ease",
              flexShrink: 0,
            }}
            className="srch-submit-btn"
          >
            SEARCH
          </button>
        </form>

        {/* ── Category Chips (Any 5 categories from backend only) ── */}
        {categories.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            {categories.map((catName) => {
              const isActive = activeCategory === catName;
              return (
                <button
                  key={catName}
                  type="button"
                  onClick={() => handleCategoryClick(catName)}
                  className="srch-chip"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    padding: "8px 22px",
                    borderRadius: "999px",
                    border: `1.5px solid ${isActive ? "#5A2035" : "#D4C4B2"}`,
                    backgroundColor: isActive ? "#5A2035" : "#FFFFFF",
                    color: isActive ? "#FFFFFF" : "#5A2035",
                    cursor: "pointer",
                    transition: "all 0.22s ease",
                    boxShadow: isActive ? "0 4px 12px rgba(90,32,53,0.25)" : "0 2px 6px rgba(0,0,0,0.03)",
                  }}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════ RESULTS SECTION ═══════════ */}
      <main
        style={{
          width: "100%",
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 28px 80px 28px",
          boxSizing: "border-box",
        }}
      >
        {/* Results count indicator */}
        {!loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "14px",
                color: "#8A7B6F",
                margin: 0,
              }}
            >
              {products.length === 0
                ? "No products found."
                : `Showing ${products.length} product${products.length !== 1 ? "s" : ""}${inputVal ? ` for "${inputVal}"` : ""}${activeCategory ? ` in ${activeCategory}` : ""}`}
            </p>

            {activeCategory && (
              <button
                type="button"
                onClick={() => handleCategoryClick(activeCategory)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#BB8E43",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Clear category filter ({activeCategory})
              </button>
            )}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "70px 20px",
              color: "#5A2035",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                border: "3px solid #E8D9C5",
                borderTopColor: "#BB8E43",
                borderRadius: "50%",
                animation: "srchSpin 0.8s linear infinite",
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>
              Searching products in database...
            </span>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <FiSearch size={52} color="#D5C4B0" strokeWidth={1.5} />
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "26px",
                color: "#5A2035",
                fontWeight: 700,
                margin: 0,
              }}
            >
              No products found
            </h2>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "15px",
                color: "#8A7B6F",
                maxWidth: "400px",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              We couldn&apos;t find any items matching your search. Try another keyword or browse our complete collections.
            </p>
            <a
              href="/categories"
              style={{
                marginTop: "8px",
                backgroundColor: "#BB8E43",
                color: "#FFFFFF",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                padding: "12px 30px",
                borderRadius: "999px",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              className="srch-browse-btn"
            >
              Browse Collections
            </a>
          </div>
        )}

        {/* ── Masonry Grid ── */}
        {!loading && products.length > 0 && (
          <div
            className="srch-masonry-grid"
            style={{
              columns: "4 260px",
              columnGap: "22px",
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* ═══════════ SCOPED CSS ═══════════ */}
      <style>{`
        @media (min-width: 992px) {
          .srch-desktop-nav { display: flex !important; }
          .mobile-header-actions { display: none !important; }
        }
        @media (max-width: 991px) {
          .srch-desktop-nav { display: none !important; }
          .mobile-header-actions { display: flex !important; }
          .srch-hamburger { display: flex !important; }
          .srch-footer-contact { align-items: flex-start !important; }
        }
        @media (max-width: 640px) {
          .srch-masonry-grid { columns: 2 !important; column-gap: 14px !important; }
        }
        @media (max-width: 420px) {
          .srch-masonry-grid { columns: 1 !important; }
        }

        .srch-nav-link:hover { opacity: 0.72; }
        .srch-contact-btn:hover { filter: brightness(1.09); transform: translateY(-2px); }
        .srch-submit-btn:hover { background-color: #a07a38 !important; }
        .srch-chip:hover { border-color: #5A2035 !important; }
        .srch-wish-btn:hover { transform: scale(1.12); }
        .srch-add-btn:hover {
          background-color: #BB8E43 !important;
          color: #FFFFFF !important;
        }
        .srch-browse-btn:hover { background-color: #a07a38 !important; }
        .srch-social-btn:hover {
          background-color: #5A2035 !important;
          color: #FFFFFF !important;
        }

        @keyframes srchFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes srchSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .srch-card {
          animation: srchFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Exported Search Page (wrapped in Suspense)
───────────────────────────────────────────── */
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#FAF6EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#5A2035",
          }}
        >
          Loading Search...
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
