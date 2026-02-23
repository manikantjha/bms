"use client";

import { Check, Plus } from "lucide-react";
import type { Service } from "@/types/database.types";
import type { CartItem } from "@/types/booking.types";
import { formatPrice } from "@/utils/price-calculator";

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: CartItem[];
  onToggleService: (service: CartItem) => void;
}

export default function ServiceSelector({
  services,
  selectedServices,
  onToggleService,
}: ServiceSelectorProps) {
  const isSelected = (serviceId: string) =>
    selectedServices.some((s) => s.serviceId === serviceId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {services.map((service) => {
        const selected = isSelected(service.id);
        return (
          <button
            key={service.id}
            type="button"
            onClick={() =>
              onToggleService({
                serviceId: service.id,
                serviceName: service.name,
                price: service.price,
              })
            }
            className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
              selected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text text-sm truncate">
                {service.name}
              </p>
              <p className="text-primary font-bold text-sm mt-1">
                {formatPrice(service.price)}
              </p>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-3 ${
                selected
                  ? "bg-primary text-white"
                  : "bg-border/50 text-text-muted"
              }`}
            >
              {selected ? <Check size={16} /> : <Plus size={16} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
