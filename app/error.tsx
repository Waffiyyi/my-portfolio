"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" tabIndex={-1} className="page-main">
      <div className="page-hero">
        <span className="eyebrow">A connection needs another try.</span>
        <h1>
          LET’S TRY
          <br />
          <span className="accent">THAT AGAIN.</span>
        </h1>
        <button className="button" onClick={reset}>
          Retry page ↗
        </button>
      </div>
    </main>
  );
}
