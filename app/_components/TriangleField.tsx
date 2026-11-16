'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

type Point = readonly [number, number];

/** A mesh corner that wanders around its resting place. */
type Vertex = {
  x: number;
  y: number;
  /** Drift radius on each axis, in CSS pixels. */
  rx: number;
  ry: number;
  /** Drift speed on each axis, in radians per second. */
  sx: number;
  sy: number;
  /** Starting phase on each axis. */
  px: number;
  py: number;
};

/** A filled triangle: three indices into the vertex list, plus its flicker. */
type Triangle = {
  corners: readonly [number, number, number];
  /** Peak opacity of this triangle. */
  alpha: number;
  /** Flicker speed in radians per second, and its starting phase. */
  speed: number;
  phase: number;
};

/** Side of the largest triangles, in CSS pixels, before they are subdivided. */
const ROOT_SIDE = 96;
/** How many times a triangle may be split into smaller ones. */
const MAX_DEPTH = 4;
/** Chance that a triangle below the root is split again. */
const SPLIT_CHANCE = 0.62;
/** Chance that a split triangle keeps its middle, instead of leaving a Sierpinski hole. */
const KEEP_MIDDLE_CHANCE = 0.3;
/** Furthest a corner drifts from where it started, in CSS pixels. */
const DRIFT = 8;

/** Timeline of the one-off effect, in milliseconds. */
const FADE_IN = 800;
const HOLD = 2600;
const FADE_OUT = 1600;
const DURATION = FADE_IN + HOLD + FADE_OUT;

const TAU = Math.PI * 2;

const between = (min: number, max: number) => min + Math.random() * (max - min);
const midpoint = (p: Point, q: Point): Point => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const smoothstep = (x: number) => x * x * (3 - 2 * x);

/** Overall strength of the effect at `t` ms: fades in, holds, then fades out. */
function envelope(t: number): number {
  if (t < FADE_IN) return smoothstep(t / FADE_IN);
  if (t < FADE_IN + HOLD) return 1;
  return smoothstep(Math.max(0, 1 - (t - FADE_IN - HOLD) / FADE_OUT));
}

/**
 * Covers a width × height area with a strip of triangles, then splits each
 * one at random, Sierpinski-style, so no two loads look alike. Corners that
 * land on the same spot are shared, so neighbours bend together as they drift.
 */
function buildMesh(width: number, height: number) {
  const vertices: Vertex[] = [];
  const triangles: Triangle[] = [];
  const lookup = new Map<string, number>();

  const vertexAt = ([x, y]: Point): number => {
    const key = `${x.toFixed(1)},${y.toFixed(1)}`;
    let index = lookup.get(key);
    if (index === undefined) {
      index = vertices.length;
      lookup.set(key, index);
      vertices.push({
        x,
        y,
        rx: DRIFT * between(0.3, 1),
        ry: DRIFT * between(0.3, 1),
        sx: between(0.6, 1.8),
        sy: between(0.6, 1.8),
        px: between(0, TAU),
        py: between(0, TAU),
      });
    }
    return index;
  };

  const subdivide = (a: Point, b: Point, c: Point, depth: number) => {
    const split = depth === 0 || (depth < MAX_DEPTH && Math.random() < SPLIT_CHANCE);
    if (!split) {
      triangles.push({
        corners: [vertexAt(a), vertexAt(b), vertexAt(c)],
        alpha: between(0.04, 0.22),
        speed: between(1, 4),
        phase: between(0, TAU),
      });
      return;
    }
    const ab = midpoint(a, b);
    const bc = midpoint(b, c);
    const ca = midpoint(c, a);
    subdivide(a, ab, ca, depth + 1);
    subdivide(ab, b, bc, depth + 1);
    subdivide(ca, bc, c, depth + 1);
    if (Math.random() < KEEP_MIDDLE_CHANCE) subdivide(ab, bc, ca, depth + 1);
  };

  const rowHeight = (ROOT_SIDE * Math.sqrt(3)) / 2;
  const rows = Math.ceil(height / rowHeight) + 1;
  for (let row = 0; row < rows; row++) {
    const top = row * rowHeight - rowHeight / 2;
    const bottom = top + rowHeight;
    const offset = row % 2 === 0 ? 0 : ROOT_SIDE / 2;
    for (let left = offset - ROOT_SIDE; left < width + ROOT_SIDE; left += ROOT_SIDE) {
      // One pointing up and the one pointing down beside it.
      subdivide([left + ROOT_SIDE / 2, top], [left + ROOT_SIDE, bottom], [left, bottom], 0);
      subdivide(
        [left + ROOT_SIDE / 2, top],
        [left + ROOT_SIDE * 1.5, top],
        [left + ROOT_SIDE, bottom],
        0
      );
    }
  }

  return { vertices, triangles };
}

/**
 * A field of faint white triangles that fades in behind its parent, morphs at
 * random for a few seconds, then fades out and stops. It fills the nearest
 * positioned ancestor, is hidden from assistive technology, and never runs
 * for visitors who prefer reduced motion.
 */
export default function TriangleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;

    let mesh = buildMesh(0, 0);
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      mesh = buildMesh(width, height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let frame = 0;
    // The clock starts on the first painted frame, so a page opened in a
    // background tab still shows the whole effect when it is brought forward.
    let start: number | undefined;

    const stop = () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      context.clearRect(0, 0, width, height);
    };

    const draw = (now: number) => {
      start ??= now;
      const elapsed = now - start;
      if (elapsed >= DURATION) {
        stop();
        return;
      }

      const seconds = elapsed / 1000;
      const strength = envelope(elapsed);
      const xs = mesh.vertices.map((v) => v.x + v.rx * Math.sin(seconds * v.sx + v.px));
      const ys = mesh.vertices.map((v) => v.y + v.ry * Math.cos(seconds * v.sy + v.py));

      context.clearRect(0, 0, width, height);
      context.fillStyle = '#fff';
      for (const triangle of mesh.triangles) {
        const flicker = 0.5 + 0.5 * Math.sin(seconds * triangle.speed + triangle.phase);
        context.globalAlpha = strength * triangle.alpha * flicker;
        const [a, b, c] = triangle.corners;
        context.beginPath();
        context.moveTo(xs[a], ys[a]);
        context.lineTo(xs[b], ys[b]);
        context.lineTo(xs[c], ys[c]);
        context.closePath();
        context.fill();
      }

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    // Honour the setting if the visitor turns it on while the effect runs.
    motion.addEventListener('change', stop);
    return () => {
      motion.removeEventListener('change', stop);
      stop();
    };
  }, []);

  return (
    <Box
      component='canvas'
      ref={canvasRef}
      aria-hidden='true'
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        // Strongest behind the message, softer toward the edges.
        maskImage: 'radial-gradient(ellipse at center, #000 35%, transparent 85%)',
        '@media (prefers-reduced-motion: reduce)': { display: 'none' },
      }}
    />
  );
}
