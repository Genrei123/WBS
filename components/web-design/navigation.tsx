"use client";

import { useEffect, useRef, useState } from "react";

const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  input[type="range"] {
    width: 100%;
    height: 6px;
    padding: 0;
    margin: 0;
    border-radius: 5px;
    background: #e5e7eb;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
    pointer-events: auto;
    touch-action: none;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #92400e;
    cursor: grab;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    border: none;
    padding: 0;
    margin: 0;
    pointer-events: auto;
    touch-action: none;
  }
  
  input[type="range"]::-webkit-slider-thumb:active {
    cursor: grabbing;
  }
  
  input[type="range"]::-moz-range-track {
    background: transparent;
    border: none;
  }

  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #92400e;
    cursor: grab;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    padding: 0;
    margin: 0;
    pointer-events: auto;
    touch-action: none;
  }

  input[type="range"]::-moz-range-thumb:active {
    cursor: grabbing;
  }

  input[type="range"]::-moz-range-progress {
    background: #92400e;
    border-radius: 5px;
  }

  select {
    position: relative !important;
    z-index: 50 !important;
  }

  select option {
    padding: 8px;
    line-height: 1.5;
  }
`;

type DesignState = {
  primaryColor: string;
  secondaryColor: string;
  fontColor: string;
  spacing: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: "light" | "normal" | "semibold" | "bold";
  fontFamily: string;
};

const fontWeightMap = {
  light: 300,
  normal: 400,
  semibold: 600,
  bold: 700,
};

const fontFamilyOptions = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Courier",
  "Verdana",
  "Times New Roman",
  "Trebuchet MS",
  "Comic Sans MS",
];

type ActiveMenu = "color" | "font" | "layout" | null;

// Paint Icon SVG
const PaintIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 20c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V8H4v12z"></path>
    <path d="M16 1H8v3h8V1z"></path>
    <path d="M4 5h16M7 7l1.5 5.5M16 7l-1.5 5.5"></path>
  </svg>
);

// Letter Icon SVG
const LetterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="4 7 4 4 20 4 20 7"></polyline>
    <line x1="9" y1="20" x2="15" y2="20"></line>
    <line x1="12" y1="4" x2="12" y2="20"></line>
  </svg>
);

// Grid Icon SVG
const GridIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

export function DesignStudioToolbar({
  design,
  onDesignChange,
}: {
  design: DesignState;
  onDesignChange: (design: DesignState) => void;
}) {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);
  const [fontFamilyOpen, setFontFamilyOpen] = useState(false);
  const [colorDraft, setColorDraft] = useState<
    Pick<DesignState, "primaryColor" | "secondaryColor" | "fontColor">
  >({
    primaryColor: design.primaryColor,
    secondaryColor: design.secondaryColor,
    fontColor: design.fontColor,
  });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const fontFamilyRef = useRef<HTMLDivElement>(null);

  const normalizeHexColor = (raw: string) => {
    const trimmed = raw.trim();
    const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    const match = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(withHash);
    if (!match) return null;

    const hex = match[1];
    if (hex.length === 6) return `#${hex.toLowerCase()}`;

    // Expand short hex (#abc -> #aabbcc)
    const expanded = hex
      .split("")
      .map((c) => `${c}${c}`)
      .join("");
    return `#${expanded.toLowerCase()}`;
  };

  const commitDraftColor = (key: "primaryColor" | "secondaryColor" | "fontColor") => {
    const normalized = normalizeHexColor(colorDraft[key]);
    if (!normalized) {
      setColorDraft((prev) => ({ ...prev, [key]: design[key] }));
      return;
    }
    setColorDraft((prev) => ({ ...prev, [key]: normalized }));
    onDesignChange({ ...design, [key]: normalized });
  };

  const handleColorChange = (
    key: "primaryColor" | "secondaryColor" | "fontColor",
    value: string
  ) => {
    onDesignChange({ ...design, [key]: value });
  };

  const handleSliderChange = (
    key: "spacing" | "borderRadius" | "fontSize",
    value: number
  ) => {
    onDesignChange({ ...design, [key]: value });
  };

  const handleFontWeightChange = (
    weight: "light" | "normal" | "semibold" | "bold"
  ) => {
    onDesignChange({ ...design, fontWeight: weight });
  };

  const handleFontFamilyChange = (family: string) => {
    onDesignChange({ ...design, fontFamily: family });
  };

  const toggleMenu = (menu: Exclude<ActiveMenu, null>) => {
    setFontFamilyOpen(false);

    setActiveMenu((prev) => {
      const next = prev === menu ? null : menu;
      if (next === "color") {
        setColorDraft({
          primaryColor: design.primaryColor,
          secondaryColor: design.secondaryColor,
          fontColor: design.fontColor,
        });
      }
      return next;
    });
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
      if (fontFamilyRef.current && !fontFamilyRef.current.contains(event.target as Node)) {
        setFontFamilyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderMenuContent = (type: ActiveMenu) => {
    if (type === "color") {
      return (
        <div className="space-y-4 w-64">
          {/* Primary Color */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Primary Color</h4>
            <div className="flex gap-3 items-end">
              <div
                className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                style={{ backgroundColor: design.primaryColor }}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "color";
                  input.value = design.primaryColor;
                  input.oninput = (e: any) => {
                    setColorDraft((prev) => ({ ...prev, primaryColor: e.target.value }));
                    handleColorChange("primaryColor", e.target.value);
                  };
                  input.onchange = (e: any) => {
                    setColorDraft((prev) => ({ ...prev, primaryColor: e.target.value }));
                    handleColorChange("primaryColor", e.target.value);
                  };
                  input.click();
                }}
              />
              <input
                type="text"
                value={colorDraft.primaryColor}
                onChange={(e) =>
                  setColorDraft((prev) => ({ ...prev, primaryColor: e.target.value }))
                }
                onBlur={() => commitDraftColor("primaryColor")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    commitDraftColor("primaryColor");
                    (e.currentTarget as HTMLInputElement).blur();
                  }
                }}
                className="flex-1 border border-gray-300 rounded px-2 py-2 text-xs font-mono focus:outline-none focus:border-amber-800"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Secondary Color</h4>
            <div className="flex gap-3 items-end">
              <div
                className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                style={{ backgroundColor: design.secondaryColor }}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "color";
                  input.value = design.secondaryColor;
                  input.oninput = (e: any) => {
                    setColorDraft((prev) => ({ ...prev, secondaryColor: e.target.value }));
                    handleColorChange("secondaryColor", e.target.value);
                  };
                  input.onchange = (e: any) => {
                    setColorDraft((prev) => ({ ...prev, secondaryColor: e.target.value }));
                    handleColorChange("secondaryColor", e.target.value);
                  };
                  input.click();
                }}
              />
              <input
                type="text"
                value={colorDraft.secondaryColor}
                onChange={(e) =>
                  setColorDraft((prev) => ({ ...prev, secondaryColor: e.target.value }))
                }
                onBlur={() => commitDraftColor("secondaryColor")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    commitDraftColor("secondaryColor");
                    (e.currentTarget as HTMLInputElement).blur();
                  }
                }}
                className="flex-1 border border-gray-300 rounded px-2 py-2 text-xs font-mono focus:outline-none focus:border-amber-800"
              />
            </div>
          </div>

        </div>
      );
    }

    if (type === "font") {
      return (
        <div className="space-y-4 w-64">
          {/* Font Weight */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Font Weight</h4>
            <div className="grid grid-cols-2 gap-2">
              {(["light", "normal", "semibold", "bold"] as const).map((weight) => (
                <button
                  key={weight}
                  onClick={() => handleFontWeightChange(weight)}
                  className={`py-2 px-2 text-xs rounded transition-all focus:outline-none focus:ring-0 ${
                    design.fontWeight === weight
                      ? "bg-amber-800 text-white hover:bg-amber-900"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{ fontWeight: fontWeightMap[weight] }}
                >
                  {weight.charAt(0).toUpperCase() + weight.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold text-gray-700">Font Size</h4>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                {design.fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="32"
              value={design.fontSize}
              onChange={(e) =>
                handleSliderChange("fontSize", parseInt(e.target.value))
              }
              className="w-full cursor-pointer"
            />
          </div>

          {/* Font Family */}
          <div ref={fontFamilyRef} className="relative">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Font Family</h4>
            <button
              onClick={() => setFontFamilyOpen(!fontFamilyOpen)}
              className="w-full border border-gray-300 rounded px-2 py-2 text-xs bg-white text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              style={{ fontFamily: design.fontFamily }}
            >
              <span>{design.fontFamily}</span>
              <span className="text-gray-400">{fontFamilyOpen ? "▲" : "▼"}</span>
            </button>
            {fontFamilyOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 border border-gray-300 rounded bg-white max-h-56 overflow-y-auto z-50 shadow-lg">
                {fontFamilyOptions.map((family) => (
                  <button
                    key={family}
                    onClick={() => {
                      handleFontFamilyChange(family);
                      setFontFamilyOpen(false);
                    }}
                    className={`w-full text-left px-2 py-2 text-xs transition-colors ${
                      design.fontFamily === family
                        ? "bg-amber-800 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    style={{ fontFamily: family }}
                  >
                    {family}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (type === "layout") {
      return (
        <div className="space-y-4 w-64">
          {/* Spacing */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold text-gray-700">Spacing</h4>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                {design.spacing}px
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={design.spacing}
              onChange={(e) =>
                handleSliderChange("spacing", parseInt(e.target.value))
              }
              className="w-full cursor-pointer"
            />
          </div>

          {/* Border Radius */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold text-gray-700">Border Radius</h4>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                {design.borderRadius}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              value={design.borderRadius}
              onChange={(e) =>
                handleSliderChange("borderRadius", parseInt(e.target.value))
              }
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      ref={toolbarRef}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <style>{scrollbarHideStyles}</style>

      {/* Active Menu Popover */}
      {activeMenu && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 overflow-visible" style={{ pointerEvents: "auto" }}>
          {renderMenuContent(activeMenu)}
        </div>
      )}

      {/* Toolbar Buttons */}
      <div className="flex gap-3 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        {/* Color Button */}
        <button
          onClick={() => toggleMenu("color")}
          className={`p-3 rounded-lg transition-all focus:outline-none focus:ring-0 ${
            activeMenu === "color"
              ? "bg-amber-800 text-white hover:bg-amber-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          title="Color Selection"
        >
          <PaintIcon />
        </button>

        {/* Font Button */}
        <button
          onClick={() => toggleMenu("font")}
          className={`p-3 rounded-lg transition-all focus:outline-none focus:ring-0 ${
            activeMenu === "font"
              ? "bg-amber-800 text-white hover:bg-amber-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          title="Font Selection"
        >
          <LetterIcon />
        </button>

        {/* Layout Button */}
        <button
          onClick={() => toggleMenu("layout")}
          className={`p-3 rounded-lg transition-all focus:outline-none focus:ring-0 ${
            activeMenu === "layout"
              ? "bg-amber-800 text-white hover:bg-amber-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          title="Layout Selection"
        >
          <GridIcon />
        </button>
      </div>
    </div>
  );
}

export type { DesignState };
export { fontWeightMap };
