"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiShoppingBag,
  FiCheck,
  FiStar,
  FiTruck,
  FiRotateCcw,
  FiShield,
  FiShare2,
  FiHeart,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

const API_BASE = "http://localhost:5000/api";

interface Variant {
  _id?: string;
  sku: string;
  size: string;
  colour: string;
  mrp: number;
  sellingPrice: number;
  discountType?: string;
  discountValue?: number;
  discountPrice?: number;
  stock: number;
  isActive: boolean;
}

interface ColourImage {
  colour: string;
  images: string[];
  primaryImage: string;
}

interface Product {
  _id: string;
  id?: string;
  productName: string;
  title?: string;
  slug: string;
  productCode: string;
  sku?: string;
  category: string;
  categoryName?: string;
  subCategory?: string;
  brand: string;
  unit: string;
  description: string;
  productType: "Single Product" | "Variable Product";
  mrp: number;
  sellingPrice: number;
  price?: number | string;
  taxType?: string;
  stock: number;
  quantity?: number;
  featured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  images: string[];
  colourImages?: ColourImage[];
  featuredImage?: string;
  variants?: Variant[];
  selectedSizes?: string[];
  selectedColours?: string[];
  fabric?: string;
  careInstructions?: string;
  specifications?: string;
  shippingInfo?: string;
  returnPolicy?: string;
  dimensions?: string;
  tags?: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active selections
  const [selectedColour, setSelectedColour] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string>("");
  const [cartSuccess, setCartSuccess] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch product from backend
  useEffect(() => {
    if (!idOrSlug) return;
    setLoading(true);
    fetch(`${API_BASE}/products/${idOrSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data) {
          const p: Product = data.data;
          setProduct(p);

          // Initial colour selection
          const initialColour =
            p.selectedColours && p.selectedColours.length > 0
              ? p.selectedColours[0]
              : p.colourImages && p.colourImages.length > 0
              ? p.colourImages[0].colour
              : "";
          setSelectedColour(initialColour);

          // Initial size selection
          const initialSize =
            p.selectedSizes && p.selectedSizes.length > 0
              ? p.selectedSizes[0]
              : p.variants && p.variants.length > 0
              ? p.variants[0].size
              : "";
          setSelectedSize(initialSize);

          // Initial image
          setActiveImage(p.featuredImage || (p.images && p.images[0]) || "");
        } else {
          setError(data.message || "Failed to load product");
        }
      })
      .catch((err) => {
        setError(err.message || "Error loading product");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idOrSlug]);

  // Derive available colours
  const availableColours = useMemo(() => {
    if (!product) return [];
    if (product.colourImages && product.colourImages.length > 0) {
      return product.colourImages.map((c) => c.colour);
    }
    if (product.selectedColours && product.selectedColours.length > 0) {
      return product.selectedColours;
    }
    if (product.variants && product.variants.length > 0) {
      const set = new Set<string>();
      product.variants.forEach((v) => v.colour && set.add(v.colour));
      return Array.from(set);
    }
    return [];
  }, [product]);

  // Derive available sizes
  const availableSizes = useMemo(() => {
    if (!product) return [];
    if (product.selectedSizes && product.selectedSizes.length > 0) {
      return product.selectedSizes;
    }
    if (product.variants && product.variants.length > 0) {
      const set = new Set<string>();
      product.variants.forEach((v) => v.size && set.add(v.size));
      return Array.from(set);
    }
    return [];
  }, [product]);

  // Filter images for currently selected colour
  const displayedImages = useMemo(() => {
    if (!product) return [];
    if (selectedColour && product.colourImages && product.colourImages.length > 0) {
      const group = product.colourImages.find(
        (g) => g.colour.toLowerCase() === selectedColour.toLowerCase()
      );
      if (group && group.images && group.images.length > 0) {
        return group.images;
      }
    }
    // Fallback to overall gallery
    return product.images && product.images.length > 0
      ? product.images
      : product.featuredImage
      ? [product.featuredImage]
      : ["/homepage/casual_model1.jpg"];
  }, [product, selectedColour]);

  // Update active image when colour changes
  useEffect(() => {
    if (displayedImages.length > 0) {
      setActiveImage(displayedImages[0]);
    }
  }, [displayedImages]);

  // Find matching variant based on selected size + colour
  const matchedVariant = useMemo(() => {
    if (!product || !product.variants || product.variants.length === 0) return null;
    return (
      product.variants.find(
        (v) =>
          v.size.toLowerCase() === selectedSize.toLowerCase() &&
          v.colour.toLowerCase() === selectedColour.toLowerCase()
      ) ||
      product.variants.find((v) => v.size.toLowerCase() === selectedSize.toLowerCase()) ||
      product.variants[0]
    );
  }, [product, selectedSize, selectedColour]);

  // Current price, MRP, stock, and SKU
  const currentPrice = matchedVariant
    ? matchedVariant.sellingPrice || matchedVariant.mrp
    : product?.sellingPrice || (typeof product?.price === "number" ? product.price : 0) || 0;

  const currentMrp = matchedVariant ? matchedVariant.mrp : product?.mrp || 0;

  const currentStock = matchedVariant
    ? matchedVariant.stock
    : product?.stock !== undefined
    ? product.stock
    : product?.quantity || 0;

  const currentSku = matchedVariant
    ? matchedVariant.sku
    : product?.productCode || product?.sku || "SC-001";

  const isOutOfStock = currentStock <= 0;

  const discountPercent =
    currentMrp > currentPrice
      ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
      : 0;

  // Add to cart handler
  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const cartItem = {
      productId: product?._id,
      name: product?.productName || product?.title,
      variantId: matchedVariant?._id || null,
      sku: currentSku,
      size: selectedSize,
      colour: selectedColour,
      price: currentPrice,
      quantity,
      image: activeImage,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("sree_cart") || "[]");
      existing.push(cartItem);
      localStorage.setItem("sree_cart", JSON.stringify(existing));
    } catch {
      // LocalStorage fallback
    }

    setCartSuccess(`Added ${quantity} item(s) (${selectedSize} / ${selectedColour}) to Cart!`);
    setTimeout(() => setCartSuccess(null), 3500);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FCF8F2",
          fontFamily: "var(--font-serif)",
          color: "#5A2035",
          fontSize: "18px",
        }}
      >
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FCF8F2",
          gap: "16px",
          padding: "20px",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-serif)", color: "#5A2035", fontSize: "24px" }}>
          Product Not Found
        </h2>
        <p style={{ color: "#6B5A51", fontSize: "14px" }}>
          {error || "The product you are looking for is currently unavailable."}
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#BA8E43",
            color: "#FFFFFF",
            padding: "10px 24px",
            borderRadius: "9999px",
            fontWeight: 600,
            fontSize: "13px",
            textDecoration: "none",
          }}
        >
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FCF8F2", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* ── Top Navigation Bar ── */}
      <header
        style={{
          width: "100%",
          maxWidth: "1360px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#5A2035",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <FiArrowLeft size={16} /> Back to Catalog
        </Link>

        <img
          src="/homepage/logo2_trans.png"
          alt="Sree Collections"
          style={{ height: "48px", width: "auto", objectFit: "contain" }}
        />

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5A2035",
              display: "flex",
              alignItems: "center",
            }}
            title="Wishlist"
          >
            <FiHeart size={20} />
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5A2035",
              display: "flex",
              alignItems: "center",
            }}
            title="Share"
          >
            <FiShare2 size={20} />
          </button>
        </div>
      </header>

      {/* ── Breadcrumbs ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "1360px",
          margin: "0 auto 24px auto",
          padding: "0 24px",
          fontSize: "12px",
          color: "#8C7A6B",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ color: "#8C7A6B", textDecoration: "none" }}>
          Home
        </Link>
        <span>›</span>
        <span>{product.categoryName || (typeof product.category === "string" ? product.category : "Category")}</span>
        {product.subCategory && (
          <>
            <span>›</span>
            <span>{product.subCategory}</span>
          </>
        )}
        <span>›</span>
        <span style={{ color: "#5A2035", fontWeight: 600 }}>{product.productName || product.title}</span>
      </div>

      {/* ── Success Cart Toast Banner ── */}
      {cartSuccess && (
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto 24px auto",
            backgroundColor: "#DCFCE7",
            border: "1px solid #86EFAC",
            color: "#15803D",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <FiCheckCircle size={18} />
          <span>{cartSuccess}</span>
        </div>
      )}

      {/* ── Product Main Layout Grid ── */}
      <main
        style={{
          width: "100%",
          maxWidth: "1360px",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          boxSizing: "border-box",
        }}
        className="product-grid"
      >
        {/* Left Column: Variant-specific Image Gallery */}
        <div>
          {/* Main Hero Image */}
          <div
            style={{
              width: "100%",
              height: "540px",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "#FAF6F0",
              border: "1px solid #EFE8E0",
              position: "relative",
              boxShadow: "0 10px 30px rgba(90, 32, 53, 0.06)",
              marginBottom: "16px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.productName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.4s ease",
              }}
            />

            {/* Badges */}
            <div style={{ position: "absolute", top: 16, left: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {product.featured && (
                <span
                  style={{
                    backgroundColor: "#BA8E43",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Featured
                </span>
              )}
              {product.isNewArrival && (
                <span
                  style={{
                    backgroundColor: "#16A34A",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  New Arrival
                </span>
              )}
              {product.isBestSeller && (
                <span
                  style={{
                    backgroundColor: "#5A2035",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Best Seller
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails of currently selected colour */}
          {displayedImages.length > 1 && (
            <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
              {displayedImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: `2px solid ${activeImage === imgUrl ? "#BA8E43" : "#E2D7CB"}`,
                    padding: 0,
                    backgroundColor: "#FFFFFF",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "border-color 0.2s",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`Preview ${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing, Colour, Size, Add to Cart, Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Brand & Title */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 600,
                color: "#BA8E43",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "6px",
              }}
            >
              {product.brand || "Sree Collections Heritage"}
            </span>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 700,
                color: "#2F2C24",
                lineHeight: 1.2,
                margin: "0 0 8px 0",
              }}
            >
              {product.productName || product.title}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#8C7A6B" }}>
              <span>
                SKU: <strong style={{ color: "#5A2035" }}>{currentSku}</strong>
              </span>
              <span>•</span>
              <span>
                Category: <strong>{product.categoryName || product.category}</strong>
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div
            style={{
              padding: "16px 20px",
              backgroundColor: "#FAF6F0",
              borderRadius: "12px",
              border: "1px solid #EFE8E0",
              display: "flex",
              alignItems: "baseline",
              gap: "14px",
            }}
          >
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#5A2035" }}>
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>

