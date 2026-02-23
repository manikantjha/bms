import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Heart,
  Star,
  CheckCircle,
  Quote,
  Palette,
  Users,
  Calendar,
} from "lucide-react";
import { NAME } from "@/config";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${NAME} — a professional makeup artist with years of experience in bridal, editorial, and special occasion makeup. Discover my story, certifications, and client testimonials.`,
  openGraph: {
    title: `About | ${NAME}`,
    description:
      "Professional makeup artist specializing in bridal, editorial, and special occasion makeup. Learn about my journey and what sets me apart.",
  },
};

const certifications = [
  "Certified Professional Makeup Artist — International Makeup Association (IMA)",
  "Advanced Bridal & Editorial Makeup — London School of Makeup",
  "Airbrush Technique Specialist — Temptu Pro Certification",
  "Skincare & Prep Certified — Dermalogica Expert Program",
  "HD & Film Makeup — National Academy of Media Arts",
];

const experienceHighlights = [
  { icon: Users, label: "Happy Clients", value: "500+" },
  { icon: Palette, label: "Years of Experience", value: "8+" },
  { icon: Heart, label: "Bridal Looks", value: "200+" },
  { icon: Star, label: "5-Star Reviews", value: "150+" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Bride",
    quote:
      "She made me feel like the most beautiful version of myself on my wedding day. The makeup lasted through every tear of joy and every dance. I could not have asked for a more talented artist.",
    rating: 5,
  },
  {
    name: "Ananya Mehta",
    role: "Fashion Photographer",
    quote:
      "Working with her on editorial shoots is always a pleasure. She understands lighting, camera angles, and how makeup translates on screen. Her attention to detail is second to none.",
    rating: 5,
  },
  {
    name: "Riya Patel",
    role: "Corporate Client",
    quote:
      "I booked her for my engagement party and was blown away by the result. She listened to exactly what I wanted and elevated it beyond my expectations. Truly an artist in every sense.",
    rating: 5,
  },
  {
    name: "Kavitha Nair",
    role: "Mother of the Bride",
    quote:
      "Not only did she make my daughter look stunning, but she also did a wonderful job on the entire bridal party. Her calm demeanor and professionalism put everyone at ease.",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-secondary text-secondary" />
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary-dark via-primary to-secondary py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">
            Get to Know Me
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            About Me
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Passion, precision, and a love for enhancing natural beauty.
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-border">
              <Image
                src="/images/artist-portrait.jpg"
                alt={`Bhavana - Professional Makeup Artist Portrait`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            <div>
              <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
                My Story
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-6">
                Where Beauty Meets Artistry
              </h2>
              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>
                  With over 8 years of experience in the beauty industry, I have
                  dedicated my career to helping people look and feel their
                  absolute best. My journey began with a deep fascination for
                  colour, texture, and the transformative power of makeup.
                </p>
                <p>
                  From intimate bridal mornings to high-energy editorial shoots,
                  I bring the same level of passion and precision to every
                  appointment. I believe that great makeup does not mask who you
                  are — it reveals the most radiant version of yourself.
                </p>
                <p>
                  Based in Mumbai, I have had the privilege of working with
                  hundreds of brides, leading fashion photographers, and
                  renowned publications. My approach combines classic techniques
                  with modern trends, always tailored to complement each
                  individual's unique features and personal style.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
                >
                  <Calendar size={18} />
                  Book a Session
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {experienceHighlights.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="text-primary" size={22} />
                </div>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-text">
                  {stat.value}
                </p>
                <p className="text-text-muted text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Certifications */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Award className="text-primary" size={28} />
            </div>
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
              Credentials
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text">
              Experience & Certifications
            </h2>
            <p className="text-text-muted mt-4 max-w-2xl mx-auto">
              Continuous learning and professional development ensure I bring
              the latest techniques and highest standards to every client.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
              {certifications.map((cert) => (
                <li
                  key={cert}
                  className="flex items-start gap-4 bg-surface rounded-xl p-5 border border-border hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <CheckCircle
                    size={22}
                    className="text-primary mt-0.5 shrink-0"
                  />
                  <span className="text-text leading-relaxed">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="text-primary" size={28} />
            </div>
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
              Testimonials
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text">
              What My Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-background rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <Quote size={28} className="text-secondary/50 mb-4" />
                <p className="text-text-muted leading-relaxed mb-6">
                  {testimonial.quote}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-semibold text-text">
                      {testimonial.name}
                    </p>
                    <p className="text-text-muted text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                  <StarRating count={testimonial.rating} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Let&apos;s Create Something Beautiful
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Whether it&apos;s your wedding, a special event, or a creative shoot
            — I would love to be part of your story.
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
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
