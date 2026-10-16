"use client";

import React, { useState } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiMail,
  FiPhone,
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
    <a
      href={href}
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "17px",
        fontWeight: 700,
        color: "#5A2035",
        textDecoration: "none",
        lineHeight: 1.2,
        paddingBottom: active ? "3px" : undefined,
        borderBottom: active ? "2.5px solid #5A2035" : undefined,
        transition: "opacity 0.2s",
      }}
      className="cat-nav-link"
    >
      {children}
    </a>
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
        overflowX: "hidden",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 50,
        }}
      >
        <a href="/" style={{ display: "inline-block", flexShrink: 0 }}>
          <img
            src="/homepage/logo2_trans.png"
            alt="Sree Collections"
            style={{ height: "68px", width: "auto", objectFit: "contain" }}
          />
        </a>
        <nav
          className="contact-desktop-nav"
          style={{ display: "none", alignItems: "center", gap: "36px" }}
        >
          <NavLink href="/">Home</NavLink>
<<<<<<< HEAD
          <NavLink href="/about-us">About</NavLink>
=======
          <NavLink href="/about">About</NavLink>
>>>>>>> f25f898f766c32c2ad516d6466e093e1beb35427
          <NavLink href="/categories">Categories</NavLink>
          <a
            href="/contact"
            className="contact-nav-btn"
            style={{
              backgroundColor: "#BB8E43",
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              padding: "12px 28px",
              borderRadius: "999px",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(187,142,67,0.25)",
            }}
          >
            Contact Us
          </a>
          <a
            href="/search"
            aria-label="Search"
            style={{
              color: "#5A2035",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiSearch size={22} />
          </a>
          <a
            href="/product"
            aria-label="Cart"
            style={{
              color: "#5A2035",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiShoppingCart size={22} />
          </a>
        </nav>
        <button
          className="contact-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            color: "#5A2035",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 200,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: "280px",
              height: "100%",
              backgroundColor: "#FCF8F2",
              padding: "28px 24px",
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
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <FiX size={22} />
              </button>
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "10px",
              }}
            >
              <a
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: "17px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 500,
                  color: "#3D3028",
                  textDecoration: "none",
                }}
              >
                Home
              </a>
              <a
<<<<<<< HEAD
                href="/about-us"
=======
                href="/about"
