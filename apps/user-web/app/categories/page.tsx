"use client";

import React, { useState, useEffect } from "react";
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
} from "react-icons/fi";
import { FaFacebookF, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  isTall: boolean;
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
  },
  {
    id: "c1_2",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    category: "Casual wear",
    isTall: false,
  },
  {
    id: "c1_3",
    name: "Black and gray Exercise outfit",
    price: "$28.50",
    image: "/Categories/product_exercise_outfit.jpg",
    category: "Casual wear",
    isTall: true,
  },
  {
    id: "c1_4",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    category: "Casual wear",
    isTall: false,
  },
  {
    id: "c1_5",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    category: "Casual wear",
    isTall: false,
  },
  {
    id: "c1_6",
    name: "Black and gray Exercise outfit",
    price: "$28.50",
    image: "/Categories/product_exercise_outfit.jpg",
    category: "Casual wear",
    isTall: true,
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
  },
  {
    id: "c2_2",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    category: "Casual wear",
    isTall: false,
  },
  {
    id: "c2_3",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    category: "Casual wear",
    isTall: false,
  },
  {
    id: "c2_4",
    name: "Black and gray Exercise outfit",
    price: "$28.50",
    image: "/Categories/product_exercise_outfit.jpg",
    category: "Casual wear",
    isTall: true,
  },
  {
    id: "c2_5",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    category: "Casual wear",
    isTall: false,
  },
  {
    id: "c2_6",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    category: "Casual wear",
    isTall: false,
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
  },
  {
    id: "c3_2",
    name: "Black and gray Exercise outfit",
    price: "$28.50",
    image: "/Categories/product_exercise_outfit.jpg",
    category: "Casual wear",
    isTall: true,
  },
  {
    id: "c3_3",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    category: "Casual wear",
    isTall: false,
  },
  {
    id: "c3_4",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    category: "Casual wear",
    isTall: false,
  },
  {
    id: "c3_5",
    name: "Black and gray Exercise outfit",
    price: "$28.50",
    image: "/Categories/product_exercise_outfit.jpg",
    category: "Casual wear",
    isTall: true,
  },
  {
    id: "c3_6",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    category: "Casual wear",
    isTall: false,
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
  onAddToCart,
  inCart,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
  inCart: boolean;
}) {
  const imgHeight = product.isTall ? 572 : 230;
  const productUrl =
    product.id && product.id.length === 24
      ? `/products/${product.id}`
      : `/product?id=${encodeURIComponent(product.id)}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&img=${encodeURIComponent(product.image)}`;

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
        border: inCart ? "2px solid #BB8E43" : "1.5px solid #E3D7C5",
        padding: "12px",
        boxSizing: "border-box",
        position: "relative",
        cursor: "pointer",
        transition: "border-color 0.2s ease",
      }}
    >
      {/* In-cart indicator */}
      {inCart && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "#BB8E43",
            color: "#FFFFFF",
            fontSize: "10px",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "999px",
            zIndex: 2,
            letterSpacing: "0.5px",
          }}
        >
          In Cart
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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

          {/* Unified cart button for ALL products */}
          <button
            aria-label={inCart ? "Already in cart" : "Add to cart"}
            className="cat-cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: inCart ? "#BB8E43" : "transparent",
              border: inCart ? "none" : "1.5px solid #BB8E43",
              borderRadius: "999px",
              padding: inCart ? "5px 12px" : "5px 12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: inCart ? "#FFFFFF" : "#BB8E43",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "12px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            <FiShoppingCart size={13} />
            <span>{inCart ? "Added" : "Add to Cart"}</span>
          </button>
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
  const [selectedSize, setSelectedSize] = useState("");
  const [checkedPrices, setCheckedPrices] = useState<string[]>(["All Prices"]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Featured");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Record<string, Product & { qty: number }>>({});
  const [cartCount, setCartCount] = useState(0);

  // Backend product state
  const [products, setProducts] = useState<Product[]>([
    ...COL1_PRODUCTS,
    ...COL2_PRODUCTS,
    ...COL3_PRODUCTS,
  ]);
  const [totalCount, setTotalCount] = useState<number>(
    COL1_PRODUCTS.length + COL2_PRODUCTS.length + COL3_PRODUCTS.length
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriesList, setCategoriesList] = useState<string[]>(CATEGORIES);
  const [sizesList, setSizesList] = useState<string[]>(SIZES);

  // 1. Fetch available filter facets on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchFilters() {
      try {
        const res = await fetch("http://localhost:5000/api/products/filters");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && isMounted) {
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            const dynamicCatNames = data.categories
              .map((c: any) => c.name)
              .filter(Boolean);
            const merged = Array.from(
              new Set(["All Products", ...CATEGORIES.slice(1), ...dynamicCatNames])
            );
            setCategoriesList(merged);
          }
          if (Array.isArray(data.sizes) && data.sizes.length > 0) {
            const mergedSizes = Array.from(new Set([...SIZES, ...data.sizes]));
            setSizesList(mergedSizes);
          }
        }
      } catch (err) {
        // Keep default categories and sizes if filters endpoint fails
      }
    }
    fetchFilters();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch products whenever filters or search change
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All Products") {
          params.append("category", selectedCategory);
        }
        if (selectedSize) {
          params.append("size", selectedSize);
        }
        if (checkedPrices.length > 0 && !checkedPrices.includes("All Prices")) {
          params.append("priceRange", checkedPrices.join(";"));
        }
        if (sortBy) {
          params.append("sort", sortBy);
        }
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }

        const res = await fetch(
          `http://localhost:5000/api/products?${params.toString()}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (isMounted) {
          const rawItems = json.data || json.products || [];
          const mapped: Product[] = rawItems.map((p: any, idx: number) => {
            let formattedPrice = "$14.55";
            if (
              typeof p.price === "string" &&
              (p.price.startsWith("₹") || p.price.startsWith("$"))
            ) {
              formattedPrice = p.price;
            } else if (
              p.sellingPrice !== undefined &&
              p.sellingPrice !== null &&
              p.sellingPrice !== ""
            ) {
              formattedPrice = `₹${Number(p.sellingPrice).toLocaleString("en-IN")}`;
            } else if (
              p.price !== undefined &&
              p.price !== null &&
              p.price !== ""
            ) {
              formattedPrice = `₹${Number(p.price).toLocaleString("en-IN")}`;
            }

            const img =
              p.featuredImage ||
              p.image ||
              p.img ||
              (Array.isArray(p.images) && p.images[0]) ||
              "/Categories/product_formal_shirt.jpg";

            return {
              id: p.id || p._id || `item_${idx}`,
              name: p.productName || p.name || p.title || "Product",
              price: formattedPrice,
              image: img,
              category: p.categoryName || p.category || "General",
              isTall: false,
            };
          });

          setProducts(mapped);
          setTotalCount(
            json.total !== undefined ? json.total : mapped.length
          );
        }
      } catch (err) {
        console.error("Error loading products from backend:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedSize, checkedPrices, sortBy, searchQuery]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sree_cart");
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, Product & { qty: number }>;
        setCartItems(parsed);
        const total = Object.values(parsed).reduce((sum, i) => sum + i.qty, 0);
        setCartCount(total);
      }
    } catch {}
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev[product.id];
      const updated = {
        ...prev,
        [product.id]: {
          ...product,
          qty: existing ? existing.qty + 1 : 1,
        },
      };
      try {
        localStorage.setItem("sree_cart", JSON.stringify(updated));
      } catch {}
      const total = Object.values(updated).reduce((sum, i) => sum + i.qty, 0);
      setCartCount(total);
      return updated;
    });
    setToastMessage(`"${product.name}" added to cart!`);
    setTimeout(() => setToastMessage(null), 2800);
  };

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
          {totalCount === 0 && !loading ? (
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
                onClick={() => {
                  setSelectedCategory("All Products");
                  setSelectedSize("");
                  setCheckedPrices(["All Prices"]);
                  setSearchQuery("");
                  setSearchInput("");
                }}
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
                    onAddToCart={handleAddToCart}
                    inCart={!!cartItems[p.id]}
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
                    onAddToCart={handleAddToCart}
                    inCart={!!cartItems[p.id]}
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
                    onAddToCart={handleAddToCart}
                    inCart={!!cartItems[p.id]}
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
