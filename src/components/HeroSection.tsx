import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Cpu, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ShaderBackground from "@/components/ui/shader-background";

const stats = [
  { value: 12, suffix: "+", label: "AI Modules" },
  { value: 98, suffix: "%", label: "ATS Score Boost" },
  { value: 500, suffix: "+", label: "Candidates Prepared" },
];

const techTags = [
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Jenkins",
  "Linux",
  "Python",
];

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

const StatItem = ({ stat, active }: { stat: (typeof stats)[number]; active: boolean }) => {
  const value = useCountUp(stat.value, active);
  return (
    <div className="hover-lift">
      <div className="text-3xl md:text-4xl font-bold font-display text-gradient-animated tabular-nums">
        {value}
        {stat.suffix}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
    </div>
  );
};

const HeroSection = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(statsRef, { once: true, margin: "-40px" });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-hero pt-28 pb-20 md:pt-32 md:pb-24">
      {/* Animated shader backdrop */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <ShaderBackground className="block w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-background/50 pointer-events-none" />
      <div className="aurora" />

      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-glow/5 blur-[120px] pointer-events-none float-slow" />

      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 glow-pulse hover-lift"
          >
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-Powered Cloud & DevOps Career Platform
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.08] mb-5">
            Master Cloud & DevOps.{" "}
            <span className="text-gradient-animated">Get Interview Ready.</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 font-body leading-relaxed">
            AI-powered mock interviews, DevOps assessments, resume optimization and
            career guidance built specifically for Cloud & DevOps professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group btn-shine press bg-gradient-primary text-primary-foreground font-semibold px-8 py-6 text-base md:text-lg shadow-glow hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300">
              <Link to="/chat">
                Start Free Interview
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("features")}
              className="press glow-ring rounded-lg px-8 py-6 text-base md:text-lg border-border hover:bg-secondary transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Features
            </Button>
          </div>

          {/* Reassurance row */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm text-muted-foreground"
          >
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> No credit card required</li>
            <li className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-primary" /> Results in under 60 seconds</li>
            <li className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-primary" /> Built for Cloud &amp; DevOps roles</li>
          </motion.ul>

          {/* Technology tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            {techTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/60 text-secondary-foreground border border-border/60 hover:border-primary/40 hover:bg-secondary transition-colors"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="grid grid-cols-3 gap-6 mt-12 max-w-xl mx-auto glass rounded-2xl py-6 px-4"
          >
            {stats.map((stat) => (
              <StatItem key={stat.label} stat={stat} active={inView} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
