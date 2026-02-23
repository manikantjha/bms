"use client";

import { useState, useEffect, useCallback } from "react";
import { Delete, Edit, Plus, Trash, Trash2 } from "lucide-react";
import { useAdminFetch } from "@/lib/admin-auth-client";
import AdminPageHeader from "@/components/admin/admin-page-header";
import DataTable, { type Column } from "@/components/admin/data-table";
import Modal from "@/components/admin/modal";
import ServiceForm, {
  type ServiceFormPayload,
} from "@/components/admin/service-form";
import type { Service, Category } from "@/types/database.types";

export default function AdminServicesPage() {
  const { adminFetch } = useAdminFetch();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [svcRes, catRes] = await Promise.all([
        adminFetch("/api/services"),
        adminFetch("/api/categories"),
      ]);
      const svcJson = await svcRes.json();
      const catJson = await catRes.json();
      if (svcJson.success) setServices(svcJson.data);
      if (catJson.success) setCategories(catJson.data);
    } catch (err) {
      console.error({ context: "AdminServices:loadData", error: err });
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openAdd() {
    setEditingService(null);
    setModalOpen(true);
  }

  function openEdit(service: Service) {
    setEditingService(service);
    setModalOpen(true);
  }

  async function handleSubmit(data: ServiceFormPayload) {
    const url = editingService
      ? `/api/services/${editingService.id}`
      : "/api/services";
    const method = editingService ? "PUT" : "POST";

    const res = await adminFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    setModalOpen(false);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Disable this service?")) return;
    await adminFetch(`/api/services/${id}`, { method: "DELETE" });
    loadData();
  }

  const columns: Column<Service>[] = [
    { key: "name", header: "Name" },
    {
      key: "category",
      header: "Category",
      render: (s) => {
        const cat = categories.find((c) => c.id === s.category_id);
        return cat?.name ?? "—";
      },
    },
    {
      key: "price",
      header: "Price",
      render: (s) => `₹${s.price.toLocaleString()}`,
    },
    {
      key: "duration_minutes",
      header: "Duration",
      render: (s) => (s.duration_minutes ? `${s.duration_minutes} min` : "—"),
    },
    {
      key: "is_active",
      header: "Status",
      render: (s) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            s.is_active
              ? "bg-emerald-100 text-emerald-800"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {s.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (s) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(s);
            }}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(s.id);
            }}
            className="text-xs text-red-500 hover:underline cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

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
        title="Services"
        subtitle="Manage your service offerings"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-semibold hover:bg-primary-dark transition-colors text-sm"
          >
            <Plus size={16} />
            Add Service
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={services}
        emptyMessage="No services yet. Add your first service!"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? "Edit Service" : "Add Service"}
      >
        <ServiceForm
          service={editingService}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
