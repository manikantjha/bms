"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
  isQuoteRequest: boolean;
}

const initialFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  isQuoteRequest: false,
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Failed to send message");
        return;
      }

      setSubmitted(true);
      setForm(initialFormState);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
        <h3 className="font-heading text-xl font-bold text-text mb-2">
          Message Sent!
        </h3>
        <p className="text-text-muted mb-6">
          Thank you for reaching out. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-primary font-semibold hover:text-primary-dark transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-1">
          Phone
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="+91 98765 43210"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-1">
          Message *
        </label>
        <textarea
          required
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          rows={5}
          placeholder="Tell us about your event, requirements, or any questions..."
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isQuoteRequest}
          onChange={(e) => updateField("isQuoteRequest", e.target.checked)}
          className="w-5 h-5 rounded border-border text-primary focus:ring-primary/30"
        />
        <span className="text-sm text-text-muted">
          I&apos;d like to request a custom quote
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
