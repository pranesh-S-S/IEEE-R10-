import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

type As = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export type KineticTextProps = React.HTMLAttributes<HTMLElement> & {
  text: string;
  as?: As;
  highlight?: {
    word: string;
    className: string;
  };
};

export const KineticText = forwardRef<HTMLElement, KineticTextProps>(
  function KineticText(
    {
      text,
      as: Tag = "h1",
      className = "",
      style,
      highlight,
      ...rest
    },
    ref
  ) {
    const mergedStyle = {
      "--hover-padding": "calc(1em / 24)",
      "--text-stroke-width": "calc(1em * 125 / 6000)",
      ...(style as React.CSSProperties | undefined),
    } as React.CSSProperties;

    const words = text.split(" ");
    let currentGlobalIndex = 0;

    const highlightIndices = new Set<number>();
    if (highlight?.word) {
      const start = text.indexOf(highlight.word);
      if (start !== -1) {
        for (let i = start; i < start + highlight.word.length; i++) {
          highlightIndices.add(i);
        }
      }
    }

    return (
      <Tag
        ref={ref as any}
        {...rest}
        className={cn("flex flex-wrap items-baseline font-inherit", className)}
        style={mergedStyle}
      >
        {words.map((word, wordIdx) => {
          const wordLetters = word.split("").map((letter, letterIdx) => {
            const letterGlobalIndex = currentGlobalIndex;
            currentGlobalIndex++;
            const isHighlighted = highlightIndices.has(letterGlobalIndex);

            return (
              <span
                key={letterIdx}
                aria-hidden="true"
                className={cn(
                  "inline-block font-inherit [will-change:font-weight,-webkit-text-stroke-width,padding] [-webkit-text-stroke-color:transparent] [-webkit-text-stroke-width:var(--text-stroke-width)] [transition:font-weight_0.35s,_-webkit-text-stroke-color_0.35s,_padding_0.35s] hover:[padding-inline:var(--hover-padding)] hover:font-[900] hover:[-webkit-text-stroke-color:currentcolor] hover:[-webkit-text-stroke-width:calc(var(--text-stroke-width)*2)] has-[+span+span:hover]:font-[700] has-[+span:hover]:[padding-inline:var(--hover-padding)] has-[+span:hover]:font-[800] [:hover+&]:[padding-inline:var(--hover-padding)] [:hover+&]:font-[800] [:hover+span+&]:font-[700] cursor-default",
                  isHighlighted && (highlight?.className || "text-signal")
                )}
              >
                {letter}
              </span>
            );
          });

          // Account for the space separator in index calculation
          currentGlobalIndex++;

          return (
            <span key={wordIdx} className="inline-flex whitespace-nowrap">
              {wordLetters}
              {wordIdx < words.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          );
        })}
        <span className="sr-only">{text}</span>
      </Tag>
    );
  }
);

KineticText.displayName = "KineticText";

export default KineticText;
