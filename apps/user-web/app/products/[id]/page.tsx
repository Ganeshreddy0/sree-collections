"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCheckCircle,
  FiTruck,
  FiHeart,
  FiCheck,
} from "react-icons/fi";
import { FaFacebookF, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { API_BASE } from "@/lib/config";

interface Variant {
  _id?: string;
  sku: string;
  size: string;
  colour: string;
  mrp: number;
  sellingPrice: number;
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
  description: string;
  productType: "Single Product" | "Variable Product";
  mrp: number;
  sellingPrice: number;
  price?: number | string;
  taxType?: string;
  taxRate?: number;
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
  attributes?: {
    size?: string;
    colour?: string;
    weight?: string;
    pattern?: string;
    style?: string;
    material?: string;
  };
}

interface RelatedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
}

const COLOUR_HEX: Record<string, string> = {
  maroon: "#6B2433",
  red: "#C0392B",
  black: "#1A1A1A",
  "dark gray": "#3D3D3D",
  gray: "#6B7280",
  grey: "#6B7280",
  olive: "#556B2F",
  green: "#1E7B34",
  teal: "#0F766E",
  pink: "#C02670",
  magenta: "#C02670",
  gold: "#C9A227",
  blue: "#1F4E79",
  navy: "#1B2A4A",
  white: "#F5F5F5",
  cream: "#F5E6C8",
  beige: "#D4C4A8",
  yellow: "#E1B12C",
  purple: "#6C3483",
  orange: "#E67E22",
  brown: "#6B3E26",
};

function colourToHex(name: string): string {
  const key = name.toLowerCase().trim();
  if (COLOUR_HEX[key]) return COLOUR_HEX[key];
  for (const [k, hex] of Object.entries(COLOUR_HEX)) {
    if (key.includes(k)) return hex;
  }
  return "#BB8E43";
}

