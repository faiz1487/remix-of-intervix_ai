import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

interface LegalPageLayoutProps {
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
}

export const LegalPageLayout = ({ title, intro, updated, children }: LegalPageLayoutProps) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container px-6 pt-28 pb-16 max-w-3xl">
      <BackButton />
      <header className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold">{title}</h1>
        <p className="mt-3 text-muted-foreground">{intro}</p>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
      </header>
      <div className="space-y-8 text-sm sm:text-base leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_p]:mt-2 [&_a]:underline hover:[&_a]:text-foreground">
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

export default LegalPageLayout;
