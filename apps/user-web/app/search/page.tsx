"use client";

import React, { useState, useMemo, useRef, useEffect, Suspense } from "react";
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
} from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

/* ─────────────────────────────────────────────
   Product data
───────────────────────────────────────────── */
const ALL_PRODUCTS = [
  // Indian Fashion
  {
    id: "p1",
    name: "Formal Shirt For Woman",
    price: 1455,
    category: "Indian Fashion",
    tag: "Casual",
    image: "/Categories/product_formal_shirt.jpg",
    badge: null,
  },
  {
    id: "p2",
    name: "Black and Gray Exercise Outfit",
    price: 1899,
    category: "Indian Fashion",
    tag: "Casual",
    image: "/Categories/product_exercise_outfit.jpg",
    badge: "New",
  },
  {
    id: "p3",
    name: "Yellow Jacket For Winter",
    price: 3455,
    category: "Indian Fashion",
    tag: "Ethnic Wear",
    image: "/Categories/product_yellow_jacket.jpg",
    badge: null,
  },
  {
    id: "p4",
    name: "Yellow Jacket For Winter",
    price: 3199,
    category: "Indian Fashion",
    tag: "Ethnic Wear",
    image: "/Categories/product_yellow_jacket.jpg",
    badge: "Sale",
  },
  {
    id: "p5",
    name: "Black and Gray Exercise Outfit",
    price: 1999,
    category: "Indian Fashion",
    tag: "Casual",
    image: "/Categories/product_exercise_outfit.jpg",
    badge: null,
  },
  {
    id: "p6",
    name: "Formal Shirt For Woman",
    price: 1455,
    category: "Indian Fashion",
    tag: "Casual",
    image: "/Categories/product_formal_shirt.jpg",
    badge: null,
  },
  // Jewellery
  {
    id: "p7",
    name: "Temple Gold Necklace Set",
    price: 4500,
    category: "Jewellery",
    tag: "Jewellery",
    image: "/homepage/mosaic_necklace.jpg",
    badge: "New",
  },
  {
    id: "p8",
    name: "Bridal Choker Set",
    price: 6200,
    category: "Jewellery",
    tag: "Jewellery",
    image: "/homepage/mosaic_necklace.jpg",
    badge: null,
  },
  // Decor
  {
    id: "p9",
    name: "Festive Diya Set",
    price: 799,
    category: "Decor & Celebration",
    tag: "Decor",
    image: "/homepage/decor_handicraft.jpg",
    badge: "Sale",
  },
  {
    id: "p10",
    name: "Wedding Door Toran",
    price: 1200,
    category: "Decor & Celebration",
    tag: "Decor",
    image: "/homepage/decor_lights.jpg",
    badge: null,
  },
  {
    id: "p11",
    name: "Black and Gray Exercise Outfit",
    price: 1799,
    category: "Indian Fashion",
    tag: "Casual",
    image: "/Categories/product_exercise_outfit.jpg",
    badge: null,
  },
  {
    id: "p12",
    name: "Formal Shirt For Woman",
    price: 1555,
    category: "Indian Fashion",
    tag: "Ethnic Wear",
    image: "/Categories/product_formal_shirt.jpg",
    badge: "New",
  },
];

const FILTER_CHIPS = [
  { label: "Indian Fashion", value: "Indian Fashion" },
  { label: "Ethnic Wear", value: "Ethnic Wear" },
  { label: "Jewellery", value: "Jewellery" },
  { label: "Decor & Celebration", value: "Decor & Celebration" },
];

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
   Product Card
