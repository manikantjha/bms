"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAdminFetch } from "@/lib/admin-auth-client";
import AdminPageHeader from "@/components/admin/admin-page-header";
import StatusBadge from "@/components/admin/status-badge";

interface BookingDetail {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  event_date: string;
  event_time: string;
  location: string | null;
  special_instructions: string | null;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  clients: Array<{
    id: string;
    client_name: string;
    services: Array<{
      id: string;
      service_price: number;
      service: { id: string; name: string };
    }>;
  }>;
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { adminFetch } = useAdminFetch();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadBooking = useCallback(async () => {
    try {
      const res = await adminFetch(`/api/bookings/${id}`);
      const json = await res.json();
      if (json.success) setBooking(json.data);
    } catch (err) {
      console.error({ context: "BookingDetail:load", error: err });
    } finally {
      setLoading(false);
    }
  }, [adminFetch, id]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  async function updateStatus(status: "confirmed" | "cancelled") {
    setUpdating(true);
    try {
      const res = await adminFetch(`/api/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setBooking((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch (err) {
      console.error({ context: "BookingDetail:updateStatus", error: err });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Booking not found</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/admin/bookings")}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Bookings
      </button>

      <AdminPageHeader
        title={booking.customer_name}
        subtitle={`Booked on ${new Date(booking.created_at).toLocaleDateString()}`}
        action={<StatusBadge status={booking.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info */}
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="font-heading text-base font-bold text-text mb-4">
              Event Details
            </h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-text-muted">Date</dt>
                <dd className="font-medium text-text">
                  {new Date(booking.event_date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Time</dt>
                <dd className="font-medium text-text">{booking.event_time}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Location</dt>
                <dd className="font-medium text-text">
                  {booking.location || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Total</dt>
                <dd className="font-medium text-text">
                  ₹{booking.total_price.toLocaleString()}
                </dd>
              </div>
            </dl>
            {booking.special_instructions && (
              <div className="mt-4 pt-4 border-t border-border">
                <dt className="text-sm text-text-muted mb-1">
                  Special Instructions
                </dt>
                <dd className="text-sm text-text">
                  {booking.special_instructions}
                </dd>
              </div>
            )}
          </div>

          {/* Clients & Services */}
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="font-heading text-base font-bold text-text mb-4">
              Clients & Services
            </h2>
            <div className="space-y-4">
              {booking.clients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 rounded-xl bg-background border border-border/50"
                >
                  <p className="font-medium text-text mb-2">
                    {client.client_name}
                  </p>
                  <ul className="space-y-1">
                    {client.services.map((svc) => (
                      <li
                        key={svc.id}
                        className="flex justify-between text-sm text-text-muted"
                      >
                        <span>{svc.service?.name ?? "Service"}</span>
                        <span>₹{svc.service_price.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="font-heading text-base font-bold text-text mb-4">
              Contact
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-muted">Email</dt>
                <dd className="font-medium text-text">{booking.email}</dd>
              </div>
              {booking.phone && (
                <div>
                  <dt className="text-text-muted">Phone</dt>
                  <dd className="font-medium text-text">{booking.phone}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Actions */}
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="font-heading text-base font-bold text-text mb-4">
              Actions
            </h2>
            <div className="space-y-3">
              {booking.status !== "confirmed" && (
                <button
                  onClick={() => updateStatus("confirmed")}
                  disabled={updating}
                  className="w-full bg-emerald-500 text-white py-2.5 rounded-full font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {updating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  Confirm Booking
                </button>
              )}
              {booking.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus("cancelled")}
                  disabled={updating}
                  className="w-full bg-red-500 text-white py-2.5 rounded-full font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {updating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
