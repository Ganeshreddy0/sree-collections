"use client";

import React, { useState } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCheckCircle,
  FiTruck,
  FiHeart,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { FaFacebookF, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";

interface RelatedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  actionType: "bag" | "stepper";
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  colorHex: string;
  colorName: string;
  quantity: number;
}

const RELATED_PRODUCTS: RelatedProduct[] = [
  {
    id: "rp1",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    actionType: "bag",
  },
  {
    id: "rp2",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    actionType: "stepper",
  },
  {
    id: "rp3",
    name: "Yellow Jacket For Winter",
    price: "$14.55",
    image: "/Categories/product_yellow_jacket.jpg",
    actionType: "stepper",
  },
  {
    id: "rp4",
    name: "Formal Shirt For Woman",
    price: "$14.55",
    image: "/Categories/product_formal_shirt.jpg",
    actionType: "bag",
  },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

const COLORS = [
  { id: "maroon", name: "Maroon", hex: "#6B2433" },
  { id: "black", name: "Charcoal Black", hex: "#1F1E1D" },
  { id: "olive", name: "Olive Green", hex: "#888235" },
  { id: "teal", name: "Teal Blue", hex: "#2A6D7E" },
  { id: "berry", name: "Berry Magenta", hex: "#AB357B" },
];

const THUMBNAILS = [
  { id: "t0", src: "/Categories/product_exercise_outfit.jpg", alt: "Outfit model" },
  { id: "t1", src: "/product/thumb1.jpg", alt: "Fabric wash care" },
  { id: "t2", src: "/product/thumb2.jpg", alt: "Detergent care" },
  { id: "t3", src: "/product/thumb3.jpg", alt: "Care demonstration" },
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

export default function ProductDetailPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("black");
  const [productName, setProductName] = useState("Black and gray Exercise outfit");
  const [productPrice, setProductPrice] = useState("$195.00");
  const [activeImage, setActiveImage] = useState("/Categories/product_exercise_outfit.jpg");
  const [relatedQuantities, setRelatedQuantities] = useState<Record<string, number>>({});
  const [wishlistActive, setWishlistActive] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const name = params.get("name");
      const price = params.get("price");
      const img = params.get("img");
      if (name) setProductName(name);
      if (price) setProductPrice(price);
      if (img) setActiveImage(img);
    }
  }, []);

  // Accordion states
  const [fittingOpen, setFittingOpen] = useState(false);
  const [fabricOpen, setFabricOpen] = useState(true);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(true);

  // Cart & Checkout state
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const handleAddToCart = () => {
    const rawNum = parseFloat(productPrice.replace(/[^0-9.]/g, ""));
    const priceNum = isNaN(rawNum) || rawNum <= 0 ? 195.0 : rawNum;
    const colorObj = COLORS.find((c) => c.id === selectedColor) || COLORS[0];
    const itemSize = selectedSize === "M" ? "28" : selectedSize;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.name === productName && it.size === itemSize && it.colorHex === colorObj.hex
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [
        {
          id: `item_${Date.now()}`,
          name: productName,
          price: priceNum,
          image: activeImage,
          size: itemSize,
          colorHex: colorObj.hex,
          colorName: colorObj.name,
          quantity: quantity,
        },
        ...prev,
      ];
    });
    setCartOpen(true);
  };

  const updateCartItemQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const next = it.quantity + delta;
            return next > 0 ? { ...it, quantity: next } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleAddRelatedToCart = (prod: RelatedProduct) => {
    const rawNum = parseFloat(prod.price.replace(/[^0-9.]/g, ""));
    const priceNum = isNaN(rawNum) || rawNum <= 0 ? 14.55 : rawNum;
    const qty = relatedQuantities[prod.id] ?? 1;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((it) => it.name === prod.name);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += qty;
        return copy;
      }
      return [
        {
          id: `related_${prod.id}_${Date.now()}`,
          name: prod.name,
          price: priceNum,
          image: prod.image,
          size: "M",
          colorHex: "#6B2433",
          colorName: "Maroon",
          quantity: qty,
        },
        ...prev,
      ];
    });
    setCartOpen(true);
  };

  const updateRelatedQty = (id: string, delta: number) => {
    setRelatedQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  const subtotal = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal - discount);
  const totalItemsCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

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
          className="prod-desktop-nav"
          style={{ display: "none", alignItems: "center", gap: "36px" }}
        >
          <NavLink href="/">Home</NavLink>
          <NavLink href="/#about">About</NavLink>
          <NavLink href="/categories">Categories</NavLink>
          <a
            href="/contact"
            className="prod-contact-btn"
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
          <a
            href="/search"
            aria-label="Search"
            style={{
              color: "#5A2035",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiSearch size={22} />
          </a>
          <button
            onClick={() => setCartOpen(!cartOpen)}
            aria-label="Cart"
            style={{
              color: "#5A2035",
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiShoppingCart size={22} />
            {totalItemsCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-7px",
                  right: "-9px",
                  backgroundColor: "#BB8E43",
                  color: "#FFFFFF",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {totalItemsCount}
              </span>
            )}
          </button>
        </nav>
        <button
          className="prod-hamburger"
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
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "16px", fontWeight: 500 }}
              >
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* BREADCRUMBS */}
      <div
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "16px auto 28px",
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "14px",
            color: "#8A796B",
          }}
        >
          <a
            href="/categories"
            style={{ color: "#8A796B", textDecoration: "none" }}
          >
            Categories
          </a>
          <span>/</span>
          <a
            href="/categories"
            style={{ color: "#8A796B", textDecoration: "none" }}
          >
            Casual Wear
          </a>
          <span>/</span>
          <span style={{ color: "#5D2030", fontWeight: 600 }}>
            {productName}
          </span>
        </div>
      </div>

      {/* PRODUCT TOP SECTION */}
      <div
        className="prod-showcase-grid"
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto 60px",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "54px",
          alignItems: "start",
          boxSizing: "border-box",
        }}
      >
        {/* Left Column: Image and Thumbnails */}
        <div>
          {/* Main Image */}
          <div
            style={{
              width: "100%",
              height: "560px",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "#F5EFE5",
              boxShadow: "0 10px 30px rgba(93,32,48,0.06)",
            }}
          >
            <img
              src={activeImage}
              alt="Black and gray Exercise outfit"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "opacity 0.3s ease",
              }}
            />
          </div>

          {/* Thumbnails Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginTop: "18px",
            }}
          >
            {THUMBNAILS.slice(1).map((thumb) => (
              <div
                key={thumb.id}
                onClick={() => setActiveImage(thumb.src)}
                style={{
                  height: "128px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border:
                    activeImage === thumb.src
                      ? "2px solid #BB8E43"
                      : "1.5px solid transparent",
                  backgroundColor: "#F5EFE5",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                }}
              >
                <img
                  src={thumb.src}
                  alt={thumb.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Product Purchase Info */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Title */}
          <h1
            style={{
              fontFamily: "'Playfair Display', 'Blacker Display', Georgia, serif",
              fontWeight: 700,
              fontSize: "38px",
              lineHeight: 1.2,
              color: "#5D2030",
              margin: "0 0 14px 0",
            }}
          >
            {productName}
          </h1>

          {/* Rating and Stock Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ color: "#BB8E43", fontSize: "16px", letterSpacing: "2px" }}>
                ★★★★★
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#5D2030",
                  marginLeft: "4px",
                }}
              >
                5.00 Rating
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FiCheckCircle size={16} color="#16A34A" />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#16A34A",
                }}
              >
                In Stock
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "14px",
              lineHeight: 1.65,
              color: "#756658",
              margin: "0 0 24px 0",
            }}
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat.
          </p>

          {/* Quantity & Price Row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "26px",
            }}
          >
            {/* Quantity */}
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#5D2030",
                  marginBottom: "8px",
                }}
              >
                Quantity
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid #D6C8B8",
                  borderRadius: "4px",
                  overflow: "hidden",
                  backgroundColor: "#FAF6EE",
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    fontSize: "16px",
                    color: "#5D2030",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
                <span
                  style={{
                    width: "40px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "#5D2030",
                    borderLeft: "1px solid #D6C8B8",
                    borderRight: "1px solid #D6C8B8",
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    fontSize: "16px",
                    color: "#5D2030",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price */}
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "36px",
                  lineHeight: 1,
                  color: "#5D2030",
                }}
              >
                {productPrice}
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "12px",
                  color: "#8E7F73",
                  marginTop: "4px",
                }}
              >
                +12% VAT Added
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="prod-cart-btn"
            style={{
              width: "100%",
              height: "54px",
              borderRadius: "999px",
              backgroundColor: "#BB8E43",
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(187,142,67,0.3)",
              marginBottom: "32px",
              transition: "transform 0.2s ease, filter 0.2s ease",
            }}
          >
            Add to Cart
          </button>

          {/* Select Size */}
          <div style={{ marginBottom: "28px" }}>
            <h3
              style={{
                fontFamily: "'Playfair Display', 'Blacker Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 14px 0",
              }}
            >
              Select Size
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                maxWidth: "420px",
              }}
            >
              {SIZES.map((s) => {
                const active = selectedSize === s;
                return active ? (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      backgroundColor: "#BB8E43",
                      color: "#FFFFFF",
                      borderRadius: "999px",
                      padding: "8px 24px",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 3px 10px rgba(187,142,67,0.25)",
                    }}
                  >
                    {s}
                  </button>
                ) : (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#5D2030",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 600,
                      fontSize: "15px",
                      cursor: "pointer",
                      padding: "8px 12px",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colours */}
          <div style={{ marginBottom: "26px" }}>
            <h3
              style={{
                fontFamily: "'Playfair Display', 'Blacker Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 14px 0",
              }}
            >
              Colours
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {COLORS.map((c) => {
                const active = selectedColor === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    aria-label={c.name}
                    style={{
                      width: "60px",
                      height: "36px",
                      borderRadius: "999px",
                      backgroundColor: c.hex,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      boxShadow: active
                        ? "0 4px 12px rgba(0,0,0,0.25)"
                        : "none",
                      transform: active ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {active && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path
                          d="M1 5L4.5 8.5L11 1"
                          stroke="#FFF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assurances Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "20px",
              borderTop: "1px solid #E6D8C8",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "14px",
                color: "#5D2030",
              }}
            >
              <FiTruck size={18} color="#5D2030" />
              <span>Easy Return</span>
            </div>

            <button
              onClick={() => setWishlistActive(!wishlistActive)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "14px",
                color: "#5D2030",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FiHeart
                size={18}
                color={wishlistActive ? "#BB8E43" : "#5D2030"}
                fill={wishlistActive ? "#BB8E43" : "none"}
              />
              <span>{wishlistActive ? "Added to Wishlist" : "Add to Wishlist"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* DETAILED SPECS & ACCORDIONS (2 Columns) */}
      <div
        className="prod-details-grid"
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto 60px",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          alignItems: "start",
          boxSizing: "border-box",
        }}
      >
        {/* Left Card: Accordion */}
        <div
          style={{
            backgroundColor: "#EFE1BC",
            borderRadius: "16px",
            border: "1px solid #5D203080",
            padding: "24px 28px",
            boxSizing: "border-box",
          }}
        >
          {/* Fitting */}
          <div style={{ borderBottom: "1px solid #5D203080", paddingBottom: "16px" }}>
            <div
              onClick={() => setFittingOpen(!fittingOpen)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: 0,
                }}
              >
                Fitting
              </h3>
              <span style={{ fontSize: "18px", color: "#5D2030", fontWeight: 700 }}>
                {fittingOpen ? "—" : "+"}
              </span>
            </div>
            {fittingOpen && (
              <div
                style={{
                  marginTop: "12px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "#5D2030",
                }}
              >
                Regular athletic fit designed for maximum mobility and daily comfort.
              </div>
            )}
          </div>

          {/* Fabric & Care */}
          <div style={{ borderBottom: "1px solid #5D203080", padding: "16px 0" }}>
            <div
              onClick={() => setFabricOpen(!fabricOpen)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: 0,
                }}
              >
                Fabric & Care
              </h3>
              <span style={{ fontSize: "18px", color: "#5D2030", fontWeight: 700 }}>
                {fabricOpen ? "—" : "+"}
              </span>
            </div>
            {fabricOpen && (
              <div
                style={{
                  marginTop: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "#5D2030",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>Fabric:</div>
                  <div>Tailored Stretch</div>
                  <div>Made In Italy 82% Nylon, 18% Elastane 100% Vegan Materials</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>Care:</div>
                  <div>Cold Machine Wash, Line Dry</div>
                  <div>
                    Do Not Tumble Dry, Do Not Bleach, Do Not Dry Clean, Do Not Iron, Do Not Use Fabric Softener
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Detail */}
          <div style={{ borderBottom: "1px solid #5D203080", padding: "16px 0" }}>
            <div
              onClick={() => setProductDetailOpen(!productDetailOpen)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: 0,
                }}
              >
                Product Detail
              </h3>
              <span style={{ fontSize: "18px", color: "#5D2030", fontWeight: 700 }}>
                {productDetailOpen ? "—" : "+"}
              </span>
            </div>
            {productDetailOpen && (
              <div
                style={{
                  marginTop: "12px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "#5D2030",
                }}
              >
                Features moisture-wicking technology, zippered side pockets, and durable flatlock seams.
              </div>
            )}
          </div>

          {/* Shipping And Return */}
          <div style={{ paddingTop: "16px" }}>
            <div
              onClick={() => setShippingOpen(!shippingOpen)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: 0,
                }}
              >
                Shipping And Return
              </h3>
              <span style={{ fontSize: "18px", color: "#5D2030", fontWeight: 700 }}>
                {shippingOpen ? "—" : "+"}
              </span>
            </div>
            {shippingOpen && (
              <div
                style={{
                  marginTop: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "#5D2030",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>Shipping:</div>
                  <div>Orders Over $150 - Standard Delivery Free ($15)</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>Returns:</div>
                  <div>Unwashed, Unworn Items Are Eligible For Returns Or Exchanges Within 30 Days Of Purchase.</div>
                  <div>Final Sale Items Are Not Eligible For Returns Or Exchanges.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Two stacked cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Silk Card */}
          <div
            style={{
              backgroundColor: "#EFE1BC",
              borderRadius: "16px",
              border: "1px solid #5D203080",
              padding: "24px 28px",
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 12px 0",
              }}
            >
              Silk
            </h3>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13.5px",
                lineHeight: 1.65,
                color: "#5D2030",
                margin: "0 0 20px 0",
              }}
            >
              This Material Is Our Signature High-Stretch Fabric That Drapes Like
              Silk And Is Soft To The Touch. Silk Is OEKO-TEX® Certified And Made
              In Italy In A Mill 100% Powered By Renewable Energy (Solar And
              Biomass).
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {["Quick Dry", "Chemical Free", "Machine Washable"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: "#5D2030",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    padding: "6px 18px",
                    borderRadius: "999px",
                    border: "1px solid #E4D5C4",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Return Policy Card */}
          <div
            style={{
              backgroundColor: "#EFE1BC",
              borderRadius: "16px",
              border: "1px solid #5D203080",
              padding: "24px 28px",
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 14px 0",
              }}
            >
              Return Policy
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13.5px",
                lineHeight: 1.65,
                color: "#5D2030",
              }}
            >
              <li>• No Returns Or Exchanges For Colour Changes.</li>
              <li>• Returns Or Replacements Are Accepted Only If The Product Is Damaged.</li>
              <li>• An Unboxing/Opening Video Is Mandatory To Claim Any Damage-Related Replacement.</li>
              <li>• Damage Claims Without An Opening Video Will Not Be Accepted.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* YOU MAY ALSO LIKE */}
      <div
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "70px auto 40px",
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', 'Blacker Display', Georgia, serif",
            fontWeight: 700,
            fontSize: "44px",
            lineHeight: "100%",
            color: "#5D2030",
            margin: "0 0 28px 0",
          }}
        >
          You May Also Like
        </h2>

        {/* 4 Cards Row */}
        <div
          className="prod-related-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
          }}
        >
          {RELATED_PRODUCTS.map((p) => {
            const qty = relatedQuantities[p.id] ?? 1;
            return (
              <div
                key={p.id}
                className="prod-related-card"
                style={{
                  backgroundColor: "#EFE1BC",
                  borderRadius: "16px",
                  border: "1px solid #5D203080",
                  padding: "12px",
                  boxSizing: "border-box",
                  position: "relative",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "230px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "#F5EFE5",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div style={{ padding: "10px 2px 2px 2px" }}>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', 'Blacker Display', Georgia, serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      lineHeight: "22px",
                      height: "22px",
                      color: "#5D2030",
                      margin: "0 0 6px 0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
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
                        {p.price}
                      </span>
                    </div>

                    {p.actionType === "bag" && (
                      <button
                        aria-label="Add to cart"
                        className="prod-bag-btn"
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
                        onClick={() => handleAddRelatedToCart(p)}
                      >
                        <img
                          src="/Categories/bag.png"
                          alt="Add to cart"
                          style={{ width: "20px", height: "20px", objectFit: "contain" }}
                        />
                      </button>
                    )}

                    {p.actionType === "stepper" && (
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
                          onClick={() => updateRelatedQty(p.id, -1)}
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
                          onClick={() => updateRelatedQty(p.id, 1)}
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore More Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "28px" }}>
          <a
            href="/categories"
            style={{
              backgroundColor: "#BB8E43",
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "14px",
              fontWeight: 700,
              padding: "12px 32px",
              borderRadius: "999px",
              textDecoration: "none",
              display: "inline-block",
              boxShadow: "0 4px 14px rgba(187,142,67,0.28)",
              transition: "transform 0.2s ease, filter 0.2s ease",
            }}
            className="prod-explore-btn"
          >
            Explore More
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1.5px solid #5D2030", marginTop: "60px" }} />
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
          className="prod-footer-top"
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
            className="prod-contact-btn"
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
                  className="prod-social-btn"
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
              <a key={l} href="#" className="prod-footer-link">
                {l}
              </a>
            ))}
          </div>
          <span style={{ textTransform: "none", letterSpacing: 0 }}>
            &copy; {new Date().getFullYear()} Sree Collections. All Rights Reserved.
          </span>
        </div>
      </footer>

      {/* CART MODAL (Top Right Overlay / Dropdown) */}
      {cartOpen && (
        <div
          className="prod-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: "96px 40px 40px 40px",
            boxSizing: "border-box",
          }}
          onClick={() => setCartOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="prod-cart-card"
            style={{
              width: "100%",
              maxWidth: "448px",
              height: "762px",
              maxHeight: "calc(100vh - 120px)",
              backgroundColor: "#FDFAF5",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              padding: "26px 28px 24px 28px",
              boxSizing: "border-box",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            {/* Top Section */}
            <div>
              {/* Header Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #EFE4D6",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#5D2030",
                    margin: 0,
                  }}
                >
                  Your Cart ({totalItemsCount})
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Close cart"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#5D2030",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px",
                  }}
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Cart Items List */}
              <div
                style={{
                  padding: "20px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {cartItems.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "30px 0",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "#8A796B",
                      fontSize: "16px",
                    }}
                  >
                    Your cart is empty.
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "14px",
                      }}
                    >
                      {/* Thumbnail */}
                      <div
                        style={{
                          width: "68px",
                          height: "68px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          backgroundColor: "#F5EFE5",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>

                      {/* Middle Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontWeight: 700,
                            fontSize: "14.5px",
                            color: "#5D2030",
                            lineHeight: 1.3,
                            marginBottom: "4px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </div>

                        {/* Size & Color dot */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginBottom: "8px",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "12px",
                            color: "#5D2030",
                          }}
                        >
                          <span>Size: {item.size}</span>
                          <span
                            style={{
                              display: "inline-block",
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: item.colorHex,
                              marginLeft: "2px",
                              boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                            }}
                          />
                        </div>

                        {/* Stepper pill */}
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            border: "1px solid #D6C8B8",
                            borderRadius: "999px",
                            padding: "2px 10px",
                            gap: "10px",
                            backgroundColor: "#FAF6EE",
                          }}
                        >
                          <button
                            onClick={() => updateCartItemQty(item.id, -1)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#5D2030",
                              fontSize: "14px",
                              fontWeight: 600,
                              cursor: "pointer",
                              padding: 0,
                              lineHeight: 1,
                            }}
                          >
                            –
                          </button>
                          <span
                            style={{
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontWeight: 600,
                              fontSize: "13px",
                              color: "#5D2030",
                              minWidth: "14px",
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQty(item.id, 1)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#5D2030",
                              fontSize: "14px",
                              fontWeight: 600,
                              cursor: "pointer",
                              padding: 0,
                              lineHeight: 1,
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontWeight: 700,
                          fontSize: "15px",
                          color: "#5D2030",
                          marginLeft: "auto",
                          textAlign: "right",
                          whiteSpace: "nowrap",
                          paddingTop: "2px",
                        }}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Section */}
            <div>
              {/* Promo code */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    flex: 1,
                    height: "44px",
                    borderRadius: "999px",
                    border: "1px solid #E5DCD1",
                    backgroundColor: "#FAF6EE",
                    padding: "0 20px",
                    fontSize: "13px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#5D2030",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={() => {
                    if (promoCode.trim()) setPromoApplied(true);
                  }}
                  style={{
                    height: "44px",
                    borderRadius: "999px",
                    backgroundColor: "#B3843B",
                    color: "#FFFFFF",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 600,
                    fontSize: "13px",
                    padding: "0 24px",
                    border: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "filter 0.2s",
                  }}
                >
                  {promoApplied ? "Applied" : "Apply"}
                </button>
              </div>

              {/* Cost breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "14px",
                    color: "#5D2030",
                  }}
                >
                  <span>Subtotal</span>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {promoApplied && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "14px",
                      color: "#16A34A",
                    }}
                  >
                    <span>Promo Discount (10%)</span>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}>
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "14px",
                    color: "#5D2030",
                  }}
                >
                  <span>Shipping</span>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}>
                    Free
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: "17px",
                    color: "#5D2030",
                    marginTop: "2px",
                  }}
                >
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setCartOpen(false);
                  setCheckoutModalOpen(true);
                }}
                style={{
                  width: "100%",
                  height: "52px",
                  borderRadius: "14px",
                  backgroundColor: "#B3843B",
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(179,132,59,0.25)",
                  transition: "transform 0.2s, filter 0.2s",
                }}
              >
                Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => setCartOpen(false)}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "14px",
                  background: "none",
                  border: "none",
                  color: "#5D2030",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT / WHATSAPP NUMBER MODAL */}
      {checkoutModalOpen && (
        <div
          className="prod-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            zIndex: 1100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
          onClick={() => setCheckoutModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "640px",
              minHeight: "330px",
              backgroundColor: "#FDFAF5",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              padding: "24px 32px 36px 32px",
              boxSizing: "border-box",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#5D2030",
                }}
              >
                Checkout
              </span>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#5D2030",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FiX size={16} />
              </button>
            </div>

            {!orderConfirmed ? (
              <div style={{ textAlign: "center", paddingBottom: "12px" }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#5D2030",
                    margin: "0 0 24px 0",
                    lineHeight: 1.35,
                  }}
                >
                  Enter your WhatsApp number to confirm your order.
                </p>

                <input
                  type="tel"
                  placeholder="WhatsApp Number"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: "380px",
                    height: "48px",
                    borderRadius: "999px",
                    border: "1.5px solid #5D2030",
                    backgroundColor: "#FDFAF5",
                    padding: "0 24px",
                    fontSize: "14px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#5D2030",
                    outline: "none",
                    margin: "0 auto 16px auto",
                    display: "block",
                    boxSizing: "border-box",
                    textAlign: "center",
                  }}
                />

                <button
                  onClick={() => {
                    setOrderConfirmed(true);
                  }}
                  style={{
                    width: "100%",
                    maxWidth: "380px",
                    height: "48px",
                    borderRadius: "999px",
                    backgroundColor: "#B3843B",
                    color: "#FFFFFF",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(179,132,59,0.25)",
                    margin: "0 auto",
                    display: "block",
                    transition: "filter 0.2s, transform 0.2s",
                  }}
                >
                  Proceed
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "10px 10px 24px 10px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                    boxShadow: "0 4px 14px rgba(37, 211, 102, 0.25)",
                    border: "2px solid #FFFFFF",
                  }}
                >
                  <FaWhatsapp size={52} color="#25D366" />
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: "36px",
                    color: "#5D2030",
                    margin: "0 0 14px 0",
                    lineHeight: 1.2,
                  }}
                >
                  Order Confirm via WhatsApp
                </h3>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "13.5px",
                    color: "#5D2030",
                    lineHeight: 1.55,
                    maxWidth: "500px",
                    margin: "0 auto",
                  }}
                >
                  Thank you! We&apos;ve received your order successfully. Our team will review it and
                  contact you on WhatsApp to confirm your order and share the next steps.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .prod-modal-overlay {
          animation: fadeIn 0.2s ease-out;
        }
        .prod-cart-card {
          animation: slideDown 0.25s ease-out;
        }
        .prod-cart-card::-webkit-scrollbar {
          display: none;
        }
        @media (min-width: 992px) { .prod-desktop-nav { display: flex !important; } }
        @media (max-width: 991px) { .prod-hamburger { display: flex !important; } }
        @media (max-width: 900px) {
          .prod-showcase-grid { grid-template-columns: 1fr !important; gap: 36px !important; padding: 0 20px !important; }
          .prod-details-grid { grid-template-columns: 1fr !important; padding: 0 20px !important; }
          .prod-related-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .prod-related-grid { grid-template-columns: 1fr !important; }
          .prod-modal-overlay { padding: 12px !important; }
          .prod-cart-card { margin-top: 20px !important; }
        }
        .cat-nav-link:hover { opacity: 0.75; }
        .prod-contact-btn:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .prod-cart-btn:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .prod-explore-btn:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .prod-related-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(187,142,67,0.18); }
        .prod-bag-btn:hover { transform: scale(1.15); }
        .prod-social-btn:hover { background-color: #5D2030 !important; color: #FFFFFF !important; }
        .prod-footer-link { color: #8A7B6F; text-decoration: none; }
        .prod-footer-link:hover { color: #5D2030; text-decoration: underline; }
      `}</style>
    </div>
  );
}
