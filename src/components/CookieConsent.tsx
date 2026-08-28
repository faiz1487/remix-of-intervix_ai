import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { readConsent, writeConsent } from "@/lib/cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setPreferences(existing.preferences);
      setAnalytics(existing.analytics);
    } else {
      setVisible(true);
    }

    const reopen = () => {
      const current = readConsent();
      if (current) {
        setPreferences(current.preferences);
        setAnalytics(current.analytics);
      }
      setOpen(true);
    };
    window.addEventListener("intervixa:cookie-preferences", reopen);
    return () => window.removeEventListener("intervixa:cookie-preferences", reopen);
  }, []);

  const save = (choice: { preferences: boolean; analytics: boolean }) => {
    writeConsent(choice);
    setPreferences(choice.preferences);
    setAnalytics(choice.analytics);
    setVisible(false);
    setOpen(false);
  };

  return (
    <>
      {visible && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
        >
          <div className="container max-w-5xl rounded-xl border border-border bg-card/95 backdrop-blur shadow-lg p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex gap-3 flex-1">
              <Cookie className="w-5 h-5 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                We use cookies to keep you signed in, remember your preferences and understand how
                Intervixa AI is used. You can accept all, reject non-essential cookies, or choose
                what you allow. Read our{" "}
                <Link to="/cookie-policy" className="underline hover:text-foreground">
                  Cookie Policy
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 lg:shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
                Manage Preferences
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => save({ preferences: false, analytics: false })}
              >
                Reject Non-Essential
              </Button>
              <Button
                size="sm"
                className="bg-gradient-primary text-primary-foreground"
                onClick={() => save({ preferences: true, analytics: true })}
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Choose which categories of cookies Intervixa AI may use. Strictly necessary cookies
              are always active because the site cannot work without them.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <Label className="text-sm font-medium">Strictly necessary</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Sign-in sessions, security and core functionality. Always on.
                </p>
              </div>
              <Switch checked disabled aria-label="Strictly necessary cookies (always on)" />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="pref-cookies" className="text-sm font-medium">
                  Preferences
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Remembers choices such as light or dark theme.
                </p>
              </div>
              <Switch id="pref-cookies" checked={preferences} onCheckedChange={setPreferences} />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="analytics-cookies" className="text-sm font-medium">
                  Analytics
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Helps us understand which features are used, in aggregate.
                </p>
              </div>
              <Switch id="analytics-cookies" checked={analytics} onCheckedChange={setAnalytics} />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() => save({ preferences: false, analytics: false })}
            >
              Reject Non-Essential
            </Button>
            <Button onClick={() => save({ preferences, analytics })}>Save Preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
