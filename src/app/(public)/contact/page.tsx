import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/forms/contact-form";
import { EMAIL, NAME } from "@/config";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${NAME}. Send a message, request a custom quote, or inquire about our makeup services.`,
  openGraph: {
    title: `Contact Us | ${NAME}`,
    description: `Get in touch with ${NAME} for bookings, quotes, and inquiries.`,
  },
};

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 96387 99402",
    href: "tel:+919638799402",
  },
  {
    icon: Mail,
    label: "Email",
    value: `${EMAIL}`,
    href: `mailto:${EMAIL}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Mumbai, Maharashtra, India",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon–Sat: 9 AM – 7 PM",
  },
];

export default function ContactPage() {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
            Get in Touch
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text">
            Contact Us
          </h1>
          <p className="text-text-muted mt-3 max-w-xl mx-auto">
            Have a question or want to request a custom quote? Fill out the form
            and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-text font-medium hover:text-primary transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-text font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-surface rounded-2xl border border-border p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
