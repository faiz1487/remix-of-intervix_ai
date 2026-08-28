import type { ResumeData } from "@/pages/ATSResumeBuilder";

interface Props {
  data: ResumeData;
  isEditing: boolean;
  onChange: (data: ResumeData) => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-primary border-b border-primary/20 pb-1.5 mb-3">
    {children}
  </h3>
);

const ResumePreview = ({ data, isEditing, onChange }: Props) => {
  const editableProps = (field: string) =>
    isEditing
      ? {
          contentEditable: true,
          suppressContentEditableWarning: true,
          className: "outline-none ring-1 ring-primary/20 rounded px-1 focus:ring-primary/50",
        }
      : {};

  return (
    <div className="space-y-5 text-foreground text-sm leading-relaxed" id="resume-content">
      {data.personalInfo && (data.personalInfo.name || data.personalInfo.email) && (
        <section className="text-center pb-4 border-b border-primary/20">
          {data.personalInfo.name && (
            <h2 className="font-display font-bold text-2xl text-foreground mb-1.5 tracking-tight">
              {data.personalInfo.name}
            </h2>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <><span className="text-primary/50">•</span><span>{data.personalInfo.phone}</span></>}
            {data.personalInfo.location && <><span className="text-primary/50">•</span><span>{data.personalInfo.location}</span></>}
            {data.personalInfo.linkedin && <><span className="text-primary/50">•</span><a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline">{data.personalInfo.linkedin.replace(/^https?:\/\//, "")}</a></>}
          </div>
        </section>
      )}
      {/* Professional Summary */}
      <section>
        <SectionTitle>Professional Summary</SectionTitle>
        <p {...editableProps("summary")} className={`text-muted-foreground text-sm leading-relaxed ${isEditing ? "ring-1 ring-primary/20 rounded px-2 py-1 focus:ring-primary/50" : ""}`}>
          {data.professionalSummary}
        </p>
      </section>

      {/* Technical Skills */}
      <section>
        <SectionTitle>Technical Skills</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {data.technicalSkills.map((skill, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section>
        <SectionTitle>Professional Experience</SectionTitle>
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                <h4 className="font-semibold text-foreground">{exp.title}</h4>
                <span className="text-xs text-muted-foreground">{exp.duration}</span>
              </div>
              <p className="text-xs text-primary/80 mb-1.5">{exp.company}</p>
              <ul className="space-y-1">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="text-muted-foreground text-xs flex gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      {data.projects.length > 0 && (
        <section>
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-3">
            {data.projects.map((p, i) => (
              <div key={i}>
                <h4 className="font-semibold text-foreground text-sm">{p.name}</h4>
                <p className="text-xs text-muted-foreground mb-1">{p.description}</p>
                <ul className="space-y-0.5">
                  {p.bullets.map((b, j) => (
                    <li key={j} className="text-muted-foreground text-xs flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      <section>
        <SectionTitle>Education</SectionTitle>
        <div className="space-y-1.5">
          {data.education.map((ed, i) => (
            <div key={i} className="flex flex-wrap justify-between">
              <div>
                <span className="font-medium text-foreground text-sm">{ed.degree}</span>
                <span className="text-muted-foreground text-xs ml-2">{ed.institution}</span>
              </div>
              <span className="text-xs text-muted-foreground">{ed.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section>
          <SectionTitle>Certifications</SectionTitle>
          <ul className="space-y-1">
            {data.certifications.map((c, i) => (
              <li key={i} className="text-muted-foreground text-xs flex gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ResumePreview;
