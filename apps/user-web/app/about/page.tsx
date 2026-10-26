"use client";

import React from "react";
import Link from "next/link";
import {
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


export default function AboutPage() {

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
          RESPONSIVE CSS
         ======================================================================= */}
      <style>{`
        @media (min-width: 992px) {
          .about-desktop-nav {
            display: flex !important;
          }
          .mobile-header-actions {
            display: none !important;
          }
        }
        @media (max-width: 991px) {
          .about-desktop-nav {
            display: none !important;
          }
          .mobile-header-actions {
            display: flex !important;
          }
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
        @media (max-width: 768px) {
          .about-hero-grid h1 {
            font-size: clamp(26px, 7vw, 40px) !important;
          }
          main {
            padding: 16px 16px 60px !important;
          }
          .about-hero-grid > div:first-child p {
            max-width: 100% !important;
          }
        }
        @media (max-width: 480px) {
          .about-hero-grid h1 {
            font-size: clamp(22px, 7vw, 32px) !important;
          }
          section h2 {
            font-size: clamp(22px, 6.5vw, 36px) !important;
          }
          section p {
            font-size: 14px !important;
          }
          .about-collage-container {
            height: clamp(220px, 65vw, 340px) !important;
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
