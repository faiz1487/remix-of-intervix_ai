import Seo from "@/components/Seo";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

const UPDATED = "23 August 2026";

const PrivacyPolicy = () => (
  <>
    <Seo
      path="/privacy-policy"
      title="Privacy Policy — Intervixa AI"
      description="How Intervixa AI collects, uses, stores and protects your personal data, your rights under India's DPDP Act 2023, and how to contact our Grievance Officer."
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Privacy Policy",
        url: "https://intervixa.online/privacy-policy",
        dateModified: "2026-08-23",
      }}
    />
    <LegalPageLayout
      title="Privacy Policy"
      intro="This policy explains what personal data Intervixa AI collects, why we collect it, and the choices you have. It applies to intervixa.online and all Intervixa AI features."
      updated={UPDATED}
    >
      <section>
        <h2>1. Who we are</h2>
        <p>
          Intervixa AI ("Intervixa AI", "we", "us") operates the interview preparation and career
          tools available at intervixa.online. We are based in Noida, Uttar Pradesh, India. For any
          privacy question you can write to{" "}
          <a href="mailto:support@intervixa.online">support@intervixa.online</a>.
        </p>
      </section>

      <section>
        <h2>2. Data we collect</h2>
        <ul>
          <li>
            <strong>Account data</strong> — name, email address and profile photo received from
            your sign-in provider when you create an account.
          </li>
          <li>
            <strong>Content you provide</strong> — resume text and uploaded resume files, job
            descriptions, LinkedIn or Naukri profile text, chat messages, mock interview responses
            and feedback you submit.
          </li>
          <li>
            <strong>Usage data</strong> — pages visited, features used, approximate device and
            browser information, and technical logs needed to keep the service running securely.
          </li>
          <li>
            <strong>Cookies and local storage</strong> — see our Cookie Policy for the categories
            we use and how to change your choice.
          </li>
        </ul>
        <p>
          We do not ask for financial account numbers, government identity numbers or sensitive
          personal data, and you should not include them in resumes or chats you upload.
        </p>
      </section>

      <section>
        <h2>3. How we use your data</h2>
        <ul>
          <li>To create and secure your account and keep you signed in.</li>
          <li>
            To deliver the features you request — resume building and ATS scoring, AI chat and mock
            interviews, job matching, profile optimisation and prep roadmaps.
          </li>
          <li>To respond to your feedback, questions and support requests.</li>
          <li>To monitor reliability, prevent abuse and improve the product.</li>
          <li>To meet legal or regulatory obligations that apply to us.</li>
        </ul>
        <p>
          We process this data to perform the service you signed up for, on the basis of the
          consent you give when you submit content, and for our legitimate interest in operating a
          secure platform.
        </p>
      </section>

      <section>
        <h2>4. Service providers</h2>
        <p>
          We rely on third-party providers to run Intervixa AI. Depending on the feature you use,
          your data may be processed by our cloud hosting and database provider, our authentication
          provider, AI model providers that generate resume feedback and interview answers, and
          voice or email delivery providers. These providers process data on our instructions and
          only for the purposes described above. We do not sell your personal data, and we do not
          share it for third-party advertising.
        </p>
      </section>

      <section>
        <h2>5. Storage, transfers and retention</h2>
        <p>
          Your data is stored on managed cloud infrastructure and may be processed on servers
          located outside India by the providers listed above. We keep account data for as long as
          your account is active. Content such as resumes, chats and feedback is kept while it is
          useful to you and is deleted when you delete it or when you ask us to delete your
          account. Logs required for security are kept for a limited period and then removed.
        </p>
      </section>

      <section>
        <h2>6. Security</h2>
        <p>
          We use access controls, encrypted connections and row-level database permissions so that
          your content is only accessible to your account and to authorised administrators. No
          online service can guarantee absolute security, so please use a strong sign-in method and
          tell us immediately if you suspect unauthorised access.
        </p>
      </section>

      <section>
        <h2>7. Your rights</h2>
        <p>
          Under India's Digital Personal Data Protection Act, 2023 and other applicable law, you
          may:
        </p>
        <ul>
          <li>Ask for a summary of the personal data we hold about you.</li>
          <li>Ask us to correct or complete inaccurate data.</li>
          <li>Ask us to erase your data and close your account.</li>
          <li>Withdraw consent you previously gave, without affecting past processing.</li>
          <li>Raise a grievance about how we handled your data.</li>
        </ul>
        <p>
          Write to <a href="mailto:support@intervixa.online">support@intervixa.online</a> and we
          will respond within a reasonable period.
        </p>
      </section>

      <section>
        <h2>8. Children</h2>
        <p>
          Intervixa AI is intended for job seekers aged 18 and above. We do not knowingly collect
          personal data from children. If you believe a child has provided us data, contact us and
          we will delete it.
        </p>
      </section>

      <section>
        <h2>9. Changes to this policy</h2>
        <p>
          We may update this policy as the product evolves. The "last updated" date at the top will
          always reflect the current version, and material changes will be highlighted in the app.
        </p>
      </section>

      <section>
        <h2>10. Contact and Grievance Officer</h2>
        <p>
          Grievance Officer, Intervixa AI
          <br />
          Email: <a href="mailto:support@intervixa.online">support@intervixa.online</a>
          <br />
          Noida, Uttar Pradesh, India
        </p>
      </section>
    </LegalPageLayout>
  </>
);

export default PrivacyPolicy;
