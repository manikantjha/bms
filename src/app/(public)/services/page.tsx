import ServiceList from "@/components/services/service-list";
import { NAME } from "@/config";
import { getServicesByCategory } from "@/services/service.service";
import type { Category, Service } from "@/types/database.types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our full range of professional makeup services including bridal, party, editorial, and natural looks. Book your appointment today.",
  openGraph: {
    title: `Services | ${NAME}`,
    description:
      "Explore our full range of professional makeup services including bridal, party, editorial, and natural looks.",
  },
};

export default async function ServicesPage() {
  let categorizedServices: { category: Category; services: Service[] }[] = [];

  try {
    categorizedServices = await getServicesByCategory();
  } catch {
    // Gracefully handle when Supabase is not configured
  }

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-secondary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">
            What I Offer
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            My Services
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            From bridal glam to editorial perfection — find the perfect makeup
            service for your occasion.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ServiceList categorizedServices={categorizedServices} />
        </div>
      </section>
    </>
  );
}
