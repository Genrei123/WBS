import { cn } from "@/lib/utils";

import { LinkButton } from "../../ui/link-button";

interface PricingHeroProps {
  title?: string;
  accent?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  microNote?: string;
  className?: string;
}

export default function PricingHero({
  title = "Tell us what you're",
  accent = "building.",
  description = "In a free 30-minute call we map your plan, timeline, and price — no jargon, no commitment.",
  ctaLabel = "Book a Free Call",
  ctaHref = "/contact-us",
  microNote = "Free · 30 minutes · zero pressure",
  className,
}: PricingHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden px-4 pt-32 pb-12 text-center sm:pt-40 sm:pb-16",
        className,
      )}
    >
      {/* Subtle centered glow that fades to the page background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_0%,rgba(224,201,166,0.10),transparent_70%)]"
      />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6">
        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-[1.1]">
          {title} <br className="hidden sm:block" />
          <span className="text-brand">{accent}</span>
        </h1>
        <p className="text-muted-foreground max-w-[600px] text-sm font-medium text-balance sm:text-base lg:text-lg">
          {description}
        </p>
        <div className="flex flex-col items-center gap-3">
          <LinkButton href={ctaHref} variant="default" size="lg">
            {ctaLabel}
          </LinkButton>
          <span className="text-muted-foreground/70 text-xs font-light">
            {microNote}
          </span>
        </div>
      </div>
    </section>
  );
}
