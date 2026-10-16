"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

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
        fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
        fontSize: "16px",
        fontWeight: active ? 700 : 500,
        color: "#5D2030",
        textDecoration: "none",
        lineHeight: 1.2,
        paddingBottom: active ? "4px" : undefined,
        borderBottom: active ? "2.5px solid #5D2030" : undefined,
        transition: "opacity 0.2s ease",
      }}
      className="about-nav-link"
    >
      {children}
    </Link>
  );
}

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF6EE",
        color: "#2F2C24",
        overflowX: "hidden",
      }}
    >
      {/* =========================================================================
          1. HEADER / NAVBAR
         ========================================================================= */}
      <header
        style={{
          width: "100%",
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 50,
        }}
      >
        <Link href="/" style={{ display: "inline-block", flexShrink: 0 }}>
          <img
            src="/homepage/logo2_trans.png"
            alt="Sree Collections"
            style={{ height: "66px", width: "auto", objectFit: "contain" }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav
          className="about-desktop-nav"
          style={{ display: "none", alignItems: "center", gap: "36px" }}
        >
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about-us" active>
            About
          </NavLink>
          <NavLink href="/categories">Categories</NavLink>
          <Link
            href="/contact"
            className="about-contact-btn"
            style={{
              backgroundColor: "#BB8E43",
              color: "#FFFFFF",
              fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
              fontSize: "12.5px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              padding: "11px 26px",
              borderRadius: "999px",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(187,142,67,0.25)",
              transition: "all 0.2s ease",
            }}
          >
            Contact Us
          </Link>
          <Link
            href="/search"
            aria-label="Search"
            style={{
              color: "#5D2030",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiSearch size={21} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            style={{
              color: "#5D2030",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "4px",
            }}
          >
            <FiShoppingCart size={21} />
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="about-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
          style={{
            display: "none",
            color: "#5D2030",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FAF6EE",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "40px",
            gap: "24px",
          }}
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#5D2030",
              fontFamily: "'Blacker Display', Georgia, serif",
            }}
          >
            Home
          </Link>
          <Link
            href="/about-us"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#BB8E43",
              fontFamily: "'Blacker Display', Georgia, serif",
            }}
          >
            About
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#5D2030",
              fontFamily: "'Blacker Display', Georgia, serif",
            }}
          >
            Categories
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              backgroundColor: "#BB8E43",
              color: "#FFFFFF",
              padding: "12px 32px",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginTop: "8px",
            }}
          >
            Contact Us
          </Link>
        </div>
      )}

      {/* =========================================================================
          2. MAIN CONTENT CONTAINER
         ========================================================================= */}
      <main
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "20px 32px 80px 32px",
          boxSizing: "border-box",
        }}
      >
        {/* =======================================================================
            HERO / INTRO SECTION
           ======================================================================= */}
        <section
          className="about-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "48px",
            alignItems: "start",
            paddingTop: "24px",
            paddingBottom: "50px",
          }}
        >
          {/* Left Column */}
          <div>
            <h1
              style={{
                fontFamily: "'Blacker Display', Georgia, serif",
                fontSize: "44px",
                fontWeight: 700,
                color: "#5D2030",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              About{" "}
              <span
                style={{
                  color: "#997332",
                  fontWeight: 600,
                }}
              >
                Sree Collections
              </span>
            </h1>

            {/* Accent gold underline */}
            <div
              style={{
                width: "230px",
                height: "2px",
                backgroundColor: "#BB8E43",
                marginTop: "10px",
                marginBottom: "12px",
              }}
            />

            {/* Tagline */}
            <p
              style={{
                fontFamily: "'Blacker Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "16px",
                color: "#5D2030",
                margin: "0 0 24px 0",
                fontWeight: 400,
                letterSpacing: "0.2px",
              }}
            >
              Where Tradition Meets Elegance
            </p>

            {/* Contact Us Outline Pill Button */}
            <div style={{ marginBottom: "26px" }}>
              <Link
                href="/contact"
                className="about-outline-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 26px",
                  borderRadius: "999px",
                  border: "1.5px solid #BB8E43",
                  color: "#997332",
                  fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  backgroundColor: "transparent",
                }}
              >
                <span>Contact Us</span>
                <span style={{ fontSize: "15px", lineHeight: 1 }}>&rarr;</span>
              </Link>
            </div>

            {/* Descriptive Body Paragraph */}
            <p
              style={{
                fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                fontSize: "15px",
                lineHeight: "1.8",
                color: "#4A3E36",
                maxWidth: "490px",
                margin: 0,
              }}
            >
              From beautiful sarees and ethnic wear to traditional jewellery and
              decorative pieces, our collections are thoughtfully selected for
              weddings, festivals, cultural celebrations, parties, gifting, and
              everyday occasions.
            </p>
          </div>

          {/* Right Column */}
          <div>
            {/* Welcome intro text */}
            <p
              style={{
                fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                fontSize: "15px",
                lineHeight: "1.8",
                color: "#4A3E36",
                marginBottom: "28px",
                marginTop: "4px",
              }}
            >
              Welcome to Sree Collections, your destination for beautiful Indian
              fashion, jewellery, and traditional décor. We bring together
              timeless designs and modern styles to help you celebrate your
              special moments with elegance and charm.
            </p>

            {/* Two-Image Overlapping Collage */}
            <div
              className="about-collage-container"
              style={{
                position: "relative",
                width: "100%",
                height: "270px",
                maxWidth: "480px",
                marginLeft: "auto",
              }}
            >
              {/* Back Upper-Right Image (Red Star Lanterns) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "56%",
                  height: "210px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 10px 28px rgba(93,32,48,0.12)",
                  backgroundColor: "#FFFFFF",
                  zIndex: 1,
                }}
              >
                <img
                  src="/about/stars.jpg"
                  alt="Festive Star Lanterns"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* Front Lower-Left Overlapping Image (Party Table) */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "60%",
                  height: "185px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 12px 30px rgba(93,32,48,0.18)",
                  backgroundColor: "#FFFFFF",
                  zIndex: 2,
                }}
              >
                <img
                  src="/about/party.jpg"
                  alt="Celebration & Party Collection"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================================
            SECTION: OUR COLLECTIONS
           ======================================================================= */}
        <div style={{ textAlign: "center", margin: "50px 0 65px 0" }}>
          <h2
            style={{
              fontFamily: "'Blacker Display', Georgia, serif",
              fontSize: "44px",
              fontWeight: 700,
              color: "#5D2030",
              margin: 0,
            }}
          >
            Our Collections
          </h2>
        </div>

        {/* COLLECTION ITEMS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
          {/* ITEM 1: INDIAN FASHION (Text Left, Image Right) */}
          <div
            className="about-collection-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: "60px",
              alignItems: "center",
            }}
          >
            {/* Left Content */}
            <div>
              <h3
                style={{
                  fontFamily: "'Blacker Display', Georgia, serif",
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: "0 0 8px 0",
                }}
              >
                Indian Fashion
              </h3>
              <div
                style={{
                  width: "180px",
                  height: "2px",
                  backgroundColor: "#BB8E43",
                  marginBottom: "24px",
                }}
              />

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 28px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                  fontSize: "15px",
                  fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                  color: "#3F352E",
                  lineHeight: "1.6",
                }}
              >
                {[
                  "Sarees",
                  "Silk & Kanchipuram Sarees",
                  "Banarasi & Pochampally Sarees",
                  "Cotton & Fancy Sarees",
                  "Lehengas & Half Sarees",
                  "Salwar Suits & Kurtis",
                  "Designer & Ready to Wear Blouses",
                  "Indo-Western Wear",
                  "Men's Traditional Wear",
                  "Kids' Ethnic Wear",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ color: "#BB8E43", fontWeight: 700, fontSize: "16px" }}>*</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/categories"
                className="about-shop-btn"
                style={{
                  display: "inline-block",
                  backgroundColor: "#BB8E43",
                  color: "#FFFFFF",
                  fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  padding: "10px 30px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(187,142,67,0.25)",
                  transition: "all 0.25s ease",
                }}
              >
                SHOP NOW
              </Link>
            </div>

            {/* Right Image */}
            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 14px 34px rgba(93,32,48,0.12)",
                backgroundColor: "#FFFFFF",
                aspectRatio: "1 / 1",
                maxWidth: "460px",
                width: "100%",
                margin: "0 auto",
              }}
            >
              <img
                src="/about/fashion.jpg"
                alt="Indian Fashion - Sarees & Ethnic Wear"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* ITEM 2: INDIAN JEWELLERY & ACCESSORIES (Image Left, Text Right) */}
          <div
            className="about-collection-row about-reverse-row"
            style={{
              display: "grid",
              gridTemplateColumns: "0.9fr 1.1fr",
              gap: "60px",
              alignItems: "center",
            }}
          >
            {/* Left Image */}
            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 14px 34px rgba(93,32,48,0.12)",
                backgroundColor: "#FFFFFF",
                aspectRatio: "1 / 1",
                maxWidth: "460px",
                width: "100%",
                margin: "0 auto",
              }}
            >
              <img
                src="/about/jewellery.jpg"
                alt="Indian Jewellery & Accessories"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            {/* Right Content (Right Aligned) */}
            <div className="about-jewellery-content" style={{ textAlign: "right" }}>
              <h3
                style={{
                  fontFamily: "'Blacker Display', Georgia, serif",
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: "0 0 8px 0",
                  lineHeight: 1.2,
                }}
              >
                Indian Jewellery &amp;
                <br />
                Accessories
              </h3>
              <div
                style={{
                  width: "240px",
                  height: "2px",
                  backgroundColor: "#BB8E43",
                  marginBottom: "24px",
                  marginLeft: "auto",
                }}
              />

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 28px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "9px",
                  fontSize: "15px",
                  fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                  color: "#3F352E",
                  lineHeight: "1.6",
                }}
              >
                {[
                  "Temple Jewellery",
                  "Bridal Jewellery",
                  "Gold-Look & Traditional Jewellery",
                  "Bangles",
                  "Jhumkas & Earrings",
                  "Necklaces & Harams",
                  "Maang Tikkas",
                  "Hair Accessories",
                  "Traditional & Fashion Accessories",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <span style={{ color: "#BB8E43", fontWeight: 700, fontSize: "16px" }}>*</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link
                  href="/categories"
                  className="about-shop-btn"
                  style={{
                    display: "inline-block",
                    backgroundColor: "#BB8E43",
                    color: "#FFFFFF",
                    fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    padding: "10px 30px",
                    borderRadius: "999px",
                    textDecoration: "none",
                    boxShadow: "0 4px 12px rgba(187,142,67,0.25)",
                    transition: "all 0.25s ease",
                  }}
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>

          {/* ITEM 3: INDIAN DECOR & CELEBRATION (Text Left, Image Right) */}
          <div
            className="about-collection-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: "60px",
              alignItems: "center",
            }}
          >
            {/* Left Content */}
            <div>
              <h3
                style={{
                  fontFamily: "'Blacker Display', Georgia, serif",
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: "0 0 8px 0",
                }}
              >
                Indian Decor &amp; Celebration
              </h3>
              <div
                style={{
                  width: "240px",
                  height: "2px",
                  backgroundColor: "#BB8E43",
                  marginBottom: "24px",
                }}
              />

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 28px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                  fontSize: "15px",
                  fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                  color: "#3F352E",
                  lineHeight: "1.6",
                }}
              >
                {[
                  "Traditional Indian Home Décor",
                  "Pooja & Festival Décor",
                  "Wedding Décor Items",
                  "Torans & Door Hangings",
                  "Decorative Diyas",
                  "Flower & Floral Décor",
                  "Traditional Decorative Pieces",
                  "Gift & Return-Gift Items",
                  "Festive & Cultural Décor",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ color: "#BB8E43", fontWeight: 700, fontSize: "16px" }}>*</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/categories"
                className="about-shop-btn"
                style={{
                  display: "inline-block",
                  backgroundColor: "#BB8E43",
                  color: "#FFFFFF",
                  fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  padding: "10px 30px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(187,142,67,0.25)",
                  transition: "all 0.25s ease",
                }}
              >
                SHOP NOW
              </Link>
            </div>

            {/* Right Image */}
            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 14px 34px rgba(93,32,48,0.12)",
                backgroundColor: "#FFFFFF",
                aspectRatio: "1 / 1",
                maxWidth: "460px",
                width: "100%",
                margin: "0 auto",
              }}
            >
              <img
                src="/about/decor.jpg"
                alt="Indian Decor & Celebration"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>

        {/* =======================================================================
            SECTION: OUR PROMISE
           ======================================================================= */}
        <section
          style={{
            maxWidth: "880px",
            margin: "90px auto 40px auto",
            textAlign: "center",
            padding: "0 16px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Blacker Display', Georgia, serif",
              fontSize: "44px",
              fontWeight: 700,
              color: "#5D2030",
              marginBottom: "30px",
            }}
          >
            Our Promise
          </h2>

          <p
            style={{
              fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
              fontSize: "16px",
              lineHeight: "1.8",
              color: "#4A3E36",
              marginBottom: "26px",
            }}
          >
            At Sree Collections, we believe Indian tradition is beautiful,
            meaningful, and meant to be celebrated. We carefully select our
            products with a focus on quality, elegance, traditional beauty, and
            affordability.
          </p>

          <p
            style={{
              fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
              fontSize: "16px",
              lineHeight: "1.8",
              color: "#4A3E36",
              margin: 0,
            }}
          >
            Whether you&apos;re searching for a stunning saree, beautiful Indian
            jewellery, a thoughtful gift, or traditional décor for your home or
            celebration, we hope to make your shopping experience special and
            memorable.
          </p>
        </section>
      </main>

      {/* =======================================================================
          FOOTER
         ======================================================================= */}
      <div
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "20px auto 0 auto",
          padding: "0 32px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", height: "1px", backgroundColor: "#D4C5B0" }} />
      </div>

      <footer
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "40px 32px 32px 32px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "30px",
            marginBottom: "36px",
          }}
        >
          {/* Footer Logo */}
          <Link href="/" style={{ display: "inline-block" }}>
            <img
              src="/homepage/logo2_trans.png"
              alt="Sree Collections"
              style={{ height: "66px", width: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* Footer Contact Details & Social */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "flex-end",
            }}
            className="about-footer-contact"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                color: "#5D2030",
              }}
            >
              <FiMapPin size={15} color="#BB8E43" />
              <span>1985 Mulberry Oak, Suite 41, Chattahoochee, GA 30545</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                  color: "#5D2030",
                }}
              >
                <FiPhone size={14} color="#BB8E43" />
                <span>+91 86765 43210</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                  color: "#5D2030",
                }}
              >
                <FiMail size={14} color="#BB8E43" />
                <span>sreecollections47@gmail.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              {[
                { icon: <FaFacebookF size={12} />, label: "Facebook" },
                { icon: <FaInstagram size={12} />, label: "Instagram" },
                { icon: <FaYoutube size={12} />, label: "YouTube" },
                { icon: <FaWhatsapp size={12} />, label: "WhatsApp" },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="about-social-icon"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "1px solid #5D2030",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#5D2030",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal links */}
        <div
          style={{
            borderTop: "1px solid #E5D9C8",
            paddingTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "12px",
            fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
            color: "#8A7B6F",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
            {[
              { name: "About Us", href: "/about-us" },
              { name: "Contact Us", href: "/contact" },
              { name: "Careers", href: "#" },
              { name: "Privacy Policy", href: "#" },
              { name: "Terms & Conditions", href: "#" },
            ].map(({ name, href }) => (
              <Link key={name} href={href} className="about-footer-link">
                {name}
              </Link>
            ))}
          </div>

          <span style={{ textTransform: "none", letterSpacing: 0 }}>
            &copy; {new Date().getFullYear()} Sree Collections. All Rights Reserved.
          </span>
        </div>
      </footer>

      {/* =======================================================================
          RESPONSIVE CSS
         ======================================================================= */}
      <style>{`
        @media (min-width: 992px) {
          .about-desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 991px) {
          .about-hamburger {
            display: flex !important;
          }
          .about-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .about-collage-container {
            margin-left: 0 !important;
            max-width: 100% !important;
          }
          .about-collection-row {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .about-reverse-row {
            display: flex !important;
            flex-direction: column-reverse !important;
          }
          .about-jewellery-content {
            text-align: left !important;
          }
          .about-jewellery-content div {
            margin-left: 0 !important;
          }
          .about-jewellery-content ul {
            align-items: flex-start !important;
          }
          .about-jewellery-content ul li {
            justify-content: flex-start !important;
          }
          .about-footer-contact {
            align-items: flex-start !important;
          }
        }
        .about-nav-link:hover {
          opacity: 0.75;
        }
        .about-contact-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
        }
        .about-shop-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(187,142,67,0.38) !important;
        }
        .about-outline-btn:hover {
          background-color: #BB8E43 !important;
          color: #FFFFFF !important;
          transform: translateY(-1px);
        }
        .about-social-icon:hover {
          background-color: #5D2030 !important;
          color: #FFFFFF !important;
        }
        .about-footer-link {
          color: #8A7B6F;
          text-decoration: none;
        }
        .about-footer-link:hover {
          color: #5D2030;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
