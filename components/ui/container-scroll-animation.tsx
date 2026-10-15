"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export const ContainerScroll = ({
  titleComponent,
  children,
  className,
  containerClassName,
  onCardClick,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  onCardClick?: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.75, 0.95] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.85], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.85], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.85], [0, -80]);

  return (
    <div
      className={cn(
        "h-[50rem] md:h-[68rem] flex items-center justify-center relative p-2 md:p-12",
        containerClassName
      )}
      ref={containerRef}
    >
      <div
        className="py-10 md:py-16 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card
          rotate={rotate}
          translate={translate}
          scale={scale}
          className={className}
          onClick={onCardClick}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center mb-6 md:mb-12"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
  className,
  onClick,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003, 0 0 60px rgba(255, 106, 31, 0.15)",
      }}
      onClick={onClick}
      className={cn(
        "max-w-5xl -mt-6 mx-auto h-[26rem] sm:h-[32rem] md:h-[40rem] w-full border-4 border-[#2E2723] p-2 md:p-4 bg-[#161311] rounded-[30px] shadow-2xl transition-all duration-300 relative group/tablet",
        onClick && "cursor-pointer hover:border-signal/60 hover:shadow-signal/25",
        className
      )}
    >
      {/* Tablet top camera notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        <div className="w-2 h-2 rounded-full bg-[#2E2723] border border-line" />
      </div>

      <div className="h-full w-full overflow-hidden rounded-2xl bg-[#0A0908] relative">
        {children}
      </div>
    </motion.div>
  );
};

export default ContainerScroll;
