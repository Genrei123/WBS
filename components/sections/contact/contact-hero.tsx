import { cn } from "@/lib/utils";

const STEPS = [
  {
    num: 1,
    title: "You send this form",
    body: "A few details about you and what you want to build.",
  },
  {
    num: 2,
    title: "We reply & book a call",
    body: "Within 1 business day, we set up a free scoping call.",
  },
  {
    num: 3,
    title: "You get a clear plan",
    body: "Scope, timeline, and price in writing — yours to keep.",
  },
];

export default function ContactHero({ className }: { className?: string }) {
  return (
    <section
      className={cn("relative px-4 pt-32 pb-12 sm:pt-36 sm:pb-16", className)}
    >
      {/* Title + subtext */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl sm:leading-tight">
          Let&apos;s build it — <span className="text-brand">together.</span>
        </h1>
        <p className="text-muted-foreground max-w-xl text-sm font-light text-balance sm:text-base">
          Tell us what you have in mind. We&apos;ll reply with next steps and set
          up a free 30-minute call — no commitment, no jargon.
        </p>
      </div>

      {/* What happens next */}
      <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3 sm:gap-6">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="flex flex-col items-center gap-3 text-center"
          >
            <span className="border-brand/35 bg-brand/10 text-brand flex size-10 shrink-0 items-center justify-center rounded-full border text-base font-bold">
              {step.num}
            </span>
            <h3 className="text-sm font-semibold sm:text-base">{step.title}</h3>
            <p className="text-muted-foreground max-w-[240px] text-xs font-light sm:text-sm">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