            {currentMrp > currentPrice && (
              <span
                style={{
                  fontSize: "18px",
                  color: "#9CA3AF",
                  textDecoration: "line-through",
                  fontWeight: 500,
                }}
              >
                ₹{currentMrp.toLocaleString("en-IN")}
              </span>
            )}

            {discountPercent > 0 && (
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  backgroundColor: "#DCFCE7",
                  color: "#15803D",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                }}
              >
                {discountPercent}% OFF
              </span>
            )}

            <span style={{ fontSize: "11px", color: "#8C7A6B", marginLeft: "auto" }}>
              Inclusive of all taxes ({product.taxType || "GST 5%"})
            </span>
          </div>

          {/* Colour Selection (Updates Images dynamically!) */}
          {availableColours.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#2B1B20" }}>
                  Selected Colour: <span style={{ color: "#BA8E43" }}>{selectedColour}</span>
                </span>
                <span style={{ fontSize: "11px", color: "#8C7A6B" }}>
                  Images will switch on selection
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {availableColours.map((col) => {
                  const isSelected = selectedColour.toLowerCase() === col.toLowerCase();
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColour(col)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: isSelected ? "2px solid #5A2035" : "1px solid #D8C4AA",
                        backgroundColor: isSelected ? "#F1E6D6" : "#FFFFFF",
                        color: isSelected ? "#5A2035" : "#4B5563",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {col} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection (Updates Variant Price & Stock!) */}
          {availableSizes.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#2B1B20" }}>
                  Select Size: <span style={{ color: "#BA8E43" }}>{selectedSize}</span>
                </span>
                <span style={{ fontSize: "12px", color: "#5A2035", textDecoration: "underline", cursor: "pointer" }}>
                  Size Chart
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {availableSizes.map((sz) => {
                  const isSelected = selectedSize.toLowerCase() === sz.toLowerCase();
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        minWidth: "48px",
                        height: "42px",
                        padding: "0 14px",
                        borderRadius: "8px",
                        border: isSelected ? "2px solid #5A2035" : "1px solid #D8C4AA",
                        backgroundColor: isSelected ? "#5A2035" : "#FFFFFF",
                        color: isSelected ? "#FFFFFF" : "#2B1B20",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Availability indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: isOutOfStock ? "#DC2626" : currentStock <= 5 ? "#F59E0B" : "#16A34A",
              }}
            />
            {isOutOfStock ? (
              <span style={{ color: "#DC2626", fontWeight: 700 }}>Out of Stock</span>
            ) : currentStock <= 5 ? (
              <span style={{ color: "#D97706", fontWeight: 600 }}>Only {currentStock} left in stock - order soon!</span>
            ) : (
              <span style={{ color: "#16A34A", fontWeight: 600 }}>In Stock ({currentStock} available)</span>
            )}
          </div>

          {/* Quantity and Add to Cart Row */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "10px" }}>
            {/* Quantity Selector */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid #D8C4AA",
                borderRadius: "8px",
                backgroundColor: "#FFFFFF",
                height: "46px",
              }}
            >
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                style={{
                  width: "36px",
                  height: "100%",
                  border: "none",
                  background: "transparent",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "#5A2035",
                }}
              >
                -
              </button>
              <span style={{ width: "36px", textAlign: "center", fontWeight: 700, fontSize: "14px" }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                disabled={quantity >= currentStock || isOutOfStock}
                style={{
                  width: "36px",
                  height: "100%",
                  border: "none",
                  background: "transparent",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "#5A2035",
                }}
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                flex: 1,
                height: "46px",
                borderRadius: "9999px",
                border: "none",
                backgroundColor: isOutOfStock ? "#D1D5DB" : "#BA8E43",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: isOutOfStock ? "none" : "0 4px 14px rgba(186, 142, 67, 0.35)",
                transition: "all 0.2s",
              }}
            >
              <FiShoppingBag size={18} />
              <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </button>
          </div>

          {/* Assurances */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              padding: "16px",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #EFE8E0",
              marginTop: "8px",
              textAlign: "center",
            }}
          >
            <div>
              <FiTruck size={20} color="#BA8E43" style={{ margin: "0 auto 4px auto" }} />
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#2B1B20" }}>Express Shipping</div>
              <div style={{ fontSize: "11px", color: "#8C7A6B" }}>Delivered in 2-4 days</div>
            </div>
            <div>
              <FiRotateCcw size={20} color="#BA8E43" style={{ margin: "0 auto 4px auto" }} />
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#2B1B20" }}>7-Day Returns</div>
              <div style={{ fontSize: "11px", color: "#8C7A6B" }}>Hassle-free exchange</div>
            </div>
            <div>
              <FiShield size={20} color="#BA8E43" style={{ margin: "0 auto 4px auto" }} />
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#2B1B20" }}>100% Authentic</div>
              <div style={{ fontSize: "11px", color: "#8C7A6B" }}>Handcrafted purity</div>
            </div>
          </div>

          {/* Description & Specifications Tabs/Sections */}
          <div style={{ borderTop: "1px solid #E2D7CB", paddingTop: "20px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "#5A2035", marginBottom: "8px" }}>
              Product Story & Details
            </h3>
            <p style={{ fontSize: "13.5px", color: "#4B5563", lineHeight: 1.6, margin: "0 0 16px 0" }}>
              {product.description || "Crafted with royal elegance and impeccable finishing for weddings and festive occasions."}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12.5px" }}>
              {product.fabric && (
                <div>
                  <strong style={{ color: "#5A2035" }}>Fabric: </strong>
                  <span style={{ color: "#4B5563" }}>{product.fabric}</span>
                </div>
              )}
              {product.careInstructions && (
                <div>
                  <strong style={{ color: "#5A2035" }}>Care: </strong>
                  <span style={{ color: "#4B5563" }}>{product.careInstructions}</span>
                </div>
              )}
              {product.specifications && (
                <div>
                  <strong style={{ color: "#5A2035" }}>Specs: </strong>
                  <span style={{ color: "#4B5563" }}>{product.specifications}</span>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <strong style={{ color: "#5A2035" }}>Dimensions: </strong>
                  <span style={{ color: "#4B5563" }}>{product.dimensions}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @media (max-width: 900px) {
          .product-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}
