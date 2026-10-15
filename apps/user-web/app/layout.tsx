import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sree Collections | Luxury Ethnic Wear, Sarees & Bridal Jewellery",
  description: "Dive into a world of endless fashion possibilities with Sree Collections. Handcrafted Sarees, Bridal Lehengas, Designer Kurtas & Royal Temple Jewellery.",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
