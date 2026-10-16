"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiShield,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
  FiLock,
  FiShoppingBag,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api";

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

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Telangana",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Kerala",
  "Gujarat",
  "Delhi",
  "West Bengal",
  "Rajasthan",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Bihar",
  "Odisha",
  "Punjab",
  "Haryana",
  "Goa",
  "Assam",
  "Other",
];

export default function CheckoutPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Customer form fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(true);

  // Address fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Telangana");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [notes, setNotes] = useState("");

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sree_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse cart items:", e);
    } finally {
      setLoadingCart(false);
    }
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const shippingFee = subtotal >= 1999 ? 0 : 0; // Free delivery
  const totalAmount = subtotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const cleanDigits = phoneNumber.replace(/\D/g, "");
    if (!cleanDigits || cleanDigits.length < 10) {
      setErrorMessage("Please enter a valid 10-digit WhatsApp mobile number.");
      return;
    }

    if (!street.trim()) {
      setErrorMessage("Please enter your delivery street / flat / address.");
      return;
    }

    if (!city.trim()) {
      setErrorMessage("Please enter your city / town.");
      return;
    }

    if (!pincode.trim() || pincode.trim().length < 6) {
      setErrorMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Please add sarees to cart before checkout.");
      return;
    }

    setSubmitting(true);

    const fullWhatsappNumber = `${countryCode}${cleanDigits}`;

    const orderPayload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: fullWhatsappNumber,
      whatsappNumber: fullWhatsappNumber,
      whatsappConsent,
      shippingAddress: {
        fullName: customerName.trim(),
        street: street.trim(),
        city: city.trim(),
        state,
        pincode: pincode.trim(),
        country: "India",
      },
      items: cartItems.map((item) => ({
        productId: item.productId || item.id || item._id,
        variantId: item.variantId || null,
        title: item.name || item.title || "Saree",
        colour: item.colour || "",
        size: item.size || "Free Size",
        quantity: item.quantity || 1,
        price: item.price,
        image: item.image || "",
      })),
      paymentMethod,
      notes: notes.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to place order. Please try again.");
      }

      // Clear localStorage cart
      localStorage.removeItem("sree_cart");

      // Redirect to Order Success Page
      const orderNumber = data.data.orderNumber;
      const orderId = data.data._id;
      router.push(`/checkout/success?orderNumber=${encodeURIComponent(orderNumber)}&id=${encodeURIComponent(orderId)}`);
    } catch (err: any) {
      console.error("Order submission error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

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
      {/* Top Luxury Banner / Header */}
      <header
        style={{
          borderBottom: "1px solid rgba(187,142,67,0.2)",
          backgroundColor: "#FFFFFF",
          padding: "20px 32px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 2px 10px rgba(93,32,48,0.04)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
              <span>Back to Store</span>
            </Link>
          </div>

          <Link href="/" style={{ textDecoration: "none", textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "26px",
                fontWeight: 800,
                letterSpacing: "1px",
                color: "#5D2030",
                margin: 0,
              }}
            >
              Sree Collections
            </h1>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#BB8E43",
                fontWeight: 600,
              }}
            >
              Pure Heritage Silks & Sarees
            </span>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#5D2030",
              fontWeight: 600,
            }}
          >
            <FiLock size={16} color="#BB8E43" />
            <span>Secure 256-bit Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: "1200px", margin: "40px auto 0 auto", padding: "0 24px" }}>
        {/* Breadcrumb / Title */}
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "32px",
              fontWeight: 700,
              color: "#5D2030",
              margin: "0 0 8px 0",
            }}
          >
            Checkout & Order Confirmation
          </h2>
          <p style={{ color: "#7A6858", fontSize: "15px", margin: 0 }}>
            Complete your shipping address and receive automatic instant confirmation on your WhatsApp.
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: "#FFF2F2",
              border: "1.5px solid #FF8E8E",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "28px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#B3261E",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <FiAlertCircle size={22} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Checkout Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "36px",
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN: Customer Form */}
          <form
            onSubmit={handleSubmitOrder}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* Section 1: Customer & WhatsApp Contact */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "28px",
                border: "1px solid rgba(187,142,67,0.2)",
                boxShadow: "0 4px 20px rgba(93,32,48,0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                  borderBottom: "1px solid #F2ECE1",
                  paddingBottom: "14px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(37,211,102,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#25D366",
                  }}
                >
                  <FaWhatsapp size={20} />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "19px",
                      fontWeight: 700,
                      color: "#5D2030",
                      margin: 0,
                    }}
                  >
                    1. Customer & WhatsApp Details
                  </h3>
                  <span style={{ fontSize: "12px", color: "#7A6858" }}>
                    Your order details and delivery status will be sent here
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#5D2030",
                      marginBottom: "6px",
                    }}
                  >
                    Full Name <span style={{ color: "#E53935" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smt. Priya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: "100%",
                      height: "46px",
                      borderRadius: "10px",
                      border: "1px solid #D8CAB8",
                      padding: "0 16px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#FDFAF5",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* WhatsApp Phone Number with Country Code */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#5D2030",
                      marginBottom: "6px",
                    }}
                  >
                    WhatsApp Mobile Number <span style={{ color: "#E53935" }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      style={{
                        height: "46px",
                        width: "90px",
                        borderRadius: "10px",
                        border: "1px solid #D8CAB8",
                        padding: "0 10px",
                        fontSize: "14px",
                        fontWeight: 600,
                        backgroundColor: "#FDFAF5",
                        color: "#5D2030",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+60">🇲🇾 +60</option>
                    </select>

                    <input
                      type="tel"
                      required
                      placeholder="10-digit WhatsApp number (e.g. 9876543210)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      maxLength={15}
                      style={{
                        flex: 1,
                        height: "46px",
                        borderRadius: "10px",
                        border: "1px solid #D8CAB8",
                        padding: "0 16px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "#FDFAF5",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#666", marginTop: "4px", display: "block" }}>
                    We send automatic order confirmation & tracking updates to this WhatsApp number.
                  </span>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#5D2030",
                      marginBottom: "6px",
                    }}
                  >
                    Email Address <span style={{ fontSize: "11px", color: "#888", fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. priya@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    style={{
                      width: "100%",
                      height: "46px",
                      borderRadius: "10px",
                      border: "1px solid #D8CAB8",
                      padding: "0 16px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#FDFAF5",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* WhatsApp Consent Box */}
                <div
                  style={{
                    backgroundColor: "rgba(37,211,102,0.06)",
                    border: "1px solid rgba(37,211,102,0.3)",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="waConsent"
                    checked={whatsappConsent}
                    onChange={(e) => setWhatsappConsent(e.target.checked)}
                    style={{
                      marginTop: "3px",
                      width: "17px",
                      height: "17px",
                      accentColor: "#25D366",
                      cursor: "pointer",
                    }}
                  />
                  <label
                    htmlFor="waConsent"
                    style={{
                      fontSize: "13px",
                      color: "#2F2C24",
                      lineHeight: "1.45",
                      cursor: "pointer",
                    }}
                  >
                    <strong style={{ color: "#128C7E", display: "block", marginBottom: "2px" }}>
                      WhatsApp Order Confirmation
                    </strong>
                    I consent to receiving instant order confirmation, invoice, and courier tracking notifications via WhatsApp from Sree Collections.
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Address */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "28px",
                border: "1px solid rgba(187,142,67,0.2)",
                boxShadow: "0 4px 20px rgba(93,32,48,0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                  borderBottom: "1px solid #F2ECE1",
                  paddingBottom: "14px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(187,142,67,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#BB8E43",
                  }}
                >
                  <FiTruck size={18} />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "19px",
                      fontWeight: 700,
                      color: "#5D2030",
                      margin: 0,
                    }}
                  >
                    2. Delivery Address
                  </h3>
                  <span style={{ fontSize: "12px", color: "#7A6858" }}>
                    Safe, insured saree door delivery across India
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#5D2030",
                      marginBottom: "6px",
                    }}
                  >
                    Street Address, Flat / House No., Apartment <span style={{ color: "#E53935" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 301, Sri Krishna Residency, Road No. 12"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    style={{
                      width: "100%",
                      height: "46px",
                      borderRadius: "10px",
                      border: "1px solid #D8CAB8",
                      padding: "0 16px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#FDFAF5",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#5D2030",
                        marginBottom: "6px",
                      }}
                    >
                      City / Town <span style={{ color: "#E53935" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        width: "100%",
                        height: "46px",
                        borderRadius: "10px",
                        border: "1px solid #D8CAB8",
                        padding: "0 16px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "#FDFAF5",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#5D2030",
                        marginBottom: "6px",
                      }}
                    >
                      State <span style={{ color: "#E53935" }}>*</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{
                        width: "100%",
                        height: "46px",
                        borderRadius: "10px",
                        border: "1px solid #D8CAB8",
                        padding: "0 14px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "#FDFAF5",
                        color: "#5D2030",
                        cursor: "pointer",
                      }}
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#5D2030",
                        marginBottom: "6px",
                      }}
                    >
                      PIN Code <span style={{ color: "#E53935" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="6 digits"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      style={{
                        width: "100%",
                        height: "46px",
                        borderRadius: "10px",
                        border: "1px solid #D8CAB8",
                        padding: "0 16px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "#FDFAF5",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#5D2030",
                      marginBottom: "6px",
                    }}
                  >
                    Delivery Notes / Landmark <span style={{ fontSize: "11px", color: "#888", fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Ganesh Temple, ring the bell twice"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: "100%",
                      height: "46px",
                      borderRadius: "10px",
                      border: "1px solid #D8CAB8",
                      padding: "0 16px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#FDFAF5",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Payment Method */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "28px",
                border: "1px solid rgba(187,142,67,0.2)",
                boxShadow: "0 4px 20px rgba(93,32,48,0.03)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "19px",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: "0 0 16px 0",
                  borderBottom: "1px solid #F2ECE1",
                  paddingBottom: "14px",
                }}
              >
                3. Payment Method
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "16px 18px",
                    borderRadius: "12px",
                    border: paymentMethod === "COD" ? "2px solid #BB8E43" : "1px solid #E5D9C8",
                    backgroundColor: paymentMethod === "COD" ? "rgba(187,142,67,0.06)" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    style={{ accentColor: "#BB8E43", width: "18px", height: "18px" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong style={{ color: "#5D2030", fontSize: "15px" }}>Cash on Delivery (COD)</strong>
                      <span
                        style={{
                          fontSize: "11px",
                          backgroundColor: "#BB8E43",
                          color: "#FFF",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontWeight: 600,
                        }}
                      >
                        Popular
                      </span>
                    </div>
                    <span style={{ fontSize: "12.5px", color: "#7A6858" }}>
                      Pay in cash or scan UPI QR upon arrival at your doorstep.
                    </span>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "16px 18px",
                    borderRadius: "12px",
                    border: paymentMethod === "Online" ? "2px solid #BB8E43" : "1px solid #E5D9C8",
                    backgroundColor: paymentMethod === "Online" ? "rgba(187,142,67,0.06)" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={() => setPaymentMethod("Online")}
                    style={{ accentColor: "#BB8E43", width: "18px", height: "18px" }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: "#5D2030", fontSize: "15px" }}>UPI / Online Transfer</strong>
                    <span style={{ display: "block", fontSize: "12.5px", color: "#7A6858" }}>
                      Instant payment via Google Pay, PhonePe, Paytm, or Net Banking.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button (Mobile / Desktop) */}
            <button
              type="submit"
              disabled={submitting || cartItems.length === 0}
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: submitting || cartItems.length === 0 ? "#C4A67A" : "#5D2030",
                color: "#FFFFFF",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: "18px",
                border: "none",
                cursor: submitting || cartItems.length === 0 ? "not-allowed" : "pointer",
                boxShadow: "0 8px 24px rgba(93,32,48,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.2s ease",
              }}
            >
              {submitting ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <span>Place Order • ₹{totalAmount.toLocaleString("en-IN")}</span>
                  <FaWhatsapp size={20} color="#25D366" />
                </>
              )}
            </button>
          </form>

          {/* RIGHT COLUMN: Order Summary Card */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "28px",
                border: "1px solid rgba(187,142,67,0.2)",
                boxShadow: "0 4px 20px rgba(93,32,48,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  borderBottom: "1px solid #F2ECE1",
                  paddingBottom: "14px",
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
                  Order Summary
                </h3>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    backgroundColor: "rgba(93,32,48,0.08)",
                    color: "#5D2030",
                    padding: "3px 10px",
                    borderRadius: "999px",
                  }}
                >
                  {cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0)} Sarees
                </span>
              </div>

              {/* Items List */}
              <div
                style={{
                  maxHeight: "360px",
                  overflowY: "auto",
                  paddingRight: "6px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                {loadingCart ? (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "#888" }}>
                    Loading cart items...
                  </div>
                ) : cartItems.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px 10px", color: "#777" }}>
                    <FiShoppingBag size={36} color="#BB8E43" style={{ marginBottom: "10px" }} />
                    <p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>Your shopping bag is empty.</p>
                    <Link
                      href="/"
                      style={{
                        color: "#5D2030",
                        fontWeight: 700,
                        fontSize: "13px",
                        textDecoration: "underline",
                      }}
                    >
                      Browse Sarees & Collections
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        gap: "14px",
                        alignItems: "center",
                        borderBottom: "1px dashed #EDE5D8",
                        paddingBottom: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "75px",
                          borderRadius: "8px",
                          backgroundColor: "#F7F2EA",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={item.image || "/homepage/casual_model1.jpg"}
                          alt={item.name || item.title || "Saree"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#5D2030",
                            margin: "0 0 4px 0",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name || item.title || "Saree"}
                        </h4>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "12px",
                            color: "#7A6858",
                            marginBottom: "4px",
                          }}
                        >
                          {item.colour && (
                            <span
                              style={{
                                backgroundColor: "rgba(187,142,67,0.12)",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                color: "#8F6627",
                                fontWeight: 500,
                              }}
                            >
                              {item.colour}
                            </span>
                          )}
                          <span>Qty: {item.quantity || 1}</span>
                        </div>

                        <div
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontWeight: 700,
                            color: "#BB8E43",
                            fontSize: "14.5px",
                          }}
                        >
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Price Calculation */}
              <div
                style={{
                  borderTop: "1.5px solid #F2ECE1",
                  paddingTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", color: "#555" }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: "#2F2C24" }}>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "#555" }}>
                  <span>Insured Shipping</span>
                  <span style={{ color: "#128C7E", fontWeight: 700 }}>FREE</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #EDE5D8",
                    paddingTop: "12px",
                    marginTop: "4px",
                    fontSize: "18px",
                  }}
                >
                  <strong
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "#5D2030",
                    }}
                  >
                    Total Payable
                  </strong>
                  <strong
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "#BB8E43",
                    }}
                  >
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              {/* WhatsApp Assurance Box */}
              <div
                style={{
                  marginTop: "24px",
                  backgroundColor: "#F7FDF9",
                  border: "1px dashed #25D366",
                  borderRadius: "12px",
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FaWhatsapp size={26} color="#25D366" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: "12px", color: "#2F2C24", lineHeight: 1.4 }}>
                  <strong style={{ color: "#128C7E", display: "block" }}>Automatic WhatsApp Notification</strong>
                  Receive order confirmation & live courier link directly on your WhatsApp upon clicking Place Order.
                </div>
              </div>

              {/* Guarantees */}
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "12px",
                  color: "#7A6858",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FiCheckCircle size={15} color="#128C7E" />
                  <span>100% Genuine Handloom Quality Guarantee</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FiShield size={15} color="#128C7E" />
                  <span>Authentic Silk Mark & Quality Inspected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
