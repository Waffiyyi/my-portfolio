import { MotionLink } from "@/components/portfolio/site-shell";
export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="page-main">
      <div className="page-hero error-page">
        <span className="eyebrow">404 / A missing connection</span>
        <h1>
          WRONG TURN.
          <br />
          <span className="accent">RIGHT PLACE.</span>
        </h1>
        <p>This page isn’t here. The work is.</p>
        <MotionLink href="/work" className="button button-red">
          Explore the work ↗
        </MotionLink>
      </div>
    </main>
  );
}
