"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView, type Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type TagType = "urgent" | "billing" | "bug" | "resolved" | "info" | "success";

interface FlowStep {
  label: string;
  sub: string;
  icon: string;
}

interface FlowPacket {
  label: string;
}

interface Flow {
  title: string;
  steps: FlowStep[];
  packets: FlowPacket[];
}

interface UseCase {
  id: string;
  label: string;
  icon: string;
  input: string;
  tags: { text: string; type: TagType; detail: string }[];
  footer: string;
  before: string;
  after: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FLOWS: Flow[] = [
  {
    title: "Email triage",
    steps: [
      { label: "Inbox", sub: "Raw email", icon: "✉" },
      { label: "Parser", sub: "Extract intent", icon: "⟨/⟩" },
      { label: "AI classify", sub: "Priority · tone", icon: "✦" },
      { label: "Router", sub: "Assign team", icon: "⇢" },
      { label: "CRM", sub: "Log + reply", icon: "⬡" },
    ],
    packets: [
      { label: "Raw email" },
      { label: "Parsed data" },
      { label: "Intent: urgent/billing" },
      { label: "→ billing team" },
    ],
  },
  {
    title: "Invoice processing",
    steps: [
      { label: "Upload", sub: "PDF / image", icon: "↑" },
      { label: "OCR extract", sub: "Text & tables", icon: "⊞" },
      { label: "AI parse", sub: "Vendor · amount", icon: "✦" },
      { label: "Validator", sub: "Match PO", icon: "✓" },
      { label: "ERP sync", sub: "QuickBooks", icon: "⬡" },
    ],
    packets: [
      { label: "invoice.pdf" },
      { label: "Raw text" },
      { label: "$4,820 · Acme · Mar 3" },
      { label: "Approved · logged" },
    ],
  },
  {
    title: "Support tickets",
    steps: [
      { label: "Ticket", sub: "User message", icon: "◎" },
      { label: "Embedder", sub: "Vector search", icon: "∿" },
      { label: "AI resolve", sub: "Match + draft", icon: "✦" },
      { label: "Confidence", sub: "Score · escalate", icon: "◈" },
      { label: "Send", sub: "Auto-reply", icon: "→" },
    ],
    packets: [
      { label: '"API key broken"' },
      { label: "Vector: auth issue" },
      { label: "Draft: regen key" },
      { label: "Confidence 94% · sent" },
    ],
  },
];

const USE_CASES: UseCase[] = [
  {
    id: "email",
    label: "Email triage",
    icon: "✉",
    input: `From: jason@bigcorp.com · 2 min ago\n\nHey, I tried upgrading to Pro yesterday but got charged twice. Also I can't access the dashboard — it keeps showing a blank screen. This is really urgent, we have a demo in 3 hours. Please fix ASAP!`,
    tags: [
      { text: "Urgent", type: "urgent", detail: "Demo in 3h — escalate immediately" },
      { text: "Billing", type: "billing", detail: "Double charge — refund $29 to card" },
      { text: "Bug", type: "bug", detail: "Dashboard blank screen · assign to eng" },
    ],
    footer: "Draft reply queued · linked to Jason's account · Slack alert sent to #oncall",
    before: "18 min",
    after: "1.2 sec",
  },
  {
    id: "support",
    label: "Support tickets",
    icon: "◎",
    input: `Subject: not working\n\nmy api key stopped working after i changed my plan lol. also where do i find the webhooks docs? trying to connect to zapier`,
    tags: [
      { text: "API", type: "billing", detail: "Key invalidated after plan change — auto-regenerate" },
      { text: "Docs", type: "info", detail: "Webhooks link sent: /docs/webhooks" },
      { text: "Resolved", type: "resolved", detail: "Zapier integration guide attached" },
    ],
    footer: "CSAT prediction: 4.8 / 5 · no human needed",
    before: "12 min",
    after: "0.8 sec",
  },
  {
    id: "data",
    label: "Data extraction",
    icon: "⊞",
    input: `Invoice #4421 from Acme Supplies dated March 3rd 2025. Total due: $4,820.00 USD. Payment due in net-30. Contact: billing@acme.io. PO ref: PO-2025-0091.`,
    tags: [
      { text: "Invoice #4421", type: "info", detail: "Vendor: Acme Supplies · Date: 2025-03-03" },
      { text: "$4,820.00", type: "success", detail: "Amount confirmed · due 2025-04-02" },
      { text: "Net-30", type: "billing", detail: "PO ref PO-2025-0091 · contact billing@acme.io" },
    ],
    footer: "Pushed to QuickBooks · calendar reminder set · approval sent to CFO",
    before: "22 min",
    after: "1.0 sec",
  },
];

const METRICS = [
  { num: "12,840+", label: "Tasks automated today" },
  { num: "340 hrs", label: "Saved this week" },
  { num: "99%", label: "Accuracy rate" },
];

// ─── Framer Motion Variants ───────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.08,
    },
  }),
};

