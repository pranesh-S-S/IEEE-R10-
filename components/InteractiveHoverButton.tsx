"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  variant?: "primary" | "secondary" | "orange";
}

export function InteractiveHoverButton({
  children,
  className,
  href,
  variant = "primary",
  onClick,
  ...props
}: InteractiveHoverButtonProps) {
  const variantStyles = {
    primary: {
      button:
        "bg-[#0A0908] border-[#FF6A1F]/80 text-[#F3EFE9] hover:border-[#FF6A1F] shadow-[0_0_20px_rgba(255,106,31,0.2)]",
      dot: "bg-[#FF6A1F]",
      hoverText: "text-[#0A0908] font-bold",
    },
    secondary: {
      button:
        "bg-[#161311] border-[#2E2723] text-[#F3EFE9] hover:border-[#FF6A1F]/60 shadow-[0_0_15px_rgba(0,0,0,0.5)]",
      dot: "bg-[#FF6A1F]",
      hoverText: "text-[#0A0908] font-bold",
    },
    orange: {
      button:
        "bg-[#FF6A1F] border-[#FF6A1F] text-[#0A0908] font-bold shadow-[0_0_20px_rgba(255,106,31,0.35)]",
      dot: "bg-[#0A0908]",
      hoverText: "text-[#FF6A1F] font-bold",
    },
  };

  const selected = variantStyles[variant] || variantStyles.primary;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (href) {
      if (href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.hash = href;
        }
      } else {
        window.location.href = href;
      }
    }
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border py-3 px-7 text-center font-mono text-sm tracking-wide transition-all duration-300",
        selected.button,
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2.5">
        <div
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-500 ease-out group-hover:scale-[100.8]",
            selected.dot
          )}
        />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div
        className={cn(
          "absolute inset-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100",
          selected.hoverText
        )}
      >
        <span>{children}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </button>
  );
}

export default InteractiveHoverButton;
