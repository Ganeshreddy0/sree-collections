"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { BACKEND_URL } from "@/lib/config";

export interface SpotlightSectionData {
  _id?: string;
  sectionId: string;
  displayName?: string;
  title: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  mediaUrl?: string;
  mediaAlt?: string;
  secondaryMediaUrl?: string;
  secondaryMediaAlt?: string;
  tertiaryMediaUrl?: string;
  tertiaryMediaAlt?: string;
  ctaText?: string;
  ctaLink?: string;
  isActive?: boolean;
  settings?: {
    layout?: "left-tall" | "left-overlapping" | "right-overlapping";
    tagline?: string;
    secondaryDescription?: string;
    [key: string]: unknown;
  };
  items?: Array<{
    itemId: string;
    title?: string;
    imageUrl?: string;
    imageAlt?: string;
    linkUrl?: string;
    metadata?: Record<string, unknown>;
  }>;
}

function normalizeSrc(src?: string, fallback = ""): string {
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

export default function CategorySpotlightSection({ section }: { section: SpotlightSectionData }) {
  if (section.isActive === false) return null;

  const title = section.title || "Category";
  const subtitle = section.subtitle || "Collections";
  const tagline =
    section.badgeText ||
    section.settings?.tagline ||
    "We consider your look and comfort on cold weather.";
  const mainDescription =
    section.description ||
    "We provide the largest clothing collection for your comfort. You can choose trendy or classy design according to your preferences. Our services are super fast and we update within 24 hours.";
  const secondaryDescription =
    section.settings?.secondaryDescription ||
    "Our main aim is to serve our customer with better quality product. We try to understand their needs and provide them within a short period of time.";
  const ctaText = section.ctaText || "Explore";
  const ctaLink =
    section.ctaLink && section.ctaLink !== "#" && section.ctaLink !== "#featured"
      ? section.ctaLink
      : `/categories?category=${encodeURIComponent(title)}`;

  // Determine layout style
  let layout = section.settings?.layout;
  if (!layout) {
    if (section.sectionId.includes("casual")) layout = "left-tall";
    else if (section.sectionId.includes("saree")) layout = "left-overlapping";
    else if (section.sectionId.includes("decor")) layout = "right-overlapping";
    else layout = "left-tall";
  }

  const isCasual = section.sectionId.includes("casual") || layout === "left-tall";
  const isSaree = section.sectionId.includes("saree") || layout === "left-overlapping";
  const isDecor = section.sectionId.includes("decor") || layout === "right-overlapping";

  const items = section.items || [];

  let defaultImg1 = "/homepage/casual_model1.jpg";
  let defaultImg2 = "/homepage/casual_model2.jpg";
  let defaultImg3 = "/homepage/casual_model3.jpg";

  if (isSaree) {
    defaultImg1 = "/homepage/saree_dual_cards.png";
    defaultImg2 = "/homepage/saree_green.jpg";
  } else if (isDecor) {
    defaultImg1 = "/about/stars.jpg";
    defaultImg2 = "/about/party.jpg";
  }

  let rawImg1 = section.mediaUrl || items[0]?.imageUrl || defaultImg1;
  let rawImg2 = section.secondaryMediaUrl || items[1]?.imageUrl || defaultImg2;
  let rawImg3 = section.tertiaryMediaUrl || items[2]?.imageUrl || defaultImg3;

  // Sanitize any incorrect cross-category images
  if (isCasual) {
    if (!rawImg1 || rawImg1.includes("mosaic") || rawImg1.includes("saree")) rawImg1 = defaultImg1;
    if (!rawImg2 || rawImg2.includes("mosaic") || rawImg2.includes("saree")) rawImg2 = defaultImg2;
    if (!rawImg3 || rawImg3.includes("casual_model1") || rawImg3.includes("saree")) rawImg3 = defaultImg3;
  } else if (isSaree) {
    if (!rawImg1 || rawImg1.includes("casual") || rawImg1.includes("decor") || rawImg1.includes("saree_green")) rawImg1 = defaultImg1;
    if (!rawImg2 || rawImg2.includes("casual") || rawImg2.includes("decor") || rawImg2.includes("saree_models")) rawImg2 = defaultImg2;
  } else if (isDecor) {
    if (!rawImg1 || rawImg1.includes("casual") || rawImg1.includes("saree") || rawImg1.includes("decor_lights")) rawImg1 = defaultImg1;
    if (!rawImg2 || rawImg2.includes("casual") || rawImg2.includes("saree") || rawImg2.includes("decor_handicraft")) rawImg2 = defaultImg2;
  }

  const img1 = normalizeSrc(rawImg1, defaultImg1);
  const img2 = normalizeSrc(rawImg2, defaultImg2);
  const img3 = normalizeSrc(rawImg3, defaultImg3);

  // ── Layout A: Left Tall Image + Right Overlapping Images (e.g. Casual Wear) ──
  if (layout === "left-tall") {
    return (
      <section
        id={section.sectionId}
        style={{
          width: "100%",
          maxWidth: "1140px",
          margin: "0 auto 100px auto",
          padding: "0 28px",
          boxSizing: "border-box",
        }}
        className="category-spotlight-section"
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
                {title}
              </h2>
              <span
                style={{
                  fontFamily: "'Blacker Display', 'Playfair Display', Georgia, serif",
                  fontSize: "clamp(24px, 2.8vw, 32px)",
                  fontWeight: 400,
                  color: "#5D2030",
                }}
              >
                {subtitle}
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
              {tagline}
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
              {mainDescription}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "420px", width: "100%" }}>
            <div
              style={{
                width: "100%",
                height: "460px",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 14px 36px rgba(93, 32, 48, 0.08)",
                backgroundColor: "#F5EFE5",
              }}
              className="float-hover category-tall-img-wrap"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img1}
                alt={title}
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
              {secondaryDescription}
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
            <div style={{ position: "relative", width: "100%", maxWidth: "380px", height: "380px" }} className="category-spotlight-dual-wrap">
              {/* Back / Main image */}
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img2}
                  alt={`${title} Style 1`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Front Overlapping image */}
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img3}
                  alt={`${title} Style 2`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Explore Button */}
            <Link
              href={ctaLink}
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
              {ctaText} <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Layout B: Left Overlapping Images + Right Text & Button (e.g. Saree) ──
  if (layout === "left-overlapping") {
    return (
      <section
        id={section.sectionId}
        style={{
          width: "100%",
          maxWidth: "1140px",
          margin: "0 auto 100px auto",
          padding: "0 28px",
          boxSizing: "border-box",
        }}
        className="category-spotlight-section"
      >
        {/* Top Header Row */}
        <div
          className="category-section-header saree-header"
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
              {mainDescription}
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
                {title}
              </h2>
              <span
                style={{
                  fontFamily: "'Blacker Display', 'Playfair Display', Georgia, serif",
                  fontSize: "clamp(24px, 2.8vw, 32px)",
                  fontWeight: 400,
                  color: "#5D2030",
                }}
              >
                {subtitle}
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
              {tagline}
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
          {/* Left Column: Overlapping Dual Cards */}
          <div>
            {img1.includes("saree_dual_cards") || img1.includes("saree_composite") || img1.includes("saree_spotlight_cards") ? (
              <div
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="float-hover"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img1}
                  alt={title}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "contain",
                    filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.12))",
                  }}
                />
              </div>
            ) : (
              <div style={{ position: "relative", width: "100%", maxWidth: "390px", height: "350px" }} className="category-spotlight-dual-wrap">
                {/* Back image */}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img1}
                    alt={title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Front Overlapping image */}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img2}
                    alt={`${title} Detail`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
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
              {secondaryDescription}
            </p>
            <div>
              <Link
                href={ctaLink}
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
                {ctaText} <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Layout C: Left Text & Button + Right Overlapping Images (e.g. Decorative Items) ──
  return (
    <section
      id={section.sectionId}
      style={{
        width: "100%",
        maxWidth: "1140px",
        margin: "0 auto 100px auto",
        padding: "0 28px",
        boxSizing: "border-box",
      }}
      className="category-spotlight-section"
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
              {title}
            </h2>
            <span
              style={{
                fontFamily: "'Blacker Display', 'Playfair Display', Georgia, serif",
                fontSize: "clamp(24px, 2.8vw, 32px)",
                fontWeight: 400,
                color: "#5D2030",
              }}
            >
              {subtitle}
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
            {tagline}
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
            {mainDescription}
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
              href={ctaLink}
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
              {ctaText} <FiArrowRight size={14} />
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
            {secondaryDescription}
          </p>
        </div>

        {/* Right Column: Overlapping Dual Cards */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "390px", height: "350px" }} className="category-spotlight-dual-wrap">
            {/* Back image */}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img1}
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Front Overlapping image */}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img2}
                alt={`${title} Highlight`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .category-spotlight-section {
            padding: 0 16px !important;
            margin-bottom: 60px !important;
          }
          .category-section-header {
            flex-direction: column !important;
            gap: 16px !important;
            margin-bottom: 24px !important;
          }
          .category-section-header .header-text-right {
            text-align: left !important;
          }
          .saree-header .header-text-right {
            order: -1 !important;
          }
          .category-section-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .category-spotlight-dual-wrap {
            max-width: 100% !important;
            height: clamp(260px, 68vw, 360px) !important;
            margin: 0 auto;
          }
          .category-spotlight-dual-wrap > div:first-child {
            width: 65% !important;
            height: 88% !important;
          }
          .category-spotlight-dual-wrap > div:last-child {
            width: 58% !important;
            height: 58% !important;
          }
          .category-tall-img-wrap {
            height: clamp(300px, 80vw, 440px) !important;
            max-width: 100% !important;
          }
        }
        @media (max-width: 480px) {
          .category-spotlight-section {
            padding: 0 12px !important;
            margin-bottom: 44px !important;
          }
          .category-tall-img-wrap {
            height: 290px !important;
          }
          .category-spotlight-dual-wrap {
            height: 250px !important;
          }
          .category-spotlight-dual-wrap > div:first-child {
            width: 68% !important;
            height: 88% !important;
          }
          .category-spotlight-dual-wrap > div:last-child {
            width: 62% !important;
            height: 60% !important;
          }
        }
      `}</style>
    </section>
  );
}
