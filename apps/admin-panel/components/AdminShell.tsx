"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBell,
  FiSettings,
  FiSearch,
  FiChevronDown,
  FiBox,
  FiPlusSquare,
  FiShoppingBag,
  FiMenu,
  FiX,
} from "react-icons/fi";
import {
  LuLayoutGrid,
  LuFolderTree,
  LuTag,
  LuSlidersHorizontal,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";

type Props = { children: React.ReactNode };

export default function AdminShell({ children }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
      if (w < 768) {
        setCollapsed(false); // mobile uses overlay drawer
      } else if (w >= 768 && w < 1024) {
        setCollapsed(true); // tablet auto-collapses sidebar
      }
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Close drawer on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/orders",            label: "Orders",            icon: <FiShoppingBag size={16} /> },
    { href: "/",                  label: "Products",          icon: <FiBox size={16} /> },
    { href: "/products/new",      label: "Create Product",    icon: <FiPlusSquare size={16} /> },
    { href: "/categories",        label: "Category",          icon: <LuLayoutGrid size={16} /> },
    { href: "/sub-categories",    label: "Sub Category",      icon: <LuFolderTree size={16} /> },
    { href: "/brands",            label: "Brands",            icon: <LuTag size={16} /> },
    { href: "/variants",          label: "Variant Attributes",icon: <LuSlidersHorizontal size={16} /> },
  ];

  const sidebarWidth = isMobile ? 240 : (collapsed ? 64 : 240);

  const SidebarContent = ({ inDrawer = false }: { inDrawer?: boolean }) => (
    <>
      <div className="sc-inventory-header">
        {(!collapsed || inDrawer) && <span>Inventory</span>}
        <FiChevronDown size={14} />
      </div>
      <nav className="sc-nav-list">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sc-nav-link${active ? " active" : ""}`}
              onClick={() => inDrawer && setMobileOpen(false)}
            >
              {item.icon}
              {(!collapsed || inDrawer) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FFFFFF" }}>

      {/* ── MOBILE OVERLAY BACKDROP ── */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
            zIndex: 50, backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      {isMobile && (
        <aside
          style={{
            position: "fixed", top: 0, left: 0, height: "100vh",
            width: 240, background: "#FDFAF5",
            borderRight: "1px solid #D8C4AA",
            padding: "20px 12px",
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 60, overflowY: "auto",
          }}
        >
          {/* Drawer header with logo + close */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #EFE8E0" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
              <Image src="/logo.png" alt="SC" width={140} height={40} priority style={{ height: 36, width: "auto", objectFit: "contain" }} />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#541A28", padding: 4, display: "flex" }}
            >
              <FiX size={20} />
            </button>
          </div>
          <SidebarContent inDrawer />
        </aside>
      )}

      {/* ── TOP HEADER ── */}
      <header className="sc-header">
        {isMobile ? (
          /* Mobile: hamburger + logo */
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 16, height: 70 }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#541A28", display: "flex", padding: 4 }}
            >
              <FiMenu size={22} />
            </button>
            <Link href="/">
              <Image src="/logo.png" alt="SC" width={130} height={40} priority style={{ height: 38, width: "auto", objectFit: "contain" }} />
            </Link>
          </div>
        ) : (
          /* Desktop/Tablet: brand area with collapse toggle */
          <div className="sc-brand-area" style={{ width: sidebarWidth }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", padding: "0 14px" }}>
              <Image
                src="/logo.png"
                alt="sreecollections"
                width={200}
                height={52}
                priority
                style={{
                  height: "46px",
                  width: "auto",
                  objectFit: "contain",
                  display: collapsed ? "none" : "block",
                }}
              />
              {collapsed && (
                <span style={{ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: 18, color: "#541A28" }}>
                  SC
                </span>
              )}
            </Link>
            <button
              className="sc-toggle-btn"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <LuChevronsRight size={16} strokeWidth={2.5} /> : <LuChevronsLeft size={16} strokeWidth={2.5} />}
            </button>
          </div>
        )}

        {/* Search bar — hidden on small mobile */}
        <div className="sc-header-search sc-header-search-responsive">
          <FiSearch className="search-icon" size={15} />
          <input type="text" placeholder="Search" />
          <span className="kbd-badge">⌘ K</span>
        </div>

        <div className="sc-header-actions">
          <button className="sc-icon-btn"><FiBell size={16} /></button>
          <button className="sc-icon-btn sc-hide-mobile"><FiSettings size={16} /></button>
          <div className="sc-user-avatar">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Admin" width={38} height={38}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </header>

      {/* ── WORKSPACE ── */}
      <div className="sc-workspace">
        {/* ── SIDEBAR (desktop & tablet only) ── */}
        {!isMobile && (
          <aside className="sc-sidebar" style={{ width: sidebarWidth }}>
            <SidebarContent />
          </aside>
        )}

        {/* ── PAGE CONTENT ── */}
        <main className="sc-main-content">{children}</main>
      </div>
    </div>
  );
}
