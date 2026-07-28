import type { MotionValue } from "motion/react";
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useIsDark } from "@/hooks/useIsDark";
import { cn } from "@/lib/utils";

export type BlobOrigin = {
  /** Horizontal rest position, as a percentage of the container width. */
  x: number;
  /** Vertical rest position, as a percentage of the container height. */
  y: number;
};

export type BlobMargin = number | { top?: number; right?: number; bottom?: number; left?: number };

export type FluidBlobsProps = {
  /** Blob colors. Wins over lightColors/darkColors when set. */
  colors?: string[];
  lightColors?: string[];
  darkColors?: string[];
  /** Per-blob diameter in px at scale 1 (a 224px-tall container). */
  sizes?: number | number[];
  /** Gaussian blur in px at scale 1. */
  blur?: number;
  /** Rest position per blob. Defaults to the container center. */
  origins?: BlobOrigin[];
  /** Slop around the container within which the cursor still attracts the blobs. */
  margin?: BlobMargin;
  className?: string;
};

const DEFAULT_LIGHT = ["#ffb3c6", "#e8b4f0", "#ffd6a5", "#ffc8dd"];
const DEFAULT_DARK = ["#ff6b8a", "#c084f5", "#d44d8a", "#ff96a9"];

// Seven hand-tuned personalities, cycled over the color list so no two adjacent
// blobs drift, spring or pulse in lockstep.
const SIZES = [240, 200, 220, 170, 210, 190, 230];
const STIFFNESS = [75, 38, 20, 55, 45, 30, 60];
const DAMPING = [22, 16, 11, 19, 14, 12, 20];
const DRIFT_FREQ = [800, 1000, 1600, 520, 1100, 700, 1300];
const DRIFT_AMP = [28, 32, 22, 36, 25, 30, 20];
const DRIFT_PHASE = [0, 2.1, 4.5, 1.8, 3.3, 5.2, 0.9];
const PULSE_DURATION = [3.2, 4.1, 3.7, 4.8, 3.5, 4.4, 3.9];
const PULSE_DELAY = [0, 0.6, 1.1, 1.8, 0.3, 1.4, 0.9];

/** The container height the tuning constants above were authored against. */
const REFERENCE_HEIGHT = 224;

type BlobConfig = {
  size: number;
  spring: { stiffness: number; damping: number };
  driftX: { freq: number; amp: number; phase: number };
  driftY: { freq: number; amp: number; phase: number };
  pulse: { duration: number; delay: number };
};

function blobConfig(index: number, size?: number): BlobConfig {
  const i = index % 7;

  return {
    size: size ?? SIZES[i]!,
    spring: { stiffness: STIFFNESS[i]!, damping: DAMPING[i]! },
    driftX: { freq: DRIFT_FREQ[i]!, amp: DRIFT_AMP[i]!, phase: DRIFT_PHASE[i]! },
    driftY: {
      freq: DRIFT_FREQ[(i + 3) % 7]!,
      amp: DRIFT_AMP[(i + 2) % 7]!,
      phase: DRIFT_PHASE[(i + 4) % 7]!,
    },
    pulse: { duration: PULSE_DURATION[i]!, delay: PULSE_DELAY[i]! },
  };
}

function resolveMargin(margin: BlobMargin) {
  if (typeof margin === "number") {
    return { top: margin, right: margin, bottom: margin, left: margin };
  }

  return {
    top: margin.top ?? 0,
    right: margin.right ?? 0,
    bottom: margin.bottom ?? 0,
    left: margin.left ?? 0,
  };
}

/**
 * Soft blurred blobs that spring toward the cursor while it is over (or near)
 * the container, and settle back to their origins when it leaves. Each blob
 * also drifts on its own sine/cosine loop so the field is never fully at rest.
 */
