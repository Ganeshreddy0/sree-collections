import React from "react";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";

export interface Product {
  id: string;
  name: string;
  price: string;
  rawPrice: number;
  mrp: number;
  image: string;
  category: string;
  isTall: boolean;
  colours: string[];
  featured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  discountLabel: string;
  productType: string;
}

const COLOUR_HEX: Record<string, string> = {
  maroon: "#800000",
  red: "#C0392B",
  green: "#1E7B34",
  blue: "#1F4E79",
  navy: "#1B2A4A",
  black: "#1A1A1A",
  white: "#F5F5F5",
  cream: "#F5E6C8",
  gold: "#C9A227",
  yellow: "#E1B12C",
  pink: "#D46A8C",
  purple: "#6C3483",
  orange: "#E67E22",
  brown: "#6B3E26",
  grey: "#7F8C8D",
  gray: "#7F8C8D",
  beige: "#D4C4A8",
};

export function colourToHex(name: string): string {
  const key = name.toLowerCase().trim();
  if (COLOUR_HEX[key]) return COLOUR_HEX[key];
  for (const [k, hex] of Object.entries(COLOUR_HEX)) {
    if (key.includes(k)) return hex;
  }
  return "#BB8E43";
}

export function formatInr(amount: number): string {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function ProductCard({
  product,
  qty,
  onQtyChange,
}: {
  product: Product;
  qty: number;
  onQtyChange: (delta: number) => void;
}) {
  const imgHeight = product.isTall ? 572 : 230;
  const productUrl = `/products/${product.id}`;
  const showMrp = product.mrp > 0 && product.mrp > product.rawPrice;

  return (
    <div
      className={`cat-card-wrap ${product.isTall ? "cat-card-tall" : "cat-card-short"}`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest("button") && !target.closest("a")) {
          window.location.href = productUrl;
        }
      }}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: qty > 0 ? "1.5px solid #BB8E43" : "1.5px solid #E3D7C5",
        padding: "12px",
        boxSizing: "border-box",
        position: "relative",
        cursor: "pointer",
        minWidth: 0,
        transition: "border-color 0.2s ease",
      }}
    >
      {(product.featured || product.isNewArrival || product.discountLabel) && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {product.discountLabel && (
            <span
              style={{
                backgroundColor: "#5D2030",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: 999,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {product.discountLabel}
            </span>
          )}
          {product.isNewArrival && (
            <span
              style={{
                backgroundColor: "#BB8E43",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: 999,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              New
            </span>
          )}
          {product.featured && !product.isNewArrival && (
            <span
              style={{
                backgroundColor: "#BB8E43",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: 999,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Featured
            </span>
          )}
        </div>
      )}

      <a
        href={productUrl}
        className="cat-card-img"
        style={{
          display: "block",
          width: "100%",
          height: `${imgHeight}px`,
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#F5EFE5",
          cursor: "pointer",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/Categories/product_formal_shirt.jpg";
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.3s ease",
          }}
        />
      </a>

      <div className="cat-card-body" style={{ padding: "10px 2px 2px 2px" }}>
        <h3
          className="cat-card-title"
          style={{
            fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 600,
            fontSize: "13.5px",
            lineHeight: "18px",
            minHeight: "18px",
            color: "#5D2030",
            margin: "0 0 6px 0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <a href={productUrl} style={{ color: "inherit", textDecoration: "none" }}>
            {product.name}
          </a>
        </h3>

        {product.colours.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            {product.colours.slice(0, 5).map((c) => (
              <span
                key={c}
                title={c}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: colourToHex(c),
                  border: "1px solid #E3D7C5",
                  display: "inline-block",
                }}
              />
            ))}
            {product.colours.length > 5 && (
              <span
                style={{
                  fontSize: 11,
                  color: "#8A7B6F",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                +{product.colours.length - 5}
              </span>
            )}
          </div>
        )}

        <div
          className="cat-card-footer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="cat-card-price-wrap" style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
            <span
              className="cat-card-price-label"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "11px",
                color: "#9E7A54",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Price:
            </span>
            <span
              className="cat-card-price-val"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                color: "#5D2030",
              }}
            >
              {product.price}
            </span>
            {showMrp && (
              <span
                className="cat-card-price-mrp"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "11px",
                  color: "#8A7B6F",
                  textDecoration: "line-through",
                }}
              >
                {formatInr(product.mrp)}
              </span>
            )}
          </div>

          {/* Cart action: only cart icon when qty === 0; stepper (- count +) when qty > 0 */}
          {qty === 0 ? (
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              className="cat-cart-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                onQtyChange(1);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "1.5px solid #BB8E43",
                color: "#BB8E43",
                cursor: "pointer",
                transition: "all 0.2s ease",
                padding: 0,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#BB8E43";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#BB8E43";
              }}
            >
              <FiShoppingCart size={17} />
            </button>
          ) : (
            <div
              className="cat-qty-stepper"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#BB8E43",
                borderRadius: "999px",
                padding: "4px 8px",
                boxShadow: "0 2px 8px rgba(187, 142, 67, 0.25)",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={(e) => {
                  e.stopPropagation();
                  onQtyChange(-1);
                }}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <FiMinus size={13} strokeWidth={2.5} />
              </button>

              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#FFFFFF",
                  minWidth: "18px",
                  textAlign: "center",
                  userSelect: "none",
                  lineHeight: 1,
                }}
              >
                {qty}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={(e) => {
                  e.stopPropagation();
                  onQtyChange(1);
                }}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <FiPlus size={13} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton({ isTall = false }: { isTall?: boolean }) {
  const imgHeight = isTall ? 340 : 230;
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1.5px solid #EAE3D9",
        padding: "12px",
        boxSizing: "border-box",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: `${imgHeight}px`,
          borderRadius: "12px",
          backgroundColor: "#F4EFEA",
          animation: "sc-skeleton-pulse 1.6s ease-in-out infinite",
        }}
      />
      <div style={{ padding: "4px 2px" }}>
        <div
          style={{
            width: "75%",
            height: "18px",
            borderRadius: "4px",
            backgroundColor: "#F4EFEA",
            marginBottom: "10px",
            animation: "sc-skeleton-pulse 1.6s ease-in-out infinite",
          }}
        />
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F4EFEA", animation: "sc-skeleton-pulse 1.6s ease-in-out infinite" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F4EFEA", animation: "sc-skeleton-pulse 1.6s ease-in-out infinite" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F4EFEA", animation: "sc-skeleton-pulse 1.6s ease-in-out infinite" }} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "20px",
              borderRadius: "4px",
              backgroundColor: "#F4EFEA",
              animation: "sc-skeleton-pulse 1.6s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "90px",
              height: "32px",
              borderRadius: "999px",
              backgroundColor: "#F4EFEA",
              animation: "sc-skeleton-pulse 1.6s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      onClick={onChange}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "3px",
          border: checked ? "1.5px solid #BB8E43" : "1.5px solid #99887C",
          backgroundColor: checked ? "#BB8E43" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.8 7L9 1"
              stroke="#FFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 500,
          fontSize: "16px",
          color: "#5D2030",
        }}
      >
        {label}
      </span>
    </label>
  );
}

export function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="cat-sidebar-heading"
      style={{
        fontFamily: "'Playfair Display', 'Blacker Display', Georgia, serif",
        fontWeight: 700,
        fontSize: "30px",
        lineHeight: "100%",
        color: "#5D2030",
        margin: "0 0 20px 0",
      }}
    >
      {children}
    </h2>
  );
}

