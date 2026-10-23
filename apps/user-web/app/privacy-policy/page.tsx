"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiSearch, FiShoppingCart, FiMenu, FiX,
  FiUser, FiInfo, FiCreditCard, FiGlobe, FiShare2,
  FiShield, FiClock, FiLock, FiExternalLink, FiRefreshCw, FiMail,
} from "react-icons/fi";

/* ─── NavLink ─────────────────────────────────────────────────── */
function NavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className="pp-nav-link"
      style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 700, color: "#5A2035", textDecoration: "none", lineHeight: 1.2, paddingBottom: active ? "3px" : undefined, borderBottom: active ? "2.5px solid #5A2035" : undefined, transition: "opacity 0.2s" }}>
      {children}
    </Link>
  );
}

/* ─── Lotus SVG ornament ────────────────────────────────────────── */
function Lotus({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 36 C20 36 8 27 8 17 C8 10.4 13.4 5 20 5 C26.6 5 32 10.4 32 17 C32 27 20 36 20 36Z" fill="none" stroke="#BB8E43" strokeWidth="1.5"/>
      <path d="M20 36 C20 36 12 29 12 21 C12 16.6 15.6 13 20 13 C24.4 13 28 16.6 28 21 C28 29 20 36 20 36Z" fill="rgba(187,142,67,0.15)" stroke="#BB8E43" strokeWidth="1.2"/>
      <path d="M20 5 C14 10 11 15 11 20" stroke="#BB8E43" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <path d="M20 5 C26 10 29 15 29 20" stroke="#BB8E43" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <circle cx="20" cy="21" r="2.5" fill="#BB8E43"/>
    </svg>
  );
}

