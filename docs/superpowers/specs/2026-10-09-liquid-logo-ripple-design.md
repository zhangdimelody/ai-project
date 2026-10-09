# Liquid Logo Ripple Design

## Goal

在侧边栏顶部放一个「AI Chat」logo（BrainCircuit 图标 + 字标），悬停时 logo 表面产生跟随光标位置的 iOS 风格水波纹：光标处扩散出真实的像素位移涟漪，移开后自然衰减，恢复为清晰 logo。

灵感来自 iOS 26 的交互涟漪 / Liquid Glass 反馈。目标是网页实现，跨浏览器稳定、零运行时依赖。

## Architecture

两层结构叠放在侧边栏顶部：

- 底层是清晰的静态 logo `<img>`，用于常规显示、无障碍 alt 文本和波纹散尽后的最终状态。
- 上层是 `<canvas>`，仅在交互期间可见，绘制经水面折射后的 logo 像素。

两者尺寸完全一致并绝对定位重合，`pointer-events` 只作用在最外层容器上。

三个单元，各自单一职责：

- `src/lib/logo.ts`：导出 logo 的 SVG 标记字符串（唯一数据源）。显示用的 `data:` URL 与 canvas 光栅化源图都由它派生，避免图标/字标定义重复。
- `components/liquid-logo.tsx`（client component）：水波纹引擎与像素渲染，封装 canvas 初始化、涟漪注入、逐帧循环、DPR/尺寸跟随。
- `components/sidebar.tsx`：在「新建会话」按钮上方插入该 logo，不改动现有会话列表逻辑。

## Data Flow

1. 挂载时读 `logo.ts` 的 SVG，转成 `data:image/svg+xml` URL 赋给 `<img>`，同时用 `new Image()` 加载同一 data URL 并光栅化到离屏 canvas 作为折射源图（按 `devicePixelRatio` 缩放）。
2. `pointerenter` / `pointermove` 命中 logo：把 `clientX/clientY` 换算成 canvas 局部坐标，按最小间距和时间节流注入一个涟漪脉冲，并启动 `requestAnimationFrame` 循环。
3. 每帧：推进水面高度缓冲 → 由高度梯度算折射偏移 → 带偏移采样源图绘制到可见 canvas → 涟漪衰减，能量低于阈值则停止循环。
4. `pointerleave`：停止注入新涟漪，让已有涟漪自然衰减；散尽后交叉淡出回清晰的 `<img>`。

## Ripple Algorithm

经典双缓冲水面（two-buffer water surface）：

- 两份浮点高度缓冲 `prev` / `curr`，每帧用离散拉普拉斯算子传播波动，乘阻尼系数衰减。
- 由高度场的梯度算出每个像素的折射位移量，放大后作为采样偏移。
- 用偏移坐标从源图 canvas 采样像素，写入可见 canvas。每一帧通过 `ImageData` 逐像素写回，然后一次 `putImageData` 提交（不逐像素 `drawImage`）。
- 注入涟漪：在光标对应格点写入小半径、正负对称的脉冲，形成向外扩散的同心波。

logo 尺寸小（约 216×40 逻辑像素），逐帧计算量可忽略，无需 WebGL。

## Interaction States

| 状态 | 表现 |
| --- | --- |
| 空闲 | 只显示清晰 `<img>`，canvas 隐藏或透明 |
| 悬停 / 移动 | canvas 可见，光标处持续产生向外扩散的涟漪 |
| 移出 | 不再注入，已有涟漪衰减，波纹散尽后淡出回 `<img>` |
| 降级（无 2D context / `prefers-reduced-motion`） | 只显示静态 `<img>`，不启动任何动画 |

## Error Handling

- 拿不到 canvas 2D context：静默降级为静态 `<img>`，不抛错、不影响侧边栏其它功能。
- SVG 光栅化失败（`new Image()` 触发 error）：保持静态 `<img>`，标记引擎不可用。
- 组件卸载：取消 `requestAnimationFrame`、断开关联的 `ResizeObserver`、置空缓冲引用，避免泄漏。

## Accessibility

- `<img>` 带 `alt="AI Chat"`；`canvas` 设 `aria-hidden="true"`。
- 检测 `prefers-reduced-motion: reduce`：命中时完全不启动波纹，直接保持静态 logo。
- 键盘可达性不受影响：logo 非交互控件（纯装饰/品牌），不进入 tab 序列。

## Visual Placement

- 位置：`components/sidebar.tsx` 顶部，`「新建会话」`按钮之上。
- 尺寸：logo 高度约 40px，宽度随文档流（侧边栏内容宽约 216px），水平留有轻微内边距，与按钮左对齐。
- 图标用 lucide 的 `BrainCircuit`，颜色取主题 `--accent`；字标 `AI Chat` 取 `--foreground`。
- 容器固定高度，波纹绘制不改变布局，避免悬停引起位移。

## Testing / Verification

- `npx tsc --noEmit`：类型检查通过。
- `npm run build`：Next.js 生产构建通过。
- 手动验证：
  - 悬停 logo，波纹跟随光标位置向外扩散。
  - 移开光标，波纹衰减后回到清晰状态，文字不残留模糊。
  - 缩放窗口 / 改设备像素比，canvas 与 `<img>` 始终对齐且清晰。
  - 开启系统「减弱动态效果」后，悬停不再产生波纹。
  - 侧边栏整体布局无位移，会话列表功能不受影响。

## Scope Exclusions

- 不做点击触发的涟漪、不做常驻自动波动。
- 不做多涟漪物理碰撞、粒子或音频。
- 不引入 WebGL / Metal / 第三方动画库。
- 不改动会话与 Agent 相关的任何现有逻辑。
