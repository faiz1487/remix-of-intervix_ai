import Seo from "@/components/Seo";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

const UPDATED = "23 August 2026";

const TermsAndConditions = () => (
  <>
    <Seo
      path="/terms-and-conditions"
      title="Terms & Conditions — Intervixa AI"
      description="The terms that govern your use of Intervixa AI, including account rules, subscription terms, acceptable use, AI output disclaimers and governing law in India."
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Terms & Conditions",
        url: "https://intervixa.online/terms-and-conditions",
        dateModified: "2026-08-23",
      }}
    />
    <LegalPageLayout
      title="Terms & Conditions"
      intro="These terms form an agreement between you and Intervixa AI. By creating an account or using intervixa.online you accept them."
      updated={UPDATED}
    >
      <section>
        <h2>1. Eligibility</h2>
        <p>
          You must be at least 18 years old and able to enter into a binding contract under Indian
          law to use Intervixa AI. By using the service you confirm that the information you give
          us is accurate.
        </p>
      </section>

      <section>
        <h2>2. Your account</h2>
        <p>
          You are responsible for activity on your account and for keeping your sign-in method
          secure. One account is for one person; do not share credentials or resell access. Tell us
          at <a href="mailto:support@intervixa.online">support@intervixa.online</a> if you notice
          unauthorised use.
        </p>
      </section>

      <section>
        <h2>3. Subscriptions and payments</h2>
        <p>
          Some features are offered as paid or promotional plans, including limited launch offers.
          The price, duration and inclusions shown at the time of purchase apply to that purchase.
          Prices are in Indian Rupees and include applicable taxes unless stated otherwise. Access
          starts once payment is confirmed and runs for the stated period.
        </p>
        <p>
          Because access to digital content is granted immediately, payments are generally
          non-refundable. If you were charged in error or could not access what you paid for, write
          to us within 7 days of the charge and we will review the request in good faith.
        </p>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <ul>
          <li>Do not upload unlawful, infringing, hateful or misleading content.</li>
          <li>Do not upload another person's resume or contact data without their permission.</li>
          <li>
            Do not scrape, reverse engineer, overload or attempt to gain unauthorised access to the
            service or its APIs.
          </li>
          <li>Do not use the service to send spam or bulk unsolicited outreach.</li>
          <li>Do not misrepresent AI-generated content as verified employer information.</li>
        </ul>
      </section>

      <section>
        <h2>5. AI-generated content</h2>
        <p>
          Resume feedback, ATS scores, interview questions, job matches, profile suggestions and
          chat answers are generated with the help of AI models and are provided for guidance only.
          They may be incomplete or inaccurate, and job listings and recruiter details may change
          or expire. You are responsible for reviewing everything before you send it to an
          employer. Intervixa AI does not promise interviews, job offers, salary outcomes or any
          specific result.
        </p>
      </section>

      <section>
        <h2>6. Intellectual property</h2>
        <p>
          The Intervixa AI platform, brand, design and content are owned by us and protected by
          law. You keep ownership of the resumes and other content you upload, and you grant us a
          limited licence to store and process that content solely to provide the service to you.
        </p>
      </section>

      <section>
        <h2>7. Third-party links and services</h2>
        <p>
          The service links to external job boards, company sites and professional networks. We do
          not control those sites and are not responsible for their content, accuracy or their
          handling of your data.
        </p>
      </section>

      <section>
        <h2>8. Availability and changes</h2>
        <p>
          We work to keep Intervixa AI available, but the service is provided "as is" and may be
          interrupted for maintenance, updates or reasons outside our control. We may add, change
          or discontinue features over time.
        </p>
      </section>

      <section>
        <h2>9. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, Intervixa AI is not liable for indirect,
          incidental or consequential losses, including lost opportunities or lost earnings arising
          from your use of the service. Our total liability for any claim is limited to the amount
          you paid us in the twelve months before the claim arose.
        </p>
      </section>

      <section>
        <h2>10. Termination</h2>
        <p>
          You can stop using the service and request deletion of your account at any time. We may
          suspend or terminate accounts that breach these terms or that put the platform or other
          users at risk.
        </p>
      </section>

      <section>
        <h2>11. Governing law</h2>
        <p>
          These terms are governed by the laws of India. The courts at Noida, Uttar Pradesh, have
          exclusive jurisdiction over any dispute arising from them.
        </p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          Intervixa AI, Noida, Uttar Pradesh, India
          <br />
          Email: <a href="mailto:support@intervixa.online">support@intervixa.online</a>
        </p>
      </section>
    </LegalPageLayout>
  </>
);

export default TermsAndConditions;
