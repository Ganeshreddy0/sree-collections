"use client";

import React from "react";
import Link from "next/link";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaGoogle,
} from "react-icons/fa";

const FOOTER_LINKS = [
  { label: "ABOUT US", href: "/#about" },
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
  { label: "WhatsApp", icon: FaWhatsapp, href: "#" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "#FCF8F2",
        color: "#5D2030",
      }}
    >
      {/* Top rule */}
      <div style={{ borderTop: "1.5px solid #5D2030" }} />

      <div
        style={{
          width: "100%",
          maxWidth: 1240,
          margin: "0 auto",
          padding: "42px 40px 28px",
          boxSizing: "border-box",
        }}
      >
        {/* Main row: logo | contact */}
        <div
          className="site-footer-main"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 32,
            marginBottom: 36,
          }}
        >
          <Link href="/" style={{ display: "inline-block", flexShrink: 0 }}>
            <img
              src="/homepage/logo2_trans.png"
              alt="Sree Collections"
              style={{
                height: 78,
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          <div
            className="site-footer-contact"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 12,
              textAlign: "right",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "#5D2030",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <FiMapPin size={15} style={{ flexShrink: 0 }} />
              <span>345 Faulconer Drive, Suite 4 • Charlottesville, CA, 12345</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <a
                href="tel:+19526830741"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 14,
                  color: "#5D2030",
                  textDecoration: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <FiPhone size={14} />
                <span>+19526830741</span>
              </a>
              <a
                href="mailto:Sreecollections007@gmail.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 14,
                  color: "#5D2030",
                  textDecoration: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <FiMail size={14} />
                <span>Sreecollections007@gmail.com</span>
              </a>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#5D2030",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Social Media
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                {SOCIAL.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="site-footer-social"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "1.2px solid #5D2030",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#5D2030",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Icon size={12} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom rule + links */}
        <div
          style={{
            borderTop: "1.5px solid #5D2030",
            paddingTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <nav
            className="site-footer-links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              flexWrap: "wrap",
            }}
          >
            {FOOTER_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="site-footer-link"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                  color: "#5D2030",
                  textDecoration: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <span
            style={{
              fontSize: 12,
              color: "#5D2030",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Copyright © {year} • kitsacitsolutions
          </span>
        </div>
      </div>

      <style>{`
        .site-footer-social:hover {
          background-color: #5D2030 !important;
          color: #FFFFFF !important;
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
        }
      `}</style>
    </footer>
  );
}
