"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiFileText,
  FiUser,
  FiPackage,
  FiCreditCard,
  FiTruck,
  FiAlertTriangle,
  FiShield,
  FiRefreshCw,
  FiMail,
  FiVideo,
} from "react-icons/fi";
import { FaRupeeSign, FaBalanceScale } from "react-icons/fa";

/* ─── NavLink ─────────────────────────────────────────────────── */
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
      className="tc-nav-link"
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
    >
      {children}
    </Link>
  );
}

/* ─── Lotus Flourish SVG ────────────────────────────────────────── */
function LotusFlourish({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 36 C20 36 8 27 8 17 C8 10.4 13.4 5 20 5 C26.6 5 32 10.4 32 17 C32 27 20 36 20 36Z"
        fill="none"
        stroke="#BB8E43"
        strokeWidth="1.5"
      />
      <path
        d="M20 36 C20 36 12 29 12 21 C12 16.6 15.6 13 20 13 C24.4 13 28 16.6 28 21 C28 29 20 36 20 36Z"
        fill="rgba(187,142,67,0.15)"
        stroke="#BB8E43"
        strokeWidth="1.2"
      />
      <path
        d="M20 5 C14 10 11 15 11 20"
        stroke="#BB8E43"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M20 5 C26 10 29 15 29 20"
        stroke="#BB8E43"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="20" cy="21" r="2.5" fill="#BB8E43" />
    </svg>
  );
}


/* ─── Terms & Conditions Section Data ────────────────────────────── */
const TERMS_SECTIONS = [
  {
    num: "01",
    id: "s01",
    Icon: FiFileText,
    title: "Acceptance of Terms",
    body: "By using our website or placing an order, you agree to be bound by these Terms & Conditions and any applicable laws and regulations.",
  },
  {
    num: "02",
    id: "s02",
    Icon: FiUser,
    title: "Customer Accounts",
    body: "You are responsible for providing accurate information and keeping your account details secure.",
  },
  {
    num: "03",
    id: "s03",
    Icon: FiPackage,
    title: "Product Information",
    body: "We make every effort to display accurate product details, images and descriptions. Actual colors and designs may vary slightly due to lighting, screen settings or the nature of the fabric.",
  },
  {
    num: "04",
    id: "s04",
    Icon: FiCreditCard,
    title: "Pricing and Payments",
    body: "Prices are displayed in INR and may be subject to change. You can choose from available payment methods and your order will be confirmed after successful payment.",
  },
  {
    num: "05",
    id: "s05",
    Icon: FiShoppingCart,
    title: "Orders and Cancellation",
    body: "Once you place an order, we will confirm it based on availability. Cancellation options will be available as per our cancellation policy.",
  },
  {
    num: "06",
    id: "s06",
    Icon: FiTruck,
    title: "Shipping and Delivery",
    body: "We will deliver your order to the provided address. Delivery timelines are estimated and may vary due to unforeseen circumstances.",
  },
  {
    num: "07",
    id: "s07",
    Icon: FiPackage,
    title: "Returns and Replacements",
    body: "You can request a return or replacement for eligible items as per our return policy. Conditions and process will be applicable as stated on our website.",
  },
  {
    num: "08",
    id: "s08",
    Icon: FaRupeeSign,
    title: "Refund Policy",
    body: "Refunds will be processed as per our refund policy and applicable law. The amount will be credited through the original payment method or another agreed method.",
  },
  {
    num: "09",
    id: "s09",
    Icon: FiVideo,
    title: "Mandatory Unboxing Video for Refund Claims",
    isUnboxingVideo: true,
  },
  {
    num: "10",
    id: "s10",
    Icon: FiAlertTriangle,
    title: "Damaged, Defective, Incorrect or Missing Products",
    body: "Please report any issues with your order promptly through our customer support channel with relevant details and evidence (including the unboxing video where applicable).",
  },
  {
    num: "11",
    id: "s11",
    Icon: FiUser,
    title: "Customer Responsibilities",
    body: "Ensure accurate order details, provide correct information and use the website responsibly and lawfully.",
  },
  {
    num: "12",
    id: "s12",
    Icon: FiShield,
    title: "Intellectual Property",
    body: "All content on this website, including images, text, logos and designs, are the property of our brand and cannot be used without permission.",
  },
  {
    num: "13",
    id: "s13",
    Icon: FiFileText,
    title: "Limitation of Liability",
    body: "We are not liable for any indirect, incidental or consequential losses arising from the use of our website or products, to the extent permitted by law.",
  },
  {
    num: "14",
    id: "s14",
    Icon: FiRefreshCw,
    title: "Changes to Terms",
    body: "We may update these Terms & Conditions from time to time. The revised version will be posted on this page with the updated date.",
  },
  {
    num: "15",
    id: "s15",
    Icon: FaBalanceScale,
    title: "Governing Law and Dispute Resolution",
    body: "These Terms & Conditions are governed by Indian law. Any disputes will be subject to the jurisdiction of the courts in India.",
  },
  {
    num: "16",
    id: "s16",
    Icon: FiMail,
    title: "Contact Us",
    isContact: true,
  },
];

