"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import EditSubCategoryModal, { SubCategoryData } from "@/components/EditSubCategoryModal";

import { API_BASE as API } from "@/lib/config";
const AUTH = "Bearer super_admin_authenticated";

interface SubCatItem {
  _id: string; id: string; name: string; category: string; status: "Active" | "Inactive"; date: string;
}

function StatusBadge({ status, onClick }: { status: string; onClick: () => void }) {
  return (
    <button onClick={onClick} title={`Click to mark ${status === "Active" ? "Inactive" : "Active"}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 24, padding: "0 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", background: status === "Active" ? "#16A34A" : "#DC2626", color: "#FFF" }}>
      • {status}
    </button>
  );
}

export default function SubCategoriesPage() {
  const [rows, setRows] = useState<SubCatItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [selected, setSelected] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [deletingSubCategory, setDeletingSubCategory] = useState<{ id: string; name: string } | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCatItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "Status") params.append("status", statusFilter);
      const res = await fetch(`${API}/sub-categories?${params}`);
      const data = await res.json();
      if (data.success) setRows(data.data);
    } catch { /* keep existing */ }
  }, [search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleStatus = async (id: string) => {
    const res = await fetch(`${API}/sub-categories/${id}/status`, { method: "PATCH", headers: { Authorization: AUTH } });
    const data = await res.json();
    if (data.success) setRows((prev) => prev.map((r) => r.id === id ? { ...r, status: data.data.status } : r));
  };

  const confirmDeleteSubCategory = async () => {
    if (!deletingSubCategory) return;
    const res = await fetch(`${API}/sub-categories/${deletingSubCategory.id}`, { method: "DELETE", headers: { Authorization: AUTH } });
    if (res.ok) setRows((prev) => prev.filter((r) => r.id !== deletingSubCategory.id));
  };

  const handleSaveSubCategory = (updated: SubCategoryData) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === updated.id
          ? {
              ...r,
              name: updated.name,
              category: updated.category,
              status: updated.status,
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
          <h1 className="sc-page-title">Sub Category</h1>
          <div className="sc-breadcrumbs"><span>Products</span><span>›</span><span style={{ color: "#3B2C24", fontWeight: 500 }}>Sub Category</span></div>
        </div>
        <div className="sc-action-buttons">
          <button className="sc-btn-export pdf"><FaFilePdf size={14} /></button>
          <button className="sc-btn-export excel"><FaFileExcel size={14} /></button>
          <Link href="/sub-categories/new" className="sc-btn-add">Add Sub Category</Link>
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
              <th>Sub Category</th><th>Category</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "#9CA3AF" }}>No sub categories found.</td></tr>
            ) : rows.map((c) => (
              <tr key={c.id} className={selected.includes(c.id) ? "selected" : ""}>
                <td><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleOne(c.id)} style={{ accentColor: "#541A28" }} /></td>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td style={{ color: "#42342D" }}>{c.category}</td>
                <td><StatusBadge status={c.status} onClick={() => toggleStatus(c.id)} /></td>
                <td>
                  <div className="sc-action-2">
                    <button
                      className="sc-row-btn"
                      title="Edit"
                      onClick={() => setEditingSubCategory(c)}
                    >
                      <FiEdit size={12} />
                    </button>
                    <button className="sc-row-btn delete" title="Delete" onClick={() => setDeletingSubCategory({ id: c.id, name: c.name })}><FiTrash2 size={12} /></button>
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
        isOpen={!!deletingSubCategory}
        itemName={deletingSubCategory?.name || ""}
        itemType="sub category"
        onConfirm={confirmDeleteSubCategory}
        onClose={() => setDeletingSubCategory(null)}
      />

      <EditSubCategoryModal
        isOpen={!!editingSubCategory}
        subCategory={editingSubCategory}
        onClose={() => setEditingSubCategory(null)}
        onSaveSuccess={handleSaveSubCategory}
      />
    </AdminShell>
  );
}
