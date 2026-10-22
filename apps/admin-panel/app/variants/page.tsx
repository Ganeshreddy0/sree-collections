"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

import { API_BASE as API } from "@/lib/config";
const AUTH = "Bearer super_admin_authenticated";

interface VariantItem {
  _id: string; id: string; name: string; value: string; status: "Active" | "Inactive"; date: string;
}

function StatusBadge({ status, onClick }: { status: string; onClick: () => void }) {
  return (
    <button onClick={onClick} title={`Click to mark ${status === "Active" ? "Inactive" : "Active"}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 24, padding: "0 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", background: status === "Active" ? "#16A34A" : "#DC2626", color: "#FFF" }}>
      • {status}
    </button>
  );
}

export default function VariantsPage() {
  const [rows, setRows] = useState<VariantItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [selected, setSelected] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [deletingVariant, setDeletingVariant] = useState<{ id: string; name: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "Status") params.append("status", statusFilter);
      const res = await fetch(`${API}/variants?${params}`);
      const data = await res.json();
      if (data.success) setRows(data.data);
    } catch { /* keep existing */ }
  }, [search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleStatus = async (id: string) => {
    const res = await fetch(`${API}/variants/${id}/status`, { method: "PATCH", headers: { Authorization: AUTH } });
    const data = await res.json();
    if (data.success) setRows((prev) => prev.map((r) => r.id === id ? { ...r, status: data.data.status } : r));
  };

  const confirmDeleteVariant = async () => {
    if (!deletingVariant) return;
    const res = await fetch(`${API}/variants/${deletingVariant.id}`, { method: "DELETE", headers: { Authorization: AUTH } });
    if (res.ok) setRows((prev) => prev.filter((r) => r.id !== deletingVariant.id));
  };

  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelected(e.target.checked ? rows.map((r) => r.id) : []);
  const toggleOne = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <AdminShell>
      <div className="sc-page-header">
        <div>
          <h1 className="sc-page-title">Variant Attributes</h1>
          <div className="sc-breadcrumbs"><span>Products</span><span>›</span><span style={{ color: "#3B2C24", fontWeight: 500 }}>Variant Attributes</span></div>
        </div>
        <div className="sc-action-buttons">
          <button className="sc-btn-export pdf"><FaFilePdf size={14} /></button>
          <button className="sc-btn-export excel"><FaFileExcel size={14} /></button>
          <Link href="/variants/new" className="sc-btn-add">Add Attribute</Link>
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
              <th>Attribute Name</th><th>Values</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "#9CA3AF" }}>No variant attributes found.</td></tr>
            ) : rows.map((v) => (
              <tr key={v.id} className={selected.includes(v.id) ? "selected" : ""}>
                <td><input type="checkbox" checked={selected.includes(v.id)} onChange={() => toggleOne(v.id)} style={{ accentColor: "#541A28" }} /></td>
                <td style={{ fontWeight: 500 }}>{v.name}</td>
                <td style={{ color: "#42342D", fontSize: 12 }}>{v.value}</td>
                <td><StatusBadge status={v.status} onClick={() => toggleStatus(v.id)} /></td>
                <td>
                  <div className="sc-action-2">
                    <button className="sc-row-btn"><FiEdit size={12} /></button>
                    <button className="sc-row-btn delete" onClick={() => setDeletingVariant({ id: v.id, name: v.name })}><FiTrash2 size={12} /></button>
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
        isOpen={!!deletingVariant}
        itemName={deletingVariant?.name || ""}
        itemType="variant attribute"
        onConfirm={confirmDeleteVariant}
        onClose={() => setDeletingVariant(null)}
      />
    </AdminShell>
  );
}
