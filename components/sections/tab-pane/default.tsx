"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

type Tab = {
  _key?: string;
  title: string;
  heading?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: {
    asset?: { _id?: string; url?: string };
    alt?: string;
    hotspot?: unknown;
    crop?: unknown;
  };
};

type TabPaneProps = {
  tabs?: Tab[];
};

export default function TabPane({ tabs }: TabPaneProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!tabs || tabs.length === 0) return null;

  const activeTab = tabs[activeIdx];
  const imgSrc = activeTab?.image?.asset
    ? urlFor(activeTab.image).width(900).height(700).fit("crop").url()
    : null;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 items-center">
      {/* Left: tabs + content */}
      <div className="flex flex-col gap-8">
        {/* Tab pills */}
        <div className="flex flex-row flex-wrap gap-2">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={tab._key || tab.title}
                onClick={() => setActiveIdx(idx)}
                className="relative px-4 py-2 rounded-full text-sm transition-colors"
                style={{ transformStyle: "preserve-3d" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="tabpane-active"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                    className="absolute inset-0 bg-primary rounded-full"
                  />
                )}
                <span
                  className={cn(
                    "relative block text-sm font-medium",
                    isActive ? "text-background" : "text-foreground"
                  )}
                >
                  {tab.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            {activeTab?.heading && (
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {activeTab.heading}
              </h2>
            )}
            {activeTab?.description && (
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                {activeTab.description}
              </p>
            )}
            {activeTab?.ctaLabel && activeTab?.ctaHref && (
              <div className="mt-2">
                <a
                  href={activeTab.ctaHref}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-primary text-background rounded-full transition-opacity hover:opacity-80"
                >
                  {activeTab.ctaLabel}
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right: image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
        <AnimatePresence mode="wait">
          {imgSrc ? (
            <motion.img
              key={activeIdx}
              src={imgSrc}
              alt={activeTab?.image?.alt || activeTab?.heading || ""}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm"
            >
              No image
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}