import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Seo from "@/components/Seo";

const safeNext = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : null;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const next = safeNext(new URLSearchParams(window.location.search).get("next"));
    const go = () => {
      if (next) {
        window.location.replace(next);
      } else {
        navigate("/chat", { replace: true });
      }
    };

    // Check session first, clear stale tokens if needed
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        // Stale session from a different project — clear it
        supabase.auth.signOut();
        setChecking(false);
        return;
      }
      if (session) {
        go();
      }
      setChecking(false);
    });

    // Listen for auth changes (e.g. OAuth redirect completing)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        go();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const next = safeNext(new URLSearchParams(window.location.search).get("next"));
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri:
        window.location.origin + "/login" + (next ? `?next=${encodeURIComponent(next)}` : ""),
    });
    if (error) {
      setError("Failed to sign in with Google. Please try again.");
      setLoading(false);
    }
  };


  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Seo
        path="/login"
        title="Sign in to Intervixa AI"
        description="Sign in to Intervixa AI to access your AI resume builder, interview prep modules and job search tools."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Welcome to Intervixa AI
            </h1>
            <p className="text-muted-foreground text-sm mt-2 text-center">
              Sign in to access AI-powered interview preparation tools
            </p>
          </div>

          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-12 bg-card border border-border hover:bg-secondary text-foreground font-medium flex items-center justify-center gap-3 rounded-xl transition-all"
            variant="outline"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </Button>

          {error && (
            <p className="text-destructive text-sm text-center mt-4">{error}</p>
          )}

          <p className="text-muted-foreground text-xs text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
