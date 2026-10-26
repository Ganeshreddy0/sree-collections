"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiCheckCircle,
  FiArrowRight,
  FiShoppingBag,
  FiInfo,
  FiAlertTriangle,
  FiMapPin,
  FiPhone,
  FiClock,
  FiCopy,
  FiCheck,
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { API_BASE } from "@/lib/config";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "17px",
        fontWeight: 700,
        color: "#5A2035",
        textDecoration: "none",
        lineHeight: 1.2,
      }}
    >
      {children}
    </Link>
  );
}

interface OrderData {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  whatsappNumber: string;
  customerEmail?: string;
  totalAmount: number;
  subtotal: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: {
    fullName?: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: Array<{
    title: string;
    colour?: string;
    size?: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  whatsappNotification: {
    status: "sent" | "failed" | "not_configured" | "pending";
    messageId?: string;
    sentAt?: string;
    error?: string;
    attempts?: number;
    templateName?: string;
  };
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get("orderNumber");
  const orderIdParam = searchParams.get("id");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const lookupId = orderNumberParam || orderIdParam;
    if (!lookupId) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/orders/${encodeURIComponent(lookupId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not find order details.");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          setError(data.message || "Failed to load order.");
        }
      })
      .catch((err) => {
        setError(err.message || "Error loading order.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderNumberParam, orderIdParam]);

  const copyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Global SiteHeader is handled by layout.tsx
  const siteHeader = null;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FCF8F2", display: "flex", flexDirection: "column" }}>
        {siteHeader}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#5D2030",
            fontSize: "20px",
          }}
        >
          Loading your order confirmation...
        </div>
        <style>{`
          @media (min-width: 992px) { .success-desktop-nav { display: flex !important; } }
          @media (max-width: 991px) { .success-hamburger { display: flex !important; } }
        `}</style>
      </div>
    );
  }

  const waStatus = order?.whatsappNotification?.status || "pending";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FCF8F2",
        color: "#2F2C24",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {siteHeader}

