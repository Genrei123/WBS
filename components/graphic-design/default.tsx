"use client";

import { useCallback, useEffect, useRef,useState } from "react";

const ModelViewer = "model-viewer" as any;

function imgSrc(image: any): string {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!image) return "/placeholder.svg";

  // Prefer fully resolved URLs from Sanity when available.
  if (typeof image?.asset?.url === "string") return image.asset.url;
  if (typeof image?.url === "string") return image.url;

  const ref = image?.asset?._ref || image?._ref || image?.assetRef || image?.asset?._id;
  if (!ref || !projectId || !dataset) {
    console.warn("imgSrc: missing Sanity asset data", image);
    return "/placeholder.svg";
  }

  const cleaned = String(ref).replace(/^image-/, "").replace(/^file-/, "");
  const urlPart = cleaned.replace(/-(jpg|jpeg|png|webp|gif|svg|avif)$/i, (_match, ext) => `.${ext}`);

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${urlPart}`;
}

function fileSrc(file: any): string {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!file) return "/placeholder.svg";
  if (typeof file?.asset?.url === "string") return file.asset.url;
  if (typeof file?.url === "string") return file.url;

  const ref = file?.asset?._ref || file?._ref || file?.assetRef || file?.asset?._id;
  if (!ref || !projectId || !dataset) return "/placeholder.svg";

  const cleaned = String(ref).replace(/^file-/, "");
  const urlPart = cleaned.replace(/-([a-z0-9]+)$/i, (_match, ext) => `.${ext}`);
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${urlPart}`;
}

function getGalleryMedia(item: any) {
  return item?.image || item?.thumbnail || item;
}

function getModelMedia(item: any) {
  return item?.file || item?.model || item;
}

function isModelItem(item: any) {
  const mimeType = item?.file?.asset?.mimeType || item?.mimeType || item?.file?.mimeType;
  const fileName = item?.file?.asset?.originalFilename || item?.fileName || item?.file?.originalFilename;
  return Boolean(
    item?.file ||
      item?.model ||
      (typeof mimeType === "string" && mimeType.startsWith("model/")) ||
      (typeof fileName === "string" && /\.(glb|gltf|usdz)$/i.test(fileName))
  );
}

