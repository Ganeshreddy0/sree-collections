"use client";

import React from "react";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaGoogle,
  FaWhatsapp,
} from "react-icons/fa";

const FOOTER_LINKS = [
  { label: "ABOUT US", href: "/about" },
  { label: "CONTACT US", href: "/contact" },
  { label: "CATEGORY", href: "/categories" },
  { label: "PRIVACY POLICY", href: "#" },
  { label: "TERMS & CONDITIONS", href: "#" },
];

const SOCIAL = [
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "YouTube", icon: FaYoutube, href: "#" },
  { label: "Instagram", icon: FaInstagram, href: "#" },
  { label: "Google", icon: FaGoogle, href: "#" },
  { label: "WhatsApp", icon: FaWhatsapp, href: "https://wa.me/?text=Hello%20Sree%20Collections" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "#FCF8F2",
        color: "#5D2030",
        paddingTop: "50px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1140px",
          margin: "0 auto",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        {/* Top rule matching container width */}
        <div
          style={{
            width: "100%",
            height: "1.5px",
            backgroundColor: "#5D2030",
            opacity: 0.8,
            marginBottom: "48px",
          }}
        />

        {/* Main Row: Brand Logo | Contact Info */}
        <div
          className="site-footer-main"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "36px",
            marginBottom: "36px",
          }}
        >
          {/* Logo on Left */}
          <Link href="/" style={{ display: "inline-block", flexShrink: 0 }}>
            <img
              src="/homepage/logo2_trans.png"
              alt="Sree Collections"
              style={{
                height: "82px",
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          {/* Contact Details on Right */}
          <div
            className="site-footer-contact"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "14px",
              textAlign: "right",
            }}
          >
            {/* Address Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#5D2030",
                fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', var(--font-sans), sans-serif",
                fontWeight: 400,
              }}
            >
              <FaMapMarkerAlt size={15} color="#5D2030" style={{ flexShrink: 0 }} />
              <span>345 Faulconer Drive, Suite 4 • Charlottesville, CA, 12345</span>
            </div>

            {/* Phone & Email Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                flexWrap: "wrap",
                justifyContent: "flex-end",
                fontSize: "14px",
                color: "#5D2030",
                fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', var(--font-sans), sans-serif",
                fontWeight: 400,
              }}
            >
              <a
                href="tel:+19526830741"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#5D2030",
                  textDecoration: "none",
                  transition: "opacity 0.2s ease",
                }}
                className="site-footer-link"
              >
                <FaPhoneAlt size={13} color="#5D2030" style={{ flexShrink: 0 }} />
                <span>+19526830741</span>
              </a>

              <a
                href="mailto:Sreecollections007@gmail.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#5D2030",
                  textDecoration: "none",
                  transition: "opacity 0.2s ease",
                }}
                className="site-footer-link"
              >
                <FaEnvelope size={14} color="#5D2030" style={{ flexShrink: 0 }} />
                <span>Sreecollections007@gmail.com</span>
              </a>
            </div>

            {/* Social Media Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <span
                style={{
                  fontSize: "13.5px",
                  fontWeight: 500,
                  color: "#5D2030",
                  fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', var(--font-sans), sans-serif",
                }}
              >
                Social Media
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {SOCIAL.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="site-footer-social-icon"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#5D2030",
                      textDecoration: "none",
                      transition: "transform 0.2s ease, opacity 0.2s ease",
                    }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle divider rule */}
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#DECDBE",
            opacity: 0.8,
            margin: "36px 0 22px 0",
          }}
        />

        {/* Bottom row: links | copyright */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
            paddingBottom: "36px",
          }}
        >
          <nav
            className="site-footer-links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
              flexWrap: "wrap",
            }}
          >
            {FOOTER_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="site-footer-link"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  color: "#5D2030",
                  textDecoration: "none",
                  fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', var(--font-sans), sans-serif",
                  transition: "color 0.2s ease",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <span
            style={{
              fontSize: "12.5px",
              color: "#5D2030",
              fontFamily: "'Turnkey Lite', 'Plus Jakarta Sans', var(--font-sans), sans-serif",
              fontWeight: 400,
            }}
          >
            Copyright © {year} • kitsacitsolutions
          </span>
        </div>
      </div>

      <style>{`
        .site-footer-social-icon:hover {
          color: #BB8E43 !important;
          transform: translateY(-2px);
        }
        .site-footer-link:hover {
          color: #BB8E43 !important;
        }
        @media (max-width: 768px) {
          .site-footer-main {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .site-footer-contact {
            align-items: flex-start !important;
            text-align: left !important;
          }
          .site-footer-contact > div {
            justify-content: flex-start !important;
          }
          .site-footer-links {
            gap: 18px !important;
          }
        }
      `}</style>
    </footer>
  );
}