const fadeSwap: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.22, ease: "easeIn" } },
};

const slideTab: Variants = {
  hidden: { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -18, transition: { duration: 0.22, ease: "easeIn" } },
};

const packetVariant: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.82 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, scale: 0.82, transition: { duration: 0.2 } },
};

// ─── Tag Badge ────────────────────────────────────────────────────────────────

const TAG_STYLES: Record<TagType, string> = {
  urgent: "bg-red-100   text-red-800   dark:bg-red-900/40   dark:text-red-300",
  billing: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  bug: "bg-blue-100  text-blue-800  dark:bg-blue-900/40  dark:text-blue-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  info: "bg-blue-100  text-blue-800  dark:bg-blue-900/40  dark:text-blue-300",
  success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

function Tag({ text, type }: { text: string; type: TagType }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${TAG_STYLES[type]}`}
    >
      {text}
    </span>
  );
}

// ─── Live Demo ────────────────────────────────────────────────────────────────

function LiveDemo() {
  const [active, setActive] = useState(0);
  const uc = USE_CASES[active];

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {USE_CASES.map((u, i) => (
          <motion.button
            key={u.id}
            onClick={() => setActive(i)}
            whileTap={{ scale: 0.94 }}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
              i === active
                ? "border-[var(--palette-secondary)] bg-[var(--palette-secondary)] text-[var(--palette-primary)]"
                : "text-muted-foreground border-border hover:text-foreground bg-transparent hover:border-[var(--palette-tertiary)]"
            }`}
          >
            <span>{u.icon}</span>
            {u.label}
          </motion.button>
        ))}
      </div>

      {/* Before / After */}
      <AnimatePresence mode="wait">
        <motion.div
          key={uc.id}
          variants={fadeSwap}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {/* Before */}
          <div className="border-border bg-muted/40 flex flex-col gap-3 rounded-xl border p-4">
            <div className="flex items-center gap-2">
              <span className="bg-muted-foreground/40 h-2 w-2 rounded-full" />
              <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Manual process
              </span>
            </div>
            <pre className="text-muted-foreground min-h-[90px] flex-1 font-[family-name:var(--font-sans)] text-xs leading-relaxed whitespace-pre-wrap">
              {uc.input}
            </pre>
            <div className="text-muted-foreground border-border flex items-center gap-1.5 border-t pt-2 text-xs">
              <span>⏱</span>
              <span>Avg handle time:</span>
              <strong className="text-foreground">{uc.before}</strong>
            </div>
          </div>

          {/* After */}
          <div className="bg-card flex flex-col gap-3 rounded-xl border border-[var(--palette-tertiary)]/30 p-4">
            <div className="flex items-center gap-2">
              <motion.span
                className="h-2 w-2 rounded-full bg-[var(--palette-tertiary)]"
                animate={{ scale: [1, 1.45, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              <span className="text-[10px] font-semibold tracking-widest text-[var(--palette-tertiary)] uppercase">
                AI processed · instantly
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2.5">
              {uc.tags.map((t, i) => (
                <motion.div
                  key={t.text}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-2"
                >
                  <Tag text={t.text} type={t.type} />
                  <span className="text-muted-foreground text-xs leading-relaxed">{t.detail}</span>
                </motion.div>
              ))}
            </div>

            <p className="text-muted-foreground border-border border-t pt-2 text-xs">{uc.footer}</p>

            <div className="text-muted-foreground border-border flex items-center gap-1.5 border-t pt-1 text-xs">
              <span>⚡</span>
              <span>Processed in:</span>
              <strong className="text-green-600 dark:text-green-400">{uc.after}</strong>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Workflow Diagram ─────────────────────────────────────────────────────────

function WorkflowDiagram() {
  const [activeFlow, setActiveFlow] = useState(0);
  const [animStep, setAnimStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [packetIdx, setPacketIdx] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flow = FLOWS[activeFlow];

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const runStep = useCallback(
    (step: number) => {
      if (step >= flow.steps.length) {
        setIsPlaying(false);
        setPacketIdx(null);
        return;
      }
      setAnimStep(step);

      if (step < flow.steps.length - 1 && flow.packets[step]) {
        setPacketIdx(step);
        timerRef.current = setTimeout(() => setPacketIdx(null), 900);
      }
      timerRef.current = setTimeout(() => runStep(step + 1), 1200);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flow.steps.length]
  );

  const startAnim = useCallback(() => {
    clear();
    setAnimStep(-1);
    setPacketIdx(null);
    setIsPlaying(true);
    timerRef.current = setTimeout(() => runStep(0), 200);
  }, [clear, runStep]);

  useEffect(() => {
    clear();
    setAnimStep(-1);
    setIsPlaying(false);
    setPacketIdx(null);
  }, [activeFlow, clear]);

  useEffect(() => () => clear(), [clear]);

  const steps = flow.steps;

  return (
    <div className="flex flex-col gap-5">
      {/* Flow tabs */}
      <div className="flex flex-wrap gap-2">
        {FLOWS.map((f, i) => (
          <motion.button
            key={f.title}
            onClick={() => setActiveFlow(i)}
            whileTap={{ scale: 0.94 }}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
              i === activeFlow
                ? "border-[var(--palette-secondary)] bg-[var(--palette-secondary)] text-[var(--palette-primary)]"
                : "text-muted-foreground border-border hover:text-foreground bg-transparent hover:border-[var(--palette-tertiary)]"
            }`}
          >
            {f.title}
          </motion.button>
        ))}
      </div>

      {/* Pipeline */}
      <AnimatePresence mode="wait">
        <motion.div key={activeFlow} variants={fadeSwap} initial="hidden" animate="visible" exit="exit">
          {/* ── Mobile: vertical list ── */}
          <div className="flex flex-col gap-0 md:hidden">
            {steps.map((step, i) => {
              const isActive = animStep >= i;
              const isCurrent = animStep === i;
              return (
                <div key={step.label} className="flex items-stretch gap-3">
                  {/* Icon + vertical track */}
                  <div className="flex flex-shrink-0 flex-col items-center">
                    <motion.div
                      animate={{
                        scale: isCurrent ? 1.1 : isActive ? 1.02 : 1,
                        opacity: isActive ? 1 : 0.45,
                      }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border text-base ${
                        isActive
                          ? "border-[var(--palette-tertiary)] bg-[var(--palette-secondary)]"
                          : "bg-muted/40 border-border"
                      }`}
                    >
                      <span className={isActive ? "text-[var(--palette-primary)]" : "text-muted-foreground"}>
                        {step.icon}
                      </span>
                    </motion.div>

                    {i < steps.length - 1 && (
                      <div className="bg-border relative my-1 w-px flex-1 overflow-hidden" style={{ minHeight: 24 }}>
                        <motion.div
                          className="absolute inset-0 origin-top bg-[var(--palette-tertiary)]"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: animStep > i ? 1 : 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Text + packet */}
                  <div className={`flex-1 ${i < steps.length - 1 ? "pb-4" : "pb-0"}`}>
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="pt-1.5"
                    >
                      <p
                        className={`text-sm leading-tight font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {step.label}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">{step.sub}</p>

                      <AnimatePresence>
                        {packetIdx === i && flow.packets[i] && (
                          <motion.span
                            variants={packetVariant}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="mt-1.5 inline-flex rounded-full border border-[var(--palette-tertiary)]/40 bg-[var(--palette-secondary)] px-2 py-0.5 text-[10px] font-medium text-[var(--palette-primary)]"
                          >
                            {flow.packets[i].label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop: horizontal row ── */}
          <div className="hidden items-center justify-between gap-0 md:flex">
            {steps.map((step, i) => {
              const isActive = animStep >= i;
              const isCurrent = animStep === i;
              return (
                <div key={step.label} className="flex min-w-0 flex-1 items-center">
                  {/* Node */}
                  <motion.div
                    animate={{
                      scale: isCurrent ? 1.08 : isActive ? 1.03 : 1,
                      opacity: isActive ? 1 : 0.45,
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative flex w-[108px] flex-shrink-0 flex-col items-center justify-center rounded-xl border px-2 py-3 text-center xl:w-[120px] ${
                      isActive
                        ? "border-[var(--palette-tertiary)] bg-[var(--palette-secondary)]"
                        : "bg-muted/40 border-border"
                    }`}
                  >
                    <span
                      className={`mb-1 text-lg ${isActive ? "text-[var(--palette-primary)]" : "text-muted-foreground"}`}
                    >
                      {step.icon}
                    </span>
                    <span
                      className={`text-[11px] leading-tight font-semibold ${isActive ? "text-[var(--palette-primary)]" : "text-foreground"}`}
                    >
                      {step.label}
                    </span>
                    <span
                      className={`mt-0.5 text-[9px] leading-tight ${isActive ? "text-[var(--palette-tertiary)]" : "text-muted-foreground"}`}
                    >
                      {step.sub}
                    </span>

                    {/* Pulse ring */}
                    <AnimatePresence>
                      {isCurrent && (
                        <motion.span
                          className="pointer-events-none absolute inset-0 rounded-xl border-2 border-[var(--palette-tertiary)]"
                          initial={{ opacity: 0.7, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.18 }}
                          transition={{ duration: 0.85, repeat: Infinity }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Connector */}
                  {i < steps.length - 1 && (
                    <div className="relative mx-1 flex min-w-[8px] flex-1 items-center">
                      <div className="bg-border relative h-px w-full overflow-hidden">
                        <motion.div
                          className="absolute inset-0 origin-left bg-[var(--palette-tertiary)]"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: animStep > i ? 1 : 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <svg
                        className={`absolute right-0 -mr-0.5 transition-colors duration-300 ${animStep > i ? "text-[var(--palette-tertiary)]" : "text-border"}`}
                        width="7"
                        height="10"
                        viewBox="0 0 7 10"
                        fill="none"
                      >
                        <path
                          d="M1 1L6 5L1 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <AnimatePresence>
                        {packetIdx === i && flow.packets[i] && (
                          <motion.span
                            variants={packetVariant}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border border-[var(--palette-tertiary)]/40 bg-[var(--palette-secondary)] px-1.5 py-0.5 text-[9px] font-medium whitespace-nowrap text-[var(--palette-primary)]"
                            style={{ zIndex: 10 }}
                          >
                            {flow.packets[i].label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center gap-3 pt-1">
        <motion.button
          onClick={isPlaying ? undefined : startAnim}
          disabled={isPlaying}
          whileTap={isPlaying ? {} : { scale: 0.92 }}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 ${
            isPlaying
              ? "border-border text-muted-foreground cursor-default"
              : "border-[var(--palette-tertiary)] text-[var(--palette-tertiary)] hover:bg-[var(--palette-secondary)] hover:text-[var(--palette-primary)]"
          }`}
        >
          {isPlaying ? (
            <>
              <motion.span
                className="h-2 w-2 rounded-full bg-[var(--palette-tertiary)]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              Running…
            </>
          ) : animStep >= 0 ? (
            "↺ Replay"
          ) : (
            "▶ Play"
          )}
        </motion.button>

        {/* Progress track */}
        <div className="flex flex-1 items-center gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className="flex flex-1 items-center gap-1.5 last:flex-none">
              <motion.div
                className="h-2 w-2 rounded-full"
                animate={{
                  backgroundColor: animStep >= i ? "var(--palette-tertiary)" : "var(--color-border, #e2e8f0)",
                  scale: animStep === i ? 1.4 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              {i < steps.length - 1 && (
                <div className="bg-border relative h-px flex-1 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 origin-left bg-[var(--palette-tertiary)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: animStep > i ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <span className="text-muted-foreground min-w-[52px] text-right text-[10px] tabular-nums">
          {animStep >= 0 ? `${Math.min(animStep + 1, steps.length)} / ${steps.length}` : ""}
        </span>
      </div>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({ num, label, index }: { num: string; label: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="bg-muted/50 border-border rounded-xl border px-3 py-4 text-center sm:px-4"
    >
      <p className="text-foreground text-lg font-semibold sm:text-2xl">{num}</p>
      <p className="text-muted-foreground mt-1 text-[10px] leading-tight sm:text-[11px]">{label}</p>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIAutomationSection() {
  const [tab, setTab] = useState<"workflow" | "demo">("workflow");

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="w-full px-4">
      <div className="mx-auto max-w-[var(--spacing-container,1280px)]">
        {/* ── Tab switcher ── */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          className="bg-muted mb-6 flex w-full items-center gap-1 rounded-xl p-1 sm:w-fit"
        >
          {(["workflow", "demo"] as const).map((t) => (
            <motion.button
              key={t}
              onClick={() => setTab(t)}
              whileTap={{ scale: 0.96 }}
              className={`relative flex-1 rounded-lg px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 sm:flex-none ${
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === t && (
                <motion.span
                  layoutId="tab-pill"
                  className="bg-card border-border absolute inset-0 rounded-lg border shadow-sm"
                  transition={{ type: "spring", bounce: 0.18, duration: 0.42 }}
                />
              )}
              <span className="relative z-10">{t === "workflow" ? "⟶ Workflow diagram" : "⚡ Live demo"}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Panel ── */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          className="border-border bg-card rounded-2xl border p-4 shadow-md sm:p-7"
        >
          {/* Chrome bar */}
          <div className="mb-5 flex items-center justify-between sm:mb-6">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--palette-primary)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--palette-tertiary)]" />
              <span className="bg-border h-2.5 w-2.5 rounded-full" />
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={tab}
                variants={fadeSwap}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase"
              >
                {tab === "workflow" ? "Pipeline · animated" : "Before & after · live"}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div key={tab} variants={slideTab} initial="hidden" animate="visible" exit="exit">
              {tab === "workflow" ? <WorkflowDiagram /> : <LiveDemo />}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Metrics ── */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
          {METRICS.map((m, i) => (
            <MetricCard key={m.label} {...m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
