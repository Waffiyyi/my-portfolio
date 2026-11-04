export type Category = "Full-stack" | "AI" | "Front-end";
export type ArtKind =
  | "journey"
  | "voice"
  | "food"
  | "care"
  | "fashion"
  | "payment"
  | "book"
  | "api"
  | "tasks"
  | "quiz"
  | "portfolio";
export interface Project {
  slug: string;
  title: string;
  category: Category;
  year: string;
  status: string;
  role: string;
  tagline: string;
  description: string;
  stack: readonly string[];
  color: string;
  art: ArtKind;
  featured?: boolean;
  github?: string;
  demo?: string;
  front: string;
  back: string;
  highlights: readonly { title: string; text: string }[];
  flow: readonly string[];
  note?: string;
}
export const projects: Project[] = [
  {
    slug: "corpers-transolution",
    demo: "https://corperstransolution.com/",
    title: "Corpers Transolution",
    category: "Full-stack",
    year: "2026",
    status: "In development",
    role: "Full-stack contribution",
    tagline: "A better journey starts before the bus.",
    description:
      "A travel and booking platform for NYSC members, connecting trip discovery, seat selection, payment and digital tickets.",
    stack: [
      "Next.js",
      "TypeScript",
      "Java 21",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "Paystack",
    ],
    color: "#d4debe",
    art: "journey",
    featured: true,
    front:
      "A trip becomes a sequence of clear decisions: find the journey, choose a seat and review the booking. Dedicated interfaces also support the people managing trips and driving them.",
    back: "The booking is a lifecycle, not just a checkout. The implementation separates seat inventory from booking and payment records, with payment verification, reconciliation and audit logs. Flyway manages database changes; Redis is part of the backend stack.",
    highlights: [
      {
        title: "Seat inventory",
        text: "Seat availability has its own service so the booking flow can work with explicit inventory state.",
      },
      {
        title: "Payment lifecycle",
        text: "Initialization, verification and reconciliation are distinct operations, with financial-integrity tests present in the repository.",
      },
      {
        title: "Beyond checkout",
        text: "Digital tickets and admin/driver workflows extend the product beyond the customer-facing form.",
      },
    ],
    flow: [
      "Trip search",
      "Seat inventory",
      "Booking",
      "Payment verification",
      "Digital ticket",
    ],
    note: "Development work. Repository tests were inspected, not rerun for this case study; no launch or usage metrics are claimed.",
  },
  {
    slug: "bolda",
    demo: "https://www.usebolda.com/",
    title: "Bolda",
    category: "AI",
    year: "2026",
    status: "MVP · in development",
    role: "Full-stack contribution",
    tagline: "Practice the conversation before it counts.",
    description:
      "An AI interview-practice platform exploring realistic conversations, voice interactions and actionable feedback.",
    stack: [
      "Next.js",
      "TypeScript",
      "Express",
      "Prisma",
      "PostgreSQL",
      "AI integrations",
    ],
    color: "#d8c9e9",
    art: "voice",
    featured: true,
    front:
      "Interview preparation is a conversation: onboarding, practice sessions and feedback give the experience a clear beginning, middle and next step. The frontend also includes professional sessions and performance views.",
    back: "Each interview turn checks session ownership, persists the message and retrieves a bounded history of 12 messages. Context is assembled for the model, then its response is parsed and the interview state transition validated before feedback is persisted.",
    highlights: [
      {
        title: "Coherent conversations",
        text: "A bounded transcript gives each turn context without treating the entire conversation as an unstructured prompt.",
      },
      {
        title: "Validated transitions",
        text: "Model response parsing and interview state checks separate generated suggestions from application decisions.",
      },
      {
        title: "More than text",
        text: "Voice handling, configurable text-to-speech and professional-session booking exist in the implementation.",
      },
    ],
    flow: [
      "Practice session",
      "Bounded context",
      "AI response",
      "State validation",
      "Feedback",
    ],
    note: "MVP and development work. The public website currently provides a waitlist; no model-quality score or user outcome is asserted.",
  },
  {
    slug: "loveflower-wellness",
    demo: "https://loveflowerwellness.com/",
    title: "LoveFlower Wellness",
    category: "Front-end",
    year: "2026",
    status: "Development contribution",
    role: "Frontend contribution · collaborative team",
    tagline: "Care, with less complexity in the way.",
    description:
      "Healthcare and commerce interfaces spanning practitioner workflows, patient information, consultations and product discovery.",
    stack: [
      "Next.js",
      "TypeScript",
      "Redux Toolkit",
      "React Hook Form",
      "Zod",
      "Tailwind CSS",
    ],
    color: "#e2d2b9",
    art: "care",
    featured: true,
    front:
      "Patient information and consultation flows ask an interface to handle a lot without overwhelming its user. My contributions include forms and data integration, dietary-recall parsing, review interfaces and collaborative feature integration.",
    back: "Typed forms and Zod schemas describe the data expected by patient workflows. React Hook Form manages input state, while the application uses Redux Toolkit across its Next.js frontend. This case study covers my frontend contribution, not ownership of the entire healthcare platform.",
    highlights: [
      {
        title: "Patient workflows",
        text: "Patient creation, medical profiles and consultation routes organize complex information around the practitioner’s task.",
      },
      {
        title: "Structured information",
        text: "Form validation and dietary-recall parsing help bridge interface inputs and the data the application expects.",
      },
      {
        title: "Connected experiences",
        text: "Review and checkout interfaces complement the healthcare flows within the wider platform.",
      },
    ],
    flow: [
      "Patient information",
      "Validated forms",
      "Consultation",
      "Care workflow",
    ],
    note: "Collaborative development contribution. No real patient records or proprietary application screenshots are displayed.",
  },
  {
    slug: "flowpay",
    demo: "https://your-flowpay.vercel.app/",
    title: "FlowPay",
    category: "AI",
    year: "2026",
    status: "Hackathon prototype · sandbox",
    role: "Full-stack & mobile contribution",
    tagline: "Intelligence suggests. People decide.",
    description:
      "A financial-workflow prototype combining a Flutter interface, a TypeScript backend and sandbox payment integrations.",
    stack: [
      "Flutter",
      "Riverpod",
      "TypeScript",
      "Express",
      "Prisma",
      "PostgreSQL",
    ],
    color: "#bdcfd9",
    art: "payment",
    featured: true,
    front:
      "The prototype brings wallet, transfer, card and payroll journeys into a mobile experience. It explores how AI can help express a financial intention while keeping the person in control of the next action.",
    back: "An AI suggestion still needs deterministic checks and explicit approval. The backend contains financial-intent validation, money helpers and payroll modules, with separate BMONI sandbox and demo providers. Contributions include transfer handling and isolating activity between users.",
    highlights: [
      {
        title: "Intent validation",
        text: "Structured checks sit between an AI response and any financial workflow.",
      },
      {
        title: "Explicit environments",
        text: "Sandbox and demo providers are distinct. This project is not represented as a live financial service.",
      },
      {
        title: "User boundaries",
        text: "Cross-user activity isolation and transfer service work are documented in the repository history.",
      },
    ],
    flow: [
      "User intent",
      "AI suggestion",
      "Deterministic checks",
      "User approval",
      "Sandbox provider",
    ],
    note: "Hackathon prototype using sandbox/demo integrations. No real balances, savings figures or production-payment claims.",
  },

  {
    title: "CraveCourier",
    description:
      "A food delivery application connecting customers with nearby restaurants, with an admin panel for restaurant owners to manage restaurants and orders.",
    stack: [
      "React",
      "Redux",
      "JavaScript",
      "MUI",
      "Tailwind",
      "Java",
      "Spring Boot",
      "PostgreSQL",
    ],
    year: "2024",
    status: "Completed: May 2024",
    role: "Personal project",
    featured: true,
    github: "https://github.com/Waffiyyi/online-food-ordering-app-frontend",
    demo: "https://crave-courier.vercel.app",
    slug: "crave-courier",
    category: "Full-stack",
    tagline: "From a craving to the kitchen.",
    art: "food",
    color: "#f0b79e",
    front:
      "Customers discover nearby restaurants and order food, while restaurant owners have an admin panel to manage their restaurants and incoming orders.",
    back: "The documented stack pairs a React and Redux frontend with Java/Spring Boot and PostgreSQL. It brings customer ordering and restaurant operations into one full-stack personal project.",
    highlights: [
      {
        title: "Two perspectives",
        text: "The customer experience and restaurant-owner admin panel serve different tasks within the same product.",
      },
      {
        title: "A connected stack",
        text: "React/Redux handles the interface; Java, Spring Boot and PostgreSQL support the application backend.",
      },
    ],
    flow: [
      "Restaurant discovery",
      "Customer order",
      "Restaurant admin",
      "Order management",
    ],
  },
];
export const featuredProjects = projects.filter((project) => project.featured);
export const categories: readonly ("All" | Category)[] = [
  "All",
  ...new Set(projects.map((project) => project.category)),
];
export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);
