import { Sparkles, Linkedin, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { openCookiePreferences } from "@/lib/cookie-consent";
import ContactDialog from "@/components/ContactDialog";
import { TOPIC_PAGES } from "@/data/topic-pages";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/https-intervixa.online",
    icon: Linkedin,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61592610592592",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/intervixa.ai/",
    icon: Instagram,
  },
];

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container px-6 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-sm">Intervixa AI</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/guide/ats-optimization" className="hover:text-foreground transition-colors">
            ATS resume guide
          </Link>
          <Link
            to="/guide/behavioral-interview-questions"
            className="hover:text-foreground transition-colors"
          >
            Behavioral interview guide
          </Link>
          <ContactDialog>
            <button className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
              Contact Us
            </button>
          </ContactDialog>
        </nav>
        <div className="flex items-center gap-2">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h2 className="text-sm font-semibold mb-3">Free interview prep guides</h2>
        <nav
          aria-label="Interview prep guides"
          className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground"
        >
          {TOPIC_PAGES.map((p) => (
            <Link
              key={p.slug}
              to={`/${p.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {p.h1}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border pt-6">
        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
        >
          <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms-and-conditions" className="hover:text-foreground transition-colors">
            Terms &amp; Conditions
          </Link>
          <Link to="/cookie-policy" className="hover:text-foreground transition-colors">
            Cookie Policy
          </Link>
          <button
            type="button"
            onClick={openCookiePreferences}
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            Cookie preferences
          </button>
        </nav>
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} Intervixa AI. Prepare smarter, get hired faster.
        </p>
      </div>
    </div>
  </footer>
);


export default Footer;