export function FluidBlobs({
  colors,
  lightColors = DEFAULT_LIGHT,
  darkColors = DEFAULT_DARK,
  sizes,
  blur = 55,
  origins,
  margin = 0,
  className,
}: FluidBlobsProps) {
  const isDark = useIsDark();
  const containerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 384, h: REFERENCE_HEIGHT });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setBox({ w: element.offsetWidth, h: element.offsetHeight });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const mouseX = useMotionValue(box.w / 2);
  const mouseY = useMotionValue(box.h / 2);
  const isInsideRef = useRef(false);

  // Tracked on window rather than the element itself: the container is
  // pointer-events-none, and `margin` lets the cursor pull the blobs from
  // outside the bounds so they lean toward it before it arrives.
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const element = containerRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const slop = resolveMargin(margin);

      const isInside =
        event.clientX >= rect.left - slop.left &&
        event.clientX <= rect.right + slop.right &&
        event.clientY >= rect.top - slop.top &&
        event.clientY <= rect.bottom + slop.bottom;

      isInsideRef.current = isInside;

      if (isInside) {
        mouseX.set(event.clientX - rect.left);
        mouseY.set(event.clientY - rect.top);
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [mouseX, mouseY, margin]);

  const time = useMotionValue(0);
  useAnimationFrame((t) => time.set(t));

  const palette = colors ?? (isDark ? darkColors : lightColors);
  // Keep the blobs proportional: the same component backs a full blog header
  // and a 128px list thumbnail.
  const scale = Math.min(2, Math.max(0.4, box.h / REFERENCE_HEIGHT));

  return (
    <div ref={containerRef} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {palette.map((color, index) => {
        const size = Array.isArray(sizes) ? sizes[index] : sizes;

        return (
          <Blob
            key={index}
            color={color}
            config={blobConfig(index, size)}
            mouseX={mouseX}
            mouseY={mouseY}
            isInsideRef={isInsideRef}
            time={time}
            blur={blur}
            scale={scale}
            origin={origins?.[index]}
            containerW={box.w}
            containerH={box.h}
          />
        );
      })}
    </div>
  );
}

type BlobProps = {
  color: string;
  config: BlobConfig;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isInsideRef: React.RefObject<boolean>;
  time: MotionValue<number>;
  blur: number;
  scale: number;
  origin?: BlobOrigin;
  containerW: number;
  containerH: number;
};

function Blob({
  color,
  config,
  mouseX,
  mouseY,
  isInsideRef,
  time,
  blur,
  scale,
  origin,
  containerW,
  containerH,
}: BlobProps) {
  const { spring, driftX, driftY, pulse } = config;

  const size = config.size * scale;
  const originX = origin ? (origin.x / 100) * containerW : containerW / 2;
  const originY = origin ? (origin.y / 100) * containerH : containerH / 2;

  const targetX = useMotionValue(originX);
  const targetY = useMotionValue(originY);

  useAnimationFrame(() => {
    if (isInsideRef.current) {
      targetX.set(mouseX.get());
      targetY.set(mouseY.get());
    } else {
      targetX.set(originX);
      targetY.set(originY);
    }
  });

  const springX = useSpring(targetX, spring);
  const springY = useSpring(targetY, spring);

  const left = useTransform([springX, time], ([x, t]: number[]) => {
    return x! + Math.sin(t! / driftX.freq + driftX.phase) * driftX.amp * scale - size / 2;
  });
  const top = useTransform([springY, time], ([y, t]: number[]) => {
    return y! + Math.cos(t! / driftY.freq + driftY.phase) * driftY.amp * scale - size / 2;
  });

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left,
        top,
        background: color,
        filter: `blur(${Math.max(16, blur * scale)}px)`,
        willChange: "transform",
      }}
      animate={{
        scale: [1, 1.18, 0.88, 1.12, 0.95, 1],
        opacity: [0.72, 0.92, 0.68, 0.88, 0.78, 0.72],
      }}
      transition={{
        duration: pulse.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: pulse.delay,
      }}
    />
  );
}
