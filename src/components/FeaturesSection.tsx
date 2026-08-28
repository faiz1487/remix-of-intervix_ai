import { motion } from "framer-motion";
import {
  FileSearch,
  FilePlus2,
  MessageSquareMore,
  AlertTriangle,
  Map,
  Mic,
  ExternalLink,
  UserSearch,
  Mail,
  Linkedin,
  Briefcase,
  Target,
} from "lucide-react";

const modules = [
  { icon: FileSearch, title: "ATS Resume Sample", desc: "Download professionally crafted ATS-friendly resume samples." },
  { icon: FilePlus2, title: "Resume Creator", desc: "Generate fully ATS-optimized resumes tailored to any role." },
  { icon: MessageSquareMore, title: "Interview Questions", desc: "Role-specific technical, behavioral, and system design questions." },
  { icon: AlertTriangle, title: "Scenario Questions", desc: "Real-world production scenarios with ideal troubleshooting strategies." },
  { icon: Map, title: "Prep Roadmap", desc: "Week-by-week structured interview preparation plan." },
  { icon: Mic, title: "Mock Interview", desc: "AI interviewer scores your answers and suggests improvements." },
  { icon: ExternalLink, title: "Job Apply Links", desc: "Curated job listings with direct apply links from top boards." },
  { icon: UserSearch, title: "HR Contact Finder", desc: "Find recruiters and HR contacts at your target companies." },
  { icon: Mail, title: "Cold Email Generator", desc: "Professional outreach emails and LinkedIn messages." },
  { icon: Linkedin, title: "LinkedIn Optimizer", desc: "Optimize your headline, about section, and SEO keywords." },
  { icon: Briefcase, title: "Naukri Optimizer", desc: "Boost your Naukri profile for recruiter search visibility." },
  { icon: Target, title: "AI Job Match", desc: "AI-scored Cloud & DevOps jobs matched to your resume with auto-apply." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section className="py-24 md:py-28 relative" id="features">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
            The toolkit
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            12 Powerful <span className="text-gradient">AI Modules</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to land your dream job — powered by AI that thinks like a recruiter.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr"
        >
          {modules.map((mod) => {

            return (
              <motion.div
                key={mod.title}
                variants={item}
                className="group relative overflow-hidden card-interactive glow-ring p-6 rounded-2xl glass cursor-default h-full"
              >
                <span className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 group-hover:shadow-glow">
                    <mod.icon className="w-5 h-5 text-primary transition-transform duration-300 group-hover:-rotate-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-1.5 transition-colors duration-300 group-hover:text-primary">
                      {mod.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{mod.desc}</p>
                  </div>
                </div>
                <span className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gradient-primary transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesSection;
