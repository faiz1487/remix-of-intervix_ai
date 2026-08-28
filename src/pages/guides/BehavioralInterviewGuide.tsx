import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const sections = [
  { id: "what-are-behavioral", label: "What behavioral questions test" },
  { id: "star", label: "The STAR method" },
  { id: "examples", label: "Common questions with answers" },
  { id: "mistakes", label: "Mistakes that cost offers" },
  { id: "prep", label: "How to prepare in a week" },
  { id: "faq", label: "FAQ" },
];

const questions = [
  {
    q: "Tell me about a time you failed.",
    a: "Pick a real failure you owned, keep the blame internal, and spend most of the answer on the fix and the lasting change. Example: a deployment you shipped without a rollback plan, the outage it caused, the incident review you ran, and the release checklist that came out of it.",
  },
  {
    q: "Describe a conflict with a teammate.",
    a: "Show that you separated the problem from the person. Name the disagreement, the data you brought, the compromise you reached, and how the working relationship looked afterwards.",
  },
  {
    q: "Tell me about a time you worked under pressure.",
    a: "Use an incident or a deadline with a clock on it. Emphasise how you triaged, what you deliberately dropped, and the measurable outcome — 'restored service in 22 minutes'.",
  },
  {
    q: "Give an example of when you took initiative.",
    a: "Choose something nobody asked you to do: an automation, a runbook, a monitoring gap you closed. Quantify the time or cost it saved.",
  },
  {
    q: "Tell me about a time you had to learn something quickly.",
    a: "Name the technology, the deadline, exactly how you learned it, and what you shipped with it. Interviewers are scoring your learning process, not your existing knowledge.",
  },
];

const faqs = [
  {
    q: "What is the STAR method?",
    a: "STAR is a four-part answer structure — Situation, Task, Action, Result — that keeps a behavioral answer concrete and under two minutes while making your individual contribution and its measurable outcome obvious.",
  },
  {
    q: "How long should a behavioral answer be?",
    a: "Aim for 90 seconds to two minutes. Spend roughly 20% on Situation and Task, 60% on Action, and 20% on Result.",
  },
  {
    q: "Can I use the same story for multiple questions?",
    a: "Yes, if you reframe it around what the question asks. Prepare six to eight strong stories that between them cover failure, conflict, leadership, pressure, initiative and learning.",
  },
  {
    q: "What if I don't have professional experience?",
    a: "Use projects, coursework, open source contributions or part-time work. The structure and the reflection matter more than the size of the stage.",
  },
];

