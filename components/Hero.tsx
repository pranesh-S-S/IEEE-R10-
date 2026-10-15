"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import InteractiveHoverButton from "./InteractiveHoverButton";
import AnimatedGridPattern from "./AnimatedGridPattern";
import KineticText from "./KineticText";
import { cn } from "@/lib/utils";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
      }

      linesRef.current.forEach((line, i) => {
        if (line) {
          tl.fromTo(
            line,
            {
              clipPath: "inset(0 0 100% 0)",
              opacity: 0,
              y: 40,
            },
            {
              clipPath: "inset(0 0 0% 0)",
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "power4.out",
            },
            i === 0 ? "-=0.2" : "-=0.85"
          );
        }
      });

      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        );
      }

      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative overflow-hidden border-b border-line/70 bg-void pt-40 pb-28"
    >
      {/* Animated Grid Pattern Background */}
      <AnimatedGridPattern
        numSquares={45}
        maxOpacity={0.4}
        duration={3}
        repeatDelay={0.6}
        className={cn(
          "[mask-image:radial-gradient(850px_circle_at_center,white,transparent)]",
          "fill-[#FF6A1F]/15 stroke-white/[0.07] text-[#FF6A1F]"
        )}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-signalDim/20 via-transparent to-void" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <p
          ref={badgeRef}
          className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          style={{ willChange: "opacity, transform" }}
        >
          IEEE Region 10 · IEEEXtreme
        </p>

        <div className="mt-6 max-w-4xl space-y-1">
          <KineticText
            ref={(el) => {
              linesRef.current[0] = el as HTMLDivElement | null;
            }}
            text="Where R10 builds, competes,"
            as="div"
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-text md:text-7xl"
            style={{
              willChange: "clip-path, opacity, transform",
            }}
          />
          <KineticText
            ref={(el) => {
              linesRef.current[1] = el as HTMLDivElement | null;
            }}
            text="and ships."
            highlight={{ word: "ships", className: "text-signal" }}
            as="div"
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-text md:text-7xl"
            style={{
              willChange: "clip-path, opacity, transform",
            }}
          />
        </div>

        <p
          ref={descRef}
          className="mt-6 max-w-xl text-lg text-muted"
          style={{ willChange: "opacity, transform" }}
        >
          R10-Xtreme is the home base for IEEEXtreme in Region 10 — every
          workshop, hackathon, and technical session tagged{" "}
          <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-signal">
            #IEEE
          </code>{" "}
          across the Section, in one feed.
        </p>

        <div
          ref={buttonsRef}
          className="mt-10 flex flex-wrap items-center gap-5"
          style={{ willChange: "opacity, transform" }}
        >
          <InteractiveHoverButton href="#events" variant="primary">
            View live events
          </InteractiveHoverButton>
          <InteractiveHoverButton href="#about" variant="secondary">
            What is R10-Xtreme?
          </InteractiveHoverButton>
        </div>
      </div>
    </section>
  );
}
