import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sree Collections - Admin Dashboard",
  description: "Management portal for products, orders, and customers",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f8f9fa" }}>
        {children}
      </body>
    </html>
  );
}
