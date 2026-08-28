import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const sections = [
  { id: "what-is-ats", label: "What an ATS actually does" },
  { id: "formatting", label: "ATS-friendly formatting" },
  { id: "keywords", label: "Keyword optimization" },
  { id: "structure", label: "Section-by-section structure" },
  { id: "mistakes", label: "Common mistakes" },
  { id: "checklist", label: "Final checklist" },
  { id: "faq", label: "FAQ" },
];

const faqs = [
  {
    q: "What is an ATS-optimized resume?",
    a: "An ATS-optimized resume is a resume formatted in plain, single-column, machine-readable structure with standard section headings and the exact keywords from the job description, so an applicant tracking system can parse and rank it correctly.",
  },
  {
    q: "Which file format is best for ATS?",
    a: "A text-based PDF is safest for most modern systems. Use .docx only when the employer explicitly asks for it, and never submit a scanned or image-based file.",
  },
  {
    q: "Do ATS systems reject resumes automatically?",
    a: "Most systems do not auto-reject. They parse, score and rank candidates against the job requisition, and recruiters filter by that ranking — so a poorly parsed resume rarely gets seen.",
  },
  {
    q: "How many keywords should a resume include?",
    a: "Cover every hard requirement in the posting once in context, and repeat the 5-8 most important skills naturally across your summary, skills and experience bullets. Never stuff hidden or white text.",
  },
];

