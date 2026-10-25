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
import SiteHeader from "@/components/SiteHeader";

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
          1. HEADER / NAVBAR — Centralized SiteHeader with Dynamic Active Nav
         ========================================================================= */}
      <SiteHeader />

      {/* Main Container */}
      <main className="cart-main-content" style={{ maxWidth: "1200px", margin: "28px auto 0 auto", padding: "0 24px" }}>
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
          className="cart-page-title"
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
            className="cart-main-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "36px",
              alignItems: "start",
            }}
          >
            {/* Left Column: Items */}
            <div
              className="cart-items-container"
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
                  {/* Left: Product Image */}
                  <div
                    className="cart-item-img-box"
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

                  {/* Right: Product Details */}
                  <div className="cart-item-info" style={{ flex: 1, minWidth: 0 }}>
                    <div className="cart-item-header-row">
                      <h4
                        className="cart-item-title"
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

                      {/* Mobile Delete Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        title="Remove Item"
                        className="cart-item-delete-btn mobile-delete-btn"
                        style={{
                          color: "#A83232",
                          padding: "4px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          background: "transparent",
                          border: "none",
                        }}
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>

                    <div className="cart-item-variants" style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "13px", color: "#7A6858", marginBottom: "8px" }}>
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

                    {/* Desktop Price */}
                    <div
                      className="cart-item-price desktop-price"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#BB8E43",
                      }}
                    >
                      ₹{item.price.toLocaleString("en-IN")}
                    </div>

                    {/* Mobile Bottom Row: Price + Mobile Stepper */}
                    <div className="cart-item-bottom-row">
                      <div
                        className="cart-item-price mobile-price"
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontWeight: 700,
                          fontSize: "16px",
                          color: "#BB8E43",
                        }}
                      >
                        ₹{item.price.toLocaleString("en-IN")}
                      </div>

                      <div className="cart-item-qty-stepper mobile-stepper">
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, -1)}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "6px",
                            border: "1px solid #D8CAB8",
                            backgroundColor: "#FDFAF5",
                            color: "#5D2030",
                            fontWeight: 700,
                            fontSize: "15px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: "14px", fontWeight: 700, minWidth: "18px", textAlign: "center", color: "#5D2030" }}>
                          {item.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, 1)}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "6px",
                            border: "1px solid #D8CAB8",
                            backgroundColor: "#FDFAF5",
                            color: "#5D2030",
                            fontWeight: 700,
                            fontSize: "15px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Quantity adjustment */}
                  <div className="cart-item-qty-stepper desktop-qty-stepper" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      type="button"
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
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: "15px", fontWeight: 700, minWidth: "20px", textAlign: "center" }}>
                      {item.quantity || 1}
                    </span>
                    <button
                      type="button"
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
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Desktop Delete Item */}
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    title="Remove Item"
                    className="cart-item-delete-btn desktop-delete-btn"
                    style={{
                      color: "#A83232",
                      padding: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      background: "transparent",
                      border: "none",
                    }}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div
              className="cart-summary-card"
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
        @media (min-width: 769px) {
          .desktop-qty-stepper {
            display: flex !important;
          }
          .desktop-delete-btn {
            display: flex !important;
          }
          .desktop-price {
            display: block !important;
          }
          .mobile-delete-btn {
            display: none !important;
          }
          .cart-item-bottom-row {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-qty-stepper {
            display: none !important;
          }
          .desktop-delete-btn {
            display: none !important;
          }
          .desktop-price {
            display: none !important;
          }
          .mobile-delete-btn {
            display: flex !important;
            padding: 2px 4px !important;
          }
          .cart-main-content {
            padding: 0 16px !important;
            margin-top: 14px !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
          }
          .cart-page-title {
            font-size: 24px !important;
            margin-bottom: 18px !important;
          }
          .cart-main-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
            width: 100% !important;
          }
          .cart-items-container {
            padding: 16px !important;
            border-radius: 16px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .cart-summary-card {
            padding: 20px 16px !important;
            border-radius: 16px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .cart-item-row {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            gap: 14px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding-bottom: 16px !important;
          }
          .cart-item-img-box {
            width: 86px !important;
            height: 108px !important;
            border-radius: 10px !important;
            flex-shrink: 0 !important;
          }
          .cart-item-info {
            flex: 1 !important;
            min-width: 0 !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .cart-item-header-row {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            gap: 8px !important;
            width: 100% !important;
            margin-bottom: 4px !important;
          }
          .cart-item-title {
            font-size: 15px !important;
            line-height: 1.35 !important;
            margin: 0 !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          .cart-item-variants {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 6px !important;
            margin-bottom: 8px !important;
            font-size: 12px !important;
          }
          .cart-item-bottom-row {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-top: auto !important;
            padding-top: 4px !important;
            width: 100% !important;
          }
          .cart-item-price.mobile-price {
            font-size: 16px !important;
          }
          .mobile-stepper {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
          }
        }
        @media (max-width: 480px) {
          .cart-main-content {
            padding: 0 12px !important;
            margin-top: 10px !important;
          }
          .cart-page-title {
            font-size: 21px !important;
            margin-bottom: 14px !important;
          }
          .cart-items-container {
            padding: 12px !important;
            border-radius: 14px !important;
            gap: 14px !important;
          }
          .cart-item-row {
            gap: 10px !important;
            padding-bottom: 14px !important;
          }
          .cart-item-img-box {
            width: 74px !important;
            height: 94px !important;
            border-radius: 8px !important;
          }
          .cart-item-title {
            font-size: 13.5px !important;
            line-height: 1.3 !important;
          }
          .cart-item-price.mobile-price {
            font-size: 15px !important;
          }
          .mobile-stepper button {
            width: 27px !important;
            height: 27px !important;
            font-size: 14px !important;
          }
          .mobile-stepper span {
            font-size: 13px !important;
            min-width: 16px !important;
          }
          .cart-summary-card {
            padding: 16px 12px !important;
            border-radius: 14px !important;
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