>>>>>>> f25f898f766c32c2ad516d6466e093e1beb35427
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: "17px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 500,
                  color: "#3D3028",
                  textDecoration: "none",
                }}
              >
                About
              </a>
              <a
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: "17px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 500,
                  color: "#3D3028",
                  textDecoration: "none",
                }}
              >
                Categories
              </a>
              <a
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: "17px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  color: "#5A2035",
                  textDecoration: "none",
                }}
              >
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* HERO TITLE & SUBTITLE */}
      <section
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "40px auto 30px auto",
          padding: "0 24px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: "44px",
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
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            lineHeight: 1.65,
            color: "#756658",
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
          nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
        </p>
      </section>

      {/* 3 CONTACT INFO CARDS */}
      <section
        style={{
          width: "100%",
          maxWidth: "1200px",
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
              borderRadius: "16px",
              padding: "40px 28px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(93, 32, 48, 0.05)",
              border: "1px solid rgba(93, 32, 48, 0.06)",
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
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
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
                { name: "WhatsApp", href: "#" },
                { name: "Instagram", href: "#" },
                { name: "Facebook", href: "#" },
                { name: "YouTube", href: "#" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="contact-social-link"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "13.5px",
                    color: "#5D2030",
                    textDecoration: "none",
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
              borderRadius: "16px",
              padding: "40px 28px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(93, 32, 48, 0.05)",
              border: "1px solid rgba(93, 32, 48, 0.06)",
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
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 16px 0",
              }}
            >
              Our Email
            </h3>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13.5px",
                color: "#5D2030",
                lineHeight: 1.7,
              }}
            >
              <div>contact@sree.com</div>
              <div>info@sreecollections.com</div>
            </div>
          </div>

          {/* Card 3: Our Phone Number */}
          <div
            className="contact-info-card"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "40px 28px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(93, 32, 48, 0.05)",
              border: "1px solid rgba(93, 32, 48, 0.06)",
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
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 16px 0",
              }}
            >
              Our Phone Number
            </h3>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13.5px",
                color: "#5D2030",
                lineHeight: 1.7,
              }}
            >
              <div>(021) 342-8423</div>
              <div>(021) 565-3917</div>
            </div>
          </div>
        </div>
      </section>

      {/* MIDDLE FORM & PHOTO SECTION */}
      <section
        style={{
          width: "100%",
          maxWidth: "1200px",
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
              height: "480px",
              borderRadius: "16px",
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
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "30px",
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
                fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                    fontFamily: "'Playfair Display', Georgia, serif",
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
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                    fontFamily: "'Playfair Display', Georgia, serif",
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
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      padding: "14px 40px",
                      borderRadius: "999px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 6px 18px rgba(187,142,67,0.3)",
                      transition: "transform 0.2s ease, filter 0.2s ease",
                      marginTop: "6px",
                    }}
                  >
                    Contact Us
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "50px 40px 30px",
          boxSizing: "border-box",
          borderTop: "1px solid #5D203040",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "28px",
            marginBottom: "36px",
          }}
        >
          {/* Logo and Tagline */}
          <div>
            <img
              src="/homepage/logo2_trans.png"
              alt="Sree Collections"
              style={{ height: "68px", width: "auto", objectFit: "contain" }}
            />
          </div>

          {/* Contact Details */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#5D2030",
              }}
            >
              <span style={{ fontSize: "16px" }}>📍</span>
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
                  color: "#5D2030",
                }}
              >
                <FiPhone size={14} />
                <span>+91 86765 43210</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#5D2030",
                }}
              >
                <FiMail size={14} />
                <span>sreecollections47@gmail.com</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              {[
                { icon: <FaFacebookF size={13} />, label: "Facebook" },
                { icon: <FaInstagram size={13} />, label: "Instagram" },
                { icon: <FaYoutube size={13} />, label: "YouTube" },
                { icon: <FaWhatsapp size={13} />, label: "WhatsApp" },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="contact-social-btn"
                  style={{
                    width: "32px",
                    height: "32px",
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
        <div
          style={{
            borderTop: "1px solid #E3D7C5",
            paddingTop: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "12px",
            color: "#8A7B6F",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              "About Us",
              "Contact Us",
              "Careers",
              "Privacy Policy",
              "Terms & Conditions",
            ].map((l) => (
              <a key={l} href="#" className="contact-footer-link">
                {l}
              </a>
            ))}
          </div>
          <span style={{ textTransform: "none", letterSpacing: 0 }}>
            &copy; {new Date().getFullYear()} Sree Collections. All Rights Reserved.
          </span>
        </div>
      </footer>

      {/* STYLES */}
      <style>{`
        @media (min-width: 992px) { .contact-desktop-nav { display: flex !important; } }
        @media (max-width: 991px) { .contact-hamburger { display: flex !important; } }
        @media (max-width: 900px) {
          .contact-cards-grid { grid-template-columns: 1fr !important; }
          .contact-form-grid { grid-template-columns: 1fr !important; }
        }
        .cat-nav-link:hover { opacity: 0.75; }
        .contact-nav-btn:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .contact-submit-btn:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .contact-info-card:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(93, 32, 48, 0.09) !important; }
        .contact-social-link:hover { color: #BB8E43 !important; text-decoration: underline !important; }
        .contact-social-btn:hover { background-color: #5D2030 !important; color: #FFFFFF !important; }
        .contact-footer-link { color: #8A7B6F; text-decoration: none; }
        .contact-footer-link:hover { color: #5D2030; text-decoration: underline; }
      `}</style>
    </div>
  );
}
