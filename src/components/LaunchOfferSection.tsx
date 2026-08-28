import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Flame, Gift, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";


const FEATURES = [
  "AI Mock Interviews",
  "ATS Resume Analysis",
  "AI Job Search",
  "Personalized Learning Roadmap",
  "Company-Specific Interview Questions",
  "AI Career Assistant",
];

const CARD_FEATURES = [
  "AI Mock Interviews",
  "ATS Resume Analysis",
  "AI Job Search",
  "Personalized Learning Roadmap",
  "Company Interview Questions",
];

const FALLBACK_CLAIMED = 247;
const TOTAL = 1000;

const LaunchOfferSection = () => {
  const [claimed, setClaimed] = useState(FALLBACK_CLAIMED);

  useEffect(() => {
    let active = true;
    supabase.functions
      .invoke("claimed-spots")
      .then(({ data }) => {
        if (active && data?.claimed) setClaimed(data.claimed);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const percent = Math.round((claimed / TOTAL) * 100);


  return (
    <section
      aria-labelledby="launch-offer-heading"
      className="relative overflow-hidden bg-hero py-20 md:py-28"
    >
      {/* Floating glowing shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-primary/15 blur-[110px] float-slow" />
        <div className="absolute bottom-[-8rem] right-[-6rem] h-96 w-96 rounded-full bg-glow-secondary/20 blur-[130px] float-slow" />
        <div className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-[90px]" />
      </div>

      <div className="container relative z-10 px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 glass px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Rocket className="h-4 w-4 text-primary" />
              Limited Time Launch Offer
            </span>

            <div className="relative mt-6">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-full bg-primary/15 blur-3xl"
              />
              <h2
                id="launch-offer-heading"
                className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl"
              >
                Get 1 Year <span className="text-gradient-animated">FREE</span> Access to Intervixa AI
              </h2>
            </div>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Prepare smarter, crack interviews faster, and land your dream job with AI. Join today
              and unlock 1 year of premium access absolutely FREE. Available only for the first
              1,000 users.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {FEATURES.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-2 text-sm text-foreground/90 md:text-base"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </span>
                  {feature}
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="btn-shine press rounded-xl bg-gradient-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
              >
                <Link to="/chat">🎉 Claim Free Access</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="press rounded-xl glow-ring border-border bg-transparent px-8 py-6 text-base font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary"
              >
                <a href="#how-it-works">Explore how it works</a>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 font-semibold text-primary">
                <Flame className="h-4 w-4" /> First 1,000 Users Only
              </span>
              <span>No Credit Card Required</span>
            </div>
          </motion.div>

          {/* Right: premium card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mx-auto w-full max-w-md"
          >
            <div className="group rounded-3xl border border-border/60 bg-card p-8 shadow-card backdrop-blur transition-transform duration-300 hover:scale-[1.02]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary">
                  <Gift className="h-3.5 w-3.5" /> Exclusive Launch Offer
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
                  <Clock className="h-3.5 w-3.5" /> Limited Time Offer
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {CARD_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm font-medium text-card-foreground/85"
                  >
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl bg-secondary/50 p-6 text-center">
                <p className="text-lg font-semibold text-destructive line-through">₹499</p>
                <p className="font-display text-5xl font-bold text-gradient-animated">FREE</p>
                <p className="mt-2 text-sm font-semibold text-foreground/80">
                  1 Year Premium Access
                </p>
                <p className="text-xs text-muted-foreground">First 1,000 Users Only</p>
              </div>

              <Button
                asChild
                size="lg"
                className="btn-shine press mt-6 w-full rounded-xl bg-gradient-primary py-6 text-base font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
              >
                <Link to="/chat">
                  Claim Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Progress */}
            <div className="mt-6 rounded-2xl border border-border/60 glass p-5 backdrop-blur-md">
              <div className="flex items-center justify-between text-sm font-medium text-foreground">
                <span>Free Spots Claimed</span>
                <span className="text-primary">
                  {claimed} / {TOTAL}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={claimed}
                aria-valuemin={0}
                aria-valuemax={TOTAL}
                aria-label="Free spots claimed"
                className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary"
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-glow-secondary"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LaunchOfferSection;