function Lightbox({
  data,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  data: any[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const image = data[index];
  const media = getGalleryMedia(image);
  const model = getModelMedia(image);
  const modelPoster = image?.thumbnail || image?.image;
  const showModel = isModelItem(image);

  const touchStartX = useRef<number | null>(null);
  const dragStartX = useRef<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    setDragDelta(0);
    setSwiping(false);
  }, [index]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (document.querySelector('script[data-model-viewer="true"]')) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    script.dataset.modelViewer = "true";
    document.head.appendChild(script);
  }, []);

  // touch
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    setDragDelta(e.touches[0].clientX - touchStartX.current);
    setSwiping(true);
  };
  const onTouchEnd = () => {
    if (dragDelta < -60) onNext();
    else if (dragDelta > 60) onPrev();
    setDragDelta(0);
    setSwiping(false);
    touchStartX.current = null;
  };

  // mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    setSwiping(true);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (dragStartX.current === null) return;
    setDragDelta(e.clientX - dragStartX.current);
  };
  const onMouseUp = () => {
    if (dragDelta < -60) onNext();
    else if (dragDelta > 60) onPrev();
    setDragDelta(0);
    setSwiping(false);
    dragStartX.current = null;
  };

  const rotation = Math.min(Math.max(dragDelta / 20, -6), 6);
  const opacity = Math.max(1 - Math.abs(dragDelta) / 400, 0.5);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        style={{ animation: "fadeIn .2s ease" }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:flex-row"
          style={{ animation: "scaleIn .25s cubic-bezier(.34,1.56,.64,1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image pane */}
          <div
            className="relative flex max-h-[50vh] min-w-0 flex-1 items-center justify-center overflow-hidden bg-zinc-950 select-none md:max-h-[90vh]"
            style={{ cursor: swiping ? "grabbing" : "grab" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {showModel ? (
              <ModelViewer
                src={fileSrc(model)}
                poster={modelPoster ? imgSrc(modelPoster) : undefined}
                alt={image.alt || image.title || "3D model"}
                camera-controls
                auto-rotate
                shadow-intensity="1"
                exposure="1"
                interaction-prompt="auto"
                className="block h-full w-full"
                style={{ minHeight: "50vh" }}
              />
            ) : (
              <img
                src={imgSrc(media)}
                alt={image.alt || image.title || "Gallery image"}
                draggable={false}
                className="pointer-events-none block max-h-[90vh] max-w-full object-contain"
                style={{
                  transform: `translateX(${dragDelta}px) rotate(${rotation}deg)`,
                  opacity,
                  transition: swiping ? "none" : "transform .3s ease, opacity .3s ease",
                }}
              />
            )}

            {data.length > 1 && (
              <>
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                  aria-label="Previous"
                  style={{ opacity: Math.max(1 - Math.abs(dragDelta) / 120, 0) }}
                  className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                >
                  ‹
                </button>
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  aria-label="Next"
                  style={{ opacity: Math.max(1 - Math.abs(dragDelta) / 120, 0) }}
                  className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                >
                  ›
                </button>
              </>
            )}

            {/* Swipe hint */}
            {data.length > 1 && (
              <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 opacity-30">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                <span className="text-[10px] tracking-widest text-white uppercase">swipe</span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="flex w-full shrink-0 flex-col overflow-y-auto border-t border-white/8 bg-zinc-900 p-6 md:w-80 md:border-t-0 md:border-l">
            <span className="mb-4 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">Gallery</span>

            {image.title && <h2 className="mb-1 text-lg leading-snug font-semibold text-white">{image.title}</h2>}

            {image.description ? (
              <>
                <div className="my-4 h-px bg-white/8" />
                <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">{image.description}</p>
              </>
            ) : image.caption ? (
              <>
                <div className="my-4 h-px bg-white/8" />
                <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">{image.caption}</p>
              </>
            ) : null}
          </aside>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="fixed top-4 right-5 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20"
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(.93) translateY(14px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>
    </>
  );
}

type GalleryItem = {
  image?: any;
  thumbnail?: any;
  model?: any;
  file?: any;
  alt?: string;
  title?: string;
  description?: string;
  caption?: string;
};

export function GalleryViewer({ data = [] }: { data?: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => setActiveIndex((i) => (i! === 0 ? data.length - 1 : i! - 1)), [data.length]);
  const next = useCallback(() => setActiveIndex((i) => (i! === data.length - 1 ? 0 : i! + 1)), [data.length]);

  if (!data.length) {
    return (
      <div className="border-border bg-card/30 text-muted-foreground rounded-2xl border border-dashed px-6 py-16 text-center">
        No gallery items were returned from Sanity.
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 gap-4 p-4 sm:columns-2 md:columns-3 lg:columns-4">
        {data.map((image, index) => (
          <div
            key={image.description ?? image.title ?? index}
            className="card bg-base-100 group relative mb-4 cursor-zoom-in break-inside-avoid shadow-sm"
            onClick={() => setActiveIndex(index)}
          >
            <figure className="w-full overflow-hidden rounded-sm">
              {isModelItem(image) ? (
                image.thumbnail || image.image ? (
                  <img
                    src={imgSrc(getGalleryMedia(image))}
                    alt={image.alt || image.title || "3D model thumbnail"}
                    className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-zinc-800 text-zinc-300">
                    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2v6l4-2-4-4z" />
                      <path d="M4 7v10l8 4 8-4V7" />
                    </svg>
                  </div>
                )
              ) : (
                <img
                  src={imgSrc(getGalleryMedia(image))}
                  alt={image.alt || image.title || "Gallery image"}
                  className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </figure>

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
              <div className="rounded-full border border-white/20 bg-black/50 p-2.5 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeIndex !== null && <Lightbox data={data} index={activeIndex} onClose={close} onPrev={prev} onNext={next} />}
    </>
  );
}
