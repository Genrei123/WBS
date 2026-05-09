"use client";

import { useState } from "react";
import { DesignStudioToolbar, fontWeightMap } from "./navigation";

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

const defaultDesignState: DesignState = {
  primaryColor: "#000000",
  secondaryColor: "#666666",
  fontColor: "#333333",
  spacing: 24,
  borderRadius: 8,
  fontSize: 16,
  fontWeight: "normal",
  fontFamily: "Arial",
};

export default function WebDesignPage() {
  const [design, setDesign] = useState<DesignState>(defaultDesignState);

  return (
    <div className="min-h-screen flex items-center justify-center transition-all duration-300" style={{ backgroundColor: design.primaryColor }}>
      {/* Design Studio Toolbar */}
      <DesignStudioToolbar design={design} onDesignChange={setDesign} />

      {/* Main Content Area */}
      <div className="p-12 flex items-center justify-center flex-1">
        <div
          className="rounded-xl shadow-2xl w-full flex flex-col gap-8 bg-white"
          style={{
            padding: `${design.spacing}px`,
            borderRadius: `${design.borderRadius}px`,
          }}
        >
          {/* Hero Section */}
          <div className="text-center">
            <h1
              className="font-bold mb-4"
              style={{
                color: design.primaryColor,
                fontSize: `${design.fontSize * 3}px`,
                fontWeight: fontWeightMap[design.fontWeight],
                fontFamily: design.fontFamily,
              }}
            >
              Flexible Design System
            </h1>
            <p
              className="max-w-2xl mx-auto"
              style={{
                color: design.primaryColor,
                fontSize: `${design.fontSize * 1.2}px`,
                fontWeight: fontWeightMap[design.fontWeight],
                lineHeight: `${design.fontSize * 2}px`,
                fontFamily: design.fontFamily,
              }}
            >
              Adjust the controls on the left and watch how everything transforms. Our system is fully adjustable to match your brand identity.
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className="flex flex-col md:flex-row justify-center items-center"
            style={{ gap: `${design.spacing}px` }}
          >
            <button
              className="px-8 py-4 font-semibold text-white transition-all hover:shadow-lg"
              style={{
                backgroundColor: design.primaryColor,
                borderRadius: `${design.borderRadius}px`,
                fontSize: `${design.fontSize}px`,
                fontWeight: fontWeightMap[design.fontWeight],
                fontFamily: design.fontFamily,
              }}
            >
              Get Started
            </button>
            <button
              className="px-8 py-4 font-semibold transition-all hover:shadow-lg border-2"
              style={{
                borderColor: design.primaryColor,
                color: design.primaryColor,
                backgroundColor: 'transparent',
                borderRadius: `${design.borderRadius}px`,
                fontSize: `${design.fontSize}px`,
                fontWeight: fontWeightMap[design.fontWeight],
                fontFamily: design.fontFamily,
              }}
            >
              Learn More
            </button>
          </div>

          {/* Design Features Demo */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            style={{ gap: `${design.spacing}px` }}
          >
            {/* Spacing Demo */}
            <div
              className="text-white flex flex-col items-center justify-center"
              style={{
                backgroundColor: design.primaryColor,
                borderRadius: `${design.borderRadius}px`,
                minHeight: `${design.fontSize * 12}px`,
                padding: `${design.spacing}px`,
              }}
            >
              <p style={{ fontSize: `${design.fontSize * 0.9}px`, fontFamily: design.fontFamily }}>Spacing Control</p>
              <h3 style={{ fontSize: `${design.fontSize * 1.8}px`, marginTop: `${design.spacing / 2}px`, fontWeight: fontWeightMap[design.fontWeight], fontFamily: design.fontFamily }}>
                {design.spacing}px
              </h3>
            </div>

            {/* Border Radius Demo */}
            <div
              className="text-white flex flex-col items-center justify-center"
              style={{
                backgroundColor: design.secondaryColor,
                borderRadius: `${design.borderRadius}px`,
                minHeight: `${design.fontSize * 12}px`,
                padding: `${design.spacing}px`,
              }}
            >
              <p style={{ fontSize: `${design.fontSize * 0.9}px`, fontFamily: design.fontFamily }}>Border Radius</p>
              <h3 style={{ fontSize: `${design.fontSize * 1.8}px`, marginTop: `${design.spacing / 2}px`, fontWeight: fontWeightMap[design.fontWeight], fontFamily: design.fontFamily }}>
                {design.borderRadius}px
              </h3>
            </div>

            {/* Font Size Demo */}
            <div
              className="text-white flex flex-col items-center justify-center"
              style={{
                backgroundColor: design.secondaryColor,
                borderRadius: `${design.borderRadius}px`,
                minHeight: `${design.fontSize * 12}px`,
                padding: `${design.spacing}px`,
              }}
            >
              <p style={{ fontSize: `${design.fontSize * 0.9}px`, fontFamily: design.fontFamily }}>Font Size</p>
              <h3 style={{ fontSize: `${design.fontSize * 2}px`, marginTop: `${design.spacing / 2}px`, fontWeight: fontWeightMap[design.fontWeight], fontFamily: design.fontFamily }}>
                {design.fontSize}px
              </h3>
            </div>

            {/* Font Weight Demo */}
            <div
              className="text-white flex flex-col items-center justify-center"
              style={{
                backgroundColor: design.primaryColor,
                borderRadius: `${design.borderRadius}px`,
                minHeight: `${design.fontSize * 12}px`,
                padding: `${design.spacing}px`,
              }}
            >
              <p style={{ fontSize: `${design.fontSize * 0.9}px` }}>Font Weight</p>
              <h3 style={{ fontSize: `${design.fontSize * 1.8}px`, marginTop: `${design.spacing / 2}px`, fontWeight: fontWeightMap[design.fontWeight] }}>
                {design.fontWeight.toUpperCase()}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
