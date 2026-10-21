"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiShoppingCart,
  FiArrowRight,
  FiArrowLeft,
  FiChevronRight,
  FiMenu,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import FeaturedCardsShowcase from "@/components/FeaturedCardsShowcase";

// ─── CMS API types & defaults ────────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api";

type CMSItem = { itemId: string; title: string; subtitle: string; description: string; badge: string; imageUrl: string; imageAlt: string; linkUrl: string; ctaText: string; bgColor: string; displayOrder: number; isActive: boolean; metadata: Record<string, unknown> };
type CMSSection = { sectionId: string; title: string; subtitle: string; description: string; badgeText: string; mediaUrl: string; mediaAlt: string; secondaryMediaUrl: string; secondaryMediaAlt: string; tertiaryMediaUrl: string; tertiaryMediaAlt: string; ctaText: string; ctaLink: string; secondaryCtaText: string; secondaryCtaLink: string; isActive: boolean; settings: Record<string, unknown>; items: CMSItem[] };
type CMSData = Record<string, CMSSection>;

// Graceful fallbacks — identical to original hardcoded data — used when API is offline
const FALLBACK_CMS: CMSData = {
  header: { sectionId: "header", title: "Sree Collections", subtitle: "", description: "Celebrating timeless Indian royalty with handpicked silk sarees, designer ethnic sets, and authentic temple jewellery crafted for extraordinary celebrations.", badgeText: "", mediaUrl: "/homepage/logo2_trans.png", mediaAlt: "Sree Collections", secondaryMediaUrl: "/homepage/logo2.png", secondaryMediaAlt: "", tertiaryMediaUrl: "", tertiaryMediaAlt: "", ctaText: "CONTACT US", ctaLink: "/contact", secondaryCtaText: "", secondaryCtaLink: "", isActive: true, settings: {}, items: [{ itemId: "nav-home", title: "Home", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#home", ctaText: "", bgColor: "", displayOrder: 1, isActive: true, metadata: {} }, { itemId: "nav-about", title: "About", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#about", ctaText: "", bgColor: "", displayOrder: 2, isActive: true, metadata: {} }, { itemId: "nav-categories", title: "Categories", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "/categories", ctaText: "", bgColor: "", displayOrder: 3, isActive: true, metadata: {} }] },
  hero: { sectionId: "hero", title: "Dive Into A World Of Endless", subtitle: "Fashion Possibilities", description: "Elevate Your Wardrobe With Our Fashion Finds. Discover Your Signature Style At Fashion Avenue.", badgeText: "", mediaUrl: "/homepage/hero_col1.png", mediaAlt: "Fashion Model in Coat", secondaryMediaUrl: "/homepage/hero_bangles.png", secondaryMediaAlt: "Awesome Gold Jewelry Collection", tertiaryMediaUrl: "/homepage/hero_col3.png", tertiaryMediaAlt: "Bridal Jewelry and Sets", ctaText: "SHOP NOW", ctaLink: "#featured", secondaryCtaText: "EXPLORE MORE PRODUCTS", secondaryCtaLink: "#categories", isActive: true, settings: { watermarkUrl: "/homepage/sc_crest_watermark_trans.png", bangle_badge_label: "TRENDING", bangle_badge_title: "Awesome", bangle_badge_subtitle: "Collection" }, items: [] },
  "free-delivery": { sectionId: "free-delivery", title: "Free Delivery", subtitle: "🛍️ Order above $99/-", description: "", badgeText: "No Code Required • Worldwide Express Delivery", mediaUrl: "/homepage/img4.png", mediaAlt: "Free Express Delivery Truck", secondaryMediaUrl: "", secondaryMediaAlt: "", tertiaryMediaUrl: "", tertiaryMediaAlt: "", ctaText: "", ctaLink: "#", secondaryCtaText: "", secondaryCtaLink: "", isActive: true, settings: {}, items: [] },
  "categories-mosaic": { sectionId: "categories-mosaic", title: "Explore Our World of Styles", subtitle: "Discover By Category", description: "", badgeText: "", mediaUrl: "", mediaAlt: "", secondaryMediaUrl: "", secondaryMediaAlt: "", tertiaryMediaUrl: "", tertiaryMediaAlt: "", ctaText: "", ctaLink: "#", secondaryCtaText: "", secondaryCtaLink: "", isActive: true, settings: {}, items: [{ itemId: "mosaic-denim", title: "Effortless Casuals", subtitle: "", description: "", badge: "DENIM WEAR", imageUrl: "/homepage/mosaic_denim.jpg", imageAlt: "Denim Jeans", linkUrl: "#featured", ctaText: "Shop Denims", bgColor: "#DDEBEA", displayOrder: 1, isActive: true, metadata: { type: "left-top", textColor: "#4A6261" } }, { itemId: "mosaic-ethnic", title: "Heritage Elegance", subtitle: "", description: "", badge: "ETHNIC WEAR", imageUrl: "/homepage/mosaic_ethnic.jpg", imageAlt: "Ethnic Wear", linkUrl: "#sarees", ctaText: "Explore Kurtas", bgColor: "#EFE4E0", displayOrder: 2, isActive: true, metadata: { type: "left-bottom", textColor: "#7D534A" } }, { itemId: "mosaic-necklace", title: "Royal Gold Jewellery Collection", subtitle: "", description: "", badge: "22K PURE TEMPLE CRAFT", imageUrl: "/homepage/mosaic_necklace.jpg", imageAlt: "Royal Gold Jewellery", linkUrl: "#featured", ctaText: "Explore Jewellery", bgColor: "", displayOrder: 3, isActive: true, metadata: { type: "right-tall" } }, { itemId: "mosaic-shirt", title: "Everyday Linens", subtitle: "", description: "", badge: "Minimalist", imageUrl: "/homepage/mosaic_shirt.jpg", imageAlt: "Summer Casuals", linkUrl: "#", ctaText: "", bgColor: "#F2EFE9", displayOrder: 4, isActive: true, metadata: { type: "bottom-small-left" } }, { itemId: "mosaic-street", title: "Active Wear & Street Style", subtitle: "", description: "Vibrant hues, modern cuts, and ultimate comfort for every journey.", badge: "URBAN ATELIER", imageUrl: "/homepage/mosaic_street.jpg", imageAlt: "Activewear & Street Style", linkUrl: "#featured", ctaText: "Shop Street Edit", bgColor: "#D8F0EC", displayOrder: 5, isActive: true, metadata: { type: "bottom-wide", badgeColor: "#2F5F58" } }, { itemId: "mosaic-decor", title: "Festive Home Decor", subtitle: "", description: "", badge: "Celebrations", imageUrl: "/homepage/mosaic_decor.jpg", imageAlt: "Festive Party Decor", linkUrl: "#", ctaText: "", bgColor: "#F7F2FA", displayOrder: 6, isActive: true, metadata: { type: "bottom-small-right" } }] },
  "editorial-banner": { sectionId: "editorial-banner", title: "Your Style", subtitle: "Your Rules", description: "Empower Your Fashion", badgeText: "", mediaUrl: "/homepage/your_style_pill1_hd.jpg", mediaAlt: "Luxury saree and pearls", secondaryMediaUrl: "/homepage/your_style_pill2_hd.jpg", secondaryMediaAlt: "Jewelry display", tertiaryMediaUrl: "", tertiaryMediaAlt: "", ctaText: "SHOP NOW", ctaLink: "#featured", secondaryCtaText: "", secondaryCtaLink: "", isActive: true, settings: {}, items: [] },
  "spotlight-casual": { sectionId: "spotlight-casual", title: "Casual Wear", subtitle: "Collections", description: "You offer your kids wardrobe to your journey wardrobe.", badgeText: "", mediaUrl: "/homepage/casual_model1.jpg", mediaAlt: "Casual Wear Model", secondaryMediaUrl: "", secondaryMediaAlt: "", tertiaryMediaUrl: "", tertiaryMediaAlt: "", ctaText: "Explore", ctaLink: "#featured", secondaryCtaText: "", secondaryCtaLink: "", isActive: true, settings: {}, items: [{ itemId: "casual-card-1", title: "", subtitle: "", description: "", badge: "", imageUrl: "/homepage/casual_model2.jpg", imageAlt: "Casual fashion", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 1, isActive: true, metadata: { width: 200, height: 280 } }, { itemId: "casual-card-2", title: "", subtitle: "", description: "", badge: "", imageUrl: "/homepage/casual_model3.jpg", imageAlt: "Casual styling", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 2, isActive: true, metadata: { width: 180, height: 260, marginTop: 28 } }] },
  "spotlight-saree": { sectionId: "spotlight-saree", title: "Saree", subtitle: "Collections", description: "You drape your traditions and beauty with our saree collections.", badgeText: "", mediaUrl: "", mediaAlt: "", secondaryMediaUrl: "", secondaryMediaAlt: "", tertiaryMediaUrl: "", tertiaryMediaAlt: "", ctaText: "Explore", ctaLink: "#featured", secondaryCtaText: "", secondaryCtaLink: "", isActive: true, settings: {}, items: [{ itemId: "saree-card-1", title: "", subtitle: "", description: "", badge: "", imageUrl: "/homepage/saree_green.jpg", imageAlt: "Silk Saree", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 1, isActive: true, metadata: { width: 220, height: 340 } }, { itemId: "saree-card-2", title: "", subtitle: "", description: "", badge: "", imageUrl: "/homepage/saree_models.jpg", imageAlt: "Royal Silk Sarees", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 2, isActive: true, metadata: { width: 200, height: 310, marginTop: 36 } }] },
  "spotlight-decor": { sectionId: "spotlight-decor", title: "Decorative Item", subtitle: "Collections", description: "You collect your craft and art décor here with our collections.", badgeText: "", mediaUrl: "", mediaAlt: "", secondaryMediaUrl: "", secondaryMediaAlt: "", tertiaryMediaUrl: "", tertiaryMediaAlt: "", ctaText: "Explore", ctaLink: "#featured", secondaryCtaText: "", secondaryCtaLink: "", isActive: true, settings: {}, items: [{ itemId: "decor-card-1", title: "", subtitle: "", description: "", badge: "", imageUrl: "/homepage/decor_lights.jpg", imageAlt: "Festive Decor Diyas", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 1, isActive: true, metadata: { width: 220, height: 300 } }, { itemId: "decor-card-2", title: "", subtitle: "", description: "", badge: "", imageUrl: "/homepage/decor_handicraft.jpg", imageAlt: "Artisanal Handicrafts", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 2, isActive: true, metadata: { width: 200, height: 280, marginTop: 32 } }] },
  "whatsapp-banner": { sectionId: "whatsapp-banner", title: "Curate your cart.", subtitle: "Complete on WhatsApp.", description: "", badgeText: "🛍 Shopping Made Personal", mediaUrl: "/homepage/img5.png", mediaAlt: "Sree Collections WhatsApp Shopping Bag", secondaryMediaUrl: "", secondaryMediaAlt: "", tertiaryMediaUrl: "", tertiaryMediaAlt: "", ctaText: "Chat on WhatsApp", ctaLink: "https://wa.me/?text=Hello%20Sree%20Collections%2C%20I%20want%20to%20shop!", secondaryCtaText: "", secondaryCtaLink: "", isActive: true, settings: {}, items: [{ itemId: "wa-step-1", title: "Added Cart", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 1, isActive: true, metadata: {} }, { itemId: "wa-step-2", title: "WhatsApp", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 2, isActive: true, metadata: {} }, { itemId: "wa-step-3", title: "Order Confirmed", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 3, isActive: true, metadata: {} }] },
  testimonials: { sectionId: "testimonials", title: "Why our Customer says", subtitle: "", description: "", badgeText: "", mediaUrl: "", mediaAlt: "", secondaryMediaUrl: "", secondaryMediaAlt: "", tertiaryMediaUrl: "", tertiaryMediaAlt: "", ctaText: "", ctaLink: "#", secondaryCtaText: "", secondaryCtaLink: "", isActive: true, settings: {}, items: [{ itemId: "t1", title: "Priya Sundaram", subtitle: "Verified Bride", description: "The silk saree and the temple necklace set I ordered for my sister's wedding completely surpassed my expectations.", badge: "Chennai, India", imageUrl: "", imageAlt: "", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 1, isActive: true, metadata: { rating: 5 } }, { itemId: "t2", title: "Ananya Deshmukh", subtitle: "Verified Buyer", description: "Shopping via WhatsApp concierge was the smoothest experience ever. They shared detailed 4K close-up videos of the Banarasi weaves.", badge: "Mumbai, India", imageUrl: "", imageAlt: "", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 2, isActive: true, metadata: { rating: 5 } }, { itemId: "t3", title: "Radhika Patel", subtitle: "International Client", description: "Ordered from the US and my parcel arrived in just 4 days with pristine packing. The fabric is so soft, breathable, and authentic.", badge: "San Jose, USA", imageUrl: "", imageAlt: "", linkUrl: "#", ctaText: "", bgColor: "", displayOrder: 3, isActive: true, metadata: { rating: 5 } }] },
  footer: { sectionId: "footer", title: "", subtitle: "", description: "Celebrating timeless Indian royalty with handpicked silk sarees, designer ethnic sets, and authentic temple jewellery crafted for extraordinary celebrations.", badgeText: "", mediaUrl: "/homepage/logo2.png", mediaAlt: "Sree Collections", secondaryMediaUrl: "", secondaryMediaAlt: "", tertiaryMediaUrl: "", tertiaryMediaAlt: "", ctaText: "", ctaLink: "#", secondaryCtaText: "", secondaryCtaLink: "", isActive: true, settings: { phone: "+91 98765 43210", email: "support@sreecollections.com", copyright: "Sree Collections. All Rights Reserved." }, items: [{ itemId: "footer-col-1", title: "Kanjeevaram Pure Silk", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#featured", ctaText: "", bgColor: "", displayOrder: 1, isActive: true, metadata: { group: "collections" } }, { itemId: "footer-col-2", title: "Banarasi Heritage Weaves", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#featured", ctaText: "", bgColor: "", displayOrder: 2, isActive: true, metadata: { group: "collections" } }, { itemId: "footer-col-3", title: "Bridal Lehengas & Kurtas", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#featured", ctaText: "", bgColor: "", displayOrder: 3, isActive: true, metadata: { group: "collections" } }, { itemId: "footer-col-4", title: "Temple Jewellery Sets", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#featured", ctaText: "", bgColor: "", displayOrder: 4, isActive: true, metadata: { group: "collections" } }, { itemId: "footer-col-5", title: "Everyday Casuals & Denims", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#featured", ctaText: "", bgColor: "", displayOrder: 5, isActive: true, metadata: { group: "collections" } }, { itemId: "footer-col-6", title: "Festive Home Decor", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#featured", ctaText: "", bgColor: "", displayOrder: 6, isActive: true, metadata: { group: "collections" } }, { itemId: "footer-care-1", title: "Track Your Order", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#home", ctaText: "", bgColor: "", displayOrder: 1, isActive: true, metadata: { group: "customer-care" } }, { itemId: "footer-care-2", title: "Shipping & Global Delivery", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#home", ctaText: "", bgColor: "", displayOrder: 2, isActive: true, metadata: { group: "customer-care" } }, { itemId: "footer-care-3", title: "Custom Blouse Stitching", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#home", ctaText: "", bgColor: "", displayOrder: 3, isActive: true, metadata: { group: "customer-care" } }, { itemId: "footer-care-4", title: "WhatsApp Live Video Call", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#home", ctaText: "", bgColor: "", displayOrder: 4, isActive: true, metadata: { group: "customer-care" } }, { itemId: "footer-care-5", title: "Returns & Exchanges", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#home", ctaText: "", bgColor: "", displayOrder: 5, isActive: true, metadata: { group: "customer-care" } }, { itemId: "footer-care-6", title: "Authenticity Certificate", subtitle: "", description: "", badge: "", imageUrl: "", imageAlt: "", linkUrl: "#home", ctaText: "", bgColor: "", displayOrder: 6, isActive: true, metadata: { group: "customer-care" } }] },
};

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [cms, setCms] = useState<CMSData>(FALLBACK_CMS);
  const [cmsLoading, setCmsLoading] = useState(true);

  const fetchCms = useCallback(async (silent = false) => {
    if (!silent) setCmsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/homepage?_t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache" } });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.success && data.data) {
        // Merge with fallback — fallback fills any missing section so page never breaks
        setCms({ ...FALLBACK_CMS, ...data.data });
      }
    } catch {
      // Silently fall back to defaults — page renders fine without API
    } finally {
      if (!silent) setCmsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load
    fetchCms();

    // ── Real-time sync: re-fetch whenever tab regains focus ──────────────────
    // This means the instant an admin saves changes and switches to the
    // storefront tab, the content updates immediately.
    const handleFocus = () => fetchCms(true);
    window.addEventListener("focus", handleFocus);
    const handleVisibility = () => { if (document.visibilityState === "visible") fetchCms(true); };
    document.addEventListener("visibilitychange", handleVisibility);

    // ── Cross-tab instant sync: admin panel writes localStorage on save ─────
    // When admin saves in another tab, storefront gets notified immediately
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cms_updated_at") fetchCms(true);
    };
    window.addEventListener("storage", handleStorage);

    // ── Polling: auto-refresh every 30 seconds in the background ─────────────
    const pollInterval = setInterval(() => fetchCms(true), 30_000);

    // BroadcastChannel: instant sync within same browser (works same-window cross-tab)
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("cms_sync");
      bc.onmessage = () => fetchCms(true);
    } catch { /* unsupported browser */ }

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("storage", handleStorage);
      bc?.close();
      clearInterval(pollInterval);
    };
  }, [fetchCms]);

  // Convenience helpers
  const S = (id: string): CMSSection => cms[id] || FALLBACK_CMS[id] || {} as CMSSection;
  const items = (id: string) => (S(id).items || []).filter(i => i.isActive !== false);
  const testimonials = items("testimonials");
  const mosaicItems = items("categories-mosaic");
  const mosaicLeft = mosaicItems.filter(i => ["left-top", "left-bottom"].includes(String((i.metadata as Record<string, unknown>)?.type || "")));
  const mosaicRightTall = mosaicItems.find(i => (i.metadata as Record<string, unknown>)?.type === "right-tall");
  const mosaicBottomSmallLeft = mosaicItems.find(i => (i.metadata as Record<string, unknown>)?.type === "bottom-small-left");
  const mosaicBottomWide = mosaicItems.find(i => (i.metadata as Record<string, unknown>)?.type === "bottom-wide");
  const mosaicBottomSmallRight = mosaicItems.find(i => (i.metadata as Record<string, unknown>)?.type === "bottom-small-right");
  const casualCards = items("spotlight-casual");
  const sareeCards = items("spotlight-saree");
  const decorCards = items("spotlight-decor");
  const waSteps = items("whatsapp-banner");
  const navLinks = items("header").filter(i => ["nav-home", "nav-about", "nav-categories"].includes(i.itemId));

  return (
    <div style={{ backgroundColor: "#FCF8F2", minHeight: "100vh", overflowX: "hidden" }}>
      {/* =========================================================================
          1. HEADER (Exact Navbar Alignment from Reference Screenshot)
          - Logo on Left
          - Right-aligned: Home (with active underline), About, Categories,
            "CONTACT US" golden pill button, Search icon, Cart icon
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
            <a href="#" style={{ display: "inline-block" }}>
              <img
                src={S("header").mediaUrl || "/homepage/logo2_trans.png"}
                alt={S("header").mediaAlt || "Sree Collections"}
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
            {/* CMS-driven nav links */}
            {navLinks.map((link) => {
              const isHome = link.itemId === "nav-home" || link.linkUrl === "#home";
              return (
                <a
                  key={link.itemId}
                  href={link.linkUrl}
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#5A2035",
                    borderBottom: isHome ? "2.5px solid #5A2035" : undefined,
                    paddingBottom: isHome ? "3px" : undefined,
                    transition: "opacity 0.2s",
                    lineHeight: 1.2,
                  }}
                  className={isHome ? undefined : "nav-link"}
                >
                  {link.title}
                </a>
              );
            })}

            {/* CONTACT US Pill Button */}
            <a
              href={S("header").ctaLink || "/contact"}
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
              {S("header").ctaText || "CONTACT US"}
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
              <img src={S("header").secondaryMediaUrl || "/homepage/logo2.png"} alt="Logo" style={{ height: "48px" }} />
              <button onClick={() => setMobileMenuOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
              {navLinks.map((link) => (
                <a
                  key={link.itemId}
                  href={link.linkUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontSize: "16px", fontWeight: link.itemId === "nav-home" ? 600 : 500 }}
                >
                  {link.title}
                </a>
              ))}
              <a
                href={S("header").ctaLink || "/contact"}
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "16px", fontWeight: 500 }}
              >
                {S("header").ctaText || "Contact Us"}
              </a>
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
            backgroundImage: `url('${(S("hero").settings?.watermarkUrl as string) || "/homepage/sc_crest_watermark_trans.png"}')`,
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
          {/* Line 1: Dive Into A W❂Rld Of Endless */}
          <h1
            className="hero-main-title"
            style={{
              fontFamily: "'Blacker Display', Georgia, serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "clamp(34px, 5.8vw, 86px)",
              lineHeight: "130%",
              letterSpacing: "-0.03em",
              textTransform: "capitalize",
              color: "#5A2035",
              margin: "0 0 6px 0",
            }}
          >
            Dive Into A W
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                verticalAlign: "middle",
                margin: "0 4px",
                width: "0.8em",
                height: "0.8em",
                transform: "translateY(-0.06em)",
              }}
            >
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block" }}>
                <circle cx="50" cy="50" r="48" fill="#BA8E43" />
                <circle cx="50" cy="50" r="44" fill="#B3863B" stroke="#DFC487" strokeWidth="1.2" />
                <g fill="#FFFDF8">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <path
                      key={i}
                      d="M 50 16 C 54.5 16, 55 35, 50 41 C 45 35, 45.5 16, 50 16 Z"
                      transform={`rotate(${angle} 50 50)`}
                    />
                  ))}
                </g>
                <circle cx="50" cy="50" r="7.5" fill="#BA8E43" stroke="#FFFDF8" strokeWidth="2" />
                <circle cx="50" cy="50" r="2.5" fill="#FFFDF8" />
              </svg>
            </span>
            Rld Of Endless
          </h1>

          {/* Line 2: Fashion Possibilities + Subtitle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "32px",
              flexWrap: "wrap",
            }}
          >
            <span
              className="hero-second-title"
              style={{
                fontFamily: "'Blacker Display', Georgia, serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "clamp(34px, 5.8vw, 86px)",
                lineHeight: "130%",
                letterSpacing: "-0.03em",
                textTransform: "capitalize",
                color: "#5A2035",
                display: "inline-block",
              }}
            >
              {S("hero").subtitle || "Fashion Possibilities"}
            </span>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                fontWeight: 500,
                color: "#5A2035",
                maxWidth: "380px",
                margin: 0,
                lineHeight: 1.45,
                letterSpacing: "-0.2px",
              }}
            >
              {S("hero").description || "Elevate Your Wardrobe With Our Fashion Finds."}
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
                src={S("hero").mediaUrl || "/homepage/hero_col1.png"}
                alt={S("hero").mediaAlt || "Fashion Model in Coat"}
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
                  href={S("hero").ctaLink || "#featured"}
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
                  <span>{S("hero").ctaText || "SHOP NOW"}</span>
                  <span style={{ fontSize: "15px", letterSpacing: "-1.5px", fontWeight: 400 }}>───────&gt;</span>
                </a>

                {/* Button 2: EXPLORE MORE PRODUCTS */}
                <a
                  href={S("hero").secondaryCtaLink || "#categories"}
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
                  <span>{S("hero").secondaryCtaText || "EXPLORE MORE PRODUCTS"}</span>
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
                  src={S("hero").secondaryMediaUrl || "/homepage/hero_bangles.png"}
                  alt={S("hero").secondaryMediaAlt || "Awesome Gold Jewelry Collection"}
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
                    {(S("hero").settings?.bangle_badge_label as string) || "TRENDING"}
                  </span>
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "13px",
                      color: "#5A2035",
                      lineHeight: 1.15,
                    }}
                  >
                    {(S("hero").settings?.bangle_badge_title as string) || "Awesome"}
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
                    {(S("hero").settings?.bangle_badge_subtitle as string) || "Collection"}
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
                src={S("hero").tertiaryMediaUrl || "/homepage/hero_col3.png"}
                alt={S("hero").tertiaryMediaAlt || "Bridal Jewelry and Sets"}
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

        {/* Dynamic Featured Collection Showcase (7-Card Curved Diamond Layout) */}
        <FeaturedCardsShowcase />
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
              src={S("free-delivery").mediaUrl || "/homepage/img4.png"}
              alt={S("free-delivery").mediaAlt || "Free Express Delivery Truck with Saree & Jewelry"}
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
              {S("free-delivery").title || "Free Delivery"}
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
              {S("free-delivery").subtitle || "🛍️ Order above $99/-"}
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
              <FiCheckCircle size={16} color="#BB8E43" /> {S("free-delivery").badgeText || "No Code Required • Worldwide Express Delivery"}
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
            {S("categories-mosaic").subtitle || "Discover By Category"}
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
            {S("categories-mosaic").title || "Explore Our World of Styles"}
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
                    {(mosaicLeft[0]?.badge) || "DENIM WEAR"}
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
                    {(mosaicLeft[0]?.title) || "Effortless Casuals"}
                  </h3>
                </div>
                <a
                  href={mosaicLeft[0]?.linkUrl || "#featured"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#5D2030",
                  }}
                >
                  {(mosaicLeft[0]?.ctaText) || "Shop Denims"} <FiArrowRight size={15} />
                </a>
              </div>
              <div style={{ width: "48%", height: "100%", position: "relative" }}>
                <img
                  src={mosaicLeft[0]?.imageUrl || "/homepage/mosaic_denim.jpg"}
                  alt={mosaicLeft[0]?.imageAlt || "Denim Jeans"}
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
                  src={mosaicLeft[1]?.imageUrl || "/homepage/mosaic_ethnic.jpg"}
                  alt={mosaicLeft[1]?.imageAlt || "Ethnic Wear"}
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
                    {(mosaicLeft[1]?.badge) || "ETHNIC WEAR"}
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
                    {(mosaicLeft[1]?.title) || "Heritage Elegance"}
                  </h3>
                </div>
                <a
                  href={mosaicLeft[1]?.linkUrl || "#sarees"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#5D2030",
                  }}
                >
                  {(mosaicLeft[1]?.ctaText) || "Explore Kurtas"} <FiArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Tall Frame (660.45 x 630) */}
          <div className="mosaic-right-tall float-hover">
            <img
              src={mosaicRightTall?.imageUrl || "/homepage/mosaic_necklace.jpg"}
              alt={mosaicRightTall?.imageAlt || "Royal Gold Jewellery"}
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
                {mosaicRightTall?.badge || "22K PURE TEMPLE CRAFT"}
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
                {mosaicRightTall?.title || "Royal Gold Jewellery Collection"}
              </h3>
              <a
                href={mosaicRightTall?.linkUrl || "#featured"}
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
                {mosaicRightTall?.ctaText || "Explore Jewellery"} <FiChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Row: 3 Frames (271.95 x 357, 665.70 x 357, 271.95 x 357) */}
        <div className="mosaic-bottom-container">
          <div className="mosaic-bottom-small float-hover" style={{ backgroundColor: "#F2EFE9" }}>
            <img
              src={mosaicBottomSmallLeft?.imageUrl || "/homepage/mosaic_shirt.jpg"}
              alt={mosaicBottomSmallLeft?.imageAlt || "Summer Casuals"}
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
                {mosaicBottomSmallLeft?.badge || "Minimalist"}
              </span>
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "#2F2C24", margin: 0 }}>
                {mosaicBottomSmallLeft?.title || "Everyday Linens"}
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
                {mosaicBottomWide?.badge || "URBAN ATELIER"}
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
                {mosaicBottomWide?.title || "Active Wear & Street Style"}
              </h3>
              <p style={{ fontSize: "14.5px", color: "#546E6A", marginBottom: "20px", lineHeight: 1.45 }}>
                {mosaicBottomWide?.description || "Vibrant hues, modern cuts, and ultimate comfort for every journey."}
              </p>
              <a
                href={mosaicBottomWide?.linkUrl || "#featured"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#5D2030",
                }}
              >
                {mosaicBottomWide?.ctaText || "Shop Street Edit"} <FiArrowRight size={15} />
              </a>
            </div>
            <div style={{ width: "45%", height: "100%", position: "relative" }}>
              <img
                src={mosaicBottomWide?.imageUrl || "/homepage/mosaic_street.jpg"}
                alt={mosaicBottomWide?.imageAlt || "Activewear & Street Style"}
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
              src={mosaicBottomSmallRight?.imageUrl || "/homepage/mosaic_decor.jpg"}
              alt={mosaicBottomSmallRight?.imageAlt || "Festive Party Decor"}
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
                {mosaicBottomSmallRight?.badge || "Celebrations"}
              </span>
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "#2F2C24", margin: 0 }}>
                {mosaicBottomSmallRight?.title || "Festive Home Decor"}
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
              {S("editorial-banner").title || "Your Style"}
            </span>
            <img
              src={S("editorial-banner").mediaUrl || "/homepage/your_style_pill1_hd.jpg"}
              alt={S("editorial-banner").mediaAlt || "Luxury saree and pearls"}
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
              src={S("editorial-banner").secondaryMediaUrl || "/homepage/your_style_pill2_hd.jpg"}
              alt={S("editorial-banner").secondaryMediaAlt || "Jewelry display"}
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
              {S("editorial-banner").subtitle || "Your Rules"}
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
              {S("editorial-banner").description || "Empower Your Fashion"}
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
                {S("editorial-banner").ctaText || "SHOP NOW"}
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
      {/* =========================================================================
          7. CATEGORY SPOTLIGHT 1: CASUAL WEAR COLLECTIONS
         ========================================================================= */}
      <section
        id="casual-wear"
        style={{
          width: "100%",
          maxWidth: "1140px",
          margin: "0 auto 100px auto",
          padding: "0 28px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header Row */}
        <div
          className="category-section-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
              <h2
                style={{
                  fontFamily: "'Blacker Display', 'Playfair Display', Georgia, serif",
                  fontSize: "clamp(34px, 3.8vw, 44px)",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {S("spotlight-casual").title || "Casual Wear"}
              </h2>
              <span
                style={{
                  fontFamily: "'Blacker Display', 'Playfair Display', Georgia, serif",
                  fontSize: "clamp(24px, 2.8vw, 32px)",
                  fontWeight: 400,
                  color: "#5D2030",
                }}
              >
                {S("spotlight-casual").subtitle || "Collections"}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "12px",
                color: "#685F53",
                margin: 0,
                letterSpacing: "0.2px",
              }}
            >
              We consider &nbsp;your look and comfort on scorching weather.
            </p>
          </div>

          <div style={{ maxWidth: "390px" }}>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "12.5px",
                color: "#685F53",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              We provide the largest clothing collection for your comfort. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.
            </p>
          </div>
        </div>

        {/* Content Row: Left tall card + text; Right overlapping cards + Explore */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "50px",
            alignItems: "flex-end",
          }}
          className="category-section-grid"
        >
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "420px" }}>
            <div
              style={{
                width: "100%",
                height: "460px",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 14px 36px rgba(93, 32, 48, 0.08)",
                backgroundColor: "#F5EFE5",
              }}
              className="float-hover"
            >
              <img
                src="/homepage/casual_model1.jpg"
                alt="Casual Wear Model"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "12px",
                color: "#685F53",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Our main aim is to serve our customer with better quality product. We try to understand their needs and provide them within a short period of time.
            </p>
          </div>

          {/* Right Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "28px",
            }}
          >
            {/* Overlapping Dual Cards */}
            <div style={{ position: "relative", width: "100%", maxWidth: "380px", height: "380px" }}>
              {/* Back / Main image (pink co-ord set) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "270px",
                  height: "350px",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 16px 36px rgba(0,0,0,0.08)",
                  backgroundColor: "#F5EFE5",
                }}
                className="float-hover"
              >
                <img
                  src="/homepage/casual_model2.jpg"
                  alt="Casual Pink Outfit"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Front Overlapping image (denim & sneakers) */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "170px",
                  height: "210px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 14px 34px rgba(0,0,0,0.14)",
                  backgroundColor: "#F5EFE5",
                  zIndex: 2,
                }}
                className="float-hover"
              >
                <img
                  src="/homepage/casual_model3.jpg"
                  alt="Denim and Sneakers"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Explore Button */}
            <Link
              href="/categories?category=Casual+Wear"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                border: "1.5px solid #BB8E43",
                color: "#BB8E43",
                fontSize: "13.5px",
                fontFamily: "'Playfair Display', Georgia, serif",
                padding: "8px 28px",
                borderRadius: "999px",
                textDecoration: "none",
                transition: "all 0.25s ease",
                backgroundColor: "transparent",
              }}
              className="cat-explore-pill-btn"
            >
              Explore <FiArrowRight size={14} />
            </Link>
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
          maxWidth: "1140px",
          margin: "0 auto 100px auto",
          padding: "0 28px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header Row */}
        <div
          className="category-section-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          <div style={{ maxWidth: "390px" }}>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "12.5px",
                color: "#685F53",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              We provide the largest collection sarees. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.
            </p>
          </div>

          <div className="header-text-right" style={{ textAlign: "right" }}>
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
              <h2
                style={{
                  fontFamily: "'Blacker Display', 'Playfair Display', Georgia, serif",
                  fontSize: "clamp(34px, 3.8vw, 44px)",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Saree
              </h2>
              <span
                style={{
                  fontFamily: "'Blacker Display', 'Playfair Display', Georgia, serif",
                  fontSize: "clamp(24px, 2.8vw, 32px)",
                  fontWeight: 400,
                  color: "#5D2030",
                }}
              >
                Collections
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "12px",
                color: "#685F53",
                margin: 0,
                letterSpacing: "0.2px",
              }}
            >
              We consider &nbsp;your look and comfort on cold &nbsp;weather.
            </p>
          </div>
        </div>

        {/* Content Row: Left overlapping cards; Right text + Explore */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "50px",
            alignItems: "center",
          }}
          className="category-section-grid"
        >
          {/* Left Column: Overlapping Dual Saree Cards */}
          <div>
            <div style={{ position: "relative", width: "100%", maxWidth: "390px", height: "350px" }}>
              {/* Back / Main image (two models in sarees) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "230px",
                  height: "310px",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 16px 36px rgba(0,0,0,0.08)",
                  backgroundColor: "#F5EFE5",
                }}
                className="float-hover"
              >
                <img
                  src="/homepage/saree_models.jpg"
                  alt="Royal Silk Sarees"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Front Overlapping image (green & pink folded sarees) */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "260px",
                  height: "195px",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 14px 34px rgba(0,0,0,0.14)",
                  backgroundColor: "#F5EFE5",
                  zIndex: 2,
                }}
                className="float-hover"
              >
                <img
                  src="/homepage/saree_green.jpg"
                  alt="Handcrafted Silk Sarees"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Paragraph + Explore Button */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "430px" }}>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "12px",
                color: "#685F53",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Our main aim is to serve our customer with better quality product. We try to understand their needs and provide them within a short period of time. We provide the largest clothing collection for any season. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.
            </p>
            <div>
              <Link
                href="/categories?category=Saree"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "1.5px solid #BB8E43",
                  color: "#BB8E43",
                  fontSize: "13.5px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  padding: "8px 28px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  backgroundColor: "transparent",
                }}
                className="cat-explore-pill-btn"
              >
                Explore <FiArrowRight size={14} />
              </Link>
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
          maxWidth: "1140px",
          margin: "0 auto 100px auto",
          padding: "0 28px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header Row */}
        <div
          className="category-section-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
              <h2
                style={{
                  fontFamily: "'Blacker Display', 'Playfair Display', Georgia, serif",
                  fontSize: "clamp(34px, 3.8vw, 44px)",
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Decorative Item
              </h2>
              <span
                style={{
                  fontFamily: "'Blacker Display', 'Playfair Display', Georgia, serif",
                  fontSize: "clamp(24px, 2.8vw, 32px)",
                  fontWeight: 400,
                  color: "#5D2030",
                }}
              >
                Collections
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "12px",
                color: "#685F53",
                margin: 0,
                letterSpacing: "0.2px",
              }}
            >
              We consider &nbsp;your look and comfort on cold &nbsp;weather.
            </p>
          </div>

          <div style={{ maxWidth: "390px" }}>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "12.5px",
                color: "#685F53",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              We provide the largest clothing collection for any season. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.
            </p>
          </div>
        </div>

        {/* Content Row: Left Explore + text; Right overlapping cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "50px",
            alignItems: "center",
          }}
          className="category-section-grid"
        >
          {/* Left Column: Explore Button + Paragraph */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "430px" }}>
            <div>
              <Link
                href="/categories?category=Decorative+Items"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "1.5px solid #BB8E43",
                  color: "#BB8E43",
                  fontSize: "13.5px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  padding: "8px 28px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  backgroundColor: "transparent",
                }}
                className="cat-explore-pill-btn"
              >
                Explore <FiArrowRight size={14} />
              </Link>
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "12px",
                color: "#685F53",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Our main aim is to serve our customer with better quality product. We try to understand their needs and provide them within a short period of time. We provide the largest clothing collection for any season. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.
            </p>
          </div>

          {/* Right Column: Overlapping Dual Decor Cards */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "390px", height: "350px" }}>
              {/* Back / Main image (hanging star lights) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "230px",
                  height: "310px",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 16px 36px rgba(0,0,0,0.08)",
                  backgroundColor: "#F5EFE5",
                }}
                className="float-hover"
              >
                <img
                  src="/about/stars.jpg"
                  alt="Festive Star Lanterns"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Front Overlapping image (party decor cones) */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "260px",
                  height: "195px",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 14px 34px rgba(0,0,0,0.14)",
                  backgroundColor: "#F5EFE5",
                  zIndex: 2,
                }}
                className="float-hover"
              >
                <img
                  src="/about/party.jpg"
                  alt="Festive Party Decor"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
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
              <span style={{ fontSize: "15px" }}>🛍</span> {S("whatsapp-banner").badgeText || "Shopping Made Personal"}
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
              {S("whatsapp-banner").title || "Curate your cart."}
              <br />
              {S("whatsapp-banner").subtitle || "Complete on WhatsApp."}
            </h2>

            <a
              href={S("whatsapp-banner").ctaLink || "https://wa.me/?text=Hello%20Sree%20Collections%2C%20I%20want%20to%20shop!"}
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
              <FaWhatsapp size={20} /> {S("whatsapp-banner").ctaText || "Chat on WhatsApp"}
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
              {(waSteps.length > 0 ? waSteps : [{ itemId: "s1", title: "Added Cart" }, { itemId: "s2", title: "WhatsApp" }, { itemId: "s3", title: "Order Confirmed" }]).map((step, i, arr) => (
                <React.Fragment key={step.itemId}>
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
                    {step.title}
                  </span>
                  {i < arr.length - 1 && (
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
              src={S("whatsapp-banner").mediaUrl || "/homepage/img5.png"}
              alt={S("whatsapp-banner").mediaAlt || "Sree Collections WhatsApp Shopping Bag"}
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
            {S("testimonials").title || "Why our"}{" "}
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
            {testimonials.length > 0 ? (testimonials[activeTestimonial]?.description || "") : ""}
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
                {testimonials.length > 0 ? (testimonials[activeTestimonial]?.title || "") : ""}
              </h4>
              <span style={{ fontSize: "13.5px", color: "#7A7062" }}>
                {testimonials.length > 0 ? `${testimonials[activeTestimonial]?.badge || ""} • ${testimonials[activeTestimonial]?.subtitle || ""}` : ""}
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
{/* Responsive Styles */}
      <style>{`
        @media (min-width: 1400px) {
          .hero-main-title,
          .hero-second-title {
            font-size: 86px !important;
          }
        }
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

        .cat-explore-pill-btn:hover {
          background-color: #BB8E43 !important;
          color: #FFFFFF !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(187, 142, 67, 0.25);
        }

        @media (max-width: 768px) {
          .category-section-header {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .category-section-header .header-text-right {
            text-align: left !important;
          }
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
      `}</style>
    </div>
  );
}
