import type { Metadata } from "next";
import { SystemScene } from "@/components/portfolio/artwork";
import { Experience } from "@/components/portfolio/experience";
import { MotionLink } from "@/components/portfolio/site-shell";
export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Waffiyyi Fashola: software engineer, full-stack developer and curious problem solver based in Lagos.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="page-main">
      <header className="page-hero about-hero">
        <span className="eyebrow">A person, not just a stack.</span>
        <h1>
          CURIOUS MIND.
          <br />
          <span className="accent">CONSIDERED CODE.</span>
        </h1>
        <div className="about-introduction">
          <div>
            <p className="lead">
              I’m Waffiyyi Fashola, a software engineer based in Lagos, Nigeria.
            </p>
            <p>
              I work across the full stack, connecting React, Next.js and
              TypeScript interfaces to Java, Spring Boot and the data behind
              them. I like understanding the whole problem before deciding how
              the pieces should fit.
            </p>
            <p>
              For me, good software combines careful planning, readable code and
              a useful experience. The learning never really stops.
            </p>
            <MotionLink href="/resume" className="text-link">
              Read my full résumé ↗
            </MotionLink>
          </div>
          <SystemScene />
        </div>
      </header>
      <Experience />
      <section className="offscreen-section">
        <span className="eyebrow">Away from the screen</span>
        <h2>
          THERE’S ALWAYS
          <br />
          ANOTHER WAY TO THINK.
        </h2>
        <div>
          <article>
            <span aria-hidden="true">♞</span>
            <h3>Strategy games</h3>
            <p>
              Chess openings, League of Legends and the pleasure of thinking a
              few moves ahead.
            </p>
          </article>
          <article>
            <span aria-hidden="true">Aa</span>
            <h3>Languages</h3>
            <p>
              Exploring languages to better understand the cultures and people
              behind them.
            </p>
          </article>
          <article>
            <span aria-hidden="true">↗</span>
            <h3>Football</h3>
            <p>
              Ninety minutes, one ball, and no shortage of reasons to keep
              watching.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
