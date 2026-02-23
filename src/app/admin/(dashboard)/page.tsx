"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Scissors,
  ImageIcon,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAdminFetch } from "@/lib/admin-auth-client";
import AdminPageHeader from "@/components/admin/admin-page-header";
import StatCard from "@/components/admin/stat-card";
import DataTable, { type Column } from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import type { AdminStats } from "@/types/admin.types";
import type { Booking } from "@/types/database.types";

export default function AdminDashboardPage() {
  const { adminFetch } = useAdminFetch();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminFetch("/api/admin/stats");
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch (err) {
        console.error({ context: "AdminDashboard:loadStats", error: err });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [adminFetch]);

  const bookingColumns: Column<Booking>[] = [
    { key: "customer_name", header: "Customer" },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Dashboard" subtitle="Overview of your business" />

      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Total Bookings"
              value={stats.totalBookings}
              icon={CalendarDays}
            />
            <StatCard
              label="Pending"
              value={stats.pendingBookings}
              icon={Clock}
              color="text-amber-500"
            />
            <StatCard
              label="Confirmed"
              value={stats.confirmedBookings}
              icon={CheckCircle}
              color="text-emerald-500"
            />
            <StatCard
              label="Services"
              value={stats.totalServices}
              icon={Scissors}
            />
            <StatCard
              label="Portfolio Items"
              value={stats.totalPortfolioItems}
              icon={ImageIcon}
            />
            <StatCard
              label="Contact Requests"
              value={stats.totalContactRequests}
              icon={MessageSquare}
            />
          </div>

          <h2 className="font-heading text-lg font-bold text-text mb-4">
            Recent Bookings
          </h2>
          <DataTable
            columns={bookingColumns}
            data={stats.recentBookings}
            onRowClick={(b) => router.push(`/admin/bookings/${b.id}`)}
            emptyMessage="No bookings yet"
          />
        </>
      )}
    </div>
  );
}
