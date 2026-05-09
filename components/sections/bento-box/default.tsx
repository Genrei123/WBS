"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

type BentoBoxData = {
  _key?: string;
  title?: string;
  subtitle?: string;
  url?: string;
  image?: any;
  hoverAction?: "moveUp" | "moveSideways" | "zoomIn" | "zoomOut" | "morph";
  morphImage?: any;
  hasGlow?: boolean;
  glowColor?: "orange" | "blue" | "white" | "green";
};

type BentoBoxSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  bentoBoxes?: BentoBoxData[];
};

const getGlowColorClass = (color?: string) => {
  switch (color) {
    case "orange":
      return "bg-orange-500/30";
    case "blue":
      return "bg-blue-500/30";
    case "white":
      return "bg-white/30";
    case "green":
      return "bg-green-500/30";
    default:
      return "bg-orange-500/30";
  }
};

export default function BentoBoxSection({
  eyebrow,
  title,
  description,
  bentoBoxes,
}: BentoBoxSectionProps) {
  if (!bentoBoxes || bentoBoxes.length === 0) return null;

  return (
    <div className="w-full">
      {(eyebrow || title || description) && (
        <div className="mb-12 max-w-3xl">
          {eyebrow && (
            <p className="text-muted-foreground mb-4 text-sm font-semibold tracking-[0.2em] uppercase">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground text-lg leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
        {bentoBoxes.map((box, index) => {
          // Calculate span to make grid look more interesting
          // For example, every 4th item could span 2 columns if not on mobile
          // But user said "pattern will just repeat", so let's stick to normal grid
          // However, we can add a basic masonry or distinct spans if requested later.
          // For now, 1 col on mobile, 2 on tablet, 3 on desktop.
          
          const imgSrc = box.image ? urlFor(box.image).width(800).url() : null;
          const morphImgSrc = box.morphImage
            ? urlFor(box.morphImage).width(800).url()
            : null;

          const spanClass =
            index % 4 === 0 || index % 4 === 3
              ? "lg:col-span-1"
              : "lg:col-span-2";

          return (
            <motion.a
              href={box.url || "#"}
              key={box._key || index}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] p-8 flex flex-col transition-colors hover:bg-[#111]",
                spanClass
              )}
              initial="initial"
              whileHover="hover"
            >
              {/* Background Permanent Glow */}
              {box.hasGlow && (
                <div
                  className={cn(
                    "absolute inset-0 m-auto h-[60%] w-[60%] rounded-full blur-[80px] z-0 pointer-events-none",
                    getGlowColorClass(box.glowColor)
                  )}
                />
              )}

              {/* Top right link button */}
              {box.url && (
                <div className="absolute top-8 right-8 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-white/10 group-hover:scale-110 z-20">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>
              )}

              {/* Text Content */}
              <div className="relative z-10 flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {box.title}
                </h3>
                {box.subtitle && (
                  <p className="text-white/60 text-sm leading-relaxed max-w-[85%]">
                    {box.subtitle}
                  </p>
                )}
              </div>

              {/* Image Section */}
              {imgSrc && (
                <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center px-8 pb-8 overflow-hidden pointer-events-none">
                  <motion.div
                    className="relative w-full h-full flex items-center justify-center"
                    variants={{
                      initial: { y: 20, x: 0, scale: 1 },
                      hover: {
                        y: box.hoverAction === "moveUp" ? -10 : box.hoverAction === "moveSideways" ? 20 : 20,
                        x: box.hoverAction === "moveSideways" ? 20 : 0,
                        scale: box.hoverAction === "zoomIn" ? 1.05 : box.hoverAction === "zoomOut" ? 0.95 : 1,
                      },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <img
                      src={imgSrc}
                      alt={box.title}
                      className={cn(
                        "w-full h-full object-contain transition-opacity duration-500",
                        box.hoverAction === "morph" && box.morphImage
                          ? "group-hover:opacity-0"
                          : ""
                      )}
                    />
                    {box.hoverAction === "morph" && box.morphImage && morphImgSrc && (
                      <img
                        src={morphImgSrc}
                        alt={box.title + " morph"}
                        className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                  </motion.div>
                </div>
              )}
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
