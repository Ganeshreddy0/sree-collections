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
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF6EE",
        overflowX: "hidden",
      }}
    >
      {cartSuccess && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            backgroundColor: "#5D2030",
            color: "#FFF",
            padding: "14px 22px",
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
          }}
        >
          <FiCheckCircle size={18} color="#BB8E43" />
          <span>{cartSuccess}</span>
        </div>
      )}

      {/* HEADER */}
      <header
        style={{
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          zIndex: 50,
          position: "relative",
        }}
      >
        <a href="/" style={{ display: "inline-block", flexShrink: 0 }}>
          <img
            src="/homepage/logo2_trans.png"
            alt="Sree Collections"
            style={{ height: 68, width: "auto", objectFit: "contain" }}
          />
        </a>
        <nav
          className="pdp-desktop-nav"
          style={{ display: "none", alignItems: "center", gap: 36 }}
        >
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/categories" active>
            Categories
          </NavLink>
          <a
            href="/contact"
            style={{
              backgroundColor: "#BB8E43",
              color: "#FFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              padding: "12px 28px",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Contact Us
          </a>
          <button
            aria-label="Search"
            style={{
              color: "#5A2035",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FiSearch size={22} />
          </button>
          <a
            href="/cart"
            aria-label="Cart"
            style={{
              color: "#5A2035",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiShoppingCart size={22} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -7,
                  right: -9,
                  backgroundColor: "#BB8E43",
                  color: "#FFF",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </a>
        </nav>
        {/* Mobile Right Actions: Cart + Hamburger */}
        <div
          className="mobile-header-actions"
          style={{
            display: "none",
            alignItems: "center",
            gap: 8,
          }}
        >
          <a
            href="/cart"
            aria-label="Cart"
            style={{
              color: "#5A2035",
              position: "relative",
              display: "flex",
              alignItems: "center",
              padding: "6px",
            }}
          >
            <FiShoppingCart size={21} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -4,
                  backgroundColor: "#BB8E43",
                  color: "#FFF",
                  borderRadius: "50%",
                  width: 17,
                  height: 17,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </a>
          <button
            className="pdp-hamburger mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              color: "#5A2035",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
            }}
          >
            {mobileMenuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 200,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: 280,
              height: "100%",
              backgroundColor: "#FCF8F2",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ alignSelf: "flex-end", background: "none", border: "none" }}
            >
              <FiX size={22} />
            </button>
            <a href="/">Home</a>
            <a href="/categories">Categories</a>
            <a href="/cart">Cart</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      )}

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
        <span style={{ color: "#5D2030", fontWeight: 600 }}>
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
        <div>
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
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 14,
                  background: "rgba(93,32,48,0.85)",
                  color: "#FFF",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {selectedColour}
              </span>
            )}
          </div>

          {thumbnails.length > 1 && (
            <div
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ color: "#BB8E43", fontSize: 16, letterSpacing: 2 }}>
                ★★★★★
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#5D2030",
                }}
              >
                5.00 Rating
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FiCheckCircle
                size={16}
                color={isOutOfStock ? "#DC2626" : "#16A34A"}
              />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 14,
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
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 14,
              lineHeight: 1.65,
              color: "#756658",
              margin: "0 0 24px 0",
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
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 26,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#5D2030",
                  marginBottom: 8,
                }}
              >
                Quantity
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid #D6C8B8",
                  borderRadius: 4,
                  overflow: "hidden",
                  backgroundColor: "#FAF6EE",
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  style={{
                    width: 36,
                    height: 36,
                    background: "none",
                    border: "none",
                    fontSize: 16,
                    color: "#5D2030",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
                <span
                  style={{
                    width: 40,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 600,
                    fontSize: 15,
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
                  style={{
                    width: 36,
                    height: 36,
                    background: "none",
                    border: "none",
                    fontSize: 16,
                    color: "#5D2030",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: 36,
                  lineHeight: 1,
                  color: "#5D2030",
                }}
              >
                {formatInr(currentPrice)}
              </div>
              {currentMrp > currentPrice && (
                <div
                  style={{
                    fontSize: 14,
                    color: "#9CA3AF",
                    textDecoration: "line-through",
                    marginTop: 4,
                  }}
                >
                  {formatInr(currentMrp)}
                </div>
              )}
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 12,
                  color: "#8E7F73",
                  marginTop: 4,
                }}
              >
                {taxLabel} included
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={{
              width: "100%",
              height: 54,
              borderRadius: 999,
              backgroundColor: isOutOfStock ? "#D1D5DB" : "#BB8E43",
              color: "#FFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: 16,
              border: "none",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
              boxShadow: isOutOfStock
                ? "none"
                : "0 6px 18px rgba(187,142,67,0.3)",
              marginBottom: 32,
            }}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>

          {/* Sizes — does not change gallery */}
          {availableSizes.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: "0 0 14px 0",
                }}
              >
                Select Size
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                  maxWidth: 420,
                }}
              >
                {availableSizes.map((s) => {
                  const active = selectedSize.toLowerCase() === s.toLowerCase();
                  const available = isComboAvailable(s, selectedColour);
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={!available}
                      onClick={() => handleSizeSelect(s)}
                      style={
                        active
                          ? {
                              backgroundColor: "#BB8E43",
                              color: "#FFF",
                              borderRadius: 999,
                              padding: "8px 24px",
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontWeight: 700,
                              fontSize: 15,
                              border: "none",
                              cursor: "pointer",
                              boxShadow: "0 3px 10px rgba(187,142,67,0.25)",
                            }
                          : {
                              background: "none",
                              border: "none",
                              color: available ? "#5D2030" : "#9CA3AF",
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontWeight: 600,
                              fontSize: 15,
                              cursor: available ? "pointer" : "not-allowed",
                              padding: "8px 12px",
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
            <div style={{ marginBottom: 26 }}>
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#5D2030",
                  margin: "0 0 14px 0",
                }}
              >
                Colours
                {selectedColour && (
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#BB8E43",
                      marginLeft: 10,
                    }}
                  >
                    {selectedColour}
                  </span>
                )}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
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
                      type="button"
                      aria-label={c}
                      title={c}
                      onClick={() => handleColourSelect(c)}
                      style={{
                        width: 60,
                        height: 36,
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
                        transform: active ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
                  margin: "10px 0 0",
                  fontSize: 12,
                  color: "#8A796B",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Selecting a colour updates the product images instantly
              </p>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 20,
              borderTop: "1px solid #E6D8C8",
              marginTop: 10,
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
                fontSize: 14,
                color: "#5D2030",
              }}
            >
              <FiTruck size={18} />
              <span>Easy Return</span>
            </div>
            <button
              type="button"
              onClick={() => setWishlistActive((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 14,
                color: "#5D2030",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FiHeart
                size={18}
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
          margin: "0 auto 60px",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "start",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            backgroundColor: "#EFE1BC",
            borderRadius: 16,
            border: "1px solid rgba(93,32,48,0.5)",
            padding: "24px 28px",
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
              style={{
                borderBottom:
                  i < arr.length - 1 ? "1px solid rgba(93,32,48,0.5)" : "none",
                padding: i === 0 ? "0 0 16px" : "16px 0",
              }}
            >
              <button
                type="button"
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
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#5D2030",
                    margin: 0,
                  }}
                >
                  {section.title}
                </h3>
                <span style={{ fontSize: 18, color: "#5D2030", fontWeight: 700 }}>
                  {section.open ? "—" : "+"}
                </span>
              </button>
              {section.open && (
                <div
                  style={{
                    marginTop: 12,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14,
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

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              backgroundColor: "#EFE1BC",
              borderRadius: 16,
              border: "1px solid rgba(93,32,48,0.5)",
              padding: "24px 28px",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 12px 0",
              }}
            >
              {materialTitle.split(" ").slice(0, 3).join(" ")}
            </h3>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 14,
                lineHeight: 1.65,
                color: "#5D2030",
                margin: "0 0 16px 0",
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {defaultTags.map((t) => (
                <span
                  key={t}
                  style={{
                    background: "#FFF",
                    color: "#5D2030",
                    borderRadius: 999,
                    padding: "6px 14px",
                    fontSize: 12,
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
            style={{
              backgroundColor: "#EFE1BC",
              borderRadius: 16,
              border: "1px solid rgba(93,32,48,0.5)",
              padding: "24px 28px",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#5D2030",
                margin: "0 0 12px 0",
              }}
            >
              Return Policy
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 14,
                lineHeight: 1.7,
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
                  <li key={line}>{line.replace(/^[-•]\s*/, "")}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: 1440,
            margin: "0 auto 80px",
            padding: "0 40px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 36,
                fontWeight: 700,
                color: "#5D2030",
                margin: 0,
              }}
            >
              You May Also Like
            </h2>
            <a
              href={`/categories?category=${encodeURIComponent(categoryName)}`}
              style={{
                backgroundColor: "#BB8E43",
                color: "#FFF",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: 14,
                padding: "12px 28px",
                borderRadius: 999,
                textDecoration: "none",
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
              gap: 24,
            }}
          >
            {related.map((r) => (
              <a
                key={r.id}
                href={`/products/${r.id}`}
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 16,
                  border: "1.5px solid #E3D7C5",
                  padding: 12,
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <div
                  style={{
                    height: 220,
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: "#F5EFE5",
                    marginBottom: 10,
                  }}
                >
                  <img
                    src={r.image}
                    alt={r.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 600,
                    fontSize: 16,
                    color: "#5D2030",
                    marginBottom: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {r.name}
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: 15,
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

      <style>{`
        @media (min-width: 992px) {
          .pdp-desktop-nav { display: flex !important; }
          .mobile-header-actions { display: none !important; }
        }
        @media (max-width: 991px) {
          .pdp-desktop-nav { display: none !important; }
          .mobile-header-actions { display: flex !important; }
          .pdp-hamburger { display: flex !important; }
          .pdp-showcase { grid-template-columns: 1fr !important; gap: 28px !important; padding: 0 20px !important; }
          .pdp-details { grid-template-columns: 1fr !important; padding: 0 20px !important; }
          .pdp-related { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .pdp-related { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
