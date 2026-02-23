"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminFetch } from "@/lib/admin-auth-client";
import AdminPageHeader from "@/components/admin/admin-page-header";
import DataTable, { type Column } from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import type { ContactRequest } from "@/types/database.types";

type ContactFilter = "all" | "quotes" | "unresponded";

export default function AdminContactsPage() {
  const { adminFetch } = useAdminFetch();
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ContactFilter>("all");

  const loadContacts = useCallback(async () => {
    try {
      const res = await adminFetch("/api/contacts");
      const json = await res.json();
      if (json.success) setContacts(json.data);
    } catch (err) {
      console.error({ context: "AdminContacts:load", error: err });
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  async function markResponded(id: string) {
    try {
      const res = await adminFetch(`/api/contacts/${id}`, { method: "PUT" });
      const json = await res.json();
      if (json.success) {
        setContacts((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, responded_at: new Date().toISOString() } : c,
          ),
        );
      }
    } catch (err) {
      console.error({ context: "AdminContacts:markResponded", error: err });
    }
  }

  const filtered = contacts.filter((c) => {
    if (filter === "quotes") return c.is_quote_request;
    if (filter === "unresponded") return !c.responded_at;
    return true;
  });

  const filterButtons: { label: string; value: ContactFilter }[] = [
    { label: "All", value: "all" },
    { label: "Quote Requests", value: "quotes" },
    { label: "Unresponded", value: "unresponded" },
  ];

  const columns: Column<ContactRequest>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "is_quote_request",
      header: "Type",
      render: (c) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            c.is_quote_request
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {c.is_quote_request ? "Quote" : "Message"}
        </span>
      ),
    },
    {
      key: "message",
      header: "Message",
      render: (c) => (
        <span className="block max-w-xs truncate" title={c.message}>
          {c.message}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      render: (c) => new Date(c.created_at).toLocaleDateString(),
    },
    {
      key: "responded_at",
      header: "Status",
      render: (c) => (
        <StatusBadge status={c.responded_at ? "responded" : "pending"} />
      ),
    },
    {
      key: "actions",
      header: "",
      render: (c) =>
        !c.responded_at ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              markResponded(c.id);
            }}
            className="text-xs text-primary hover:underline whitespace-nowrap"
          >
            Mark Responded
          </button>
        ) : null,
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
        title="Contact Requests"
        subtitle={`${contacts.length} requests · ${contacts.filter((c) => !c.responded_at).length} unresponded`}
      />

      <div className="flex gap-2 mb-6">
        {filterButtons.map((fb) => (
          <button
            key={fb.value}
            onClick={() => setFilter(fb.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === fb.value
                ? "bg-primary text-white"
                : "bg-surface border border-border text-text-muted hover:bg-primary/5"
            }`}
          >
            {fb.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No contact requests match your filter"
      />
    </div>
  );
}
