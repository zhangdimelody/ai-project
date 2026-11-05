# Liquid Glass Comparison Lab Design

## Goal

新增一个独立对比页 `/lab`，在同一张卡片上并排展示两种 iOS 风格效果：左侧 Canvas 水波纹，右侧交互式液态玻璃（Liquid Glass）。用户可悬停对比两种效果的观感差异，并能通过已有的水波纹 logo 之外的入口进入。

## Architecture

页面在现有 App Router 布局内新增 `app/lab/page.tsx`，主内容区铺一层高饱和多色斜条纹纹理作为背景板，纹理是液态玻璃边缘折射的可见来源。两张等大圆角卡片并排，结构相同、仅效果层不同：

- 左卡片「水波纹」：复用 Canvas 水面引擎，把纹理 + logo 光栅化到 canvas，悬停时在光标处扩散涟漪。
- 右卡片「液态玻璃」：CSS 分层玻璃面板，边缘透镜折射 + 跟随光标的镜面高光。

为让两种效果共享同一份水面实现、且不破坏上一版已上线的 `components/liquid-logo.tsx`，把其内部的水面算法抽为框架无关模块 `src/lib/water-surface.ts`。`liquid-logo.tsx` 改为消费该模块，对外渲染与行为保持不变。

三个新单元，各自单一职责：

- `src/lib/water-surface.ts`：纯函数 + 类型的水面引擎（创建、注入涟漪、推进一帧、采样折射），不含任何 React 或 DOM 查询。
- `components/water-card.tsx`：通用 Canvas 水波纹卡片，接收一张源图（data URL）与可选 logo，负责 canvas 生命周期与指针事件。
- `components/liquid-glass.tsx`：液态玻璃卡片，负责玻璃分层、位移贴图、光标高光与指针事件。

## Data Flow

水波纹卡：

1. 挂载时把卡片内容（条纹纹理 + logo）绘制到离屏 canvas 作为折射源图，按 `devicePixelRatio` 缩放。
2. `pointerenter` / `pointermove`：把光标换算成 canvas 局部坐标，经节流后调用 `water-surface` 注入涟漪，启动 `requestAnimationFrame`。
3. 每帧：`water-surface.step()` 推进高度场并用梯度采样源图，写回可见 canvas；能量低于阈值且指针已离开则停循环、淡出。

液态玻璃卡：

1. 静态分层用 CSS 合成：磨砂底 `backdrop-filter: blur() saturate()`、`feDisplacementMap` 边缘折射、bezel 亮边、tint 覆盖。
2. `pointermove` 只更新 CSS 变量 `--mx` / `--my`（光标归一化坐标）与 `--strength`（悬停时为 1），高光位置与折射偏移由 CSS 读取变量计算。
3. `pointerleave` 把 `--strength` 复位为 0，高光淡出，保持静态材质。

## Water Surface Engine

从现有 `liquid-logo.tsx` 抽出，保持算法不变，暴露纯函数接口：

```ts
export type WaterSurface = {
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
  damping?: number;      // 默认 0.965
  refraction?: number;   // 默认 2.4
  rippleStrength?: number; // 默认 1.6
  dropIntervalMs?: number; // 默认 45
  dropMinDistance?: number; // 默认 5
};

export function createWaterSurface(
  ctx: CanvasRenderingContext2D,
  source: Uint8ClampedArray,
  width: number,
  height: number,
  options?: WaterOptions,
): WaterSurface;

export function dropRipple(surface: WaterSurface, x: number, y: number, now: number, options?: WaterOptions): void;

export function stepWater(surface: WaterSurface, options?: WaterOptions): number; // 返回本帧能量
```

- `stepWater` 内部完成双缓冲交换（`prev` / `curr` 互换）与 `putImageData`。
- 阻尼、折射、涟漪强度、节流参数集中在 `WaterOptions`，默认值与现有组件一致，保证 logo 视觉不变。
- 引擎不持有 `running` / `raf` 状态，帧调度交给调用方组件。

## Liquid Glass Layers

自下而上：

