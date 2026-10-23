"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";
import { API_BASE, BACKEND_URL } from "@/lib/config";

interface CategoryDoc {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  tag?: string;
  badge?: string;
  startingPrice?: string;
  status: "Active" | "Inactive";
  featured?: boolean;
}

export interface MosaicCardSlot {
  slotId: string;
  type: "left-top" | "left-bottom" | "right-tall" | "bottom-small-left" | "bottom-wide" | "bottom-small-right";
  badge: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  ctaText: string;
  linkUrl: string;
  bgColor: string;
  badgeColor?: string;
  titleColor?: string;
}

// Default slot configurations matching the original luxury design
const DEFAULT_SLOTS: MosaicCardSlot[] = [
  {
    slotId: "slot-left-top",
    type: "left-top",
    badge: "DENIM WEAR",
    title: "Effortless Casuals",
    imageUrl: "/homepage/mosaic_denim.jpg",
    imageAlt: "Denim Jeans",
    ctaText: "Shop Denims",
    linkUrl: "/categories?slug=casual-wear",
    bgColor: "#DDEBEA",
    badgeColor: "#4A6261",
    titleColor: "#2F2C24",
  },
  {
    slotId: "slot-left-bottom",
    type: "left-bottom",
    badge: "ETHNIC WEAR",
    title: "Heritage Elegance",
    imageUrl: "/homepage/mosaic_ethnic.jpg",
    imageAlt: "Ethnic Wear",
    ctaText: "Explore Kurtas",
    linkUrl: "/categories?slug=saree",
    bgColor: "#EFE4E0",
    badgeColor: "#7D534A",
    titleColor: "#5D2030",
  },
  {
    slotId: "slot-right-tall",
    type: "right-tall",
    badge: "22K PURE TEMPLE CRAFT",
    title: "Royal Gold Jewellery Collection",
    imageUrl: "/homepage/mosaic_necklace.jpg",
    imageAlt: "Royal Gold Jewellery",
    ctaText: "Explore Jewellery",
    linkUrl: "/categories?slug=jewellery",
    bgColor: "#0A1C1A",
    badgeColor: "#DFBE7E",
    titleColor: "#FFFFFF",
  },
  {
    slotId: "slot-bottom-small-left",
    type: "bottom-small-left",
    badge: "MINIMALIST",
    title: "Everyday Linens",
    imageUrl: "/homepage/mosaic_shirt.jpg",
    imageAlt: "Summer Casuals",
    ctaText: "Explore",
    linkUrl: "/categories",
    bgColor: "#F2EFE9",
    badgeColor: "#BB8E43",
    titleColor: "#2F2C24",
  },
  {
    slotId: "slot-bottom-wide",
    type: "bottom-wide",
    badge: "URBAN ATELIER",
    title: "Active Wear & Street Style",
    description: "Vibrant hues, modern cuts, and ultimate comfort for every journey.",
    imageUrl: "/homepage/mosaic_street.jpg",
    imageAlt: "Activewear & Street Style",
    ctaText: "Shop Street Edit",
    linkUrl: "/categories?slug=casual-wear",
    bgColor: "#D8F0EC",
    badgeColor: "#2F5F58",
    titleColor: "#2F2C24",
  },
  {
    slotId: "slot-bottom-small-right",
    type: "bottom-small-right",
    badge: "CELEBRATIONS",
    title: "Festive Home Decor",
    imageUrl: "/homepage/mosaic_decor.jpg",
    imageAlt: "Festive Party Decor",
    ctaText: "Explore",
    linkUrl: "/categories?slug=decorative-items",
    bgColor: "#F7F2FA",
    badgeColor: "#8E5BB0",
    titleColor: "#2F2C24",
  },
];

