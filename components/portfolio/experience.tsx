import {
  experience,
  education,
  certifications,
  skills,
} from "@/constants/resume";
import { site } from "@/data/site";
export function Experience({ full = false }: { full?: boolean }) {
  return (
    <>
      <section className="experience-section" id="experience">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">
              Experience / The work behind the work
            </span>
            <h2>
              A PRACTICAL
              <br />
              PERSPECTIVE.
            </h2>
          </div>
          <a href={site.resume} className="button">
            Download résumé <span>↗</span>
          </a>
        </div>
        <div className="experience-list">
          {experience.map((job) => (
            <article key={job.company}>
              <div className="experience-meta">
                <span className="mono">{job.period}</span>
                <span>
                  {job.role} / {job.location}
                </span>
              </div>
              <div>
                <h3>{job.title}</h3>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noreferrer"
                  className="experience-company"
                >
                  {job.company} ↗
                </a>
                <p>{job.description}</p>
                {full && (
                  <ul>
                    {job.achievements.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className="record-note">
          Experience dates and achievements are preserved from the existing
          résumé. “Present” reflects that record.
        </p>
      </section>
      <section className="skills-section dark-scene">
        <span className="eyebrow">The toolkit / Always learning</span>
        <h2>
          THE RIGHT TOOL.
          <br />
          FOR THE REAL PROBLEM.
        </h2>
        <div className="skill-groups">
          {Object.entries(skills).map(([group, items], i) => (
            <div key={group}>
              <span className="mono">0{i + 1}</span>
              <h3>{group}</h3>
              <p>{items.join(" / ")}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="education-section">
        <div>
          <span className="eyebrow">Education</span>
          {education.map((e) => (
            <article key={e.school}>
              <h3>{e.degree}</h3>
              <p>{e.school}</p>
              <span className="mono">
                {e.period} / {e.location}
              </span>
              {full && (
                <>
                  <p>GPA: {e.gpa}</p>
                  <p>{e.relevant.join(" · ")}</p>
                </>
              )}
            </article>
          ))}
        </div>
        <div>
          <span className="eyebrow">Certifications</span>
          {certifications.map((c) => (
            <article key={c.id}>
              <h3>{c.name}</h3>
              <p>
                {c.issuer} / {c.date}
              </p>
              {full && <span className="mono">Credential {c.id}</span>}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
