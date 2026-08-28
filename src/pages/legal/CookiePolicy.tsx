import Seo from "@/components/Seo";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { Button } from "@/components/ui/button";
import { openCookiePreferences } from "@/lib/cookie-consent";

const UPDATED = "23 August 2026";

const CookiePolicy = () => (
  <>
    <Seo
      path="/cookie-policy"
      title="Cookie Policy — Intervixa AI"
      description="Which cookies and local storage Intervixa AI uses, what each category does, and how to change or withdraw your cookie choices at any time."
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Cookie Policy",
        url: "https://intervixa.online/cookie-policy",
        dateModified: "2026-08-23",
      }}
    />
    <LegalPageLayout
      title="Cookie Policy"
      intro="This policy explains how Intervixa AI uses cookies and similar browser storage, and how you can control them."
      updated={UPDATED}
    >
      <section>
        <h2>1. What cookies are</h2>
        <p>
          Cookies are small text files a site stores in your browser. We also use local storage,
          which works in a similar way. Together they let the site remember who you are and what
          you chose between visits.
        </p>
      </section>

      <section>
        <h2>2. Categories we use</h2>
        <h3>Strictly necessary</h3>
        <p>
          Required for the site to work. These keep your sign-in session active, protect against
          abuse and remember your cookie choice itself. They cannot be switched off.
        </p>
        <h3>Preferences</h3>
        <p>
          Remember choices that personalise the interface, such as light or dark theme and
          collapsed panels. Turning these off means the site will not remember those settings.
        </p>
        <h3>Analytics</h3>
        <p>
          Help us understand, in aggregate, which features are used so we can improve them. These
          are only used if you allow them.
        </p>
        <p>
          We do not use advertising or cross-site tracking cookies, and we do not sell data
          collected through cookies.
        </p>
      </section>

      <section>
        <h2>3. Third-party cookies</h2>
        <p>
          Signing in through a third-party provider may set cookies controlled by that provider so
          the sign-in flow can complete. Pages that embed external content may also set cookies
          from those services. Their own policies govern that use.
        </p>
      </section>

      <section>
        <h2>4. Changing your choice</h2>
        <p>
          You can change what you allow at any time using the button below, or through the "Cookie
          preferences" link in the footer. You can also delete or block cookies in your browser
          settings, though strictly necessary cookies are required for sign-in to work.
        </p>
        <p>
          <Button variant="outline" size="sm" onClick={openCookiePreferences}>
            Manage cookie preferences
          </Button>
        </p>
      </section>

      <section>
        <h2>5. Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a href="mailto:support@intervixa.online">support@intervixa.online</a>. See also our
          Privacy Policy for how we handle personal data.
        </p>
      </section>
    </LegalPageLayout>
  </>
);

export default CookiePolicy;
