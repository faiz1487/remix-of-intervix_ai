import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      <div className="aurora" />
      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
            Ready to <span className="text-gradient-animated">Get Hired?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Join thousands of professionals who landed their dream jobs with Intervixa AI.
          </p>
          <Button asChild size="lg" className="btn-shine press bg-gradient-primary text-primary-foreground font-semibold px-10 py-6 text-lg shadow-glow hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300">
            <Link to="/chat">
              Start Free Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
