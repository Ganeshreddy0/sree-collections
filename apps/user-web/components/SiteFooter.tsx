"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  FaTwitter,
  FaPinterest,
} from "react-icons/fa";
import { API_BASE } from "@/lib/config";

interface FooterLinkItem {
  label: string;
  href: string;
}

interface SocialLinkItem {
  label: string;
  href: string;
  iconName?: string;
}

const DEFAULT_FOOTER_LINKS: FooterLinkItem[] = [
  { label: "ABOUT US", href: "/about" },
  { label: "CONTACT US", href: "/contact" },
  { label: "CATEGORY", href: "/categories" },
  { label: "PRIVACY POLICY", href: "/privacy-policy" },
  { label: "TERMS & CONDITIONS", href: "/terms-and-conditions" },
];

const DEFAULT_SOCIAL: SocialLinkItem[] = [
  { label: "Facebook", href: "#", iconName: "facebook" },
  { label: "YouTube", href: "#", iconName: "youtube" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/sreecollections007?utm_source=ig_web_button_share_sheet&cplk=ZDNlZDc0MzIxNw==",
    iconName: "instagram",
  },
  { label: "Google", href: "#", iconName: "google" },
  {
    label: "WhatsApp",
    href: "https://chat.whatsapp.com/C0d3jaOJF2DD7fvujaTesb",
    iconName: "whatsapp",
  },
];

function getSocialIconComponent(label: string, iconKey?: string) {
  const key = (iconKey || label || "").toLowerCase();
  if (key.includes("facebook")) return FaFacebookF;
  if (key.includes("youtube")) return FaYoutube;
  if (key.includes("instagram")) return FaInstagram;
  if (key.includes("whatsapp")) return FaWhatsapp;
  if (key.includes("twitter") || key.includes("x")) return FaTwitter;
  if (key.includes("pinterest")) return FaPinterest;
  if (key.includes("google")) return FaGoogle;
  return FaGoogle;
}

