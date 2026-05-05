"use client";

import { PDFDocument, rgb } from "pdf-lib";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

type Tool = "text" | "sign";
type Stage = "edit" | "preview" | "synced";

interface Annotation {
  id: string;
  x: number;
  y: number;
  // text annotations
  text?: string;
  editing?: boolean;
  // signature annotations
  dataUrl?: string;
}

// ── Consistent PDF render width ───────────────────────────────────────────────
const PDF_WIDTH = 550;

// ── Signature Modal ────────────────────────────────────────────────────────────

function SignatureModal({
  open,
  onClose,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (dataUrl: string) => void;
}) {
  const [tab, setTab] = useState<"draw" | "type">("draw");
  const [typedSig, setTypedSig] = useState("");
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const typeCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!open || tab !== "draw") return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [open, tab]);

  function getPos(canvas: HTMLCanvasElement, e: React.PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = e.currentTarget.getContext("2d")!;
    const { x, y } = getPos(e.currentTarget, e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    const ctx = e.currentTarget.getContext("2d")!;
    const { x, y } = getPos(e.currentTarget, e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function clearDraw() {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function renderTyped(val: string) {
    const canvas = typeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "italic 38px Georgia, serif";
    ctx.fillText(val, 12, 60);
  }

  function handleApply() {
    if (tab === "draw") {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;
      onApply(canvas.toDataURL());
    } else {
      if (!typedSig.trim()) return;
      renderTyped(typedSig);
      const canvas = typeCanvasRef.current;
      if (!canvas) return;
      onApply(canvas.toDataURL());
    }
    onClose();
  }

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[420px] max-w-[95vw] rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Create Signature</h2>
          <button onClick={onClose} className="text-xl leading-none text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {tab === "draw" && (
          <div>
            <canvas
              ref={drawCanvasRef}
              width={380}
              height={140}
              className="w-full cursor-crosshair touch-none rounded border bg-white"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={() => {
                isDrawing.current = false;
              }}
            />
            <button onClick={clearDraw} className="mt-2 text-sm text-gray-500 underline">
              Clear
            </button>
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded border py-2 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded bg-gray-900 py-2 text-sm text-white hover:bg-gray-700"
          >
            Add Signature ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helper ─────────────────────────────────────────────────────────────────────
function dataUrlToBytes(dataUrl: string): Uint8Array<ArrayBuffer> {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// ── Draggable Text Item ───────────────────────────────────────────────────────
// Top-level so React never remounts it on parent re-render.

interface DraggableTextProps {
  ann: Annotation;
  isActive: boolean;
  onMoveEnd: (id: string, x: number, y: number) => void;
  onActivate: (id: string) => void;
  onChange: (id: string, text: string) => void;
  onBlur: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onDelete: (id: string) => void;
}

function DraggableText({
  ann,
  isActive,
  onMoveEnd,
  onActivate,
  onChange,
  onBlur,
  onKeyDown,
  onDelete,
}: DraggableTextProps) {
  const dragRef = useRef<{ startX: number; startY: number; startMX: number; startMY: number } | null>(null);
  const posRef = useRef({ x: ann.x, y: ann.y });
  const divRef = useRef<HTMLDivElement>(null);

  // Sync position from parent (initial placement)
  useEffect(() => {
    posRef.current = { x: ann.x, y: ann.y };
    if (divRef.current) {
      divRef.current.style.left = ann.x + "px";
      divRef.current.style.top = ann.y + "px";
    }
  }, [ann.id]); // only on mount / id change, not on every x/y update

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Don't start drag if clicking the input itself or delete button
    if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "BUTTON") return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: posRef.current.x,
      startY: posRef.current.y,
      startMX: e.clientX,
      startMY: e.clientY,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || e.buttons === 0) return;
    const dx = e.clientX - dragRef.current.startMX;
    const dy = e.clientY - dragRef.current.startMY;
    const newX = dragRef.current.startX + dx;
    const newY = dragRef.current.startY + dy;
    posRef.current = { x: newX, y: newY };
    if (divRef.current) {
      divRef.current.style.left = newX + "px";
      divRef.current.style.top = newY + "px";
    }
  }

  function onPointerUp(_e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    onMoveEnd(ann.id, posRef.current.x, posRef.current.y);
    dragRef.current = null;
  }

  return (
    <div
      ref={divRef}
      style={{
        position: "absolute",
        left: ann.x,
        top: ann.y,
        cursor: "move",
        zIndex: 7,
        userSelect: "none",
        display: "inline-flex",
        alignItems: "center",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <input
        autoFocus={isActive}
        value={ann.text ?? ""}
        onChange={(e) => onChange(ann.id, e.target.value)}
        onKeyDown={(e) => onKeyDown(e, ann.id)}
        onBlur={() => onBlur(ann.id)}
        onFocus={() => onActivate(ann.id)}
        onClick={(e) => {
          e.stopPropagation();
          onActivate(ann.id);
        }}
        placeholder={isActive && !ann.text ? "Type here…" : ""}
        style={{
          background: "transparent",
          border: isActive ? "1px dashed #555" : "1px dashed transparent",
          outline: "none",
          color: "black",
          fontSize: "13px",
          fontFamily: "sans-serif",
          minWidth: 80,
          width: Math.max(80, (ann.text?.length ?? 0) * 8 + 20) + "px",
          padding: "1px 4px",
          cursor: "text",
        }}
      />
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(ann.id);
        }}
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#ef4444",
          color: "white",
          border: "none",
          fontSize: 9,
          cursor: "pointer",
          marginLeft: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ── Draggable Signature Item ──────────────────────────────────────────────────

interface DraggableSigProps {
  ann: Annotation;
  onMoveEnd: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
}

function DraggableSig({ ann, onMoveEnd, onDelete }: DraggableSigProps) {
  const dragRef = useRef<{ startX: number; startY: number; startMX: number; startMY: number } | null>(null);
  const posRef = useRef({ x: ann.x, y: ann.y });
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    posRef.current = { x: ann.x, y: ann.y };
    if (divRef.current) {
      divRef.current.style.left = ann.x + "px";
      divRef.current.style.top = ann.y + "px";
    }
  }, [ann.id]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).tagName === "BUTTON") return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: posRef.current.x,
      startY: posRef.current.y,
      startMX: e.clientX,
      startMY: e.clientY,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || e.buttons === 0) return;
    const newX = dragRef.current.startX + (e.clientX - dragRef.current.startMX);
    const newY = dragRef.current.startY + (e.clientY - dragRef.current.startMY);
    posRef.current = { x: newX, y: newY };
    if (divRef.current) {
      divRef.current.style.left = newX + "px";
      divRef.current.style.top = newY + "px";
    }
  }

  function onPointerUp() {
    if (!dragRef.current) return;
    onMoveEnd(ann.id, posRef.current.x, posRef.current.y);
    dragRef.current = null;
  }

  return (
    <div
      ref={divRef}
      style={{
        position: "absolute",
        left: ann.x,
        top: ann.y,
        cursor: "move",
        zIndex: 6,
        userSelect: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <img
        src={ann.dataUrl}
        alt="signature"
        draggable={false}
        style={{ width: 160, display: "block", mixBlendMode: "multiply", pointerEvents: "none" }}
      />
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(ann.id);
        }}
        style={{
          position: "absolute",
          top: -8,
          right: -8,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#ef4444",
          color: "white",
          border: "none",
          fontSize: 10,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ── Annotation Overlay ────────────────────────────────────────────────────────

interface AnnotationOverlayProps {
  tool: Tool;
  annotations: Annotation[];
  activeId: string | null;
  onOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMoveEnd: (id: string, x: number, y: number) => void;
  onActivate: (id: string) => void;
  onChange: (id: string, text: string) => void;
  onBlur: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onDelete: (id: string) => void;
}

function AnnotationOverlay({
  tool,
  annotations,
  activeId,
  onOverlayClick,
  onMoveEnd,
  onActivate,
  onChange,
  onBlur,
  onKeyDown,
  onDelete,
}: AnnotationOverlayProps) {
  return (
    <div
      onClick={onOverlayClick}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        cursor: tool === "text" ? "crosshair" : "default",
      }}
    >
      {annotations.map((ann) =>
        ann.dataUrl ? (
          <DraggableSig key={ann.id} ann={ann} onMoveEnd={onMoveEnd} onDelete={onDelete} />
        ) : (
          <DraggableText
            key={ann.id}
            ann={ann}
            isActive={activeId === ann.id}
            onMoveEnd={onMoveEnd}
            onActivate={onActivate}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onDelete={onDelete}
          />
        )
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PDFAutomationClient() {
  const isWorkerInitialized = useRef(false);
  const [tool, setTool] = useState<Tool>("text");
  const [sigModalOpen, setSigModalOpen] = useState(false);

  // Single unified annotations list (text + signatures)
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [stage, setStage] = useState<Stage>("edit");
  const [letter1Url, setLetter1Url] = useState<string | null>(null);
  const [letter2Url, setLetter2Url] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [capturedDimensions, setCapturedDimensions] = useState<{ width: number; height: number } | null>(null);

  // We capture the actual rendered PDF dimensions here for accurate scale
  const pdfWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isWorkerInitialized.current) return;
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    isWorkerInitialized.current = true;
  }, []);

  // ── Build PDF ──────────────────────────────────────────────────────────────
  async function buildPdf(src: string, dimensions?: { width: number; height: number } | null) {
    const res = await fetch(src);
    if (!res.ok) throw new Error("Could not fetch " + src);
    const bytes = await res.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const page = pdfDoc.getPages()[0];
    const { width: pdfW, height: pdfH } = page.getSize();

    // Use provided dimensions or fallback to captured/current dimensions
    const dims = dimensions || capturedDimensions;
    const renderW = dims?.width || pdfWrapperRef.current?.clientWidth || PDF_WIDTH;
    const renderH = dims?.height || pdfWrapperRef.current?.clientHeight || 800;
    const scaleX = pdfW / renderW;
    const scaleY = pdfH / renderH;

    for (const ann of annotations) {
      if (ann.dataUrl) {
        const imgBytes = dataUrlToBytes(ann.dataUrl);
        const embeddedImg = await pdfDoc.embedPng(imgBytes);
        const dims = embeddedImg.scale(0.5);
        page.drawImage(embeddedImg, {
          x: ann.x * scaleX,
          y: pdfH - ann.y * scaleY - dims.height,
          width: dims.width,
          height: dims.height,
        });
      } else if (ann.text?.trim()) {
        page.drawText(ann.text, {
          x: ann.x * scaleX,
          y: pdfH - ann.y * scaleY,
          size: 12,
          color: rgb(0, 0, 0),
        });
      }
    }

    const saved = await pdfDoc.save();
    const blob = new Blob([saved.buffer.slice(0) as ArrayBuffer], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  }

  async function handleGenerateLetter1() {
    if (annotations.length === 0) return;
    setWorking(true);
    try {
      // Capture dimensions synchronously before building PDF
      let dims = capturedDimensions;
      if (!dims && pdfWrapperRef.current) {
        dims = {
          width: pdfWrapperRef.current.clientWidth,
          height: pdfWrapperRef.current.clientHeight,
        };
        setCapturedDimensions(dims);
      }
      setLetter1Url(await buildPdf("/pdf-automation/Letter_1.pdf", dims));
      setStage("preview");
    } catch (err) {
      console.error(err);
    } finally {
      setWorking(false);
    }
  }

  async function handleSync() {
    setWorking(true);
    try {
      setLetter2Url(await buildPdf("/pdf-automation/Letter_2.pdf", capturedDimensions));
      setStage("synced");
    } catch (err) {
      console.error(err);
    } finally {
      setWorking(false);
    }
  }

  function handleReset() {
    setAnnotations([]);
    setActiveId(null);
    setLetter1Url(null);
    setLetter2Url(null);
    setCapturedDimensions(null);
    setStage("edit");
  }

  // ── Overlay click — place new text annotation ──────────────────────────────
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (tool !== "text") return;
    if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "BUTTON") return;

    // Commit and drop empty active annotation first
    setAnnotations((prev) => prev.filter((a) => a.dataUrl || (a.text ?? "").trim() !== ""));

    const rect = e.currentTarget.getBoundingClientRect();
    const id = `ann-${Date.now()}`;
    setAnnotations((prev) => [
      ...prev.filter((a) => a.dataUrl || (a.text ?? "").trim() !== ""),
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top, text: "" },
    ]);
    setActiveId(id);
  }

  function handleChange(id: string, text: string) {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, text } : a)));
  }

  function handleBlur(id: string) {
    setTimeout(() => {
      setActiveId((cur) => {
        if (cur === id) {
          setAnnotations((prev) => prev.filter((a) => a.dataUrl || (a.text ?? "").trim() !== ""));
          return null;
        }
        return cur;
      });
    }, 150);
  }

  function handleKeyDown(e: React.KeyboardEvent, id: string) {
    if (e.key === "Enter") {
      setActiveId(null);
      setAnnotations((prev) => prev.filter((a) => a.dataUrl || (a.text ?? "").trim() !== ""));
    }
    if (e.key === "Escape") {
      setAnnotations((prev) => prev.filter((a) => a.id !== id || a.dataUrl || (a.text ?? "").trim() !== ""));
      setActiveId(null);
    }
  }

  // Commit final position after drag ends — update state once
  function handleMoveEnd(id: string, x: number, y: number) {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, x, y } : a)));
  }

  function handleDelete(id: string) {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }

  function handleApplySig(dataUrl: string) {
    setAnnotations((prev) => [...prev, { id: `sig-${Date.now()}`, x: 40, y: 500, dataUrl }]);
  }

  const hasAnnotations = annotations.length > 0;

  return (
    <>
      <SignatureModal open={sigModalOpen} onClose={() => setSigModalOpen(false)} onApply={handleApplySig} />

      <div className="container flex flex-col gap-6 py-12">
        {/* ── Edit stage ────────────────────────────────────────────────────── */}
        {stage === "edit" && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                Step 1 — Annotate Letter 1
              </span>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => setTool("text")}
                  className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${tool === "text" ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  T Add Text
                </button>
                <button
                  onClick={() => {
                    setTool("sign");
                    setSigModalOpen(true);
                  }}
                  className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${tool === "sign" ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  ✍ Sign
                </button>
                <button
                  onClick={handleReset}
                  className="rounded border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* PDF viewer — fixed width, inline-block so it doesn't stretch */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-2xl font-bold">Letter 1</h2>
                <span className="text-sm text-gray-400">
                  {tool === "text" ? "Click to place text, drag to reposition" : "Drag signature to reposition"}
                </span>
              </div>

              <div
                className="relative overflow-hidden rounded border bg-white shadow-md"
                ref={pdfWrapperRef}
                style={{ display: "inline-block" }}
              >
                <Document
                  file="/pdf-automation/Letter_1.pdf"
                  error={<div className="p-4 text-red-500">Failed to load PDF.</div>}
                >
                  <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} width={PDF_WIDTH} />
                </Document>
                <AnnotationOverlay
                  tool={tool}
                  annotations={annotations}
                  activeId={activeId}
                  onOverlayClick={handleOverlayClick}
                  onMoveEnd={handleMoveEnd}
                  onActivate={(id) => setActiveId(id)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  onDelete={handleDelete}
                />
              </div>

              <button
                onClick={handleGenerateLetter1}
                disabled={!hasAnnotations || working}
                className="w-full rounded bg-gray-900 py-3 text-sm font-semibold text-white transition-opacity hover:bg-gray-700 disabled:opacity-40"
                style={{ maxWidth: PDF_WIDTH }}
              >
                {working ? "Generating…" : "Generate Letter 1 Preview →"}
              </button>
            </div>
          </>
        )}

        {/* ── Preview / Synced stage ────────────────────────────────────────── */}
        {(stage === "preview" || stage === "synced") && (
          <>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleReset}
                className="rounded border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                ← Edit Again
              </button>
              <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                {stage === "preview" ? "Step 2 — Review & Sync to Letter 2" : "Done — Download your PDFs"}
              </span>
            </div>

            <div className={`flex flex-wrap justify-center gap-8`}>
              {/* Letter 1 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between" style={{ width: PDF_WIDTH }}>
                  <h2 className="text-2xl font-bold">Letter 1</h2>
                  <a href={letter1Url!} download="Letter_1_signed.pdf" className="text-sm text-blue-500 underline">
                    Download
                  </a>
                </div>
                <div className="overflow-hidden rounded border bg-white shadow-md" style={{ display: "inline-block" }}>
                  <Document file={letter1Url!} error={<div className="p-4 text-red-500">Failed to load PDF.</div>}>
                    <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} width={PDF_WIDTH} />
                  </Document>
                </div>
              </div>

              {/* Letter 2 — only show if synced */}
              {letter2Url && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between" style={{ width: PDF_WIDTH }}>
                    <h2 className="text-2xl font-bold">Letter 2</h2>
                    <a href={letter2Url} download="Letter_2_signed.pdf" className="text-sm text-blue-500 underline">
                      Download
                    </a>
                  </div>
                  <div
                    className="overflow-hidden rounded border bg-white shadow-md"
                    style={{ display: "inline-block" }}
                  >
                    <Document file={letter2Url} error={<div className="p-4 text-red-500">Failed to load PDF.</div>}>
                      <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} width={PDF_WIDTH} />
                    </Document>
                  </div>
                </div>
              )}
            </div>

            {stage === "preview" && (
              <div className="mt-6 flex w-full justify-center">
                <button
                  onClick={handleSync}
                  disabled={working}
                  className="rounded bg-gray-900 py-3 text-sm font-semibold text-white transition-opacity hover:bg-gray-700 disabled:opacity-40"
                  style={{ width: PDF_WIDTH }} // single column width
                >
                  {working ? "Syncing…" : "Sync Annotations to Letter 2 →"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
