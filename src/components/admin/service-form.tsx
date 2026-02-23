"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { Service, Category } from "@/types/database.types";
import { Checkbox } from "@/components/ui/checkbox";

interface ServiceFormProps {
  service?: Service | null;
  categories: Category[];
  onSubmit: (data: ServiceFormPayload) => Promise<void>;
  onCancel: () => void;
}

export interface ServiceFormPayload {
  name: string;
  description: string;
  price: number;
  durationMinutes?: number;
  categoryId?: string;
  isActive: boolean;
}

export default function ServiceForm({
  service,
  categories,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setPrice(String(service.price));
      setDuration(
        service.duration_minutes ? String(service.duration_minutes) : "",
      );
      setCategoryId(service.category_id ?? "");
      setIsActive(service.is_active);
    }
  }, [service]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        name,
        description,
        price: Number(price),
        durationMinutes: duration ? Number(duration) : undefined,
        categoryId: categoryId || undefined,
        isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-text-muted mb-1">
          Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-1">
          Description
        </label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            Duration (min)
          </label>
          <input
            type="number"
            min="0"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-1">
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <Checkbox
        checked={isActive}
        onChange={setIsActive}
        label={<span className="text-text">Active</span>}
      />

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-white py-2.5 rounded-full font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : service ? (
            "Update Service"
          ) : (
            "Add Service"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-full border border-border text-text-muted hover:bg-background transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
