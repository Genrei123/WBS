import { User, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingColumn, PricingColumnProps } from "../../ui/pricing-column";
import { Section } from "../../ui/section";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import FAQ from "../faq/default";

interface PricingProps {
  title?: string | false;
  description?: string | false;
  plans?: PricingColumnProps[] | false;
  className?: string;
}

enum Currency {
  usd = "usd",
  php = "php",
}

const DEFAULT_PRICING_PLANS: PricingColumnProps[] = [
  {
    name: "Starter Partner",
    icon: <User className="size-4" />,
    description: "Keeps your existing site or app healthy — support first, light dev work when needed.",
    price: {
      usd: 270,
      php: 15000,
    },
    priceNote: "No lock-in. Cancel or upgrade monthly.",
    cta: {
      variant: "default",
      label: "Get started",
      href: '/contact-us',
    },
    features: [
      "Monthly support task batch",
      "Bug fixes & small improvements",
      "QA & testing support",
      "Light backend / API touch-ups",
      "Monthly progress report",
    ],
    variant: "default",
  },
  {
    name: "Growth Partner",
    icon: <Briefcase className="size-4" />,
    description: "Real coding every week — features built, tested, and shipped continuously.",
    price: {
      usd: 625,
      php: 35000,
    },
    priceNote: "Less than half the cost of one full-time developer.",
    cta: {
      variant: "glow",
      label: "Get started",
      href: "/contact-us",
    },
    features: [
      "Everything in Starter, plus:",
      "Weekly hands-on development",
      "New features & improvements",
      "API & integration development",
      "Deployment & release support",
      "QA on every release",
      "Weekly updates & planning calls",
    ],
    variant: "glow-brand",
  },
  {
    name: "Product Team",
    icon: <Users className="size-4" />,
    description: "Works like your in-house engineering team — builds entire products end to end.",
    price: {
      usd: 1075,
      php: 60000,
    },
    priceNote: "A full team's output — without multiple full-time salaries.",
    cta: {
      variant: "default",
      label: "Book a call",
      href: "/contact-us",
    },
    features: [
      "Everything in Growth, plus:",
      "Dedicated multi-dev team",
      "Full product & feature builds",
      "Multiple parallel workstreams",
      "Sprint planning & regular meetings",
      "Mobile + web + backend + QA",
      "Priority scheduling & rush work",
      "Dedicated project lead",
    ],
    variant: "glow",
  },
];

export default function Pricing({
  title = "Let us build your website. TODAY!",
  description = "We make businesses EASY.",
  plans = DEFAULT_PRICING_PLANS,
  className = "",
}: PricingProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.php);

  return (
    <Section className={cn(className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12">
        {(title || description) && (
          <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
            {title && <h2 className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">{title}</h2>}
            {description && (
              <p className="text-md text-muted-foreground max-w-[600px] font-medium sm:text-xl">{description}</p>
            )}
          </div>
        )}

        <Tabs
          defaultValue={Currency.php}
          value={selectedCurrency}
          onValueChange={(value) => setSelectedCurrency(value as Currency)}
          className="w-fit"
        >
          <TabsList className="bg-muted/50 inline-flex items-center justify-center rounded-full border p-1">
            <TabsTrigger
              value={Currency.usd}
              className="data-[state=active]:bg-background rounded-full px-4 py-1.5 text-sm font-medium transition-colors data-[state=active]:shadow-sm"
            >
              USD
            </TabsTrigger>
            <TabsTrigger
              value={Currency.php}
              className="data-[state=active]:bg-background rounded-full px-4 py-1.5 text-sm font-medium transition-colors data-[state=active]:shadow-sm"
            >
              PHP
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {plans !== false && plans.length > 0 && (
          <div className="max-w-container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingColumn
                key={plan.name}
                name={plan.name}
                icon={plan.icon}
                description={plan.description}
                price={plan.price}
                currency={selectedCurrency}
                originalPrice={plan.originalPrice}
                promotionText={plan.promotionText}
                priceNote={plan.priceNote}
                cta={plan.cta}
                features={plan.features}
                variant={plan.variant}
                className={plan.className}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
