"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiTrash2,
  FiShoppingBag,
  FiShield,
  FiTruck,
  FiArrowRight,
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

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
    <Link
      href={href}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "17px",
        fontWeight: 700,
        color: "#5A2035",
        textDecoration: "none",
        lineHeight: 1.2,
        paddingBottom: active ? "3px" : undefined,
        borderBottom: active ? "2.5px solid #5A2035" : undefined,
        transition: "opacity 0.2s",
      }}
      className="cart-nav-link"
    >
      {children}
    </Link>
  );
}

interface CartItem {
  productId?: string;
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  variantId?: string | null;
  sku?: string;
  size?: string;
  colour?: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sree_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load cart:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("sree_cart", JSON.stringify(newItems));
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...items];
    const newQty = (updated[index].quantity || 1) + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    saveCart(updated);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    saveCart(updated);
  };

  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  );
  const totalAmount = subtotal;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FCF8F2",
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "#5D2030",
          fontSize: "18px",
        }}
      >
        Loading your shopping cart...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FCF8F2",
        color: "#2F2C24",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        paddingBottom: "80px",
      }}
    >
      {/* =========================================================================
          1. HEADER / NAVBAR — Identical to Home Page (Sticky / Fixed)
         ========================================================================= */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", position: "sticky", top: 0, zIndex: 100, backgroundColor: "#FCF8F2" }}>
        <header
          style={{
            width: "100%",
            maxWidth: "1360px",
            minHeight: "95px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
            position: "relative",
            zIndex: 50,
          }}
        >
          {/* Brand Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/" style={{ display: "inline-block" }}>
              <img
                src="/homepage/logo2_trans.png"
                alt="Sree Collections"
                style={{
                  height: "72px",
                  width: "auto",
                  objectFit: "contain",
                  maxWidth: "340px",
                  display: "block",
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="cart-desktop-nav"
            style={{ display: "none", alignItems: "center", gap: "36px" }}
          >
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/categories">Categories</NavLink>

            {/* CONTACT US Pill Button */}
            <Link
              href="/contact"
              className="cart-contact-btn primary-btn"
              style={{
                background: "#BA8E43",
                color: "#FFFFFF",
                fontFamily: "var(--font-serif)",
                fontSize: "12.5px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                padding: "11px 28px",
                borderRadius: "9999px",
                boxShadow: "0 2px 10px rgba(186, 142, 67, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease",
                textDecoration: "none",
              }}
            >
              CONTACT US
            </Link>

            {/* Search Icon */}
            <Link
              href="/search"
              aria-label="Search"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#5A2035",
                padding: "4px",
                transition: "transform 0.2s ease",
              }}
            >
              <FiSearch size={22} strokeWidth={2} />
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#5A2035",
                padding: "4px",
                transition: "transform 0.2s ease",
                position: "relative",
                borderBottom: "2.5px solid #5A2035",
                paddingBottom: "3px",
              }}
            >
              <FiShoppingCart size={22} strokeWidth={2} />
              {items.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-10px",
                    backgroundColor: "#BA8E43",
                    color: "#FFFFFF",
                    fontSize: "10px",
                    fontWeight: 700,
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {items.reduce((acc, it) => acc + (it.quantity || 1), 0)}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Right Actions: Search + Hamburger */}
          <div
            style={{
              display: "none",
              alignItems: "center",
              gap: "8px",
            }}
            className="mobile-header-actions"
          >
            <a
              href="/search"
              aria-label="Search"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#5A2035",
                padding: "6px",
              }}
            >
              <FiSearch size={21} strokeWidth={2} />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                padding: "6px",
                color: "#2F2C24",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              className="cart-hamburger mobile-hamburger"
            >
              {mobileMenuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 200,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: "290px",
              height: "100%",
              backgroundColor: "#FCF8F2",
              padding: "30px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <img src="/homepage/logo2_trans.png" alt="Logo" style={{ height: "48px" }} />
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <FiX size={24} />
              </button>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "16px", fontWeight: 600, color: "#5A2035", fontFamily: "var(--font-serif)" }}>Home</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "#5A2035", fontFamily: "var(--font-serif)" }}>About</Link>
              <Link href="/categories" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "#5A2035", fontFamily: "var(--font-serif)" }}>Categories</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "#5A2035", fontFamily: "var(--font-serif)" }}>Contact Us</Link>
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "16px", fontWeight: 700, color: "#BA8E43", fontFamily: "var(--font-serif)" }}>Cart ({items.reduce((acc, it) => acc + (it.quantity || 1), 0)})</Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main style={{ maxWidth: "1200px", margin: "28px auto 0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#5D2030",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <FiArrowLeft size={18} />
            <span>Continue Shopping</span>
          </Link>
          <div style={{ fontSize: "13px", color: "#BB8E43", fontWeight: 600 }}>
            {items.reduce((acc, it) => acc + (it.quantity || 1), 0)} {items.reduce((acc, it) => acc + (it.quantity || 1), 0) === 1 ? "Item" : "Items"}
          </div>
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "30px",
            fontWeight: 700,
            color: "#5D2030",
            marginBottom: "28px",
          }}
        >
          Your Shopping Cart
        </h2>

        {items.length === 0 ? (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "60px 20px",
              textAlign: "center",
              border: "1px solid rgba(187,142,67,0.2)",
              boxShadow: "0 4px 20px rgba(93,32,48,0.03)",
            }}
          >
            <FiShoppingBag size={56} color="#BB8E43" style={{ marginBottom: "16px" }} />
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "24px",
                color: "#5D2030",
                marginBottom: "8px",
              }}
            >
              Your cart is currently empty
            </h3>
            <p style={{ color: "#7A6858", fontSize: "14.5px", marginBottom: "24px" }}>
              Explore our handloom silks, Kanjeevarams, and festive designer sarees.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#5D2030",
                color: "#FFFFFF",
                padding: "14px 28px",
                borderRadius: "12px",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              <span>Explore Saree Collection</span>
              <FiArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "36px",
              alignItems: "start",
            }}
          >
            {/* Left Column: Items */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "18px",
                border: "1px solid rgba(187,142,67,0.2)",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(93,32,48,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="cart-item-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                    borderBottom: idx !== items.length - 1 ? "1px solid #F0E8DC" : "none",
                    paddingBottom: idx !== items.length - 1 ? "20px" : "0",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "100px",
                      borderRadius: "10px",
                      backgroundColor: "#F7F2EA",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={item.image || "/homepage/casual_model1.jpg"}
                      alt={item.name || item.title || "Saree"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "17px",
                        fontWeight: 700,
                        color: "#5D2030",
                        margin: "0 0 6px 0",
                      }}
                    >
                      {item.name || item.title || "Saree"}
                    </h4>

                    <div style={{ display: "flex", gap: "10px", fontSize: "13px", color: "#7A6858", marginBottom: "10px" }}>
                      {item.colour && (
                        <span
                          style={{
                            backgroundColor: "rgba(187,142,67,0.12)",
                            color: "#8F6627",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontWeight: 600,
                          }}
                        >
                          {item.colour}
                        </span>
                      )}
                      {item.size && item.size !== "Free Size" && <span>Size: {item.size}</span>}
                    </div>

                    <div
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#BB8E43",
                      }}
                    >
                      ₹{item.price.toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* Quantity adjustment */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => updateQuantity(idx, -1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: "1px solid #D8CAB8",
                        backgroundColor: "#FDFAF5",
                        color: "#5D2030",
                        fontWeight: 700,
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: "15px", fontWeight: 700, minWidth: "20px", textAlign: "center" }}>
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(idx, 1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: "1px solid #D8CAB8",
                        backgroundColor: "#FDFAF5",
                        color: "#5D2030",
                        fontWeight: 700,
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeItem(idx)}
                    title="Remove Item"
                    style={{
                      color: "#A83232",
                      padding: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "18px",
                border: "1px solid rgba(187,142,67,0.2)",
                padding: "28px",
                boxShadow: "0 4px 20px rgba(93,32,48,0.04)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: "0 0 18px 0",
                  borderBottom: "1px solid #F2ECE1",
                  paddingBottom: "12px",
                }}
              >
                Price Summary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#666" }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: "#2F2C24" }}>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "#666" }}>
                  <span>Shipping Fee</span>
                  <span style={{ color: "#128C7E", fontWeight: 700 }}>FREE</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1.5px solid #F2ECE1",
                    paddingTop: "14px",
                    fontSize: "18px",
                  }}
                >
                  <strong style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#5D2030" }}>
                    Estimated Total
                  </strong>
                  <strong style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#BB8E43" }}>
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              {/* WhatsApp Notice */}
              <div
                style={{
                  backgroundColor: "rgba(37,211,102,0.08)",
                  border: "1px solid rgba(37,211,102,0.3)",
                  borderRadius: "12px",
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <FaWhatsapp size={24} color="#25D366" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "12.5px", color: "#2F2C24", lineHeight: 1.4 }}>
                  Instant order confirmation & tracking link will be sent to your WhatsApp number upon placing the order.
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push("/checkout")}
                style={{
                  width: "100%",
                  height: "54px",
                  borderRadius: "14px",
                  backgroundColor: "#5D2030",
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "17px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(93,32,48,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Responsive Styles for Header and Navbar */}
      <style>{`
        @media (min-width: 992px) {
          .cart-desktop-nav {
            display: flex !important;
          }
          .mobile-header-actions {
            display: none !important;
          }
          .cart-hamburger {
            display: none !important;
          }
        }
        @media (max-width: 991px) {
          .cart-desktop-nav {
            display: none !important;
          }
          .mobile-header-actions {
            display: flex !important;
          }
          .cart-hamburger {
            display: flex !important;
          }
        }
        @media (max-width: 600px) {
          .cart-item-row {
            flex-wrap: wrap !important;
            gap: 12px !important;
          }
        }
        .cart-nav-link:hover {
          opacity: 0.8;
        }
        .cart-contact-btn:hover {
          background-color: #a87d35 !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
