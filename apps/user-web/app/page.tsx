"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiShoppingCart,
  FiArrowRight,
  FiArrowLeft,
  FiChevronRight,
  FiMenu,
  FiX,
  FiInstagram,
  FiFacebook,
  FiPhone,
  FiMail,
  FiCheckCircle,
} from "react-icons/fi";
import { FaWhatsapp, FaPinterest } from "react-icons/fa";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const testimonials = [
    {
      quote:
        "The silk saree and the temple necklace set I ordered for my sister's wedding completely surpassed my expectations. The zari craftsmanship is truly heirloom quality and the luxury packaging made it feel like a royal gift!",
      author: "Priya Sundaram",
      location: "Chennai, India",
      role: "Verified Bride",
      rating: 5,
    },
    {
      quote:
        "Shopping via WhatsApp concierge was the smoothest experience ever. They shared detailed 4K close-up videos of the Banarasi weaves and helped me pick the matching blouse fabric. Exceptional service!",
      author: "Ananya Deshmukh",
      location: "Mumbai, India",
      role: "Verified Buyer",
      rating: 5,
    },
    {
      quote:
        "Ordered from the US and my parcel arrived in just 4 days with pristine packing. The fabric is so soft, breathable, and authentic. Sree Collections has earned a lifelong customer!",
      author: "Radhika Patel",
      location: "San Jose, USA",
      role: "International Client",
      rating: 5,
    },
  ];

  return (
    <div style={{ backgroundColor: "#FCF8F2", minHeight: "100vh", overflowX: "hidden" }}>
      {/* =========================================================================
          1. HEADER (Exact Navbar Alignment from Reference Screenshot)
          - Logo on Left
          - Right-aligned: Home (with active underline), About, Categories,
            "CONTACT US" golden pill button, Search icon, Cart icon
         ========================================================================= */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <header
          style={{
            width: "100%",
            maxWidth: "1360px",
            minHeight: "95px",
            margin: "12px auto 0 auto",
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
            <a href="#" style={{ display: "inline-block" }}>
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
            </a>
          </div>

          {/* Desktop Navigation Links & Action Items (Exact Match) */}
          <nav
            style={{
              display: "none",
              alignItems: "center",
              gap: "36px",
            }}
            className="desktop-nav"
          >
            <a
              href="#home"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "17px",
                fontWeight: 700,
                color: "#5A2035",
                borderBottom: "2.5px solid #5A2035",
                paddingBottom: "3px",
                lineHeight: 1.2,
              }}
            >
              Home
            </a>
            <a
              href="#about"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "17px",
                fontWeight: 700,
                color: "#5A2035",
                transition: "opacity 0.2s",
                lineHeight: 1.2,
              }}
              className="nav-link"
            >
              About
            </a>
            <a
              href="/categories"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "17px",
                fontWeight: 700,
                color: "#5A2035",
                transition: "opacity 0.2s",
                lineHeight: 1.2,
              }}
              className="nav-link"
            >
              Categories
            </a>

            {/* CONTACT US Pill Button */}
            <a
              href="/contact"
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
              }}
              className="primary-btn"
            >
              CONTACT US
            </a>

            {/* Search Icon */}
            <a
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
            </a>

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
              }}
            >
              <FiShoppingCart size={22} strokeWidth={2} />
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              display: "none",
              padding: "8px",
              color: "#2F2C24",
            }}
            className="mobile-hamburger"
          >
            {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
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
            zIndex: 100,
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
              <img src="/homepage/logo2.png" alt="Logo" style={{ height: "48px" }} />
              <button onClick={() => setMobileMenuOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
              <a href="#home" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "16px", fontWeight: 600 }}>Home</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "16px", fontWeight: 500 }}>About</a>
              <a href="/categories" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "16px", fontWeight: 500 }}>Categories</a>
              <a href="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "16px", fontWeight: 500 }}>Contact Us</a>
            </nav>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. HERO SECTION
          Exact Match with Figma Reference:
          - Background Watermark: Clean SC circular emblem (no text)
          - Left-Aligned Heading:
            Line 1: Dive Into A W❂rld Of Endless
            Line 2: Fashion Possibilities  +  Subtitle right beside it
          - Three-Column Bento Cards Container (enclosed in outer border):
            * Column 1: Model in coat inside inner border
            * Column 2: Top box with buttons inside inner border + Bottom jewelry card
            * Column 3: Bride composite image
         ========================================================================= */}
      <section
        id="home"
        style={{
          width: "100%",
          maxWidth: "1360px",
          margin: "16px auto 60px auto",
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Subtle Royal SC Circular Crest Watermark in Background (Accurate Size, Opacity, Position) */}
        <div
          style={{
            position: "absolute",
            top: "385px",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "740px",
            height: "740px",
            backgroundImage: "url('/homepage/sc_crest_watermark_trans.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.065,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Main Hero Heading Container (Left Aligned to match reference) */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            margin: "0 0 24px 0",
            padding: "0 4px",
            boxSizing: "border-box",
            textAlign: "left",
          }}
        >
          {/* Line 1: Dive Into A W❂rld Of Endless */}
          <h1
            style={{
              fontFamily: "'Blacker Display', var(--font-serif)",
              fontSize: "clamp(34px, 4.3vw, 56px)",
              fontWeight: 700,
              color: "#5A2035",
              lineHeight: 1.15,
              margin: "0 0 6px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Dive Into A W<span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                verticalAlign: "middle",
                margin: "0 1px",
                width: "0.82em",
                height: "0.82em",
                transform: "translateY(-0.06em)",
              }}
            >
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block" }}>
                <circle cx="50" cy="50" r="48" fill="#BA8E43" />
                <circle cx="50" cy="50" r="43" fill="#B3863B" stroke="#DFC487" strokeWidth="1.5" />
                <g fill="#FFFDF8">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <path
                      key={i}
                      d="M 50 15 C 54.5 15, 55 35, 50 41 C 45 35, 45.5 15, 50 15 Z"
                      transform={`rotate(${angle} 50 50)`}
                    />
                  ))}
                </g>
                <circle cx="50" cy="50" r="8" fill="#BA8E43" stroke="#FFFDF8" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="2.5" fill="#FFFDF8" />
              </svg>
            </span>rld Of Endless
          </h1>

          {/* Line 2: Fashion Possibilities + Subtitle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "28px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "'Blacker Display', var(--font-serif)",
                fontSize: "clamp(34px, 4.3vw, 56px)",
                fontWeight: 700,
                color: "#5A2035",
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
              }}
            >
              Fashion Possibilities
            </span>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13.5px",
                fontWeight: 600,
                color: "#5A2035",
                maxWidth: "350px",
                margin: 0,
                lineHeight: 1.4,
                letterSpacing: "0.1px",
              }}
            >
              Elevate Your Wardrobe With Our Fashion Finds. Discover
              <br />
              Your Signature Style At Fashion Avenue.
            </p>
          </div>
        </div>

        {/* Three-Column Promotional Product Grid with Stepped Outer Frame */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            boxSizing: "border-box",
          }}
          className="hero-grid-outer"
        >
          {/* Custom Stepped Frame SVG Overlay (Matches Reference Outline Exactly) */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 3,
            }}
            viewBox="0 0 1000 460"
            preserveAspectRatio="none"
            className="hero-frame-svg"
          >
            <path
              d="M 28 2
                 L 301 2
                 C 310 2, 314 8, 314 20
                 L 314 142
                 C 314 152, 320 156, 328 156
                 L 634 156
                 C 642 156, 648 152, 648 142
                 L 648 20
                 C 648 8, 652 2, 661 2
                 L 972 2
                 A 26 26 0 0 1 998 28
                 L 998 432
                 A 26 26 0 0 1 972 458
                 L 28 458
                 A 26 26 0 0 1 2 432
                 L 2 28
                 A 26 26 0 0 1 28 2
                 Z"
              fill="none"
              stroke="#DECDBE"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "285fr 320fr 323fr",
              gap: "20px",
              alignItems: "stretch",
              padding: "16px",
              boxSizing: "border-box",
            }}
            className="hero-three-cols"
          >
            {/* Column 1 (Left): Model in Coat (Clean image, no duplicate inner border) */}
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                borderRadius: "24px",
                overflow: "hidden",
              }}
              className="float-hover"
            >
              <img
                src="/homepage/hero_col1.png"
                alt="Fashion Model in Coat"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "24px",
                  display: "block",
                }}
              />
            </div>

            {/* Column 2 (Center): CTA Buttons Box + Bangles with Badges */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              {/* Top: Buttons Container with Single Clean Border */}
              <div
                style={{
                  border: "1.5px solid #DECDBE",
                  borderRadius: "28px",
                  padding: "18px 22px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "12px",
                  boxSizing: "border-box",
                  backgroundColor: "transparent",
                }}
              >
                {/* Button 1: SHOP NOW ───────> */}
                <a
                  href="#featured"
                  style={{
                    background: "#BA8E43",
                    color: "#FFFFFF",
                    borderRadius: "9999px",
                    height: "46px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    boxShadow: "0 3px 12px rgba(186, 142, 67, 0.22)",
                    transition: "all 0.25s ease",
                  }}
                  className="primary-btn"
                >
                  <span>SHOP NOW</span>
                  <span style={{ fontSize: "15px", letterSpacing: "-1.5px", fontWeight: 400 }}>───────&gt;</span>
                </a>

                {/* Button 2: EXPLORE MORE PRODUCTS */}
                <a
                  href="#categories"
                  style={{
                    border: "1.5px solid #BA8E43",
                    background: "transparent",
                    color: "#BA8E43",
                    borderRadius: "9999px",
                    height: "46px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    transition: "all 0.25s ease",
                  }}
                  className="secondary-outline-btn"
                >
                  <span>EXPLORE MORE PRODUCTS</span>
                </a>
              </div>

              {/* Bottom: Bangles Card with Floating Badges */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "24px",
                  overflow: "hidden",
                }}
                className="float-hover"
              >
                <img
                  src="/homepage/hero_bangles.png"
                  alt="Awesome Gold Jewelry Collection"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: "24px",
                  }}
                />

                {/* Top-Right Badge: TRENDING / Awesome Collection */}
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "16px",
                    textAlign: "right",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "#FFFFFF",
                      color: "#685F53",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: "10px",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      marginBottom: "3px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    }}
                  >
                    TRENDING
                  </span>
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "13px",
                      color: "#5A2035",
                      lineHeight: 1.15,
                    }}
                  >
                    Awesome
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "15.5px",
                      fontWeight: 700,
                      color: "#5A2035",
                      lineHeight: 1.15,
                    }}
                  >
                    Collection
                  </div>
                </div>

                {/* Bottom-Right Badge: View All + Circular Arrow */}
                <a
                  href="#featured"
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                    }}
                  >
                    View All
                  </span>
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#5A2035",
                      fontSize: "9px",
                      fontWeight: "bold",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  >
                    ↗
                  </div>
                </a>
              </div>
            </div>

            {/* Column 3 (Right): Bride & Product Sets (Hero Col 3, clean image, no extra border) */}
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                borderRadius: "24px",
                overflow: "hidden",
              }}
              className="float-hover"
            >
              <img
                src="/homepage/hero_col3.png"
                alt="Bridal Jewelry and Sets"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "24px",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED PRODUCTS / FEATURED COLLECTION
          Spec: width: 348; height: 45; font-family: Blacker Display; font-weight: 700;
                font-size: 40px; text-transform: capitalize; background: #5D2030;
                Visual: /homepage/img3.png
         ========================================================================= */}
      <section
        id="featured"
        style={{
          width: "100%",
          maxWidth: "1535px",
          margin: "40px auto 90px auto",
          padding: "0 24px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: "26px" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontSize: "40px",
              lineHeight: "100%",
              letterSpacing: "-0.03em",
              textTransform: "capitalize",
              color: "#5D2030",
              margin: "0 auto",
            }}
          >
            Featured Collection
          </h2>
        </div>

        {/* Category Pill Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "36px",
            flexWrap: "wrap",
          }}
        >
          {["All", "Silk Sarees", "Bridal Lehengas", "Temple Jewellery", "Ethnic Casuals"].map(
            (tab) => {
              const isActive = activeTab.toLowerCase() === tab.toLowerCase() || (activeTab === "all" && tab === "All");
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  style={{
                    padding: "9px 24px",
                    borderRadius: "24px",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.3px",
                    transition: "all 0.25s ease",
                    backgroundColor: isActive ? "#5D2030" : "#FFFDF9",
                    color: isActive ? "#FFFFFF" : "#554D42",
                    border: isActive ? "1px solid #5D2030" : "1px solid #E5D7C5",
                    boxShadow: isActive ? "0 4px 14px rgba(93, 32, 48, 0.25)" : "none",
                  }}
                >
                  {tab}
                </button>
              );
            }
          )}
        </div>

        {/* Featured Showcase: img3.png */}
        <div
          style={{
            width: "100%",
            maxWidth: "1440px",
            margin: "0 auto",
            position: "relative",
            borderRadius: "32px",
            overflow: "hidden",
            boxShadow: "0 18px 45px rgba(93, 32, 48, 0.08)",
            transition: "transform 0.35s ease",
          }}
          className="float-hover"
        >
          <img
            src="/homepage/img3.png"
            alt="Sree Collections Featured Fan Showcase"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "32px",
            }}
          />
        </div>
      </section>

      {/* =========================================================================
          4. FREE DELIVERY SPECIAL OFFER BANNER
          Spec: width: 1540; height: 396; top: 50px; left: 94px;
                border-radius: 24px; border: 4px solid #BB8E43;
                box-shadow: 0px 4px 10px 0px #BB8E43;
                Free Delivery: font-family: Blacker Display; font-size: 72px; color: #5D2030;
                Order above $99/-: font-family: Turnkey Lite; font-size: 40.5px; color: #2F2C24;
                Truck: /homepage/img4.png
         ========================================================================= */}
      <section
        style={{
          width: "100%",
          maxWidth: "1540px",
          margin: "40px auto 90px auto",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            minHeight: "396px",
            borderRadius: "24px",
            border: "4px solid #BB8E43",
            boxShadow: "0px 4px 18px rgba(187, 142, 67, 0.45)",
            background: "linear-gradient(135deg, #FFFDF8 0%, #FBF3E6 50%, #F5E5CD 100%)",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 60px",
            position: "relative",
            overflow: "hidden",
            flexWrap: "wrap",
            gap: "24px",
          }}
          className="delivery-banner"
        >
          <div
            style={{
              position: "absolute",
              right: "-60px",
              top: "-60px",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(187, 142, 67, 0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Left: Red Delivery Truck (img4.png) */}
          <div
            style={{
              flex: "1 1 540px",
              maxWidth: "680px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/homepage/img4.png"
              alt="Free Express Delivery Truck with Saree & Jewelry"
              style={{
                width: "100%",
                maxHeight: "340px",
                objectFit: "contain",
                filter: "drop-shadow(0 12px 24px rgba(93, 32, 48, 0.18))",
                transition: "transform 0.4s ease",
              }}
              className="delivery-truck"
            />
          </div>

          {/* Right: Spec Titles */}
          <div
            style={{
              flex: "1 1 480px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "10px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "clamp(44px, 4.8vw, 72px)",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#5D2030",
                marginBottom: "16px",
              }}
            >
              Free Delivery
            </div>

            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "clamp(24px, 2.7vw, 40.5px)",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#2F2C24",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "22px",
              }}
            >
              🛍️ Order above $99/-
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "rgba(187, 142, 67, 0.12)",
                border: "1px solid rgba(187, 142, 67, 0.35)",
                padding: "8px 20px",
                borderRadius: "20px",
                color: "#6D5322",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              <FiCheckCircle size={16} color="#BB8E43" /> No Code Required • Worldwide Express Delivery
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CATEGORIES / SHOWCASE MOSAIC GRID (User's Exact Frame Specifications)
          Row 1 Left Frame 1: width: 605.85; height: 288.75; border-radius: 24px;
          Row 1 Left Frame 2: width: 605.85; height: 288.75; border-radius: 24px;
          Row 1 Right Tall Frame: width: 660.45; height: 630; border-radius: 24px;
          Row 2 Frame 1: width: 271.95; height: 357; border-radius: 24px;
          Row 2 Frame 2: width: 665.70; height: 357; border-radius: 24px;
          Row 2 Frame 3: width: 271.95; height: 357; border-radius: 24px;
         ========================================================================= */}
      <section
        id="categories"
        style={{
          width: "100%",
          maxWidth: "1535px",
          margin: "40px auto 90px auto",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13.5px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "3px",
              color: "#BB8E43",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Discover By Category
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontSize: "clamp(30px, 3.2vw, 40px)",
              color: "#5D2030",
              margin: 0,
            }}
          >
            Explore Our World of Styles
          </h2>
        </div>

        {/* Top Mosaic Row */}
        <div className="mosaic-top-container">
          {/* Left Column: Two stacked frames (605.85 x 288.75) */}
          <div className="mosaic-left-column">
            {/* Frame 1: Denim Wear */}
            <div
              style={{
                width: "100%",
                height: "288.75px",
                borderRadius: "24px",
                backgroundColor: "#DDEBEA",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                boxShadow: "0 10px 28px rgba(0,0,0,0.04)",
                transition: "all 0.35s ease",
              }}
              className="float-hover"
            >
              <div
                style={{
                  flex: "1",
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  zIndex: 2,
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 300,
                      fontSize: "16.8px",
                      letterSpacing: "0.075em",
                      lineHeight: "100%",
                      textTransform: "uppercase",
                      color: "#4A6261",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    DENIM WEAR
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#2F2C24",
                      lineHeight: 1.2,
                    }}
                  >
                    Effortless Casuals
                  </h3>
                </div>
                <a
                  href="#featured"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#5D2030",
                  }}
                >
                  Shop Denims <FiArrowRight size={15} />
                </a>
              </div>
              <div style={{ width: "48%", height: "100%", position: "relative" }}>
                <img
                  src="/homepage/mosaic_denim.jpg"
                  alt="Denim Jeans"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>

            {/* Frame 2: Ethnic Wear */}
            <div
              style={{
                width: "100%",
                height: "288.75px",
                borderRadius: "24px",
                backgroundColor: "#EFE4E0",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                boxShadow: "0 10px 28px rgba(0,0,0,0.04)",
                transition: "all 0.35s ease",
              }}
              className="float-hover"
            >
              <div style={{ width: "48%", height: "100%", position: "relative" }}>
                <img
                  src="/homepage/mosaic_ethnic.jpg"
                  alt="Ethnic Wear"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div
                style={{
                  flex: "1",
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  zIndex: 2,
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 300,
                      fontSize: "16.8px",
                      letterSpacing: "0.075em",
                      lineHeight: "100%",
                      textTransform: "uppercase",
                      color: "#7D534A",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    ETHNIC WEAR
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#5D2030",
                      lineHeight: 1.2,
                    }}
                  >
                    Heritage Elegance
                  </h3>
                </div>
                <a
                  href="#sarees"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#5D2030",
                  }}
                >
                  Explore Kurtas <FiArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Tall Frame (660.45 x 630) */}
          <div className="mosaic-right-tall float-hover">
            <img
              src="/homepage/mosaic_necklace.jpg"
              alt="Royal Gold Jewellery"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.92)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "48px 36px 36px 36px",
                background: "linear-gradient(to top, rgba(10, 28, 26, 0.95) 0%, rgba(10, 28, 26, 0.45) 60%, transparent 100%)",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "14px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: "#DFBE7E",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                22K PURE TEMPLE CRAFT
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  margin: "0 0 16px 0",
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                Royal Gold Jewellery Collection
              </h3>
              <a
                href="#featured"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "#BB8E43",
                  color: "#FFFFFF",
                  padding: "12px 30px",
                  borderRadius: "28px",
                  fontSize: "14px",
                  fontWeight: 600,
                  boxShadow: "0 4px 16px rgba(187, 142, 67, 0.4)",
                }}
              >
                Explore Jewellery <FiChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Row: 3 Frames (271.95 x 357, 665.70 x 357, 271.95 x 357) */}
        <div className="mosaic-bottom-container">
          <div className="mosaic-bottom-small float-hover" style={{ backgroundColor: "#F2EFE9" }}>
            <img
              src="/homepage/mosaic_shirt.jpg"
              alt="Summer Casuals"
              style={{
                width: "100%",
                height: "240px",
                objectFit: "cover",
              }}
            />
            <div style={{ padding: "18px 20px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#BB8E43",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Minimalist
              </span>
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "#2F2C24", margin: 0 }}>
                Everyday Linens
              </h4>
            </div>
          </div>

          <div className="mosaic-bottom-wide float-hover" style={{ backgroundColor: "#D8F0EC" }}>
            <div
              style={{
                flex: "1",
                padding: "44px 36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "13px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#2F5F58",
                  marginBottom: "10px",
                }}
              >
                URBAN ATELIER
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#2F2C24",
                  lineHeight: 1.25,
                  marginBottom: "16px",
                }}
              >
                Active Wear & Street Style
              </h3>
              <p style={{ fontSize: "14.5px", color: "#546E6A", marginBottom: "20px", lineHeight: 1.45 }}>
                Vibrant hues, modern cuts, and ultimate comfort for every journey.
              </p>
              <a
                href="#featured"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#5D2030",
                }}
              >
                Shop Street Edit <FiArrowRight size={15} />
              </a>
            </div>
            <div style={{ width: "45%", height: "100%", position: "relative" }}>
              <img
                src="/homepage/mosaic_street.jpg"
                alt="Activewear & Street Style"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          <div className="mosaic-bottom-small float-hover" style={{ backgroundColor: "#F7F2FA" }}>
            <img
              src="/homepage/mosaic_decor.jpg"
              alt="Festive Party Decor"
              style={{
                width: "100%",
                height: "240px",
                objectFit: "cover",
              }}
            />
            <div style={{ padding: "18px 20px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#BB8E43",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Celebrations
              </span>
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "#2F2C24", margin: 0 }}>
                Festive Home Decor
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. EDITORIAL BANNER: "Your Style [img] / [img] Your Rules / Empower Your Fashion"
         ========================================================================= */}
      <section
        style={{
          width: "100%",
          background: "#F5EBD3",
          padding: "70px 24px 75px 24px",
          margin: "0 0 90px 0",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Line 1: Your Style + Pill Image 1 */}
          <div
            className="editorial-banner-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "18px",
            }}
          >
            <span
              className="editorial-banner-text"
              style={{
                fontFamily: "'Blacker Display', var(--font-serif)",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "48px",
                lineHeight: "150%",
                letterSpacing: "0",
                textTransform: "capitalize",
                color: "#5D2030",
              }}
            >
              Your Style
            </span>
            <img
              src="/homepage/your_style_pill1_hd.jpg"
              alt="Luxury saree and pearls"
              className="editorial-banner-img"
              style={{
                width: "200px",
                height: "50px",
                borderRadius: "45px",
                objectFit: "cover",
                opacity: 1,
                display: "block",
              }}
            />
          </div>

          {/* Line 2: Pill Image 2 + Your Rules */}
          <div
            className="editorial-banner-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "18px",
            }}
          >
            <img
              src="/homepage/your_style_pill2_hd.jpg"
              alt="Jewelry display"
              className="editorial-banner-img"
              style={{
                width: "200px",
                height: "50px",
                borderRadius: "45px",
                objectFit: "cover",
                opacity: 1,
                display: "block",
              }}
            />
            <span
              className="editorial-banner-text"
              style={{
                fontFamily: "'Blacker Display', var(--font-serif)",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "48px",
                lineHeight: "150%",
                letterSpacing: "0",
                textTransform: "capitalize",
                color: "#5D2030",
              }}
            >
              Your Rules
            </span>
          </div>

          {/* Line 3: Empower Your Fashion */}
          <div
            className="editorial-banner-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="editorial-banner-text"
              style={{
                fontFamily: "'Blacker Display', var(--font-serif)",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "48px",
                lineHeight: "150%",
                letterSpacing: "0",
                textTransform: "capitalize",
                color: "#5D2030",
              }}
            >
              Empower Your Fashion
            </span>
          </div>

          {/* Line 4: Button */}
          <div style={{ marginTop: "36px" }}>
            <button
              className="editorial-shop-btn"
              style={{
                width: "416px",
                maxWidth: "100%",
                height: "56px",
                borderRadius: "77px",
                opacity: 1,
                gap: "10px",
                padding: "20px 99px",
                background: "#BB8E43",
                border: "none",
                cursor: "pointer",
                boxSizing: "border-box",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
            >
              <span
                style={{
                  fontFamily: "'Blacker Display', var(--font-serif)",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                SHOP NOW
              </span>
              <svg
                width="46"
                height="12"
                viewBox="0 0 46 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ stroke: "#FFFFFF", strokeWidth: "1.2px", overflow: "visible", flexShrink: 0 }}
              >
                <path d="M0 6H44M38 1.5L44 6L38 10.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CATEGORY SPOTLIGHT 1: CASUAL WEAR COLLECTIONS
         ========================================================================= */}
      <section
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto 90px auto",
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        {/* Two-column layout: Left = text + small images, Right = tall portrait */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}
          className="category-section-grid"
        >
          {/* Left: Heading + description + staggered small images */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(36px, 3.8vw, 52px)",
                fontWeight: 700,
                color: "#2F2C24",
                lineHeight: 1.1,
                marginBottom: "4px",
              }}
            >
              Casual Wear
            </h2>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(22px, 2.4vw, 32px)",
                fontWeight: 400,
                color: "#5D2030",
                marginBottom: "18px",
                lineHeight: 1.1,
              }}
            >
              Collections
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                color: "#685F53",
                lineHeight: 1.65,
                maxWidth: "420px",
                marginBottom: "32px",
              }}
            >
              You offer your kids wardrobe to your journey wardrobe.
            </p>

            {/* Staggered dual image cards */}
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "36px" }}>
              <div
                style={{
                  width: "200px",
                  height: "280px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
                  flexShrink: 0,
                }}
                className="float-hover"
              >
                <img
                  src="/homepage/casual_model2.jpg"
                  alt="Casual fashion"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  width: "180px",
                  height: "260px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
                  marginTop: "28px",
                  flexShrink: 0,
                }}
                className="float-hover"
              >
                <img
                  src="/homepage/casual_model3.jpg"
                  alt="Casual styling"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            <a
              href="#featured"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "1.5px solid #5D2030",
                color: "#5D2030",
                fontSize: "14px",
                fontWeight: 600,
                padding: "10px 26px",
                borderRadius: "28px",
                transition: "all 0.25s ease",
                letterSpacing: "0.3px",
              }}
              className="secondary-btn"
            >
              Explore <FiArrowRight size={14} />
            </a>
          </div>

          {/* Right: tall portrait */}
          <div
            style={{
              width: "100%",
              height: "580px",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 18px 45px rgba(93, 32, 48, 0.1)",
            }}
            className="float-hover"
          >
            <img
              src="/homepage/casual_model1.jpg"
              alt="Casual Wear Model"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CATEGORY SPOTLIGHT 2: SAREE COLLECTIONS
         ========================================================================= */}
      <section
        id="sarees"
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto 90px auto",
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}
          className="category-section-grid"
        >
          {/* Left: Overlapping dual saree cards */}
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div
              style={{
                width: "220px",
                height: "340px",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 16px 36px rgba(0,0,0,0.1)",
                flexShrink: 0,
              }}
              className="float-hover"
            >
              <img
                src="/homepage/saree_green.jpg"
                alt="Silk Saree"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                width: "200px",
                height: "310px",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 16px 36px rgba(0,0,0,0.1)",
                marginTop: "36px",
                flexShrink: 0,
              }}
              className="float-hover"
            >
              <img
                src="/homepage/saree_models.jpg"
                alt="Royal Silk Sarees"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Right: Heading + description */}
          <div style={{ textAlign: "left" }}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(36px, 3.8vw, 52px)",
                fontWeight: 700,
                color: "#2F2C24",
                lineHeight: 1.1,
                marginBottom: "4px",
                textAlign: "right",
              }}
            >
              Saree
            </h2>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(22px, 2.4vw, 32px)",
                fontWeight: 400,
                color: "#5D2030",
                marginBottom: "18px",
                lineHeight: 1.1,
                textAlign: "right",
              }}
            >
              Collections
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                color: "#685F53",
                lineHeight: 1.65,
                marginBottom: "32px",
                textAlign: "right",
              }}
            >
              You drape your traditions and beauty with our saree collections.
            </p>
            <div style={{ textAlign: "right" }}>
              <a
                href="#featured"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1.5px solid #5D2030",
                  color: "#5D2030",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "10px 26px",
                  borderRadius: "28px",
                  transition: "all 0.25s ease",
                  letterSpacing: "0.3px",
                }}
                className="secondary-btn"
              >
                Explore <FiArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. CATEGORY SPOTLIGHT 3: DECORATIVE ITEM COLLECTIONS
         ========================================================================= */}
      <section
        id="decor"
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto 90px auto",
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}
          className="category-section-grid"
        >
          {/* Left: Heading + description + explore button */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(36px, 3.8vw, 52px)",
                fontWeight: 700,
                color: "#2F2C24",
                lineHeight: 1.1,
                marginBottom: "4px",
              }}
            >
              Decorative Item
            </h2>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(22px, 2.4vw, 32px)",
                fontWeight: 400,
                color: "#5D2030",
                marginBottom: "18px",
                lineHeight: 1.1,
              }}
            >
              Collections
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                color: "#685F53",
                lineHeight: 1.65,
                maxWidth: "420px",
                marginBottom: "32px",
              }}
            >
              You collect your craft and art décor here with our collections.
            </p>
            <a
              href="#featured"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "1.5px solid #5D2030",
                color: "#5D2030",
                fontSize: "14px",
                fontWeight: 600,
                padding: "10px 26px",
                borderRadius: "28px",
                transition: "all 0.25s ease",
                letterSpacing: "0.3px",
              }}
              className="secondary-btn"
            >
              Explore <FiArrowRight size={14} />
            </a>
          </div>

          {/* Right: Staggered dual decor images */}
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div
              style={{
                width: "220px",
                height: "300px",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 16px 36px rgba(0,0,0,0.08)",
                flexShrink: 0,
              }}
              className="float-hover"
            >
              <img
                src="/homepage/decor_lights.jpg"
                alt="Festive Decor Diyas"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                width: "200px",
                height: "280px",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 16px 36px rgba(0,0,0,0.08)",
                marginTop: "32px",
                flexShrink: 0,
              }}
              className="float-hover"
            >
              <img
                src="/homepage/decor_handicraft.jpg"
                alt="Artisanal Handicrafts"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. WHATSAPP SHOPPING BANNER — "Shopping Made Personal"
         ========================================================================= */}
      <section
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto 90px auto",
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            borderRadius: "28px",
            border: "1.5px solid #DFBE7E",
            background: "linear-gradient(135deg, #FBF3E2 0%, #F5E4C4 60%, #EDD5A3 100%)",
            boxShadow: "0 12px 40px rgba(187, 142, 67, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "48px 60px",
            gap: "40px",
            flexWrap: "wrap",
            boxSizing: "border-box",
          }}
          className="whatsapp-banner"
        >
          {/* Left: text content */}
          <div style={{ flex: "1 1 420px", zIndex: 2 }}>
            {/* "Shopping Made Personal" label */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                backgroundColor: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(187,142,67,0.4)",
                padding: "5px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#5D2030",
                marginBottom: "18px",
                backdropFilter: "blur(4px)",
              }}
            >
              <span style={{ fontSize: "15px" }}>🛍</span> Shopping Made Personal
            </div>

            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "clamp(28px, 3.2vw, 44px)",
                lineHeight: 1.2,
                color: "#2F2C24",
                marginBottom: "24px",
              }}
            >
              Curate your cart.
              <br />
              Complete on WhatsApp.
            </h2>

            <a
              href="https://wa.me/?text=Hello%20Sree%20Collections%2C%20I%20want%20to%20shop!"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#25D366",
                color: "#FFFFFF",
                padding: "13px 32px",
                borderRadius: "28px",
                fontSize: "15px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 6px 20px rgba(37, 211, 102, 0.35)",
                transition: "all 0.3s ease",
                marginBottom: "28px",
              }}
              className="primary-btn"
            >
              <FaWhatsapp size={20} /> Chat on WhatsApp
            </a>

            {/* Step indicators: Added Cart → WhatsApp → Order Confirmed */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {["Added Cart", "WhatsApp", "Order Confirmed"].map((step, i) => (
                <React.Fragment key={step}>
                  <span
                    style={{
                      backgroundColor: "rgba(255,255,255,0.75)",
                      border: "1px solid rgba(187,142,67,0.35)",
                      padding: "5px 14px",
                      borderRadius: "20px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "#5D2030",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {step}
                  </span>
                  {i < 2 && (
                    <span style={{ color: "#BB8E43", fontSize: "14px", fontWeight: 700 }}>→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right: Shopping bag image */}
          <div
            style={{
              flex: "1 1 380px",
              maxWidth: "520px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <img
              src="/homepage/img5.png"
              alt="Sree Collections WhatsApp Shopping Bag"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                filter: "drop-shadow(0 12px 30px rgba(93, 32, 48, 0.18))",
                transition: "transform 0.4s ease",
              }}
              className="float-hover"
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. TESTIMONIALS SECTION — "Why our Customer says"
         ========================================================================= */}
      <section
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto 100px auto",
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontSize: "clamp(28px, 3.2vw, 40px)",
              color: "#2F2C24",
              margin: 0,
            }}
          >
            Why our{" "}
            <span style={{ color: "#5D2030" }}>Customer</span>
            {" "}says
          </h2>
        </div>

        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            backgroundColor: "#FFFFFF",
            borderRadius: "32px",
            padding: "50px 60px",
            border: "1px solid #EFE4D5",
            boxShadow: "0 14px 40px rgba(93, 32, 48, 0.06)",
            position: "relative",
          }}
          className="testimonial-card"
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "72px",
              lineHeight: "1",
              color: "#BB8E43",
              opacity: 0.4,
              marginBottom: "10px",
            }}
          >
            “
          </div>

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(18px, 1.8vw, 22px)",
              fontStyle: "italic",
              color: "#2F2C24",
              lineHeight: 1.6,
              marginBottom: "32px",
            }}
          >
            {testimonials[activeTestimonial].quote}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #F1E7DA",
              paddingTop: "24px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 700, color: "#5D2030", margin: 0 }}>
                {testimonials[activeTestimonial].author}
              </h4>
              <span style={{ fontSize: "13.5px", color: "#7A7062" }}>
                {testimonials[activeTestimonial].location} • {testimonials[activeTestimonial].role}
              </span>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() =>
                  setActiveTestimonial(
                    (prev) => (prev - 1 + testimonials.length) % testimonials.length
                  )
                }
                aria-label="Previous review"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: "1.5px solid #BB8E43",
                  color: "#BB8E43",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                className="icon-btn"
              >
                <FiArrowLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
                }
                aria-label="Next review"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "#BB8E43",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                className="icon-btn"
              >
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          12. FOOTER
         ========================================================================= */}
      <footer
        id="about"
        style={{
          width: "100%",
          maxWidth: "1535px",
          margin: "0 auto",
          padding: "60px 32px 36px 32px",
          borderTop: "2px solid #BB8E43",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "40px",
            marginBottom: "50px",
          }}
        >
          <div>
            <img
              src="/homepage/logo2.png"
              alt="Sree Collections"
              style={{
                height: "72px",
                width: "auto",
                objectFit: "contain",
                marginBottom: "16px",
              }}
            />
            <p style={{ color: "#685F53", fontSize: "14.5px", lineHeight: 1.6, maxWidth: "300px" }}>
              Celebrating timeless Indian royalty with handpicked silk sarees, designer ethnic sets,
              and authentic temple jewellery crafted for extraordinary celebrations.
            </p>
            <div style={{ display: "flex", gap: "14px", marginTop: "20px" }}>
              <a href="#" aria-label="Instagram" style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F4EDE1", display: "flex", alignItems: "center", justifyContent: "center", color: "#5D2030" }}><FiInstagram size={17} /></a>
              <a href="#" aria-label="Facebook" style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F4EDE1", display: "flex", alignItems: "center", justifyContent: "center", color: "#5D2030" }}><FiFacebook size={17} /></a>
              <a href="#" aria-label="WhatsApp" style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F4EDE1", display: "flex", alignItems: "center", justifyContent: "center", color: "#5D2030" }}><FaWhatsapp size={17} /></a>
              <a href="#" aria-label="Pinterest" style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F4EDE1", display: "flex", alignItems: "center", justifyContent: "center", color: "#5D2030" }}><FaPinterest size={17} /></a>
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 700, color: "#5D2030", marginBottom: "18px" }}>Collections</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14.5px", color: "#685F53" }}>
              <li><a href="#featured" className="footer-link">Kanjeevaram Pure Silk</a></li>
              <li><a href="#featured" className="footer-link">Banarasi Heritage Weaves</a></li>
              <li><a href="#featured" className="footer-link">Bridal Lehengas & Kurtas</a></li>
              <li><a href="#featured" className="footer-link">Temple Jewellery Sets</a></li>
              <li><a href="#featured" className="footer-link">Everyday Casuals & Denims</a></li>
              <li><a href="#featured" className="footer-link">Festive Home Decor</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 700, color: "#5D2030", marginBottom: "18px" }}>Customer Care</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14.5px", color: "#685F53" }}>
              <li><a href="#home" className="footer-link">Track Your Order</a></li>
              <li><a href="#home" className="footer-link">Shipping & Global Delivery</a></li>
              <li><a href="#home" className="footer-link">Custom Blouse Stitching</a></li>
              <li><a href="#home" className="footer-link">WhatsApp Live Video Call</a></li>
              <li><a href="#home" className="footer-link">Returns & Exchanges</a></li>
              <li><a href="#home" className="footer-link">Authenticity Certificate</a></li>
            </ul>
          </div>

          <div id="contact">
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 700, color: "#5D2030", marginBottom: "18px" }}>Stay In Touch</h4>
            <p style={{ fontSize: "14px", color: "#685F53", lineHeight: 1.5, marginBottom: "14px" }}>
              Subscribe to unlock private festive previews, bridal edits, and seasonal offers.
            </p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
              <input type="email" placeholder="Enter your email" style={{ flex: 1, padding: "11px 16px", borderRadius: "24px", border: "1px solid #DFBE7E", backgroundColor: "#FFFDF9", outline: "none", fontSize: "13.5px" }} />
              <button style={{ backgroundColor: "#BB8E43", color: "#FFFFFF", padding: "11px 20px", borderRadius: "24px", fontSize: "13.5px", fontWeight: 600 }}>Join</button>
            </div>
            <div style={{ fontSize: "13.5px", color: "#685F53", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiPhone size={14} color="#BB8E43" /> +91 98765 43210</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiMail size={14} color="#BB8E43" /> support@sreecollections.com</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #EFE4D5", paddingTop: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", fontSize: "13.5px", color: "#887D70" }}>
          <div>© {new Date().getFullYear()} Sree Collections. All Rights Reserved.</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Security</a>
          </div>
        </div>
      </footer>

      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 991px) {
          .mobile-hamburger {
            display: block !important;
          }
          .hero-frame-svg {
            display: none !important;
          }
          .hero-grid-outer {
            border: 1.5px solid #DECDBE;
            border-radius: 28px;
          }
          .hero-three-cols {
            grid-template-columns: 1fr !important;
          }
          .mosaic-top-container {
            grid-template-columns: 1fr !important;
          }
          .mosaic-bottom-container {
            grid-template-columns: 1fr !important;
          }
          .delivery-banner {
            padding: 30px 20px !important;
            text-align: center;
          }
          .whatsapp-banner {
            padding: 30px 20px !important;
            text-align: center;
          }
          .testimonial-card {
            padding: 32px 20px !important;
          }
        }

        .mosaic-top-container {
          display: grid;
          grid-template-columns: 605.85px 660.45px;
          gap: 44px;
          justify-content: center;
          margin-bottom: 44px;
        }

        .mosaic-left-column {
          display: flex;
          flex-direction: column;
          gap: 28px;
          width: 605.85px;
        }

        .mosaic-right-tall {
          width: 660.45px;
          height: 605.5px;
          border-radius: 24px;
          background-color: #0A1C1A;
          overflow: hidden;
          position: relative;
          box-shadow: 0 16px 40px rgba(10, 28, 26, 0.25);
          transition: all 0.4s ease;
        }

        .mosaic-bottom-container {
          display: grid;
          grid-template-columns: 271.95px 665.70px 271.95px;
          gap: 50.35px;
          justify-content: center;
        }

        .mosaic-bottom-small {
          width: 271.95px;
          height: 357px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 24px rgba(0,0,0,0.04);
          transition: all 0.35s ease;
        }

        .mosaic-bottom-wide {
          width: 665.70px;
          height: 357px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          display: flex;
          box-shadow: 0 10px 24px rgba(0,0,0,0.04);
          transition: all 0.35s ease;
        }

        @media (max-width: 1400px) {
          .mosaic-top-container {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .mosaic-left-column {
            width: 100%;
          }
          .mosaic-right-tall {
            width: 100%;
          }
          .mosaic-bottom-container {
            grid-template-columns: 1fr 2fr 1fr;
            gap: 20px;
          }
          .mosaic-bottom-small,
          .mosaic-bottom-wide {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .category-section-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .editorial-shop-btn:hover {
          background: #A97E37 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(187, 142, 67, 0.35);
        }

        @media (max-width: 640px) {
          .editorial-banner-text {
            font-size: 28px !important;
            line-height: 130% !important;
          }
          .editorial-banner-img {
            width: 120px !important;
            height: 36px !important;
            border-radius: 30px !important;
          }
          .editorial-banner-row {
            gap: 10px !important;
          }
          .editorial-shop-btn {
            width: 300px !important;
            height: 50px !important;
            padding: 14px 30px !important;
          }
        }

        .nav-link:hover {
          color: #5D2030 !important;
        }
        .primary-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
        }
        .secondary-outline-btn:hover {
          background-color: #B68638 !important;
          color: #FFFFFF !important;
          transform: translateY(-2px);
        }
        .secondary-btn:hover {
          background-color: #5D2030 !important;
          color: #FFFFFF !important;
          transform: translateY(-2px);
        }
        .footer-link:hover {
          color: #5D2030 !important;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
