import InteractiveHoverButton from "./InteractiveHoverButton";
import AnimatedGridPattern from "./AnimatedGridPattern";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden border-b border-line/70 bg-void pt-40 pb-28">
      {/* Animated Grid Pattern */}
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
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
          IEEE Region 10 · IEEEXtreme
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-text md:text-7xl">
          Where R10 builds, competes,
          <br />
          and <span className="text-signal">ships</span>.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          R10-Xtreme is the home base for IEEEXtreme in Region 10 — every
          workshop, hackathon, and technical session tagged{" "}
          <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-signal">#IEEE</code>{" "}
          across the Section, in one feed.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-5">
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
