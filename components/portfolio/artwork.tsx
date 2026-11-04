import type { ArtKind, Project } from "@/data/projects";

export function SystemScene({
  dark = false,
  className = "",
}: {
  dark?: boolean;
  className?: string;
}) {
  const ink = dark ? "#f4f1ea" : "#16130f";
  const paper = dark ? "#1c2226" : "#e5e0d5";
  const accent = dark ? "#ffb547" : "#ea1d0f";
  return (
    <svg
      className={`system-scene ${className}`}
      viewBox="0 0 640 460"
      fill="none"
      aria-hidden="true"
    >
      <g stroke={ink} strokeWidth="1" opacity=".15">
        <path d="M20 350 320 180 620 350 320 520Z" />
        <path d="M20 290 320 120 620 290M20 230 320 60 620 230" />
        {[120, 220, 320, 420, 520].map((x) => (
          <path key={x} d={`M${x} 170v250`} />
        ))}
      </g>
      <g className="scene-base">
        <path d="m70 299 250-139 250 139-250 140Z" fill={paper} stroke={ink} />
        <path
          d="m70 299 250 140 250-140v23L320 462 70 322Z"
          fill={dark ? "#0d1013" : "#c9c3b7"}
          stroke={ink}
        />
        <path
          d="m94 300 226-126 226 126-226 126Z"
          stroke={ink}
          strokeDasharray="4 7"
          opacity=".3"
        />
      </g>
      <g className="scene-layer">
        <path
          d="m120 220 200-112 200 112-200 112Z"
          fill={dark ? "#101317" : "#f4f1ea"}
          stroke={ink}
          strokeWidth="1.5"
        />
        <path
          d="m120 220 200 112 200-112v15L320 347 120 235Z"
          fill={paper}
          stroke={ink}
        />
        {dark ? (
          <g stroke={accent} strokeWidth="2">
            <path
              className="draw-line"
              d="m166 220 82 46 72-40 72 40 82-46M248 266v-55l72-40 72 40v55M320 226v-55"
            />
            <circle cx="166" cy="220" r="7" fill={paper} />
            <circle cx="474" cy="220" r="7" fill={paper} />
            <circle cx="320" cy="171" r="7" fill={paper} />
            <path d="m296 226 24-13 24 13-24 14Z" fill={accent} />
          </g>
        ) : (
          <g>
            <path d="m155 210 92-52 61 34-92 52Z" fill={accent} />
            <path d="m231 253 92-52 61 34-92 52Z" fill="#16130f" />
            <path d="m322 177 47-26 92 52-47 26Z" fill="#d0c8b9" />
            <path d="m337 242 47-26 58 32-47 26Z" fill={accent} opacity=".3" />
            <path
              d="m176 212 30-17m-13 27 42-24"
              stroke="#f4f1ea"
              strokeWidth="5"
            />
          </g>
        )}
      </g>
      <g className="scene-float">
        <path d="m222 108 98-55 98 55-98 55Z" fill={accent} stroke={ink} />
        <path
          d="m222 108 98 55 98-55v19l-98 55-98-55Z"
          fill={dark ? "#9d6c28" : "#ae2519"}
          stroke={ink}
        />
        {dark ? (
          <path
            d="m287 106 21-12m24 0 21 12m-47 14 28-29"
            stroke="#16130f"
            strokeWidth="4"
          />
        ) : (
          <g fill="#f4f1ea">
            <circle cx="292" cy="109" r="10" />
            <path d="m311 98 27-15 25 14-27 15Z" />
            <path d="m310 120 27-15 25 14-27 15Z" opacity=".5" />
          </g>
        )}
      </g>
      <g stroke={accent} strokeWidth="1.5" strokeDasharray="4 5">
        <path d="M222 109v112m196-112v112M320 182v44" />
      </g>
      <g fill={ink} fontSize="10" fontFamily="monospace">
        <text x="34" y="100">
          {dark ? "02 / SYSTEM" : "01 / SURFACE"}
        </text>
        <text x="440" y="400">
          {dark ? "LOGIC → DATA" : "IDEA → INTERFACE"}
        </text>
      </g>
      <path d="M34 115h100M439 378h110" stroke={accent} />
      <circle cx="554" cy="378" r="4" fill={accent} />
    </svg>
  );
}

