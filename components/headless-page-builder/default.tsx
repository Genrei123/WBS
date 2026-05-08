"use client";

import {
  ArrowDown,
  ArrowUp,
  Blocks,
  CheckCircle2,
  ChevronRight,
  Copy,
  Eye,
  ImageIcon,
  LayoutGrid,
  Maximize2,
  Megaphone,
  Monitor,
  MoreHorizontal,
  MousePointer2,
  Plus,
  Rows3,
  Settings2,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Type,
  X,
} from "lucide-react";
import { type ComponentType, type ReactNode, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DemoBlockKind = "hero" | "richText" | "media" | "cta" | "cards" | "spacer";
type DemoStatus = "Draft" | "Preview" | "Published";
type PreviewSize = "desktop" | "tablet" | "mobile";

type DemoBlock = {
  id: string;
  kind: DemoBlockKind;
  eyebrow?: string;
  title: string;
  body?: string;
  buttonLabel?: string;
  mediaLabel?: string;
  align?: "left" | "center";
  height?: number;
  items?: string[];
};

type BlockLibraryItem = {
  kind: DemoBlockKind;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

type ContextMenuState = {
  x: number;
  y: number;
  blockId?: string;
  addPlacement?: "end" | "before" | "after";
};

type HeadlessPageBuilderDemoProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

const blockLibrary: BlockLibraryItem[] = [
  {
    kind: "hero",
    label: "Hero",
    description: "Lead message, intro copy, and CTA",
    icon: Sparkles,
  },
  {
    kind: "richText",
    label: "Rich Text",
    description: "Editable page copy and headings",
    icon: Type,
  },
  {
    kind: "media",
    label: "Media",
    description: "Image or product preview placeholder",
    icon: ImageIcon,
  },
  {
    kind: "cta",
    label: "CTA",
    description: "Conversion panel with a button",
    icon: Megaphone,
  },
  {
    kind: "cards",
    label: "Card Grid",
    description: "Reusable feature cards",
    icon: LayoutGrid,
  },
  {
    kind: "spacer",
    label: "Spacer",
    description: "Controlled vertical spacing",
    icon: Rows3,
  },
];

const initialBlocks: DemoBlock[] = [
  {
    id: "block-hero-1",
    kind: "hero",
    eyebrow: "CMS powered",
    title: "Launch a page without touching code",
    body: "Pick reusable sections, edit their content, and preview the result immediately.",
    buttonLabel: "Book a build",
    align: "center",
  },
  {
    id: "block-cards-2",
    kind: "cards",
    eyebrow: "Reusable modules",
    title: "Blocks your team can compose",
    body: "Each section has safe fields in the CMS and polished React UI on the frontend.",
    items: ["Hero sections", "Service cards", "CTA bands"],
  },
  {
    id: "block-cta-3",
    kind: "cta",
    eyebrow: "Ready to publish",
    title: "Preview, refine, publish",
    body: "The page-building workflow stays visual while the frontend remains fully custom.",
    buttonLabel: "See it live",
  },
];

const statusStyles: Record<DemoStatus, string> = {
  Draft: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  Preview: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  Published: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
};

const previewWidthClasses: Record<PreviewSize, string> = {
  desktop: "max-w-full",
  tablet: "max-w-[760px]",
  mobile: "max-w-[390px]",
};

const previewSizes: Array<{ value: PreviewSize; label: string; icon: ComponentType<{ className?: string }> }> = [
  { value: "desktop", label: "Desktop", icon: Monitor },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "mobile", label: "Mobile", icon: Smartphone },
];

function clampMenuPosition(x: number, y: number) {
  if (typeof window === "undefined") {
    return { x, y };
  }

  return {
    x: Math.min(x, window.innerWidth - 360),
    y: Math.min(y, window.innerHeight - 520),
  };
}

function createBlock(kind: DemoBlockKind, index: number): DemoBlock {
  const id = `block-${kind}-${index}`;

  switch (kind) {
    case "richText":
      return {
        id,
        kind,
        eyebrow: "Editable copy",
        title: "Tell the story with structured content",
        body: "This block represents a rich text section that content editors can safely update from the CMS.",
        align: "left",
      };
    case "media":
      return {
        id,
        kind,
        eyebrow: "Visual asset",
        title: "Swap images from the CMS",
        body: "Use media blocks for portfolio shots, product UI, or campaign visuals.",
        mediaLabel: "Sanity image asset",
        height: 220,
      };
    case "cta":
      return {
        id,
        kind,
        eyebrow: "Conversion block",
        title: "Turn the page into action",
        body: "A CTA can be added anywhere in the flow and edited without deploying new code.",
        buttonLabel: "Start now",
      };
    case "cards":
      return {
        id,
        kind,
        eyebrow: "Component set",
        title: "Feature cards from structured fields",
        body: "Cards show how repeatable arrays map cleanly to reusable frontend components.",
        items: ["Add blocks", "Edit fields", "Preview instantly"],
      };
    case "spacer":
      return {
        id,
        kind,
        title: "Spacer",
        body: "Spacing block",
        height: 96,
      };
    case "hero":
    default:
      return {
        id,
        kind: "hero",
        eyebrow: "New page section",
        title: "Compose a landing page visually",
        body: "Add a hero, adjust the copy, and keep the frontend experience completely custom.",
        buttonLabel: "Explore",
        align: "center",
      };
  }
}

function getBlockLabel(kind: DemoBlockKind) {
  return blockLibrary.find((item) => item.kind === kind)?.label || "Block";
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-white/65 font-medium">{label}</span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="focus:border-brand h-10 rounded-md border border-white/10 bg-[#0d0f16] px-3 text-sm text-white outline-none transition-colors placeholder:text-white/30"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={4}
      className="focus:border-brand min-h-24 resize-none rounded-md border border-white/10 bg-[#0d0f16] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/30"
    />
  );
}

function renderPreviewContent(block: DemoBlock) {
  switch (block.kind) {
    case "richText":
      return (
        <div className={cn("max-w-2xl space-y-3", block.align === "center" && "mx-auto text-center")}>
          {block.eyebrow ? (
            <p className="text-brand text-xs font-semibold tracking-[0.2em] uppercase">{block.eyebrow}</p>
          ) : null}
          <h3 className="text-2xl font-semibold tracking-tight">{block.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{block.body}</p>
        </div>
      );
    case "media":
      return (
        <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            {block.eyebrow ? (
              <p className="text-brand text-xs font-semibold tracking-[0.2em] uppercase">{block.eyebrow}</p>
            ) : null}
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{block.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{block.body}</p>
          </div>
          <div
            className="border-border/70 from-sky-500/20 via-background to-brand/20 flex items-center justify-center rounded-lg border bg-linear-to-br"
            style={{ minHeight: block.height || 220 }}
          >
            <div className="text-muted-foreground flex flex-col items-center gap-3 text-sm">
              <ImageIcon className="size-8" />
              <span>{block.mediaLabel || "CMS media asset"}</span>
            </div>
          </div>
        </div>
      );
    case "cta":
      return (
        <div className="border-border/70 from-brand/20 via-background to-emerald-500/10 rounded-xl border bg-linear-to-br p-8 text-center">
          {block.eyebrow ? (
            <p className="text-brand text-xs font-semibold tracking-[0.2em] uppercase">{block.eyebrow}</p>
          ) : null}
          <h3 className="mx-auto mt-2 max-w-2xl text-2xl font-semibold tracking-tight">{block.title}</h3>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm leading-relaxed">{block.body}</p>
          {block.buttonLabel ? (
            <span className="bg-primary text-primary-foreground mt-5 inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium">
              {block.buttonLabel}
            </span>
          ) : null}
        </div>
      );
    case "cards":
      return (
        <div className="space-y-5">
          <div>
            {block.eyebrow ? (
              <p className="text-brand text-xs font-semibold tracking-[0.2em] uppercase">{block.eyebrow}</p>
            ) : null}
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{block.title}</h3>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">{block.body}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {(block.items || []).map((item, index) => (
              <div key={`${item}-${index}`} className="border-border/70 bg-background/60 rounded-lg border p-4">
                <div className="bg-brand/20 text-brand mb-4 flex size-9 items-center justify-center rounded-md">
                  <Blocks className="size-4" />
                </div>
                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "spacer":
      return (
        <div
          className="border-border/70 text-muted-foreground flex items-center justify-center rounded-lg border border-dashed text-sm"
          style={{ height: block.height || 96 }}
        >
          Spacer - {block.height || 96}px
        </div>
      );
    case "hero":
    default:
      return (
        <div className={cn("mx-auto max-w-3xl py-6", block.align === "center" ? "text-center" : "text-left")}>
          {block.eyebrow ? (
            <p className="text-brand text-xs font-semibold tracking-[0.24em] uppercase">{block.eyebrow}</p>
          ) : null}
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{block.title}</h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-relaxed">{block.body}</p>
          {block.buttonLabel ? (
            <span className="bg-primary text-primary-foreground mt-6 inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium">
              {block.buttonLabel}
            </span>
          ) : null}
        </div>
      );
  }
}

export default function HeadlessPageBuilderDemo({
  eyebrow = "Headless Page Builder",
  title = "Build pages from reusable CMS blocks",
  description = "A frontend-only demo that shows how Sanity-powered pages can add, edit, reorder, preview, and publish reusable website sections.",
  primaryCtaLabel = "Try the demo",
  primaryCtaHref = "#builder-demo",
  secondaryCtaLabel = "See the workflow",
  secondaryCtaHref = "#builder-workflow",
}: HeadlessPageBuilderDemoProps) {
  const [blocks, setBlocks] = useState<DemoBlock[]>(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(initialBlocks[0]?.id || null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [blockCounter, setBlockCounter] = useState(initialBlocks.length + 1);
  const [status, setStatus] = useState<DemoStatus>("Draft");
  const [previewSize, setPreviewSize] = useState<PreviewSize>("desktop");

  const editingBlock = blocks.find((block) => block.id === editingId) || null;
  const contextBlock = blocks.find((block) => block.id === contextMenu?.blockId) || null;

  const canvasInstructions = useMemo(
    () => (blocks.length > 0 ? "Right-click any section to add, edit, duplicate, reorder, or remove modules." : "Right-click the canvas to add your first module."),
    [blocks.length]
  );

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContextMenu(null);
        setEditingId(null);
      }
    };

    window.addEventListener("click", closeMenu);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const insertBlock = (kind: DemoBlockKind, placement: "end" | "before" | "after", targetId?: string) => {
    const block = createBlock(kind, blockCounter);

    setBlockCounter((current) => current + 1);
    setBlocks((current) => {
      if (placement === "end" || !targetId) {
        return [...current, block];
      }

      const targetIndex = current.findIndex((item) => item.id === targetId);
      if (targetIndex < 0) {
        return [...current, block];
      }

      const insertIndex = placement === "before" ? targetIndex : targetIndex + 1;
      const next = [...current];
      next.splice(insertIndex, 0, block);
      return next;
    });

    setSelectedId(block.id);
    setEditingId(block.id);
    setContextMenu(null);
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    setBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [block] = next.splice(index, 1);
      next.splice(targetIndex, 0, block);
      return next;
    });
    setContextMenu(null);
  };

  const deleteBlock = (id: string) => {
    const index = blocks.findIndex((block) => block.id === id);
    const nextBlocks = blocks.filter((block) => block.id !== id);

    setBlocks(nextBlocks);
    setContextMenu(null);

    if (selectedId === id) {
      setSelectedId(nextBlocks[Math.min(index, nextBlocks.length - 1)]?.id || null);
    }

    if (editingId === id) {
      setEditingId(null);
    }
  };

  const duplicateBlock = (id: string) => {
    const target = blocks.find((block) => block.id === id);
    if (!target) return;

    const copy = {
      ...target,
      id: `block-${target.kind}-${blockCounter}`,
      title: `${target.title} copy`,
    };
    const index = blocks.findIndex((block) => block.id === id);
    const nextBlocks = [...blocks];

    nextBlocks.splice(index + 1, 0, copy);
    setBlockCounter((current) => current + 1);
    setBlocks(nextBlocks);
    setSelectedId(copy.id);
    setEditingId(copy.id);
    setContextMenu(null);
  };

  const updateEditingBlock = (updates: Partial<DemoBlock>) => {
    if (!editingId) return;

    setBlocks((current) => current.map((block) => (block.id === editingId ? { ...block, ...updates } : block)));
  };

  const updateCardItem = (index: number, value: string) => {
    if (!editingBlock) return;

    const nextItems = [...(editingBlock.items || [])];
    nextItems[index] = value;
    updateEditingBlock({ items: nextItems });
  };

  const openContextMenu = (event: React.MouseEvent, blockId?: string) => {
    event.preventDefault();
    event.stopPropagation();

    const position = clampMenuPosition(event.clientX, event.clientY);
    setContextMenu({ ...position, blockId, addPlacement: blockId ? undefined : "end" });

    if (blockId) {
      setSelectedId(blockId);
    }
  };

  const showAddFlyout = (placement: ContextMenuState["addPlacement"]) => {
    setContextMenu((current) => (current ? { ...current, addPlacement: placement } : current));
  };

  const resetDemo = () => {
    setBlocks(initialBlocks);
    setSelectedId(initialBlocks[0]?.id || null);
    setEditingId(null);
    setContextMenu(null);
    setBlockCounter(initialBlocks.length + 1);
    setStatus("Draft");
    setPreviewSize("desktop");
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-12">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="space-y-6">
          {eyebrow ? (
            <Badge variant="outline" className="border-brand/30 text-brand bg-brand/10">
              <Sparkles className="size-3.5" />
              {eyebrow}
            </Badge>
          ) : null}
          <div className="space-y-5">
            <h2 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {title}
            </h2>
            {description ? (
              <p className="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg">{description}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            {primaryCtaLabel && primaryCtaHref ? (
              <Button asChild size="lg">
                <a href={primaryCtaHref}>{primaryCtaLabel}</a>
              </Button>
            ) : null}
            {secondaryCtaLabel && secondaryCtaHref ? (
              <Button asChild size="lg" variant="outline">
                <a href={secondaryCtaHref}>{secondaryCtaLabel}</a>
              </Button>
            ) : null}
          </div>
        </div>

        <div
          id="builder-workflow"
          className="border-border/70 bg-card/50 grid gap-3 rounded-xl border p-4 shadow-2xl shadow-black/10 sm:grid-cols-3"
        >
          {[
            ["1", "Add blocks", "Right-click the canvas"],
            ["2", "Edit content", "Open edit mode per section"],
            ["3", "Preview page", "Resize and publish"],
          ].map(([step, heading, copy]) => (
            <div key={step} className="bg-background/70 rounded-lg border border-white/10 p-4">
              <span className="bg-brand/20 text-brand inline-flex size-8 items-center justify-center rounded-md text-sm font-semibold">
                {step}
              </span>
              <p className="mt-4 text-sm font-semibold">{heading}</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="builder-demo" className="border-border/70 bg-[#0d0f16] text-white overflow-hidden rounded-2xl border shadow-2xl">
        <div className="border-white/10 bg-[#11131d] flex flex-col gap-4 border-b p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand/20 text-brand flex size-10 items-center justify-center rounded-lg">
              <Blocks className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">WeBread CMS Builder</p>
              <p className="text-xs text-white/50">{canvasInstructions}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
              {previewSizes.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.value}
                    type="button"
                    title={item.label}
                    onClick={() => setPreviewSize(item.value)}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full text-white/50 transition-colors",
                      previewSize === item.value && "bg-white text-black"
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
            </div>
            {(["Draft", "Preview", "Published"] as DemoStatus[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  status === item ? statusStyles[item] : "border-white/10 bg-white/5 text-white/55 hover:text-white"
                )}
              >
                {item}
              </button>
            ))}
            <Button type="button" size="sm" variant="outline" onClick={resetDemo} className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              Reset
            </Button>
          </div>
        </div>

        <main className="relative flex h-[min(820px,calc(100vh-7rem))] min-h-[620px] flex-col overflow-hidden bg-[#090a0f] p-4 sm:p-6">
          <div
            className={cn(
              "mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
              editingBlock && "md:pr-[410px]"
            )}
          >
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Eye className="size-4 text-brand" />
                Live Page Canvas
              </p>
              <p className="text-xs text-white/45">
                Right-click modules or empty space for builder actions. The canvas scrolls independently.
              </p>
            </div>
            <div className={cn("inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs", statusStyles[status])}>
              <CheckCircle2 className="size-3.5" />
              {status}
            </div>
          </div>

          <div className={cn("relative min-h-0 flex-1 overflow-hidden", editingBlock && "md:pr-[410px]")}>
            <div
              onContextMenu={(event) => openContextMenu(event)}
              className={cn(
                "bg-background text-foreground mx-auto h-full overflow-y-auto overscroll-contain rounded-xl border border-white/10 p-4 shadow-inner transition-all duration-300 sm:p-6",
                previewWidthClasses[previewSize]
              )}
            >
              {blocks.length > 0 ? (
                <div className="space-y-4 pb-28 lg:pb-6">
                  {blocks.map((block) => {
                    const isSelected = selectedId === block.id;
                    const isEditing = editingId === block.id;

                    return (
                      <section
                        key={block.id}
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedId(block.id);
                        }}
                        onContextMenu={(event) => openContextMenu(event, block.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedId(block.id);
                          }
                        }}
                        className={cn(
                          "group relative rounded-xl border p-4 outline-none transition-all sm:p-6",
                          isSelected || isEditing
                            ? "border-brand bg-brand/5 shadow-[0_0_0_3px_rgba(224,201,166,0.12)]"
                            : "border-border/70 bg-card hover:border-brand/40"
                        )}
                      >
                        <div className="pointer-events-none absolute top-3 right-3 z-10 rounded-md border border-border/80 bg-background/95 px-2 py-1 text-xs text-muted-foreground opacity-100 shadow-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                          Right-click
                        </div>

                        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <MousePointer2 className="size-3.5" />
                          <span>{getBlockLabel(block.kind)}</span>
                        </div>

                        {renderPreviewContent(block)}
                      </section>
                    );
                  })}
                </div>
              ) : (
                <div className="border-border text-muted-foreground flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed text-center">
                  <Blocks className="mb-4 size-8" />
                  <p className="font-medium">Right-click here to add a module.</p>
                  <p className="mt-2 max-w-sm text-sm">The menu will let you add a Hero, Rich Text, Media, CTA, Card Grid, or Spacer block.</p>
                </div>
              )}
            </div>
          </div>

          {contextMenu ? (
            <div
              role="menu"
              className="fixed z-50 flex items-start gap-2 text-white"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onClick={(event) => event.stopPropagation()}
              onMouseLeave={() => setContextMenu(null)}
            >
              <div className="w-52 overflow-hidden rounded-lg border border-white/10 bg-[#141720] p-1 text-sm shadow-2xl shadow-black/40">
                <div className="mb-1 flex items-center justify-between px-2 py-1.5 text-xs text-white/45">
                  <span>{contextBlock ? getBlockLabel(contextBlock.kind) : "Canvas"}</span>
                  <MoreHorizontal className="size-3.5" />
                </div>

                {contextBlock ? (
                  <button
                    type="button"
                    onMouseEnter={() => showAddFlyout(undefined)}
                    onClick={() => {
                      setEditingId(contextBlock.id);
                      setSelectedId(contextBlock.id);
                      setContextMenu(null);
                    }}
                    className="hover:bg-brand/10 hover:text-brand flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors"
                  >
                    <Settings2 className="size-4" />
                    Edit
                  </button>
                ) : null}

                <button
                  type="button"
                  onMouseEnter={() => showAddFlyout(contextBlock ? "before" : "end")}
                  onClick={() => showAddFlyout(contextBlock ? "before" : "end")}
                  className="hover:bg-white/10 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors"
                >
                  <Plus className="text-brand size-4" />
                  {contextBlock ? "Add above" : "Add module"}
                  <ChevronRight className="ml-auto size-3.5 text-white/35" />
                </button>

                {contextBlock ? (
                  <button
                    type="button"
                    onMouseEnter={() => showAddFlyout("after")}
                    onClick={() => showAddFlyout("after")}
                    className="hover:bg-white/10 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors"
                  >
                    <Plus className="text-brand size-4" />
                    Add below
                    <ChevronRight className="ml-auto size-3.5 text-white/35" />
                  </button>
                ) : null}

                {contextBlock ? (
                  <>
                    <div className="my-1 h-px bg-white/10" />
                    <button
                      type="button"
                      onMouseEnter={() => showAddFlyout(undefined)}
                      onClick={() => duplicateBlock(contextBlock.id)}
                      className="hover:bg-white/10 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors"
                    >
                      <Copy className="size-4" />
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onMouseEnter={() => showAddFlyout(undefined)}
                      onClick={() => moveBlock(contextBlock.id, "up")}
                      className="hover:bg-white/10 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors"
                    >
                      <ArrowUp className="size-4" />
                      Move up
                    </button>
                    <button
                      type="button"
                      onMouseEnter={() => showAddFlyout(undefined)}
                      onClick={() => moveBlock(contextBlock.id, "down")}
                      className="hover:bg-white/10 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors"
                    >
                      <ArrowDown className="size-4" />
                      Move down
                    </button>
                    <button
                      type="button"
                      onMouseEnter={() => showAddFlyout(undefined)}
                      onClick={() => deleteBlock(contextBlock.id)}
                      className="hover:bg-destructive/20 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-red-200 transition-colors"
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </button>
                  </>
                ) : null}
              </div>

              {contextMenu.addPlacement ? (
                <div className="max-h-72 w-56 overflow-y-auto rounded-lg border border-white/10 bg-[#141720] p-1 text-sm shadow-2xl shadow-black/40">
                  <div className="px-2 py-1.5 text-xs text-white/45">
                    {contextMenu.addPlacement === "before"
                      ? "Add module above"
                      : contextMenu.addPlacement === "after"
                        ? "Add module below"
                        : "Add module"}
                  </div>
                  {blockLibrary.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.kind}
                        type="button"
                        onClick={() => insertBlock(item.kind, contextMenu.addPlacement!, contextBlock?.id)}
                        className="hover:bg-brand/10 flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left transition-colors"
                      >
                        <Icon className="text-brand mt-0.5 size-4 shrink-0" />
                        <span>
                          <span className="block font-medium">{item.label}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-white/45">{item.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : null}

          {editingBlock ? (
            <div className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-h-[78vh] max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121520] text-white shadow-2xl shadow-black/50 md:absolute md:inset-y-0 md:right-0 md:left-auto md:mx-0 md:h-full md:max-h-none md:w-[390px] md:max-w-none md:rounded-r-none">
              <div className="border-white/10 flex shrink-0 items-center justify-between border-b px-4 py-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Settings2 className="text-brand size-4" />
                    Edit {getBlockLabel(editingBlock.kind)}
                  </p>
                  <p className="text-xs text-white/45">This panel stays pinned while the canvas scrolls.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="hover:bg-white/10 flex size-8 items-center justify-center rounded-md text-white/60"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto overscroll-contain p-4 md:grid-cols-1">
                {editingBlock.kind !== "spacer" ? (
                  <Field label="Eyebrow">
                    <TextInput
                      value={editingBlock.eyebrow}
                      onChange={(value) => updateEditingBlock({ eyebrow: value })}
                      placeholder="Small label"
                    />
                  </Field>
                ) : null}

                <Field label="Title">
                  <TextInput
                    value={editingBlock.title}
                    onChange={(value) => updateEditingBlock({ title: value })}
                    placeholder="Section title"
                  />
                </Field>

                {editingBlock.kind !== "spacer" ? (
                  <Field label="Body">
                    <TextArea
                      value={editingBlock.body}
                      onChange={(value) => updateEditingBlock({ body: value })}
                      placeholder="Section copy"
                    />
                  </Field>
                ) : null}

                {editingBlock.kind === "hero" || editingBlock.kind === "cta" ? (
                  <Field label="Button Label">
                    <TextInput
                      value={editingBlock.buttonLabel}
                      onChange={(value) => updateEditingBlock({ buttonLabel: value })}
                      placeholder="Button text"
                    />
                  </Field>
                ) : null}

                {editingBlock.kind === "hero" || editingBlock.kind === "richText" ? (
                  <Field label="Text Alignment">
                    <select
                      value={editingBlock.align || "left"}
                      onChange={(event) => updateEditingBlock({ align: event.target.value as DemoBlock["align"] })}
                      className="focus:border-brand h-10 rounded-md border border-white/10 bg-[#0d0f16] px-3 text-sm text-white outline-none"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                    </select>
                  </Field>
                ) : null}

                {editingBlock.kind === "media" ? (
                  <>
                    <Field label="Media Label">
                      <TextInput
                        value={editingBlock.mediaLabel}
                        onChange={(value) => updateEditingBlock({ mediaLabel: value })}
                        placeholder="Asset label"
                      />
                    </Field>
                    <Field label={`Media Height: ${editingBlock.height || 220}px`}>
                      <input
                        type="range"
                        min="160"
                        max="360"
                        step="20"
                        value={editingBlock.height || 220}
                        onChange={(event) => updateEditingBlock({ height: Number(event.target.value) })}
                        className="accent-brand w-full"
                      />
                    </Field>
                  </>
                ) : null}

                {editingBlock.kind === "spacer" ? (
                  <Field label={`Height: ${editingBlock.height || 96}px`}>
                    <input
                      type="range"
                      min="32"
                      max="220"
                      step="8"
                      value={editingBlock.height || 96}
                      onChange={(event) => updateEditingBlock({ height: Number(event.target.value) })}
                      className="accent-brand w-full"
                    />
                  </Field>
                ) : null}

                {editingBlock.kind === "cards" ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-white/65">Card Items</p>
                    <div className="grid gap-3">
                      {(editingBlock.items || []).map((item, index) => (
                        <TextInput
                          key={index}
                          value={item}
                          onChange={(value) => updateCardItem(index, value)}
                          placeholder={`Card ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => duplicateBlock(editingBlock.id)}
                    className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Copy className="size-4" />
                    Duplicate
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => deleteBlock(editingBlock.id)}
                    className="border-white/15 bg-white/5 text-white hover:bg-destructive/20"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                    className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Maximize2 className="size-4" />
                    Done
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="pointer-events-none absolute right-4 bottom-4 hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/45 lg:block">
            Tip: right-click the canvas
          </div>
        </main>
      </div>
    </div>
  );
}
