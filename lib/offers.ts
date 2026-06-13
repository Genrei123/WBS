// Shared catalog of what WeBread sells. Used by the pricing page (cards) and the
// contact page (smart offer picker + form auto-fill) so the two never drift apart.

export type OfferId =
  | "essentials"
  | "product"
  | "full"
  | "pilot"
  | "care"
  | "not-sure";

export interface Offer {
  id: OfferId;
  /** Small eyebrow / role label shown above the name. */
  eyebrow: string;
  name: string;
  /** Short "best for" line. */
  bestFor: string;
  price?: { php: string; usd: string };
  /** e.g. "per month", "one-time" */
  priceUnit?: string;
  /** Human timeline, e.g. "~2–3 months" */
  timeline?: string;
  /** Pre-selected budget bracket for the contact form. */
  budgetHint?: string;
  popular?: boolean;
}

export const OFFERS: Offer[] = [
  {
    id: "essentials",
    eyebrow: "Get Online",
    name: "Essentials Build",
    bestFor:
      "Landing pages, business websites, portfolios & simple internal tools.",
    price: { php: "₱15k", usd: "$700" },
    priceUnit: "per month",
    timeline: "~2–3 months",
    budgetHint: "Under ₱20k · $1k / mo",
  },
  {
    id: "product",
    eyebrow: "Launch a Product",
    name: "Product Build",
    bestFor: "SaaS & web apps, client portals, dashboards & e-commerce.",
    price: { php: "₱35k", usd: "$1,500" },
    priceUnit: "per month",
    timeline: "~3–5 months",
    budgetHint: "₱20k–40k · $1k–2k / mo",
    popular: true,
  },
  {
    id: "full",
    eyebrow: "Full Product",
    name: "Full Product Build",
    bestFor: "Mobile apps, multi-platform products & larger SaaS systems.",
    price: { php: "₱60k", usd: "$3,000" },
    priceUnit: "per month",
    timeline: "6+ months",
    budgetHint: "₱40k–80k · $2k–4k / mo",
  },
  {
    id: "pilot",
    eyebrow: "Try Us First",
    name: "2-Week Pilot",
    bestFor:
      "A small task or review to test how we work — credited to your project.",
    price: { php: "₱10,000", usd: "$400" },
    priceUnit: "one-time",
    timeline: "2 weeks",
    budgetHint: "One-time project",
  },
  {
    id: "care",
    eyebrow: "After Launch",
    name: "Care Plan",
    bestFor:
      "Hosting & uptime, backups, security updates, bug fixes & small edits.",
    price: { php: "₱5,000", usd: "$250" },
    priceUnit: "per month",
    timeline: "Ongoing",
    budgetHint: "Under ₱20k · $1k / mo",
  },
  {
    id: "not-sure",
    eyebrow: "Let's figure it out",
    name: "Not sure yet",
    bestFor:
      "Tell us your idea on a free call and we'll recommend the right path.",
  },
];

export const BUDGET_OPTIONS = [
  "Not sure yet",
  "Under ₱20k · $1k / mo",
  "₱20k–40k · $1k–2k / mo",
  "₱40k–80k · $2k–4k / mo",
  "₱80k+ · $4k+ / mo",
  "One-time project",
];

export function getOffer(id?: string | null): Offer | undefined {
  if (!id) return undefined;
  return OFFERS.find((o) => o.id === id);
}

/** A tailored, editable starter message for the contact form. */
export function buildInquiryMessage(offer: Offer): string {
  switch (offer.id) {
    case "pilot":
      return [
        "Hi WeBread team — I'd like to start with the 2-Week Pilot to see how you work.",
        "",
        "• The task or review I have in mind: ",
        "• What I'm ultimately trying to build: ",
      ].join("\n");
    case "care":
      return [
        "Hi WeBread team — I'd like to ask about the Care Plan for an existing site/app.",
        "",
        "• What needs looking after: ",
        "• Current stack / where it's hosted: ",
      ].join("\n");
    case "not-sure":
      return [
        "Hi WeBread team — I'm not sure which option fits yet. Here's my idea:",
        "",
        "• What I want to build: ",
        "• The problem it solves / goal: ",
        "• Ideal timeline (if any): ",
      ].join("\n");
    default:
      return [
        `Hi WeBread team — I'd like to start a ${offer.name}.`,
        "",
        "• What I'm building: ",
        "• The goal / problem it solves: ",
        "• Ideal timeline (if any): ",
      ].join("\n");
  }
}
