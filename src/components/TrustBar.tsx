import { useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import storyShivani from "@/assets/story-shivani.png.asset.json";
import storyRahul from "@/assets/story-rahul.png.asset.json";
import storyRishabh from "@/assets/story-rishabh.png.asset.json";

const successStories = [
  { src: storyRishabh.url, alt: "Rishabh Sharma hired as DevOps Engineer at CloudNexa — 6 LPA" },
  { src: storyRahul.url, alt: "Rahul Singh hired as DevOps Engineer at Nexora Systems — 4 LPA" },
  { src: storyShivani.url, alt: "Shivani Singh hired as SRE Engineer at CloudOrigin — 5 LPA" },
];


const companies = [
  { name: "Amazon", domain: "amazon.com" },
  { name: "TCS", domain: "tcs.com" },
  { name: "Infosys", domain: "infosys.com" },
  { name: "Accenture", domain: "accenture.com" },
  { name: "Wipro", domain: "wipro.com" },
  { name: "Capgemini", domain: "capgemini.com" },
  { name: "Cognizant", domain: "cognizant.com" },
  { name: "HCLTech", domain: "hcl.com" },
];

const logoToken = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY;

const CompanyLogo = ({ name, domain }: { name: string; domain: string }) => {
  const [failed, setFailed] = useState(false);

  if (!logoToken || failed) {
    return (
      <span className="font-display text-lg md:text-2xl font-bold text-slate-900 whitespace-nowrap">
        {name}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full">
      <div className="w-full h-10 md:h-12 flex items-center justify-center">
        <img
          src={`https://img.logo.dev/${domain}?token=${logoToken}&size=200&format=png&retina=true`}
          alt={`${name} logo`}
          loading="lazy"
          width={160}
          height={64}
          onError={() => setFailed(true)}
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-xs md:text-sm font-semibold text-slate-700 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
};

const testimonials = [
  {
    quote:
      "ATS score 54 se 91 pahunch gaya. Do hafte me hi 4 interview calls aa gaye.",
    name: "Rahul S.",
    role: "DevOps Engineer",
  },
  {
    quote:
      "Scenario questions bilkul real interviews jaise the — mera confidence double ho gaya.",
    name: "Priya M.",
    role: "Cloud Engineer",
  },
  {
    quote:
      "HR contacts aur cold email templates se direct recruiters tak reach mila.",
    name: "Aman K.",
    role: "SRE",
  },
  {
    quote:
      "Mock interviews ne meri communication skills polish kari. Final round clear karne me badi madad mili.",
    name: "Sneha R.",
    role: "AWS Solutions Architect",
  },
  {
    quote:
      "Resume builder se ATS-friendly format mila aur AI feedback ne weak points clearly bataye.",
    name: "Vikram T.",
    role: "Kubernetes Admin",
  },
  {
    quote:
      "Prep roadmap ne mujhe Linux se lekar Terraform tak structured tarike se prepare kiya.",
    name: "Neha G.",
    role: "Platform Engineer",
  },
];

const TrustBar = () => {
  return (
    <section className="relative border-y border-border/30 bg-card/20 py-12" aria-label="Trusted by professionals">
      <div className="container px-6">
        {/* Logo / company strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Trusted by candidates hired at
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="flex w-max gap-4 md:gap-5 marquee-track py-2">
              {[...companies, ...companies].map((c, i) => (
                <div
                  key={`${c.name}-${i}`}
                  className="group shrink-0 flex items-center justify-center rounded-xl bg-white px-5 py-3 md:px-7 md:py-4 shadow-md border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
                >
                  <CompanyLogo name={c.name} domain={c.domain} />
                </div>
              ))}
            </div>
          </div>

        </motion.div>

        {/* Success story cards marquee */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-14"
        >
          <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Real success stories
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max gap-6 stories-track">
              {[...successStories, ...successStories].map((s, i) => (
                <motion.figure
                  key={`${s.alt}-${i}`}
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  className="group relative w-[300px] md:w-[420px] shrink-0 rounded-2xl glass card-interactive p-2"
                >
                  <img
                    src={s.src}
                    alt={s.alt}
                    loading="lazy"
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </motion.figure>
              ))}
            </div>
          </div>
        </motion.div>


        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Loved by Cloud & DevOps professionals
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max gap-5 testimonials-track">
              {[...testimonials, ...testimonials].map((t, i) => (
                <motion.figure
                  key={`${t.name}-${i}`}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="group relative w-[320px] md:w-[380px] shrink-0 p-6 rounded-xl glass card-interactive"
                >
                  <Quote className="w-6 h-6 text-primary/60 mb-3 transition-transform duration-300 group-hover:scale-110" />
                  <blockquote className="text-sm text-foreground/90 leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                      ))}
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBar;
