import type { Metadata } from "next";

import ContactDirect from "@/components/sections/contact/contact-direct";
import ContactForm from "@/components/sections/contact/contact-form";
import ContactHero from "@/components/sections/contact/contact-hero";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you're building. Pick what fits and we'll tailor the form — it ends in a free 30-minute scoping call, no commitment.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;

  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <ContactHero />
      <ContactForm initialPlan={plan} />
      <ContactDirect />
    </main>
  );
}
