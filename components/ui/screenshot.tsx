import Image from "next/image";

import { cn } from "@/lib/utils";

interface ScreenshotProps {
  srcLight: string;
  srcDark?: string;
  alt: string;
  width: number;
  height: number;
  eager?: boolean;
  className?: string;
}

export default function Screenshot({
  srcLight,
  srcDark,
  alt,
  width,
  height,
  eager = false,
  className,
}: ScreenshotProps) {
  if (!srcDark) {
    return (
      <Image
        src={srcLight}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={eager ? "eager" : undefined}
        unoptimized={srcLight.endsWith(".svg")}
      />
    );
  }

  return (
    <>
      <Image
        src={srcLight}
        alt={alt}
        width={width}
        height={height}
        className={cn(className, "block dark:hidden")}
        loading={eager ? "eager" : undefined}
        unoptimized={srcLight.endsWith(".svg")}
      />
      <Image
        src={srcDark}
        alt={alt}
        width={width}
        height={height}
        className={cn(className, "hidden dark:block")}
        loading={eager ? "eager" : undefined}
        unoptimized={srcDark.endsWith(".svg")}
      />
    </>
  );
}
