// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://intervixa.online";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// Only publicly reachable (non authenticated) routes belong in the sitemap.
// Deliberately excluded because they sit behind AuthGuard and are marked
// noindex in src/components/RouteSeo.tsx: /chat, /ats-resume-builder,
// /roadmap, /admin/* and every /modules/* route.
const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/guide/ats-optimization", changefreq: "monthly", priority: "0.8" },
  { path: "/guide/behavioral-interview-questions", changefreq: "monthly", priority: "0.8" },
  { path: "/modules/interview-questions", changefreq: "weekly", priority: "0.9" },
  { path: "/modules/scenario-questions", changefreq: "weekly", priority: "0.9" },
  { path: "/modules/ats-resume-score", changefreq: "monthly", priority: "0.8" },
  { path: "/roadmap", changefreq: "monthly", priority: "0.8" },
  { path: "/modules/prep-roadmap", changefreq: "monthly", priority: "0.8" },
  // Keyword topic landing pages (src/data/topic-pages.ts)
  { path: "/aws-interview-questions", changefreq: "weekly", priority: "0.9" },
  { path: "/devops-interview-questions", changefreq: "weekly", priority: "0.9" },
  { path: "/docker-interview-questions", changefreq: "weekly", priority: "0.9" },
  { path: "/kubernetes-interview-questions", changefreq: "weekly", priority: "0.9" },
  { path: "/terraform-interview-questions", changefreq: "weekly", priority: "0.8" },
  { path: "/jenkins-interview-questions", changefreq: "weekly", priority: "0.8" },
  { path: "/linux-interview-questions", changefreq: "weekly", priority: "0.8" },
  { path: "/docker-scenario-questions", changefreq: "weekly", priority: "0.8" },
  { path: "/kubernetes-scenario-questions", changefreq: "weekly", priority: "0.8" },
  { path: "/login", changefreq: "monthly", priority: "0.3" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-and-conditions", changefreq: "yearly", priority: "0.3" },
  { path: "/cookie-policy", changefreq: "yearly", priority: "0.3" },
];


function generateSitemap(items: SitemapEntry[]) {
  const urls = items.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
