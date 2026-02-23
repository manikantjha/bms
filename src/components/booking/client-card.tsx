"use client";

import { Trash2, User } from "lucide-react";
import type { Service } from "@/types/database.types";
import type { CartItem } from "@/types/booking.types";
import ServiceSelector from "./service-selector";
import { formatPrice } from "@/utils/price-calculator";

interface ClientCardProps {
  index: number;
  clientName: string;
  services: CartItem[];
  availableServices: Service[];
  canRemove: boolean;
  onNameChange: (name: string) => void;
  onRemove: () => void;
  onToggleService: (service: CartItem) => void;
}

export default function ClientCard({
  index,
  clientName,
  services,
  availableServices,
  canRemove,
  onNameChange,
  onRemove,
  onToggleService,
}: ClientCardProps) {
  const clientTotal = services.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="bg-surface rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
          <h3 className="font-heading font-semibold text-text">
            Client {index + 1}
          </h3>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-600 transition-colors p-1"
            aria-label="Remove client"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-text-muted mb-1">
          Client Name
        </label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter client name"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-text-muted mb-2">
          Select Services
        </label>
        <ServiceSelector
          services={availableServices}
          selectedServices={services}
          onToggleService={onToggleService}
        />
      </div>

      {services.length > 0 && (
        <div className="pt-3 border-t border-border flex justify-between items-center">
          <span className="text-sm text-text-muted">
            {services.length} service{services.length > 1 ? "s" : ""} selected
          </span>
          <span className="font-bold text-primary">
            {formatPrice(clientTotal)}
          </span>
        </div>
      )}
    </div>
  );
}
