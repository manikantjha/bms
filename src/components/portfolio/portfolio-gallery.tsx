"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { PortfolioItem } from "@/types/database.types";

interface PortfolioGalleryProps {
  items: PortfolioItem[];
}

const ALL_CATEGORY = "All";

function extractCategories(items: PortfolioItem[]): string[] {
  const categorySet = new Set<string>();
  for (const item of items) {
    if (item.category) {
      categorySet.add(item.category);
    }
  }
  return [ALL_CATEGORY, ...Array.from(categorySet).sort()];
}

export default function PortfolioGallery({ items }: PortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const categories = useMemo(() => extractCategories(items), [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) {
      return items;
    }
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <div>
      {/* Category Filter Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-surface text-text-muted border border-border hover:border-primary/30 hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Image Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {item.category && (
                    <p className="text-secondary text-sm font-medium mb-1">
                      {item.category}
                    </p>
                  )}
                  <h3 className="text-white font-heading text-lg font-semibold">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-white/70 text-sm mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {item.is_featured && (
                <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Sparkles className="text-primary/30 mx-auto mb-4" size={48} />
          <p className="text-text-muted text-lg">
            No items found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
