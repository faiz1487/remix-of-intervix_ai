import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquareHeart, Send, Star, Loader2 } from "lucide-react";
import Seo from "@/components/Seo";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATEGORIES = ["Suggestion", "Bug Report", "Feature Request", "Content Issue", "Other"];

interface FeedbackRow {
  id: string;
  category: string;
  rating: number;
  message: string;
  created_at: string;
}

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Suggestion");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [mine, setMine] = useState<FeedbackRow[]>([]);

  const loadMine = async () => {
    const { data } = await supabase
      .from("feedback")
      .select("id, category, rating, message, created_at")
      .order("created_at", { ascending: false });
    if (data) setMine(data as FeedbackRow[]);
  };

  useEffect(() => {
    loadMine();
  }, []);

  const submit = async () => {
    if (message.trim().length < 5) {
      toast.error("Please write a bit more detail");
      return;
    }
    setSubmitting(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) throw new Error("Not signed in");

      const { error } = await supabase.from("feedback").insert({
        user_id: user.id,
        user_email: user.email ?? "",
        user_name: (user.user_metadata?.full_name as string) ?? (user.user_metadata?.name as string) ?? "",
        category,
        rating,
        message: message.trim(),
      });
      if (error) throw error;

      toast.success("Thanks! Your feedback has been sent.");
      setMessage("");
      setRating(5);
      setCategory("Suggestion");
      loadMine();
    } catch (err: any) {
      toast.error(err.message ?? "Could not submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        path="/modules/feedback"
        title="Feedback & Suggestions — Intervixa AI"
        description="Share your feedback, suggestions and feature requests to help improve Intervixa AI."
      />

      <div className="container max-w-4xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <ModuleHeader
            title="Feedback & Suggestions"
            description="Tell us what to improve. Your suggestions go straight to the Intervixa team."
            icon={<MessageSquareHeart className="w-5 h-5 text-primary" />}
          />
        </motion.div>

        <Card className="p-6 glass space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Your rating</Label>
              <div className="flex items-center gap-1.5 h-10">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`Rate ${n} out of 5`}
                    onClick={() => setRating(n)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${n <= rating ? "text-primary fill-primary" : "text-muted-foreground"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-message">Your suggestion</Label>
            <Textarea
              id="feedback-message"
              rows={6}
              placeholder="What should we build, fix or improve?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="feedback-consent"
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
              className="mt-0.5"
            />
            <Label htmlFor="feedback-consent" className="text-sm font-normal text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <Link to="/privacy-policy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/terms-and-conditions" className="underline hover:text-foreground">
                Terms &amp; Conditions
              </Link>
              , and consent to Intervixa AI processing the details I submit here.
            </Label>
          </div>

          <Button onClick={submit} disabled={submitting || !consent} className="w-full sm:w-auto">
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Submit feedback
          </Button>
        </Card>

        {mine.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold font-display mb-4">Your previous feedback</h2>
            <div className="space-y-3">
              {mine.map((f) => (
                <Card key={f.id} className="p-4 glass">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="secondary">{f.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {f.rating}/5 · {new Date(f.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{f.message}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
