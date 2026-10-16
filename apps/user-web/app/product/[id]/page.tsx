"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/** Legacy route: redirect /product/:id → /products/:id (real API PDP) */
export default function LegacyProductRedirect() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      router.replace(`/products/${id}`);
    } else {
      router.replace("/categories");
    }
  }, [id, router]);

  return (
    <div
      style={{
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FAF6EE",
        color: "#5D2030",
        fontFamily: "'Playfair Display', Georgia, serif",
      }}
    >
      Loading product…
    </div>
  );
}
