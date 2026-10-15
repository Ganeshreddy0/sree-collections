"use client";

import React, { useState } from "react";
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

  const navItems = [
    { href: "/",                  label: "Products",          icon: <FiBox size={16} /> },
    { href: "/products/new",      label: "Create Product",    icon: <FiPlusSquare size={16} /> },
    { href: "/categories",        label: "Category",          icon: <LuLayoutGrid size={16} /> },
    { href: "/sub-categories",    label: "Sub Category",      icon: <LuFolderTree size={16} /> },
    { href: "/brands",            label: "Brands",            icon: <LuTag size={16} /> },
    { href: "/variants",          label: "Variant Attributes",icon: <LuSlidersHorizontal size={16} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FFFFFF" }}>
      {/* ── TOP HEADER ── */}
      <header className="sc-header">
        <div className="sc-brand-area" style={{ width: collapsed ? 64 : 240 }}>
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

        <div className="sc-header-search">
          <FiSearch className="search-icon" size={15} />
          <input type="text" placeholder="Search" />
          <span className="kbd-badge">⌘ K</span>
        </div>

        <div className="sc-header-actions">
          <button className="sc-icon-btn"><FiBell size={16} /></button>
          <button className="sc-icon-btn"><FiSettings size={16} /></button>
          <div className="sc-user-avatar">
            <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Admin" width={38} height={38} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          </div>
        </div>
      </header>

      {/* ── WORKSPACE ── */}
      <div className="sc-workspace">
        {/* ── SIDEBAR ── */}
        <aside className="sc-sidebar" style={{ width: collapsed ? 64 : 240 }}>
          <div className="sc-inventory-header">
            {!collapsed && <span>Inventory</span>}
            <FiChevronDown size={14} />
          </div>
          <nav className="sc-nav-list">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={`sc-nav-link${active ? " active" : ""}`}>
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ── PAGE CONTENT ── */}
        <main className="sc-main-content">{children}</main>
      </div>
    </div>
  );
}
