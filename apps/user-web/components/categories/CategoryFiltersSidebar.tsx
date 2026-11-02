"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  CheckboxRow,
  SidebarHeading,
  colourToHex,
} from "@/components/categories/CategoryPageComponents";

interface CategoryFiltersSidebarProps {
  mobileFiltersOpen: boolean;
  mounted: boolean;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  categoriesList: string[];
  selectedCategory: string;
  handleCategorySelect: (category: string) => void;
  isParticularCategory: boolean;
  subCategoriesList: string[];
  selectedSubCategory: string;
  setSelectedSubCategory: Dispatch<SetStateAction<string>>;
  priceBuckets: { label: string }[];
  checkedPrices: string[];
  togglePrice: (label: string) => void;
  sizesList: string[];
  selectedSize: string;
  setSelectedSize: Dispatch<SetStateAction<string>>;
  coloursList: string[];
  selectedColour: string;
  setSelectedColour: Dispatch<SetStateAction<string>>;
  brandsList: string[];
  selectedBrand: string;
  setSelectedBrand: Dispatch<SetStateAction<string>>;
  fabricsList: string[];
  selectedFabric: string;
  setSelectedFabric: Dispatch<SetStateAction<string>>;
  inStockOnly: boolean;
  setInStockOnly: Dispatch<SetStateAction<boolean>>;
}

