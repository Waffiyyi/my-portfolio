"use client";
import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.current, {
          y: 35,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 94%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
export function HorizontalScene({
  children,
  id,
  title,
  label,
  dark = false,
  count,
}: {
  children: ReactNode;
  id: string;
  title: string;
  label: string;
  dark?: boolean;
  count: number;
}) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Tween | null>(null);
  const [index, setIndex] = useState(0);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (min-height: 650px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const distance = () =>
            Math.max(
              0,
              (track.current?.scrollWidth || 0) -
                (viewport.current?.clientWidth || 0),
            );
          const tween = gsap.to(track.current, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              id,
              trigger: root.current,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.65,
              invalidateOnRefresh: true,
              onUpdate: (s) =>
                setIndex(
                  Math.min(count - 1, Math.round(s.progress * (count - 1))),
                ),
            },
          });
          timeline.current = tween;
          let active = true;
          document.fonts.ready.then(() => {
            if (active) ScrollTrigger.refresh();
          });
          return () => {
            active = false;
            timeline.current = null;
          };
        },
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [count, id] },
  );
  function go(next: number) {
    const target = Math.max(0, Math.min(count - 1, next));
    const st = timeline.current?.scrollTrigger;
    if (st) {
      window.scrollTo({
        top: st.start + ((st.end - st.start) * target) / (count - 1),
        behavior: "instant",
      });
    } else {
      const item = track.current?.children[target] as HTMLElement | undefined;
      if (item && viewport.current)
        viewport.current.scrollTo({
          left: item.offsetLeft - (track.current?.offsetLeft || 0),
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
    }
    setIndex(target);
  }
  return (
    <section
      ref={root}
      id={id}
      className={`horizontal-scene ${dark ? "dark-scene" : ""}`}
      aria-label={title}
    >
      <div className="scene-heading">
        <div>
          <span className="eyebrow">{label}</span>
          <h2>{title}</h2>
        </div>
        <div className="track-controls">
          <span className="mono" aria-live="off">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
          <button
            aria-label={`Previous ${id} item`}
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            ←
          </button>
          <button
            aria-label={`Next ${id} item`}
            disabled={index === count - 1}
            onClick={() => go(index + 1)}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={viewport}
        className="track-viewport"
        tabIndex={0}
        aria-label={`${title}. Use arrow keys or swipe to explore.`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            go(index + (e.key === "ArrowRight" ? 1 : -1));
          }
        }}
        onScroll={() => {
          if (!timeline.current && viewport.current && track.current) {
            const step =
              (track.current.children[1] as HTMLElement)?.offsetLeft -
              (track.current.children[0] as HTMLElement)?.offsetLeft;
            if (step)
              setIndex(
                Math.min(
                  count - 1,
                  Math.round(viewport.current.scrollLeft / step),
                ),
              );
          }
        }}
      >
        <div
          ref={track}
          className="horizontal-track"
          onFocusCapture={(e) => {
            if (!timeline.current) return;
            const card = (e.target as HTMLElement).closest("[data-track-item]");
            if (card) {
              const i = Array.from(track.current?.children || []).indexOf(card);
              if (i >= 0) go(i);
            }
          }}
        >
          {children}
        </div>
      </div>
      <div className="track-bottom">
        <span className="eyebrow">
          {dark
            ? "Interfaces → APIs → Data → Delivery"
            : "Selected projects / scroll to explore"}
        </span>
        <div className="track-progress">
          <span style={{ transform: `scaleX(${(index + 1) / count})` }} />
        </div>
      </div>
    </section>
  );
}
