"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";

interface SiteHeaderProps {
  logoUrl?: string;
  activePath?: string;
}

export default function SiteHeader({ logoUrl, activePath }: SiteHeaderProps) {
  const pathname = usePathname() || "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeItem, setActiveItem] = useState<string>("home");

  // Determine active nav item based on pathname or activePath prop
  useEffect(() => {
    const current = activePath || pathname;
    if (current === "/" || current === "/#home" || current.startsWith("/#")) {
      setActiveItem("home");
    } else if (current.startsWith("/about")) {
      setActiveItem("about");
    } else if (
      current.startsWith("/categories") ||
      current.startsWith("/products") ||
      current.startsWith("/product")
    ) {
      setActiveItem("categories");
    } else if (current.startsWith("/contact")) {
      setActiveItem("contact");
    } else {
      setActiveItem("");
    }
  }, [pathname, activePath]);

  // Load and listen to cart updates from localStorage
  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("sree_cart");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const count = parsed.reduce(
              (sum: number, it: any) => sum + (Number(it.quantity) || 1),
              0
            );
            setCartCount(count);
            return;
          }
        }
        setCartCount(0);
      } catch {
        setCartCount(0);
      }
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cartUpdated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, []);

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about" },
    { id: "categories", label: "Categories", href: "/categories" },
    { id: "contact", label: "Contact Us", href: "/contact" },
  ];

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#FCF8F2",
      }}
    >
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
          <Link href="/" style={{ display: "inline-block" }}>
            <img
              src={logoUrl || "/homepage/logo2_trans.png"}
              alt="Sree Collections"
              style={{
                height: "72px",
                width: "auto",
                objectFit: "contain",
                maxWidth: "340px",
                display: "block",
              }}
            />
          </Link>
        </div>

        {/* Desktop Navigation Links & Action Items */}
        <nav
          className="site-desktop-nav desktop-nav about-desktop-nav cat-desktop-nav contact-desktop-nav cart-desktop-nav srch-desktop-nav pdp-desktop-nav"
          style={{
            display: "none",
            alignItems: "center",
            gap: "36px",
          }}
        >
          {navItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveItem(item.id)}
                style={
                  isActive
                    ? {
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
                        textDecoration: "none",
                        lineHeight: 1.2,
                        cursor: "pointer",
                      }
                    : {
                        background: "transparent",
                        color: "#5A2035",
                        fontFamily: "var(--font-serif)",
                        fontSize: "17px",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.25s ease",
                        textDecoration: "none",
                        lineHeight: 1.2,
                        padding: "4px 2px",
                        cursor: "pointer",
                      }
                }
                className={isActive ? "primary-btn active-nav-btn" : "nav-link"}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Search Icon */}
          <Link
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
          </Link>

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
              position: "relative",
              transition: "transform 0.2s ease",
            }}
          >
            <FiShoppingCart size={22} strokeWidth={2} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-7px",
                  right: "-9px",
                  backgroundColor: "#BA8E43",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  fontWeight: 700,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Right Actions: Search + Cart + Hamburger */}
        <div
          className="site-mobile-actions mobile-header-actions"
          style={{
            display: "none",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Link
            href="/search"
            aria-label="Search"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#5A2035",
              padding: "6px",
            }}
          >
            <FiSearch size={21} strokeWidth={2} />
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping Cart"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#5A2035",
              padding: "6px",
              position: "relative",
            }}
          >
            <FiShoppingCart size={21} strokeWidth={2} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-3px",
                  right: "-3px",
                  backgroundColor: "#BA8E43",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  fontWeight: 700,
                  width: "17px",
                  height: "17px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-serif)",
                }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              padding: "6px",
              color: "#2F2C24",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            className="mobile-hamburger"
          >
            {mobileMenuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
          </button>
        </div>
      </header>

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
            zIndex: 200,
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img
                src={logoUrl || "/homepage/logo2_trans.png"}
                alt="Logo"
                style={{ height: "48px" }}
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#2F2C24",
                }}
              >
                <FiX size={24} />
              </button>
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginTop: "20px",
              }}
            >
              {navItems.map((item) => {
                const isActive = activeItem === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setActiveItem(item.id);
                      setMobileMenuOpen(false);
                    }}
                    style={
                      isActive
                        ? {
                            backgroundColor: "#BA8E43",
                            color: "#FFFFFF",
                            padding: "10px 20px",
                            borderRadius: "9999px",
                            fontSize: "14px",
                            fontWeight: 700,
                            letterSpacing: "0.6px",
                            textTransform: "uppercase",
                            fontFamily: "var(--font-serif)",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            boxShadow: "0 2px 8px rgba(186, 142, 67, 0.25)",
                            width: "fit-content",
                          }
                        : {
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#5A2035",
                            fontFamily: "var(--font-serif)",
                            textDecoration: "none",
                            padding: "6px 0",
                          }
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Header Media Queries */}
      <style jsx global>{`
        @media (min-width: 992px) {
          .site-desktop-nav {
            display: flex !important;
          }
          .site-mobile-actions {
            display: none !important;
          }
        }
        @media (max-width: 991px) {
          .site-desktop-nav {
            display: none !important;
          }
          .site-mobile-actions {
            display: flex !important;
          }
        }
        .nav-link:hover {
          opacity: 0.8;
          color: #ba8e43 !important;
        }
        .active-nav-btn:hover {
          background-color: #a87d35 !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
