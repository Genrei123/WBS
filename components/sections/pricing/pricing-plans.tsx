"use client";

import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";
import { Section } from "../../ui/section";
import { PricingCard, type PricingCardProps } from "./pricing-card";

const BOOKING_HREF = "/contact-us";

type Currency = "php" | "usd";

interface Money {
  php: string;
  usd: string;
}

interface PlanData extends Omit<PricingCardProps, "price"> {
  price: Money;
}

const PLANS: PlanData[] = [
  {
    role: "Get Online",
    name: "Essentials Build",
    bestFor:
      "Landing pages, business websites, portfolios & simple internal tools.",
    price: { php: "₱15k", usd: "$700" },
    timeline: (
      <>
        <b className="text-brand font-semibold">Est. 2–3 months</b> · landing
        pages in ~2 weeks
      </>
    ),
    cta: {
      label: "Plan My Build",
      href: `${BOOKING_HREF}?plan=essentials`,
      variant: "outline",
    },
    features: [
      "Custom design & development",
      "Mobile-responsive on every device",
      "CMS so you can edit content yourself",
      "Launch & deployment included",
    ],
    footnote: "Billed monthly · no lock-in · you own it all",
    variant: "default",
  },
  {
    role: "Launch a Product",
    name: "Product Build",
    bestFor: "SaaS & web apps, client portals, dashboards & e-commerce.",
    price: { php: "₱35k", usd: "$1,500" },
    timeline: <b className="text-brand font-semibold">Est. 3–5 months</b>,
    cta: {
      label: "Plan My Build",
      href: `${BOOKING_HREF}?plan=product`,
      variant: "default",
    },
    features: [
      "Frontend + backend + database",
      "User accounts, logins & roles",
      "Integrations & APIs",
      "QA, testing & deployment",
    ],
    footnote: "Billed monthly · no lock-in · you own it all",
    tag: "Most Popular",
    variant: "featured",
  },
  {
    role: "Full Product",
    name: "Full Product Build",
    bestFor: "Mobile apps, multi-platform products & larger SaaS systems.",
    price: { php: "₱60k", usd: "$3,000" },
    timeline: (
      <>
        <b className="text-brand font-semibold">From 6 months</b> · scoped to
        your project
      </>
    ),
    cta: {
      label: "Book a Scoping Call",
      href: `${BOOKING_HREF}?plan=full`,
      variant: "outline",
    },
    features: [
      "Native mobile (Android + iOS) + backend",
      "A dedicated team on your product",
      "Multiple things built at once",
      "App store release & launch",
    ],
    footnote: "Billed monthly · no lock-in · you own it all",
    variant: "default",
  },
];

const PILOT_PRICE: Money = { php: "₱10,000", usd: "$400" };
const CARE_PRICE: Money = { php: "₱5,000", usd: "$250" };

const CHIPS = [
  "6-month guarantee",
  "You own the code",
  "Deployment & launch",
  "Handoff docs + walkthrough",
  "50% off your first Care month",
];

export default function PricingPlans({ className }: { className?: string }) {
  const [currency, setCurrency] = useState<Currency>("php");

  return (
    <Section className={cn("border-b-0 pt-0", className)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        {/* Currency toggle */}
        <div className="flex flex-col items-center gap-3">
          <Tabs
            value={currency}
            onValueChange={(value) => setCurrency(value as Currency)}
            className="w-fit"
          >
            <TabsList className="bg-muted/50 inline-flex items-center justify-center rounded-full border p-1">
              <TabsTrigger
                value="php"
                className="data-[state=active]:bg-background data-[state=active]:text-brand rounded-full px-5 py-1.5 text-sm font-semibold transition-colors data-[state=active]:shadow-sm"
              >
                ₱ PHP
              </TabsTrigger>
              <TabsTrigger
                value="usd"
                className="data-[state=active]:bg-background data-[state=active]:text-brand rounded-full px-5 py-1.5 text-sm font-semibold transition-colors data-[state=active]:shadow-sm"
              >
                $ USD
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-muted-foreground/70 text-xs font-light">
            Prices below are starting points — your real number comes from the
            call.
          </p>
        </div>

        {/* Pilot strip */}
        <div className="from-brand/10 to-brand-foreground/5 border-brand/25 flex flex-col items-center justify-between gap-4 rounded-2xl border bg-linear-to-r p-6 sm:flex-row sm:gap-6 sm:px-8">
          <p className="text-sm font-light text-balance sm:text-base">
            <span className="text-brand font-semibold">
              New here? Start with a 2-week Pilot — {PILOT_PRICE[currency]}.
            </span>{" "}
            Test how we work on a small task or review. Fully credited to your
            project if you continue.
          </p>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full shrink-0 sm:w-auto"
          >
            <Link href={`${BOOKING_HREF}?plan=pilot`}>Start a Pilot</Link>
          </Button>
        </div>

        {/* Build heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-brand-foreground/80 text-xs font-semibold tracking-widest uppercase">
            Build
          </span>
          <h2 className="text-2xl leading-tight font-semibold sm:text-3xl lg:text-4xl">
            Pick the build that{" "}
            <span className="text-brand">fits your idea.</span>
          </h2>
          <p className="text-muted-foreground max-w-[560px] text-sm font-light sm:text-base">
            Billed monthly as we work — no lock-in, pause anytime, and you own
            everything we build.
          </p>
        </div>

        {/* Build cards */}
        <div className="grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.name}
              {...plan}
              price={plan.price[currency]}
            />
          ))}
        </div>

        {/* Care band */}
        <div className="glass-1 dark:glass-3 flex flex-col items-start justify-between gap-5 rounded-2xl p-8 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-bold sm:text-lg lg:text-xl">
              After launch: Care Plan —{" "}
              <span className="text-brand">{CARE_PRICE[currency]}/mo</span>, flat
            </h3>
            <p className="text-muted-foreground max-w-[640px] text-sm font-light">
              Hosting & uptime, backups, security updates, ongoing bug fixes,
              and small edits. One simple price for any project — big or small.
            </p>
            <p className="text-muted-foreground/70 text-xs font-light">
              Optional. Your first 6 months are already covered free by our
              guarantee.
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full shrink-0 sm:w-auto"
          >
            <Link href={`${BOOKING_HREF}?plan=care`}>Ask About Care</Link>
          </Button>
        </div>

        {/* Includes chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="bg-muted/40 border-border dark:border-border/20 flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium"
            >
              <CircleCheckBig className="text-brand size-3.5 shrink-0" />
              {chip}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
