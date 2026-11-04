"use client";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { SystemScene } from "./artwork";
import { MotionLink } from "./site-shell";
gsap.registerPlugin(Flip);
export function Profile() {
  const [back, setBack] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  useEffect(
    () => () => {
      animation.current?.kill();
    },
    [],
  );
  function flip(value: boolean) {
    if (value === back) return;
    animation.current?.kill();
    const targets = root.current?.querySelectorAll(
      ".profile-art,.profile-copy,.profile-tech span",
    );
    const state = targets ? Flip.getState(targets) : null;
    flushSync(() => setBack(value));
    if (state && !matchMedia("(prefers-reduced-motion: reduce)").matches)
      animation.current = Flip.from(state, {
        duration: 0.55,
        ease: "power2.inOut",
        absolute: false,
      });
  }
  return (
    <section className="profile-section" id="profile">
      <div className="section-intro">
        <span className="eyebrow">04 / The person in the process</span>
        <h2>
          ONE ENGINEER.
          <br />
          <span className="outline-text">BOTH PERSPECTIVES.</span>
        </h2>
      </div>
      <div
        className="profile-toggle"
        role="group"
        aria-label="Profile perspective"
      >
        <button aria-pressed={!back} onClick={() => flip(false)}>
          The front
        </button>
        <button aria-pressed={back} onClick={() => flip(true)}>
          The back
        </button>
        <span className="mono">↔ A different perspective</span>
      </div>
      <div ref={root} className={`profile-layout ${back ? "is-back" : ""}`}>
        <div className="profile-art">
          <SystemScene dark={back} />
          <div className="profile-stamp">
            <span>WF</span>
            <span className="mono">
              Lagos
              <br />
              Nigeria
            </span>
          </div>
        </div>
        <div className="profile-copy">
          <span className="eyebrow">
            Software engineer / full-stack developer
          </span>
          <h3>
            WAFFIYYI
            <br />
            FASHOLA<span className="accent">.</span>
          </h3>
          <p className={back ? "" : "profile-emphasis"}>
            I build interfaces that make complex things feel straightforward.
            React, Next.js and TypeScript are where I turn the idea into
            something people can use.
          </p>
          <p className={back ? "profile-emphasis" : ""}>
            Behind the interface, I work with Java, Spring Boot and
            PostgreSQL—connecting the experience to the systems that make it
            work.
          </p>
          <div className="profile-tech">
            {(back
              ? ["Java", "Spring Boot", "PostgreSQL", "TypeScript"]
              : ["TypeScript", "React", "Next.js", "Java"]
            ).map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <MotionLink href="/about" className="text-link">
            A little more about me <span>↗</span>
          </MotionLink>
        </div>
      </div>
    </section>
  );
}