export function CategoryFiltersSidebar({
  mobileFiltersOpen,
  mounted,
  hasActiveFilters,
  clearAllFilters,
  categoriesList,
  selectedCategory,
  handleCategorySelect,
  isParticularCategory,
  subCategoriesList,
  selectedSubCategory,
  setSelectedSubCategory,
  priceBuckets,
  checkedPrices,
  togglePrice,
  sizesList,
  selectedSize,
  setSelectedSize,
  coloursList,
  selectedColour,
  setSelectedColour,
  brandsList,
  selectedBrand,
  setSelectedBrand,
  fabricsList,
  selectedFabric,
  setSelectedFabric,
  inStockOnly,
  setInStockOnly,
}: CategoryFiltersSidebarProps) {
  return (
        <aside
          className={`cat-sidebar ${mobileFiltersOpen ? "cat-sidebar-open" : "cat-sidebar-closed"}`}
          style={{
            width: "220px",
            minWidth: "220px",
            maxWidth: "220px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "36px",
            position: "sticky",
            top: "24px",
            boxSizing: "border-box",
          }}
        >
          {mounted && hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              style={{
                alignSelf: "flex-start",
                background: "none",
                border: "none",
                color: "#BB8E43",
                fontSize: 14,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                marginTop: -8,
              }}
            >
              Clear all filters
            </button>
          )}

          {/* Categories */}
          <div>
            <SidebarHeading>Categories</SidebarHeading>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              {categoriesList.map((cat) => {
                const active =
                  selectedCategory.toLowerCase() === cat.toLowerCase() ||
                  (selectedCategory === "All Products" && cat === "All Products");
                return active ? (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 24px",
                      borderRadius: "999px",
                      backgroundColor: "#BB8E43",
                      color: "#FFFFFF",
                      fontFamily:
                        "'Playfair Display', 'Blacker Display', Georgia, serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(187,142,67,0.28)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cat}
                  </button>
                ) : (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="cat-sidebar-link"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 0",
                      fontFamily:
                        "'Playfair Display', 'Blacker Display', Georgia, serif",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#5D2030",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                      transition: "color 0.2s ease, transform 0.2s ease",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Display: Respective Filters ONLY when a particular category is selected */}
          {isParticularCategory ? (
            <>
              {/* Subcategories for Selected Category */}
              {subCategoriesList.length > 0 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <SidebarHeading>Subcategory</SidebarHeading>
                    {selectedSubCategory && (
                      <button
                        type="button"
                        onClick={() => setSelectedSubCategory("")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#BB8E43",
                          fontSize: 13,
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "underline",
                          padding: 0,
                          marginBottom: 18,
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    {subCategoriesList.map((sub) => {
                      const active =
                        selectedSubCategory.toLowerCase() === sub.toLowerCase();
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() =>
                            setSelectedSubCategory((prev) =>
                              prev.toLowerCase() === sub.toLowerCase() ? "" : sub
                            )
                          }
                          className={active ? undefined : "cat-sidebar-link"}
                          style={
                            active
                              ? {
                                  display: "inline-flex",
                                  padding: "6px 18px",
                                  borderRadius: 999,
                                  backgroundColor: "#BB8E43",
                                  color: "#FFFFFF",
                                  fontFamily: "'Playfair Display', Georgia, serif",
                                  fontWeight: 600,
                                  fontSize: 14,
                                  border: "none",
                                  cursor: "pointer",
                                }
                              : {
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "2px 0",
                                  fontFamily: "'Playfair Display', Georgia, serif",
                                  fontWeight: 500,
                                  fontSize: 15,
                                  color: "#5D2030",
                                  textAlign: "left",
                                }
                          }
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <SidebarHeading>Price Range</SidebarHeading>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  {priceBuckets.map(({ label }) => (
                    <CheckboxRow
                      key={label}
                      label={label}
                      checked={checkedPrices.includes(label)}
                      onChange={() => togglePrice(label)}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              {sizesList.length > 0 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <SidebarHeading>Size</SidebarHeading>
                    {selectedSize && (
                      <button
                        onClick={() => setSelectedSize("")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#BB8E43",
                          fontSize: "13px",
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "underline",
                          padding: 0,
                          marginBottom: "18px",
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    {sizesList.map((s) => {
                      const active = selectedSize.toLowerCase() === s.toLowerCase();
                      return (
                        <button
                          key={s}
                          onClick={() =>
                            setSelectedSize((prev) =>
                              prev.toLowerCase() === s.toLowerCase() ? "" : s
                            )
                          }
                          style={{
                            minWidth: "36px",
                            height: "36px",
                            padding: "0 10px",
                            borderRadius: s.length > 3 ? "999px" : "50%",
                            backgroundColor: active ? "#BB8E43" : "transparent",
                            color: active ? "#FFFFFF" : "#5D2030",
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontWeight: active ? 700 : 600,
                            fontSize: s.length > 4 ? "12px" : "15px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            boxShadow: active
                              ? "0 4px 12px rgba(187,142,67,0.3)"
                              : "none",
                            border: active ? "none" : "1.5px solid #E3D7C5",
                          }}
                          title={
                            active
                              ? `Click to clear size ${s}`
                              : `Filter by size ${s}`
                          }
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Colour */}
              {coloursList.length > 0 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <SidebarHeading>Colour</SidebarHeading>
                    {selectedColour && (
                      <button
                        type="button"
                        onClick={() => setSelectedColour("")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#BB8E43",
                          fontSize: 13,
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "underline",
                          padding: 0,
                          marginBottom: 18,
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    {coloursList.map((c) => {
                      const active =
                        selectedColour.toLowerCase() === c.toLowerCase();
                      return (
                        <button
                          key={c}
                          type="button"
                          title={c}
                          onClick={() =>
                            setSelectedColour((prev) =>
                              prev.toLowerCase() === c.toLowerCase() ? "" : c
                            )
                          }
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            backgroundColor: colourToHex(c),
                            border: active
                              ? "2.5px solid #5D2030"
                              : "1.5px solid #E3D7C5",
                            boxShadow: active
                              ? "0 0 0 2px #BB8E43"
                              : "none",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Brand */}
              {brandsList.length > 0 && (
                <div>
                  <SidebarHeading>Brand</SidebarHeading>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {brandsList.map((b) => (
                      <CheckboxRow
                        key={b}
                        label={b}
                        checked={selectedBrand.toLowerCase() === b.toLowerCase()}
                        onChange={() =>
                          setSelectedBrand((prev) =>
                            prev.toLowerCase() === b.toLowerCase() ? "" : b
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Fabric */}
              {fabricsList.length > 0 && (
                <div>
                  <SidebarHeading>Fabric</SidebarHeading>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {fabricsList.map((f) => (
                      <CheckboxRow
                        key={f}
                        label={f}
                        checked={selectedFabric.toLowerCase() === f.toLowerCase()}
                        onChange={() =>
                          setSelectedFabric((prev) =>
                            prev.toLowerCase() === f.toLowerCase() ? "" : f
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div>
                <SidebarHeading>Availability</SidebarHeading>
                <CheckboxRow
                  label="In stock only"
                  checked={inStockOnly}
                  onChange={() => setInStockOnly((v) => !v)}
                />
              </div>
            </>
          ) : (
            /* Elegant prompt shown when on All Products (First showing only categories) */
            <div
              style={{
                padding: "20px 18px",
                borderRadius: "14px",
                backgroundColor: "#FBF5EC",
                border: "1.5px dashed #BB8E43",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px" }}>✨</span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#5D2030",
                  }}
                >
                  Select a Category
                </span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#7A685D",
                  lineHeight: 1.5,
                  margin: 0,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Choose any category above to reveal tailored subcategories, sizes, price ranges, and brands.
              </p>
            </div>
          )}
        </aside>
  );
}