function Motif({ kind }: { kind: ArtKind }) {
  switch (kind) {
    case "journey":
      return (
        <g>
          <path
            d="M120 260C180 260 150 110 270 110S320 300 430 300 430 150 520 150"
            stroke="currentColor"
            strokeWidth="36"
            fill="none"
          />
          <path
            d="M120 260C180 260 150 110 270 110S320 300 430 300 430 150 520 150"
            stroke="#f4f1ea"
            strokeWidth="2"
            strokeDasharray="10 12"
            fill="none"
          />
          {[
            [120, 260],
            [520, 150],
          ].map(([x, y]) => (
            <g key={x}>
              <circle cx={x} cy={y} r="21" fill="#ea1d0f" />
              <circle cx={x} cy={y} r="7" fill="#f4f1ea" />
            </g>
          ))}
          <rect
            x="270"
            y="180"
            width="108"
            height="60"
            rx="8"
            fill="#f4f1ea"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M285 197h20m10 0h20m10 0h18M285 214h78"
            stroke="currentColor"
            strokeWidth="7"
          />
          <circle cx="291" cy="243" r="8" fill="currentColor" />
          <circle cx="357" cy="243" r="8" fill="currentColor" />
        </g>
      );
    case "voice":
      return (
        <g>
          {Array.from({ length: 25 }, (_, i) => {
            const h = 25 + Math.sin(i * 0.65) ** 2 * 170;
            return (
              <rect
                key={i}
                x={114 + i * 17}
                y={210 - h / 2}
                width="8"
                height={h}
                rx="4"
                fill={i > 9 && i < 15 ? "#ea1d0f" : "currentColor"}
                opacity={i % 3 === 0 ? 0.4 : 1}
              />
            );
          })}
          <circle
            cx="320"
            cy="210"
            r="125"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 6"
            fill="none"
          />
          <path d="M165 330h230" stroke="currentColor" />
          <circle cx="405" cy="330" r="6" fill="#ea1d0f" />
        </g>
      );
    case "food":
      return (
        <g>
          <circle
            cx="320"
            cy="205"
            r="116"
            fill="#f4f1ea"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle
            cx="320"
            cy="205"
            r="89"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path d="M260 180q60-90 120 0Z" fill="#ea1d0f" />
          <path
            d="M260 195h120M265 212h110"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path d="M260 231h120q-12 35-60 35t-60-35Z" fill="#ea1d0f" />
          <path
            d="M145 110v185m-15-185v50q15 25 30 0v-50M495 110v185m0-185q-32 30 0 90"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
          />
        </g>
      );
    case "care":
      return (
        <g>
          <circle cx="320" cy="210" r="125" stroke="currentColor" fill="none" />
          <circle
            cx="320"
            cy="210"
            r="88"
            stroke="currentColor"
            strokeDasharray="2 6"
            fill="none"
          />
          <path
            d="M300 135h40v55h55v40h-55v55h-40v-55h-55v-40h55Z"
            fill="currentColor"
          />
          <path
            d="M102 210h88l20-30 20 60 20-30h35m70 0h35l20-30 20 60 20-30h88"
            stroke="#ea1d0f"
            strokeWidth="3"
            fill="none"
          />
          <circle cx="102" cy="210" r="7" fill="#ea1d0f" />
          <circle cx="538" cy="210" r="7" fill="#ea1d0f" />
        </g>
      );
    case "fashion":
      return (
        <g>
          <path
            d="M260 100q60 40 120 0l60 45-40 65-27-20 20 140H247l20-140-27 20-40-65Z"
            fill="#f4f1ea"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M277 107q43 65 86 0M320 135v195M250 303h140"
            stroke="currentColor"
            fill="none"
          />
          <circle cx="329" cy="180" r="3" fill="#ea1d0f" />
          <circle cx="329" cy="214" r="3" fill="#ea1d0f" />
          <circle cx="329" cy="248" r="3" fill="#ea1d0f" />
          <path
            d="M140 97v234m-12-234h24m-24 234h24M460 97v234"
            stroke="currentColor"
            strokeDasharray="3 5"
          />
          <text x="450" y="350" fontSize="14" fontFamily="monospace">
            FORM / FLOW
          </text>
        </g>
      );
    case "payment":
      return (
        <g>
          <rect
            x="153"
            y="102"
            width="285"
            height="177"
            rx="14"
            fill="currentColor"
            transform="rotate(-9 300 190)"
          />
          <rect
            x="212"
            y="154"
            width="285"
            height="177"
            rx="14"
            fill="#f4f1ea"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="240" y="187" width="42" height="32" rx="5" fill="#ea1d0f" />
          <path
            d="M241 278h121m-121 15h75"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle cx="433" cy="277" r="18" stroke="currentColor" fill="none" />
          <path
            d="m418 278 10 10 20-20"
            stroke="currentColor"
            strokeWidth="3"
          />
        </g>
      );
    case "book":
      return (
        <g>
          <path
            d="M320 129q-80-53-180-20v204q100-33 180 20 80-53 180-20V109q-100-33-180 20Z"
            fill="#f4f1ea"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M320 129v204M168 150q60-20 123 10m-123 15q60-20 123 10m-123 15q60-20 123 10m-123 15q60-20 123 10m58-75q60-30 123-20m-123 50q60-30 123-20m-123 50q60-30 123-20"
            stroke="currentColor"
            fill="none"
          />
          <path d="M418 104v108l17-16 17 16V99Z" fill="#ea1d0f" />
        </g>
      );
    case "api":
      return (
        <g>
          {[
            [130, 150],
            [275, 150],
            [420, 150],
          ].map(([x, y], i) => (
            <g key={x}>
              <rect
                x={x}
                y={y}
                width="90"
                height="110"
                fill={i === 1 ? "#ea1d0f" : "#f4f1ea"}
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d={`M${x + 18} ${y + 30}h54m-54 22h36m-36 22h45`}
                stroke={i === 1 ? "#f4f1ea" : "currentColor"}
                strokeWidth="4"
              />
            </g>
          ))}
          <path
            d="M220 205h55m90 0h55M175 260v50h290v-50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="320" cy="310" r="6" fill="#ea1d0f" />
        </g>
      );
    case "tasks":
      return (
        <g>
          {[115, 187, 259].map((y, i) => (
            <g key={y}>
              <rect
                x="160"
                y={y}
                width="320"
                height="55"
                fill="#f4f1ea"
                stroke="currentColor"
              />
              <rect
                x="180"
                y={y + 15}
                width="25"
                height="25"
                fill={i === 2 ? "none" : "#ea1d0f"}
                stroke="currentColor"
              />
              {i !== 2 && (
                <path
                  d={`m185 ${y + 27} 6 6 9-12`}
                  stroke="#f4f1ea"
                  strokeWidth="2"
                  fill="none"
                />
              )}
              <path
                d={`M228 ${y + 26}h200m-200 10h125`}
                stroke="currentColor"
                strokeWidth="3"
              />
            </g>
          ))}
        </g>
      );
    case "quiz":
      return (
        <g>
          <rect
            x="190"
            y="80"
            width="260"
            height="270"
            rx="20"
            fill="#f4f1ea"
            stroke="currentColor"
            strokeWidth="2"
          />
          <text x="290" y="225" fill="#ea1d0f" fontWeight="900" fontSize="125">
            ?
          </text>
          <path
            d="M220 270h80m30 0h80M220 310h80m30 0h80"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </g>
      );
    default:
      return (
        <g>
          <path
            d="M150 110h340v220H150Z"
            fill="#f4f1ea"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M150 143h340M320 143v187" stroke="currentColor" />
          <path d="M320 143h170v187H320Z" fill="currentColor" />
          <text x="173" y="267" fontSize="93" fontWeight="900" fill="#ea1d0f">
            W
          </text>
          <text x="352" y="267" fontSize="93" fontWeight="900" fill="#f4f1ea">
            F
          </text>
          <circle cx="167" cy="126" r="3" fill="#ea1d0f" />
        </g>
      );
  }
}
export function ProjectArt({
  project,
  className = "",
}: {
  project: Pick<Project, "title" | "art" | "color">;
  className?: string;
}) {
  return (
    <svg
      className={`project-art ${className}`}
      viewBox="0 0 640 420"
      role="img"
      aria-label={`${project.title}: original conceptual illustration, not a product screenshot`}
      style={{ background: project.color }}
    >
      <g stroke="#16130f" opacity=".1">
        {[80, 160, 240, 320, 400, 480, 560].map((x) => (
          <path key={x} d={`M${x} 0v420`} />
        ))}
        {[70, 140, 210, 280, 350].map((y) => (
          <path key={y} d={`M0 ${y}h640`} />
        ))}
      </g>
      <g style={{ color: "#16130f" }}>
        <Motif kind={project.art} />
      </g>
      <g fill="#16130f" fontFamily="monospace" fontSize="10" letterSpacing="2">
        <text x="24" y="30">
          WF / PROJECT STUDY
        </text>
        <text x="24" y="397">
          CONCEPTUAL ARTWORK
        </text>
        <text x="552" y="397">
          ↗
        </text>
      </g>
      <path d="M600 22v22m-11-11h22" stroke="#16130f" />
    </svg>
  );
}
export function FlowDiagram({ steps }: { steps: readonly string[] }) {
  return (
    <div className="flow-diagram" aria-label="Conceptual workflow">
      <span className="eyebrow">System map / conceptual</span>
      <ol>
        {steps.map((step, i) => (
          <li key={step}>
            <span className="mono">0{i + 1}</span>
            <strong>{step}</strong>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="flow-arrow">
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
