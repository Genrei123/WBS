"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { urlFor } from "@/sanity/lib/image";

interface HeroLandingProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image?: {
    asset?: { _id?: string; url?: string };
    alt?: string;
    hotspot?: unknown;
    crop?: unknown;
  };
  imageDark?: {
    asset?: { _id?: string; url?: string };
    alt?: string;
    hotspot?: unknown;
    crop?: unknown;
  };
}

export default function HeroLanding({
  eyebrow,
  title,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  image,
  imageDark,
}: HeroLandingProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which image to use based on theme
  const imageToUse = mounted && theme === "dark" ? imageDark : image;
  const imgSrc = imageToUse?.asset
    ? urlFor(imageToUse).width(1200).height(700).fit("crop").url()
    : null;

  return (
    <div className="relative w-screen left-[calc(-50vw+50%)] min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      {imgSrc && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${imgSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 dark:bg-black/50" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-container mx-auto px-6 py-20 sm:px-8 sm:py-32 flex items-center justify-center">
        <div className="flex flex-col gap-6 text-primary max-w-2xl text-center">
          {eyebrow && (
            <div className="text-sm font-semibold uppercase tracking-wider opacity-90">
              {eyebrow}
            </div>
          )}

          {title && (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>
          )}

          {description && (
            <p className="text-lg sm:text-xl opacity-95 leading-relaxed">
              {description}
            </p>
          )}

          {(primaryCtaLabel || secondaryCtaLabel) && (
            <div className="flex flex-wrap gap-4 pt-4 justify-center">
              {primaryCtaLabel && primaryCtaHref && (
                <a
                  href={primaryCtaHref}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-primary text-background rounded-full transition-all hover:opacity-90 active:scale-95"
                >
                  {primaryCtaLabel}
                </a>
              )}
              {secondaryCtaLabel && secondaryCtaHref && (
                <a
                  href={secondaryCtaHref}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium border border-primary text-primary rounded-full transition-all hover:bg-primary/10 active:scale-95"
                >
                  {secondaryCtaLabel}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
