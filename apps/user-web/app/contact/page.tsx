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
  FiCheckCircle,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi2";

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
      className="contact-nav-link"
    >
      {children}
    </Link>
  );
}

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill in your name and email.");
      return;
    }
    setFormSubmitted(true);
  };

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
          1. HEADER / NAVBAR — Identical to Home Page
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
            className="contact-desktop-nav"
            style={{ display: "none", alignItems: "center", gap: "36px" }}
          >
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/categories">Categories</NavLink>

            {/* CONTACT US Pill Button */}
            <Link
              href="/contact"
              className="contact-nav-btn primary-btn"
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
            className="contact-hamburger mobile-hamburger"
          >
            {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </header>
      </div>

      {/* Mobile Drawer — same as home page */}
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
            </nav>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. HERO TITLE & SUBTITLE
         ========================================================================= */}
      <section
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "40px auto 30px auto",
          padding: "0 24px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontFamily: "'Blacker Display', Georgia, serif",
            fontWeight: 700,
            fontSize: "42px",
            lineHeight: 1.25,
            color: "#5D2030",
            maxWidth: "920px",
            margin: "0 auto 16px auto",
          }}
        >
          For Any Inquiries, Our Team Is Completely At Your Disposal.
        </h1>
        <p
          style={{
            fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            lineHeight: 1.65,
            color: "#756658",
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          Lorem ipsum dolor sit amet quisque et morbi vulputate. Ut imperdiet ut neque nec
          urna. Duis rutrum non risus in imperdiet.
        </p>
      </section>

      {/* =========================================================================
          3. THREE CONTACT INFO CARDS
         ========================================================================= */}
      <section
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "40px auto 70px auto",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          className="contact-cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "28px",
          }}
        >
          {/* Card 1: Social Media */}
          <div
            className="contact-info-card"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "18px",
              padding: "40px 28px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(93, 32, 48, 0.05)",
              border: "1px solid rgba(93, 32, 48, 0.08)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#5D2030",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
              }}
            >
              <HiOutlineUserGroup size={24} />
            </div>
            <h3
              style={{
                fontFamily: "'Blacker Display', Georgia, serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 16px 0",
              }}
            >
              Social Media
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px 16px",
                maxWidth: "200px",
                margin: "0 auto",
              }}
            >
              {[
                { name: "WhatsApp", href: "#", underline: true },
                { name: "Instagram", href: "#", underline: true },
                { name: "Facebook", href: "#", underline: false },
                { name: "YouTube", href: "#", underline: false },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="contact-social-link"
                  style={{
                    fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                    fontSize: "14px",
                    color: "#5D2030",
                    textDecoration: s.underline ? "underline" : "none",
                    fontWeight: 500,
                  }}
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Card 2: Our Email */}
          <div
            className="contact-info-card"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "18px",
              padding: "40px 28px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(93, 32, 48, 0.05)",
              border: "1px solid rgba(93, 32, 48, 0.08)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#5D2030",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
              }}
            >
              <FiMail size={22} />
            </div>
            <h3
              style={{
                fontFamily: "'Blacker Display', Georgia, serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 16px 0",
              }}
            >
              Our Email
            </h3>
            <div
              style={{
                fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                fontSize: "14px",
                color: "#5D2030",
                lineHeight: 1.7,
              }}
            >
              <div>public@news.com</div>
              <div>info@publicnews.com</div>
            </div>
          </div>

          {/* Card 3: Our Phone Number */}
          <div
            className="contact-info-card"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "18px",
              padding: "40px 28px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(93, 32, 48, 0.05)",
              border: "1px solid rgba(93, 32, 48, 0.08)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#5D2030",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
              }}
            >
              <FiPhone size={22} />
            </div>
            <h3
              style={{
                fontFamily: "'Blacker Display', Georgia, serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 16px 0",
              }}
            >
              Our Phone Number
            </h3>
            <div
              style={{
                fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                fontSize: "14px",
                color: "#5D2030",
                lineHeight: 1.7,
              }}
            >
              <div>(021) 342-8423</div>
              <div>(017) 265-5917</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. MIDDLE FORM & PHOTO SECTION
         ========================================================================= */}
      <section
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto 90px auto",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          className="contact-form-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "54px",
            alignItems: "center",
          }}
        >
          {/* Left Column: Megaphone Image */}
          <div
            style={{
              width: "100%",
              height: "490px",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 14px 34px rgba(93, 32, 48, 0.08)",
              backgroundColor: "#EAE0D2",
            }}
          >
            <img
              src="/homepage/contact_megaphone.jpg"
              alt="Customer support team"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Right Column: Contact Form */}
          <div>
            <h2
              style={{
                fontFamily: "'Blacker Display', Georgia, serif",
                fontSize: "32px",
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 10px 0",
                lineHeight: 1.25,
              }}
            >
              We Are Available For You At Any Time
            </h2>
            <p
              style={{
                fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                fontSize: "14px",
                color: "#756658",
                margin: "0 0 28px 0",
                lineHeight: 1.5,
              }}
            >
              Need assistance? We will contact you after you complete the following form!
            </p>

            {formSubmitted ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  padding: "36px 28px",
                  border: "1px solid #BB8E43",
                  textAlign: "center",
                  boxShadow: "0 8px 24px rgba(187,142,67,0.15)",
                }}
              >
                <FiCheckCircle size={44} color="#16A34A" style={{ marginBottom: "12px" }} />
                <h4
                  style={{
                    fontFamily: "'Blacker Display', Georgia, serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#5D2030",
                    margin: "0 0 10px 0",
                  }}
                >
                  Thank You, {formData.name || "Valued Customer"}!
                </h4>
                <p
                  style={{
                    fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                    fontSize: "14px",
                    color: "#5D2030",
                    lineHeight: 1.6,
                    margin: "0 0 20px 0",
                  }}
                >
                  Your message has been received. Our team will review your inquiry and reach out
                  promptly.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: "", email: "", topic: "", message: "" });
                  }}
                  style={{
                    backgroundColor: "#BB8E43",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "999px",
                    padding: "10px 28px",
                    fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#5D2030",
                      marginBottom: "6px",
                    }}
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      height: "44px",
                      borderRadius: "8px",
                      border: "1px solid #D6C8B8",
                      backgroundColor: "#FDFAF5",
                      padding: "0 16px",
                      fontSize: "14px",
                      fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                      color: "#5D2030",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#5D2030",
                      marginBottom: "6px",
                    }}
                  >
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%",
                      height: "44px",
                      borderRadius: "8px",
                      border: "1px solid #D6C8B8",
                      backgroundColor: "#FDFAF5",
                      padding: "0 16px",
                      fontSize: "14px",
                      fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                      color: "#5D2030",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#5D2030",
                      marginBottom: "6px",
                    }}
                  >
                    Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    style={{
                      width: "100%",
                      height: "44px",
                      borderRadius: "8px",
                      border: "1px solid #D6C8B8",
                      backgroundColor: "#FDFAF5",
                      padding: "0 16px",
                      fontSize: "14px",
                      fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                      color: "#5D2030",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#5D2030",
                      marginBottom: "6px",
                    }}
                  >
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: "100%",
                      height: "110px",
                      borderRadius: "8px",
                      border: "1px solid #D6C8B8",
                      backgroundColor: "#FDFAF5",
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                      color: "#5D2030",
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="contact-submit-btn"
                    style={{
                      backgroundColor: "#BB8E43",
                      color: "#FFFFFF",
                      fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: "13px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      padding: "13px 38px",
                      borderRadius: "999px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 6px 18px rgba(187,142,67,0.3)",
                      transition: "transform 0.2s ease, filter 0.2s ease",
                      marginTop: "6px",
                    }}
                  >
                    CONTACT US
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FOOTER
         ========================================================================= */}
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
          {/* Logo */}
          <Link href="/" style={{ display: "inline-block" }}>
            <img
              src="/homepage/logo2_trans.png"
              alt="Sree Collections"
              style={{ height: "66px", width: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* Contact Details & Social */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "flex-end",
            }}
            className="contact-footer-contact"
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
                  className="contact-social-btn"
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
              { name: "About Us", href: "/about" },
              { name: "Contact Us", href: "/contact" },
              { name: "Careers", href: "#" },
              { name: "Privacy Policy", href: "#" },
              { name: "Terms & Conditions", href: "#" },
            ].map(({ name, href }) => (
              <Link key={name} href={href} className="contact-footer-link">
                {name}
              </Link>
            ))}
          </div>

          <span style={{ textTransform: "none", letterSpacing: 0 }}>
            &copy; {new Date().getFullYear()} Sree Collections. All Rights Reserved.
          </span>
        </div>
      </footer>

      {/* =========================================================================
          6. RESPONSIVE CSS
         ========================================================================= */}
      <style>{`
        @media (min-width: 992px) {
          .contact-desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 991px) {
          .contact-hamburger {
            display: flex !important;
          }
        }
        @media (max-width: 900px) {
          .contact-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-form-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-footer-contact {
            align-items: flex-start !important;
          }
        }
        .contact-nav-link:hover {
          opacity: 0.75;
        }
        .contact-nav-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
        }
        .contact-submit-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(187,142,67,0.38) !important;
        }
        .contact-info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(93, 32, 48, 0.09) !important;
        }
        .contact-social-link:hover {
          color: #BB8E43 !important;
        }
        .contact-social-btn:hover {
          background-color: #5D2030 !important;
          color: #FFFFFF !important;
        }
        .contact-footer-link {
          color: #8A7B6F;
          text-decoration: none;
        }
        .contact-footer-link:hover {
          color: #5D2030;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
