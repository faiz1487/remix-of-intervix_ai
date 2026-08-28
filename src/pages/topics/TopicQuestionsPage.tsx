import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTopicPage, type TopicPage } from "@/data/topic-pages";

const BASE_URL = "https://intervixa.online";

interface Item {
  id: string;
  heading: string;
  context?: string | null;
  hint?: string | null;
  answer?: string | null;
  explanation?: string | null;
  difficulty?: string | null;
  tag?: string | null;
}

const TopicQuestionsPage = ({ slug }: { slug: string }) => {
  const page = getTopicPage(slug) as TopicPage;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      if (page.kind === "interview") {
        let q = supabase
          .from("interview_questions")
          .select("id,question,hint,answer,explanation,difficulty,topic")
          .order("created_at", { ascending: true })
          .limit(20);
        if (page.topics.length) q = q.in("topic", page.topics);
        const { data } = await q;
        if (!active) return;
        setItems(
          (data ?? []).map((r) => ({
            id: r.id,
            heading: r.question,
            hint: r.hint,
            answer: r.answer,
            explanation: r.explanation,
            difficulty: r.difficulty,
            tag: r.topic,
          })),
        );
      } else {
        let q = supabase
          .from("scenario_questions")
          .select("id,title,description,scenario,hint,answer,explanation,difficulty,technology")
          .order("created_at", { ascending: true })
          .limit(20);
        if (page.topics.length) q = q.in("technology", page.topics);
        const { data } = await q;
        if (!active) return;
        setItems(
          (data ?? []).map((r) => ({
            id: r.id,
            heading: r.title,
            context: r.description ?? r.scenario,
            hint: r.hint,
            answer: r.answer,
            explanation: r.explanation,
            difficulty: r.difficulty,
            tag: r.technology,
          })),
        );
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [page]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.h1,
      description: page.description,
      datePublished: "2026-08-26",
      dateModified: "2026-08-26",
      author: { "@type": "Organization", name: "Intervixa AI" },
      publisher: { "@type": "Organization", name: "Intervixa AI" },
      mainEntityOfPage: `${BASE_URL}/${page.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
        { "@type": "ListItem", position: 2, name: page.h1, item: `${BASE_URL}/${page.slug}` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        path={`/${page.slug}`}
        ogType="article"
        title={page.title}
        description={page.description}
        jsonLd={jsonLd}
      />
      <Navbar />

      <main className="container px-6 py-16 max-w-3xl">
        <BackButton />
        <article>
          <header className="mb-10">
            <p className="text-sm text-primary font-medium mb-3">{page.eyebrow}</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {page.h1}
            </h1>
            <p className="text-lg text-muted-foreground">{page.intro}</p>
          </header>

          <section className="mb-12" aria-labelledby="how-to-prepare">
            <h2 id="how-to-prepare" className="font-display text-2xl font-semibold mb-4">
              How to prepare
            </h2>
            <ul className="space-y-2.5 text-muted-foreground list-disc pl-5">
              {page.prepPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>

          <section className="mb-12" aria-labelledby="questions">
            <h2 id="questions" className="font-display text-2xl font-semibold mb-6">
              {page.kind === "interview" ? "Questions with answers" : "Scenarios with solutions"}
            </h2>

            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Loading questions…
              </div>
            ) : items.length === 0 ? (
              <p className="text-muted-foreground">
                No questions published for this topic yet. Browse the{" "}
                <Link to="/modules/interview-questions" className="text-primary hover:underline">
                  full interview question bank
                </Link>{" "}
                in the meantime.
              </p>
            ) : (
              <ol className="space-y-5 list-none pl-0">
                {items.map((item, i) => (
                  <li key={item.id}>
                    <Card className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold leading-snug">
                          <span className="text-primary mr-2">{i + 1}.</span>
                          {item.heading}
                        </h3>
                        {item.difficulty && (
                          <Badge variant="secondary" className="shrink-0 capitalize">
                            {item.difficulty}
                          </Badge>
                        )}
                      </div>

                      {item.context && (
                        <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                          {item.context}
                        </p>
                      )}

                      {item.hint && (
                        <p className="text-sm text-muted-foreground mb-3 flex gap-2">
                          <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                          <span>
                            <strong className="text-foreground">Hint:</strong> {item.hint}
                          </span>
                        </p>
                      )}

                      {item.answer && (
                        <div className="text-sm text-muted-foreground whitespace-pre-line">
                          <strong className="text-foreground">Answer:</strong> {item.answer}
                        </div>
                      )}

                      {item.explanation && (
                        <div className="text-sm text-muted-foreground whitespace-pre-line mt-3">
                          <strong className="text-foreground">Why:</strong> {item.explanation}
                        </div>
                      )}
                    </Card>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <Card className="p-6 mb-12 bg-primary/5 border-primary/20">
            <h2 className="font-display text-xl font-semibold mb-2">
              Practise these with an AI interviewer
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Sign up free to run voice mock interviews, get AI feedback on your answers and score your
              resume against real Cloud and DevOps job descriptions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/login?next=/chat">
                  Start free practice
                  <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/modules/interview-questions">
                  <Sparkles className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  Browse the full question bank
                </Link>
              </Button>
            </div>
          </Card>

          <section className="mb-12" aria-labelledby="faq">
            <h2 id="faq" className="font-display text-2xl font-semibold mb-4">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {page.faqs.map((f) => (
                <Card key={f.q} className="p-5">
                  <h3 className="font-semibold mb-2">{f.q}</h3>
                  <p className="text-sm text-muted-foreground">{f.a}</p>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="related">
            <h2 id="related" className="font-display text-2xl font-semibold mb-4">
              Related preparation guides
            </h2>
            <ul className="space-y-2">
              {page.related.map((slugRef) => {
                const rel = getTopicPage(slugRef);
                if (!rel) return null;
                return (
                  <li key={slugRef}>
                    <Link to={`/${rel.slug}`} className="text-primary hover:underline">
                      {rel.h1}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link to="/roadmap" className="text-primary hover:underline">
                  Cloud &amp; DevOps career roadmap
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default TopicQuestionsPage;
