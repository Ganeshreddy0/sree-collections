"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiCheckCircle,
  FiPhone,
  FiArrowRight,
  FiShoppingBag,
  FiCopy,
  FiCheck,
  FiTruck,
  FiShield,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { API_BASE } from "@/lib/config";

interface OrderData {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  whatsappNumber: string;
  customerEmail?: string;
  totalAmount: number;
  subtotal: number;
  shippingFee?: number;
  discount?: number;
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

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#FCF8F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "#5D2030",
          fontSize: "18px",
        }}
      >
        Loading your order confirmation...
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
        overflowX: "hidden",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div className="success-main-wrapper" style={{ padding: "32px 20px 80px 20px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          
          {/* 1. Success Banner Card */}
          <div
            className="success-banner-card"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              border: "1px solid rgba(187,142,67,0.25)",
              padding: "36px 28px",
              textAlign: "center",
              boxShadow: "0 8px 30px rgba(93,32,48,0.06)",
              marginBottom: "24px",
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <div
              className="success-check-icon"
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                backgroundColor: "rgba(37,211,102,0.12)",
                color: "#128C7E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                border: "2px solid rgba(37,211,102,0.3)",
              }}
            >
              <FiCheckCircle size={38} color="#128C7E" />
            </div>

            <h1
              className="success-banner-title"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "28px",
                fontWeight: 800,
                color: "#5D2030",
                margin: "0 0 10px 0",
                lineHeight: 1.25,
                wordBreak: "break-word",
              }}
            >
              Thank You! Your Order is Placed
            </h1>
            <p
              className="success-banner-sub"
              style={{
                fontSize: "14.5px",
                color: "#7A6858",
                maxWidth: "560px",
                margin: "0 auto 18px auto",
                lineHeight: 1.5,
              }}
            >
              Your order has been recorded in the Sree Collections database. We are preparing your exquisite handpicked items for delivery.
            </p>

            {/* Order ID Pill */}
            {order && (
              <div
                className="success-order-number-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "rgba(187,142,67,0.1)",
                  border: "1.5px dashed #BB8E43",
                  padding: "8px 18px",
                  borderRadius: "999px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#5D2030",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ wordBreak: "break-all" }}>Order ID: #{order.orderNumber}</span>
                <button
                  onClick={copyOrderNumber}
                  title="Copy Order ID"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#BB8E43",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    padding: 0,
                  }}
                >
                  {copied ? <FiCheck size={16} color="#128C7E" /> : <FiCopy size={16} />}
                </button>
              </div>
            )}
          </div>

          {/* 2. WhatsApp Delivery Status Card */}
          <div
            className="success-wa-card"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "18px",
              border:
                waStatus === "sent"
                  ? "2px solid #25D366"
                  : waStatus === "not_configured"
                    ? "2px solid #E0A93B"
                    : "2px solid #E57373",
              padding: "22px 24px",
              marginBottom: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              boxSizing: "border-box",
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            <div
              className="success-wa-body"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                width: "100%",
              }}
            >
              <div
                className="success-wa-icon"
                style={{
                  width: "44px",
                  height: "44px",
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
                <FaWhatsapp size={24} />
              </div>

              <div style={{ flex: 1, minWidth: 0, width: "100%", overflow: "hidden" }}>
                <div
                  className="success-wa-header"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <h3
                    className="success-wa-title"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "19px",
                      fontWeight: 700,
                      color: "#5D2030",
                      margin: 0,
                      lineHeight: 1.3,
                      wordBreak: "break-word",
                    }}
                  >
                    WhatsApp Confirmation
                  </h3>

                  <span
                    className="success-wa-badge"
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      padding: "4px 10px",
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
                      flexShrink: 0,
                    }}
                  >
                    {waStatus === "sent" && "✓ Message Sent"}
                    {waStatus === "not_configured" && "Setup Required"}
                    {waStatus === "failed" && "Delivery Failed"}
                    {waStatus === "pending" && "Sending..."}
                  </span>
                </div>

                {/* Status explanation */}
                {waStatus === "sent" && (
                  <div style={{ fontSize: "13.5px", color: "#333", lineHeight: 1.5 }}>
                    <p style={{ margin: "0 0 8px 0", wordBreak: "break-word" }}>
                      An official WhatsApp order confirmation has been dispatched to{" "}
                      <strong>+{order?.whatsappNumber || order?.customerPhone}</strong>.
                    </p>
                    {order?.whatsappNotification?.messageId && (
                      <div
                        style={{
                          marginTop: "6px",
                          display: "inline-block",
                          maxWidth: "100%",
                          fontSize: "11.5px",
                          color: "#555",
                          fontFamily: "monospace",
                          backgroundColor: "#F4F4F4",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          wordBreak: "break-all",
                          overflowWrap: "anywhere",
                          whiteSpace: "normal",
                          boxSizing: "border-box",
                          lineHeight: 1.4,
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "#333" }}>Meta Message ID: </span>
                        <span>{order.whatsappNotification.messageId}</span>
                      </div>
                    )}
                  </div>
                )}

                {waStatus === "not_configured" && (
                  <div style={{ fontSize: "13px", color: "#4A3E31", lineHeight: 1.5 }}>
                    <p style={{ margin: "0 0 6px 0", wordBreak: "break-word" }}>
                      Your order is safely saved under Order ID{" "}
                      <strong>#{order?.orderNumber}</strong>. WhatsApp notification setup is required in <code>backend/.env</code>.
                    </p>
                    <div
                      style={{
                        backgroundColor: "#FFF9F0",
                        border: "1px solid #EEDBB8",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        fontSize: "11.5px",
                        fontFamily: "monospace",
                        color: "#6B4E1B",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                      }}
                    >
                      WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID
                    </div>
                  </div>
                )}

                {waStatus === "failed" && (
                  <div style={{ fontSize: "13px", color: "#661A1A", lineHeight: 1.5 }}>
                    <p style={{ margin: "0 0 4px 0" }}>
                      Your order is confirmed, but WhatsApp delivery encountered an issue:
                    </p>
                    <p style={{ margin: 0, fontStyle: "italic", color: "#D32F2F", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                      {order?.whatsappNotification?.error || "Unknown delivery error"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Order Details & Items Card */}
          {order && (
            <div
              className="success-order-card"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "18px",
                border: "1px solid rgba(187,142,67,0.2)",
                padding: "28px",
                boxShadow: "0 4px 20px rgba(93,32,48,0.03)",
                marginBottom: "28px",
                boxSizing: "border-box",
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "19px",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: "0 0 18px 0",
                  borderBottom: "1px solid #F2ECE1",
                  paddingBottom: "12px",
                }}
              >
                Order Details &amp; Items
              </h3>

              {/* Customer & Address Grid */}
              <div
                className="success-order-info-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
                  gap: "20px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ minWidth: 0, wordBreak: "break-word" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#BB8E43",
                      marginBottom: "6px",
                      letterSpacing: "0.5px",
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
                    <div style={{ fontSize: "12.5px", color: "#666", marginTop: "2px", wordBreak: "break-all" }}>
                      {order.customerEmail}
                    </div>
                  )}
                </div>

                <div style={{ minWidth: 0, wordBreak: "break-word" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#BB8E43",
                      marginBottom: "6px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Delivery Address
                  </span>
                  <div style={{ fontSize: "13.5px", color: "#2F2C24", lineHeight: 1.45 }}>
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                    <br />
                    {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    <br />
                    {order.shippingAddress.country}
                  </div>
                </div>

                <div style={{ minWidth: 0, wordBreak: "break-word" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#BB8E43",
                      marginBottom: "6px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Payment &amp; Status
                  </span>
                  <div style={{ fontSize: "13.5px", color: "#2F2C24" }}>
                    <strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})
                  </div>
                  <div style={{ fontSize: "13.5px", color: "#2F2C24", marginTop: "4px" }}>
                    <strong>Order Status:</strong>{" "}
                    <span
                      style={{
                        backgroundColor: "rgba(187,142,67,0.12)",
                        color: "#8F6627",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: 600,
                        fontSize: "12.5px",
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div style={{ borderTop: "1px solid #F2ECE1", paddingTop: "18px" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#BB8E43",
                    marginBottom: "12px",
                    letterSpacing: "0.5px",
                  }}
                >
                  Ordered Items ({order.items.length})
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="success-item-card"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        backgroundColor: "#FDFAF5",
                        border: "1px solid #EFE6D8",
                        gap: "12px",
                        boxSizing: "border-box",
                        width: "100%",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            width: "50px",
                            height: "62px",
                            borderRadius: "8px",
                            backgroundColor: "#F0E8DC",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1px solid #E5D8C5",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image || "/homepage/casual_model1.jpg"}
                            alt={item.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "#5D2030",
                              fontSize: "14px",
                              lineHeight: 1.35,
                              wordBreak: "break-word",
                            }}
                          >
                            {item.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "#7A6858", marginTop: "3px" }}>
                            {item.colour && <span style={{ marginRight: "8px" }}>Colour: <strong>{item.colour}</strong></span>}
                            {item.size && item.size !== "Free Size" && <span>Size: <strong>{item.size}</strong></span>}
                          </div>
                        </div>
                      </div>

                      <div className="success-item-pricing" style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "12px", color: "#777", whiteSpace: "nowrap" }}>
                          Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontWeight: 700,
                            color: "#BB8E43",
                            fontSize: "15px",
                            marginTop: "2px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div
                  style={{
                    borderTop: "1.5px solid #EFE6D8",
                    paddingTop: "14px",
                    marginTop: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: "#666" }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 600, color: "#2F2C24" }}>
                      ₹{(order.subtotal || order.items.reduce((s, i) => s + i.price * i.quantity, 0)).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: "#666" }}>
                    <span>Shipping Fee</span>
                    <span>
                      {(order.shippingFee ?? 0) === 0 ? (
                        <strong style={{ color: "#128C7E" }}>FREE</strong>
                      ) : (
                        <strong style={{ color: "#2F2C24" }}>₹{(order.shippingFee ?? 0).toLocaleString("en-IN")}</strong>
                      )}
                    </span>
                  </div>

                  {typeof order.discount === "number" && order.discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: "#128C7E" }}>
                      <span>Discount</span>
                      <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px dashed #D8C4AA",
                      paddingTop: "12px",
                      marginTop: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "17px",
                        fontWeight: 700,
                        color: "#5D2030",
                      }}
                    >
                      Grand Total
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "21px",
                        fontWeight: 800,
                        color: "#BB8E43",
                      }}
                    >
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Bottom Action Buttons */}
          <div className="success-bottom-actions" style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#5D2030",
                color: "#FFFFFF",
                padding: "13px 26px",
                borderRadius: "12px",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "15px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(93,32,48,0.2)",
              }}
            >
              <span>Continue Shopping</span>
              <FiArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .success-main-wrapper {
            padding: 20px 14px 60px !important;
          }
          .success-banner-card {
            padding: 24px 16px !important;
            border-radius: 16px !important;
            margin-bottom: 18px !important;
          }
          .success-banner-title {
            font-size: clamp(20px, 5.5vw, 25px) !important;
          }
          .success-banner-sub {
            font-size: 13.5px !important;
            margin-bottom: 14px !important;
          }
          .success-check-icon {
            width: 56px !important;
            height: 56px !important;
            margin-bottom: 12px !important;
          }
          .success-check-icon svg {
            width: 30px !important;
            height: 30px !important;
          }
          .success-order-number-pill {
            padding: 6px 14px !important;
            font-size: 13.5px !important;
            border-radius: 12px !important;
          }
          .success-wa-card {
            padding: 16px 14px !important;
            border-radius: 14px !important;
            margin-bottom: 18px !important;
          }
          .success-wa-icon {
            width: 38px !important;
            height: 38px !important;
          }
          .success-wa-icon svg {
            width: 20px !important;
            height: 20px !important;
          }
          .success-wa-title {
            font-size: 17px !important;
          }
          .success-order-card {
            padding: 18px 14px !important;
            border-radius: 14px !important;
            margin-bottom: 18px !important;
          }
          .success-order-info-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            margin-bottom: 18px !important;
          }
          .success-bottom-actions {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .success-bottom-actions a {
            width: 100% !important;
            box-sizing: border-box !important;
            text-align: center !important;
          }
        }

        @media (max-width: 480px) {
          .success-main-wrapper {
            padding: 14px 10px 40px !important;
          }
          .success-banner-card {
            padding: 20px 12px !important;
          }
          .success-banner-title {
            font-size: 19px !important;
          }
          .success-wa-card {
            padding: 14px 12px !important;
          }
          .success-order-card {
            padding: 16px 12px !important;
          }
          .success-wa-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 6px !important;
          }
          .success-wa-title {
            font-size: 16px !important;
          }
          .success-item-card {
            padding: 10px !important;
            gap: 10px !important;
          }
          .success-item-card img {
            width: 42px !important;
            height: 54px !important;
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
