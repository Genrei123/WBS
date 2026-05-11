"use client";

import { PortableText } from "@portabletext/react";
import { createDataAttribute } from "next-sanity";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

import BenefitGrid from "../benefit-grid/default";
import { GalleryViewer } from "../graphic-design/default";
import HeadlessPageBuilderDemo from "../headless-page-builder/default";
import WebDesignPage from "../web-design/default";
import PDFAutomation from "../pdf-automation/default";
import BentoBoxSection from "../sections/bento-box/default";
import AIAutomationSection from "../ai-automation/default";

type PageSection = {
  _key?: string;
  _type?: string;
  eyebrow?: string;
  title?: string;
  body?: any;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  paddingTop?: number;
  paddingBottom?: number;
  image?: { asset?: { _id?: string; url?: string }; alt?: string };
  imageDark?: { asset?: { _id?: string; url?: string }; alt?: string };
  images?: Array<{
    _key?: string;
    title?: string;
    description?: string;
    image?: { asset?: { _id?: string; url?: string }; alt?: string; hotspot?: unknown; crop?: unknown };
  }>;
  benefits?: Array<{
    _key?: string;
    title?: string;
    description?: string;
  }>;
  models?: Array<{
    _key?: string;
    title?: string;
    description?: string;
    thumbnail?: { asset?: { _id?: string; url?: string }; alt?: string; hotspot?: unknown; crop?: unknown };
    file?: { asset?: { _id?: string; url?: string }; originalFilename?: string; mimeType?: string };
  }>;
  projects?: Array<{
    _key?: string;
    title?: string;
    description?: string;
    image?: { asset?: { _id?: string; url?: string }; alt?: string; hotspot?: unknown; crop?: unknown };
    url?: string;
  }>;
  link?: {
    linkType?: "internal" | "external";
    internalPage?: { slug?: { current?: string } };
    externalUrl?: string;
  };
  headerLayout?: "center" | "left" | "right" | "split";
  textAlign?: "center" | "left" | "right";
  layout?: "grid" | "flex" | "stack";
  columns?: number;
  gap?: string;
  items?: PageSection[];
  bentoBoxes?: Array<{
    _key?: string;
    title?: string;
    subtitle?: string;
    url?: string;
    variant?: "default" | "textOnly" | "imageOnly";
    textAlign?: "left" | "center" | "right";
    image?: any;
    imageDark?: any;
    hoverAction?: "moveUp" | "moveSideways" | "zoomIn" | "zoomOut" | "morph";
    morphImage?: any;
    hasGlow?: boolean;
    glowColor?: "orange" | "blue" | "white" | "green";
  }>;
};

type PageBuilderProps = {
  sections?: PageSection[] | null;
  documentId?: string;
  documentType?: string;
  isDraftMode?: boolean;
  pathPrefix?: string;
  isInner?: boolean;
};

function CtaLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const baseClasses = "inline-flex items-center justify-center px-8 py-3 text-sm font-medium transition-all";

  const variantClasses =
    variant === "primary"
      ? "bg-[#D9C4A9] text-black hover:bg-[#c9b396]"
      : "border border-[#3a3a3a] text-white hover:bg-white/5";

  return (
    <a href={href} className={cn(baseClasses, variantClasses)}>
      {children}
    </a>
  );
}

function getLinkHref(link?: PageSection["link"]): string {
  if (!link) return "/";
  if (link.linkType === "internal" && link.internalPage?.slug?.current) {
    return `/${link.internalPage.slug.current}`;
  }
  if (link.linkType === "external" && link.externalUrl) {
    return link.externalUrl;
  }
  return "/";
}

