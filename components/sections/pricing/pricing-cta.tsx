import { cn } from "@/lib/utils";

import { LinkButton } from "../../ui/link-button";
import { Section } from "../../ui/section";

export default function PricingCTA({ className }: { className?: string }) {
  return (
    <Section className={cn("border-b-0", className)}>
      <div className="border-border/60 dark:border-border/15 relative overflow-hidden rounded-3xl border bg-black px-6 py-16 text-center sm:px-12">
        {/* Centered glow that fades out to black */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_65%_at_50%_50%,rgba(224,201,166,0.13),transparent_72%)]"
        />
        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-5">
          <h2 className="text-2xl leading-tight font-semibold sm:text-4xl sm:leading-tight lg:text-5xl">
            Let&apos;s build it — <span className="text-brand">together.</span>
          </h2>
          <p className="text-muted-foreground text-sm font-light text-balance sm:text-base">
            Book your free 30-minute scoping call and walk away with a clear
            plan and price.
          </p>
          <div className="flex flex-col items-center gap-3">
            <LinkButton href="/contact-us" variant="default" size="lg">
              Book a Free Call
            </LinkButton>
            <span className="text-muted-foreground/70 text-xs font-light">
              No commitment · we make it easy
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
