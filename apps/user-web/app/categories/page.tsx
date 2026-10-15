"use client";

import React, { useState } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiPhone,
  FiMail,
  FiMapPin,
  FiArrowUpRight,
} from "react-icons/fi";
import { FaFacebookF, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";

type ActionType = "bag" | "stepper" | "view";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  isTall: boolean;
  actionType: ActionType;
}

const CATEGORIES = [
  "All Products",
  "Casual wear",
  "Sarees",
  "One Gram Jewellery",
  "Decorative Items",
];

const PRICE_RANGES = [
  { label: "All Prices" },
  { label: "Under $2,000" },
  { label: "$2,000 - $5,000" },
  { label: "Above $5,000" },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

const SORT_OPTIONS = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "New Arrivals",
];

/* Column 1 items: Short, Short, Tall, Short, Short, Tall */
const COL1_PRODUCTS: Product[] = [
  {
    id: "c1_1",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "bag",
  },
  {
    id: "c1_2",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "stepper",
  },
  {
    id: "c1_3",
    name: "Black and gray Exercise outfit",
    price: "$28.50",
    image: "/Categories/product_exercise_outfit.jpg",
    category: "Casual wear",
    isTall: true,
    actionType: "view",
  },
  {
    id: "c1_4",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "bag",
  },
  {
    id: "c1_5",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "stepper",
  },
  {
    id: "c1_6",
    name: "Black and gray Exercise outfit",
    price: "$28.50",
    image: "/Categories/product_exercise_outfit.jpg",
    category: "Casual wear",
    isTall: true,
    actionType: "view",
  },
];

/* Column 2 items: Tall, Short, Short, Tall, Short, Short */
const COL2_PRODUCTS: Product[] = [
  {
    id: "c2_1",
    name: "Black and gray Exercise outfit",
    price: "$28.50",
    image: "/Categories/product_exercise_outfit.jpg",
    category: "Casual wear",
    isTall: true,
    actionType: "bag",
  },
  {
    id: "c2_2",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "view",
  },
  {
    id: "c2_3",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "stepper",
  },
  {
    id: "c2_4",
    name: "Black and gray Exercise outfit",
    price: "$28.50",
    image: "/Categories/product_exercise_outfit.jpg",
    category: "Casual wear",
    isTall: true,
    actionType: "bag",
  },
  {
    id: "c2_5",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "view",
  },
  {
    id: "c2_6",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "stepper",
  },
];

/* Column 3 items: Short, Tall, Short, Short, Tall, Short */
const COL3_PRODUCTS: Product[] = [
  {
    id: "c3_1",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "stepper",
  },
  {
    id: "c3_2",
    name: "Black and gray Exercise outfit",
    price: "$28.50",
    image: "/Categories/product_exercise_outfit.jpg",
    category: "Casual wear",
    isTall: true,
    actionType: "view",
  },
  {
    id: "c3_3",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "bag",
  },
  {
    id: "c3_4",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "stepper",
  },
  {
    id: "c3_5",
    name: "Black and gray Exercise outfit",
    price: "$28.50",
    image: "/Categories/product_exercise_outfit.jpg",
    category: "Casual wear",
    isTall: true,
    actionType: "view",
  },
  {
    id: "c3_6",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    category: "Casual wear",
    isTall: false,
    actionType: "bag",
  },
];

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
  /* Short image: 230px, Tall image: 572px (exactly 2 * (230 + 88) + 24 - 88 = 572px) */
  const imgHeight = product.isTall ? 572 : 230;
  const productUrl = `/product?id=${encodeURIComponent(product.id)}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&img=${encodeURIComponent(product.image)}`;

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
        border: "1.5px solid #BB8E43",
        padding: "12px",
        boxSizing: "border-box",
        position: "relative",
        cursor: "pointer",
      }}
    >
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
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
          </div>

          {product.actionType === "bag" && (
            <button
              aria-label="Add to cart"
              className="cat-bag-btn"
              style={{
                background: "none",
                border: "none",
                padding: "2px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s ease",
              }}
              onClick={() => alert("Added to cart!")}
            >
              <img
                src="/Categories/bag.png"
                alt="Add to cart"
                style={{ width: "20px", height: "20px", objectFit: "contain" }}
              />
            </button>
          )}

          {product.actionType === "stepper" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#BB8E43",
                borderRadius: "999px",
                padding: "3px 10px",
                color: "#FFFFFF",
              }}
            >
              <button
                onClick={() => onQtyChange(-1)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  lineHeight: 1,
                  cursor: "pointer",
                  padding: "0 2px",
                }}
              >
                -
              </button>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  minWidth: "14px",
                  textAlign: "center",
                }}
              >
                {qty}
              </span>
              <button
                onClick={() => onQtyChange(1)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  lineHeight: 1,
                  cursor: "pointer",
                  padding: "0 2px",
                }}
              >
                +
              </button>
            </div>
          )}

          {product.actionType === "view" && (
            <a
              href={productUrl}
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "4px",
                border: "1.2px solid #BB8E43",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#BB8E43",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <FiArrowUpRight size={14} />
            </a>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedSize, setSelectedSize] = useState("S");
  const [checkedPrices, setCheckedPrices] = useState<string[]>(["All Prices"]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Featured");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const updateQty = (id: string, delta: number) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));

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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF6EE",
        overflowX: "hidden",
      }}
    >
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
          style={{ display: "none", alignItems: "center", gap: "36px" }}
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
          <button
            aria-label="Search"
            style={{
              color: "#5A2035",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FiSearch size={22} />
          </button>
          <button
            aria-label="Cart"
            style={{
              color: "#5A2035",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FiShoppingCart size={22} />
          </button>
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
            All Products
          </h1>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "20px",
              color: "#5D2030",
              fontWeight: 500,
            }}
          >
            Showing 321 results
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
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return active ? (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
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
                    onClick={() => setSelectedCategory(cat)}
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
              {PRICE_RANGES.map(({ label }) => (
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
          <div>
            <SidebarHeading>Size</SidebarHeading>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              {SIZES.map((s) => {
                const active = selectedSize === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: active ? "#BB8E43" : "transparent",
                      color: active ? "#FFFFFF" : "#5D2030",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: active ? 700 : 600,
                      fontSize: "16px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      boxShadow: active
                        ? "0 4px 12px rgba(187,142,67,0.3)"
                        : "none",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
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
          {/* Column 1: Short, Short, Tall, Short, Short, Tall */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {COL1_PRODUCTS.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                qty={quantities[p.id] ?? 1}
                onQtyChange={(d) => updateQty(p.id, d)}
              />
            ))}
          </div>

          {/* Column 2: Tall, Short, Short, Tall, Short, Short */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {COL2_PRODUCTS.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                qty={quantities[p.id] ?? 1}
                onQtyChange={(d) => updateQty(p.id, d)}
              />
            ))}
          </div>

          {/* Column 3: Short, Tall, Short, Short, Tall, Short */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {COL3_PRODUCTS.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                qty={quantities[p.id] ?? 1}
                onQtyChange={(d) => updateQty(p.id, d)}
              />
            ))}
          </div>
        </main>
      </div>

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
        .cat-bag-btn:hover { transform: scale(1.15); }
        .cat-social-btn:hover { background-color: #5D2030 !important; color: #FFFFFF !important; }
        .cat-footer-link { color: #8A7B6F; text-decoration: none; }
        .cat-footer-link:hover { color: #5D2030; text-decoration: underline; }
      `}</style>
    </div>
  );
}
