type Benefit = {
  _key?: string;
  title?: string;
  description?: string;
};

type BenefitGridProps = {
  eyebrow?: string;
  title?: string;
  benefits?: Benefit[];
};

const fallbackBenefits: Benefit[] = [
  {
    title: "Editors stop waiting on devs",
    description:
      "Copy changes, new landing pages, image swaps — all live, no tickets, no deploys.",
  },
  {
    title: "Brand stays consistent",
    description:
      "Structured blocks mean every page looks like yours, not like a free template.",
  },
  {
    title: "Fast by default",
    description:
      "Next.js on Vercel, Sanity's CDN — Lighthouse 95+ without optimisation work.",
  },
  {
    title: "You own the code",
    description: "No platform lock-in. Take the repo with you any time.",
  },
];

export default function BenefitGrid({
  eyebrow = "Why teams choose this",
  title = "A site your team can actually run.",
  benefits,
}: BenefitGridProps) {
  const items = benefits && benefits.length > 0 ? benefits : fallbackBenefits;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:items-start">
        <div>
          {eyebrow ? (
            <p className="text-brand text-xs font-semibold tracking-[0.24em] uppercase">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {title}
            </h2>
          ) : null}
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {items.map((benefit, index) => (
            <div key={benefit._key || `${benefit.title}-${index}`}>
              <p className="font-semibold">{benefit.title}</p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
