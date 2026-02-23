"use client";

import { useState, useCallback } from "react";
import { Clock, Plus, Check } from "lucide-react";
import type { Category, Service } from "@/types/database.types";
import { useBookingStore } from "@/store/booking-store";
import { formatPrice } from "@/utils/price-calculator";

interface CategorizedServices {
  category: Category;
  services: Service[];
}

interface ServiceListProps {
  categorizedServices: CategorizedServices[];
}

const ALL_CATEGORY_ID = "all";

export default function ServiceList({
  categorizedServices,
}: ServiceListProps) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_ID);
  const [addedServices, setAddedServices] = useState<Set<string>>(new Set());

  const addServiceToClient = useBookingStore(
    (state) => state.addServiceToClient
  );

  const handleAddService = useCallback(
    (service: Service) => {
      addServiceToClient(0, {
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
      });

      setAddedServices((prev) => {
        const next = new Set(prev);
        next.add(service.id);
        return next;
      });

      // Reset the visual feedback after 2 seconds
      setTimeout(() => {
        setAddedServices((prev) => {
          const next = new Set(prev);
          next.delete(service.id);
          return next;
        });
      }, 2000);
    },
    [addServiceToClient]
  );

  const filteredCategories =
    activeCategory === ALL_CATEGORY_ID
      ? categorizedServices
      : categorizedServices.filter(
          (group) => group.category.id === activeCategory
        );

  const hasAnyServices = categorizedServices.some(
    (group) => group.services.length > 0
  );

  if (!hasAnyServices) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Clock className="text-primary" size={28} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-text mb-3">
          No Services Available
        </h2>
        <p className="text-text-muted max-w-md mx-auto">
          Our service menu is being updated. Please check back soon or contact
          us for a custom quote.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-12 justify-center">
        <button
          onClick={() => setActiveCategory(ALL_CATEGORY_ID)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeCategory === ALL_CATEGORY_ID
              ? "bg-primary text-white"
              : "bg-surface text-text-muted border border-border hover:border-primary/30 hover:text-primary"
          }`}
        >
          All
        </button>
        {categorizedServices.map((group) => (
          <button
            key={group.category.id}
            onClick={() => setActiveCategory(group.category.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === group.category.id
                ? "bg-primary text-white"
                : "bg-surface text-text-muted border border-border hover:border-primary/30 hover:text-primary"
            }`}
          >
            {group.category.name}
          </button>
        ))}
      </div>

      {/* Service Groups */}
      <div className="space-y-16">
        {filteredCategories.map((group) => {
          if (group.services.length === 0) return null;

          return (
            <div key={group.category.id}>
              <div className="mb-8">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text">
                  {group.category.name}
                </h2>
                <div className="mt-2 h-1 w-16 rounded-full bg-primary" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.services.map((service) => {
                  const isAdded = addedServices.has(service.id);

                  return (
                    <div
                      key={service.id}
                      className="bg-surface rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                    >
                      <h3 className="font-heading text-lg font-semibold text-text mb-2">
                        {service.name}
                      </h3>
                      <p className="text-text-muted text-sm mb-4 line-clamp-3">
                        {service.description}
                      </p>

                      <div className="flex items-center gap-4 mb-5">
                        <span className="text-primary font-bold text-xl">
                          {formatPrice(service.price)}
                        </span>
                        {service.duration_minutes !== null && (
                          <span className="inline-flex items-center gap-1 text-text-muted text-sm">
                            <Clock size={14} />
                            {service.duration_minutes} min
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddService(service)}
                        disabled={isAdded}
                        className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                          isAdded
                            ? "bg-green-50 text-green-700 border border-green-200 cursor-default"
                            : "bg-primary text-white hover:bg-primary-dark"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} />
                            Added to Booking
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            Add to Booking
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
