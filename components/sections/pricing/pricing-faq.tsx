import { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

interface FaqItem {
  question: string;
  answer: ReactNode;
}

const FAQS: FaqItem[] = [
  {
    question: "What happens after I book a call?",
    answer: (
      <>
        We hop on a <strong className="text-foreground">free 30-minute call</strong> to
        understand your idea. A few days later you get a clear written plan —
        scope, timeline, and price. If you&apos;re happy, we start; if not, the
        plan is still yours.{" "}
        <strong className="text-foreground">No pressure either way.</strong>
      </>
    ),
  },
  {
    question: "Are these prices final?",
    answer: (
      <>
        They&apos;re <strong className="text-foreground">starting points</strong> to give
        you a ballpark. Your real number depends on your exact features and
        timeline — that&apos;s what the call is for. You&apos;re{" "}
        <strong className="text-foreground">billed monthly as we build</strong>, with no
        lock-in, so you stay in control the whole way.
      </>
    ),
  },
  {
    question: "Can I pause or stop anytime?",
    answer: (
      <>
        Yes. There&apos;s <strong className="text-foreground">no lock-in</strong> — pause
        or stop at the end of any month, and{" "}
        <strong className="text-foreground">
          everything we&apos;ve built is yours to keep.
        </strong>{" "}
        Most clients simply continue month to month until their product is done.
      </>
    ),
  },
  {
    question: "Who owns the code and the final product?",
    answer: (
      <>
        <strong className="text-foreground">You do.</strong> Source code, accounts, and
        credentials are all turned over to you — no lock-in, no hostage
        situations.
      </>
    ),
  },
  {
    question: "What does the 6-month guarantee cover?",
    answer: (
      <>
        If anything we built{" "}
        <strong className="text-foreground">breaks or doesn&apos;t work as agreed</strong>,
        we fix it free for 6 months after launch. It covers defects in our work
        — not new features or changes, which are handled through a Care plan or
        a quick quote.
      </>
    ),
  },
  {
    question: "Who pays for hosting and domains?",
    answer: (
      <>
        Hosting, domains, app store fees, and any paid third-party services are{" "}
        <strong className="text-foreground">billed to you</strong> directly by those
        providers. We recommend the right setup for your budget and handle the
        configuration as part of launch.
      </>
    ),
  },
];

export default function PricingFAQ({ className }: { className?: string }) {
  return (
    <Section className={cn("border-b-0", className)}>
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-2xl leading-tight font-semibold sm:text-3xl lg:text-4xl">
            Common <span className="text-brand">questions</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-1 dark:glass-3 rounded-xl border-b-0 px-5"
            >
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline sm:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed font-light">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="text-muted-foreground/70 mx-auto max-w-2xl text-center text-xs leading-relaxed font-light">
          Prices are{" "}
          <strong className="text-muted-foreground">starting estimates{" "}</strong> and 
          you&apos;re{" "}
          <strong className="text-muted-foreground">billed monthly as we build</strong> —
          your exact plan, timeline, and price are confirmed on a free scoping
          call before any work begins.
        </p>
      </div>
    </Section>
  );
}
