"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useAdminFetch } from "@/lib/admin-auth-client";

interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
}

export default function ImageUpload({
  currentUrl,
  onUpload,
}: ImageUploadProps) {
  const { adminFetch } = useAdminFetch();
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File must be under 5MB");
        return;
      }

      setError(null);
      setUploading(true);

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await adminFetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error || "Upload failed");
        }

        setPreview(json.data.url);
        onUpload(json.data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setPreview(currentUrl ?? null);
      } finally {
        setUploading(false);
      }
    },
    [adminFetch, currentUrl, onUpload],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clearImage() {
    setPreview(null);
    onUpload("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden ${
          preview
            ? "border-primary/30 bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-primary/5"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {preview ? (
          <div className="relative aspect-video">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {!uploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow hover:bg-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <Upload size={24} className="text-text-muted mb-2" />
            <p className="text-sm text-text-muted text-center">
              Drop an image here or click to browse
            </p>
            <p className="text-xs text-text-muted/60 mt-1">
              Max 5MB · JPG, PNG, WebP
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
