import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login", { replace: true });
      } else {
        setReady(true);
        setLoading(false);
      }
    });

    // Then check current session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        // Clear corrupted/stale session from a different project
        supabase.auth.signOut().then(() => {
          navigate("/login", { replace: true });
          setLoading(false);
        });
        return;
      }
      if (!session) {
        navigate("/login", { replace: true });
      } else {
        setReady(true);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!ready) return null;
  return <>{children}</>;
};

export default AuthGuard;
