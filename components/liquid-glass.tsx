"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { logoDataUrl } from "@/src/lib/logo";
import { displacementMapDataUrl } from "@/src/lib/displacement";

export default function LiquidGlass({
  title = "液态玻璃",
}: {
  title?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    setMapUrl(displacementMapDataUrl(256));
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const onEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cardRef.current?.style.setProperty("--strength", "1");
  };

  const onLeave = () => {
    cardRef.current?.style.setProperty("--strength", "0");
  };

  return (
    <section className="lab-card">
      <div className="lab-card-stage">
        <div
          ref={cardRef}
          className="glass-card"
          onPointerMove={onMove}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
        >
          <svg
            className="glass-filter-defs"
            aria-hidden="true"
            width="0"
            height="0"
          >
            <defs>
              <filter
                id="lg-displace"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
                colorInterpolationFilters="sRGB"
              >
                {mapUrl ? (
                  <feImage
                    href={mapUrl}
                    result="map"
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                  />
                ) : null}
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="map"
                  scale="12"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
          </svg>
          <div className="glass-refract" aria-hidden="true" />
          <div className="glass-tint" aria-hidden="true" />
          <div className="glass-highlight" aria-hidden="true" />
          <div className="glass-bezel" aria-hidden="true" />
          <div className="glass-content">
            <img
              src={logoDataUrl()}
              alt=""
              width={216}
              height={40}
              className="glass-logo"
            />
          </div>
        </div>
      </div>
      <h2 className="lab-card-title">{title}</h2>
    </section>
  );
}
