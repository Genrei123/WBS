import { cn } from "@/lib/utils";

import { LinkButton } from "../../ui/link-button";
import { Section } from "../../ui/section";

const STEPS = [
  {
    num: 1,
    title: "Tell us your idea",
    body: "Hop on a free 30-minute call and share what you want to build and why.",
  },
  {
    num: 2,
    title: "We map it out",
    body: "We turn it into a clear scope, a realistic timeline, and an honest price.",
  },
  {
    num: 3,
    title: "You get a written plan",
    body: "No pressure, no obligation. Decide in your own time — the plan is yours to keep.",
  },
];

export default function PricingSteps({ className }: { className?: string }) {
  return (
    <Section className={cn("border-b-0", className)}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-brand-foreground/80 text-xs font-semibold tracking-widest uppercase">
            How it works
          </span>
          <h2 className="text-2xl leading-tight font-semibold sm:text-3xl lg:text-4xl">
            A call, then a <span className="text-brand">clear plan.</span>
          </h2>
        </div>

        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="border-brand/35 bg-brand/10 text-brand flex size-11 items-center justify-center rounded-full border text-lg font-bold">
                {step.num}
              </div>
              <h3 className="text-base font-semibold sm:text-lg">{step.title}</h3>
              <p className="text-muted-foreground text-sm font-light sm:text-base">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <LinkButton href="/contact-us" variant="default" size="lg">
            Book a Free Call
          </LinkButton>
          <span className="text-muted-foreground/70 text-xs font-light">
            Free · 30 minutes · zero pressure
          </span>
        </div>
      </div>
    </Section>
  );
}
