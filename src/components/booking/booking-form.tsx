"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/booking-store";
import { UserPlus, Calendar, Send, CheckCircle, Loader2 } from "lucide-react";
import type { Service } from "@/types/database.types";
import type { CartItem } from "@/types/booking.types";
import ClientCard from "./client-card";
import BookingSummary from "./booking-summary";

interface BookingFormProps {
  services: Service[];
}

type Step = "services" | "details" | "review";

export default function BookingForm({ services }: BookingFormProps) {
  const store = useBookingStore();
  const [step, setStep] = useState<Step>("services");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleToggleService(clientIndex: number, service: CartItem) {
    const client = store.clients[clientIndex];
    const exists = client.services.some(
      (s) => s.serviceId === service.serviceId
    );
    if (exists) {
      store.removeServiceFromClient(clientIndex, service.serviceId);
    } else {
      store.addServiceToClient(clientIndex, service);
    }
  }

  function canProceedToDetails(): boolean {
    return store.clients.every(
      (client) => client.clientName.trim() !== "" && client.services.length > 0
    );
  }

  function canProceedToReview(): boolean {
    return (
      store.customerName.trim() !== "" &&
      store.email.trim() !== "" &&
      store.eventDate !== "" &&
      store.eventTime !== ""
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: store.customerName,
          email: store.email,
          phone: store.phone || undefined,
          eventDate: store.eventDate,
          eventTime: store.eventTime,
          location: store.location || undefined,
          specialInstructions: store.specialInstructions || undefined,
          clients: store.clients,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Failed to create booking");
        return;
      }

      setSubmitted(true);
      store.reset();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-text mb-2">
          Booking Submitted!
        </h2>
        <p className="text-text-muted mb-6">
          Thank you! We&apos;ll confirm your appointment shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setStep("services");
          }}
          className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary-dark transition-colors"
        >
          Make Another Booking
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {(["services", "details", "review"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (s === "services") setStep(s);
                if (s === "details" && canProceedToDetails()) setStep(s);
                if (s === "review" && canProceedToDetails() && canProceedToReview())
                  setStep(s);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step === s
                  ? "bg-primary text-white"
                  : "bg-border text-text-muted"
              }`}
            >
              {i + 1}
            </button>
            <span
              className={`text-sm font-medium hidden sm:inline ${
                step === s ? "text-primary" : "text-text-muted"
              }`}
            >
              {s === "services"
                ? "Services"
                : s === "details"
                ? "Details"
                : "Review"}
            </span>
            {i < 2 && (
              <div className="w-8 sm:w-16 h-0.5 bg-border mx-1" />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Select Services per Client */}
      {step === "services" && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-text">
              Select Services for Each Client
            </h2>
            <p className="text-text-muted mt-1">
              Add clients and choose services for each one
            </p>
          </div>

          <div className="space-y-4">
            {store.clients.map((client, index) => (
              <ClientCard
                key={index}
                index={index}
                clientName={client.clientName}
                services={client.services}
                availableServices={services}
                canRemove={store.clients.length > 1}
                onNameChange={(name) => store.updateClientName(index, name)}
                onRemove={() => store.removeClient(index)}
                onToggleService={(service) =>
                  handleToggleService(index, service)
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => store.addClient("")}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-primary/30 rounded-xl text-primary font-medium hover:border-primary hover:bg-primary/5 transition-all"
          >
            <UserPlus size={18} />
            Add Another Client
          </button>

          <div className="flex justify-end">
            <button
              onClick={() => setStep("details")}
              disabled={!canProceedToDetails()}
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Event Details
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Event & Customer Details */}
      {step === "details" && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-text">
              Event & Contact Details
            </h2>
            <p className="text-text-muted mt-1">
              Tell us about your event and how to reach you
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
            <h3 className="font-heading font-semibold text-text flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Event Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={store.eventDate}
                  onChange={(e) =>
                    store.setEventDetails({
                      ...store,
                      eventDate: e.target.value,
                    })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Event Time *
                </label>
                <input
                  type="time"
                  value={store.eventTime}
                  onChange={(e) =>
                    store.setEventDetails({
                      ...store,
                      eventTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Location
              </label>
              <input
                type="text"
                value={store.location}
                onChange={(e) =>
                  store.setEventDetails({
                    ...store,
                    location: e.target.value,
                  })
                }
                placeholder="Event venue or address"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Special Instructions
              </label>
              <textarea
                value={store.specialInstructions}
                onChange={(e) =>
                  store.setEventDetails({
                    ...store,
                    specialInstructions: e.target.value,
                  })
                }
                rows={3}
                placeholder="Any special requests or notes..."
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
            <h3 className="font-heading font-semibold text-text">
              Your Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={store.customerName}
                  onChange={(e) =>
                    store.setCustomerDetails({
                      ...store,
                      customerName: e.target.value,
                    })
                  }
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={store.email}
                  onChange={(e) =>
                    store.setCustomerDetails({
                      ...store,
                      email: e.target.value,
                    })
                  }
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={store.phone}
                  onChange={(e) =>
                    store.setCustomerDetails({
                      ...store,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep("services")}
              className="border border-border text-text-muted px-6 py-3 rounded-full font-medium hover:bg-border/30 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep("review")}
              disabled={!canProceedToReview()}
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === "review" && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-text">
              Review Your Booking
            </h2>
            <p className="text-text-muted mt-1">
              Please review everything before submitting
            </p>
          </div>

          <BookingSummary
            clients={store.clients}
            eventDate={store.eventDate}
            eventTime={store.eventTime}
            location={store.location}
          />

          <div className="bg-surface rounded-2xl border border-border p-6">
            <h3 className="font-heading font-semibold text-text mb-3">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-text-muted">Name: </span>
                <span className="text-text font-medium">
                  {store.customerName}
                </span>
              </div>
              <div>
                <span className="text-text-muted">Email: </span>
                <span className="text-text font-medium">{store.email}</span>
              </div>
              {store.phone && (
                <div>
                  <span className="text-text-muted">Phone: </span>
                  <span className="text-text font-medium">{store.phone}</span>
                </div>
              )}
            </div>
            {store.specialInstructions && (
              <div className="mt-3 text-sm">
                <span className="text-text-muted">Special Instructions: </span>
                <span className="text-text">{store.specialInstructions}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep("details")}
              className="border border-border text-text-muted px-6 py-3 rounded-full font-medium hover:bg-border/30 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