/* ─── Sidebar Quick Links ────────────────────────────────────────── */
const QUICK_LINKS = [
  { num: "01", label: "Acceptance of Terms", id: "s01" },
  { num: "02", label: "Customer Accounts", id: "s02" },
  { num: "03", label: "Product Information", id: "s03" },
  { num: "04", label: "Pricing and Payments", id: "s04" },
  { num: "05", label: "Orders and Cancellation", id: "s05" },
  { num: "06", label: "Shipping and Delivery", id: "s06" },
  { num: "07", label: "Returns and Replacements", id: "s07" },
  { num: "08", label: "Refund Policy", id: "s08" },
  { num: "09", label: "Unboxing Video Policy", id: "s09" },
  { num: "10", label: "Damaged or Missing Products", id: "s10" },
  { num: "11", label: "Customer Responsibilities", id: "s11" },
  { num: "12", label: "Intellectual Property", id: "s12" },
  { num: "13", label: "Limitation of Liability", id: "s13" },
  { num: "14", label: "Changes to Terms", id: "s14" },
  { num: "15", label: "Governing Law & Dispute Resolution", id: "s15" },
  { num: "16", label: "Contact Us", id: "s16" },
];

export default function TermsAndConditionsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF6EE",
        color: "#2F2C24",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* ════════════════════════════════════════
          1. HEADER / NAVBAR — Same as Home Page
         ════════════════════════════════════════ */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#FCF8F2",
          boxShadow: "0 1px 0 rgba(93,32,48,0.07)",
        }}
      >
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
          }}
        >
          {/* Brand Logo */}
          <Link href="/" style={{ display: "inline-block", flexShrink: 0 }}>
            <img
              src="/homepage/logo2_trans.png"
              alt="Sree Collections"
              style={{
                height: "72px",
                width: "auto",
                objectFit: "contain",
                maxWidth: "320px",
                display: "block",
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="tc-desktop-nav"
            style={{
              display: "none",
              alignItems: "center",
              gap: "36px",
            }}
          >
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <Link
              href="/contact"
              className="tc-cta-btn"
              style={{
                background: "#BA8E43",
                color: "#FFF",
                fontFamily: "var(--font-serif)",
                fontSize: "12.5px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                padding: "11px 28px",
                borderRadius: "9999px",
                boxShadow: "0 2px 10px rgba(186,142,67,0.25)",
                display: "inline-flex",
                alignItems: "center",
                transition: "all 0.25s ease",
                textDecoration: "none",
              }}
            >
              CONTACT US
            </Link>
            <Link
              href="/search"
              aria-label="Search"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#5A2035",
                padding: "4px",
              }}
            >
              <FiSearch size={22} strokeWidth={2} />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#5A2035",
                padding: "4px",
              }}
            >
              <FiShoppingCart size={22} strokeWidth={2} />
            </Link>
          </nav>

          {/* Mobile Actions */}
          <div
            className="mobile-header-actions"
            style={{
              display: "none",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <a
              href="/search"
              aria-label="Search"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#5A2035",
                padding: "6px",
              }}
            >
              <FiSearch size={21} strokeWidth={2} />
            </a>
            <Link
              href="/cart"
              aria-label="Cart"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#5A2035",
                padding: "6px",
              }}
            >
              <FiShoppingCart size={21} strokeWidth={2} />
            </Link>
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
              className="tc-hamburger mobile-hamburger"
            >
              {mobileMenuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
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
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <FiX size={24} />
              </button>
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "20px",
              }}
            >
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/categories", label: "Categories" },
                { href: "/contact", label: "Contact Us" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#5A2035",
                    fontFamily: "var(--font-serif)",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          2. MAIN CONTAINER WITH TWO COLUMNS
         ════════════════════════════════════════ */}
      <div
        className="tc-container"
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "32px 24px 80px 24px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Main Grid: Left Sidebar | Right Content */}
        <div
          className="tc-body-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "276px 1fr",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* ════ LEFT COLUMN: STICKY SIDEBAR ════ */}
          <aside className="tc-sidebar" style={{ position: "sticky", top: "108px" }}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid rgba(187,142,67,0.22)",
                boxShadow: "0 4px 20px rgba(93,32,48,0.04)",
                overflow: "hidden",
                padding: "24px 18px",
              }}
            >
              {/* Quick Links Header */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                  paddingBottom: "8px",
                }}
              >
                <div style={{ marginBottom: "6px" }}>
                  <LotusFlourish size={22} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Blacker Display', Georgia, serif",
                    fontSize: "21px",
                    fontWeight: 700,
                    color: "#5D2030",
                    margin: 0,
                    letterSpacing: "0.2px",
                  }}
                >
                  Quick Links
                </h3>
              </div>

              {/* Numbered Quick Links List */}
              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                  marginBottom: "20px",
                }}
              >
                {QUICK_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className="tc-sidebar-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      textDecoration: "none",
                      padding: "4px 6px",
                      borderRadius: "6px",
                      transition: "all 0.18s ease",
                    }}
                  >
                    {/* Number pill */}
                    <span
                      style={{
                        minWidth: "25px",
                        height: "19px",
                        borderRadius: "10px",
                        border: "1.2px solid rgba(187,142,67,0.45)",
                        backgroundColor: "rgba(187,142,67,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-sans)",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#BB8E43",
                        flexShrink: 0,
                      }}
                    >
                      {link.num}
                    </span>
                    {/* Label */}
                    <span
                      className="tc-sidebar-label"
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        color: "#5D2030",
                        fontWeight: 500,
                        lineHeight: 1.35,
                      }}
                    >
                      {link.label}
                    </span>
                  </a>
                ))}
              </nav>

              {/* Elegant flourish divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  margin: "14px 0 16px 0",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "1px",
                    backgroundColor: "#BB8E43",
                    opacity: 0.6,
                  }}
                />
                <LotusFlourish size={15} />
                <div
                  style={{
                    width: "28px",
                    height: "1px",
                    backgroundColor: "#BB8E43",
                    opacity: 0.6,
                  }}
                />
              </div>

              {/* "Thank you" Quote Block */}
              <div
                style={{
                  textAlign: "center",
                  padding: "0 8px 16px 8px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Blacker Display', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "25px",
                    fontWeight: 700,
                    color: "#5D2030",
                    margin: "0 0 4px 0",
                    lineHeight: 1.2,
                  }}
                >
                  Thank you
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    color: "#756658",
                    margin: "0 0 12px 0",
                    lineHeight: 1.4,
                  }}
                >
                  for being a part of our saree family
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <LotusFlourish size={16} />
                </div>

                {/* Sidebar Image */}
                <div
                  style={{
                    width: "100%",
                    height: "145px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid rgba(187,142,67,0.2)",
                  }}
                >
                  <img
                    src="/homepage/terms_hero_fabric.jpg"
                    alt="Traditional Saree & Brass Bowl"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "left bottom",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* ════ RIGHT COLUMN: HERO + SECTIONS ════ */}
          <main>
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "14px",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "#9A8B7E",
              }}
            >
              <Link
                href="/"
                className="tc-crumb"
                style={{
                  color: "#9A8B7E",
                  textDecoration: "none",
                  transition: "color 0.18s",
                }}
              >
                Home
              </Link>
              <span style={{ color: "#BB8E43" }}>›</span>
              <span style={{ color: "#5D2030", fontWeight: 600 }}>
                Terms &amp; Conditions
              </span>
            </nav>

            {/* Hero Row: Heading & Intro on Left, Hero Fabric Image on Right */}
            <div
              className="tc-hero-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1.15fr 0.85fr",
                gap: "32px",
                alignItems: "center",
                marginBottom: "28px",
              }}
            >
              {/* Left Heading & Intro */}
              <div>
                <h1
                  style={{
                    fontFamily: "'Blacker Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: "clamp(34px, 3.8vw, 52px)",
                    lineHeight: 1.12,
                    color: "#5D2030",
                    margin: "0 0 14px 0",
                  }}
                >
                  Terms &amp; Conditions
                </h1>

                {/* Decorative Floral Ornament */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    marginBottom: "16px",
                  }}
                >
                  <LotusFlourish size={20} />
                  <div
                    style={{
                      width: "48px",
                      height: "1.2px",
                      backgroundColor: "#BB8E43",
                      opacity: 0.6,
                    }}
                  />
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13.5px",
                    lineHeight: 1.8,
                    color: "#756658",
                    margin: 0,
                    maxWidth: "520px",
                  }}
                >
                  By accessing and using our website, you agree to these Terms
                  &amp; Conditions. Please read them carefully before placing an
                  order or using our services.
                </p>
              </div>

              {/* Right Decorative Silk Saree Still Life Image */}
              <div
                style={{
                  width: "100%",
                  height: "230px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(93,32,48,0.09)",
                  border: "1px solid rgba(187,142,67,0.2)",
                }}
              >
                <img
                  src="/homepage/terms_hero_fabric.jpg"
                  alt="Luxury Saree with Brass bowl and Jasmine flowers"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
              </div>
            </div>

            {/* Last Updated Badge */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(187,142,67,0.08)",
                  border: "1px solid rgba(187,142,67,0.3)",
                  borderRadius: "999px",
                  padding: "5px 14px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "#8F6627",
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: "#BB8E43",
                    display: "inline-block",
                  }}
                />
                Last Updated: 10 Aug 2025
              </span>
            </div>

            {/* ── Policy Sections List (01 - 16) ── */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {TERMS_SECTIONS.map((sec, idx) => {
                const Icon = sec.Icon;
                const isLast = idx === TERMS_SECTIONS.length - 1;

                if (sec.isUnboxingVideo) {
                  return (
                    <div
                      key={sec.id}
                      id={sec.id}
                      className="tc-sec-row tc-unboxing-row"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "44px 1fr",
                        gap: "0 14px",
                        alignItems: "flex-start",
                        margin: "18px 0",
                      }}
                    >
                      {/* Col 1: Gold Oval Badge */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "flex-end",
                          paddingTop: "18px",
                        }}
                      >
                        <div
                          style={{
                            minWidth: "36px",
                            height: "26px",
                            borderRadius: "13px",
                            border: "1.5px solid rgba(187,142,67,0.45)",
                            backgroundColor: "rgba(187,142,67,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-sans)",
                            fontSize: "10.5px",
                            fontWeight: 800,
                            color: "#BB8E43",
                            letterSpacing: "0.3px",
                            userSelect: "none",
                          }}
                        >
                          {sec.num}
                        </div>
                      </div>

                      {/* Col 2: Highlighted Warm Golden/Beige Card */}
                      <div
                        style={{
                          backgroundColor: "#FAF3E6",
                          border: "1px solid rgba(187,142,67,0.28)",
                          borderRadius: "14px",
                          padding: "20px 24px",
                          boxShadow: "0 2px 12px rgba(187,142,67,0.06)",
                        }}
                      >
                        {/* Title with Video Icon */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "12px",
                          }}
                        >
                          <Icon size={20} color="#5D2030" strokeWidth={1.8} />
                          <h2
                            style={{
                              fontFamily: "'Blacker Display', Georgia, serif",
                              fontSize: "17.5px",
                              fontWeight: 700,
                              color: "#5D2030",
                              margin: 0,
                              lineHeight: 1.25,
                            }}
                          >
                            {sec.title}
                          </h2>
                        </div>

                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "13px",
                            lineHeight: 1.75,
                            color: "#5A4A3A",
                            margin: "0 0 12px 0",
                          }}
                        >
                          To be eligible for a refund, you must record a clear,
                          continuous, unedited video while opening the delivered
                          package. The video should show:
                        </p>

                        {/* Two columns of bullet points */}
                        <div
                          className="tc-unboxing-bullets"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1.25fr 1fr",
                            gap: "8px 24px",
                            marginBottom: "14px",
                            fontFamily: "var(--font-sans)",
                            fontSize: "12.5px",
                            color: "#5A4A3A",
                            lineHeight: 1.6,
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                              <span style={{ color: "#BB8E43", fontWeight: 700 }}>•</span>
                              <span>The unopened package and shipping label (where possible)</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                              <span style={{ color: "#BB8E43", fontWeight: 700 }}>•</span>
                              <span>The opening of the package</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                              <span style={{ color: "#BB8E43", fontWeight: 700 }}>•</span>
                              <span>The received product</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                              <span style={{ color: "#BB8E43", fontWeight: 700 }}>•</span>
                              <span>Any damage, defect, incorrect item or missing item</span>
                            </div>
                          </div>
                        </div>

                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "12.5px",
                            lineHeight: 1.75,
                            color: "#6B5848",
                            margin: 0,
                          }}
                        >
                          Keep the original packaging and submit the video along
                          with your order ID and issue details through our
                          existing customer support channel. Claims must be
                          submitted within the return or claim period as per our
                          verified procedure and applicable law. A submitted
                          video does not guarantee a refund. Claims without the
                          required video may be difficult to verify and may not
                          qualify under this policy.
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={sec.id}
                    id={sec.id}
                    className="tc-sec-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "44px 44px 1fr",
                      gap: "0 14px",
                      alignItems: "flex-start",
                      padding: "20px 0",
                      borderBottom: !isLast
                        ? "1px solid rgba(93,32,48,0.08)"
                        : "none",
                      transition: "background 0.2s ease",
                    }}
                  >
                    {/* Col 1: Gold Oval Badge */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        paddingTop: "2px",
                      }}
                    >
                      <div
                        style={{
                          minWidth: "36px",
                          height: "26px",
                          borderRadius: "13px",
                          border: "1.5px solid rgba(187,142,67,0.45)",
                          backgroundColor: "rgba(187,142,67,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-sans)",
                          fontSize: "10.5px",
                          fontWeight: 800,
                          color: "#BB8E43",
                          letterSpacing: "0.3px",
                          userSelect: "none",
                        }}
                      >
                        {sec.num}
                      </div>
                    </div>

                    {/* Col 2: Icon Circle */}
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "1.5px solid rgba(93,32,48,0.13)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        backgroundColor: "rgba(93,32,48,0.02)",
                      }}
                    >
                      <Icon size={16} color="#5D2030" strokeWidth={1.8} />
                    </div>

                    {/* Col 3: Section Content */}
                    <div style={{ paddingTop: "1px" }}>
                      <h2
                        style={{
                          fontFamily: "'Blacker Display', Georgia, serif",
                          fontSize: "17.5px",
                          fontWeight: 700,
                          color: "#5D2030",
                          margin: "0 0 6px 0",
                          lineHeight: 1.25,
                        }}
                      >
                        {sec.title}
                      </h2>

                      {sec.isContact ? (
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "13px",
                            lineHeight: 1.8,
                            color: "#5A4A3A",
                            margin: 0,
                          }}
                        >
                          If you have any questions or concerns regarding these
                          Terms &amp; Conditions, please visit our{" "}
                          <Link
                            href="/contact"
                            style={{
                              color: "#BB8E43",
                              textDecoration: "underline",
                              textUnderlineOffset: "2px",
                              fontWeight: 600,
                            }}
                          >
                            Contact Us
                          </Link>{" "}
                          page or get in touch with us through the details
                          provided there.
                        </p>
                      ) : (
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "13px",
                            lineHeight: 1.8,
                            color: "#5A4A3A",
                            margin: 0,
                          }}
                        >
                          {sec.body}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Floral Flourish */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginTop: "44px",
                paddingBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "1px",
                  backgroundColor: "#BB8E43",
                  opacity: 0.5,
                }}
              />
              <LotusFlourish size={18} />
              <div
                style={{
                  width: "44px",
                  height: "1px",
                  backgroundColor: "#BB8E43",
                  opacity: 0.5,
                }}
              />
            </div>
          </main>
        </div>
      </div>


      {/* ════════════════════════════════════════
          RESPONSIVE STYLES
         ════════════════════════════════════════ */}
      <style>{`
        @media (min-width: 992px) {
          .tc-desktop-nav { display: flex !important; }
          .mobile-header-actions { display: none !important; }
        }
        @media (max-width: 991px) {
          .tc-desktop-nav { display: none !important; }
          .mobile-header-actions { display: flex !important; }
          .tc-hamburger { display: flex !important; }
        }
        @media (max-width: 920px) {
          .tc-body-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .tc-sidebar {
            position: static !important;
          }
          .tc-hero-row {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .tc-container {
            padding: 24px 16px 60px 16px !important;
          }
          .tc-hero-row h1 {
            font-size: clamp(26px, 7vw, 40px) !important;
          }
        }
        @media (max-width: 600px) {
          .tc-unboxing-bullets {
            grid-template-columns: 1fr !important;
          }
          .tc-sec-row {
            grid-template-columns: 36px 36px 1fr !important;
            gap: 0 10px !important;
          }
          .tc-unboxing-row {
            grid-template-columns: 36px 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .tc-container {
            padding: 16px 12px 40px 12px !important;
          }
          .tc-hero-row h1 {
            font-size: clamp(22px, 6.5vw, 30px) !important;
          }
          .tc-sec-row {
            grid-template-columns: 30px 32px 1fr !important;
            gap: 0 8px !important;
            padding: 14px 0 !important;
          }
          .tc-unboxing-row {
            grid-template-columns: 30px 1fr !important;
            gap: 0 8px !important;
          }
          .tc-unboxing-row > div:last-child {
            padding: 16px 12px !important;
          }
          .tc-sec-row h2 {
            font-size: 15.5px !important;
          }
          .tc-sec-row p {
            font-size: 12.5px !important;
            line-height: 1.7 !important;
          }
        }
        .tc-nav-link:hover { opacity: 0.72; }
        .tc-cta-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .tc-crumb:hover { color: #5D2030 !important; }
        .tc-sidebar-link:hover {
          background-color: rgba(187, 142, 67, 0.08);
        }
        .tc-sidebar-link:hover .tc-sidebar-label {
          color: #BB8E43 !important;
        }
        .tc-sec-row:hover {
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
