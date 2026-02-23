"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ImageUpload from "./image-upload";
import type { PortfolioItem } from "@/types/database.types";
import { Checkbox } from "@/components/ui/checkbox";

interface PortfolioFormProps {
  item?: PortfolioItem | null;
  onSubmit: (data: PortfolioFormPayload) => Promise<void>;
  onCancel: () => void;
}

export interface PortfolioFormPayload {
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  isFeatured: boolean;
}

export default function PortfolioForm({
  item,
  onSubmit,
  onCancel,
}: PortfolioFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description ?? "");
      setImageUrl(item.image_url);
      setCategory(item.category ?? "");
      setIsFeatured(item.is_featured);
    }
  }, [item]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!imageUrl) {
      setError("Please upload an image");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        title,
        description: description || undefined,
        imageUrl,
        category: category || undefined,
        isFeatured,
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
          Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-1">
          Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-2">
          Image
        </label>
        <ImageUpload
          currentUrl={imageUrl || undefined}
          onUpload={setImageUrl}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-1">
          Category
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Bridal, Editorial"
          className={inputClass}
        />
      </div>

      <Checkbox
        checked={isFeatured}
        onChange={setIsFeatured}
        label={<span className="text-text">Featured item</span>}
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
          ) : item ? (
            "Update Item"
          ) : (
            "Add Item"
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
