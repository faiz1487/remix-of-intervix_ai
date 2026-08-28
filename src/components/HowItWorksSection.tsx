import { motion } from "framer-motion";
import { Upload, Brain, Rocket } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload or Describe",
    desc: "Paste your resume, share a job description, or describe your target role.",
  },
  {
    icon: Brain,
    title: "AI Analyzes & Prepares",
    desc: "Our AI scores your resume, generates interview prep, and finds opportunities.",
  },
  {
    icon: Rocket,
    title: "Apply & Get Hired",
    desc: "Use optimized materials, practice with mock interviews, and land the job.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-28 bg-muted/30" id="how-it-works">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">Three simple steps to accelerate your career.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-6 flex items-center justify-center shadow-glow">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                Step {i + 1}
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
