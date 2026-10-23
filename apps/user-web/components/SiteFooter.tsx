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
  { label: "PRIVACY POLICY", href: "/privacy-policy" },
  { label: "TERMS & CONDITIONS", href: "/terms-and-conditions" },
];

const SOCIAL = [
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "YouTube", icon: FaYoutube, href: "#" },
  { label: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/sreecollections007?utm_source=ig_web_button_share_sheet&cplk=ZDNlZDc0MzIxNw==" },
  { label: "Google", icon: FaGoogle, href: "#" },
  { label: "WhatsApp", icon: FaWhatsapp, href: "https://chat.whatsapp.com/C0d3jaOJF2DD7fvujaTesb" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ width: "100%", backgroundColor: "#FCF8F2", color: "#5D2030", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "1140px", margin: "0 auto", padding: "0 20px", boxSizing: "border-box" }}>

        {/* Top rule */}
        <div style={{ width: "100%", height: "1.5px", backgroundColor: "#5D2030", opacity: 0.8, margin: "32px 0 24px 0" }} />

        {/* ── DESKTOP layout ── */}
        <div
          className="sf-main"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
            marginBottom: "20px",
          }}
        >
          {/* Logo */}
          <Link href="/" className="sf-logo" style={{ display: "inline-block", flexShrink: 0 }}>
            <img
              src="/homepage/logo2_trans.png"
              alt="Sree Collections"
              style={{ height: "76px", width: "auto", objectFit: "contain", display: "block" }}
            />
          </Link>

          {/* Contact column */}
          <div
            className="sf-contact"
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", textAlign: "right" }}
          >
            {/* Address */}
            <div className="sf-address" style={{ display: "flex", alignItems: "flex-start", gap: "7px", fontSize: "13px", color: "#5D2030", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <FaMapMarkerAlt size={13} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span style={{ lineHeight: "1.5" }}>
                345 Faulconer Drive, Suite 4,<br />Charlottesville, CA, 12345
              </span>
            </div>

            {/* Phone */}
            <a href="tel:+19526830741" className="sf-link" style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "#5D2030", textDecoration: "none" }}>
              <FaPhoneAlt size={12} style={{ flexShrink: 0 }} />
              <span>+19526830741</span>
            </a>

            {/* Email */}
            <a href="mailto:Sreecollections007@gmail.com" className="sf-link" style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "#5D2030", textDecoration: "none" }}>
              <FaEnvelope size={13} style={{ flexShrink: 0 }} />
              <span>Sreecollections007@gmail.com</span>
            </a>

            {/* Social */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "12.5px", fontWeight: 500, color: "#5D2030", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Social Media
              </span>
              {SOCIAL.map(({ label, icon: Icon, href }) => (
                <a key={label} href={href} aria-label={label} className="sf-social" target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", color: "#5D2030", textDecoration: "none" }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", backgroundColor: "#DECDBE", opacity: 0.8, margin: "0 0 16px 0" }} />

        {/* Bottom: nav links + copyright */}
        <div
          className="sf-bottom"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", paddingBottom: "28px" }}
        >
          <nav className="sf-links" style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
            {FOOTER_LINKS.map(({ label, href }) => (
              <Link
                key={label} href={href} scroll={true}
                onClick={() => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" }); }}
                className="sf-link"
                style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.7px", textTransform: "uppercase", color: "#5D2030", textDecoration: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <span style={{ fontSize: "12px", color: "#5D2030", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Copyright © {year} • kitsacitsolutions
          </span>
        </div>
      </div>

      <style>{`
        .sf-social:hover { color: #BB8E43 !important; transform: translateY(-2px); transition: all 0.2s; }
        .sf-link:hover   { color: #BB8E43 !important; }

        /* ── MOBILE (≤ 640px) ── */
        @media (max-width: 640px) {
          .sf-main {
            flex-direction: column !important;
            align-items: center !important;
            gap: 12px !important;
            margin-bottom: 12px !important;
          }
          .sf-logo img {
            height: 60px !important;
          }
          .sf-contact {
            align-items: center !important;
            text-align: center !important;
            gap: 8px !important;
            width: 100% !important;
          }
          .sf-contact > div,
          .sf-contact > a {
            justify-content: center !important;
          }
          .sf-address {
            display: inline-flex !important;
            justify-content: center !important;
            text-align: left !important;
          }
          .sf-bottom {
            flex-direction: column !important;
            align-items: center !important;
            gap: 10px !important;
            padding-bottom: 20px !important;
          }
          .sf-links {
            justify-content: center !important;
            gap: 8px 18px !important;
          }
          .sf-bottom > span {
            text-align: center !important;
            font-size: 11px !important;
          }
        }

        /* ── TABLET (641px – 768px) ── */
        @media (min-width: 641px) and (max-width: 768px) {
          .sf-main {
            flex-direction: column !important;
            align-items: center !important;
            gap: 18px !important;
          }
          .sf-contact {
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }
          .sf-contact > div,
          .sf-contact > a {
            justify-content: center !important;
          }
          .sf-links { gap: 12px 22px !important; }
        }
      `}</style>
    </footer>
  );
}
