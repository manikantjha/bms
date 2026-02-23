// Rule-based logic, no AI/ML

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface AverageColorResult {
  rgb: RGB;
  isUsable: boolean;
  reason?: string;
}

// Map depth and undertone to a curated list of shades
const shadeMap: Record<string, string[]> = {
  // Fair
  fair_cool: ["Porcelain (10C)", "Alabaster (12C)", "Rose Ivory (15C)"],
  fair_warm: ["Warm Ivory (10W)", "Sand (12W)", "Golden Fair (15W)"],
  fair_neutral: ["Neutral Fair (10N)", "Ivory (12N)", "Buff (15N)"],

  // Light
  light_cool: ["Cool Vanilla (20C)", "Rose Beige (22C)", "Petal (25C)"],
  light_warm: ["Warm Vanilla (20W)", "Golden Beige (22W)", "Honey (25W)"],
  light_neutral: ["Neutral Vanilla (20N)", "Nude (22N)", "Sand (25N)"],

  // Medium
  medium_cool: ["Cool Medium (30C)", "Rose Tan (32C)", "Cool Almond (35C)"],
  medium_warm: ["Warm Medium (30W)", "Golden Tan (32W)", "Caramel (35W)"],
  medium_neutral: ["Neutral Medium (30N)", "Beige (32N)", "Almond (35N)"],

  // Tan
  tan_cool: ["Cool Tan (40C)", "Chestnut (42C)", "Cool Mocha (45C)"],
  tan_warm: ["Warm Tan (40W)", "Golden Bronze (42W)", "Warm Mocha (45W)"],
  tan_neutral: ["Neutral Tan (40N)", "Bronze (42N)", "Pecan (45N)"],

  // Deep
  deep_cool: ["Cool Espresso (50C)", "Ebony (52C)", "Cool Cocoa (55C)"],
  deep_warm: ["Warm Espresso (50W)", "Mahogany (52W)", "Rich Cocoa (55W)"],
  deep_neutral: ["Neutral Espresso (50N)", "Cacao (52N)", "Truffle (55N)"],
};

export function extractAverageColor(
  imageElement: HTMLImageElement,
): AverageColorResult {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context not available");
  }

  // Draw image on canvas to extract pixels
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;
  ctx.drawImage(imageElement, 0, 0);

  // Define sampling region for central cheek zone
  // X: 30% to 70% | Y: 35% to 65%
  const startX = Math.floor(canvas.width * 0.3);
  const endX = Math.floor(canvas.width * 0.7);
  const startY = Math.floor(canvas.height * 0.35);
  const endY = Math.floor(canvas.height * 0.65);

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let validCount = 0;

  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Sample every 5th pixel for performance
    for (let y = startY; y < endY; y += 5) {
      for (let x = startX; x < endX; x += 5) {
        // Pixel index
        const index = (y * canvas.width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        // Calculate brightness (average RGB)
        const brightness = (r + g + b) / 3;

        // Ignore extremely bright or dark pixels
        if (brightness > 20 && brightness < 240) {
          rSum += r;
          gSum += g;
          bSum += b;
          validCount++;
        }
      }
    }

    if (validCount === 0) {
      return {
        rgb: { r: 0, g: 0, b: 0 },
        isUsable: false,
        reason:
          "Face region lacks sufficient color variation or lighting is too extreme.",
      };
    }

    const avgR = Math.round(rSum / validCount);
    const avgG = Math.round(gSum / validCount);
    const avgB = Math.round(bSum / validCount);

    const overallBrightness = (avgR + avgG + avgB) / 3;
    if (overallBrightness < 20) {
      return {
        rgb: { r: avgR, g: avgG, b: avgB },
        isUsable: false,
        reason: "Image is too dark. Average brightness < 20.",
      };
    }
    if (overallBrightness > 235) {
      return {
        rgb: { r: avgR, g: avgG, b: avgB },
        isUsable: false,
        reason: "Image is too bright or overexposed.",
      };
    }

    return {
      rgb: { r: avgR, g: avgG, b: avgB },
      isUsable: true,
    };
  } catch (err) {
    // Handling cross-origin taint canvas errors occasionally seen on dynamic URLs
    console.error("Canvas pixel extraction error:", err);
    throw new Error(
      "Failed to extract image pixels. Make sure the image is correctly formatted.",
    );
  }
}

export function determineUndertone(
  r: number,
  g: number,
  b: number,
): "warm" | "cool" | "neutral" {
  // Rule based logic from TDD:
  // If R > B by > 10% -> Warm
  // If B > R by > 10% -> Cool
  // Else -> Neutral

  // Real-world human skin tones naturally have higher absolute R than B.
  // We use relative R vs. uncalibrated B ratio adapted to generic digital colors.
  // Instead of strict uncalibrated checking, we map the delta.
  const rRatio = r / (r + g + b);
  const bRatio = b / (r + g + b);

  // Calculate relative dominance percentage
  // Example: if r=180, g=130, b=100 -> rRatio=0.43, bRatio=0.24 (Warm)
  const difference = (rRatio - bRatio) * 100;

  if (difference > 15) {
    return "warm";
  } else if (difference < 5) {
    return "cool";
  } else {
    return "neutral";
  }
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const v = Math.max(r, g, b);
  const c = v - Math.min(r, g, b);
  const f = 1 - Math.abs(v + v - c - 1);
  const h =
    c && (v === r ? (g - b) / c : v === g ? 2 + (b - r) / c : 4 + (r - g) / c);

  return {
    h: 60 * (h < 0 ? h + 6 : h),
    s: f ? (c / f) * 100 : 0,
    l: ((v + v - c) / 2) * 100,
  };
}

export function determineDepth(
  lightness: number,
): "fair" | "light" | "medium" | "tan" | "deep" {
  // Depth logic mapping based on Human Skin Lightness
  if (lightness >= 75) return "fair";
  if (lightness >= 60) return "light";
  if (lightness >= 45) return "medium";
  if (lightness >= 30) return "tan";
  return "deep";
}

export interface ShadeResult {
  undertone: "warm" | "cool" | "neutral";
  depth: "fair" | "light" | "medium" | "tan" | "deep";
  shades: string[];
}

export function getRecommendedShades(rgb: RGB): ShadeResult {
  const undertone = determineUndertone(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const depth = determineDepth(hsl.l);

  const key = `${depth}_${undertone}`;

  // Fallback if exactly missing (though the matrix covers all combinations)
  const shades = shadeMap[key] || [];

  return {
    undertone,
    depth,
    shades,
  };
}
