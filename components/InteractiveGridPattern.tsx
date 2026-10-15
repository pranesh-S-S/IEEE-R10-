"use client";

import React, { useState, useId, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface InteractiveGridPatternProps
  extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number];
  className?: string;
  squaresClassName?: string;
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares,
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const patternId = useId();
  const containerRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({
          width: Math.max(rect.width, window.innerWidth || 1200),
          height: Math.max(rect.height, 800),
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Calculate grid count to ensure full coverage across all viewports
  const horizontal = squares
    ? squares[0]
    : Math.ceil((dimensions.width * 1.5) / width) + 12;
  const vertical = squares
    ? squares[1]
    : Math.ceil((dimensions.height * 2) / height) + 12;

  const totalSquares = horizontal * vertical;

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "absolute inset-0 h-full w-full pointer-events-auto select-none",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={-1}
          y={-1}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      <svg x="0" y="0" className="overflow-visible">
        {Array.from({ length: totalSquares }).map((_, index) => {
          const x = (index % horizontal) * width;
          const y = Math.floor(index / horizontal) * height;
          const isHovered = hoveredSquare === index;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={height}
              style={{ pointerEvents: "all" }}
              className={cn(
                "stroke-transparent fill-transparent transition-all duration-500 ease-out cursor-pointer",
                "hover:fill-[#FF6A1F]/35 hover:stroke-[#FF6A1F]/70 hover:duration-0",
                isHovered && "fill-[#FF6A1F]/35 stroke-[#FF6A1F]/70",
                squaresClassName
              )}
              onMouseEnter={() => setHoveredSquare(index)}
              onMouseLeave={() => setHoveredSquare(null)}
            />
          );
        })}
      </svg>
    </svg>
  );
}

export default InteractiveGridPattern;