const AtsOptimizationGuide = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How to Write an ATS-Optimized Resume",
      description:
        "A step-by-step guide to formatting, keywords and structure that gets your resume past applicant tracking systems.",
      image: [
        "https://storage.googleapis.com/gpt-engineer-file-uploads/7hpWrsKoUcU5WVDBGYkgF5PEQiX2/social-images/social-1773404300150-Screenshot_11-3-2026_191154_intervixa.lovable.app.webp",
      ],
      datePublished: "2026-08-01",
      dateModified: "2026-08-24",
      author: { "@type": "Organization", name: "Intervixa AI" },
      publisher: { "@type": "Organization", name: "Intervixa AI" },
      mainEntityOfPage: "https://intervixa.online/guide/ats-optimization",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        path="/guide/ats-optimization"
        ogType="article"
        title="How to Write an ATS-Optimized Resume (2026 Guide)"
        description="Learn ATS-friendly formatting, keyword optimization and the mistakes that get resumes filtered out — with a free ATS resume builder to apply it."
        jsonLd={jsonLd}
      />
      <Navbar />

      <main className="container px-6 py-16 max-w-3xl">
        <BackButton />
        <article>
          <header className="mb-10">
            <p className="text-sm text-primary font-medium mb-3">Resume Guide</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              How to write an ATS-optimized resume
            </h1>
            <p className="text-lg text-muted-foreground">
              Applicant tracking systems read your resume before a human does. This guide covers the
              formatting, keywords and structure that let them parse it correctly — and the habits
              that quietly sink an otherwise strong application.
            </p>
          </header>

          <Card className="p-5 mb-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              On this page
            </h2>
            <ul className="space-y-1.5 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-primary hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          <section id="what-is-ats" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">What an ATS actually does</h2>
            <p className="text-muted-foreground mb-4">
              An applicant tracking system is the database recruiters use to receive, store and sort
              applications. When you upload a resume, the system parses it into structured fields —
              name, contact details, employers, dates, titles, skills, education — then scores that
              record against the job requisition.
            </p>
            <p className="text-muted-foreground">
              Nothing mystical happens here. If the parser cannot find your job titles because they
              sit inside a graphic, or your skills because they live in a sidebar table, your record
              is simply incomplete, and incomplete records rank low in recruiter searches.
            </p>
          </section>

          <section id="formatting" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">ATS-friendly formatting</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" /> Do this
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Single-column layout, top to bottom</li>
                  <li>Standard headings: Experience, Skills, Education</li>
                  <li>Common fonts at 10–12pt</li>
                  <li>Simple bullet points</li>
                  <li>Dates as "Mar 2023 – Present"</li>
                  <li>Text-based PDF export</li>
                </ul>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" aria-hidden="true" /> Avoid this
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Two-column templates and sidebars</li>
                  <li>Text inside images, logos or icons</li>
                  <li>Headers and footers holding contact details</li>
                  <li>Tables and text boxes</li>
                  <li>Creative section names like "My Journey"</li>
                  <li>Scanned or exported-as-image files</li>
                </ul>
              </Card>
            </div>
          </section>

          <section id="keywords" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">Keyword optimization</h2>
            <p className="text-muted-foreground mb-4">
              Recruiters search their ATS the way you search Google: by skill, tool and title. Your
              job is to make sure the exact terms in the posting appear in your resume, in context.
            </p>
            <ol className="space-y-3 text-muted-foreground list-decimal pl-5">
              <li>
                Paste the job description somewhere and highlight every hard skill, tool, certification
                and title it names.
              </li>
              <li>
                Mirror the employer's wording. If the posting says "CI/CD pipelines", don't only write
                "build automation" — use both.
              </li>
              <li>
                Spell out acronyms once: "Kubernetes (K8s)", "Amazon Web Services (AWS)".
              </li>
              <li>
                Put your 8–12 strongest terms in a plain Skills section, then prove them inside
                experience bullets with numbers.
              </li>
              <li>
                Match the job title where it is honest to do so — a "Cloud Engineer" applying to a
                "DevOps Engineer" role should reflect the overlap in the summary line.
              </li>
            </ol>
          </section>

          <section id="structure" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">Section-by-section structure</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Header:</strong> name, phone, email, city, LinkedIn
                URL — in the body of the document, not the page header.
              </li>
              <li>
                <strong className="text-foreground">Summary:</strong> three lines naming your target
                role, years of experience and two or three signature skills.
              </li>
              <li>
                <strong className="text-foreground">Skills:</strong> a plain comma-separated or bulleted
                list grouped by category. No rating bars.
              </li>
              <li>
                <strong className="text-foreground">Experience:</strong> reverse-chronological. Each
                bullet as action + tooling + measurable result — "Cut deployment time 40% by migrating
                12 services to GitHub Actions".
              </li>
              <li>
                <strong className="text-foreground">Education & certifications:</strong> degree,
                institution, year; certifications with their full official names.
              </li>
            </ul>
          </section>

          <section id="mistakes" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">Common mistakes</h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>Keyword stuffing or white-text keywords — recruiters see the parsed text and reject it.</li>
              <li>One generic resume sent to every posting instead of a tailored keyword set.</li>
              <li>Responsibilities instead of results: no numbers means nothing to rank on.</li>
              <li>Missing dates or gaps left unexplained, which break the parsed employment timeline.</li>
              <li>Fancy templates downloaded from design sites that use tables under the hood.</li>
              <li>File names like "resume-final-2.pdf" instead of "Firstname-Lastname-Resume.pdf".</li>
            </ul>
          </section>

          <section id="checklist" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">Final checklist</h2>
            <Card className="p-5">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Single column, standard headings, no tables or images",
                  "Contact details in the document body",
                  "Job-description keywords present in Skills and Experience",
                  "Every bullet has an action verb and a measurable outcome",
                  "Consistent month-year date format with no unexplained gaps",
                  "Exported as a text-based PDF and named with your full name",
                  "Copy-pasted into a plain text editor and still readable",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section id="faq" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold mb-1">{f.q}</h3>
                  <p className="text-muted-foreground text-sm">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <Card className="p-6 bg-gradient-primary/10">
            <h2 className="font-display text-xl font-semibold mb-2">
              Apply this with the free ATS resume builder
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Intervixa AI builds an ATS-ready resume from your details, scores it against a job
              description and shows exactly which keywords are missing.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/ats-resume-builder">
                  Build my resume <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/modules/ats-resume-score">See ATS resume samples</Link>
              </Button>
            </div>
          </Card>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default AtsOptimizationGuide;