/* ─── Section data ─────────────────────────────────────────────── */
const SECTIONS = [
  { num: "01", Icon: FiUser,        id: "s01", title: "Information We Collect",        body: "We may collect personal information such as your name, email address, phone number, shipping address, account information, order details and any other information you voluntarily provide while using our website or services." },
  { num: "02", Icon: FiInfo,        id: "s02", title: "How We Use Your Information",    body: "We use your information to process orders, make payments, arrange delivery, provide customer support, communicate with you and improve our website, products and services." },
  { num: "03", Icon: FiCreditCard,  id: "s03", title: "Payment Information",            body: "Payments are processed through secure third-party payment providers. We do not store your payment card details on our servers. Please refer to the respective payment provider's privacy policy for more information about how they handle your payment information." },
  { num: "04", Icon: FiGlobe,       id: "s04", title: "Cookies and Website Usage",      body: "We use cookies and similar technologies to enhance your browsing experience, remember your preferences, analyse website usage and improve our services. You can manage your cookie preferences through your browser settings." },
  { num: "05", Icon: FiShare2,      id: "s05", title: "Sharing of Information",         body: "We may share your information with trusted delivery partners, payment providers and other service providers only when necessary to fulfil your orders and provide our services. We do not sell your personal information to third parties for marketing purposes." },
  { num: "06", Icon: FiShield,      id: "s06", title: "Data Security",                  body: "We have reasonable measures to protect your information from unauthorised access, loss, misuse or alteration. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security." },
  { num: "07", Icon: FiClock,       id: "s07", title: "Data Retention and Deletion",    body: "We retain your information for as long as necessary to fulfil the purposes outlined in this policy, comply with legal requirements or resolve disputes. You may request deletion of your personal information, subject to certain legal and operational conditions." },
  { num: "08", Icon: FiLock,        id: "s08", title: "Your Privacy Rights",            bodyJsx: true },
  { num: "09", Icon: FiExternalLink,id: "s09", title: "Third-Party Services",           body: "Our website may contain links to third-party websites or services. These third parties have their own privacy policies, and we are not responsible for their practices." },
  { num: "10", Icon: FiRefreshCw,   id: "s10", title: "Changes to This Policy",        body: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with the revised "Last Updated" date.' },
  { num: "11", Icon: FiMail,        id: "s11", title: "Contact Us",                     bodyJsx: true, isContact: true },
];

const TOC = [
  { num: "01", label: "Information We Collect",     id: "s01" },
  { num: "02", label: "How We Use Your Information",id: "s02" },
  { num: "03", label: "Payment Information",        id: "s03" },
  { num: "04", label: "Cookies and Website Usage",  id: "s04" },
  { num: "05", label: "Sharing of Information",     id: "s05" },
  { num: "06", label: "Data Security",              id: "s06" },
  { num: "07", label: "Data Retention and Deletion",id: "s07" },
  { num: "08", label: "Your Privacy Rights",        id: "s08" },
  { num: "09", label: "Third-Party Services",       id: "s09" },
  { num: "10", label: "Changes to This Policy",     id: "s10" },
  { num: "11", label: "Contact Us",                 id: "s11" },
];

/* ─── Page ─────────────────────────────────────────────────────── */
export default function PrivacyPolicyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF6EE", color: "#2F2C24", overflowX: "hidden" }}>

      {/* ════════════════════════════════════════
          HEADER — same as every other page
         ════════════════════════════════════════ */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", position: "sticky", top: 0, zIndex: 100, backgroundColor: "#FCF8F2", boxShadow: "0 1px 0 rgba(93,32,48,0.07)" }}>
        <header style={{ width: "100%", maxWidth: "1360px", minHeight: "95px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
          <Link href="/" style={{ display: "inline-block", flexShrink: 0 }}>
            <img src="/homepage/logo2_trans.png" alt="Sree Collections" style={{ height: "72px", width: "auto", objectFit: "contain", maxWidth: "320px", display: "block" }} />
          </Link>
          <nav className="pp-desktop-nav" style={{ display: "none", alignItems: "center", gap: "36px" }}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <Link href="/contact" className="pp-cta-btn" style={{ background: "#BA8E43", color: "#FFF", fontFamily: "var(--font-serif)", fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", padding: "11px 28px", borderRadius: "9999px", boxShadow: "0 2px 10px rgba(186,142,67,0.25)", display: "inline-flex", alignItems: "center", transition: "all 0.25s ease", textDecoration: "none" }}>
              CONTACT US
            </Link>
            <Link href="/search" aria-label="Search" style={{ display: "flex", alignItems: "center", color: "#5A2035", padding: "4px" }}><FiSearch size={22} strokeWidth={2} /></Link>
            <Link href="/cart" aria-label="Cart" style={{ display: "flex", alignItems: "center", color: "#5A2035", padding: "4px" }}><FiShoppingCart size={22} strokeWidth={2} /></Link>
          </nav>
          <div className="mobile-header-actions" style={{ display: "none", alignItems: "center", gap: "8px" }}>
            <a href="/search" aria-label="Search" style={{ display: "flex", alignItems: "center", color: "#5A2035", padding: "6px" }}><FiSearch size={21} strokeWidth={2} /></a>
            <Link href="/cart" aria-label="Cart" style={{ display: "flex", alignItems: "center", color: "#5A2035", padding: "6px" }}><FiShoppingCart size={21} strokeWidth={2} /></Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu" style={{ padding: "6px", color: "#2F2C24", background: "none", border: "none", cursor: "pointer" }} className="pp-hamburger mobile-hamburger">
              {mobileMenuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", justifyContent: "flex-end" }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{ width: "290px", height: "100%", backgroundColor: "#FCF8F2", padding: "30px 24px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <img src="/homepage/logo2_trans.png" alt="Logo" style={{ height: "48px" }} />
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><FiX size={24} /></button>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
              {[{href:"/",label:"Home"},{href:"/about",label:"About"},{href:"/categories",label:"Categories"},{href:"/contact",label:"Contact Us"}].map(({href,label}) => (
                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "16px", fontWeight: 600, color: "#5A2035", fontFamily: "var(--font-serif)", textDecoration: "none" }}>{label}</Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          PAGE BODY — max-width container
         ════════════════════════════════════════ */}
      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "36px 24px 80px 24px", boxSizing: "border-box" }}>

        {/* Breadcrumb — full width, above the grid */}
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "28px", fontFamily: "var(--font-sans)", fontSize: "13px", color: "#9A8B7E" }}>
          <Link href="/" className="pp-crumb" style={{ color: "#9A8B7E", textDecoration: "none", transition: "color 0.18s" }}>Home</Link>
          <span style={{ color: "#BB8E43" }}>›</span>
          <span style={{ color: "#5D2030", fontWeight: 600 }}>Privacy Policy</span>
        </nav>

        {/* ── MAIN TWO-COLUMN GRID: sidebar | main ── */}
        <div className="pp-body-grid" style={{ display: "grid", gridTemplateColumns: "272px 1fr", gap: "44px", alignItems: "start" }}>

          {/* ════ LEFT SIDEBAR ════ */}
          <aside className="pp-sidebar" style={{ position: "sticky", top: "108px" }}>

            {/* TOC card */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(93,32,48,0.08)", boxShadow: "0 4px 16px rgba(93,32,48,0.05)", overflow: "hidden", marginBottom: "24px" }}>
              {/* TOC header */}
              <div style={{ padding: "13px 20px", display: "flex", alignItems: "center", gap: "9px", borderBottom: "1px solid rgba(187,142,67,0.15)" }}>
                <Lotus size={20} />
                <span style={{ fontFamily: "'Blacker Display', Georgia, serif", fontSize: "13.5px", fontWeight: 700, color: "#5D2030" }}>
                  In&nbsp;&nbsp;This Policy
                </span>
              </div>
              {/* TOC list */}
              <nav style={{ padding: "4px 0 6px 0" }}>
                {TOC.map(item => (
                  <a key={item.id} href={`#${item.id}`} className="pp-toc-row"
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 20px", textDecoration: "none", transition: "background 0.15s" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 800, color: "#BB8E43", minWidth: "18px", letterSpacing: "0.2px" }}>{item.num}</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", color: "#5D2030", lineHeight: 1.4, fontWeight: 500 }}>{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Trust + model card */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(93,32,48,0.08)", boxShadow: "0 4px 16px rgba(93,32,48,0.05)", overflow: "hidden" }}>
              {/* Quote */}
              <div style={{ padding: "26px 20px 18px 20px", textAlign: "center" }}>
                <p style={{ fontFamily: "'Blacker Display', Georgia, serif", fontStyle: "italic", fontSize: "23px", fontWeight: 700, color: "#5D2030", lineHeight: 1.3, margin: "0 0 14px 0" }}>
                  Your trust<br />is our priority
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "9px" }}>
                  <div style={{ width: "26px", height: "1px", backgroundColor: "#BB8E43" }} />
                  <Lotus size={16} />
                  <div style={{ width: "26px", height: "1px", backgroundColor: "#BB8E43" }} />
                </div>
              </div>
              {/* Model photo */}
              <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden", position: "relative" }}>
                <img src="/homepage/saree_models.jpg" alt="Tradition Elegance You"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(93,32,48,0.62) 0%, transparent 50%)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 14px 0" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "9px", letterSpacing: "2.8px", color: "rgba(255,255,255,0.92)", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>
                    TRADITION · ELEGANCE · YOU
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* ════ RIGHT MAIN ════ */}
          <main>
            {/* ── Hero row inside main: Heading (left) + Image (right) ── */}
            <div className="pp-hero-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", marginBottom: "40px", alignItems: "center" }}>

              {/* Left: heading + ornament + desc */}
              <div>
                <h1 style={{ fontFamily: "'Blacker Display', Georgia, serif", fontWeight: 700, fontSize: "clamp(34px,3.6vw,50px)", lineHeight: 1.1, color: "#5D2030", margin: "0 0 16px 0" }}>
                  Privacy Policy
                </h1>
                {/* Gold ornament */}
                <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "18px" }}>
                  <div style={{ width: "34px", height: "1.5px", backgroundColor: "#BB8E43" }} />
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#BB8E43" }} />
                  <div style={{ width: "34px", height: "1.5px", backgroundColor: "#BB8E43" }} />
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "13.5px", lineHeight: 1.8, color: "#756658", margin: 0 }}>
                  Your privacy matters to us. This Privacy Policy explains how we collect, use, protect and manage your personal information when you visit our website, place an order or interact with us.
                </p>
              </div>

              {/* Right: decorative fabric image */}
              <div style={{ width: "100%", height: "240px", borderRadius: "18px", overflow: "hidden", boxShadow: "0 8px 28px rgba(93,32,48,0.1)" }}>
                <img src="/homepage/privacy_hero_fabric.jpg" alt="Elegant saree fabric"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
              </div>
            </div>

            {/* Last Updated badge */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "28px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(187,142,67,0.1)", border: "1px solid rgba(187,142,67,0.28)", borderRadius: "999px", padding: "5px 14px", fontFamily: "var(--font-sans)", fontSize: "11px", color: "#8F6627", fontWeight: 700 }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#BB8E43", display: "inline-block" }} />
                Last Updated: 30 Aug 2026
              </span>
            </div>

            {/* ── Policy sections ── */}
            <div>
              {SECTIONS.map((sec, idx) => {
                const Icon = sec.Icon;
                const isLast = idx === SECTIONS.length - 1;
                return (
                  <div key={sec.id} id={sec.id} className="pp-sec-row"
                    style={{ display: "grid", gridTemplateColumns: "48px 48px 1fr", gap: "0 14px", alignItems: "flex-start", padding: "24px 0", borderBottom: !isLast ? "1px solid rgba(93,32,48,0.09)" : "none" }}>

                    {/* Gold oval badge */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingTop: "3px" }}>
                      <div style={{ minWidth: "38px", height: "26px", borderRadius: "13px", border: "1.5px solid rgba(187,142,67,0.45)", backgroundColor: "rgba(187,142,67,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: "10.5px", fontWeight: 800, color: "#BB8E43", letterSpacing: "0.4px", userSelect: "none" }}>
                        {sec.num}
                      </div>
                    </div>

                    {/* Icon circle */}
                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", border: "1.5px solid rgba(93,32,48,0.13)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, backgroundColor: "rgba(93,32,48,0.02)" }}>
                      <Icon size={17} color="#5D2030" strokeWidth={1.7} />
                    </div>

                    {/* Text */}
                    <div style={{ paddingTop: "1px" }}>
                      <h2 style={{ fontFamily: "'Blacker Display', Georgia, serif", fontSize: "17.5px", fontWeight: 700, color: "#5D2030", margin: "0 0 8px 0", lineHeight: 1.2 }}>
                        {sec.title}
                      </h2>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", lineHeight: 1.82, color: "#5A4A3A", margin: 0 }}>
                        {sec.bodyJsx ? (
                          !sec.isContact ? (
                            <>You have the right to access, update or request deletion of your personal information. For any privacy-related questions or requests, please contact us through the{" "}<Link href="/contact" style={{ color: "#BB8E43", textDecoration: "underline", textUnderlineOffset: "2px" }}>Contact Us</Link> page.</>
                          ) : (
                            <>If you have any questions, concerns or requests regarding this Privacy Policy, please visit our{" "}<Link href="/contact" style={{ color: "#BB8E43", textDecoration: "underline", textUnderlineOffset: "2px" }}>Contact Us</Link> page or get in touch with us through the details provided there.</>
                          )
                        ) : sec.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom lotus ornament */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "44px" }}>
              <div style={{ width: "40px", height: "1px", backgroundColor: "#BB8E43", opacity: 0.4 }} />
              <Lotus size={16} />
              <div style={{ width: "40px", height: "1px", backgroundColor: "#BB8E43", opacity: 0.4 }} />
            </div>
          </main>
        </div>
      </div>

      {/* ════════════════════════════════════════
          RESPONSIVE CSS
         ════════════════════════════════════════ */}
      <style>{`
        @media (min-width: 992px) {
          .pp-desktop-nav { display: flex !important; }
          .mobile-header-actions { display: none !important; }
        }
        @media (max-width: 991px) {
          .pp-desktop-nav { display: none !important; }
          .mobile-header-actions { display: flex !important; }
          .pp-hamburger { display: flex !important; }
        }
        @media (max-width: 900px) {
          .pp-body-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .pp-sidebar { position: static !important; }
          .pp-hero-inner { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .pp-sec-row { grid-template-columns: 42px 42px 1fr !important; gap: 0 10px !important; }
        }
        .pp-nav-link:hover { opacity: 0.7; }
        .pp-cta-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .pp-crumb:hover { color: #5D2030 !important; }
        .pp-toc-row:hover { background: rgba(93,32,48,0.04) !important; }
        .pp-toc-row:hover span { color: #BB8E43 !important; }
        .pp-sec-row:hover { background: rgba(255,255,255,0.7); border-radius: 10px; }
      `}</style>
    </div>
  );
}
