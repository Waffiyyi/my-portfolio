"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const enabledQuery =
  "(min-width: 861px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const controls =
  'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [role="button"], [data-cursor-label]';

/** Decorative pointer companion; native pointing, selection and focus stay intact. */
export function CursorEffect({
  container,
}: {
  container?: HTMLElement | null;
}) {
  const root = useRef<HTMLDivElement>(null);
  const refresh = useRef<() => void>(() => {});
  const pathname = usePathname();

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const dot = element.querySelector<HTMLElement>(".pointer-dot")!;
    const ring = element.querySelector<HTMLElement>(".pointer-ring")!;
    const label = element.querySelector<HTMLElement>(".pointer-label")!;
    const media = matchMedia(enabledQuery);
    let dispose = () => {};

    const configure = () => {
      dispose();
      if (!media.matches) return;

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: 0, y: 0 });

      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
      const followTweens = [dotX.tween, dotY.tween, ringX.tween, ringY.tween];
      let visible = false;
      let x = 0;
      let y = 0;
      let frame = 0;
      let previousState = "";

      const updateTarget = () => {
        // Look through transparent overlays, such as the split homepage heading.
        const surfaces = document.elementsFromPoint(x, y);
        const target = surfaces[0];
        let night = false;
        for (const surface of surfaces) {
          const color = getComputedStyle(surface).backgroundColor;
          const channels = color.match(/[\d.]+/g)?.map(Number);
          if (!channels || (channels.length === 4 && channels[3] < 0.8))
            continue;
          night =
            channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722 <
            128;
          break;
        }
        const control = target?.closest<HTMLElement>(controls);
        const text = control?.dataset.cursorLabel || "";
        const mode = text ? "view" : control ? "hover" : "idle";
        const state = `${night}:${mode}:${text}`;
        if (state === previousState) return;
        previousState = state;
        element.dataset.tone = night ? "light" : "dark";
        element.dataset.mode = mode;
        label.textContent = text;
        gsap.to(ring, {
          scale: text ? 1.15 : control ? 1 : 0.6,
          backgroundColor: text ? "#ea1d0f" : "rgba(0,0,0,0)",
          borderColor: text
            ? "#ea1d0f"
            : night
              ? "rgba(244,241,234,0.45)"
              : "rgba(22,19,15,0.35)",
          duration: 0.4,
          overwrite: "auto",
        });
        gsap.to(dot, {
          scale: text ? 0 : control ? 0.6 : 1,
          duration: 0.3,
          overwrite: "auto",
        });
        gsap.to(label, {
          opacity: text ? 1 : 0,
          duration: text ? 0.25 : 0.2,
          overwrite: "auto",
        });
      };

      const hide = () => {
        visible = false;
        cancelAnimationFrame(frame);
        frame = 0;
        element.dataset.visible = "false";
        // quickTo reuses these tweens. Killing them mid-flight destroys the
        // property tracks needed by later pointer moves, freezing the cursor.
        followTweens.forEach((tween) => tween.pause());
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") {
          hide();
          return;
        }
        x = event.clientX;
        y = event.clientY;
        if (!visible) {
          // Reset each reusable tween's start as well as its destination so
          // re-entry cannot animate from the pointer's previous exit position.
          dotX(x, x);
          dotY(y, y);
          ringX(x, x);
          ringY(y, y);
          visible = true;
          previousState = "";
          element.dataset.visible = "true";
        } else {
          dotX(x);
          dotY(y);
          ringX(x);
          ringY(y);
        }
        refreshTarget();
      };
      const refreshTarget = () => {
        if (!visible || frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          updateTarget();
        });
      };
      const leave = (event: PointerEvent) => {
        if (!event.relatedTarget) hide();
      };
      const visibility = () => {
        if (document.hidden) hide();
      };
      refresh.current = refreshTarget;
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerout", leave);
      window.addEventListener("blur", hide);
      window.addEventListener("resize", refreshTarget);
      document.addEventListener("scroll", refreshTarget, {
        passive: true,
        capture: true,
      });
      document.addEventListener("visibilitychange", visibility);
      dispose = () => {
        hide();
        followTweens.forEach((tween) => tween.kill());
        gsap.killTweensOf([dot, ring, label]);
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerout", leave);
        window.removeEventListener("blur", hide);
        window.removeEventListener("resize", refreshTarget);
        document.removeEventListener("scroll", refreshTarget, true);
        document.removeEventListener("visibilitychange", visibility);
        refresh.current = () => {};
      };
    };
    configure();
    media.addEventListener("change", configure);
    return () => {
      dispose();
      media.removeEventListener("change", configure);
    };
  }, [container]);

  useEffect(() => {
    refresh.current();
  }, [pathname]);

  const cursor = (
    <div
      ref={root}
      className="pointer-effect"
      aria-hidden="true"
      data-visible="false"
    >
      <span className="pointer-dot" />
      <span className="pointer-ring">
        <span className="pointer-label" />
      </span>
    </div>
  );
  return container ? createPortal(cursor, container) : cursor;
}
