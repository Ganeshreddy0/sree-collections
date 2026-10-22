export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api`;

export const STORE_URL =
  process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";
