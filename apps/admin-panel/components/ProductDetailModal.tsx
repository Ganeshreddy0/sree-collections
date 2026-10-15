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
} from "react-icons/fi";

export interface ProductDetailItem {
  id: string;
  _id?: string;
  code: string;
  name: string;
  category: string;
  subCategory?: string;
  brand: string;
  price: string;
  rawPrice?: number;
  unit: string;
  qty: number;
  img: string;
  images?: string[];
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
  attributes?: {
    size?: string;
    colour?: string;
    weight?: string;
    pattern?: string;
    style?: string;
    material?: string;
    [key: string]: unknown;
  };
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
          width: "100%",
          maxWidth: "780px",
          maxHeight: "90vh",
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.22)",
          border: "1px solid #EFE8E0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid #F3ECE2",
            backgroundColor: "#FAF6F0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "8px",
                backgroundColor: "#F1E6D6",
                color: "#541A28",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiBox size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#3B2C24" }}>
                  {product.name}
                </h2>
                <span
                  style={{
                    backgroundColor: "#541A28",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {product.code}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    height: 22,
                    padding: "0 8px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    backgroundColor: isActive ? "#16A34A" : "#DC2626",
                    color: "#FFFFFF",
                  }}
                >
                  • {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#8C7A6B" }}>
                {product.category} {product.subCategory ? `› ${product.subCategory}` : ""} • {product.brand}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9CA3AF",
              padding: 6,
              display: "flex",
              borderRadius: "6px",
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>
            {/* Left Column: Media & Stock */}
            <div>
              {/* Main Image */}
              <div
                style={{
                  width: "100%",
                  height: "260px",
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
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 16 }}>
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      style={{
                        width: 50,
                        height: 50,
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
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "12px", color: "#6B5A51" }}>Current Stock:</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: product.qty <= (product.quantityAlert || 5) ? "#DC2626" : "#16A34A" }}>
                    {product.qty} {product.unit}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "12px", color: "#6B5A51" }}>Stock Alert:</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                    {product.quantityAlert || 5} {product.unit}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "12px", color: "#6B5A51" }}>Selling Type:</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                    {product.sellingType || "B2C"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#6B5A51" }}>Product Type:</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                    {product.productType || "Single Product"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing, Specs, Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Pricing Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  backgroundColor: "#FDFBF7",
                  padding: "16px",
                  borderRadius: "10px",
                  border: "1px solid #EFE8E0",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#8C7A6B", fontWeight: 600, letterSpacing: "0.5px" }}>
                    Price
                  </span>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#541A28", marginTop: 2 }}>
                    {product.price.startsWith("$") ? product.price : `$${product.price}`}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#8C7A6B", fontWeight: 600, letterSpacing: "0.5px" }}>
                    Tax Type
                  </span>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginTop: 4 }}>
                    {product.taxType || "GST 5%"}
                  </div>
                </div>

                {product.discountType && product.discountType !== "None" && product.discountValue ? (
                  <>
                    <div>
                      <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#8C7A6B", fontWeight: 600, letterSpacing: "0.5px" }}>
                        Discount
                      </span>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#EE5F2B", marginTop: 4 }}>
                        {product.discountType === "Percentage" ? `${product.discountValue}% OFF` : `$${product.discountValue} OFF`}
                      </div>
                    </div>
                    {product.discountPrice !== undefined && product.discountPrice !== null && (
                      <div>
                        <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#8C7A6B", fontWeight: 600, letterSpacing: "0.5px" }}>
                          Discounted Price
                        </span>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#16A34A", marginTop: 2 }}>
                          ${product.discountPrice}
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              {/* Taxonomy / Classification */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ padding: "10px 12px", borderRadius: 8, backgroundColor: "#FAF6F0", border: "1px solid #EFE8E0" }}>
                  <span style={{ fontSize: "11px", color: "#8C7A6B", display: "block" }}>Category</span>
                  <strong style={{ fontSize: "12px", color: "#3B2C24" }}>{product.category || "General"}</strong>
                </div>
                <div style={{ padding: "10px 12px", borderRadius: 8, backgroundColor: "#FAF6F0", border: "1px solid #EFE8E0" }}>
                  <span style={{ fontSize: "11px", color: "#8C7A6B", display: "block" }}>Sub Category</span>
                  <strong style={{ fontSize: "12px", color: "#3B2C24" }}>{product.subCategory || "None"}</strong>
                </div>
                <div style={{ padding: "10px 12px", borderRadius: 8, backgroundColor: "#FAF6F0", border: "1px solid #EFE8E0" }}>
                  <span style={{ fontSize: "11px", color: "#8C7A6B", display: "block" }}>Brand</span>
                  <strong style={{ fontSize: "12px", color: "#3B2C24" }}>{product.brand || "---"}</strong>
                </div>
              </div>

              {/* Product Attributes */}
              {attrList.length > 0 && (
                <div>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#3B2C24", marginBottom: 8, display: "block" }}>
                    Variants & Attributes
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {attrList.map((attr, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: "#F1E6D6",
                          color: "#541A28",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 500,
                          border: "1px solid #E2D7CB",
                        }}
                      >
                        <strong>{attr.label}:</strong> {attr.value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#3B2C24", marginBottom: 6, display: "block" }}>
                  Description
                </span>
                <div
                  style={{
                    backgroundColor: "#FAF6F0",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    border: "1px solid #EFE8E0",
                    fontSize: "13px",
                    color: "#4B5563",
                    lineHeight: 1.55,
                    minHeight: "60px",
                  }}
                >
                  {product.description ? product.description : "No description provided for this product."}
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
            padding: "14px 24px",
            backgroundColor: "#FAF6F0",
            borderTop: "1px solid #F3ECE2",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              height: "36px",
              padding: "0 18px",
              borderRadius: "6px",
              border: "1px solid #D8C4AA",
              backgroundColor: "#FFFFFF",
              color: "#4B5563",
              fontSize: "13px",
              fontWeight: 500,
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