function renderAddressLines(addressStr: string) {
  if (!addressStr) return null;
  // Handle literal <br />, <br>, or newlines
  const normalized = addressStr.replace(/<br\s*\/?>/gi, "\n");
  const lines = normalized.split("\n").map(l => l.trim()).filter(Boolean);

  if (lines.length > 1) {
    return lines.map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        {idx < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  }

  // Handle single-line with Suite break
  if (addressStr.includes("Suite") && addressStr.includes(",")) {
    const suiteIndex = addressStr.indexOf("Suite");
    const commaAfterSuite = addressStr.indexOf(",", suiteIndex);
    if (commaAfterSuite !== -1) {
      const part1 = addressStr.slice(0, commaAfterSuite + 1).trim();
      const part2 = addressStr.slice(commaAfterSuite + 1).trim();
      return (
        <>
          {part1}
          <br />
          {part2}
        </>
      );
    }
  }

  return addressStr;
}

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  // Initial state uses accurate storefront defaults
  const [logoUrl, setLogoUrl] = useState("/homepage/logo2_trans.png");
  const [logoAlt, setLogoAlt] = useState("Sree Collections");
  const [address, setAddress] = useState("345 Faulconer Drive, Suite 4,\nCharlottesville, CA, 12345");
  const [phone, setPhone] = useState("+19526830741");
  const [email, setEmail] = useState("Sreecollections007@gmail.com");
  const [copyright, setCopyright] = useState("kitsacitsolutions");
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(DEFAULT_SOCIAL);
  const [footerLinks, setFooterLinks] = useState<FooterLinkItem[]>(DEFAULT_FOOTER_LINKS);
  const [isVisible, setIsVisible] = useState(true);

  const fetchFooterCMS = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/homepage?_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success || !data.data) return;

      const footerSection = data.data.footer;
      if (!footerSection) return;

      if (footerSection.isActive === false) {
        setIsVisible(false);
        return;
      }
      setIsVisible(true);

      if (footerSection.mediaUrl) {
        setLogoUrl(footerSection.mediaUrl);
      }
      if (footerSection.mediaAlt) {
        setLogoAlt(footerSection.mediaAlt);
      }

      const settings = footerSection.settings || {};
      if (settings.address) setAddress(String(settings.address));
      if (settings.phone) setPhone(String(settings.phone));
      if (settings.email) setEmail(String(settings.email));
      if (settings.copyright) setCopyright(String(settings.copyright));

      // Extract and map items
      const rawItems: Array<{
        itemId?: string;
        title?: string;
        linkUrl?: string;
        isActive?: boolean;
        metadata?: { type?: string; icon?: string; group?: string };
      }> = footerSection.items || [];

      // Social items
      const cmsSocials = rawItems.filter(
        item =>
          item.isActive !== false &&
          (item.metadata?.type === "social" ||
            item.itemId?.toLowerCase().startsWith("social-") ||
            item.metadata?.group === "social")
      );
      if (cmsSocials.length > 0) {
        setSocialLinks(
          cmsSocials.map(it => ({
            label: it.title || "Social",
            href: it.linkUrl || "#",
            iconName: it.metadata?.icon || it.title || it.itemId?.replace("social-", "") || "",
          }))
        );
      }

      // Nav link items
      const cmsNavs = rawItems.filter(
        item =>
          item.isActive !== false &&
          (item.metadata?.type === "nav-link" ||
            item.itemId?.toLowerCase().startsWith("nav-") ||
            item.metadata?.group === "nav")
      );
      if (cmsNavs.length > 0) {
        setFooterLinks(
          cmsNavs.map(it => ({
            label: (it.title || "").toUpperCase(),
            href: it.linkUrl || "#",
          }))
        );
      }
    } catch {
      // Silently keep default values on connection error
    }
  }, []);

  useEffect(() => {
    fetchFooterCMS();

    // Re-fetch when user switches back to this tab
    const handleFocus = () => fetchFooterCMS();
    window.addEventListener("focus", handleFocus);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchFooterCMS();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Cross-tab real-time sync when admin saves in admin panel
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cms_updated_at") fetchFooterCMS();
    };
    window.addEventListener("storage", handleStorage);

    // BroadcastChannel sync (same-window or cross-tab)
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("cms_sync");
      bc.onmessage = () => fetchFooterCMS();
    } catch {
      /* unsupported */
    }

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("storage", handleStorage);
      bc?.close();
    };
  }, [fetchFooterCMS]);

  if (!isVisible) {
    return null;
  }

  // Format phone href
  const phoneHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const emailHref = `mailto:${email}`;

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={logoAlt}
              style={{ height: "76px", width: "auto", objectFit: "contain", display: "block" }}
            />
          </Link>

          {/* Contact column */}
          <div
            className="sf-contact"
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", textAlign: "right" }}
          >
            {/* Address */}
            {address && (
              <div className="sf-address" style={{ display: "flex", alignItems: "flex-start", gap: "7px", fontSize: "13px", color: "#5D2030", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <FaMapMarkerAlt size={13} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ lineHeight: "1.5" }}>
                  {renderAddressLines(address)}
                </span>
              </div>
            )}

            {/* Phone */}
            {phone && (
              <a href={phoneHref} className="sf-link" style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "#5D2030", textDecoration: "none" }}>
                <FaPhoneAlt size={12} style={{ flexShrink: 0 }} />
                <span>{phone}</span>
              </a>
            )}

            {/* Email */}
            {email && (
              <a href={emailHref} className="sf-link" style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "#5D2030", textDecoration: "none" }}>
                <FaEnvelope size={13} style={{ flexShrink: 0 }} />
                <span>{email}</span>
              </a>
            )}

            {/* Social */}
            {socialLinks.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ fontSize: "12.5px", fontWeight: 500, color: "#5D2030", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Social Media
                </span>
                {socialLinks.map(({ label, href, iconName }) => {
                  const Icon = getSocialIconComponent(label, iconName);
                  return (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="sf-social"
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: "flex", alignItems: "center", color: "#5D2030", textDecoration: "none" }}
                    >
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            )}
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
            {footerLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                scroll={true}
                onClick={() => {
                  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" });
                }}
                className="sf-link"
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.7px",
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

          <span style={{ fontSize: "12px", color: "#5D2030", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Copyright © {currentYear} • {copyright}
          </span>
        </div>
      </div>

      <style>{`
        .sf-social:hover { color: #BB8E43 !important; transform: translateY(-2px); transition: all 0.2s; }
        .sf-link:hover   { color: #BB8E43 !important; }

        /* ── MOBILE (≤ 768px) ── */
        @media (max-width: 768px) {
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
