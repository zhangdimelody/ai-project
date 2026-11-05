import WaterCard from "@/components/water-card";
import LiquidGlass from "@/components/liquid-glass";
import "./lab.css";

export default function LabPage() {
  return (
    <div className="lab-page">
      <header className="lab-header">
        <h1>效果对比</h1>
        <p>把鼠标移到两张卡片上，对比水波纹与液态玻璃的观感。</p>
      </header>
      <div className="lab-grid">
        <WaterCard title="水波纹" />
        <LiquidGlass title="液态玻璃" />
      </div>
    </div>
  );
}
