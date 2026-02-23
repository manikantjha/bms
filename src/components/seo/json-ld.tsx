import { NAME } from "@/config";
import type { Service } from "@/types/database.types";

interface LocalBusinessJsonLdProps {
  name?: string;
  description?: string;
  url?: string;
}

export function LocalBusinessJsonLd({
  name = NAME,
  description = "Professional makeup artist specializing in bridal, party, and editorial makeup in Mumbai, India.",
  url = "https://bhavanasmakeupstudio.com",
}: LocalBusinessJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name,
    description,
    url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    telephone: "+919638799402",
    priceRange: "₹₹",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ServiceJsonLdProps {
  services: Service[];
}

export function ServicesJsonLd({ services }: ServiceJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        offers: {
          "@type": "Offer",
          price: service.price,
          priceCurrency: "INR",
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
