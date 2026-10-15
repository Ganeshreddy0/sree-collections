"use client";

import React, { useState, useEffect } from "react";
import { FiAlertTriangle, FiX, FiTrash2 } from "react-icons/fi";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName: string;
  itemType?: string; // e.g. "product", "category", "brand"
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  itemName,
  itemType = "item",
  onConfirm,
  onClose,
  loading = false,
}: DeleteConfirmModalProps) {
  const [typedName, setTypedName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTypedName("");
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatched = typedName.trim().toLowerCase() === itemName.trim().toLowerCase();

  const handleConfirm = async () => {
    if (!isMatched || isDeleting || loading) return;
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // handled by caller
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isMatched) {
      handleConfirm();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(35, 23, 20, 0.55)",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          border: "1px solid #EFE8E0",
          overflow: "hidden",
          animation: "scaleIn 0.18s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #F3ECE2",
            backgroundColor: "#FAF6F0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiAlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#3B2C24" }}>
                {title || `Delete ${itemType}`}
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#8C7A6B" }}>
                Confirm permanent deletion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9CA3AF",
              padding: 4,
              display: "flex",
              borderRadius: "4px",
            }}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: "13px", color: "#4B5563", lineHeight: 1.5, margin: "0 0 14px 0" }}>
            This action <strong style={{ color: "#DC2626" }}>cannot be undone</strong>. This will permanently remove this {itemType} from the database.
          </p>

          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "#FFFBEB",
              border: "1px solid #FDE68A",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: "12px", color: "#92400E" }}>
              Please type <strong style={{ color: "#B45309", wordBreak: "break-all" }}>{itemName}</strong> to confirm:
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              autoFocus
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Type "${itemName}" here`}
              disabled={isDeleting}
              style={{
                width: "100%",
                height: "40px",
                padding: "0 12px",
                borderRadius: "6px",
                border: `1.5px solid ${
                  typedName
                    ? isMatched
                      ? "#16A34A"
                      : "#DC2626"
                    : "#D8C4AA"
                }`,
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "#FFFFFF",
                color: "#1F2937",
              }}
            />
          </div>
          {typedName && !isMatched && (
            <p style={{ fontSize: "11px", color: "#DC2626", margin: "6px 0 0 0" }}>
              Name doesn&apos;t match. Please type exactly as shown above.
            </p>
          )}
          {isMatched && (
            <p style={{ fontSize: "11px", color: "#16A34A", margin: "6px 0 0 0", fontWeight: 600 }}>
              ✓ Name verified
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "14px 20px",
            backgroundColor: "#FAF6F0",
            borderTop: "1px solid #F3ECE2",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={{
              height: "36px",
              padding: "0 16px",
              borderRadius: "6px",
              border: "1px solid #D8C4AA",
              backgroundColor: "#FFFFFF",
              color: "#4B5563",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isMatched || isDeleting || loading}
            style={{
              height: "36px",
              padding: "0 18px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: isMatched ? "#DC2626" : "#E5E7EB",
              color: isMatched ? "#FFFFFF" : "#9CA3AF",
              fontSize: "13px",
              fontWeight: 600,
              cursor: isMatched && !isDeleting ? "pointer" : "not-allowed",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s ease",
            }}
          >
            <FiTrash2 size={13} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
