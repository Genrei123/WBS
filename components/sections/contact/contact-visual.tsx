"use client";

import { ImageIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface ContactVisualProps {
  /** Image to show — a full URL (https://…) or a /public path. Image-only panel. */
  imageSrc?: string;
  alt?: string;
  className?: string;
}

export default function ContactVisual({
  imageSrc,
  alt = "",
  className,
}: ContactVisualProps) {
  const [failed, setFailed] = useState(false);
  const showImage = !!imageSrc && !failed;

  return (
    <div
      className={cn(
        "relative h-72 overflow-hidden rounded-2xl border border-white/10 sm:h-96 lg:h-full",
        !showImage &&
          "bg-linear-to-br from-[#1c1812] via-[#14110d] to-[#0e0c09]",
        className,
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={alt}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="text-muted-foreground/50 absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-sm">
          <ImageIcon className="size-8" />
          <span>
            {imageSrc ? "Image couldn't load" : "Your image goes here"}
          </span>
        </div>
      )}
    </div>
  );
}
