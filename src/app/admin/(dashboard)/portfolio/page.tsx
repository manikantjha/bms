"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import { useAdminFetch } from "@/lib/admin-auth-client";
import AdminPageHeader from "@/components/admin/admin-page-header";
import Modal from "@/components/admin/modal";
import PortfolioForm, {
  type PortfolioFormPayload,
} from "@/components/admin/portfolio-form";
import type { PortfolioItem } from "@/types/database.types";

export default function AdminPortfolioPage() {
  const { adminFetch } = useAdminFetch();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  const loadItems = useCallback(async () => {
    try {
      const res = await adminFetch("/api/portfolio");
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch (err) {
      console.error({ context: "AdminPortfolio:load", error: err });
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function openAdd() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function openEdit(item: PortfolioItem) {
    setEditingItem(item);
    setModalOpen(true);
  }

  async function handleSubmit(data: PortfolioFormPayload) {
    const url = editingItem
      ? `/api/portfolio/${editingItem.id}`
      : "/api/portfolio";
    const method = editingItem ? "PUT" : "POST";

    const res = await adminFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    setModalOpen(false);
    loadItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this portfolio item?")) return;
    await adminFetch(`/api/portfolio/${id}`, { method: "DELETE" });
    loadItems();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Portfolio"
        subtitle="Manage your work gallery"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-semibold hover:bg-primary-dark transition-colors text-sm"
          >
            <Plus size={16} />
            Add Item
          </button>
        }
      />

      {items.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center">
          <p className="text-text-muted">
            No portfolio items yet. Add your first work!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-surface rounded-2xl border border-border overflow-hidden group"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.is_featured && (
                  <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 rounded-full p-1.5">
                    <Star size={14} fill="currentColor" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(item)}
                    className="bg-white text-text px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-white text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-text text-sm">{item.title}</h3>
                {item.category && (
                  <p className="text-xs text-text-muted mt-1">
                    {item.category}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}
        maxWidth="max-w-xl"
      >
        <PortfolioForm
          item={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
