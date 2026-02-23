"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminFetch } from "@/lib/admin-auth-client";
import AdminPageHeader from "@/components/admin/admin-page-header";
import DataTable, { type Column } from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import type { Booking } from "@/types/database.types";

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled";

export default function AdminBookingsPage() {
  const { adminFetch } = useAdminFetch();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const loadBookings = useCallback(async () => {
    try {
      const res = await adminFetch("/api/bookings");
      const json = await res.json();
      if (json.success) setBookings(json.data);
    } catch (err) {
      console.error({ context: "AdminBookings:load", error: err });
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filtered = bookings.filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.customer_name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: Column<Booking>[] = [
    { key: "customer_name", header: "Customer" },
    { key: "email", header: "Email" },
    {
      key: "event_date",
      header: "Event Date",
      render: (b) => new Date(b.event_date).toLocaleDateString(),
    },
    { key: "event_time", header: "Time" },
    {
      key: "total_price",
      header: "Total",
      render: (b) => `₹${b.total_price.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (b) => <StatusBadge status={b.status} />,
    },
  ];

  const filterButtons: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Cancelled", value: "cancelled" },
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
        title="Bookings"
        subtitle={`${bookings.length} total bookings`}
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2">
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
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm sm:ml-auto sm:w-64"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(b) => router.push(`/admin/bookings/${b.id}`)}
        emptyMessage="No bookings match your filters"
      />
    </div>
  );
}