function normalizeImageUrl(src?: string, fallback = ""): string {
  if (!src) return fallback;
  const trimmed = src.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  if (trimmed.startsWith("/uploads/")) {
    return `${BACKEND_URL}${trimmed}`;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return `/${trimmed}`;
}

// CMS item shape coming from the HomepageSection items array
interface CMSItem {
  itemId: string;
  title: string;
  badge: string;
  imageUrl: string;
  imageAlt: string;
  linkUrl: string;
  ctaText: string;
  bgColor: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  metadata: Record<string, unknown>;
}

// Map CMS items (from admin panel) directly to mosaic slots by metadata.type
function mapCmsItemsToSlots(cmsItems: CMSItem[]): MosaicCardSlot[] {
  const TYPE_ORDER: MosaicCardSlot["type"][] = [
    "left-top",
    "left-bottom",
    "right-tall",
    "bottom-small-left",
    "bottom-wide",
    "bottom-small-right",
  ];

  const result: MosaicCardSlot[] = [...DEFAULT_SLOTS];

  cmsItems.forEach((item, fallbackIdx) => {
    const type = (item.metadata?.type as MosaicCardSlot["type"]) || TYPE_ORDER[fallbackIdx];
    const slotIdx = result.findIndex((s) => s.type === type);
    const idx = slotIdx !== -1 ? slotIdx : fallbackIdx;
    if (idx < result.length) {
      result[idx] = {
        ...result[idx],
        badge: item.badge || result[idx].badge,
        title: item.title || result[idx].title,
        description: item.description || result[idx].description,
        imageUrl: normalizeImageUrl(item.imageUrl, result[idx].imageUrl),
        imageAlt: item.imageAlt || result[idx].imageAlt,
        ctaText: item.ctaText || result[idx].ctaText,
        linkUrl: item.linkUrl || result[idx].linkUrl,
        bgColor: item.bgColor || result[idx].bgColor,
        badgeColor: (item.metadata?.badgeColor as string) || (item.metadata?.textColor as string) || result[idx].badgeColor,
        titleColor: (item.metadata?.titleColor as string) || result[idx].titleColor,
      };
    }
  });

  return result;
}

export default function CategoriesMosaicShowcase({
  sectionTitle = "Explore Our World of Styles",
  sectionSubtitle = "Discover By Category",
  cmsItems = [],
}: {
  sectionTitle?: string;
  sectionSubtitle?: string;
  cmsItems?: CMSItem[];
}) {
  const [categories, setCategories] = useState<CategoryDoc[]>([]);
  const [slots, setSlots] = useState<MosaicCardSlot[]>(DEFAULT_SLOTS);
  const [loading, setLoading] = useState(true);

  // ── If admin CMS items are provided, use them directly ─────────────────────
  useEffect(() => {
    if (cmsItems && cmsItems.length > 0) {
      setSlots(mapCmsItemsToSlots(cmsItems));
      setLoading(false);
    }
  }, [cmsItems]);

  // Map active categories into the 6 mosaic slots
  const mapCategoriesToSlots = useCallback((activeCats: CategoryDoc[]) => {
    if (!activeCats || activeCats.length === 0) {
      setSlots([]);
      return;
    }

    const available = [...activeCats];
    const assignedSlots: MosaicCardSlot[] = [...DEFAULT_SLOTS];

    // Priority keyword matcher
    const takeMatch = (keywords: string[]): CategoryDoc | null => {
      const idx = available.findIndex((cat) => {
        const text = `${cat.name} ${cat.slug} ${cat.tag || ""} ${cat.badge || ""}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });
      if (idx !== -1) {
        return available.splice(idx, 1)[0];
      }
      return null;
    };

    // Slot 3 (Right Tall): Jewellery / Gold / Craft
    const tallCat = takeMatch(["jewel", "gold", "necklace", "craft", "bangle"]) || available.shift();
    if (tallCat) {
      assignedSlots[2] = {
        ...assignedSlots[2],
        badge: (tallCat.tag || tallCat.badge || "22K TEMPLE CRAFT").toUpperCase(),
        title: tallCat.name.toLowerCase().includes("collection") ? tallCat.name : `${tallCat.name} Collection`,
        imageUrl: normalizeImageUrl(tallCat.image, assignedSlots[2].imageUrl),
        imageAlt: tallCat.name,
        ctaText: `Explore ${tallCat.name}`,
        linkUrl: `/categories?category=${encodeURIComponent(tallCat.name)}&slug=${tallCat.slug}`,
      };
    }

    // Slot 2 (Left Bottom): Saree / Silk / Ethnic
    const sareeCat = takeMatch(["saree", "ethnic", "silk", "kurta", "heritage"]) || available.shift();
    if (sareeCat) {
      assignedSlots[1] = {
        ...assignedSlots[1],
        badge: (sareeCat.tag || sareeCat.badge || "ETHNIC WEAR").toUpperCase(),
        title: sareeCat.name === "Saree" ? "Heritage Sarees" : sareeCat.name,
        imageUrl: normalizeImageUrl(sareeCat.image, assignedSlots[1].imageUrl),
        imageAlt: sareeCat.name,
        ctaText: `Explore ${sareeCat.name}`,
        linkUrl: `/categories?category=${encodeURIComponent(sareeCat.name)}&slug=${sareeCat.slug}`,
      };
    }

    // Slot 1 (Left Top): Casual / Denim / Western
    const casualCat = takeMatch(["casual", "denim", "western", "chic"]) || available.shift();
    if (casualCat) {
      assignedSlots[0] = {
        ...assignedSlots[0],
        badge: (casualCat.tag || casualCat.badge || "CASUAL WEAR").toUpperCase(),
        title: casualCat.name === "Casual Wear" ? "Effortless Casuals" : casualCat.name,
        imageUrl: normalizeImageUrl(casualCat.image, assignedSlots[0].imageUrl),
        imageAlt: casualCat.name,
        ctaText: `Shop ${casualCat.name}`,
        linkUrl: `/categories?category=${encodeURIComponent(casualCat.name)}&slug=${casualCat.slug}`,
      };
    }

    // Slot 5 (Bottom Wide): Lehengas / Active / Street
    const wideCat = takeMatch(["lehenga", "street", "active", "urban", "bridal"]) || available.shift();
    if (wideCat) {
      assignedSlots[4] = {
        ...assignedSlots[4],
        badge: (wideCat.tag || wideCat.badge || "DESIGNER WEAR").toUpperCase(),
        title: wideCat.name,
        description: wideCat.description || "Handcrafted silhouettes, rich embroidery, and ultimate luxury for celebrations.",
        imageUrl: normalizeImageUrl(wideCat.image, assignedSlots[4].imageUrl),
        imageAlt: wideCat.name,
        ctaText: `Shop ${wideCat.name}`,
        linkUrl: `/categories?category=${encodeURIComponent(wideCat.name)}&slug=${wideCat.slug}`,
      };
    }

    // Slot 6 (Bottom Small Right): Decor / Festive / Celebrations
    const decorCat = takeMatch(["decor", "festive", "party", "celebrat", "home"]) || available.shift();
    if (decorCat) {
      assignedSlots[5] = {
        ...assignedSlots[5],
        badge: (decorCat.tag || decorCat.badge || "CELEBRATIONS").toUpperCase(),
        title: decorCat.name,
        imageUrl: normalizeImageUrl(decorCat.image, assignedSlots[5].imageUrl),
        imageAlt: decorCat.name,
        ctaText: `Explore ${decorCat.name}`,
        linkUrl: `/categories?category=${encodeURIComponent(decorCat.name)}&slug=${decorCat.slug}`,
      };
    }

    // Slot 4 (Bottom Small Left): Any remaining category (Shades, Watches, Linens, etc.)
    const leftSmallCat = available.shift();
    if (leftSmallCat) {
      assignedSlots[3] = {
        ...assignedSlots[3],
        badge: (leftSmallCat.tag || leftSmallCat.badge || "MINIMALIST").toUpperCase(),
        title: leftSmallCat.name,
        imageUrl: normalizeImageUrl(leftSmallCat.image, assignedSlots[3].imageUrl),
        imageAlt: leftSmallCat.name,
        ctaText: `Explore ${leftSmallCat.name}`,
        linkUrl: `/categories?category=${encodeURIComponent(leftSmallCat.name)}&slug=${leftSmallCat.slug}`,
      };
    }

    setSlots(assignedSlots);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/categories?_t=${Date.now()}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const activeOnly = data.data.filter((c: CategoryDoc) => c.status === "Active");
        setCategories(activeOnly);
        mapCategoriesToSlots(activeOnly);
      }
    } catch {
      // Keep defaults gracefully if API is offline
      mapCategoriesToSlots(DEFAULT_SLOTS.map((s, idx) => ({
        id: `def-${idx}`,
        name: s.title,
        slug: s.linkUrl.replace("/categories?slug=", ""),
        status: "Active",
        image: s.imageUrl,
        tag: s.badge,
      })));
    } finally {
      setLoading(false);
    }
  }, [mapCategoriesToSlots]);

  // ── Fetch from categories API only when no CMS items are given ────────────
  useEffect(() => {
    if (cmsItems && cmsItems.length > 0) return; // CMS items take priority

    fetchCategories();

    // Re-sync when tab gains focus or on storage update
    const onFocus = () => fetchCategories();
    window.addEventListener("focus", onFocus);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cms_updated_at" || e.key === "category_updated_at") {
        fetchCategories();
      }
    };
    window.addEventListener("storage", onStorage);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("cms_sync");
      bc.onmessage = () => fetchCategories();
    } catch {
      /* noop */
    }

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
      bc?.close();
    };
  }, [fetchCategories, cmsItems]);

  // If no active categories exist and loading has finished, hide section cleanly
  if (!loading && categories.length === 0 && slots.length === 0) {
    return null;
  }

  const slot1 = slots[0];
  const slot2 = slots[1];
  const slot3 = slots[2];
  const slot4 = slots[3];
  const slot5 = slots[4];
  const slot6 = slots[5];

  return (
    <section
      id="categories"
      className="categories-mosaic-section"
      style={{
        width: "100%",
        maxWidth: "1535px",
        margin: "40px auto 90px auto",
        padding: "0 24px",
        boxSizing: "border-box",
      }}
    >
      {/* Section Header */}
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
          {sectionSubtitle}
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
          {sectionTitle}
        </h2>
      </div>

      {/* Top Mosaic Row */}
      <div className="mosaic-top-container">
        {/* Left Column: Two stacked frames (605.85 x 288.75) */}
        <div className="mosaic-left-column">
          {/* Frame 1: Top Left */}
          {slot1 && (
            <Link
              href={slot1.linkUrl}
              style={{
                width: "100%",
                height: "288.75px",
                borderRadius: "24px",
                backgroundColor: slot1.bgColor || "#DDEBEA",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                boxShadow: "0 10px 28px rgba(0,0,0,0.04)",
                transition: "all 0.35s ease",
                textDecoration: "none",
                cursor: "pointer",
              }}
              className="float-hover mosaic-split-card"
            >
              <div
                className="mosaic-card-text-wrap"
                style={{
                  flex: "1",
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  zIndex: 2,
                  minWidth: 0,
                }}
              >
                <div>
                  <span
                    className="mosaic-card-badge"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "14px",
                      letterSpacing: "0.075em",
                      lineHeight: "100%",
                      textTransform: "uppercase",
                      color: slot1.badgeColor || "#4A6261",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    {slot1.badge}
                  </span>
                  <h3
                    className="mosaic-card-title"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "28px",
                      fontWeight: 700,
                      color: slot1.titleColor || "#2F2C24",
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    {slot1.title}
                  </h3>
                </div>
                <div
                  className="mosaic-card-cta"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#5D2030",
                  }}
                >
                  {slot1.ctaText} <FiArrowRight size={15} />
                </div>
              </div>
              <div
                className="mosaic-card-img-wrap"
                style={{ width: "48%", height: "100%", position: "relative", flexShrink: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slot1.imageUrl}
                  alt={slot1.imageAlt || slot1.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transition: "transform 0.5s ease",
                  }}
                  className="hover:scale-105"
                />
              </div>
            </Link>
          )}

          {/* Frame 2: Bottom Left */}
          {slot2 && (
            <Link
              href={slot2.linkUrl}
              style={{
                width: "100%",
                height: "288.75px",
                borderRadius: "24px",
                backgroundColor: slot2.bgColor || "#EFE4E0",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                boxShadow: "0 10px 28px rgba(0,0,0,0.04)",
                transition: "all 0.35s ease",
                textDecoration: "none",
                cursor: "pointer",
              }}
              className="float-hover mosaic-split-card"
            >
              <div
                className="mosaic-card-img-wrap"
                style={{ width: "48%", height: "100%", position: "relative", flexShrink: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slot2.imageUrl}
                  alt={slot2.imageAlt || slot2.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transition: "transform 0.5s ease",
                  }}
                  className="hover:scale-105"
                />
              </div>
              <div
                className="mosaic-card-text-wrap"
                style={{
                  flex: "1",
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  zIndex: 2,
                  minWidth: 0,
                }}
              >
                <div>
                  <span
                    className="mosaic-card-badge"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "14px",
                      letterSpacing: "0.075em",
                      lineHeight: "100%",
                      textTransform: "uppercase",
                      color: slot2.badgeColor || "#7D534A",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    {slot2.badge}
                  </span>
                  <h3
                    className="mosaic-card-title"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "28px",
                      fontWeight: 700,
                      color: slot2.titleColor || "#5D2030",
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    {slot2.title}
                  </h3>
                </div>
                <div
                  className="mosaic-card-cta"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#5D2030",
                  }}
                >
                  {slot2.ctaText} <FiArrowRight size={15} />
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Right Column: Tall Frame (660.45 x 605.5) */}
        {slot3 && (
          <Link
            href={slot3.linkUrl}
            className="mosaic-right-tall float-hover"
            style={{ textDecoration: "none", display: "block", cursor: "pointer" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slot3.imageUrl}
              alt={slot3.imageAlt || slot3.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.92)",
                transition: "transform 0.6s ease",
              }}
              className="hover:scale-105"
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "48px 36px 36px 36px",
                background:
                  "linear-gradient(to top, rgba(10, 28, 26, 0.95) 0%, rgba(10, 28, 26, 0.45) 60%, transparent 100%)",
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
                  color: slot3.badgeColor || "#DFBE7E",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                {slot3.badge}
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
                {slot3.title}
              </h3>
              <div
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
                  transition: "all 0.25s ease",
                }}
                className="cat-explore-pill-btn"
              >
                {slot3.ctaText} <FiChevronRight size={16} />
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Bottom Row: 3 Frames (271.95 x 357, 665.70 x 357, 271.95 x 357) */}
      <div className="mosaic-bottom-container">
        {/* Frame 4: Bottom Left Small */}
        {slot4 && (
          <Link
            href={slot4.linkUrl}
            className="mosaic-bottom-small float-hover"
            style={{
              backgroundColor: slot4.bgColor || "#F2EFE9",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              borderRadius: "24px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "240px",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slot4.imageUrl}
                alt={slot4.imageAlt || slot4.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s ease",
                }}
                className="hover:scale-105"
              />
            </div>
            <div
              style={{
                padding: "20px 22px 24px 22px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: slot4.bgColor || "#F2EFE9",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: slot4.badgeColor || "#BB8E43",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  display: "block",
                  marginBottom: "6px",
                  lineHeight: 1.2,
                }}
              >
                {slot4.badge}
              </span>
              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "22px",
                  color: slot4.titleColor || "#2F2C24",
                  margin: 0,
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}
              >
                {slot4.title}
              </h4>
            </div>
          </Link>
        )}

        {/* Frame 5: Bottom Center Wide */}
        {slot5 && (
          <Link
            href={slot5.linkUrl}
            className="mosaic-bottom-wide float-hover mosaic-split-card"
            style={{
              backgroundColor: slot5.bgColor || "#D8F0EC",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <div
              className="mosaic-card-text-wrap mosaic-bottom-text-wrap"
              style={{
                flex: "1",
                padding: "44px 36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                zIndex: 2,
                minWidth: 0,
              }}
            >
              <span
                className="mosaic-card-badge"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "13px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: slot5.badgeColor || "#2F5F58",
                  marginBottom: "10px",
                  display: "block",
                }}
              >
                {slot5.badge}
              </span>
              <h3
                className="mosaic-card-title"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "30px",
                  fontWeight: 700,
                  color: slot5.titleColor || "#2F2C24",
                  lineHeight: 1.25,
                  marginBottom: "16px",
                }}
              >
                {slot5.title}
              </h3>
              {slot5.description && (
                <p
                  className="mosaic-card-desc"
                  style={{
                    fontSize: "14.5px",
                    color: "#546E6A",
                    marginBottom: "20px",
                    lineHeight: 1.45,
                  }}
                >
                  {slot5.description}
                </p>
              )}
              <div
                className="mosaic-card-cta"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#5D2030",
                }}
              >
                {slot5.ctaText} <FiArrowRight size={15} />
              </div>
            </div>
            <div
              className="mosaic-card-img-wrap mosaic-bottom-img-wrap"
              style={{ width: "45%", height: "100%", position: "relative", flexShrink: 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slot5.imageUrl}
                alt={slot5.imageAlt || slot5.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  transition: "transform 0.5s ease",
                }}
                className="hover:scale-105"
              />
            </div>
          </Link>
        )}

        {/* Frame 6: Bottom Right Small */}
        {slot6 && (
          <Link
            href={slot6.linkUrl}
            className="mosaic-bottom-small float-hover"
            style={{
              backgroundColor: slot6.bgColor || "#F7F2FA",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              borderRadius: "24px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "240px",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slot6.imageUrl}
                alt={slot6.imageAlt || slot6.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s ease",
                }}
                className="hover:scale-105"
              />
            </div>
            <div
              style={{
                padding: "20px 22px 24px 22px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: slot6.bgColor || "#F7F2FA",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: slot6.badgeColor || "#8E5BB0",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  display: "block",
                  marginBottom: "6px",
                  lineHeight: 1.2,
                }}
              >
                {slot6.badge}
              </span>
              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "22px",
                  color: slot6.titleColor || "#2F2C24",
                  margin: 0,
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}
              >
                {slot6.title}
              </h4>
            </div>
          </Link>
        )}
      </div>

      <style>{`
        .mosaic-bottom-small {
          display: flex !important;
          flex-direction: column !important;
          height: auto !important;
          min-height: 350px !important;
        }
        @media (max-width: 991px) {
          .categories-mosaic-section {
            padding: 0 16px !important;
            margin: 30px auto 60px auto !important;
          }
          .mosaic-top-container {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            margin-bottom: 20px !important;
          }
          .mosaic-left-column {
            width: 100% !important;
            gap: 20px !important;
          }
          .mosaic-right-tall {
            width: 100% !important;
            height: clamp(260px, 65vw, 420px) !important;
          }
          .mosaic-bottom-container {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .mosaic-bottom-small {
            width: 100% !important;
            height: auto !important;
            min-height: 320px !important;
          }
          .mosaic-bottom-wide {
            width: 100% !important;
            height: auto !important;
            min-height: 220px !important;
            flex-direction: column !important;
          }
          .mosaic-bottom-wide .mosaic-bottom-text-wrap {
            width: 100% !important;
            padding: 24px 18px !important;
          }
          .mosaic-bottom-wide .mosaic-bottom-img-wrap {
            width: 100% !important;
            height: 180px !important;
          }
          .mosaic-split-card {
            flex-direction: column !important;
            height: auto !important;
          }
          .mosaic-split-card .mosaic-card-img-wrap {
            width: 100% !important;
            height: 200px !important;
            order: -1;
          }
          .mosaic-split-card .mosaic-card-text-wrap {
            width: 100% !important;
            padding: 20px 16px !important;
          }
          .mosaic-split-card .mosaic-card-title {
            font-size: 20px !important;
          }
          .mosaic-split-card .mosaic-card-badge {
            font-size: 11px !important;
            letter-spacing: 1px !important;
          }
          .mosaic-split-card .mosaic-card-cta {
            font-size: 12px !important;
          }
        }
        @media (max-width: 640px) {
          .categories-mosaic-section {
            padding: 0 12px !important;
            margin: 24px auto 48px auto !important;
          }
          .mosaic-split-card .mosaic-card-img-wrap {
            height: 160px !important;
          }
          .mosaic-split-card .mosaic-card-title {
            font-size: 18px !important;
          }
          .mosaic-right-tall {
            height: 260px !important;
          }
          .mosaic-bottom-wide .mosaic-bottom-img-wrap {
            height: 150px !important;
          }
        }
      `}</style>
    </section>
  );
}