1. 背景透出层：卡片背后的条纹纹理。条纹用 `repeating-linear-gradient` 绘制，页面背景板与卡片内折射层都用 `background-attachment: fixed`，使两处条纹在视口坐标系下自动对齐。
2. 磨砂层：`backdrop-filter: blur(6px) saturate(1.6)` + 轻微半透明白 tint。
3. 折射层：卡片内再画一份与背景对齐的条纹副本（同样 `repeating-linear-gradient` + `background-attachment: fixed`），对其应用 `filter: url(#lg-displace)` 做 `feDisplacementMap` 位移，并按卡片圆角裁剪。这样被位移的是这份副本，视觉上等价于背景在玻璃边缘弯曲。（注意：`filter` 作用于元素自身像素，不能直接折射其背后内容，所以用副本方案而非把滤镜加在外层。）
4. 高光层：跟随 `--mx/--my` 的径向 `radial-gradient` 镜面高光，`opacity` 由 `--strength` 控制，`mix-blend-mode: screen`。
5. Bezel 层：内阴影 + 1px 半透明亮边，圆角连续（`border-radius`），营造边缘厚度。

位移图用本地生成的径向渐变编码 x/y 偏移（中心 128 中性、边缘向内外偏移），`<filter>` 定义在页面内隐藏 SVG 中，`scale` 取小值（约 6）避免过采样溢出。

## Interaction States

| 状态 | 水波纹卡 | 液态玻璃卡 |
| --- | --- | --- |
| 空闲 | 静态纹理卡，canvas 透明 | 静态玻璃材质，高光 opacity 0 |
| 悬停 / 移动 | 光标处持续扩散涟漪 | 高光跟随光标，边缘折射随强度增强 |
| 移出 | 涟漪衰减后淡出回静态 | 高光淡出，材质复位 |

`prefers-reduced-motion: reduce`：水波纹不启动；玻璃不跟随光标（`--strength` 恒为 0），仅保留静态材质。

## Error Handling

- 水波纹卡拿不到 2D context 或源图光栅化失败：静默退化为静态卡片，不抛错。
- 浏览器不支持 `backdrop-filter` 或 SVG 滤镜：玻璃卡退化为半透明 tint 面板，仍可见但无模糊/折射。
- 组件卸载：取消 `requestAnimationFrame`、断开 `ResizeObserver`、置空引擎引用。

## Accessibility

- 卡片标题用语义化文本（"水波纹" / "液态玻璃"），供屏幕阅读器读取。
- canvas 与纯装饰的玻璃层 `aria-hidden="true"`。
- 卡片本身非交互控件，不进入 tab 序列。
- 悬停交互不作为唯一信息通道：标题文字已说明效果名称。

## Entry

在 `components/sidebar.tsx` 的"新建会话"按钮下方加一个轻量入口链接到 `/lab`（lucide 图标 + 文本，带 `aria-label`），复用现有侧边栏视觉。

## Visual Placement

- `/lab` 主区顶部一个简短标题行，其下是并排卡片区域。
- 宽屏：两张卡片左右并排，各占一半宽度，间距适中，等高。
- 窄屏：改为上下堆叠。
- 卡片尺寸用 `min-height` + `aspect-ratio` 稳定，悬停不改变布局；文字与标签不溢出（长标题可换行，容器不撑破）。

## Testing / Verification

- `npx tsc --noEmit`：类型检查通过。
- `npm run build`：Next.js 生产构建通过。
- 浏览器实测（headless Chrome + CDP）：
  - 左卡片悬停时 canvas 出现波纹像素且逐帧变化，移开后衰减、透明度回 0。
  - 右卡片悬停时高光位置跟随光标（CSS 变量变化），移开后 `--strength` 复位。
  - 玻璃卡边缘对条纹背景产生可见折射（对比边缘与中心像素差异）。
  - 窄视口两卡不重叠、文字不溢出。
  - `prefers-reduced-motion: reduce` 下两张卡均不产生动画。
- 回归：`components/liquid-logo.tsx` 在抽出引擎后行为不变（悬停有波纹、移开回清晰）。

## Scope Exclusions

- 不做 WebGL / Metal，不引入第三方动画库。
- 不做多卡片网格、不做效果参数面板/滑块。
- 不改动会话、Agent、聊天等任何现有业务逻辑；对 `liquid-logo.tsx` 的改动仅为抽共享引擎。
- 不做点击涟漪、不做常驻动画。
