const STRIPE_COLORS = ["#ff5f6d", "#ffc371", "#3ad6a2", "#2f80ed", "#9b5de5"];

/**
 * 把多色斜条纹纹理画到 canvas，作为水波纹卡片的折射源图。
 * stripe 宽度按画布尺寸自适应，保证不同 DPR 下观感一致。
 */
export function drawStripeTexture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  ctx.save();
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, width, height);

  const stripe = Math.max(18, Math.round(Math.min(width, height) / 8));
  ctx.translate(width / 2, height / 2);
  ctx.rotate((-Math.PI * 30) / 180);
  const span = Math.ceil((width + height) / stripe) + 2;
  for (let i = -span; i <= span; i += 1) {
    const idx =
      ((i % STRIPE_COLORS.length) + STRIPE_COLORS.length) % STRIPE_COLORS.length;
    ctx.fillStyle = STRIPE_COLORS[idx];
    ctx.fillRect(i * stripe, -height, stripe, height * 3);
  }
  ctx.restore();
}
