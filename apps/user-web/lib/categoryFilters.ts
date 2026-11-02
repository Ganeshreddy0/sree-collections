export const SORT_OPTIONS = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "New Arrivals",
];

export const DEFAULT_PRICE_BUCKETS = [
  { label: "All Prices" },
  { label: "Under ₹2,000" },
  { label: "₹2,000 - ₹5,000" },
  { label: "Above ₹5,000" },
];

export function readUrlFilters() {
  if (typeof window === "undefined") {
    return {
      category: "All Products",
      size: "",
      colour: "",
      brand: "",
      fabric: "",
      subCategory: "",
      prices: ["All Prices"] as string[],
      sort: "Featured",
      search: "",
      inStock: false,
    };
  }
  const sp = new URLSearchParams(window.location.search);
  const prices = sp.get("price");
  const subCategory = sp.get("subCategory") || "";
  const rawCat = sp.get("category") || sp.get("slug") || "";
  let category = "All Products";

  if (rawCat && rawCat !== "All Products") {
    const lower = rawCat.toLowerCase().trim();
    if (lower === "casual-wear" || lower === "casual wear" || lower === "casual") category = "Casual Wear";
    else if (lower === "decorative-items" || lower === "decorative items" || lower === "decorative") category = "Decorative Items";
    else if (lower === "ethnic-lehengas" || lower === "ethnic lehengas" || lower === "lehenga" || lower === "lehengas") category = "Ethnic Lehengas";
    else if (lower === "jewellery" || lower === "jewelry") category = "Jewellery";
    else if (lower === "saree" || lower === "sarees") category = "Saree";
    else if (lower === "watches" || lower === "watch") category = "watches";
    else if (lower === "shades" || lower === "premium shades") category = "premium shades";
    else {
      category = rawCat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  // If subCategory was passed without a category, infer parent category
  if (category === "All Products" && subCategory) {
    const subLower = subCategory.toLowerCase();
    if (subLower.includes("denim") || subLower.includes("linen") || subLower.includes("active") || subLower.includes("casual") || subLower.includes("formal") || subLower.includes("street")) {
      category = "Casual Wear";
    } else if (subLower.includes("temple") || subLower.includes("earring") || subLower.includes("chain") || subLower.includes("jewel")) {
      category = "Jewellery";
    } else if (subLower.includes("decor") || subLower.includes("party")) {
      category = "Decorative Items";
    } else if (subLower.includes("saree") || subLower.includes("traditional")) {
      category = "Saree";
    } else if (subLower.includes("ethnic") || subLower.includes("kurta")) {
      category = "Casual Wear";
    }
  }

  return {
    category,
    size: sp.get("size") || "",
    colour: sp.get("colour") || "",
    brand: sp.get("brand") || "",
    fabric: sp.get("fabric") || "",
    subCategory,
    prices: prices ? prices.split(";").filter(Boolean) : ["All Prices"],
    sort: sp.get("sort") || "Featured",
    search: sp.get("search") || "",
    inStock: sp.get("inStock") === "true",
  };
}

export function writeUrlFilters(state: {
  category: string;
  size: string;
  colour: string;
  brand: string;
  fabric: string;
  subCategory: string;
  prices: string[];
  sort: string;
  search: string;
  inStock: boolean;
}) {
  if (typeof window === "undefined") return;
  const sp = new URLSearchParams();
  if (state.category && state.category !== "All Products") {
    sp.set("category", state.category);
  }
  if (state.subCategory) sp.set("subCategory", state.subCategory);
  if (state.size) sp.set("size", state.size);
  if (state.colour) sp.set("colour", state.colour);
  if (state.brand) sp.set("brand", state.brand);
  if (state.fabric) sp.set("fabric", state.fabric);
  if (state.prices.length && !state.prices.includes("All Prices")) {
    sp.set("price", state.prices.join(";"));
  }
  if (state.sort && state.sort !== "Featured") sp.set("sort", state.sort);
  if (state.search.trim()) sp.set("search", state.search.trim());
  if (state.inStock) sp.set("inStock", "true");
  const qs = sp.toString();
  const next = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, "", next);
}
