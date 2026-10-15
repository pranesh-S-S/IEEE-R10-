"use client";

import { useEffect, useState, useMemo } from "react";
import type { XtremeEvent } from "@/lib/vtools";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { X, Search, Maximize2, ArrowUpRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Status = "loading" | "ready" | "error";

export default function EventsSection() {
  const [events, setEvents] = useState<XtremeEvent[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;

        if (!res.ok) throw new Error(json?.error ?? "Request failed");
        setEvents(json.events ?? []);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Lock body scroll when Full View modal is open
  useEffect(() => {
    if (isFullViewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullViewOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullViewOpen]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    events.forEach((ev) => ev.hashtags.forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 10);
  }, [events]);

  // Filtered events based on search query and selected tag
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        ev.title.toLowerCase().includes(query) ||
        (ev.description && ev.description.toLowerCase().includes(query)) ||
        (ev.section && ev.section.toLowerCase().includes(query)) ||
        (ev.studentBranch && ev.studentBranch.toLowerCase().includes(query)) ||
        ev.hashtags.some((t) => t.toLowerCase().includes(query));

      const matchesTag = !selectedTag || ev.hashtags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [events, searchQuery, selectedTag]);

  return (
    <section id="events" className="border-b border-line/70 py-16 md:py-24 relative">
      {/* 1. Aceternity Container Scroll Animation */}
      <ContainerScroll
        onCardClick={() => setIsFullViewOpen(true)}
        titleComponent={
          <div className="flex flex-col items-center px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-signalDim bg-signalDim/30 px-3.5 py-1 mb-4 font-mono text-xs uppercase tracking-widest text-signal">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Live Feed · IEEE Region 10</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text leading-tight">
              Unleash the Power of <br />
              <span className="text-signal">Scroll & 3D Cards</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-muted text-center">
              Scroll down to watch the 3D tablet rotate into view. Click the tablet image to open the full view and experience all events with interactive 3D perspective hover cards.
            </p>
          </div>
        }
      >
        {/* Tablet Screen Content / Tab Image */}
        <div className="relative h-full w-full overflow-hidden rounded-2xl group/tab cursor-pointer select-none bg-void">
          <img
            src="/linear.webp"
            alt="IEEE Region 10 Events Portal"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover/tab:scale-105"
            draggable={false}
          />

          {/* Dark Glassmorphic Ambient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent transition-opacity group-hover/tab:opacity-85" />

          {/* Top Floating Live Badge */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-full border border-signal/40 bg-void/80 px-3.5 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-text font-medium">
              {events.length > 0 ? `${events.length} Live Events` : "Connecting vTools..."}
            </span>
          </div>

          {/* Hover Callout Card Inside Tablet Screen */}
          <div className="absolute inset-x-4 bottom-4 md:bottom-8 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-line/80 bg-panel/95 p-4 md:p-6 backdrop-blur-xl transition-all duration-300 group-hover/tab:border-signal/70 group-hover/tab:shadow-2xl group-hover/tab:shadow-signal/20">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-signalDim/60 border border-signal/30 px-2.5 py-0.5 font-mono text-[10px] md:text-xs font-semibold text-signal uppercase">
                  Click to Explore
                </span>
                <span className="font-mono text-xs text-muted">
                  IEEE Region 10 vTools
                </span>
              </div>
              <h3 className="mt-1 font-display text-lg md:text-2xl font-bold text-text group-hover/tab:text-signal transition-colors">
                Open Full View · All {events.length} Events
              </h3>
              <p className="text-xs md:text-sm text-muted">
                Inspect every technical workshop, hackathon, and session in full-screen 3D perspective.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullViewOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-xs md:text-sm font-semibold uppercase tracking-wider text-void transition-all duration-200 hover:bg-amber hover:shadow-lg hover:shadow-signal/30 hover:scale-105 shrink-0"
            >
              <Maximize2 className="h-4 w-4" />
              <span>Open Full View</span>
            </button>
          </div>
        </div>
      </ContainerScroll>

      {/* 2. Main Page Events Section Grid */}
      <div className="mx-auto max-w-6xl px-6 -mt-8 md:-mt-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-line/70 pt-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
              All Region 10 Events · {events.length} Available
            </p>
            <h3 className="font-display text-3xl font-bold text-text md:text-4xl mt-1">
              Events Showcase
            </h3>
            <p className="max-w-xl text-muted text-sm md:text-base mt-2">
              Pulled straight from vTools Events and filtered to everything
              tagged <span className="font-mono text-signal">#IEEE</span>. Hover over any card to trigger 3D perspective depth.
            </p>
          </div>

          <button
            onClick={() => setIsFullViewOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-text transition-all hover:border-signal hover:text-signal self-start md:self-auto"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>Launch Full View Modal</span>
          </button>
        </div>

        {status === "loading" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="rounded-2xl border border-line bg-panel px-6 py-16 text-center">
            <p className="font-mono text-sm text-amber">
              Couldn&apos;t load events right now.
            </p>
            <p className="mt-2 text-sm text-muted">
              vTools may be temporarily unavailable — try refreshing in a
              moment.
            </p>
          </div>
        )}

        {status === "ready" && events.length === 0 && (
          <div className="rounded-2xl border border-line bg-panel px-6 py-16 text-center">
            <p className="font-mono text-sm text-muted">
              No events tagged #IEEE right now. Check back soon.
            </p>
          </div>
        )}

        {status === "ready" && events.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* 3. Immersive Full View Modal with 3D Event Cards */}
      <AnimatePresence>
        {isFullViewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col bg-void/95 backdrop-blur-2xl"
          >
            {/* Top Fixed Control Bar */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-void/90 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-bold text-text">
                  R10<span className="text-signal">-Xtreme</span>
                </span>
                <span className="hidden sm:inline-block h-4 w-px bg-line" />
                <span className="hidden sm:inline-block font-mono text-xs uppercase tracking-wider text-muted">
                  Full View · {filteredEvents.length} of {events.length} Events
                </span>
              </div>

              {/* Live Search Bar */}
              <div className="relative max-w-xs sm:max-w-md w-full mx-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search events, branch, section..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-line bg-panel pl-9 pr-4 py-2 font-mono text-xs text-text placeholder:text-muted focus:border-signal focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text font-mono text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsFullViewOpen(false)}
                aria-label="Close Full View"
                className="flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 font-mono text-xs font-semibold text-text transition-colors hover:border-signal hover:text-signal shrink-0"
              >
                <span>Close</span>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Filter Tag Chips */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2 px-6 py-2.5 border-b border-line/60 bg-panel/40 overflow-x-auto shrink-0">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted mr-1">
                  Filter:
                </span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                    selectedTag === null
                      ? "bg-signal text-void font-bold"
                      : "border border-line bg-panel text-muted hover:text-text"
                  }`}
                >
                  All ({events.length})
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors whitespace-nowrap ${
                      selectedTag === tag
                        ? "bg-signal text-void font-bold"
                        : "border border-signalDim bg-signalDim/30 text-signal hover:border-signal/60"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Scrollable Grid of 3D Cards */}
            <div className="flex-1 overflow-y-auto px-6 py-8 md:p-12">
              <div className="mx-auto max-w-7xl">
                {filteredEvents.length === 0 ? (
                  <div className="rounded-2xl border border-line bg-panel px-6 py-20 text-center">
                    <p className="font-mono text-sm text-muted">
                      No events found matching your search.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedTag(null);
                      }}
                      className="mt-4 rounded-full bg-signal px-4 py-2 font-mono text-xs font-semibold text-void hover:bg-amber"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
