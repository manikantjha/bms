import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import { getPortfolioItems } from "@/services/portfolio.service";
import type { PortfolioItem } from "@/types/database.types";
import PortfolioGallery from "@/components/portfolio/portfolio-gallery";
import { NAME } from "@/config";

export const metadata: Metadata = {
  title: "Portfolio",
  description: `Explore the portfolio of ${NAME} — showcasing bridal, editorial, party, and special occasion makeup looks. See the artistry that brings every vision to life.`,
  openGraph: {
    title: `Portfolio | ${NAME}`,
    description:
      "Browse stunning makeup transformations across bridal, editorial, and special occasion categories.",
  },
};

export default async function PortfolioPage() {
  let portfolioItems: PortfolioItem[] = [];

  try {
    portfolioItems = await getPortfolioItems();
  } catch {
    // Gracefully handle when Supabase is not configured
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary-dark via-primary to-secondary py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">
            My Work
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Portfolio
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            A curated collection of bridal, editorial, and special occasion
            looks crafted with precision and passion.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {portfolioItems.length > 0 ? (
            <PortfolioGallery items={portfolioItems} />
          ) : (
            <div>
              <div className="text-center mb-12">
                <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
                  Coming Soon
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4">
                  Portfolio Is Being Curated
                </h2>
                <p className="text-text-muted max-w-xl mx-auto">
                  Beautiful looks are on their way. In the meantime, feel free
                  to reach out to discuss your vision or book a consultation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] rounded-2xl bg-border/50 flex items-center justify-center"
                  >
                    <Sparkles className="text-primary/30" size={48} />
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
                >
                  Get in Touch
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Love What You See?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Let&apos;s create a look that is uniquely yours. Book a session and
            let the transformation begin.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-white text-primary-dark px-8 py-3 rounded-full font-semibold hover:bg-secondary hover:text-white transition-colors"
            >
              <Calendar size={18} />
              Book Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-dark transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
