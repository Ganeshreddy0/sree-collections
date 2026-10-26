import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Sree Collections | Luxury Ethnic Wear, Sarees & Bridal Jewellery",
  description:
    "Dive into a world of endless fashion possibilities with Sree Collections. Handcrafted Sarees, Bridal Lehengas, Designer Kurtas & Royal Temple Jewellery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── One global header ── sticky at top, appears on every page ── */}
        <SiteHeader />

        {/* Page content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </div>

        {/* Global footer */}
        <SiteFooter />
      </body>
    </html>
  );
}
