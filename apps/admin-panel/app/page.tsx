"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import {
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import ProductDetailModal, { ProductDetailItem } from "@/components/ProductDetailModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { API_BASE } from "@/lib/config";

type ProductItem = ProductDetailItem;

const DEFAULT_PRODUCTS: ProductItem[] = [
  { id: "1", code: "PT001", name: "Tack Pant",     category: "Casual Wear",     brand: "Zara",        price: "$600", unit: "Pc", qty: 100, img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=100&q=80" },
  { id: "2", code: "PT002", name: "T Shirt",        category: "Casual Wear",     brand: "Zara",        price: "$160", unit: "Pc", qty: 140, img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&q=80" },
  { id: "3", code: "PT003", name: "Cotton Saree",   category: "Saree",           brand: "Chanderi",    price: "$110", unit: "Pc", qty: 300, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&q=80" },
  { id: "4", code: "PT004", name: "Silk Saree",     category: "Saree",           brand: "Pochampally", price: "$120", unit: "Pc", qty: 450, img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=100&q=80" },
  { id: "5", code: "PT005", name: "Earrings",       category: "Jewellery",       brand: "Caratlane",   price: "$80",  unit: "Pc", qty: 320, img: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=100&q=80" },
  { id: "6", code: "PT006", name: "One Step Chain", category: "Jewellery",       brand: "Caratlane",   price: "$320", unit: "Pc", qty: 650, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&q=80" },
  { id: "7", code: "PT007", name: "Pop Ups",        category: "Decorative Items",brand: "---",         price: "$60",  unit: "Pc", qty: 700, img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=100&q=80" },
  { id: "8", code: "PT008", name: "Birthday Caps",  category: "Decorative Items",brand: "---",         price: "$540", unit: "Pc", qty: 630, img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=100&q=80" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Category");
  const [brandFilter, setBrandFilter] = useState("Brand");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [categories, setCategories] = useState<string[]>(["Category", "Casual Wear", "Saree", "Jewellery", "Decorative Items"]);
  const [brands, setBrands] = useState<string[]>(["Brand", "Zara", "Chanderi", "Pochampally", "Caratlane", "---"]);
  const [selected, setSelected] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<ProductDetailItem | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<{ id: string; name: string } | null>(null);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (catFilter !== "Category") params.append("category", catFilter);
      if (brandFilter !== "Brand") params.append("brand", brandFilter);
      if (statusFilter !== "Status") params.append("status", statusFilter);
      params.append("page", String(page));
      params.append("limit", String(rowsPerPage));

      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
        if (data.totalPages) setTotalPages(data.totalPages);
      }
    } catch {
      // Keep existing products if fetch fails
    } finally {
      setLoading(false);
    }
  }, [search, catFilter, brandFilter, statusFilter, page, rowsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch category & brand filter options
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data && Array.isArray(d.data)) {
          setCategories(["Category", ...d.data.map((c: { name: string }) => c.name)]);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/brands`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data && Array.isArray(d.data)) {
          setBrands(["Brand", ...d.data.map((b: { name: string }) => b.name), "---"]);
        }
      })
      .catch(() => {});
  }, []);

  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      const res = await fetch(`${API_BASE}/products/${deletingProduct.id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer super_admin_authenticated" },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id && p._id !== deletingProduct.id));
      }
    } catch {
      alert("Error deleting product");
    }
  };

  const toggleProductStatus = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: "Bearer super_admin_authenticated" },
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            (p.id === id || p._id === id) ? { ...p, isActive: data.data.isActive } : p
          )
        );
      }
    } catch { /* ignore */ }
  };

  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelected(e.target.checked ? products.map((p) => p.id) : []);
  const toggleOne = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <AdminShell>
      {/* Page header */}
      <div className="sc-page-header">
        <div>
          <h1 className="sc-page-title">Products</h1>
          <div className="sc-breadcrumbs">
            <span>Dashboard</span><span>›</span>
            <span style={{ color: "#3B2C24", fontWeight: 500 }}>Products</span>
          </div>
        </div>
        <div className="sc-action-buttons">
          <button className="sc-btn-export pdf" title="PDF"><FaFilePdf size={14} /></button>
          <button className="sc-btn-export excel" title="Excel"><FaFileExcel size={14} /></button>
          <Link href="/products/new" className="sc-btn-add">Add Product</Link>
        </div>
      </div>

      {/* Table card */}
      <div className="sc-card">
        {/* Toolbar */}
        <div className="sc-table-toolbar">
          <div className="sc-card-search">
            <FiSearch className="search-icon" size={14} />
            <input
              type="text"
              placeholder="Search by name or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="sc-filter-group">
            {[
              { val: catFilter, set: setCatFilter, opts: categories },
              { val: brandFilter, set: setBrandFilter, opts: brands },
              { val: statusFilter, set: setStatusFilter, opts: ["Status", "Active", "Inactive"] },
            ].map(({ val, set, opts }, idx) => (
              <div key={idx} className="sc-select-filter">
                <select value={val} onChange={(e) => set(e.target.value)}>
                  {opts.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <FiChevronDown className="select-arrow" size={12} />
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <table className="sc-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={products.length > 0 && selected.length === products.length}
                  style={{ accentColor: "#541A28" }}
                />
              </th>
              <th>Code ⇅</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Qty</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const rowId = p.id || p._id || p.code;
              return (
                <tr key={rowId} className={selected.includes(rowId) ? "selected" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(rowId)}
                      onChange={() => toggleOne(rowId)}
                      style={{ accentColor: "#541A28" }}
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.code}</td>
                  <td>
                    <div className="sc-prod-cell">
                      <Image
                        src={p.img || "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=100&q=80"}
                        alt={p.name}
                        width={32}
                        height={32}
                        className="sc-prod-img"
                        unoptimized
                      />
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.brand}</td>
                  <td style={{ fontWeight: 600 }}>{p.price}</td>
                  <td>{p.unit}</td>
                  <td>{p.qty}</td>
                  <td>
                    <button
                      onClick={() => toggleProductStatus(p._id || p.id)}
                      title={`Click to mark ${p.isActive === false ? 'Active' : 'Inactive'}`}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        height: 24, padding: "0 10px", borderRadius: 4,
                        fontSize: 11, fontWeight: 600, border: "none",
                        cursor: "pointer",
                        background: p.isActive === false ? "#DC2626" : "#16A34A",
                        color: "#FFF",
                      }}
                    >
                      • {p.isActive === false ? "Inactive" : "Active"}
                    </button>
                  </td>
                  <td>
                    <div className="sc-action-group">
                      <button
                        className="sc-row-btn"
                        title="View Details"
                        onClick={() => setViewingProduct(p)}
                      >
                        <FiEye size={12} />
                      </button>
                      <button className="sc-row-btn" title="Edit"><FiEdit size={12} /></button>
                      <button
                        className="sc-row-btn delete"
                        title="Delete"
                        onClick={() => setDeletingProduct({ id: p._id || p.id, name: p.name })}
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="sc-table-footer">
          <div className="sc-rows-per-page">
            <span>Row Per Page</span>
            <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
              {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>Entries</span>
          </div>
          <div className="sc-pagination">
            <button
              className="sc-page-btn arrow"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <FiChevronLeft size={14} />
            </button>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                className={`sc-page-btn${page === n ? " active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <span style={{ color: "#9CA3AF" }}>...</span>
            <button
              className={`sc-page-btn${page === 15 ? " active" : ""}`}
              onClick={() => setPage(15)}
            >
              15
            </button>
            <button
              className="sc-page-btn arrow"
              onClick={() => setPage((p) => Math.min(15, p + 1))}
              disabled={page === 15}
            >
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={viewingProduct}
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        itemName={deletingProduct?.name || ""}
        itemType="product"
        onConfirm={confirmDeleteProduct}
        onClose={() => setDeletingProduct(null)}
      />
    </AdminShell>
  );
}
