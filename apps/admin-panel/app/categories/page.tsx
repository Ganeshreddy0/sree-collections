"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import EditCategoryModal, { CategoryData } from "@/components/EditCategoryModal";

import { API_BASE as API } from "@/lib/config";
const AUTH = "Bearer super_admin_authenticated";

interface CategoryItem {
  _id: string;
  id: string;
  name: string;
  slug: string;
  date: string;
  status: "Active" | "Inactive";
  description?: string;
  image?: string;
  featured?: boolean;
  tag?: string;
  badge?: string;
  startingPrice?: string;
}

function StatusBadge({ status, onClick }: { status: string; onClick: () => void }) {
  const active = status === "Active";
  return (
    <button
      onClick={onClick}
      title={`Click to mark ${active ? "Inactive" : "Active"}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4, height: 24,
        padding: "0 10px", borderRadius: 4, fontSize: 11, fontWeight: 600,
        border: "none", cursor: "pointer",
        background: active ? "#16A34A" : "#DC2626", color: "#FFFFFF",
        transition: "opacity 0.15s",
      }}
    >
      • {status}
    </button>
  );
}

export default function CategoriesPage() {
  const [rows, setRows] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [selected, setSelected] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<{ id: string; name: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "Status") params.append("status", statusFilter);
      const res = await fetch(`${API}/categories?${params}`);
      const data = await res.json();
      if (data.success) setRows(data.data);
    } catch { /* keep existing */ }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleStatus = async (id: string) => {
    const res = await fetch(`${API}/categories/${id}/status`, { method: "PATCH", headers: { Authorization: AUTH } });
    const data = await res.json();
    if (data.success) {
      try {
        localStorage.setItem("category_updated_at", Date.now().toString());
        new BroadcastChannel("cms_sync").postMessage("category_updated");
      } catch { /* noop */ }
      setRows((prev) => prev.map((r) => r.id === id ? { ...r, status: data.data.status } : r));
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    const res = await fetch(`${API}/categories/${deletingCategory.id}`, { method: "DELETE", headers: { Authorization: AUTH } });
    if (res.ok) {
      try {
        localStorage.setItem("category_updated_at", Date.now().toString());
        new BroadcastChannel("cms_sync").postMessage("category_updated");
      } catch { /* noop */ }
      setRows((prev) => prev.filter((r) => r.id !== deletingCategory.id));
    }
  };

  const handleSaveCategory = (updated: CategoryData) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === updated.id
          ? {
              ...r,
              name: updated.name,
              slug: updated.slug,
              status: updated.status,
              description: updated.description,
              image: updated.image,
              featured: updated.featured,
              tag: updated.tag,
              badge: updated.badge,
              startingPrice: updated.startingPrice,
            }
          : r
      )
    );
  };

  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelected(e.target.checked ? rows.map((r) => r.id) : []);
  const toggleOne = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <AdminShell>
      <div className="sc-page-header">
        <div>
          <h1 className="sc-page-title">Category</h1>
          <div className="sc-breadcrumbs">
            <span>Products</span><span>›</span>
            <span style={{ color: "#3B2C24", fontWeight: 500 }}>Category</span>
          </div>
        </div>
        <div className="sc-action-buttons">
          <button className="sc-btn-export pdf" title="PDF"><FaFilePdf size={14} /></button>
          <button className="sc-btn-export excel" title="Excel"><FaFileExcel size={14} /></button>
          <Link href="/categories/new" className="sc-btn-add">Add Category</Link>
        </div>
      </div>

      <div className="sc-card">
        <div className="sc-table-toolbar">
          <div className="sc-card-search">
            <FiSearch className="search-icon" size={14} />
            <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="sc-status-filter">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {["Status", "Active", "Inactive"].map((o) => <option key={o}>{o}</option>)}
            </select>
            <FiChevronDown className="select-arrow" size={12} />
          </div>
        </div>

        <table className="sc-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><input type="checkbox" onChange={toggleAll} checked={rows.length > 0 && selected.length === rows.length} style={{ accentColor: "#541A28" }} /></th>
              <th>Category</th>
              <th>Category Slug</th>
              <th>Created Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#9CA3AF" }}>Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#9CA3AF" }}>No categories found.</td></tr>
            ) : rows.map((c) => (
              <tr key={c.id} className={selected.includes(c.id) ? "selected" : ""}>
                <td><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleOne(c.id)} style={{ accentColor: "#541A28" }} /></td>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td style={{ color: "#42342D" }}>{c.slug}</td>
                <td style={{ color: "#42342D" }}>{c.date}</td>
                <td><StatusBadge status={c.status} onClick={() => toggleStatus(c.id)} /></td>
                <td>
                  <div className="sc-action-2">
                    <button
                      className="sc-row-btn"
                      title="Edit"
                      onClick={() => setEditingCategory(c)}
                    >
                      <FiEdit size={12} />
                    </button>
                    <button className="sc-row-btn delete" title="Delete" onClick={() => setDeletingCategory({ id: c.id, name: c.name })}><FiTrash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="sc-table-footer">
          <div className="sc-rows-per-page">
            <span>Row Per Page</span>
            <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
              {[10, 20, 50].map((n) => <option key={n}>{n}</option>)}
            </select>
            <span>Entries</span>
          </div>
          <div className="sc-pagination">
            <button className="sc-page-btn arrow" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><FiChevronLeft size={14} /></button>
            {[1, 2, 3].map((n) => <button key={n} className={`sc-page-btn${page === n ? " active" : ""}`} onClick={() => setPage(n)}>{n}</button>)}
            <button className="sc-page-btn arrow" onClick={() => setPage((p) => p + 1)}><FiChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={!!deletingCategory}
        itemName={deletingCategory?.name || ""}
        itemType="category"
        onConfirm={confirmDeleteCategory}
        onClose={() => setDeletingCategory(null)}
      />

      <EditCategoryModal
        isOpen={!!editingCategory}
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSaveSuccess={handleSaveCategory}
      />
    </AdminShell>
  );
}