───────────────────────────────────────────── */
function ProductCard({ product }: { product: (typeof ALL_PRODUCTS)[0] }) {
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="srch-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
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
            backgroundColor: product.badge === "Sale" ? "#5A2035" : "#BB8E43",
            color: "#FFF",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            padding: "3px 10px",
            borderRadius: "999px",
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
          backgroundColor: "rgba(255,255,255,0.88)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          transition: "all 0.2s ease",
          opacity: hovered ? 1 : 0,
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
          src={product.image}
          alt={product.name}
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
            fontSize: "13px",
            color: "#A08060",
            margin: "0 0 4px 0",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
          }}
        >
          From {fmtPrice(product.price)}
        </p>
        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "15px",
            fontWeight: 700,
            color: "#2F2C24",
            margin: "0 0 12px 0",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>

        {/* Action Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            className="srch-add-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "transparent",
              border: "1.5px solid #BB8E43",
              color: "#BB8E43",
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
            <FiShoppingBag size={13} />
            Add
          </button>

          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#5A2035",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            {fmtPrice(product.price)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Search Page (inner, uses useSearchParams)
───────────────────────────────────────────── */
function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [inputVal, setInputVal] = useState(initialQuery);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = ALL_PRODUCTS;

    if (activeChip) {
      list = list.filter(
        (p) => p.category === activeChip || p.tag === activeChip
      );
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q)
      );
    }

    return list;
  }, [query, activeChip]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(inputVal);
    router.replace(`/search?q=${encodeURIComponent(inputVal)}`, {
      scroll: false,
    });
  }

  function handleChip(val: string) {
    setActiveChip((prev) => (prev === val ? null : val));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF6EE",
        color: "#2F2C24",
        overflowX: "hidden",
      }}
    >
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

          <a
            href="/product"
            aria-label="Cart"
            style={{
              color: "#5A2035",
              display: "flex",
              alignItems: "center",
              padding: "4px",
            }}
          >
            <FiShoppingCart size={21} />
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="srch-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
          style={{
            display: "none",
            color: "#5A2035",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px",
          }}
        >
          {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
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
            lineHeight: 1.2,
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
            maxWidth: "660px",
            margin: "0 auto 22px auto",
            boxShadow: "0 8px 30px rgba(90,32,53,0.10)",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1.5px solid #E8D9C5",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              padding: "0 18px",
              gap: "10px",
            }}
          >
            <FiSearch size={18} color="#BB8E43" strokeWidth={2} />
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
                onClick={() => {
                  setInputVal("");
                  setQuery("");
                  inputRef.current?.focus();
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#A08060",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                }}
                aria-label="Clear search"
              >
                <FiX size={16} />
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
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              padding: "16px 30px",
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

        {/* ── Filter Chips ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {FILTER_CHIPS.map((chip) => {
            const isActive = activeChip === chip.value;
            return (
              <button
                key={chip.value}
                onClick={() => handleChip(chip.value)}
                className="srch-chip"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  padding: "7px 18px",
                  borderRadius: "999px",
                  border: `1.5px solid ${isActive ? "#5A2035" : "#D5C4B0"}`,
                  backgroundColor: isActive ? "#5A2035" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#5A2035",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
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
        {/* Results count */}
        {(query || activeChip) && (
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "14px",
              color: "#8A7B6F",
              marginBottom: "24px",
            }}
          >
            {filteredProducts.length === 0
              ? "No products found."
              : `Showing ${filteredProducts.length} result${filteredProducts.length !== 1 ? "s" : ""}${query ? ` for "${query}"` : ""}${activeChip ? ` in ${activeChip}` : ""}`}
          </p>
        )}

        {filteredProducts.length === 0 && (
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
              No results found
            </h2>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "15px",
                color: "#8A7B6F",
                maxWidth: "380px",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Try a different keyword or browse through our collections below.
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
        {filteredProducts.length > 0 && (
          <div
            className="srch-masonry-grid"
            style={{
              columns: "4 260px",
              columnGap: "22px",
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <div
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "0 32px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{ width: "100%", height: "1px", backgroundColor: "#D4C5B0" }}
        />
      </div>

      <footer
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "38px 32px 30px 32px",
          boxSizing: "border-box",
        }}
      >
        {/* Footer Top Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "28px",
            marginBottom: "34px",
          }}
        >
          <a href="/">
            <img
              src="/homepage/logo2_trans.png"
              alt="Sree Collections"
              style={{ height: "64px", objectFit: "contain" }}
            />
          </a>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "flex-end",
            }}
            className="srch-footer-contact"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#5A2035",
              }}
            >
              <span>📍</span>
              <span>1985 Mulberry Oak, Suite 41, Chattahoochee, GA 30545</span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "22px", flexWrap: "wrap" }}
            >
              {[
                { icon: <FiPhone size={13} />, text: "+91 86765 43210" },
                { icon: <FiMail size={13} />, text: "sreecollections47@gmail.com" },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    fontSize: "13px",
                    color: "#5A2035",
                  }}
                >
                  {icon}
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { icon: <FaFacebookF size={12} />, label: "Facebook" },
                { icon: <FaInstagram size={12} />, label: "Instagram" },
                { icon: <FaYoutube size={12} />, label: "YouTube" },
                { icon: <FaWhatsapp size={12} />, label: "WhatsApp" },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="srch-social-btn"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "1px solid #5A2035",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#5A2035",
                    transition: "all 0.2s ease",
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          style={{
            borderTop: "1px solid #E5D9C8",
            paddingTop: "20px",
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
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {[
              { name: "About Us", href: "/about" },
              { name: "Contact Us", href: "/contact" },
              { name: "Careers", href: "#" },
              { name: "Privacy Policy", href: "#" },
              { name: "Terms & Conditions", href: "#" },
            ].map(({ name, href }) => (
              <a key={name} href={href} className="srch-footer-link">
                {name}
              </a>
            ))}
          </div>
          <span style={{ textTransform: "none", letterSpacing: 0 }}>
            &copy; {new Date().getFullYear()} Sree Collections. All Rights
            Reserved.
          </span>
        </div>
      </footer>

      {/* ═══════════ SCOPED CSS ═══════════ */}
      <style>{`
        @media (min-width: 992px) {
          .srch-desktop-nav { display: flex !important; }
        }
        @media (max-width: 991px) {
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
        .srch-footer-link { color: #8A7B6F; text-decoration: none; }
        .srch-footer-link:hover { color: #5A2035; text-decoration: underline; }

        @keyframes srchFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .srch-card {
          animation: srchFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Exported page — wraps inner in Suspense
   (required because useSearchParams needs it)
───────────────────────────────────────────── */
export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}
