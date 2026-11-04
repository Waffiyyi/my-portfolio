import type { Metadata } from "next";
import { Experience } from "@/components/portfolio/experience";
export const metadata: Metadata = {
  title: "Résumé",
  alternates: { canonical: "/resume" },
};
export default function ResumePage() {
  return (
    <main id="main" tabIndex={-1} className="page-main">
      <header className="page-hero resume-hero">
        <span className="eyebrow">Waffiyyi Fashola / Software engineer</span>
        <h1>
          THE EXPERIENCE.
          <br />
          <span className="accent">ON THE RECORD.</span>
        </h1>
        <p>Full-stack development, from the interface to the infrastructure.</p>
      </header>
      <Experience full />
    </main>
  );
}
