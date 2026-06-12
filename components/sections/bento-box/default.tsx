"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type BentoBoxData = {
  _key?: string;
  title?: string;
  subtitle?: string;
  url?: string;
  variant?: "default" | "textOnly" | "imageOnly";
  textAlign?: "left" | "center" | "right";
  image?: any;
  imageDark?: any;
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

const getTextAlignClasses = (textAlign?: "left" | "center" | "right") => {
  switch (textAlign) {
    case "center":
      return "items-center text-center";
    case "right":
      return "items-end text-right";
    default:
      return "items-start text-left";
  }
};

export default function BentoBoxSection({ eyebrow, title, description, bentoBoxes }: BentoBoxSectionProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!bentoBoxes || bentoBoxes.length === 0) return null;

  return (
    <div className="w-full">
      {(eyebrow || title || description) && (
        <div className="mb-12 max-w-3xl">
          {eyebrow && (
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-gray-600 uppercase dark:text-gray-400">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-black sm:text-4xl lg:text-5xl dark:text-white">
              {title}
            </h2>
          )}
          {description && <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
      )}

      <div className="grid auto-rows-[400px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bentoBoxes.map((box, index) => {
          const variant = box.variant || "default";
          const isTextOnly = variant === "textOnly";
          const isImageOnly = variant === "imageOnly";

          // ... inside the map:
          const lightImageSrc = box.image ? urlFor(box.image).width(1200).url() : null;
          const darkImageSrc = box.imageDark ? urlFor(box.imageDark).width(1200).url() : lightImageSrc;

          // Before mounted, always use light image so server and client agree
          const imageSrc = mounted
            ? resolvedTheme === "dark"
              ? darkImageSrc || lightImageSrc
              : lightImageSrc || darkImageSrc
            : lightImageSrc || darkImageSrc;
          const morphImgSrc = box.morphImage ? urlFor(box.morphImage).width(1200).url() : null;

          const spanClass = index % 4 === 0 || index % 4 === 3 ? "lg:col-span-1" : "lg:col-span-2";

          const imageMotionVariants = isImageOnly
            ? {
                initial: { scale: 1 },
                hover: { scale: 1.05 },
              }
            : {
                initial: { y: 20, x: 0, scale: 1 },
                hover: {
                  y: box.hoverAction === "moveUp" ? -10 : box.hoverAction === "moveSideways" ? 20 : 20,
                  x: box.hoverAction === "moveSideways" ? 20 : 0,
                  scale: box.hoverAction === "zoomIn" ? 1.05 : box.hoverAction === "zoomOut" ? 0.95 : 1,
                },
              };

          return (
            <motion.a
              href={box.url || "#"}
              key={box._key || index}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-[#0c0c0c] dark:hover:bg-[#111]",
                isImageOnly ? "p-0" : "p-8",
                spanClass
              )}
              initial="initial"
              whileHover="hover"
            >
              {/* Background Permanent Glow */}
              {box.hasGlow && (
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 z-0 m-auto h-[60%] w-[60%] rounded-full blur-[80px]",
                    getGlowColorClass(box.glowColor)
                  )}
                />
              )}

              {/* Top right link button */}
              {box.url && !isImageOnly && (
                <div className="absolute top-8 right-8 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/5 opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-black/10 group-hover:opacity-100 dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/10">
                  <ArrowUpRight className="h-5 w-5 text-black dark:text-white" />
                </div>
              )}

              {/* Text Content */}
              {!isImageOnly && (
                <div
                  className={cn(
                    "relative z-10 flex h-full flex-col gap-2",
                    isTextOnly ? "justify-center text-center" : ""
                  )}
                >
                  {box.title && (
                    <h3
                      className={cn(
                        "font-bold tracking-tight text-black dark:text-white",
                        isTextOnly ? "text-3xl sm:text-4xl" : "text-2xl"
                      )}
                    >
                      {box.title}
                    </h3>
                  )}
                  {box.subtitle && (
                    <p
                      className={cn(
                        "text-sm leading-relaxed text-black/60 dark:text-white/60",
                        isTextOnly ? "text-base dark:text-white/70" : "max-w-[85%]"
                      )}
                    >
                      {box.subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Image Section */}
              {isImageOnly && imageSrc && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <motion.div
                    className="relative h-full w-full"
                    variants={imageMotionVariants}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <img
                      key={imageSrc}
                      src={imageSrc}
                      alt={box.title || "Bento box image"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </motion.div>
                </div>
              )}

              {!isImageOnly && imageSrc && (
                <div className="pointer-events-none absolute right-0 bottom-0 left-0 flex h-[60%] items-center justify-center overflow-hidden px-8 pb-8">
                  <motion.div
                    className="relative flex h-full w-full items-center justify-center"
                    variants={imageMotionVariants}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <img
                      src={imageSrc}
                      alt={box.title || "Bento box image"}
                      className={cn(
                        "h-full w-full object-contain transition-opacity duration-500",
                        box.hoverAction === "morph" && box.morphImage ? "group-hover:opacity-0" : ""
                      )}
                      loading="lazy"
                    />
                    {box.hoverAction === "morph" && box.morphImage && morphImgSrc && (
                      <img
                        src={morphImgSrc}
                        alt={box.title + " morph"}
                        className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        loading="lazy"
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
