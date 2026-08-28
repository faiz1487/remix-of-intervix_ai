import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Clock, Gift, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const CARD_FEATURES = [
  "AI Mock Interviews",
  "ATS Resume Analysis",
  "AI Job Search",
  "Personalized Learning Roadmap",
  "Company Interview Questions",
];

const LaunchOfferPopup = () => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        timer = setTimeout(() => setOpen(true), 600);
      }
      setChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        setOpen(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!checked) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="gap-0 max-w-md rounded-3xl border border-border/60 bg-card p-0 shadow-card overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">
          Intervixa AI Launch Offer — 1 Year Free Premium Access
        </DialogTitle>
        <DialogDescription className="sr-only">
          Claim 1 year of free premium access to Intervixa AI. Available for the first 1,000 users only.
        </DialogDescription>

        <div className="p-8">
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
            <p className="mt-2 text-sm font-semibold text-foreground/80">1 Year Premium Access</p>
            <p className="text-xs text-muted-foreground">First 1,000 Users Only</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="btn-shine press mt-6 w-full rounded-xl bg-gradient-primary py-6 text-base font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
              onClick={() => setOpen(false)}
            >
              <Link to="/login?next=/chat">
                Claim This Offer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchOfferPopup;
