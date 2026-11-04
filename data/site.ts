export const site = {
  name: "Waffiyyi Fashola",
  url: "https://waffiyyi-fashola.vercel.app",
  email: "fasholawafiyyi@gmail.com",
  github: "https://github.com/waffiyyi",
  linkedin: "https://linkedin.com/in/waffiyyi-fashola",
  twitter: "https://x.com/_aka_echo",
  resume: "/waffiyyi-fashola-resume.pdf",
};
export const missions = [
  {
    id: "web-platforms",
    title: "Web platforms & SaaS",
    short: "A product, end to end.",
    description:
      "Bring the customer experience and the operations behind it into one coherent web platform.",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    related: ["corpers-transolution", "crave-courier"],
  },
  {
    id: "backend-systems",
    title: "Backend systems & APIs",
    short: "Make the complex dependable.",
    description:
      "From data models to integrations: build the services that keep a product moving.",
    stack: ["Java", "Spring Boot", "REST APIs"],
    related: ["corpers-transolution", "crave-courier"],
  },
  {
    id: "ai-products",
    title: "AI-powered products",
    short: "Useful intelligence. Clear boundaries.",
    description:
      "Connect AI to real product workflows, with structured responses, validation and deliberate human control.",
    stack: ["TypeScript", "Express", "AI integrations"],
    related: ["bolda", "flowpay"],
  },
  {
    id: "frontend-experiences",
    title: "Front-end experiences",
    short: "Every interaction matters.",
    description:
      "Translate a visual direction into responsive interfaces that feel considered, clear and easy to use.",
    stack: ["React", "Next.js", "TypeScript"],
    related: ["loveflower-wellness", "crave-courier"],
  },
] as const;
export type MissionId = (typeof missions)[number]["id"];
export const getMission = (id: string | null | undefined) =>
  missions.find((m) => m.id === id);
