import type { Metadata } from "next";

import PricingCTA from "@/components/sections/pricing/pricing-cta";
import PricingFAQ from "@/components/sections/pricing/pricing-faq";
import PricingHero from "@/components/sections/pricing/pricing-hero";
import PricingPlans from "@/components/sections/pricing/pricing-plans";
import PricingSteps from "@/components/sections/pricing/pricing-steps";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Tell us what you're building. In a free 30-minute call we map your plan, timeline, and price — billed monthly, no lock-in, you own everything.",
};

export default function PricingPage() {
  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <PricingHero />
      <PricingPlans />
      <PricingSteps />
      <PricingCTA />
      <PricingFAQ />
    </main>
  );
}