      <div className="success-main-wrapper" style={{ padding: "32px 20px 80px 20px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          {/* Success Banner */}
          <div
            className="success-banner-card"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              border: "1px solid rgba(187,142,67,0.25)",
              padding: "36px 32px",
              textAlign: "center",
              boxShadow: "0 8px 30px rgba(93,32,48,0.06)",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "rgba(37,211,102,0.12)",
                color: "#128C7E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
                border: "2px solid rgba(37,211,102,0.3)",
              }}
            >
              <FiCheckCircle size={40} color="#128C7E" />
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "32px",
                fontWeight: 800,
                color: "#5D2030",
                margin: "0 0 10px 0",
              }}
            >
              Thank You! Your Saree Order is Placed
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "#7A6858",
                maxWidth: "560px",
                margin: "0 auto 20px auto",
                lineHeight: 1.5,
              }}
            >
              Your order has been recorded and saved in the Sree Collections database. We are preparing your exquisite handpicked sarees for delivery.
            </p>

            {/* Order ID Pill */}
            {order && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "rgba(187,142,67,0.1)",
                  border: "1.5px dashed #BB8E43",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#5D2030",
                }}
              >
                <span>Order Number: #{order.orderNumber}</span>
                <button
                  onClick={copyOrderNumber}
                  title="Copy Order ID"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#BB8E43",
                    cursor: "pointer",
                  }}
                >
                  {copied ? <FiCheck size={16} color="#128C7E" /> : <FiCopy size={16} />}
                </button>
              </div>
            )}
          </div>

          {/* DISTINCT SECTION: WHATSAPP DELIVERY STATUS (Clear distinction as requested) */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "18px",
              border:
                waStatus === "sent"
                  ? "2px solid #25D366"
                  : waStatus === "not_configured"
                    ? "2px solid #E0A93B"
                    : "2px solid #E57373",
              padding: "24px 28px",
              marginBottom: "28px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor:
                    waStatus === "sent"
                      ? "rgba(37,211,102,0.15)"
                      : waStatus === "not_configured"
                        ? "rgba(224,169,59,0.15)"
                        : "rgba(229,115,115,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color:
                    waStatus === "sent"
                      ? "#25D366"
                      : waStatus === "not_configured"
                        ? "#BB8E43"
                        : "#D32F2F",
                  flexShrink: 0,
                }}
              >
                <FaWhatsapp size={26} />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "6px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#5D2030",
                      margin: 0,
                    }}
                  >
                    WhatsApp Confirmation Delivery Status
                  </h3>

                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      backgroundColor:
                        waStatus === "sent"
                          ? "#E8F9EE"
                          : waStatus === "not_configured"
                            ? "#FFF8EB"
                            : "#FDEAEA",
                      color:
                        waStatus === "sent"
                          ? "#128C7E"
                          : waStatus === "not_configured"
                            ? "#A67319"
                            : "#D32F2F",
                    }}
                  >
                    {waStatus === "sent" && "✓ Message Sent"}
                    {waStatus === "not_configured" && "Setup Required in .env"}
                    {waStatus === "failed" && "Delivery Failed"}
                    {waStatus === "pending" && "Sending..."}
                  </span>
                </div>

                {/* Status explanation */}
                {waStatus === "sent" && (
                  <div style={{ fontSize: "14px", color: "#333", lineHeight: 1.5 }}>
                    <p style={{ margin: "0 0 6px 0" }}>
                      An official WhatsApp order confirmation has been successfully dispatched to{" "}
                      <strong>+{order?.whatsappNumber || order?.customerPhone}</strong>.
                    </p>
                    {order?.whatsappNotification?.messageId && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          fontFamily: "monospace",
                          backgroundColor: "#F4F4F4",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        Meta Message ID: {order.whatsappNotification.messageId}
                      </span>
                    )}
                  </div>
                )}

                {waStatus === "not_configured" && (
                  <div style={{ fontSize: "13.5px", color: "#4A3E31", lineHeight: 1.5 }}>
                    <p style={{ margin: "0 0 8px 0" }}>
                      <strong>Note:</strong> Your order is safely saved in the database under Order ID{" "}
                      <strong>#{order?.orderNumber}</strong>. Automatic WhatsApp message delivery requires Meta WhatsApp Business Cloud API credentials in <code>backend/.env</code>.
                    </p>
                    <div
                      style={{
                        backgroundColor: "#FFF9F0",
                        border: "1px solid #EEDBB8",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        color: "#6B4E1B",
                      }}
                    >
                      Required in backend/.env: WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID
                    </div>
                  </div>
                )}

                {waStatus === "failed" && (
                  <div style={{ fontSize: "13.5px", color: "#661A1A", lineHeight: 1.5 }}>
                    <p style={{ margin: "0 0 6px 0" }}>
                      Your order was saved successfully. However, delivery of the WhatsApp message failed:
                    </p>
                    <p style={{ margin: 0, fontStyle: "italic", color: "#D32F2F" }}>
                      {order?.whatsappNotification?.error || "Unknown delivery error"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ORDER DETAILS CARD */}
          {order && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "18px",
                border: "1px solid rgba(187,142,67,0.2)",
                padding: "32px",
                boxShadow: "0 4px 20px rgba(93,32,48,0.03)",
                marginBottom: "32px",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: "0 0 20px 0",
                  borderBottom: "1px solid #F2ECE1",
                  paddingBottom: "14px",
                }}
              >
                Order Details & Items
              </h3>

              {/* Customer & Address Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "24px",
                  marginBottom: "28px",
                }}
              >
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#BB8E43",
                      marginBottom: "6px",
                    }}
                  >
                    Customer Information
                  </span>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#5D2030" }}>
                    {order.customerName}
                  </div>
                  <div style={{ fontSize: "13px", color: "#666", display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                    <FiPhone size={13} color="#25D366" />
                    <span>+{order.whatsappNumber || order.customerPhone}</span>
                  </div>
                  {order.customerEmail && (
                    <div style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>
                      {order.customerEmail}
                    </div>
                  )}
                </div>

                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#BB8E43",
                      marginBottom: "6px",
                    }}
                  >
                    Delivery Address
                  </span>
                  <div style={{ fontSize: "14px", color: "#2F2C24", lineHeight: 1.45 }}>
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                    <br />
                    {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    <br />
                    {order.shippingAddress.country}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#BB8E43",
                      marginBottom: "6px",
                    }}
                  >
                    Payment & Status
                  </span>
                  <div style={{ fontSize: "14px", color: "#2F2C24" }}>
                    <strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})
                  </div>
                  <div style={{ fontSize: "14px", color: "#2F2C24", marginTop: "4px" }}>
                    <strong>Order Status:</strong>{" "}
                    <span
                      style={{
                        backgroundColor: "rgba(187,142,67,0.12)",
                        color: "#8F6627",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: 600,
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Saree Items List */}
              <div style={{ borderTop: "1px solid #F2ECE1", paddingTop: "20px" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#BB8E43",
                    marginBottom: "14px",
                  }}
                >
                  Ordered Sarees ({order.items.length})
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px",
                        borderRadius: "10px",
                        backgroundColor: "#FDFAF5",
                        border: "1px solid #EFE6D8",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div
                          style={{
                            width: "50px",
                            height: "62px",
                            borderRadius: "6px",
                            backgroundColor: "#F0E8DC",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={item.image || "/homepage/casual_model1.jpg"}
                            alt={item.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#5D2030", fontSize: "14.5px" }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: "12.5px", color: "#7A6858", marginTop: "2px" }}>
                            {item.colour && <span style={{ marginRight: "10px" }}>Colour: <strong>{item.colour}</strong></span>}
                            {item.size && item.size !== "Free Size" && <span>Size: <strong>{item.size}</strong></span>}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "13px", color: "#777" }}>
                          Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontWeight: 700,
                            color: "#BB8E43",
                            fontSize: "15px",
                          }}
                        >
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1.5px solid #EFE6D8",
                    paddingTop: "16px",
                    marginTop: "20px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#5D2030",
                    }}
                  >
                    Grand Total
                  </span>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#BB8E43",
                    }}
                  >
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="success-bottom-actions" style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
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
                fontSize: "16px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(93,32,48,0.2)",
              }}
            >
              <span>Continue Shopping</span>
              <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .success-desktop-nav { display: flex !important; }
          .mobile-header-actions { display: none !important; }
        }
        @media (max-width: 991px) {
          .success-desktop-nav { display: none !important; }
          .mobile-header-actions { display: flex !important; }
          .success-hamburger { display: flex !important; }
        }
        @media (max-width: 768px) {
          .success-main-wrapper {
            padding: 20px 16px 60px !important;
          }
          .success-banner-card {
            padding: 24px 16px !important;
            border-radius: 16px !important;
          }
          .success-banner-card h1 {
            font-size: clamp(20px, 5.5vw, 28px) !important;
          }
          .success-order-info-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .success-order-number-pill {
            font-size: 12px !important;
          }
          .success-bottom-actions {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .success-bottom-actions a,
          .success-bottom-actions button {
            width: 100% !important;
            justify-content: center !important;
          }
          .success-wa-card {
            padding: 16px !important;
          }
        }
        @media (max-width: 480px) {
          .success-main-wrapper {
            padding: 16px 12px 40px !important;
          }
          .success-banner-card {
            padding: 20px 14px !important;
          }
          .success-banner-card h1 {
            font-size: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FCF8F2",
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#5D2030",
            fontSize: 18,
          }}
        >
          Loading…
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