export function PageBuilder({
  sections,
  documentId,
  documentType,
  isDraftMode,
  pathPrefix,
  isInner,
}: PageBuilderProps) {
  const prefix = pathPrefix || "sections";
  const baseSectionClass = isInner ? "w-full" : "max-w-container mx-auto px-6 w-full";

  // Helper to create data attributes for sections array items
  const createSectionAttr = (key?: string) => {
    if (!isDraftMode || !documentId || !documentType || !key) return undefined;
    return createDataAttribute({
      id: documentId,
      type: documentType,
      path: `${prefix}[_key=="${key}"]`,
    }).toString();
  };

  // Data attribute for the sections array container (enables "add item" overlay)
  const sectionsContainerAttr =
    isDraftMode && documentId && documentType
      ? createDataAttribute({
          id: documentId,
          type: documentType,
          path: prefix,
        }).toString()
      : undefined;

  if (!sections || sections.length === 0) {
    // Only show the placeholder in draft mode (Presentation Tool)
    if (!isDraftMode) return null;

    return (
      <section className={baseSectionClass} data-sanity={sectionsContainerAttr}>
        <div className="border-border bg-card/30 text-muted-foreground mt-10 rounded-2xl border border-dashed px-6 py-16 text-center">
          Add sections to this page in Sanity Studio.
        </div>
      </section>
    );
  }

  return (
    <div data-sanity={sectionsContainerAttr} className="contents">
      {sections.map((section) => {
        const key = section._key || "unknown";
        const sectionAttr = createSectionAttr(section._key);

        switch (section._type) {
          case "containerSection": {
            const layout = section.layout || "grid";
            const columns = section.columns || 3;
            const gapClass =
              section.gap === "4" ? "gap-4" : section.gap === "8" ? "gap-8" : section.gap === "12" ? "gap-12" : "gap-6";

            let layoutClass = "";
            if (layout === "grid") {
              // We construct standard tailwind grid classes.
              // To ensure arbitrary columns work smoothly in a standard tailwind setup without a custom plugin,
              // we handle 1 to 4 explicitly:
              const colsClass =
                columns === 1
                  ? "lg:grid-cols-1"
                  : columns === 2
                    ? "lg:grid-cols-2"
                    : columns === 4
                      ? "lg:grid-cols-4"
                      : "lg:grid-cols-3";
              layoutClass = `grid grid-cols-1 md:grid-cols-2 ${colsClass}`;
            } else if (layout === "flex") {
              layoutClass = "flex flex-wrap justify-center";
            } else {
              layoutClass = "flex flex-col";
            }

            return (
              <section
                key={key}
                data-sanity={sectionAttr}
                className={baseSectionClass}
                style={{
                  paddingTop: section.paddingTop ?? 64,
                  paddingBottom: section.paddingBottom ?? 64,
                }}
              >
                {(section.eyebrow || section.title || section.description) &&
                  (() => {
                    const headerLayout = section.headerLayout || "center";

                    if (headerLayout === "split") {
                      return (
                        <div className="mb-12 grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-16">
                          <div>
                            {section.eyebrow && (
                              <p className="text-muted-foreground mb-4 text-sm font-semibold tracking-[0.2em] uppercase">
                                {section.eyebrow}
                              </p>
                            )}
                            {section.title && (
                              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                                {section.title}
                              </h2>
                            )}
                          </div>
                          {section.description && (
                            <div className="max-w-xl pt-2 md:justify-self-end">
                              <p className="text-muted-foreground text-lg leading-relaxed">{section.description}</p>
                            </div>
                          )}
                        </div>
                      );
                    }

                    let alignClass = "text-center mx-auto";
                    if (headerLayout === "left") alignClass = "text-left mr-auto";
                    if (headerLayout === "right") alignClass = "text-right ml-auto";

                    return (
                      <div className={cn("mb-10 max-w-3xl", alignClass)}>
                        {section.eyebrow && (
                          <p className="text-muted-foreground mb-3 text-sm font-semibold tracking-[0.2em] uppercase">
                            {section.eyebrow}
                          </p>
                        )}
                        {section.title && (
                          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{section.title}</h2>
                        )}
                        {section.description && (
                          <p className="text-muted-foreground mt-4 text-lg">{section.description}</p>
                        )}
                      </div>
                    );
                  })()}

                {section.items && section.items.length > 0 ? (
                  <div className={cn(layoutClass, gapClass)}>
                    <PageBuilder
                      sections={section.items}
                      documentId={documentId}
                      documentType={documentType}
                      isDraftMode={isDraftMode}
                      pathPrefix={`${prefix}[_key=="${key}"].items`}
                      isInner={true}
                    />
                  </div>
                ) : isDraftMode && !section.eyebrow && !section.title && !section.description ? (
                  <div className="border-border bg-card/30 text-muted-foreground rounded-2xl border border-dashed px-6 py-16 text-center">
                    Add items to this container in Sanity Studio.
                  </div>
                ) : null}
              </section>
            );
          }

          case "spacerSection":
            return (
              <div
                key={key}
                data-sanity={sectionAttr}
                className={isInner ? "w-full" : ""}
                style={{
                  height: (section.paddingTop || 24) + (section.paddingBottom || 24),
                }}
              />
            );

          case "richTextSection": {
            const align = section.textAlign || "left";
            let alignClass = "text-left mr-auto";
            if (align === "center") alignClass = "text-center mx-auto";
            if (align === "right") alignClass = "text-right ml-auto";

            return (
              <section 
                key={key} 
                data-sanity={sectionAttr} 
                className={baseSectionClass}
                style={{
                  paddingTop: section.paddingTop ?? 80,
                  paddingBottom: section.paddingBottom ?? 80,
                }}
              >
                <div className={cn("max-w-3xl space-y-4", alignClass)}>
                  {section.eyebrow ? (
                    <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase">{section.eyebrow}</p>
                  ) : null}
                  {section.title ? (
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{section.title}</h2>
                  ) : null}
                  {section.body ? (
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground">
                      <PortableText value={section.body} />
                    </div>
                  ) : null}
                </div>
              </section>
            );
          }

          case "ctaSection":
            return (
              <section key={key} data-sanity={sectionAttr} className={cn(baseSectionClass, "py-20")}>
                <div className="bg-card/40 border-border flex h-full flex-col justify-center rounded-3xl border px-8 py-12 text-center">
                  {section.eyebrow ? (
                    <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase">{section.eyebrow}</p>
                  ) : null}
                  {section.title ? (
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{section.title}</h2>
                  ) : null}
                  {section.body ? (
                    <div className="prose prose-sm md:prose-base dark:prose-invert mx-auto mt-4 max-w-2xl text-muted-foreground">
                      <PortableText value={section.body} />
                    </div>
                  ) : null}
                  <div className="mt-auto flex flex-wrap items-center justify-center gap-4 py-4">
                    {section.primaryCtaLabel && section.primaryCtaHref ? (
                      <CtaLink href={section.primaryCtaHref}>{section.primaryCtaLabel}</CtaLink>
                    ) : null}
                    {section.secondaryCtaLabel && section.secondaryCtaHref ? (
                      <a
                        href={section.secondaryCtaHref}
                        className="text-foreground text-sm font-medium underline underline-offset-4"
                      >
                        {section.secondaryCtaLabel}
                      </a>
                    ) : null}
                  </div>
                </div>
              </section>
            );

          case "imageSection": {
            const imgSrc = section.image?.asset ? urlFor(section.image).width(1200).fit("max").url() : null;
            const imgSrcDark = section.imageDark?.asset ? urlFor(section.imageDark).width(1200).fit("max").url() : null;

            return (
              <section
                key={key}
                data-sanity={sectionAttr}
                className={baseSectionClass}
                style={{
                  paddingTop: isInner ? 0 : (section.paddingTop ?? 0),
                  paddingBottom: isInner ? 0 : (section.paddingBottom ?? 0),
                }}
              >
                {imgSrc || imgSrcDark ? (
                  <div className="relative h-full w-full">
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={section.image?.alt || ""}
                        className={cn(
                          "h-full w-full rounded-2xl object-cover transition-opacity duration-500",
                          imgSrcDark ? "opacity-100 dark:opacity-0" : "opacity-100"
                        )}
                      />
                    )}
                    {imgSrcDark && (
                      <img
                        src={imgSrcDark}
                        alt={section.imageDark?.alt || ""}
                        className={cn(
                          "absolute inset-0 h-full w-full rounded-2xl object-cover opacity-0 transition-opacity duration-500 dark:opacity-100"
                        )}
                      />
                    )}
                  </div>
                ) : isDraftMode ? (
                  <div className="border-border bg-card/30 text-muted-foreground flex h-full items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center">
                    Select an image in Sanity Studio.
                  </div>
                ) : null}
              </section>
            );
          }

          case "cardButtonSection": {
            const cardImgSrc = section.image?.asset
              ? urlFor(section.image).width(600).height(400).fit("crop").url()
              : null;
            const cardHref = getLinkHref(section.link);
            const isExternal = section.link?.linkType === "external";

            return (
              <section key={key} data-sanity={sectionAttr} className={cn(baseSectionClass, isInner ? "" : "py-10")}>
                <a
                  href={cardHref}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="bg-card border-border group hover:border-primary/30 flex h-full flex-col overflow-hidden rounded-2xl border transition-all hover:shadow-lg"
                >
                  {cardImgSrc ? (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={cardImgSrc}
                        alt={section.image?.alt || section.title || ""}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    {section.title ? <h3 className="text-lg font-semibold tracking-tight">{section.title}</h3> : null}
                    {section.description ? (
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{section.description}</p>
                    ) : null}
                  </div>
                </a>
              </section>
            );
          }

          case "heroSection":
          default: {
            const align = section.textAlign || "center";
            const imgSrc = section.image?.asset ? urlFor(section.image).width(1200).fit("max").url() : null;
            const imgSrcDark = section.imageDark?.asset ? urlFor(section.imageDark).width(1200).fit("max").url() : null;

            let alignClasses = "items-center text-center";
            if (align === "left") {
              alignClasses = "items-start text-left";
            } else if (align === "right") {
              alignClasses = "items-end text-right";
            }

            const hasAnyImage = imgSrc || imgSrcDark;

            return (
              <section
                key={key}
                data-sanity={sectionAttr}
                className={cn(baseSectionClass, "mt-16 flex min-h-[calc(100vh-8rem)] items-center py-12 lg:mt-24")}
              >
                <div
                  className={cn(
                    "mx-auto w-full max-w-7xl",
                    hasAnyImage
                      ? "grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24"
                      : "flex flex-col items-center"
                  )}
                >
                  <div
                    className={cn(
                      "flex w-full flex-col gap-6",
                      hasAnyImage ? alignClasses : cn("max-w-4xl", alignClasses)
                    )}
                  >
                    {section.eyebrow ? (
                      <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase">{section.eyebrow}</p>
                    ) : null}
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                      {section.title || "Add a title in Sanity"}
                    </h1>
                    {section.body ? (
                      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-2xl text-muted-foreground">
                        <PortableText value={section.body} />
                      </div>
                    ) : null}
                    <div
                      className={cn(
                        "mt-4 flex flex-wrap gap-4",
                        align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
                      )}
                    >
                      {section.primaryCtaLabel && section.primaryCtaHref ? (
                        <CtaLink href={section.primaryCtaHref} variant="primary">
                          {section.primaryCtaLabel}
                        </CtaLink>
                      ) : null}
                      {section.secondaryCtaLabel && section.secondaryCtaHref ? (
                        <CtaLink href={section.secondaryCtaHref} variant="secondary">
                          {section.secondaryCtaLabel}
                        </CtaLink>
                      ) : null}
                    </div>
                  </div>

                  {hasAnyImage && (
                    <div className="bg-muted/10 relative aspect-4/3 w-full overflow-hidden rounded-2xl lg:aspect-square">
                      {imgSrc && (
                        <img
                          src={imgSrc}
                          alt={section.image?.alt || ""}
                          className={cn(
                            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                            imgSrcDark ? "opacity-100 dark:opacity-0" : "opacity-100"
                          )}
                        />
                      )}
                      {imgSrcDark && (
                        <img
                          src={imgSrcDark}
                          alt={section.imageDark?.alt || ""}
                          className={cn(
                            "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 dark:opacity-100"
                          )}
                        />
                      )}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          case "pdfAutomation":
            return (
              <section
                key={key}
                data-sanity={sectionAttr}
                className={cn(baseSectionClass, "flex min-h-[calc(100vh-8rem)] items-center")}
              >
                <PDFAutomation />
              </section>
            );

          case "headlessPageBuilderDemo":
            return (
              <section
                key={key}
                data-sanity={sectionAttr}
                className={baseSectionClass}
                style={{
                  paddingTop: section.paddingTop ?? 96,
                  paddingBottom: section.paddingBottom ?? 96,
                }}
              >
                <HeadlessPageBuilderDemo
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                  primaryCtaLabel={section.primaryCtaLabel}
                  primaryCtaHref={section.primaryCtaHref}
                  secondaryCtaLabel={section.secondaryCtaLabel}
                  secondaryCtaHref={section.secondaryCtaHref}
                />
              </section>
            );

          case "graphicDesign":
            return (
              <section key={key} data-sanity={sectionAttr} className={cn(baseSectionClass, "py-20")}>
                {section.images || section.models ? (
                  <GalleryViewer data={[...(section.images || []), ...(section.models || [])]} />
                ) : isDraftMode ? (
                  <div className="border-border bg-card/30 text-muted-foreground rounded-2xl border border-dashed px-6 py-16 text-center">
                    Add images or 3D models to Graphic Design in Sanity Studio.
                  </div>
                ) : null}
              </section>
            );

          case "benefitGridSection":
            return (
              <section
                key={key}
                data-sanity={sectionAttr}
                className={baseSectionClass}
                style={{
                  paddingTop: section.paddingTop ?? 96,
                  paddingBottom: section.paddingBottom ?? 96,
                }}
              >
                <BenefitGrid
                  eyebrow={section.eyebrow}
                  title={section.title}
                  benefits={section.benefits}
                />
            </section>
              );
            
          case "webDesign":
            return (
              <section key={key} data-sanity={sectionAttr} className={cn(baseSectionClass, "py-20")}>
                <WebDesignPage/>
              </section>
            );

          case "bentoBoxSection":
            return (
              <section
                key={key}
                data-sanity={sectionAttr}
                className={baseSectionClass}
                style={{
                  paddingTop: section.paddingTop ?? 96,
                  paddingBottom: section.paddingBottom ?? 96,
                }}
              >
                <BentoBoxSection
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                  bentoBoxes={section.bentoBoxes}
                />
              </section>
            );

          case "AIAutomation":
            return (
              <section
                key={key}
                data-sanity={sectionAttr}
                className={baseSectionClass}
                style={{
                  paddingTop: section.paddingTop ?? 96,
                  paddingBottom: section.paddingBottom ?? 96,
                }}
              >
                <AIAutomationSection />
              </section>
            );
        }
      })}
    </div>
  );
}
