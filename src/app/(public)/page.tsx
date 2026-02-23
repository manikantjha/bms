import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Sparkles, Calendar } from "lucide-react";
import { getFeaturedPortfolioItems } from "@/services/portfolio.service";
import { getActiveServices } from "@/services/service.service";
import { formatPrice } from "@/utils/price-calculator";

export default async function HomePage() {
  let featuredItems: Awaited<ReturnType<typeof getFeaturedPortfolioItems>> = [];
  let services: Awaited<ReturnType<typeof getActiveServices>> = [];

  try {
    [featuredItems, services] = await Promise.all([
      getFeaturedPortfolioItems(),
      getActiveServices(),
    ]);
  } catch {
    // Gracefully handle when Supabase is not configured
  }

  const highlightedServices = services.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-dark via-primary to-secondary min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-secondary font-medium mb-4 tracking-widest uppercase text-sm">
              Professional Makeup Artist
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Beauty, <span className="text-secondary">Perfected</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Specializing in bridal, party, and editorial makeup. Every face
              tells a story — let me make yours unforgettable.
            </p>
            <div className="flex flex-wrap gap-4">
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
                Get a Quote
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
              Portfolio
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text">
              Featured Work
            </h2>
          </div>

          {featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-border"
                >
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-secondary text-sm font-medium">
                        {item.category}
                      </p>
                      <h3 className="text-white font-heading text-lg font-semibold">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/5] rounded-2xl bg-border/50 flex items-center justify-center"
                >
                  <Sparkles className="text-primary/30" size={48} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              View Full Portfolio
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-20 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
              Services
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text">
              What I Offer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlightedServices.length > 0
              ? highlightedServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-background rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Star className="text-primary" size={20} />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text mb-2">
                      {service.name}
                    </h3>
                    <p className="text-text-muted text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <p className="text-primary font-bold text-lg">
                      {formatPrice(service.price)}
                    </p>
                  </div>
                ))
              : [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-background rounded-2xl p-6 border border-border"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Star className="text-primary" size={20} />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text mb-2">
                      {
                        [
                          "Bridal Makeup",
                          "Party Glam",
                          "Editorial Look",
                          "Natural Beauty",
                        ][i - 1]
                      }
                    </h3>
                    <p className="text-text-muted text-sm mb-4">
                      Professional makeup service tailored to your needs.
                    </p>
                    <p className="text-primary font-bold text-lg">
                      {formatPrice([15000, 5000, 12000, 4000][i - 1])}
                    </p>
                  </div>
                ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
            >
              View All Services
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Shade Finder Feature Highlight */}
      <section className="py-20 bg-background overflow-hidden relative border-t border-border">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
                New Tool
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-6 leading-tight">
                Discover Your True Match
              </h2>
              <p className="text-text-muted text-lg mb-8 leading-relaxed">
                Struggling to find the right foundation? Try our new algorithmic
                Shade Finder. Upload a makeup-free photo and let pure color
                science reveal your exact undertone and recommended foundation
                shades instantly.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-text-muted">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  No AI used, just strict color theory.
                </li>
                <li className="flex items-center gap-3 text-text-muted">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  Accurate depth & undertone mapping.
                </li>
                <li className="flex items-center gap-3 text-text-muted">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  Totally free to use.
                </li>
              </ul>
              <Link
                href="/shade-finder"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
              >
                <Sparkles size={18} />
                Try Shade Finder
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-surface border border-border overflow-hidden p-8 flex flex-col justify-center shadow-xl relative z-10">
                <div className="bg-background rounded-2xl shadow-sm border border-border p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex gap-4 items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-full"
                        style={{
                          background:
                            "linear-gradient(135deg, #f1c27d, #c68642)",
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-text">Undertone: Warm</h4>
                      <p className="text-sm text-text-muted">Depth: Medium</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-10 w-full bg-surface rounded-xl border border-border flex items-center px-4">
                      <span className="text-sm font-medium text-text">
                        Golden Tan (32W)
                      </span>
                    </div>
                    <div className="h-10 w-full bg-surface rounded-xl border border-border flex items-center px-4">
                      <span className="text-sm font-medium text-text">
                        Warm Medium (30W)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative blobs */}
              <div className="absolute top-1/2 -right-10 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
              <div className="absolute -bottom-10 left-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready for Your Transformation?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Whether it&apos;s your wedding day, a special event, or a photoshoot
            — I&apos;ll create the perfect look for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-white text-primary-dark px-8 py-3 rounded-full font-semibold hover:bg-secondary hover:text-white transition-colors"
            >
              <Calendar size={18} />
              Book Appointment
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-dark transition-colors"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
