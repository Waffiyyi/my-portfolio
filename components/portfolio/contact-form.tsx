"use client";
import { useState, useRef } from "react";
import { getMission, missions, site } from "@/data/site";
import {
  validateContact,
  updateMissionMessage,
  missionLine,
  type ContactErrors,
} from "@/lib/contact";
export function ContactForm({
  initialMission = "",
}: {
  initialMission?: string;
}) {
  const first = getMission(initialMission)?.id || "";
  const [mission, setMission] = useState<string>(first);
  const [message, setMessage] = useState(missionLine(first));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [state, setState] = useState<"idle" | "pending" | "success" | "error">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");
  const form = useRef<HTMLFormElement>(null);
  function select(id: string) {
    const next = id === mission ? "" : id;
    setMessage((current) => updateMissionMessage(current, mission, next));
    setMission(next);
    const url = new URL(location.href);
    if (next) url.searchParams.set("mission", next);
    else url.searchParams.delete("mission");
    history.replaceState(history.state, "", url);
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "pending") return;
    const values = {
      name,
      email,
      message,
      mission,
      website: String(new FormData(e.currentTarget).get("website") || ""),
    };
    const invalid = validateContact(values);
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      form.current
        ?.querySelector<HTMLInputElement>(`[name="${Object.keys(invalid)[0]}"]`)
        ?.focus();
      return;
    }
    setState("pending");
    setFeedback("Sending your message…");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(18000),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Your message could not be delivered.");
      setState("success");
      setFeedback(
        "Your message has been delivered. Thank you for getting in touch.",
      );
    } catch (error) {
      setState("error");
      setFeedback(
        error instanceof Error && error.name === "TimeoutError"
          ? "The service took too long to respond. Your message is still here; try again or use email."
          : error instanceof Error
            ? error.message
            : "Your message could not be delivered. Please try again or use email.",
      );
    }
  }
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`Portfolio enquiry${getMission(mission) ? " — " + getMission(mission)?.title : ""}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
  return (
    <>
      <section
        className="contact-missions"
        aria-labelledby="contact-mission-title"
      >
        <div className="section-intro">
          <span className="eyebrow">01 / A starting point</span>
          <h2 id="contact-mission-title">
            WHAT ARE WE
            <br />
            BUILDING?
          </h2>
          <p>Pick a direction, or go straight to your message.</p>
        </div>
        <div className="contact-mission-grid">
          {missions.map((m, i) => (
            <button
              key={m.id}
              aria-pressed={mission === m.id}
              onClick={() => select(m.id)}
            >
              <span className="mono">
                0{i + 1}{" "}
                <span>{mission === m.id ? "Selected ✓" : "Select ↗"}</span>
              </span>
              <strong>{m.title}</strong>
              <p>{m.description}</p>
              <span className="mission-stack">{m.stack.join(" / ")}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="contact-message" id="message">
        <div className="contact-aside">
          <span className="eyebrow">02 / Let’s connect</span>
          <h2>
            BIG IDEA?
            <br />
            SMALL DETAIL?
            <br />
            <span className="accent">I’M LISTENING.</span>
          </h2>
          <p>
            Tell me what you’re working on, what you need, and where I could
            help.
          </p>
          <a href={`mailto:${site.email}`} className="text-link">
            {site.email} ↗
          </a>
          <div className="contact-location">
            <span className="eyebrow">Based in</span>
            <p>
              Lagos, Nigeria
              <br />
              West Africa Time · UTC+1
            </p>
          </div>
          <div className="social-row">
            <a href={site.github}>GitHub ↗</a>
            <a href={site.linkedin}>LinkedIn ↗</a>
            <a href={site.resume}>Résumé ↗</a>
          </div>
        </div>
        <form
          ref={form}
          onSubmit={submit}
          noValidate
          className="contact-form"
          aria-busy={state === "pending"}
        >
          {mission && (
            <div className="selected-mission">
              <span>{getMission(mission)?.title}</span>
              <button
                type="button"
                onClick={() => select(mission)}
                aria-label="Clear selected mission"
              >
                ×
              </button>
            </div>
          )}
          <div className="form-field">
            <label htmlFor="name">
              <span aria-hidden="true">01</span>Your name
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should I call you?"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="field-error">
                {errors.name}
              </p>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="email">
              <span aria-hidden="true">02</span>Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourcompany.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="field-error">
                {errors.email}
              </p>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="message-input">
              <span aria-hidden="true">03</span>Your message
            </label>
            <textarea
              id="message-input"
              name="message"
              required
              minLength={20}
              maxLength={5000}
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="The idea, the challenge, the possibilities…"
              aria-invalid={!!errors.message}
              aria-describedby={`message-count${errors.message ? " message-error" : ""}`}
            />
            <span id="message-count" className="field-counter mono">
              {message.length} / 5,000
            </span>
            {errors.message && (
              <p id="message-error" className="field-error">
                {errors.message}
              </p>
            )}
          </div>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <button
            className="button button-red"
            type="submit"
            disabled={state === "pending" || state === "success"}
          >
            {state === "pending"
              ? "Sending…"
              : state === "success"
                ? "Message delivered ✓"
                : "Send your message"}
            <span aria-hidden="true">↗</span>
          </button>
          <p
            className={`form-feedback ${state}`}
            role={state === "error" ? "alert" : "status"}
          >
            {feedback}
          </p>
          <p className="form-note">
            Your details are used to respond to your enquiry. Delivered through
            Web3Forms.
          </p>
          <a href={mailto} className="email-fallback">
            Prefer your email app? Open a draft ↗
          </a>
        </form>
      </section>
    </>
  );
}
