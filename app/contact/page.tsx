import type { Metadata } from "next";
import { ContactForm } from "@/components/portfolio/contact-form";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have something in mind? Talk to Waffiyyi Fashola about web platforms, backend systems, AI products and frontend experiences.",
  alternates: { canonical: "/contact" },
};
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ mission?: string }>;
}) {
  const { mission } = await searchParams;
  return (
    <main id="main" tabIndex={-1} className="page-main">
      <header className="page-hero contact-hero">
        <div className="page-hero-meta">
          <span className="eyebrow">A conversation is a good start.</span>
          <span className="mono">Lagos ↔ Everywhere</span>
        </div>
        <h1>
          YOUR NEXT
          <br />
          CHAPTER<span className="accent">.</span>
          <span className="contact-hero-arrow" aria-hidden="true">
            ↘
          </span>
        </h1>
        <div className="page-hero-bottom">
          <p>
            Something to build?
            <br />
            Let’s figure it out together.
          </p>
          <a href="#message" className="text-link">
            Start a conversation ↓
          </a>
        </div>
      </header>
      <ContactForm
        initialMission={typeof mission === "string" ? mission : ""}
      />
    </main>
  );
}
