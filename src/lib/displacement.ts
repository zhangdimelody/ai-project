/**
 * 生成液态玻璃的边缘透镜位移贴图。
 * R 通道 -> x 偏移，G 通道 -> y 偏移，128 为中性（不偏移）。
 * 位移强度在半径约 0.82 处出现峰值（模拟玻璃边缘的折射环）。
 */
export function displacementMapDataUrl(size = 256): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const img = ctx.createImageData(size, size);
  const c = (size - 1) / 2;
  const max = c;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x - c) / max;
      const ny = (y - c) / max;
      const d = Math.hypot(nx, ny) || 1e-6;
      const edge = Math.max(0, 1 - Math.abs(d - 0.82) / 0.3);
      const vx = (nx / d) * edge;
      const vy = (ny / d) * edge;
      const i = (y * size + x) * 4;
      img.data[i] = Math.round(128 + vx * 127);
      img.data[i + 1] = Math.round(128 + vy * 127);
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}
