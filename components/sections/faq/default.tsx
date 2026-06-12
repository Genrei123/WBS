import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    question: "What is this app, and how can it help me?",
    answer:
      "Our app uses AI to analyze your data and surface actionable insights, helping you make faster, smarter decisions without the manual work.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! You can get started for free with no credit card required. Upgrade anytime to unlock additional features.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, and PayPal. Enterprise plans can also be paid via bank transfer.",
  },
  {
    question: "How does the app keep my financial data secure?",
    answer:
      "All data is encrypted in transit and at rest using industry-standard protocols, and we never share your information with third parties.",
  },
  {
    question: "I need help with the app. How can I contact support?",
    answer:
      "You can reach our support team 24/7 through live chat, email at support@example.com, or by submitting a ticket through the app. We typically respond within 2-4 hours during business days.",
  },
];

export default function FAQ() {
  interface Coordinates {
    x: number;
    y: number;
  }

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (gradientRef.current) {
      gradientRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(59,130,246,0.25), transparent 50%)`;
    }
  };

  return (
    <section className="bg-background px-4 py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <span className="rounded-full border px-4 py-1 text-xs font-medium tracking-wide">FAQ</span>
        <h2 className="text-3xl font-bold sm:text-4xl">Choose the Perfect Plan for Your AI Journey</h2>
        <p className="text-muted-foreground max-w-xl text-sm sm:text-base">
          Find the right plan to unlock AI-powered insights and streamline your workflow.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-[1fr_2fr]">
        <div
          ref={gradientRef}
          className="bg-card relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6"
          onMouseMove={handleMouseMove}
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Can&apos;t find answers?</h3>
            <p className="text-muted-foreground text-sm">We&apos;re here to help! Get in touch with our support.</p>
            <Button className="mt-2 w-fit cursor-pointer" size="sm">
              Get Started - Free
            </Button>
          </div>
        </div>

        <Accordion type="single" collapsible defaultValue="item-4" className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-xl border px-5">
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline sm:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
