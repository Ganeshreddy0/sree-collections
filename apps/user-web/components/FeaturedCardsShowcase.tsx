"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const API_BASE = "http://localhost:5000/api";

export interface FeaturedCardItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  badge?: string;
  price?: string;
  subtitle?: string;
}

// 7 Luxury default cards matching the exact design layout in the mock
const DEFAULT_CARDS: FeaturedCardItem[] = [
  {
    id: "card-0",
    name: "Temple Bangles",
    slug: "jewellery",
    image: "/homepage/hero_bangles.png",
    badge: "SALE",
    price: "45.00USD",
    subtitle: "22K Traditional Craft",
  },
  {
    id: "card-1",
    name: "Heritage Sarees",
    slug: "saree",
    image: "/homepage/mosaic_ethnic.jpg",
    badge: "ETHNIC",
    price: "89.50USD",
    subtitle: "Pure Silk Weaves",
  },
  {
    id: "card-2",
    name: "Modern Chic",
    slug: "casual-wear",
    image: "/about/fashion.jpg",
    badge: "TRENDING",
    price: "95.00USD",
    subtitle: "Winter & Summer Edit",
  },
  {
    id: "card-3",
    name: "Formal Edition",
    slug: "casual-wear",
    image: "/homepage/saree_models.jpg",
    badge: "NEW",
    price: "120.25USD",
    subtitle: "Handcrafted Luxury",
  },
  {
    id: "card-4",
    name: "Temple Jewellery",
    slug: "jewellery",
    image: "/about/jewellery.jpg",
    badge: "ROYAL",
    price: "180.00USD",
    subtitle: "Emerald & Pearl Sets",
  },
  {
    id: "card-5",
    name: "Executive Edit",
    slug: "casual-wear",
    image: "/homepage/casual_model1.jpg",
    badge: "EXCLUSIVE",
    price: "110.00USD",
    subtitle: "Signature Suits",
  },
  {
    id: "card-6",
    name: "Festive Decor",
    slug: "decorative-items",
    image: "/about/stars.jpg",
    badge: "FESTIVE",
    price: "35.00USD",
    subtitle: "Artisanal Celebrations",
  },
];