function formatInr(amount: number): string {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

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
      }}
    >
      {children}
    </a>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const idOrSlug = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedColour, setSelectedColour] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartSuccess, setCartSuccess] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistActive, setWishlistActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [fittingOpen, setFittingOpen] = useState(false);
  const [fabricOpen, setFabricOpen] = useState(true);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("sree_cart") || "[]");
      if (Array.isArray(stored)) {
        setCartCount(stored.reduce((s: number, i: any) => s + (i.quantity || 1), 0));
      }
    } catch {
      /* ignore */
    }
  }, [cartSuccess]);

  useEffect(() => {
    if (!idOrSlug) return;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/products/${idOrSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        if (!data.success || !data.data) {
          throw new Error(data.message || "Failed to load product");
        }
        const p: Product = data.data;
        setProduct(p);

        const initialColour =
          p.selectedColours?.[0] ||
          p.colourImages?.[0]?.colour ||
          p.attributes?.colour ||
          "";
        setSelectedColour(initialColour);

        const initialSize =
          p.selectedSizes?.[0] ||
          p.variants?.find((v) => v.size)?.size ||
          p.attributes?.size ||
          "";
        setSelectedSize(initialSize);

        const cat = p.categoryName || (typeof p.category === "string" ? p.category : "");
        if (cat) {
          fetch(
            `${API_BASE}/products?status=Active&category=${encodeURIComponent(cat)}&limit=8`
          )
            .then((r) => r.json())
            .then((json) => {
              const items = (json.data || json.products || [])
                .filter((x: any) => String(x.id || x._id) !== String(p._id))
                .slice(0, 4)
                .map((x: any) => ({
                  id: String(x.id || x._id),
                  name: x.productName || x.name || "Product",
                  price: formatInr(Number(x.sellingPrice) || Number(x.rawPrice) || 0),
                  image:
                    x.featuredImage ||
                    x.image ||
                    x.img ||
                    (Array.isArray(x.images) && x.images[0]) ||
                    "/Categories/product_formal_shirt.jpg",
                }));
              setRelated(items);
            })
            .catch(() => setRelated([]));
        }
      })
      .catch((err) => setError(err.message || "Error loading product"))
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const availableColours = useMemo(() => {
    if (!product) return [] as string[];
    if (product.colourImages?.length) {
      return product.colourImages.map((c) => c.colour);
    }
    if (product.selectedColours?.length) return product.selectedColours;
    if (product.variants?.length) {
      return Array.from(
        new Set(product.variants.map((v) => v.colour).filter(Boolean))
      );
    }
    if (product.attributes?.colour) return [product.attributes.colour];
    return [];
  }, [product]);

  const availableSizes = useMemo(() => {
    if (!product) return [] as string[];
    if (product.selectedSizes?.length) return product.selectedSizes;
    if (product.variants?.length) {
      return Array.from(
        new Set(product.variants.map((v) => v.size).filter(Boolean))
      );
    }
    if (product.attributes?.size) return [product.attributes.size];
    return [];
  }, [product]);

  /** Gallery for selected colour only — never mix colours */
  const displayedImages = useMemo(() => {
    if (!product) return [] as string[];

    if (selectedColour && product.colourImages?.length) {
      const group = product.colourImages.find(
        (g) => g.colour.toLowerCase() === selectedColour.toLowerCase()
      );
      if (group) {
        const imgs = Array.isArray(group.images) ? [...group.images] : [];
        if (group.primaryImage) {
          return [group.primaryImage, ...imgs.filter((u) => u !== group.primaryImage)];
        }
        if (imgs.length) return imgs;
      }
    }

    if (product.images?.length) return product.images;
    if (product.featuredImage) return [product.featuredImage];
    return ["/Categories/product_formal_shirt.jpg"];
  }, [product, selectedColour]);

  // Colour change → swap main image + thumbnails immediately
  useEffect(() => {
    if (displayedImages.length > 0) {
      setActiveImage(displayedImages[0]);
    }
  }, [displayedImages]);

  const findVariant = (size: string, colour: string): Variant | null => {
    if (!product?.variants?.length) return null;
    const sizeL = (size || "").toLowerCase();
    const colourL = (colour || "").toLowerCase();

    if (sizeL && colourL) {
      const exact = product.variants.find(
        (v) =>
          (v.size || "").toLowerCase() === sizeL &&
          (v.colour || "").toLowerCase() === colourL
      );
      if (exact) return exact;
    }
    if (colourL && !sizeL) {
      return (
        product.variants.find((v) => (v.colour || "").toLowerCase() === colourL) ||
        null
      );
    }
    if (sizeL && !colourL) {
      return (
        product.variants.find((v) => (v.size || "").toLowerCase() === sizeL) || null
      );
    }
    return null;
  };

  const isComboAvailable = (size: string, colour: string): boolean => {
    if (!product?.variants?.length) return true;
    const v = findVariant(size, colour);
    if (!v) return false;
    return v.isActive !== false && Number(v.stock) > 0;
  };

  // When colour changes, keep size if still available
  useEffect(() => {
    if (!product?.variants?.length || !selectedColour || !availableSizes.length) return;
    if (isComboAvailable(selectedSize, selectedColour)) return;
    const next = availableSizes.find((sz) => isComboAvailable(sz, selectedColour));
    if (next) setSelectedSize(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColour, product]);

  const matchedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return findVariant(selectedSize, selectedColour);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, selectedSize, selectedColour]);

  const currentPrice = matchedVariant
    ? matchedVariant.sellingPrice || matchedVariant.mrp
    : product?.sellingPrice ||
      (typeof product?.price === "number" ? product.price : 0) ||
      0;

  const currentMrp = matchedVariant ? matchedVariant.mrp : product?.mrp || 0;

  const currentStock = matchedVariant
    ? Number(matchedVariant.stock) || 0
    : product?.productType === "Variable Product" && product.variants?.length
    ? 0
    : product?.stock !== undefined
    ? product.stock
    : product?.quantity || 0;

  const currentSku = matchedVariant
    ? matchedVariant.sku
    : product?.productCode || product?.sku || "";

  const comboUnavailable =
    product?.productType === "Variable Product" &&
    Boolean(product.variants?.length) &&
    (!matchedVariant || matchedVariant.isActive === false);

  const isOutOfStock = comboUnavailable || currentStock <= 0;

  const taxLabel = product?.taxType || "GST 5%";

  const handleColourSelect = (colour: string) => {
    setSelectedColour(colour);
    // Gallery updates via displayedImages → useEffect
  };

  const handleSizeSelect = (size: string) => {
    if (!isComboAvailable(size, selectedColour) && product?.variants?.length) return;
    setSelectedSize(size);
    // Size must NOT change the colour gallery
  };

  const buildCartItem = () => ({
    productId: product?._id,
    id: product?._id,
    name: product?.productName || product?.title,
    variantId: matchedVariant?._id || null,
    sku: currentSku,
    size: selectedSize || "",
    colour: selectedColour || "",
    price: currentPrice,
    quantity,
    image: activeImage || product?.featuredImage || "",
    category: product?.categoryName || product?.category || "",
  });

  const mergeIntoCart = (cartItem: ReturnType<typeof buildCartItem>) => {
    const existing = JSON.parse(localStorage.getItem("sree_cart") || "[]");
    if (!Array.isArray(existing)) {
      localStorage.setItem("sree_cart", JSON.stringify([cartItem]));
      return;
    }
    const idx = existing.findIndex((item: any) => {
      if (cartItem.variantId && item.variantId) {
        return String(item.variantId) === String(cartItem.variantId);
      }
      return (
        String(item.productId || item.id) === String(cartItem.productId) &&
        String(item.size || "") === String(cartItem.size || "") &&
        String(item.colour || "") === String(cartItem.colour || "")
      );
    });
    if (idx >= 0) {
      existing[idx].quantity = (existing[idx].quantity || 1) + cartItem.quantity;
      existing[idx].price = cartItem.price;
      existing[idx].image = cartItem.image;
      existing[idx].variantId = cartItem.variantId;
    } else {
      existing.push(cartItem);
    }
    localStorage.setItem("sree_cart", JSON.stringify(existing));
  };

  const handleAddToCart = () => {
    if (isOutOfStock || !product) return;
    try {
      mergeIntoCart(buildCartItem());
    } catch {
      /* ignore */
    }
    const label = [selectedSize, selectedColour].filter(Boolean).join(" / ");
    setCartSuccess(
      label
        ? `Added ${quantity} × ${product.productName} (${label}) to cart`
        : `Added ${quantity} × ${product.productName} to cart`
    );
    setTimeout(() => setCartSuccess(null), 3200);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF6EE",
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "#5D2030",
          fontSize: 18,
        }}
      >
        Loading product details…
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
          backgroundColor: "#FAF6EE",
          gap: 16,
          padding: 24,
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#5D2030",
            fontSize: 24,
            margin: 0,
          }}
        >
          Product Not Found
        </h2>
        <p style={{ color: "#756658", fontSize: 14 }}>{error}</p>
        <Link
          href="/categories"
          style={{
            background: "#BB8E43",
            color: "#FFF",
            padding: "10px 24px",
            borderRadius: 999,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  const categoryName =
    product.categoryName ||
    (typeof product.category === "string" ? product.category : "Category");
  const thumbnails = displayedImages.slice(0, 6);
  const materialTitle =
    product.fabric || product.attributes?.material || product.brand || "Product";
  const tagPills = (product.tags || []).slice(0, 3);
  const defaultTags =
    tagPills.length > 0
      ? tagPills
      : ["Premium Quality", "Handpicked", "Easy Care"].slice(0, 3);

  return (
    <div
      className="pdp-page-container"
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF6EE",
        overflowX: "hidden",
      }}
    >
      {cartSuccess && (
        <div
          className="pdp-toast"
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            backgroundColor: "#5D2030",
            color: "#FFF",
            padding: "12px 20px",
            borderRadius: 12,
            border: "1.5px solid #BB8E43",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 14,
            fontWeight: 600,
            maxWidth: 360,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          }}
        >
          <FiCheckCircle size={18} color="#BB8E43" style={{ flexShrink: 0 }} />
          <span>{cartSuccess}</span>
        </div>
      )}

      {/* Global SiteHeader is handled by layout.tsx */}

      {/* BREADCRUMBS */}
      <div
        className="pdp-breadcrumbs"
        style={{
          width: "100%",
          maxWidth: 1440,
          margin: "16px auto 28px",
          padding: "0 40px",
          boxSizing: "border-box",
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 14,
          color: "#8A796B",
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link href="/categories" style={{ color: "#8A796B", textDecoration: "none" }}>
          Categories
        </Link>
        <span>/</span>
        <Link
          href={`/categories?category=${encodeURIComponent(categoryName)}`}
          style={{ color: "#8A796B", textDecoration: "none" }}
        >
          {categoryName}
        </Link>
        <span>/</span>
        <span
          className="pdp-breadcrumb-active"
          style={{
            color: "#5D2030",
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.productName || product.title}
        </span>
      </div>

      {/* PRODUCT SHOWCASE */}
      <div
        className="pdp-showcase"
        style={{
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto 60px",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 54,
          alignItems: "start",
          boxSizing: "border-box",
        }}
      >
        {/* Gallery */}
        <div className="pdp-gallery">
          <div
            className="pdp-main-img-box"
            style={{
              width: "100%",
              height: 560,
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: "#F5EFE5",
              boxShadow: "0 10px 30px rgba(93,32,48,0.06)",
              position: "relative",
            }}
          >
            <img
              key={activeImage}
              src={activeImage}
              alt={`${product.productName}${selectedColour ? ` - ${selectedColour}` : ""}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/Categories/product_formal_shirt.jpg";
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "opacity 0.25s ease",
              }}
            />
            {selectedColour && (
              <span
                className="pdp-colour-badge"
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 14,
                  background: "rgba(93,32,48,0.85)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  color: "#FFF",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: 999,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  letterSpacing: "0.3px",
                }}
              >
                {selectedColour}
              </span>
            )}
          </div>

          {thumbnails.length > 1 && (
            <div
              className="pdp-thumbnails"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(thumbnails.length, 3)}, 1fr)`,
                gap: 16,
                marginTop: 18,
              }}
            >
              {thumbnails.map((src, idx) => (
                <button
                  key={`${selectedColour}-${idx}-${src}`}
                  className="pdp-thumb-btn"
                  type="button"
                  onClick={() => setActiveImage(src)}
                  style={{
                    height: 128,
                    borderRadius: 12,
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      activeImage === src
                        ? "2px solid #BB8E43"
                        : "1.5px solid transparent",
                    backgroundColor: "#F5EFE5",
                    padding: 0,
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease, transform 0.2s ease",
                  }}
                >
                  <img
                    src={src}
                    alt={`${selectedColour || "Product"} view ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase info */}
        <div className="pdp-info-col" style={{ display: "flex", flexDirection: "column" }}>
          <h1
            className="pdp-title"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: 38,
              lineHeight: 1.2,
              color: "#5D2030",
              margin: "0 0 14px 0",
            }}
          >
            {product.productName || product.title}
          </h1>

          <div
            className="pdp-meta-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ color: "#BB8E43", fontSize: 15, letterSpacing: 1.5 }}>
                ★★★★★
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#5D2030",
                }}
              >
                5.00 Rating
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FiCheckCircle
                size={15}
                color={isOutOfStock ? "#DC2626" : "#16A34A"}
              />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: isOutOfStock ? "#DC2626" : "#16A34A",
                }}
              >
                {comboUnavailable
                  ? "Unavailable"
                  : isOutOfStock
                  ? "Out of Stock"
                  : currentStock <= 5
                  ? `Only ${currentStock} left`
                  : "In Stock"}
              </span>
            </div>
          </div>

          <p
            className="pdp-desc"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 14,
              lineHeight: 1.65,
              color: "#756658",
              margin: "0 0 20px 0",
            }}
          >
            {product.description?.trim() ||
              `${product.productName} from ${product.brand || "Sree Collections"}${
                product.fabric ? ` in ${product.fabric}` : ""
              }.${
                selectedColour ? ` Selected colour: ${selectedColour}.` : ""
              }`}
          </p>

          {currentSku && (
            <p
              className="pdp-sku"
              style={{
                fontSize: 12,
                color: "#8A796B",
                margin: "0 0 16px 0",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              SKU: <strong style={{ color: "#5D2030" }}>{currentSku}</strong>
            </p>
          )}

          {/* Qty + Price */}
          <div
            className="pdp-price-qty-box"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 24,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div className="pdp-qty-wrapper">
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#5D2030",
                  marginBottom: 6,
                }}
              >
                Quantity
              </div>
              <div
                className="pdp-qty-stepper"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid #D6C8B8",
                  borderRadius: 6,
                  overflow: "hidden",
                  backgroundColor: "#FAF6EE",
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  style={{
                    width: 36,
                    height: 36,
                    background: "none",
                    border: "none",
                    fontSize: 16,
                    color: "#5D2030",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  -
                </button>
                <span
                  style={{
                    width: 38,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#5D2030",
                    borderLeft: "1px solid #D6C8B8",
                    borderRight: "1px solid #D6C8B8",
                  }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(Math.max(currentStock, 1), q + 1)
                    )
                  }
                  disabled={isOutOfStock || quantity >= currentStock}
                  aria-label="Increase quantity"
                  style={{
                    width: 36,
                    height: 36,
                    background: "none",
                    border: "none",
                    fontSize: 16,
                    color: "#5D2030",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div className="pdp-price-wrapper" style={{ textAlign: "right" }}>
              <div
                className="pdp-price-text"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: 34,
                  lineHeight: 1,
                  color: "#5D2030",
                }}
              >
                {formatInr(currentPrice)}
              </div>
              {currentMrp > currentPrice && (
                <div
                  className="pdp-mrp-text"
                  style={{
                    fontSize: 13,
                    color: "#9CA3AF",
                    textDecoration: "line-through",
                    marginTop: 4,
                  }}
                >
                  {formatInr(currentMrp)}
                </div>
              )}
              <div
                className="pdp-tax-text"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 11,
                  color: "#8E7F73",
                  marginTop: 3,
                }}
              >
                {taxLabel} included
              </div>
            </div>
          </div>

          <button
            className="pdp-add-to-cart-btn"
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 999,
              backgroundColor: isOutOfStock ? "#D1D5DB" : "#BB8E43",
              color: "#FFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
              boxShadow: isOutOfStock
                ? "none"
                : "0 6px 18px rgba(187,142,67,0.3)",
              marginBottom: 26,
              transition: "transform 0.15s ease, filter 0.15s ease",
            }}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>

          {/* Sizes — does not change gallery */}
          {availableSizes.length > 0 && (
            <div className="pdp-options-section pdp-sizes-section" style={{ marginBottom: 24 }}>
              <h3
                className="pdp-options-title"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: "0 0 12px 0",
                }}
              >
                Select Size
              </h3>
              <div
                className="pdp-sizes-list"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                  maxWidth: 440,
                }}
              >
                {availableSizes.map((s) => {
                  const active = selectedSize.toLowerCase() === s.toLowerCase();
                  const available = isComboAvailable(s, selectedColour);
                  return (
                    <button
                      key={s}
                      className={`pdp-size-btn ${active ? "active" : ""}`}
                      type="button"
                      disabled={!available}
                      onClick={() => handleSizeSelect(s)}
                      style={
                        active
                          ? {
                              backgroundColor: "#BB8E43",
                              color: "#FFF",
                              borderRadius: 999,
                              padding: "7px 20px",
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontWeight: 700,
                              fontSize: 14,
                              border: "none",
                              cursor: "pointer",
                              boxShadow: "0 3px 10px rgba(187,142,67,0.25)",
                            }
                          : {
                              background: "none",
                              border: "1px solid #D6C8B8",
                              borderRadius: 999,
                              color: available ? "#5D2030" : "#9CA3AF",
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontWeight: 600,
                              fontSize: 14,
                              cursor: available ? "pointer" : "not-allowed",
                              padding: "6px 16px",
                              textDecoration: available ? "none" : "line-through",
                            }
                      }
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colours — switches gallery */}
          {availableColours.length > 0 && (
            <div className="pdp-options-section pdp-colours-section" style={{ marginBottom: 24 }}>
              <h3
                className="pdp-options-title"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: "0 0 12px 0",
                }}
              >
                Colours
                {selectedColour && (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#BB8E43",
                      marginLeft: 8,
                    }}
                  >
                    ({selectedColour})
                  </span>
                )}
              </h3>
              <div
                className="pdp-colours-list"
                style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
              >
                {availableColours.map((c) => {
                  const active =
                    selectedColour.toLowerCase() === c.toLowerCase();
                  const hex = colourToHex(c);
                  const light = ["white", "cream", "beige", "yellow", "gold"].some(
                    (x) => c.toLowerCase().includes(x)
                  );
                  return (
                    <button
                      key={c}
                      className={`pdp-colour-btn ${active ? "active" : ""}`}
                      type="button"
                      aria-label={c}
                      title={c}
                      onClick={() => handleColourSelect(c)}
                      style={{
                        width: 52,
                        height: 32,
                        borderRadius: 999,
                        backgroundColor: hex,
                        border: light ? "1.5px solid #D6C8B8" : "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: active
                          ? "0 4px 12px rgba(0,0,0,0.25)"
                          : "none",
                        transform: active ? "scale(1.06)" : "scale(1)",
                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      }}
                    >
                      {active && (
                        <FiCheck
                          size={14}
                          color={light ? "#5D2030" : "#FFFFFF"}
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 11,
                  color: "#8A796B",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Selecting a colour updates the product gallery
              </p>
            </div>
          )}

          <div
            className="pdp-trust-wishlist-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 16,
              borderTop: "1px solid #E6D8C8",
              marginTop: 6,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 13,
                color: "#5D2030",
              }}
            >
              <FiTruck size={17} />
              <span>Easy Return & Exchange</span>
            </div>
            <button
              type="button"
              onClick={() => setWishlistActive((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 13,
                color: "#5D2030",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FiHeart
                size={17}
                color={wishlistActive ? "#BB8E43" : "#5D2030"}
                fill={wishlistActive ? "#BB8E43" : "none"}
              />
              <span>{wishlistActive ? "Added to Wishlist" : "Add to Wishlist"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* DETAILS + SIDE BOXES */}
      <div
        className="pdp-details"
        style={{
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto 50px",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
          alignItems: "start",
          boxSizing: "border-box",
        }}
      >
        <div
          className="pdp-details-card pdp-accordion-card"
          style={{
            backgroundColor: "#EFE1BC",
            borderRadius: 16,
            border: "1px solid rgba(93,32,48,0.35)",
            padding: "20px 24px",
          }}
        >
          {[
            {
              key: "fitting",
              title: "Fitting",
              open: fittingOpen,
              set: setFittingOpen,
              body:
                product.dimensions ||
                product.attributes?.style ||
                "Designed for a comfortable, elegant drape suitable for everyday and festive wear.",
            },
            {
              key: "fabric",
              title: "Fabric & Care",
              open: fabricOpen,
              set: setFabricOpen,
              body: [
                product.fabric && `Fabric: ${product.fabric}`,
                product.attributes?.material &&
                  `Material: ${product.attributes.material}`,
                product.careInstructions && `Care: ${product.careInstructions}`,
              ]
                .filter(Boolean)
                .join("\n") ||
                "Follow the care label. Prefer dry clean for silk and embroidered pieces.",
            },
            {
              key: "detail",
              title: "Product Detail",
              open: productDetailOpen,
              set: setProductDetailOpen,
              body:
                product.specifications ||
                product.description ||
                `Brand: ${product.brand || "Sree Collections"}\nCode: ${product.productCode}`,
            },
            {
              key: "shipping",
              title: "Shipping And Return",
              open: shippingOpen,
              set: setShippingOpen,
              body:
                [product.shippingInfo, product.returnPolicy]
                  .filter(Boolean)
                  .join("\n\n") ||
                "Dispatched within 24–48 hours. Easy returns as per store policy. Colour-change requests are not accepted after dispatch.",
            },
          ].map((section, i, arr) => (
            <div
              key={section.key}
              className="pdp-accordion-item"
              style={{
                borderBottom:
                  i < arr.length - 1 ? "1px solid rgba(93,32,48,0.25)" : "none",
                padding: i === 0 ? "0 0 14px" : "14px 0",
              }}
            >
              <button
                type="button"
                className="pdp-accordion-header"
                onClick={() => section.set(!section.open)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: "4px 0",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#5D2030",
                    margin: 0,
                  }}
                >
                  {section.title}
                </h3>
                <span style={{ fontSize: 17, color: "#5D2030", fontWeight: 700 }}>
                  {section.open ? "—" : "+"}
                </span>
              </button>
              {section.open && (
                <div
                  className="pdp-accordion-body"
                  style={{
                    marginTop: 10,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#5D2030",
                    whiteSpace: "pre-line",
                  }}
                >
                  {section.body}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pdp-side-cards-col" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            className="pdp-details-card pdp-side-card"
            style={{
              backgroundColor: "#EFE1BC",
              borderRadius: 16,
              border: "1px solid rgba(93,32,48,0.35)",
              padding: "20px 24px",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 10px 0",
              }}
            >
              {materialTitle.split(" ").slice(0, 3).join(" ")}
            </h3>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13,
                lineHeight: 1.6,
                color: "#5D2030",
                margin: "0 0 14px 0",
              }}
            >
              {product.fabric
                ? `${product.fabric}${
                    product.careInstructions
                      ? `. ${product.careInstructions}`
                      : ""
                  }`
                : "A carefully selected piece from Sree Collections, made for comfort and lasting wear."}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {defaultTags.map((t) => (
                <span
                  key={t}
                  style={{
                    background: "#FFF",
                    color: "#5D2030",
                    borderRadius: 999,
                    padding: "5px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div
            className="pdp-details-card pdp-side-card"
            style={{
              backgroundColor: "#EFE1BC",
              borderRadius: 16,
              border: "1px solid rgba(93,32,48,0.35)",
              padding: "20px 24px",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 10px 0",
              }}
            >
              Return Policy
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13,
                lineHeight: 1.65,
                color: "#5D2030",
              }}
            >
              {(
                product.returnPolicy ||
                "Easy returns within the store window from delivery.\nNo returns or exchanges for colour-change preferences after dispatch.\nItems must be unused with original tags and packaging."
              )
                .split("\n")
                .filter(Boolean)
                .map((line) => (
                  <li key={line} style={{ marginBottom: 4 }}>{line.replace(/^[-•]\s*/, "")}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div
          className="pdp-related-section"
          style={{
            width: "100%",
            maxWidth: 1440,
            margin: "0 auto 70px",
            padding: "0 40px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="pdp-related-header"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <h2
              className="pdp-related-title"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 32,
                fontWeight: 700,
                color: "#5D2030",
                margin: 0,
              }}
            >
              You May Also Like
            </h2>
            <a
              href={`/categories?category=${encodeURIComponent(categoryName)}`}
              className="pdp-explore-btn"
              style={{
                backgroundColor: "#BB8E43",
                color: "#FFF",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: 13,
                padding: "10px 24px",
                borderRadius: 999,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Explore More
            </a>
          </div>
          <div
            className="pdp-related"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
            }}
          >
            {related.map((r) => (
              <a
                key={r.id}
                href={`/products/${r.id}`}
                className="pdp-related-card"
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 14,
                  border: "1.5px solid #E3D7C5",
                  padding: 10,
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  minWidth: 0,
                  boxSizing: "border-box",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div
                  className="pdp-related-img-box"
                  style={{
                    height: 200,
                    borderRadius: 10,
                    overflow: "hidden",
                    backgroundColor: "#F5EFE5",
                    marginBottom: 8,
                  }}
                >
                  <img
                    src={r.image}
                    alt={r.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div
                  className="pdp-related-name"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#5D2030",
                    marginBottom: 3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {r.name}
                </div>
                <div
                  className="pdp-related-price"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#5D2030",
                  }}
                >
                  {r.price}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div
        className="pdp-mobile-sticky-bar"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(250, 246, 238, 0.97)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderTop: "1px solid #E6D8C8",
          padding: "10px 16px",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          boxShadow: "0 -4px 18px rgba(93,32,48,0.08)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#5D2030",
                lineHeight: 1,
              }}
            >
              {formatInr(currentPrice)}
            </span>
            {currentMrp > currentPrice && (
              <span
                style={{
                  fontSize: 11,
                  color: "#9CA3AF",
                  textDecoration: "line-through",
                  lineHeight: 1,
                }}
              >
                {formatInr(currentMrp)}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#8E7F73",
              display: "flex",
              gap: 4,
              alignItems: "center",
              marginTop: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selectedSize && <span>Size: <strong style={{ color: "#5D2030" }}>{selectedSize}</strong></span>}
            {selectedSize && selectedColour && <span>•</span>}
            {selectedColour && <span>Color: <strong style={{ color: "#5D2030" }}>{selectedColour}</strong></span>}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          style={{
            backgroundColor: isOutOfStock ? "#D1D5DB" : "#BB8E43",
            color: "#FFF",
            border: "none",
            borderRadius: 999,
            padding: "10px 22px",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: isOutOfStock ? "not-allowed" : "pointer",
            boxShadow: isOutOfStock ? "none" : "0 3px 12px rgba(187,142,67,0.35)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

      <style>{`
        /* Desktop styles */
        @media (min-width: 992px) {
          .pdp-desktop-nav { display: flex !important; }
          .pdp-mobile-actions { display: none !important; }
          .pdp-mobile-sticky-bar { display: none !important; }
        }

        /* Mobile & Tablet responsive breakdown */
        @media (max-width: 991px) {
          .pdp-page-container {
            padding-bottom: 74px !important;
          }
          .pdp-desktop-nav { display: none !important; }
          .pdp-mobile-actions { display: flex !important; }

          .pdp-header {
            padding: 8px 14px !important;
          }
          .pdp-logo {
            height: 40px !important;
          }

          .pdp-breadcrumbs {
            margin: 6px auto 12px !important;
            padding: 0 14px !important;
            font-size: 11.5px !important;
            gap: 5px !important;
            white-space: nowrap !important;
            overflow-x: auto !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .pdp-breadcrumbs::-webkit-scrollbar {
            display: none !important;
          }
          .pdp-breadcrumb-active {
            max-width: 140px !important;
          }

          /* Main showcase grid */
          .pdp-showcase {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            padding: 0 14px !important;
            margin-bottom: 20px !important;
          }

          /* Product Gallery: constrain width & height to fit perfectly on mobile screen */
          .pdp-gallery {
            width: 100% !important;
            max-width: 320px !important;
            margin: 0 auto !important;
          }

          .pdp-main-img-box {
            width: 100% !important;
            max-width: 300px !important;
            height: clamp(210px, 58vw, 255px) !important;
            margin: 0 auto !important;
            border-radius: 14px !important;
          }

          .pdp-colour-badge {
            bottom: 8px !important;
            left: 8px !important;
            font-size: 11px !important;
            padding: 4px 10px !important;
          }

          /* Compact thumbnail strip */
          .pdp-thumbnails {
            display: flex !important;
            justify-content: center !important;
            overflow-x: auto !important;
            gap: 8px !important;
            margin-top: 8px !important;
            padding-bottom: 4px !important;
            scrollbar-width: none !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .pdp-thumbnails::-webkit-scrollbar {
            display: none !important;
          }
          .pdp-thumb-btn {
            flex: 0 0 50px !important;
            width: 50px !important;
            height: 50px !important;
            border-radius: 8px !important;
          }

          /* Product Details column */
          .pdp-info-col {
            width: 100% !important;
            max-width: 100% !important;
          }

          .pdp-title {
            font-size: clamp(20px, 5.2vw, 25px) !important;
            margin-bottom: 6px !important;
            line-height: 1.25 !important;
          }

          .pdp-meta-row {
            gap: 12px !important;
            margin-bottom: 8px !important;
          }

          .pdp-desc {
            font-size: 12.5px !important;
            line-height: 1.5 !important;
            margin-bottom: 10px !important;
          }

          .pdp-sku {
            font-size: 11px !important;
            margin-bottom: 8px !important;
          }

          .pdp-price-qty-box {
            margin-bottom: 12px !important;
            gap: 10px !important;
            align-items: center !important;
          }

          .pdp-qty-wrapper > div:first-child {
            font-size: 12.5px !important;
            margin-bottom: 4px !important;
          }

          .pdp-qty-stepper button {
            width: 32px !important;
            height: 32px !important;
            font-size: 15px !important;
          }

          .pdp-qty-stepper span {
            width: 32px !important;
            height: 32px !important;
            font-size: 13px !important;
          }

          .pdp-price-text {
            font-size: clamp(22px, 5.8vw, 26px) !important;
          }

          .pdp-mrp-text {
            font-size: 12px !important;
          }

          .pdp-tax-text {
            font-size: 10.5px !important;
          }

          .pdp-add-to-cart-btn {
            height: 44px !important;
            font-size: 14px !important;
            margin-bottom: 16px !important;
          }

          .pdp-options-section {
            margin-bottom: 14px !important;
          }
          .pdp-options-title {
            font-size: 14px !important;
            margin-bottom: 6px !important;
          }
          .pdp-size-btn {
            padding: 5px 13px !important;
            font-size: 12.5px !important;
          }
          .pdp-colour-btn {
            width: 40px !important;
            height: 28px !important;
          }

          .pdp-trust-wishlist-row {
            padding-top: 10px !important;
            margin-top: 4px !important;
            font-size: 11.5px !important;
          }

          /* Details and Accordion */
          .pdp-details {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            padding: 0 14px !important;
            margin-bottom: 22px !important;
          }
          .pdp-details-card {
            padding: 14px 14px !important;
            border-radius: 12px !important;
          }
          .pdp-details-card h3 {
            font-size: 15px !important;
          }
          .pdp-accordion-item {
            padding: 10px 0 !important;
          }
          .pdp-accordion-header h3 {
            font-size: 15px !important;
          }
          .pdp-accordion-body {
            font-size: 12px !important;
            line-height: 1.5 !important;
          }
          .pdp-side-card p, .pdp-side-card ul {
            font-size: 12px !important;
            line-height: 1.5 !important;
          }
          .pdp-side-card li {
            font-size: 12px !important;
            margin-bottom: 3px !important;
          }
          .pdp-side-card span {
            padding: 3px 9px !important;
            font-size: 10px !important;
          }

          /* Related Products: Matching Categories page reference */
          .pdp-related-section {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 16px !important;
            margin-bottom: 28px !important;
            box-sizing: border-box !important;
          }
          .pdp-related-header {
            margin-bottom: 12px !important;
          }
          .pdp-related-title {
            font-size: 20px !important;
          }
          .pdp-explore-btn {
            padding: 6px 14px !important;
            font-size: 11.5px !important;
          }
          .pdp-related {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .pdp-related-card {
            min-width: 0 !important;
            width: 100% !important;
            padding: 8px !important;
            border-radius: 12px !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
          .pdp-related-img-box {
            width: 100% !important;
            height: 160px !important;
            border-radius: 8px !important;
            margin-bottom: 6px !important;
            overflow: hidden !important;
          }
          .pdp-related-img-box img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            display: block !important;
          }
          .pdp-related-name {
            font-size: 13.5px !important;
            line-height: 18px !important;
            height: 18px !important;
            margin-bottom: 2px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .pdp-related-price {
            font-size: 13px !important;
          }

          /* Fixed Mobile Sticky Bar */
          .pdp-mobile-sticky-bar {
            display: flex !important;
            justify-content: space-between !important;
            padding: 8px 14px calc(8px + env(safe-area-inset-bottom, 0px)) !important;
          }

          /* Adjust Toast above mobile bar */
          .pdp-toast {
            bottom: 70px !important;
            left: 12px !important;
            right: 12px !important;
            max-width: calc(100% - 24px) !important;
            padding: 9px 14px !important;
            font-size: 12.5px !important;
          }
        }

        /* Screen compression (phones <= 640px matching Categories page) */
        @media (max-width: 640px) {
          .pdp-related-section {
            padding: 0 12px !important;
            margin-bottom: 24px !important;
          }
          .pdp-related {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .pdp-related-card {
            padding: 6px !important;
            border-radius: 10px !important;
          }
          .pdp-related-img-box {
            height: 130px !important;
            border-radius: 8px !important;
          }
          .pdp-related-name {
            font-size: 12px !important;
            line-height: 16px !important;
            height: 16px !important;
          }
          .pdp-related-price {
            font-size: 12px !important;
          }
        }

        /* Small screen compression (phones <= 480px) */
        @media (max-width: 480px) {
          .pdp-header {
            padding: 8px 10px !important;
          }
          .pdp-logo {
            height: 36px !important;
          }
          .pdp-breadcrumbs {
            padding: 0 10px !important;
            margin: 4px auto 8px !important;
          }
          .pdp-showcase {
            padding: 0 10px !important;
            gap: 10px !important;
          }
          .pdp-gallery {
            max-width: 270px !important;
          }
          .pdp-main-img-box {
            max-width: 260px !important;
            height: clamp(180px, 52vw, 225px) !important;
            border-radius: 12px !important;
          }
          .pdp-thumbnails {
            gap: 6px !important;
            margin-top: 6px !important;
          }
          .pdp-thumb-btn {
            flex: 0 0 42px !important;
            width: 42px !important;
            height: 42px !important;
            border-radius: 6px !important;
          }
          .pdp-title {
            font-size: 18px !important;
          }
          .pdp-details {
            padding: 0 10px !important;
          }
          .pdp-details-card {
            padding: 12px 10px !important;
          }
          .pdp-related-section {
            padding: 0 10px !important;
          }
          .pdp-mobile-sticky-bar {
            padding: 7px 10px calc(7px + env(safe-area-inset-bottom, 0px)) !important;
          }
        }

        /* Extra small screens (<= 380px matching Categories page) */
        @media (max-width: 380px) {
          .pdp-related {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }
          .pdp-related-card {
            padding: 5px !important;
            border-radius: 8px !important;
          }
          .pdp-related-img-box {
            height: 110px !important;
          }
          .pdp-gallery {
            max-width: 230px !important;
          }
          .pdp-main-img-box {
            max-width: 230px !important;
            height: 180px !important;
          }
          .pdp-thumb-btn {
            flex: 0 0 38px !important;
            width: 38px !important;
            height: 38px !important;
        }
      `}</style>
    </div>
  );
}
