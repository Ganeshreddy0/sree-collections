"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";

interface SiteHeaderProps {
  logoUrl?: string;
  activePath?: string;
}

export default function SiteHeader({ logoUrl, activePath }: SiteHeaderProps) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeItem, setActiveItem] = useState<string>("home");

  // Inline Search state (icon-side search bar)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Determine active nav item based on pathname or activePath prop
  useEffect(() => {
    const current = activePath || pathname;
    if (current === "/" || current === "/#home") {
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

  // Focus search input when expanded
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchOpen]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (pathname.startsWith("/categories")) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about" },
    { id: "categories", label: "Categories", href: "/categories" },
    { id: "contact", label: "Contact Us", href: "/contact" },
  ];

  return (
    <header
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 9999,
        backgroundColor: "#FCF8F2",
        borderBottom: "1px solid rgba(186, 142, 67, 0.15)",
        boxShadow: "0 2px 12px rgba(90, 32, 53, 0.06)",
        transition: "all 0.25s ease",
      }}
    >
      <div
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
          className="site-desktop-nav desktop-nav"
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
                        padding: "6px 12px",
                        borderRadius: "9999px",
                        cursor: "pointer",
                      }
                }
                className={isActive ? "primary-btn active-nav-btn" : "nav-link"}
              >
                {isActive ? item.label.toUpperCase() : item.label}
              </Link>
            );
          })}

          {/* Search Icon & Expandable Search Field */}
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #BA8E43",
                  borderRadius: "9999px",
                  padding: "4px 12px 4px 14px",
                  height: "40px",
                  boxSizing: "border-box",
                  boxShadow: "0 2px 8px rgba(186, 142, 67, 0.2)",
                  animation: "fadeIn 0.2s ease",
                }}
              >
                <FiSearch size={17} color="#BA8E43" style={{ flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    fontSize: "13.5px",
                    color: "#2F2C24",
                    width: "160px",
                    padding: 0,
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (searchQuery) {
                      setSearchQuery("");
                    } else {
                      setSearchOpen(false);
                    }
                  }}
                  aria-label="Close search"
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#5A2035",
                  }}
                >
                  <FiX size={16} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5A2035",
                  padding: "6px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
                className="header-icon-btn"
              >
                <FiSearch size={22} strokeWidth={2} />
              </button>
            )}
          </div>

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
                  fontSize: "10.5px",
                  fontWeight: 700,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
                  lineHeight: 1,
                  userSelect: "none",
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
          {searchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#FFFFFF",
                border: "1.5px solid #BA8E43",
                borderRadius: "9999px",
                padding: "3px 10px",
                height: "36px",
                boxSizing: "border-box",
                boxShadow: "0 2px 6px rgba(186, 142, 67, 0.18)",
              }}
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: "13px",
                  color: "#2F2C24",
                  width: "110px",
                  padding: 0,
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (searchQuery) {
                    setSearchQuery("");
                  } else {
                    setSearchOpen(false);
                  }
                }}
                aria-label="Close search"
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  color: "#5A2035",
                }}
              >
                <FiX size={15} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#5A2035",
                padding: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FiSearch size={21} strokeWidth={2} />
            </button>
          )}

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
                  fontSize: "10.5px",
                  fontWeight: 700,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
                  lineHeight: 1,
                  userSelect: "none",
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
      </div>

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
            zIndex: 10000,
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
                    {isActive ? item.label.toUpperCase() : item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Header Media Queries & Clean input overrides */}
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
          color: #ba8e43 !important;
          background: rgba(186, 142, 67, 0.08) !important;
        }
        .active-nav-btn:hover {
          background-color: #a87d35 !important;
          transform: translateY(-1px);
        }
        .header-icon-btn:hover {
          color: #ba8e43 !important;
          transform: scale(1.08);
        }
        /* Prevent duplicate WebKit search clear icon */
        input::-webkit-search-decoration,
        input::-webkit-search-cancel-button,
        input::-webkit-search-results-button,
        input::-webkit-search-results-decoration {
          display: none !important;
          -webkit-appearance: none !important;
        }
      `}</style>
    </header>
  );
}
