"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiX,
  FiBox,
  FiTag,
  FiLayers,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit,
  FiInfo,
  FiStar,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";

export interface ProductVariantItem {
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

export interface ColourImageItem {
  colour: string;
  images: string[];
  primaryImage?: string;
}

export interface ProductDetailItem {
  id: string;
  _id?: string;
  code: string;
  productCode?: string;
  name: string;
  productName?: string;
  category: string;
  subCategory?: string;
  brand: string;
  price: string;
  rawPrice?: number;
  mrp?: number;
  sellingPrice?: number;
  unit: string;
  qty: number;
  quantity?: number;
  img: string;
  images?: string[];
  featuredImage?: string;
  colourImages?: ColourImageItem[];
  featured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  displayOrder?: number;
  isActive?: boolean;
  status?: string;
  sellingType?: string;
  productType?: string;
  taxType?: string;
  discountType?: string;
  discountValue?: number;
  discountPrice?: number;
  quantityAlert?: number;
  variantType?: string;
  variants?: ProductVariantItem[];
  selectedSizes?: string[];
  selectedColours?: string[];
  attributes?: {
    size?: string;
    colour?: string;
    weight?: string;
    pattern?: string;
    style?: string;
    material?: string;
    [key: string]: unknown;
  };
  fabric?: string;
  careInstructions?: string;
  specifications?: string;
  shippingInfo?: string;
  returnPolicy?: string;
  weight?: string;
  dimensions?: string;
  tags?: string[];
  description?: string;
  createdAt?: string;
}

interface ProductDetailModalProps {
  product: ProductDetailItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeColourTab, setActiveColourTab] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.img];
  const activeImage = selectedImage || images[0] || product.img;
  const isActive = product.isActive !== false && product.status !== "Inactive";

  // Attributes list
  const attrList: { label: string; value: string }[] = [];
  if (product.attributes && typeof product.attributes === "object") {
    Object.entries(product.attributes).forEach(([k, v]) => {
      if (v && typeof v === "string" && v.trim()) {
        attrList.push({
          label: k.charAt(0).toUpperCase() + k.slice(1),
          value: v,
        });
      }
    });
  }

  // Active colour images
  const colourGroups = product.colourImages || [];
  const currentColourGroup = activeColourTab
    ? colourGroups.find((c) => c.colour.toLowerCase() === activeColourTab.toLowerCase())
    : colourGroups[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(35, 23, 20, 0.55)",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          border: "1px solid #D8C4AA",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid #F3ECE2",
            backgroundColor: "#FDFAF5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "#F1E6D6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#541A28",
              }}
            >
              <FiBox size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#2B1B20", margin: 0 }}>
                  {product.name || product.productName}
                </h2>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    backgroundColor: isActive ? "#DCFCE7" : "#FEE2E2",
                    color: isActive ? "#15803D" : "#B91C1C",
                  }}
                >
                  {isActive ? <FiCheckCircle size={10} /> : <FiAlertCircle size={10} />}
                  {isActive ? "Active" : "Inactive"}
                </span>

                {/* Display Badges */}
                {product.featured && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: 700,
                      backgroundColor: "#FFF7ED",
                      color: "#C2410C",
                      border: "1px solid #FDBA74",
                    }}
                  >
                    <FiStar size={10} /> Featured
                  </span>
                )}
                {product.isBestSeller && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: 700,
                      backgroundColor: "#FEF9C3",
                      color: "#A16207",
                      border: "1px solid #FDE047",
                    }}
                  >
                    <FiTrendingUp size={10} /> Best Seller
                  </span>
                )}
                {product.isNewArrival && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: 700,
                      backgroundColor: "#F0FDF4",
                      color: "#15803D",
                      border: "1px solid #86EFAC",
                    }}
                  >
                    <FiAward size={10} /> New Arrival
                  </span>
                )}
              </div>
              <span style={{ fontSize: "12px", color: "#8C7A6B" }}>
                Code / SKU: <strong style={{ color: "#541A28" }}>{product.code || product.productCode}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#9CA3AF",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px" }}>
            {/* Left Column: Media & Stock */}
            <div>
              {/* Main Image */}
              <div
                style={{
                  width: "100%",
                  height: "240px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: "1px solid #EFE8E0",
                  backgroundColor: "#FAF6F0",
                  position: "relative",
                  marginBottom: 10,
                }}
              >
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 16 }}>
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 6,
                        overflow: "hidden",
                        border: `2px solid ${activeImage === imgUrl ? "#EE5F2B" : "#E5E7EB"}`,
                        padding: 0,
                        cursor: "pointer",
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      <Image src={imgUrl} alt="Thumb" fill style={{ objectFit: "cover" }} unoptimized />
                    </button>
                  ))}
                </div>
              )}

              {/* Stock & Inventory Card */}
              <div
                style={{
                  backgroundColor: "#FAF6F0",
                  borderRadius: "10px",
                  padding: "14px",
                  border: "1px solid #EFE8E0",
                  fontSize: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#6B5A51" }}>Current Stock:</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: product.qty <= (product.quantityAlert || 5) ? "#DC2626" : "#16A34A",
                    }}
                  >
                    {product.qty} {product.unit}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#6B5A51" }}>Stock Alert:</span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>
                    {product.quantityAlert || 5} {product.unit}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#6B5A51" }}>Selling Type:</span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>
                    {product.sellingType || "B2C"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6B5A51" }}>Product Type:</span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>
                    {product.productType || "Single Product"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing, Taxonomy, Variants, Specs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Pricing Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                  backgroundColor: "#FDFBF7",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  border: "1px solid #EFE8E0",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#8C7A6B", fontWeight: 600 }}>
                    Selling Price
                  </span>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#541A28", marginTop: 2 }}>
                    ₹{product.sellingPrice || product.rawPrice || product.price.replace(/[^0-9.]/g, "")}
                  </div>
                </div>

                {product.mrp ? (
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#8C7A6B", fontWeight: 600 }}>
                      MRP (Original)
                    </span>
                    <div style={{ fontSize: "16px", fontWeight: 600, color: "#9CA3AF", textDecoration: "line-through", marginTop: 4 }}>
                      ₹{product.mrp}
                    </div>
                  </div>
                ) : null}

                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#8C7A6B", fontWeight: 600 }}>
                    Tax Rate
                  </span>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginTop: 4 }}>
                    {product.taxType || "GST 5%"}
                  </div>
                </div>
              </div>

              {/* Taxonomy */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ padding: "10px 12px", borderRadius: 8, backgroundColor: "#FAF6F0", border: "1px solid #EFE8E0" }}>
                  <span style={{ fontSize: "11px", color: "#8C7A6B", display: "block" }}>Category</span>
                  <strong style={{ fontSize: "12px", color: "#3B2C24" }}>{product.category || "General"}</strong>
                </div>
                <div style={{ padding: "10px 12px", borderRadius: 8, backgroundColor: "#FAF6F0", border: "1px solid #EFE8E0" }}>
                  <span style={{ fontSize: "11px", color: "#8C7A6B", display: "block" }}>Subcategory</span>
                  <strong style={{ fontSize: "12px", color: "#3B2C24" }}>{product.subCategory || "None"}</strong>
                </div>
                <div style={{ padding: "10px 12px", borderRadius: 8, backgroundColor: "#FAF6F0", border: "1px solid #EFE8E0" }}>
                  <span style={{ fontSize: "11px", color: "#8C7A6B", display: "block" }}>Brand</span>
                  <strong style={{ fontSize: "12px", color: "#3B2C24" }}>{product.brand || "---"}</strong>
                </div>
              </div>

              {/* Variants Table if present */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#3B2C24", marginBottom: 6, display: "block" }}>
                    Variants ({product.variants.length})
                  </span>
                  <div style={{ maxHeight: 160, overflowY: "auto", border: "1px solid #E2D7CB", borderRadius: 6 }}>
                    <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#FAF6F0", borderBottom: "1px solid #E2D7CB", textAlign: "left" }}>
                          <th style={{ padding: "6px 10px" }}>SKU</th>
                          <th style={{ padding: "6px 10px" }}>Size/Colour</th>
                          <th style={{ padding: "6px 10px" }}>Price</th>
                          <th style={{ padding: "6px 10px" }}>Stock</th>
                          <th style={{ padding: "6px 10px" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.variants.map((v, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #F3ECE2" }}>
                            <td style={{ padding: "6px 10px", fontWeight: 600 }}>{v.sku}</td>
                            <td style={{ padding: "6px 10px" }}>{v.colour} / {v.size}</td>
                            <td style={{ padding: "6px 10px", color: "#541A28", fontWeight: 700 }}>₹{v.sellingPrice || v.mrp}</td>
                            <td style={{ padding: "6px 10px" }}>{v.stock}</td>
                            <td style={{ padding: "6px 10px", color: v.isActive ? "#16A34A" : "#9CA3AF" }}>
                              {v.isActive ? "Active" : "Disabled"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Per-Colour Images Tab */}
              {colourGroups.length > 0 && (
                <div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#3B2C24", marginBottom: 6, display: "block" }}>
                    Per-Colour Image Galleries
                  </span>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    {colourGroups.map((cg) => (
                      <button
                        key={cg.colour}
                        type="button"
                        onClick={() => setActiveColourTab(cg.colour)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "1px solid #D8C4AA",
                          background:
                            (activeColourTab || colourGroups[0]?.colour) === cg.colour ? "#541A28" : "#FAF6F0",
                          color:
                            (activeColourTab || colourGroups[0]?.colour) === cg.colour ? "#FFFFFF" : "#541A28",
                        }}
                      >
                        {cg.colour} ({cg.images.length})
                      </button>
                    ))}
                  </div>

                  {currentColourGroup && (
                    <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
                      {currentColourGroup.images.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedImage(img)}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 6,
                            overflow: "hidden",
                            border: `2px solid ${activeImage === img ? "#EE5F2B" : "#E2D7CB"}`,
                            padding: 0,
                            cursor: "pointer",
                            position: "relative",
                            flexShrink: 0,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Specifications & Details */}
              {(product.fabric || product.careInstructions || product.specifications || product.shippingInfo || product.returnPolicy) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
                  {product.fabric && (
                    <div>
                      <strong style={{ color: "#541A28" }}>Fabric: </strong>
                      <span style={{ color: "#4B5563" }}>{product.fabric}</span>
                    </div>
                  )}
                  {product.careInstructions && (
                    <div>
                      <strong style={{ color: "#541A28" }}>Care Instructions: </strong>
                      <span style={{ color: "#4B5563" }}>{product.careInstructions}</span>
                    </div>
                  )}
                  {product.shippingInfo && (
                    <div>
                      <strong style={{ color: "#541A28" }}>Shipping: </strong>
                      <span style={{ color: "#4B5563" }}>{product.shippingInfo}</span>
                    </div>
                  )}
                  {product.returnPolicy && (
                    <div>
                      <strong style={{ color: "#541A28" }}>Return Policy: </strong>
                      <span style={{ color: "#4B5563" }}>{product.returnPolicy}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "2px 8px",
                        borderRadius: 12,
                        background: "#F1E6D6",
                        color: "#541A28",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#3B2C24", marginBottom: 4, display: "block" }}>
                  Description
                </span>
                <div
                  style={{
                    backgroundColor: "#FAF6F0",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #EFE8E0",
                    fontSize: "12px",
                    color: "#4B5563",
                    lineHeight: 1.5,
                  }}
                >
                  {product.description || "No description provided."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "12px 24px",
            backgroundColor: "#FAF6F0",
            borderTop: "1px solid #F3ECE2",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              height: "36px",
              padding: "0 20px",
              borderRadius: "6px",
              border: "1px solid #D8C4AA",
              backgroundColor: "#FFFFFF",
              color: "#4B5563",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
