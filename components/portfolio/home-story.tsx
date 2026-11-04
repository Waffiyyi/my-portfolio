"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredProjects } from "@/data/projects";
import { HorizontalScene, Reveal } from "./motion";
import { ProjectCard } from "./project-card";
import { SystemScene } from "./artwork";
import { Profile } from "./profile";
import { MissionBoard } from "./mission-board";
import { MotionLink } from "./site-shell";
gsap.registerPlugin(useGSAP, ScrollTrigger);
const engineering = [
  {
    title: "THE INTERFACE",
    subtitle: "Make it feel natural.",
    stack: "React / Next.js / TypeScript",
    text: "Responsive interfaces, reusable components and a clear path through complex information.",
    link: "/work/loveflower-wellness",
    label: "LoveFlower Wellness",
    symbol: "Aa",
    number: "01",
  },
  {
    title: "THE CONNECTION",
    subtitle: "Give each boundary a purpose.",
    stack: "Java / Spring Boot / REST",
    text: "Services, integrations and explicit data contracts that connect what people do to what the product needs.",
    link: "/work/corpers-transolution",
    label: "Corpers Transolution",
    symbol: "{ }",
    number: "02",
  },
  {
    title: "THE FOUNDATION",
    subtitle: "Keep the state in order.",
    stack: "PostgreSQL / Redis / Prisma",
    text: "Data models, seat inventory and payment lifecycles. The details that matter when a workflow gets real.",
    link: "/work/corpers-transolution",
    label: "Corpers Transolution",
    symbol: "≡",
    number: "03",
  },
  {
    title: "THE DELIVERY",
    subtitle: "Think beyond the first commit.",
    stack: "AWS / Docker / CI/CD",
    text: "Deployment pipelines and infrastructure experience from backend engineering work at Seamless.",
    link: "/about#experience",
    label: "Experience & practice",
    symbol: "↗",
    number: "04",
  },
];
export function HomeStory() {
  const hero = useRef<HTMLElement>(null);
  const close = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", (mediaContext) => {
        // The delayed call belongs to this media context. Re-entering the
        // parent useGSAP context here would create a circular cleanup graph.
        const enter = mediaContext.add("enter", () => {
          if (window.scrollY > innerHeight / 2) return;
          gsap.from(".hero-word", {
            y: 45,
            opacity: 0,
            duration: 0.85,
            stagger: 0.09,
            ease: "power3.out",
          });
        });
        if (sessionStorage.getItem("wf-ready")) {
          const timer = gsap.delayedCall(0.4, enter);
          return () => timer.kill();
        }
        const onReady = () => enter();
        window.addEventListener("wf:ready", onReady, { once: true });
        return () => window.removeEventListener("wf:ready", onReady);
      });
      mm.add(
        "(min-width: 1024px) and (min-height: 650px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              id: "opening",
              refreshPriority: 10,
              trigger: hero.current,
              start: "top top",
              end: () => `+=${innerHeight * 1.8}`,
              pin: true,
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          });
          tl.to(".hero-front", { xPercent: -28, opacity: 0.15, duration: 1 }, 0)
            .to(".hero-back", { xPercent: 28, opacity: 0.15, duration: 1 }, 0)
            .to(".hero-title", { y: -90, opacity: 0, duration: 0.65 }, 0)
            .fromTo(
              ".hero-resolution",
              { autoAlpha: 0, y: 80 },
              { autoAlpha: 1, y: 0, duration: 0.6 },
              0.45,
            )
            .to(
              ".hero-bridge",
              {
                rotation: 180,
                scale: 0.75,
                y: () => -innerHeight * 0.43 - 35,
                duration: 1,
              },
              0,
            )
            .to(
              ".scroll-cue,.skip-story",
              { color: "#16130f", duration: 0.3 },
              0.65,
            )
            .to(
              ".scroll-cue span,.skip-story",
              { borderColor: "#16130f55", duration: 0.3 },
              0.65,
            );
          let active = true;
          document.fonts.ready.then(() => {
            if (active) {
              ScrollTrigger.sort();
              ScrollTrigger.refresh();
            }
          });
          return () => {
            active = false;
          };
        },
      );
      return () => mm.revert();
    },
    { scope: hero },
  );
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: close.current,
              start: "top 95%",
              end: "bottom 65%",
              scrub: 0.5,
            },
          })
          .from(".close-surface", { x: -30 }, 0)
          .from(".close-system", { x: 30 }, 0)
          .from("path", { strokeDashoffset: 1, ease: "none" }, 0);
      });
      return () => mm.revert();
    },
    { scope: close },
  );
  return (
    <main id="main" tabIndex={-1}>
      <section ref={hero} className="hero" aria-label="Surface and system">
        <div className="hero-half hero-front">
          <span className="hero-side-label eyebrow">
            01 / What people experience
          </span>
          <SystemScene />
        </div>
        <div className="hero-half hero-back">
          <span className="hero-side-label eyebrow">
            02 / What makes it work
          </span>
          <SystemScene dark />
        </div>
        <div className="hero-title">
          <div className="hero-kicker">
            <span className="eyebrow">Waffiyyi Fashola</span>
            <span className="eyebrow">
              Software engineer · Full-stack developer
            </span>
          </div>
          <h1>
            <span>
              <span className="hero-word">CRAFT THE</span>{" "}
              <em className="hero-word">FRONT.</em>
            </span>
            <span>
              <span className="hero-word">ENGINEER THE</span>{" "}
              <em className="hero-word">BACK.</em>
            </span>
          </h1>
          <p>
            I build what people experience.
            <br />
            And the systems behind it.
          </p>
        </div>
        <div className="hero-bridge" aria-hidden="true">
          ↔
        </div>
        <div className="hero-resolution">
          <span className="eyebrow">
            From the first interaction to the last request.
          </span>
          <h2>
            IT ALL
            <br />
            CONNECTS<span>.</span>
          </h2>
          <p>
            Thoughtful interfaces.
            <br />
            Dependable systems.
            <br />
            One complete perspective.
          </p>
        </div>
        <div className="hero-bottom">
          <span className="eyebrow">TypeScript + Java / Lagos, Nigeria</span>
          <a href="#selected-work" className="scroll-cue">
            Scroll to connect the dots <span>↓</span>
          </a>
        </div>
        <a className="skip-story" href="#missions">
          Skip to your next project ↗
        </a>
      </section>
      <HorizontalScene
        id="selected-work"
        title="Ideas, made tangible."
        label="02 / Selected work"
        count={featuredProjects.length}
      >
        {featuredProjects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </HorizontalScene>
      <div className="archive-bridge">
        <p>Different problems. A full-stack perspective.</p>
        <MotionLink href="/work" className="text-link">
          Explore the full archive <span>↗</span>
        </MotionLink>
      </div>
      <HorizontalScene
        id="engineering"
        title="Good work goes deeper."
        label="03 / Inside the system"
        dark
        count={engineering.length}
      >
        {engineering.map((stage) => (
          <article
            key={stage.number}
            className="engineering-card"
            data-track-item
          >
            <div className="engineering-card-top">
              <span className="mono">MODULE / {stage.number}</span>
              <span className="status-dot" />
            </div>
            <div className="engineering-symbol" aria-hidden="true">
              {stage.symbol}
              <span className="engineering-cross">+</span>
            </div>
            <h3>{stage.title}</h3>
            <p className="engineering-subtitle">{stage.subtitle}</p>
            <p>{stage.text}</p>
            <div className="engineering-stack mono">{stage.stack}</div>
            <MotionLink href={stage.link} className="text-link">
              {stage.label} <span>↗</span>
            </MotionLink>
          </article>
        ))}
      </HorizontalScene>
      <Profile />
      <Reveal>
        <MissionBoard />
      </Reveal>
      <section
        ref={close}
        className="closing-strip"
        aria-label="Surface and system, connected"
      >
        <span className="close-surface">THE SURFACE</span>
        <svg viewBox="0 0 300 50" aria-hidden="true">
          <path
            pathLength="1"
            strokeDasharray="1"
            d="M0 10h80l30 30h80l30-30h80"
          />
          <path
            pathLength="1"
            strokeDasharray="1"
            d="M0 40h80l30-30h80l30 30h80"
          />
        </svg>
        <span className="close-system">THE SYSTEM</span>
      </section>
    </main>
  );
}
