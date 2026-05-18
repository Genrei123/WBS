"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

type CarouselItem = {
  _key?: string;
  backgroundImage?: {
    asset?: { _id?: string; url?: string };
    alt?: string;
    hotspot?: unknown;
    crop?: unknown;
  };
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type CarouselSectionProps = {
  heading?: string;
  description?: string;
  items?: CarouselItem[];
};

export default function CarouselSection({
  heading,
  description,
  items,
}: CarouselSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!items || items.length === 0) return null;

  const activeItem = items[activeIdx];
  const imgSrc = activeItem?.backgroundImage?.asset
    ? urlFor(activeItem.backgroundImage).width(1200).height(600).fit("crop").url()
    : null;

  const goToPrevious = () => {
    setActiveIdx((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIdx((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      {/* Header */}
      {(heading || description) && (
        <div className="mb-12 text-center">
          {heading && (
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl mb-4">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Carousel */}
      <div className="relative w-full">
        {/* Main carousel container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
          <AnimatePresence mode="wait">
            {imgSrc ? (
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${imgSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-white"
                  >
                    {activeItem?.eyebrow && (
                      <div className="mb-2 text-sm font-semibold uppercase tracking-wider opacity-90">
                        {activeItem.eyebrow}
                      </div>
                    )}
                    {activeItem?.title && (
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                        {activeItem.title}
                      </h3>
                    )}
                    {activeItem?.description && (
                      <p className="text-base sm:text-lg max-w-2xl mb-4 opacity-95">
                        {activeItem.description}
                      </p>
                    )}
                    {activeItem?.ctaLabel && activeItem?.ctaHref && (
                      <a
                        href={activeItem.ctaHref}
                        className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium bg-primary text-background rounded-full transition-opacity hover:opacity-80"
                      >
                        {activeItem.ctaLabel}
                      </a>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm"
              >
                No image available
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        {items.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60 backdrop-blur-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60 backdrop-blur-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {items.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  idx === activeIdx
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/40 w-2 hover:bg-muted-foreground/60"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
