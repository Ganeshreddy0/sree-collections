"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import AdminShell from "@/components/AdminShell";
import {
  FiSearch,
  FiChevronDown,
  FiEye,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiX,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiCreditCard,
  FiSend,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api";

interface OrderItem {
  title: string;
  colour?: string;
  size?: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

interface WhatsAppLog {
  timestamp: string;
  type: string;
  status: string;
  recipient: string;
  messageId?: string;
  error?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  whatsappNumber: string;
  customerEmail?: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  notes?: string;
  createdAt: string;
  shippingAddress: {
    fullName?: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
  whatsappNotification: {
    status: "sent" | "failed" | "not_configured" | "pending";
    messageId?: string;
    sentAt?: string;
    lastAttemptAt?: string;
    error?: string;
    attempts: number;
    templateName?: string;
    logs?: WhatsAppLog[];
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [waFilter, setWaFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Modal actions state
  const [newStatus, setNewStatus] = useState("");
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [retryingWa, setRetryingWa] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch orders from backend
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (waFilter !== "All") params.append("whatsappStatus", waFilter);

      const res = await fetch(`${API_BASE}/orders?${params.toString()}`, {
        headers: {
          Authorization: "Bearer demo_token",
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, waFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Open modal
  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setActionMessage(null);
  };

  // Update order status with optional WhatsApp status notification
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    setActionMessage(null);

    try {
      const res = await fetch(`${API_BASE}/orders/${selectedOrder._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer demo_token",
        },
        body: JSON.stringify({
          orderStatus: newStatus,
          sendWhatsAppNotification: notifyWhatsApp,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setSelectedOrder(data.data);
        setActionMessage({
          type: "success",
          text: `Order status updated to "${newStatus}".${
            notifyWhatsApp ? " WhatsApp notification triggered." : ""
          }`,
        });
        fetchOrders();
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Status update failed" });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Retry sending WhatsApp confirmation
  const handleRetryWhatsApp = async (orderId: string) => {
    setRetryingWa(true);
    setActionMessage(null);

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/retry-whatsapp`, {
        method: "POST",
        headers: {
          Authorization: "Bearer demo_token",
        },
      });

      const data = await res.json();
      if (data.success && data.data) {
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(data.data);
        }
        setActionMessage({
          type: "success",
          text: `WhatsApp notification retry completed: ${data.data.whatsappNotification.status.toUpperCase()}`,
        });
        fetchOrders();
      } else {
        throw new Error(data.message || "Failed to retry WhatsApp notification");
      }
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Retry failed" });
    } finally {
      setRetryingWa(false);
    }
  };

  // Stats calculation
  const totalCount = orders.length;
  const confirmedCount = orders.filter((o) => o.orderStatus === "Confirmed" || o.orderStatus === "Processing").length;
  const shippedCount = orders.filter((o) => o.orderStatus === "Shipped" || o.orderStatus === "Delivered").length;
  const waSentCount = orders.filter((o) => o.whatsappNotification?.status === "sent").length;
  const waPendingSetupCount = orders.filter((o) => o.whatsappNotification?.status === "not_configured").length;

  return (
    <AdminShell>
      <div style={{ padding: "8px 0" }}>
        {/* Top Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "26px",
              fontWeight: 700,
              color: "#541A28",
              margin: "0 0 6px 0",
            }}
          >
            Orders & WhatsApp Confirmations
          </h1>
          <p style={{ fontSize: "13.5px", color: "#6B7280", margin: 0 }}>
            Manage saree customer orders, change statuses, and track Meta WhatsApp Business Cloud API message delivery.
          </p>
        </div>

        {/* Metric Cards Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "16px 20px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 600 }}>Total Orders</span>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#1F2937", marginTop: "4px" }}>
              {totalCount}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "16px 20px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 600 }}>Active / Processing</span>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#D97706", marginTop: "4px" }}>
              {confirmedCount}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "16px 20px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 600 }}>Shipped / Delivered</span>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#10B981", marginTop: "4px" }}>
              {shippedCount}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "16px 20px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: "12px", color: "#128C7E", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              <FaWhatsapp size={14} color="#25D366" />
              <span>WhatsApp Delivered</span>
            </span>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#128C7E", marginTop: "4px" }}>
              {waSentCount}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "16px 20px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: "12px", color: "#B45309", fontWeight: 600 }}>WhatsApp Pending Setup</span>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#B45309", marginTop: "4px" }}>
              {waPendingSetupCount}
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="sc-table-card" style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Search */}
            <div style={{ position: "relative", minWidth: "260px", flex: "1 1 260px" }}>
              <FiSearch
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                }}
              />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, Phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  paddingLeft: "38px",
                  paddingRight: "14px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13.5px",
                  outline: "none",
                }}
              />
            </div>

            {/* Status Filter */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  height: "40px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  padding: "0 12px",
                  fontSize: "13.5px",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <option value="All">All Order Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* WhatsApp Status Filter */}
              <select
                value={waFilter}
                onChange={(e) => setWaFilter(e.target.value)}
                style={{
                  height: "40px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  padding: "0 12px",
                  fontSize: "13.5px",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <option value="All">All WhatsApp Statuses</option>
                <option value="sent">Sent (Delivered)</option>
                <option value="not_configured">Setup Required (.env)</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>

              <button
                onClick={fetchOrders}
                title="Refresh Orders"
                style={{
                  height: "40px",
                  padding: "0 14px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                <FiRefreshCw size={14} className={loading ? "spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            overflowX: "auto",
          }}
        >
          <table className="sc-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#4B5563" }}>
                  Order ID
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#4B5563" }}>
                  Date
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#4B5563" }}>
                  Customer
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#4B5563" }}>
                  Saree Items
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#4B5563" }}>
                  Total Amount
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#4B5563" }}>
                  Order Status
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#4B5563" }}>
                  WhatsApp Status
                </th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#4B5563" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: "36px", textAlign: "center", color: "#6B7280" }}>
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "36px", textAlign: "center", color: "#6B7280" }}>
                    No orders found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const waStatus = ord.whatsappNotification?.status || "pending";
                  return (
                    <tr
                      key={ord._id}
                      style={{ borderBottom: "1px solid #F3F4F6", transition: "background-color 0.15s" }}
                    >
                      {/* Order ID */}
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#541A28", fontSize: "13.5px" }}>
                        #{ord.orderNumber}
                      </td>

                      {/* Date */}
                      <td style={{ padding: "12px 16px", fontSize: "12.5px", color: "#6B7280" }}>
                        {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
                          {new Date(ord.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 600, color: "#1F2937", fontSize: "13.5px" }}>
                          {ord.customerName}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#059669",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            marginTop: "2px",
                          }}
                        >
                          <FaWhatsapp size={12} color="#25D366" />
                          <span>+{ord.whatsappNumber || ord.customerPhone}</span>
                        </div>
                      </td>

                      {/* Items */}
                      <td style={{ padding: "12px 16px", maxWidth: "240px" }}>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                          {ord.items.map((it, i) => (
                            <span key={i} style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {it.quantity}x {it.title} {it.colour ? `(${it.colour})` : ""}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#8F6627", fontSize: "14px" }}>
                        ₹{ord.totalAmount.toLocaleString("en-IN")}
                      </td>

                      {/* Order Status */}
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: 600,
                            backgroundColor:
                              ord.orderStatus === "Delivered"
                                ? "#DEF7EC"
                                : ord.orderStatus === "Shipped"
                                ? "#E1EFFE"
                                : ord.orderStatus === "Processing" || ord.orderStatus === "Confirmed"
                                ? "#FEF3C7"
                                : ord.orderStatus === "Cancelled"
                                ? "#FDE8E8"
                                : "#F3F4F6",
                            color:
                              ord.orderStatus === "Delivered"
                                ? "#03543F"
                                : ord.orderStatus === "Shipped"
                                ? "#1E429F"
                                : ord.orderStatus === "Processing" || ord.orderStatus === "Confirmed"
                                ? "#92400E"
                                : ord.orderStatus === "Cancelled"
                                ? "#9B1C1C"
                                : "#374151",
                          }}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>

                      {/* WhatsApp Status Badge */}
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "3px 9px",
                            borderRadius: "999px",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            backgroundColor:
                              waStatus === "sent"
                                ? "#DEF7EC"
                                : waStatus === "not_configured"
                                ? "#FFFBEB"
                                : waStatus === "failed"
                                ? "#FDE8E8"
                                : "#F3F4F6",
                            color:
                              waStatus === "sent"
                                ? "#03543F"
                                : waStatus === "not_configured"
                                ? "#B45309"
                                : waStatus === "failed"
                                ? "#9B1C1C"
                                : "#6B7280",
                          }}
                        >
                          <FaWhatsapp size={12} color={waStatus === "sent" ? "#059669" : waStatus === "not_configured" ? "#D97706" : "#DC2626"} />
                          <span>
                            {waStatus === "sent" && "Sent"}
                            {waStatus === "not_configured" && "Setup Required"}
                            {waStatus === "failed" && "Failed"}
                            {waStatus === "pending" && "Pending"}
                          </span>
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                          <button
                            onClick={() => handleOpenModal(ord)}
                            title="View & Manage Order"
                            style={{
                              padding: "6px 10px",
                              borderRadius: "6px",
                              backgroundColor: "#F3F4F6",
                              color: "#374151",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <FiEye size={14} />
                            <span>Manage</span>
                          </button>

                          <button
                            onClick={() => handleRetryWhatsApp(ord._id)}
                            title="Retry WhatsApp Notification"
                            style={{
                              padding: "6px 8px",
                              borderRadius: "6px",
                              backgroundColor: "rgba(37,211,102,0.12)",
                              color: "#128C7E",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            <FaWhatsapp size={14} color="#25D366" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS & STATUS MANAGEMENT MODAL */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "760px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              padding: "28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #E5E7EB",
                paddingBottom: "16px",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#541A28",
                    margin: "0 0 4px 0",
                  }}
                >
                  Manage Order #{selectedOrder.orderNumber}
                </h2>
                <span style={{ fontSize: "12.5px", color: "#6B7280" }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "#6B7280",
                  padding: "6px",
                }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Notification alert */}
            {actionMessage && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "18px",
                  fontSize: "13px",
                  fontWeight: 600,
                  backgroundColor: actionMessage.type === "success" ? "#DEF7EC" : "#FDE8E8",
                  color: actionMessage.type === "success" ? "#03543F" : "#9B1C1C",
                }}
              >
                {actionMessage.text}
              </div>
            )}

            {/* Customer & Address Details */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                backgroundColor: "#F9FAFB",
                padding: "16px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>
                  Customer
                </span>
                <div style={{ fontWeight: 600, color: "#1F2937", fontSize: "14px", marginTop: "2px" }}>
                  {selectedOrder.customerName}
                </div>
                <div style={{ fontSize: "13px", color: "#059669", display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                  <FaWhatsapp size={14} color="#25D366" />
                  <span>+{selectedOrder.whatsappNumber || selectedOrder.customerPhone}</span>
                </div>
                {selectedOrder.customerEmail && (
                  <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
                    {selectedOrder.customerEmail}
                  </div>
                )}
              </div>

              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>
                  Delivery Address
                </span>
                <div style={{ fontSize: "13px", color: "#374151", marginTop: "2px", lineHeight: 1.4 }}>
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}
                  <br />
                  {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>
                  Payment Info
                </span>
                <div style={{ fontSize: "13px", color: "#374151", marginTop: "2px" }}>
                  <strong>Method:</strong> {selectedOrder.paymentMethod}
                </div>
                <div style={{ fontSize: "13px", color: "#374151", marginTop: "2px" }}>
                  <strong>Status:</strong> {selectedOrder.paymentStatus}
                </div>
              </div>
            </div>

            {/* Saree Items */}
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#541A28", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>
                Ordered Sarees ({selectedOrder.items.length})
              </span>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#1F2937", fontSize: "13.5px" }}>{it.title}</div>
                      <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
                        {it.colour && <span style={{ marginRight: "10px" }}>Colour: <strong>{it.colour}</strong></span>}
                        {it.size && <span>Size: <strong>{it.size}</strong></span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        {it.quantity} × ₹{it.price.toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontWeight: 700, color: "#8F6627", fontSize: "14px" }}>
                        ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #E5E7EB", fontSize: "16px", fontWeight: 700 }}>
                <span>Total Amount:</span>
                <span style={{ color: "#541A28" }}>₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* WHATSAPP NOTIFICATION AUDIT & STATUS CARD */}
            <div
              style={{
                backgroundColor: "#F7FDF9",
                border: "1.5px solid #25D366",
                borderRadius: "12px",
                padding: "18px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaWhatsapp size={20} color="#25D366" />
                  <strong style={{ color: "#128C7E", fontSize: "15px" }}>Meta WhatsApp Cloud API Delivery</strong>
                </div>

                <button
                  onClick={() => handleRetryWhatsApp(selectedOrder._id)}
                  disabled={retryingWa}
                  style={{
                    backgroundColor: "#128C7E",
                    color: "#FFFFFF",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: retryingWa ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FiRefreshCw size={12} className={retryingWa ? "spin" : ""} />
                  <span>{retryingWa ? "Sending..." : "Resend / Retry Message"}</span>
                </button>
              </div>

              <div style={{ fontSize: "13px", color: "#374151", lineHeight: 1.5 }}>
                <div>
                  <strong>Status: </strong>
                  <span
                    style={{
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color:
                        selectedOrder.whatsappNotification.status === "sent"
                          ? "#059669"
                          : selectedOrder.whatsappNotification.status === "not_configured"
                          ? "#D97706"
                          : "#DC2626",
                    }}
                  >
                    {selectedOrder.whatsappNotification.status}
                  </span>
                </div>

                <div>
                  <strong>Recipient: </strong>
                  <span>+{selectedOrder.whatsappNumber || selectedOrder.customerPhone}</span>
                </div>

                {selectedOrder.whatsappNotification.messageId && (
                  <div>
                    <strong>Meta Message ID: </strong>
                    <code style={{ backgroundColor: "#E5E7EB", padding: "1px 6px", borderRadius: "4px" }}>
                      {selectedOrder.whatsappNotification.messageId}
                    </code>
                  </div>
                )}

                {selectedOrder.whatsappNotification.sentAt && (
                  <div>
                    <strong>Sent At: </strong>
                    <span>{new Date(selectedOrder.whatsappNotification.sentAt).toLocaleString("en-IN")}</span>
                  </div>
                )}

                {selectedOrder.whatsappNotification.error && (
                  <div style={{ marginTop: "6px", color: "#DC2626", fontSize: "12px" }}>
                    <strong>Note: </strong> {selectedOrder.whatsappNotification.error}
                  </div>
                )}
              </div>
            </div>

            {/* ORDER STATUS UPDATE FORM */}
            <div
              style={{
                backgroundColor: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1F2937", margin: "0 0 12px 0" }}>
                Update Order Status & Send WhatsApp Notification
              </h3>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center" }}>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{
                    height: "42px",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    padding: "0 14px",
                    fontSize: "14px",
                    backgroundColor: "#FFFFFF",
                    fontWeight: 600,
                    cursor: "pointer",
                    minWidth: "160px",
                  }}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={notifyWhatsApp}
                    onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#25D366" }}
                  />
                  <span>Send WhatsApp status update to customer</span>
                </label>

                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                  style={{
                    height: "42px",
                    padding: "0 20px",
                    borderRadius: "8px",
                    backgroundColor: "#541A28",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: updatingStatus ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "none",
                  }}
                >
                  <FiSend size={14} />
                  <span>{updatingStatus ? "Updating..." : "Save Status"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
