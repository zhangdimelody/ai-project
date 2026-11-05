export type WaterSurface = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  source: Uint8ClampedArray;
  prev: Float32Array;
  curr: Float32Array;
  output: ImageData;
  lastX: number;
  lastY: number;
  lastDropTime: number;
};

export type WaterOptions = {
  damping?: number;
  refraction?: number;
  rippleStrength?: number;
  dropIntervalMs?: number;
  dropMinDistance?: number;
};

const DEFAULT_OPTIONS: Required<WaterOptions> = {
  damping: 0.965,
  refraction: 2.4,
  rippleStrength: 1.6,
  dropIntervalMs: 45,
  dropMinDistance: 5,
};

function resolve(options?: WaterOptions): Required<WaterOptions> {
  return { ...DEFAULT_OPTIONS, ...options };
}

export function createWaterSurface(
  ctx: CanvasRenderingContext2D,
  source: Uint8ClampedArray,
  width: number,
  height: number,
  _options?: WaterOptions,
): WaterSurface {
  return {
    ctx,
    width,
    height,
    source,
    prev: new Float32Array(width * height),
    curr: new Float32Array(width * height),
    output: ctx.createImageData(width, height),
    lastX: -100,
    lastY: -100,
    lastDropTime: 0,
  };
}

export function dropRipple(
  surface: WaterSurface,
  x: number,
  y: number,
  now: number,
  options?: WaterOptions,
): void {
  const opts = resolve(options);
  const moved = Math.hypot(x - surface.lastX, y - surface.lastY);
  if (
    now - surface.lastDropTime < opts.dropIntervalMs &&
    moved < opts.dropMinDistance
  ) {
    return;
  }
  surface.lastDropTime = now;
  surface.lastX = x;
  surface.lastY = y;

  const w = surface.width;
  const h = surface.height;
  const cx = Math.max(2, Math.min(w - 3, Math.round(x)));
  const cy = Math.max(2, Math.min(h - 3, Math.round(y)));
  for (let oy = -2; oy <= 2; oy += 1) {
    for (let ox = -2; ox <= 2; ox += 1) {
      const i = (cy + oy) * w + (cx + ox);
      if (i < 0 || i >= surface.curr.length) continue;
      const falloff = 1 - (Math.abs(ox) + Math.abs(oy)) / 4;
      if (falloff <= 0) continue;
      surface.curr[i] = opts.rippleStrength * falloff;
      surface.prev[i] = opts.rippleStrength * falloff;
    }
  }
}

export function stepWater(surface: WaterSurface, options?: WaterOptions): number {
  const opts = resolve(options);
  const w = surface.width;
  const h = surface.height;
  const prev = surface.prev;
  const curr = surface.curr;
  const source = surface.source;
  const data = surface.output.data;
  let energy = 0;

  for (let y = 1; y < h - 1; y += 1) {
    const row = y * w;
    for (let x = 1; x < w - 1; x += 1) {
      const i = row + x;
      let v =
        (prev[i - 1] + prev[i + 1] + prev[i - w] + prev[i + w]) / 2 - curr[i];
      v *= opts.damping;
      curr[i] = v;
      const mag = Math.abs(v);
      if (mag > energy) energy = mag;

      const dx = curr[i - 1] - curr[i + 1];
      const dy = curr[i - w] - curr[i + w];
      let sx = x + Math.round(dx * opts.refraction);
      let sy = y + Math.round(dy * opts.refraction);
      if (sx < 0) sx = 0;
      else if (sx >= w) sx = w - 1;
      if (sy < 0) sy = 0;
      else if (sy >= h) sy = h - 1;

      const si = (sy * w + sx) * 4;
      const di = i * 4;
      data[di] = source[si];
      data[di + 1] = source[si + 1];
      data[di + 2] = source[si + 2];
      data[di + 3] = source[si + 3];
    }
  }

  surface.ctx.putImageData(surface.output, 0, 0);
  surface.prev = curr;
  surface.curr = prev;
  return energy;
}
