import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";

const pricingCardVariants = cva(
  "relative flex flex-col gap-6 overflow-hidden rounded-2xl p-8 shadow-xl",
  {
    variants: {
      variant: {
        default: "glass-1 to-transparent dark:glass-3",
        featured:
          "glass-3 from-card/100 to-card/100 dark:glass-4 border-brand/40 after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] after:bg-brand-foreground/70 after:blur-[72px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface PricingCardProps
  extends VariantProps<typeof pricingCardVariants> {
  role: string;
  name: string;
  bestFor: string;
  price: string;
  priceUnit?: string;
  fromLabel?: string;
  timeline: ReactNode;
  cta: {
    label: string;
    href: string;
    variant: "default" | "glow" | "outline";
  };
  features: string[];
  footnote?: string;
  tag?: string;
  className?: string;
}

export function PricingCard({
  role,
  name,
  bestFor,
  price,
  priceUnit = "/mo",
  fromLabel = "from",
  timeline,
  cta,
  features,
  footnote,
  tag,
  variant,
  className,
}: PricingCardProps) {
  const isFeatured = variant === "featured";

  return (
    <div className={cn(pricingCardVariants({ variant, className }))}>
      {tag && (
        <span className="bg-brand text-primary-foreground absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md px-3 py-1 text-xs font-semibold tracking-wide uppercase dark:text-[#42302B]">
          {tag}
        </span>
      )}
      <hr
        className={cn(
          "absolute top-0 left-[10%] h-px w-[80%] border-0 bg-linear-to-r from-transparent to-transparent",
          isFeatured ? "via-brand" : "via-foreground/60",
        )}
      />

      <div className="flex flex-col gap-5">
        <header className="flex flex-col gap-2">
          <span
            className={cn(
              "text-xs font-semibold tracking-widest uppercase",
              isFeatured ? "text-brand" : "text-brand-foreground/80",
            )}
          >
            {role}
          </span>
          <h3 className="text-lg font-bold sm:text-xl">{name}</h3>
          <p className="text-muted-foreground min-h-[56px] text-sm">
            <span className="text-foreground mb-1 block text-[11px] font-semibold tracking-wide uppercase">
              Best for
            </span>
            {bestFor}
          </p>
        </header>

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-muted-foreground text-sm">{fromLabel}</span>
            <span className="text-3xl font-bold tracking-tight sm:text-4xl">
              {price}
            </span>
            <span className="text-muted-foreground text-sm">{priceUnit}</span>
          </div>
          <p className="text-muted-foreground text-xs">{timeline}</p>
        </div>

        <Button
          variant={cta.variant}
          size="lg"
          asChild
          className="w-full"
        >
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      </div>

      <ul className="flex flex-grow flex-col gap-2">
        {features.map((feature, index) => (
          <li
            key={`${feature}-${index}`}
            className="flex items-start gap-2 text-sm"
          >
            <CircleCheckBig className="text-brand mt-0.5 size-4 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {footnote && (
        <p className="text-muted-foreground/70 border-input border-t pt-4 text-xs">
          {footnote}
        </p>
      )}
    </div>
  );
}