export default function FeaturedCardsShowcase() {
  const [cards, setCards] = useState<FeaturedCardItem[]>(DEFAULT_CARDS);
  const [activeIndex, setActiveIndex] = useState(3); // Start with center card (index 3)
  const [containerWidth, setContainerWidth] = useState(1280);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dragging / Swipe state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentDrag = useRef(0);

  // Keep container width updated for responsive spacing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Fetch real categories from backend database and merge with cards
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE}/categories`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const apiCategories = data.data.filter((c: { status?: string }) => c.status !== "Inactive");

          // Map DB categories onto the 7 card layout, preserving images or using curated fallbacks
          const merged: FeaturedCardItem[] = DEFAULT_CARDS.map((def, idx) => {
            const cat = apiCategories[idx % apiCategories.length];
            if (!cat) return def;
            const customBadge = (cat.tag && cat.tag.trim()) || (cat.badge && cat.badge.trim()) || (cat.featured ? "FEATURED" : def.badge);
            const customPrice = (cat.startingPrice && cat.startingPrice.trim()) || def.price;

            return {
              id: cat.id || cat._id || def.id,
              name: cat.name || def.name,
              slug: cat.slug || def.slug,
              image: cat.image && cat.image.trim() ? cat.image : def.image,
              badge: customBadge,
              price: customPrice,
              subtitle: cat.description ? cat.description.slice(0, 32) + "..." : def.subtitle,
            };
          });

          setCards(merged);
        }
      } catch {
        // Fallback to default cards gracefully
      }
    }

    loadCategories();
  }, []);

  const total = cards.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Touch & Mouse Drag handlers
  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    currentDrag.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentDrag.current = e.touches[0].clientX - startX.current;
  };

  const onTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (currentDrag.current > 45) {
      handlePrev();
    } else if (currentDrag.current < -45) {
      handleNext();
    }
    currentDrag.current = 0;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    currentDrag.current = 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    currentDrag.current = e.clientX - startX.current;
  };

  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (currentDrag.current > 50) {
      handlePrev();
    } else if (currentDrag.current < -50) {
      handleNext();
    }
    currentDrag.current = 0;
  };

  // Smooth responsive scaling factor: ensures cards + side arrows fit comfortably on any screen width
  const isMobile = containerWidth < 768;
  const isTablet = containerWidth >= 768 && containerWidth < 1100;
  const scaleRatio = isMobile
    ? 0.62
    : Math.min(1, Math.max(0.7, (containerWidth - 140) / 1380));

  // Dynamic distance for navigation arrows (places them with comfortable breathing room outside outer cards)
  const outerCardEdge = (605 + 85) * scaleRatio;
  const arrowDist = Math.min(Math.max(containerWidth / 2 - 40, 200), outerCardEdge + 36);

  // Calculate coordinates and styling based on relative offset from active center
  const getSlotStyle = (cardIndex: number) => {
    let offset = cardIndex - activeIndex;
    while (offset > total / 2) offset -= total;
    while (offset < -total / 2) offset += total;

    // X positions matching the curved diamond silhouette in Image 1 (adjusted for wider cards)
    const xBase = [0, 235, 435, 605];
    const absOffset = Math.abs(offset);
    const sign = offset < 0 ? -1 : 1;

    let x = 0;
    if (absOffset <= 3) {
      x = sign * xBase[absOffset] * scaleRatio;
    } else {
      x = sign * (740 * scaleRatio);
    }

    if (absOffset === 0) {
      // Center Hero Card (wider and taller)
      return {
        x,
        width: 305 * scaleRatio,
        height: 560 * scaleRatio,
        borderWidth: "3px",
        borderRadius: "24px",
        zIndex: 10,
        boxShadow: "0 22px 50px rgba(93, 32, 48, 0.32)",
        opacity: 1,
        isCenter: true,
        pointerEvents: "auto" as const,
      };
    } else if (absOffset === 1) {
      // Inner Adjacent Cards (wider)
      return {
        x,
        width: 232 * scaleRatio,
        height: 490 * scaleRatio,
        borderWidth: "2.5px",
        borderRadius: "22px",
        zIndex: 6,
        boxShadow: "0 14px 30px rgba(0, 0, 0, 0.14)",
        opacity: 0.96,
        isCenter: false,
        pointerEvents: "auto" as const,
      };
    } else if (absOffset === 2) {
      // Mid Cards (wider)
      return {
        x,
        width: 196 * scaleRatio,
        height: 430 * scaleRatio,
        borderWidth: "2px",
        borderRadius: "20px",
        zIndex: 4,
        boxShadow: "0 10px 24px rgba(0, 0, 0, 0.1)",
        opacity: 0.9,
        isCenter: false,
        pointerEvents: isMobile ? ("none" as const) : ("auto" as const),
      };
    } else if (absOffset === 3) {
      // Outer Wings Cards (wider)
      return {
        x,
        width: 165 * scaleRatio,
        height: 370 * scaleRatio,
        borderWidth: "2px",
        borderRadius: "18px",
        zIndex: 2,
        boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
        opacity: isMobile ? 0 : 0.85,
        isCenter: false,
        pointerEvents: isMobile ? ("none" as const) : ("auto" as const),
      };
    } else {
      // Extra cards beyond visible 7-card window
      return {
        x,
        width: 140 * scaleRatio,
        height: 320 * scaleRatio,
        borderWidth: "2px",
        borderRadius: "16px",
        zIndex: 0,
        boxShadow: "none",
        opacity: 0,
        isCenter: false,
        pointerEvents: "none" as const,
      };
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "1480px",
        margin: "0 auto",
        position: "relative",
        padding: "20px 0 60px 0",
        boxSizing: "border-box",
        userSelect: "none",
        overflow: "hidden",
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* 3D Animated Carousel Stage (Vertically centered along horizontal axis) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: `${610 * scaleRatio}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        {cards.map((item, idx) => {
          const slot = getSlotStyle(idx);
          const isCenter = slot.isCenter;

          return (
            <div
              key={item.id + idx}
              onClick={() => {
                if (!isCenter) {
                  setActiveIndex(idx);
                }
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: `${slot.width}px`,
                height: `${slot.height}px`,
                transform: `translate(-50%, -50%) translateX(${slot.x}px)`,
                borderRadius: slot.borderRadius,
                border: `${slot.borderWidth} solid #C4A482`,
                boxShadow: slot.boxShadow,
                zIndex: slot.zIndex,
                opacity: slot.opacity,
                pointerEvents: slot.pointerEvents,
                transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), width 0.5s ease, height 0.5s ease, opacity 0.5s ease, box-shadow 0.5s ease",
                backgroundColor: "#2C1810",
                cursor: isCenter ? "default" : "pointer",
              }}
            >
              {/* Inner Masked Container for Image */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: slot.borderRadius,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Category Image */}
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 320px"
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  className="hover:scale-105"
                />

                {/* Vignette Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isCenter
                      ? "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.7) 100%)"
                      : "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.4) 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Top-Left Pill Badge (e.g. "ETHNIC", "NEW", "FEATURED") */}
                {item.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: `${16 * scaleRatio}px`,
                      left: `${16 * scaleRatio}px`,
                      backgroundColor: "#FFFFFF",
                      color: "#1F2937",
                      padding: `${4 * scaleRatio}px ${12 * scaleRatio}px`,
                      borderRadius: "9999px",
                      fontSize: `${11 * scaleRatio}px`,
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      zIndex: 3,
                      opacity: isCenter ? 1 : 0.9,
                    }}
                  >
                    {item.badge}
                  </div>
                )}

                {/* Center Hero Labels */}
                {isCenter && (
                  <>
                    {/* Top-Right Vertical / Rotated Category Title */}
                    <div
                      style={{
                        position: "absolute",
                        top: `${18 * scaleRatio}px`,
                        right: `${16 * scaleRatio}px`,
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        color: "#FFFFFF",
                        fontSize: `${12 * scaleRatio}px`,
                        fontWeight: 600,
                        letterSpacing: "1.2px",
                        textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                        zIndex: 3,
                        opacity: 0.95,
                      }}
                    >
                      {item.name}
                    </div>

                    {/* Bottom-Right Price / Start From Pill */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: `${20 * scaleRatio}px`,
                        right: `${16 * scaleRatio}px`,
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        padding: `${6 * scaleRatio}px ${12 * scaleRatio}px`,
                        textAlign: "right",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                        zIndex: 3,
                      }}
                    >
                      <div
                        style={{
                          fontSize: `${10 * scaleRatio}px`,
                          color: "#6B7280",
                          fontWeight: 600,
                          marginBottom: "1px",
                        }}
                      >
                        Start From
                      </div>
                      <div
                        style={{
                          fontSize: `${13 * scaleRatio}px`,
                          color: "#5D2030",
                          fontWeight: 700,
                          lineHeight: "1.1",
                        }}
                      >
                        {item.price || "120.25USD"}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Center Card Overlapping Floating Cart Button */}
              {isCenter && (
                <Link
                  href={`/categories?slug=${item.slug}`}
                  title={`Shop ${item.name}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    bottom: `${-22 * scaleRatio}px`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: `${48 * scaleRatio}px`,
                    height: `${48 * scaleRatio}px`,
                    borderRadius: "50%",
                    backgroundColor: "#5D2030",
                    border: "2.5px solid #C4A482",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    boxShadow: "0 6px 16px rgba(93, 32, 48, 0.4)",
                    cursor: "pointer",
                    zIndex: 25,
                    transition: "transform 0.2s, background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(-50%) scale(1.12)";
                    e.currentTarget.style.backgroundColor = "#461522";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(-50%) scale(1)";
                    e.currentTarget.style.backgroundColor = "#5D2030";
                  }}
                >
                  <FiShoppingCart size={Math.round(18 * scaleRatio)} />
                </Link>
              )}
            </div>
          );
        })}

        {/* Navigation Arrow Left (Positioned with clear spacing outside outer cards) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous Category"
          style={{
            position: "absolute",
            left: isMobile ? "8px" : `calc(50% - ${arrowDist}px)`,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 50,
            width: isMobile ? "38px" : "48px",
            height: isMobile ? "38px" : "48px",
            borderRadius: "50%",
            backgroundColor: "#FFFDF9",
            border: "2px solid #C4A482",
            color: "#5D2030",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(93, 32, 48, 0.28)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#5D2030";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFDF9";
            e.currentTarget.style.color = "#5D2030";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <FiChevronLeft size={isMobile ? 18 : 22} />
        </button>

        {/* Navigation Arrow Right (Positioned with clear spacing outside outer cards) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next Category"
          style={{
            position: "absolute",
            right: isMobile ? "8px" : `calc(50% - ${arrowDist}px)`,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 50,
            width: isMobile ? "38px" : "48px",
            height: isMobile ? "38px" : "48px",
            borderRadius: "50%",
            backgroundColor: "#FFFDF9",
            border: "2px solid #C4A482",
            color: "#5D2030",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(93, 32, 48, 0.28)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#5D2030";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFDF9";
            e.currentTarget.style.color = "#5D2030";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <FiChevronRight size={isMobile ? 18 : 22} />
        </button>
      </div>
    </div>
  );
}
