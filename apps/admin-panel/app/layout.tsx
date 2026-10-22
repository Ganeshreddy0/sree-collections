import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sree Collections - Admin Portal",
  description: "Super Admin Management Panel for Sree Collections",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
