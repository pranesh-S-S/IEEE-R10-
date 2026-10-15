"use client";

import React from "react";
import type { XtremeEvent } from "@/lib/vtools";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventCard({ event }: { event: XtremeEvent }) {
  const date = formatDate(event.startTime);

  return (
    <CardContainer className="w-full h-full" containerClassName="w-full h-full py-0">
      <CardBody className="relative group/card flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-panel p-5 transition-all duration-300 hover:border-signal/60 hover:shadow-2xl hover:shadow-signal/[0.12] w-full h-full">
        <div>
          {/* 3D Floating Thumbnail */}
          <CardItem translateZ="100" className="w-full">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-line">
              {event.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.photo}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted">
                  No photo provided
                </div>
              )}
              {date && (
                <span className="absolute left-3 top-3 rounded-full bg-void/85 px-3 py-1 font-mono text-xs text-signal">
                  {date}
                </span>
              )}
            </div>
          </CardItem>

          {/* 3D Floating Title */}
          <CardItem
            as="h3"
            translateZ="50"
            className="mt-4 font-display text-lg font-bold leading-snug text-text transition-colors duration-200 group-hover/card:text-signal"
          >
            {event.title}
          </CardItem>

          {/* 3D Floating Description */}
          {event.description && (
            <CardItem
              as="p"
              translateZ="60"
              className="mt-2 line-clamp-3 text-sm text-muted"
            >
              {event.description}
            </CardItem>
          )}

          {/* 3D Floating Section and Branch Metadata */}
          <CardItem
            translateZ="30"
            className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wide text-muted"
          >
            {event.section && <span>Section: {event.section}</span>}
            {event.studentBranch && <span>Branch: {event.studentBranch}</span>}
          </CardItem>

          {/* 3D Floating Hashtags */}
          {event.hashtags.length > 0 && (
            <CardItem translateZ="40" className="mt-3 flex flex-wrap gap-2">
              {event.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-signalDim bg-signalDim/30 px-2.5 py-1 font-mono text-[11px] text-signal"
                >
                  {tag}
                </span>
              ))}
            </CardItem>
          )}
        </div>

        {/* 3D Floating Action Button */}
        <div className="mt-6 pt-2">
          {event.registerUrl ? (
            <CardItem
              translateZ={20}
              as="a"
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full rounded-full bg-signal py-2.5 text-center font-mono text-sm font-semibold text-void transition-all duration-200 hover:bg-amber hover:shadow-lg hover:shadow-signal/25"
            >
              Register now →
            </CardItem>
          ) : (
            <CardItem
              translateZ={20}
              as="span"
              className="inline-block w-full rounded-full border border-line py-2.5 text-center font-mono text-sm text-muted"
            >
              Registration link unavailable
            </CardItem>
          )}
        </div>
      </CardBody>
    </CardContainer>
  );
}
