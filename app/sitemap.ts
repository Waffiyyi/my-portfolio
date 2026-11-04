import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/work",
    "/about",
    "/resume",
    "/contact",
    ...projects.map((p) => `/work/${p.slug}`),
  ].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/work" ? 0.9 : 0.7,
  }));
}