const BehavioralInterviewGuide = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Behavioral Interview Questions and the STAR Method",
      description:
        "How to answer behavioral interview questions using the STAR method, with example answers and a one-week preparation plan.",
      image: [
        "https://storage.googleapis.com/gpt-engineer-file-uploads/7hpWrsKoUcU5WVDBGYkgF5PEQiX2/social-images/social-1773404300150-Screenshot_11-3-2026_191154_intervixa.lovable.app.webp",
      ],
      datePublished: "2026-08-01",
      dateModified: "2026-08-24",
      author: { "@type": "Organization", name: "Intervixa AI" },
      publisher: { "@type": "Organization", name: "Intervixa AI" },
      mainEntityOfPage:
        "https://intervixa.online/guide/behavioral-interview-questions",
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
        path="/guide/behavioral-interview-questions"
        ogType="article"
        title="Behavioral Interview Questions & the STAR Method (2026)"
        description="Answer behavioral interview questions with the STAR method — example answers to the most common questions, mistakes to avoid and a one-week prep plan."
        jsonLd={jsonLd}
      />
      <Navbar />

      <main className="container px-6 py-16 max-w-3xl">
        <BackButton />
        <article>
          <header className="mb-10">
            <p className="text-sm text-primary font-medium mb-3">Interview Guide</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Behavioral interview questions and the STAR method
            </h1>
            <p className="text-lg text-muted-foreground">
              Technical rounds decide whether you can do the job; behavioral rounds decide whether
              people want to work with you. This guide covers the STAR structure, worked answers to
              the questions that come up in almost every loop, and a prep plan you can finish in a
              week.
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

          <section id="what-are-behavioral" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">
              What behavioral questions test
            </h2>
            <p className="text-muted-foreground mb-4">
              A behavioral question asks what you actually did in a past situation, on the theory
              that past behaviour predicts future behaviour better than hypotheticals do. Anything
              starting with "tell me about a time", "describe a situation" or "give me an example"
              is one.
            </p>
            <p className="text-muted-foreground">
              Interviewers are scoring four things: ownership (did you drive it or watch it),
              judgement under incomplete information, how you handle other people, and whether you
              learned anything. Vague answers in the first person plural — "we decided", "we fixed
              it" — score badly because they hide your contribution.
            </p>
          </section>

          <section id="star" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">The STAR method</h2>
            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="font-semibold mb-1">S — Situation</h3>
                <p className="text-sm text-muted-foreground">
                  Two sentences of context: where you worked, what was at stake, when it happened.
                  Enough for the interviewer to picture it, no more.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-1">T — Task</h3>
                <p className="text-sm text-muted-foreground">
                  Your specific responsibility. Say "I owned" or "I was asked to", not "the team
                  needed to".
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-1">A — Action</h3>
                <p className="text-sm text-muted-foreground">
                  The bulk of the answer. Walk through what you did step by step, including the
                  options you rejected and why. This is where judgement shows.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-1">R — Result</h3>
                <p className="text-sm text-muted-foreground">
                  A number wherever one exists — time saved, incidents reduced, revenue protected —
                  plus one sentence on what you'd do differently.
                </p>
              </Card>
            </div>
          </section>

          <section id="examples" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">
              Common questions with answers
            </h2>
            <div className="space-y-5">
              {questions.map((item) => (
                <div key={item.q}>
                  <h3 className="font-semibold mb-1">{item.q}</h3>
                  <p className="text-muted-foreground text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="mistakes" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">
              Mistakes that cost offers
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" /> Do this
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Say "I" when describing your actions</li>
                  <li>Pick one story and finish it</li>
                  <li>Quantify the result</li>
                  <li>Name the trade-off you made</li>
                  <li>Close with what changed afterwards</li>
                </ul>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" aria-hidden="true" /> Avoid this
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Hypotheticals: "I would usually..."</li>
                  <li>Blaming a manager, team or vendor</li>
                  <li>A "weakness" that is a humblebrag</li>
                  <li>Five minutes of background before the point</li>
                  <li>Stories with no outcome at all</li>
                </ul>
              </Card>
            </div>
          </section>

          <section id="prep" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">
              How to prepare in a week
            </h2>
            <ol className="space-y-3 text-muted-foreground list-decimal pl-5">
              <li>
                List every project, incident and disagreement from your last two roles — raw notes,
                no structure yet.
              </li>
              <li>
                Pick six to eight that cover failure, conflict, leadership, pressure, initiative,
                learning, ambiguity and influence without authority.
              </li>
              <li>Write each one in STAR form, capped at 200 words.</li>
              <li>
                Find the number in every story. If there isn't one, reconstruct a defensible
                estimate and say it's an estimate.
              </li>
              <li>
                Say them out loud and time them. Anything over two minutes gets cut from the
                Situation, never the Action.
              </li>
              <li>
                Rehearse against real questions in the{" "}
                <Link to="/modules/mock-interview" className="text-primary hover:underline">
                  AI mock interview
                </Link>{" "}
                until the structure is automatic.
              </li>
            </ol>
          </section>

          <section id="faq" className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4">
              Frequently asked questions
            </h2>
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
              Practise these answers out loud
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Intervixa AI runs voice mock interviews and scenario drills so you rehearse under
              something close to real pressure, with feedback after every answer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/modules/mock-interview">
                  Start a mock interview{" "}
                  <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/modules/scenario-questions">Practise scenario questions</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/guide/ats-optimization">Read the ATS resume guide</Link>
              </Button>
            </div>
          </Card>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BehavioralInterviewGuide;
