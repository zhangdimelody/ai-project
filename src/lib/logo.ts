export const LOGO_WIDTH = 216;
export const LOGO_HEIGHT = 40;

/**
 * Logo 的单一来源：显示用的 <img> 与水波纹光栅化源图都由此派生。
 * 图标路径取自 lucide brain-circuit（24x24 viewBox）。
 */
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}" viewBox="0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}" fill="none">
  <g transform="translate(4 6) scale(0.92)" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M9 13a4.5 4.5 0 0 0 3-4"/>
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
    <path d="M6 18a4 4 0 0 1-1.967-.516"/>
    <path d="M12 13h4"/>
    <path d="M12 18h6a2 2 0 0 1 2 2v1"/>
    <path d="M12 8h8"/>
    <path d="M16 8V5a2 2 0 0 1 2-2"/>
    <circle cx="16" cy="13" r=".5"/>
    <circle cx="18" cy="3" r=".5"/>
    <circle cx="20" cy="21" r=".5"/>
    <circle cx="20" cy="8" r=".5"/>
  </g>
  <text x="40" y="27" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="18" font-weight="600" fill="#1a1d23">AI Chat</text>
</svg>`;

export function logoDataUrl(): string {
  return `data:image/svg+xml,${encodeURIComponent(LOGO_SVG)}`;
}
