"use client";

import {
  Check,
  ChevronDown,
  CircleCheckBig,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import {
  BUDGET_OPTIONS,
  buildInquiryMessage,
  getOffer,
  type Offer,
  type OfferId,
  OFFERS,
} from "@/lib/offers";
import { cn } from "@/lib/utils";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import ContactVisual from "./contact-visual";

const fieldClass =
  "bg-background/60 border-border dark:border-border/20 focus:border-brand focus:ring-brand/25 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 placeholder:text-muted-foreground/60";

// Left-panel image. Use any full URL (https://…) or a /public path.
const CONTACT_IMAGE_URL = "/images/Contact-img2.png";

interface ContactFormProps {
  /** Plan id from the URL (e.g. ?plan=product) so arriving from pricing pre-fills the form. */
  initialPlan?: string;
}

export default function ContactForm({ initialPlan }: ContactFormProps) {
  const initialOffer = getOffer(initialPlan);

  const [selectedId, setSelectedId] = useState<OfferId | null>(
    initialOffer?.id ?? null,
  );
  // Arrived from pricing with a plan → collapse the picker, show the choice + fields.
  const [showPicker, setShowPicker] = useState(!initialOffer);
  const [cameFromPricing] = useState(!!initialOffer);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState(
    initialOffer?.budgetHint ?? BUDGET_OPTIONS[0],
  );
  const [message, setMessage] = useState(
    initialOffer ? buildInquiryMessage(initialOffer) : "",
  );

  // Track manual edits so re-picking a service never clobbers what the user typed.
  const [touched, setTouched] = useState({
    budget: false,
    message: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedOffer = getOffer(selectedId);

  function selectOffer(offer: Offer) {
    setSelectedId(offer.id);
    if (!touched.message) setMessage(buildInquiryMessage(offer));
    if (!touched.budget) setBudget(offer.budgetHint ?? BUDGET_OPTIONS[0]);
    setShowPicker(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please add your name and a valid email so we can reach you.");
      return;
    }
    setError(null);
    // TODO: wire to your email / CRM endpoint (e.g. POST /api/contact, Resend, Formspree).
    // For now we confirm locally so the flow is fully demonstrable.
    setSubmitted(true);
  }

  const firstName = name.trim().split(" ")[0] || "there";

  return (
    <section className="relative px-4 pt-0 pb-16 sm:pb-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-stretch lg:gap-10">
        {/* Left — image-only panel. Source is the CONTACT_IMAGE_URL above. */}
        <ContactVisual imageSrc={CONTACT_IMAGE_URL} alt="WeBread Studios" />

        {/* Right — interactive column */}
        {submitted ? (
          <div className="glass-1 dark:glass-3 flex flex-col items-center gap-5 rounded-2xl p-8 text-center sm:p-10">
            <div className="border-brand/35 bg-brand/10 text-brand flex size-12 items-center justify-center rounded-full border">
              <CircleCheckBig className="size-6" />
            </div>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Thanks, {firstName}!
            </h2>
            <p className="text-muted-foreground text-sm font-light sm:text-base">
              We got your note
              {selectedOffer ? (
                <>
                  {" "}
                  about the{" "}
                  <span className="text-foreground font-medium">
                    {selectedOffer.name}
                  </span>
                </>
              ) : null}
              . We&apos;ll email{" "}
              <span className="text-foreground font-medium">{email}</span> within
              1 business day to lock in your free 30-minute call.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSubmitted(false)}
            >
              Send another
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Offer picker / selected summary */}
            {!showPicker && selectedOffer ? (
              <div className="border-brand/30 bg-brand/[0.07] flex flex-col gap-3 rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-brand text-[11px] font-semibold tracking-wide uppercase">
                      {selectedOffer.eyebrow}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      {selectedOffer.name}
                      {selectedOffer.popular && (
                        <Badge variant="brand" size="sm" className="px-2 py-0.5">
                          Popular
                        </Badge>
                      )}
                    </span>
                    {selectedOffer.price && (
                      <span className="text-muted-foreground text-xs">
                        from {selectedOffer.price.php} /{" "}
                        {selectedOffer.price.usd} · {selectedOffer.priceUnit}
                        {selectedOffer.timeline
                          ? ` · ${selectedOffer.timeline}`
                          : ""}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className="text-muted-foreground hover:text-brand flex shrink-0 items-center gap-1 text-xs font-medium transition-colors"
                  >
                    <Pencil className="size-3" />
                    Change
                  </button>
                </div>
                {cameFromPricing && (
                  <p className="text-brand/90 flex items-center gap-1.5 text-xs font-light">
                    <Sparkles className="size-3.5 shrink-0" />
                    Pre-filled from your pick — just add your details below.
                  </p>
                )}
              </div>
            ) : (
              <div
                role="radiogroup"
                aria-label="What are you building?"
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold sm:text-xl">
                    What are you building?
                  </h2>
                  <p className="text-muted-foreground text-sm font-light">
                    Pick what fits and we&apos;ll tailor the form for you — or
                    just start typing below.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {OFFERS.map((offer) => {
                    const selected = selectedId === offer.id;
                    return (
                      <button
                        key={offer.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => selectOffer(offer)}
                        className={cn(
                          "relative flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-colors",
                          selected
                            ? "border-brand bg-brand/10"
                            : "border-border dark:border-border/15 bg-card/40 hover:border-brand/50",
                        )}
                      >
                        {selected && (
                          <span className="bg-brand text-primary-foreground absolute top-3 right-3 flex size-5 items-center justify-center rounded-full dark:text-[#42302B]">
                            <Check className="size-3" />
                          </span>
                        )}
                        <span className="text-brand-foreground/80 text-[11px] font-semibold tracking-wide uppercase">
                          {offer.eyebrow}
                        </span>
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          {offer.name}
                          {offer.popular && (
                            <Badge
                              variant="brand"
                              size="sm"
                              className="px-2 py-0.5"
                            >
                              Popular
                            </Badge>
                          )}
                        </span>
                        <span className="text-muted-foreground text-xs font-light">
                          {offer.bestFor}
                        </span>
                        {offer.price && (
                          <span className="text-muted-foreground/80 mt-1 text-xs">
                            from {offer.price.php} / {offer.price.usd} ·{" "}
                            {offer.priceUnit}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="glass-1 dark:glass-3 flex w-full flex-col gap-5 rounded-2xl p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full name <span className="text-brand">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan dela Cruz"
                    className={fieldClass}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-brand">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={fieldClass}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="company" className="text-sm font-medium">
                  Company / project name{" "}
                  <span className="text-muted-foreground/60 font-light">
                    (optional)
                  </span>
                </label>
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="WeBread Studios"
                  className={fieldClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="budget" className="text-sm font-medium">
                  Budget
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      id="budget"
                      type="button"
                      className={cn(
                        fieldClass,
                        "flex cursor-pointer items-center justify-between gap-2 text-left",
                      )}
                    >
                      <span>{budget}</span>
                      <ChevronDown className="text-muted-foreground size-4 shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                  >
                    <DropdownMenuRadioGroup
                      value={budget}
                      onValueChange={(v) => {
                        setBudget(v);
                        setTouched((t) => ({ ...t, budget: true }));
                      }}
                    >
                      {BUDGET_OPTIONS.map((opt) => (
                        <DropdownMenuRadioItem key={opt} value={opt}>
                          {opt}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-sm font-medium">
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setTouched((t) => ({ ...t, message: true }));
                  }}
                  rows={7}
                  placeholder="What are you building, and what does success look like?"
                  className={cn(fieldClass, "resize-y leading-relaxed")}
                />
              </div>

              {error && (
                <p className="text-destructive-foreground text-sm">{error}</p>
              )}

              <div className="flex flex-col items-center gap-2">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full"
                >
                  Send &amp; book my free call
                </Button>
                <span className="text-muted-foreground/70 text-xs font-light">
                  We&apos;ll email you within 1 business day · no commitment
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
