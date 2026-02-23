"use client";

import { useState, useRef, ChangeEvent } from "react";
import {
  UploadCloud,
  CheckCircle,
  Loader2,
  Info,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import {
  extractAverageColor,
  getRecommendedShades,
  ShadeResult,
  AverageColorResult,
} from "@/utils/shade-detection";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

type Step = "upload" | "processing" | "results" | "lead_form" | "success";

export default function ShadeFinderPage() {
  const [step, setStep] = useState<Step>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [shadeResult, setShadeResult] = useState<ShadeResult | null>(null);
  const [avgRgb, setAvgRgb] = useState<{
    r: number;
    g: number;
    b: number;
  } | null>(null);

  const [isInterested, setIsInterested] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  // Hidden image for canvas processing
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG/PNG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const processImage = () => {
    if (!selectedFile || !previewUrl) return;
    setStep("processing");

    // Load image explicitly to ensure all dimensions & metadata are available before canvas manipulation
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setTimeout(() => {
        try {
          const extraction: AverageColorResult = extractAverageColor(img);
          if (!extraction.isUsable) {
            setError(
              extraction.reason ||
                "Failed to analyze image. Please try a different photo.",
            );
            setStep("upload");
            return;
          }

          const result = getRecommendedShades(extraction.rgb);
          setAvgRgb(extraction.rgb);
          setShadeResult(result);
          setStep("results");
        } catch (err: any) {
          setError(err.message || "Failed to process image.");
          setStep("upload");
        }
      }, 500);
    };
    img.onerror = () => {
      setError("Failed to load image for processing. Please try again.");
      setStep("upload");
    };
    img.src = previewUrl;
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !shadeResult || !avgRgb) return;

    setSubmitting(true);
    setError(null);

    try {
      // 1. Upload local file to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("foundation-uploads")
        .upload(fileName, selectedFile);

      if (uploadError) throw new Error("Failed to upload image.");

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const imageUrl = `${supabaseUrl}/storage/v1/object/public/foundation-uploads/${uploadData.path}`;

      // 2. Submit lead to API
      const res = await fetch("/api/shade-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone || undefined,
          image_url: imageUrl,
          undertone: shadeResult.undertone,
          depth: shadeResult.depth,
          avg_rgb: avgRgb,
          recommended_shades: shadeResult.shades,
          interested_in_makeup: isInterested,
          selected_service: isInterested ? selectedService : undefined,
        }),
      });

      const result = await res.json();
      if (!result.success)
        throw new Error(result.error || "Failed to submit lead");

      setStep("success");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 min-h-[80vh]">
      <div className="text-center mb-10">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-text mb-4">
          Find Your Perfect Shade
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg">
          Upload a photo of your makeup-free face in natural lighting, and our
          algorithmic color engine will instantly determine your undertone,
          depth, and matching foundation shades. No AI, just pure color science.
        </p>
      </div>

      <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-sm">
        {error && (
          <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* STEP 1: UPLOAD */}
        {step === "upload" && (
          <div className="p-8 md:p-12">
            {!previewUrl ? (
              <div className="border-2 border-dashed border-primary/30 rounded-2xl p-10 text-center hover:bg-primary/5 transition-colors group relative">
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="text-primary w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-2">
                    Drag & drop your photo
                  </h3>
                  <p className="text-text-muted text-sm mb-4">
                    Supports JPEG, PNG up to 5MB
                  </p>
                  <span className="text-primary font-medium">Browse Files</span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-background shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="px-6 py-2.5 rounded-full border border-border text-text-muted hover:bg-background transition-colors font-medium"
                  >
                    Use Different Photo
                  </button>
                  <button
                    onClick={processImage}
                    className="px-8 py-2.5 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors font-semibold shadow-md"
                  >
                    Analyze My Shade
                  </button>
                </div>
              </div>
            )}

            <div className="mt-12 bg-background p-6 rounded-2xl">
              <h4 className="font-bold text-text mb-3 flex items-center gap-2">
                <Info size={18} className="text-primary" /> Tips for Best
                Results
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-text-muted">
                <li>• Face an open window with natural daylight.</li>
                <li>• Avoid harsh direct sunlight or dark shadows.</li>
                <li>• Ensure no makeup is worn.</li>
                <li>• Ensure camera is focused and clear.</li>
              </ul>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING */}
        {step === "processing" && (
          <div className="p-16 text-center flex flex-col items-center">
            <Loader2 size={64} className="text-primary animate-spin mb-6" />
            <h3 className="text-2xl font-bold text-text mb-2 animate-pulse">
              Analyzing Skin Tone...
            </h3>
            <p className="text-text-muted">
              Extracting RGB values and mapping undertones.
            </p>
          </div>
        )}

        {/* STEP 3 & 4: RESULTS & INTENT */}
        {step === "results" && shadeResult && (
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                    Your Analysis
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-background border border-border rounded-2xl p-4 flex-1">
                      <span className="text-sm text-text-muted block mb-1">
                        Undertone
                      </span>
                      <span className="text-2xl font-bold text-text capitalize">
                        {shadeResult.undertone}
                      </span>
                    </div>
                    <div className="bg-background border border-border rounded-2xl p-4 flex-1">
                      <span className="text-sm text-text-muted block mb-1">
                        Depth category
                      </span>
                      <span className="text-2xl font-bold text-text capitalize">
                        {shadeResult.depth}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                    Recommended Shades
                  </h3>
                  <div className="space-y-3">
                    {shadeResult.shades.map((shade, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 bg-primary/5 border border-primary/20 rounded-xl p-4"
                      >
                        <div
                          className="w-8 h-8 rounded-full shadow-sm"
                          style={{
                            // A rough color estimation just for UI aesthetics based on the depth/undertone
                            backgroundColor: avgRgb
                              ? `rgb(${avgRgb.r}, ${avgRgb.g}, ${avgRgb.b})`
                              : "#ccc",
                          }}
                        />
                        <span className="font-semibold text-text">{shade}</span>
                      </div>
                    ))}
                    {shadeResult.shades.length === 0 && (
                      <p className="text-text-muted text-sm">
                        No exact shades cataloged for this specific profile, but
                        look for {shadeResult.depth} products with{" "}
                        {shadeResult.undertone} undertones.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Education Accordion / Guide */}
              <div className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                  <Info size={18} className="text-primary" /> The Science of
                  Undertones
                </h3>
                <div className="space-y-4 text-sm text-text-muted">
                  <p>
                    <strong>What is an undertone?</strong> It's the subtle color
                    beneath the surface of your skin that affects your overall
                    hue.
                  </p>
                  <p>
                    <strong>Warm:</strong> Golden, yellow, or peachy hints. You
                    look best in gold jewelry and have green-tinted veins.
                  </p>
                  <p>
                    <strong>Cool:</strong> Pink, red, or bluish hints. Silver
                    jewelry shines on you, and veins appear blue/purple.
                  </p>
                  <p>
                    <strong>Neutral:</strong> A mix of warm and cool. Both gold
                    and silver suit you, and veins are blue-green.
                  </p>
                  <p className="mt-4 pt-4 border-t border-border">
                    <em>
                      Pro Tip: When testing a physical foundation, always match
                      it to your jawline or neck, not your hand, as hands are
                      often darker. Give a swatch 10 minutes to dry to see if it
                      oxidizes.
                    </em>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <h3 className="text-xl font-bold text-text mb-6">
                Are you also looking for professional makeup services?
              </h3>
              <div className="flex gap-6 mb-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="intent"
                    checked={isInterested === true}
                    onChange={() => setIsInterested(true)}
                    className="w-5 h-5 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-text font-medium">Yes, please!</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="intent"
                    checked={isInterested === false}
                    onChange={() => setIsInterested(false)}
                    className="w-5 h-5 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-text font-medium">
                    No, just the shades.
                  </span>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep("lead_form")}
                  className="px-8 py-3 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors font-semibold"
                >
                  Continue to Final Step
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: LEAD FORM */}
        {step === "lead_form" && (
          <div className="p-8 md:p-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-text mb-2">
              Where should we send your results?
            </h2>
            <p className="text-text-muted mb-8">
              Enter your details to save your shade profile.
            </p>

            <form onSubmit={submitLead} className="space-y-5">
              {isInterested && (
                <div className="mb-6 p-5 bg-background border border-border rounded-xl">
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    Which service are you interested in?
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required={isInterested}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="" disabled>
                      Select a service category...
                    </option>
                    <option value="Bridal">Bridal & Wedding</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Party">Party Glam</option>
                    <option value="Photoshoot">Photoshoot / Editorial</option>
                    <option value="Other">Other Occasion</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) =>
                    setLeadForm({ ...leadForm, name: e.target.value })
                  }
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={leadForm.email}
                  onChange={(e) =>
                    setLeadForm({ ...leadForm, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={leadForm.phone}
                  onChange={(e) =>
                    setLeadForm({ ...leadForm, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("results")}
                  className="text-text-muted font-medium hover:text-text transition-colors"
                >
                  Back to Results
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save my Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 6: SUCCESS */}
        {step === "success" && (
          <div className="p-16 text-center flex flex-col items-center">
            <CheckCircle size={64} className="text-green-500 mb-6" />
            <h2 className="text-3xl font-bold text-text mb-3">
              You're All Set!
            </h2>
            <p className="text-text-muted max-w-md mx-auto mb-8 text-lg">
              {isInterested
                ? "Your shade profile and service inquiry have been saved successfully! We'll be in touch soon regarding your makeup needs."
                : "Your foundation shade profile has been securely saved. Check your email for future shade recommendations!"}
            </p>
            <button
              onClick={() => {
                setStep("upload");
                setPreviewUrl(null);
                setSelectedFile(null);
                setShadeResult(null);
                setIsInterested(false);
                setLeadForm({ name: "", email: "", phone: "" });
              }}
              className="px-8 py-3 rounded-full border border-border text-text hover:bg-background transition-colors font-medium"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
