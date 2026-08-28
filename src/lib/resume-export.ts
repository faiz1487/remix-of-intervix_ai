import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import type { ResumeData } from "@/pages/ATSResumeBuilder";

/**
 * Builds a plain, ATS-parsable PDF from the resume data (not a screenshot of
 * the themed preview). All text is pure black on white, selectable and
 * searchable, with automatic word wrap and page breaks.
 */
export async function exportToPDF(data: ResumeData) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });


  const PAGE_W = 210;
  const PAGE_H = 297;
  const M = 15;
  const CONTENT_W = PAGE_W - M * 2;
  let y = M;

  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - M) {
      doc.addPage();
      y = M;
      doc.setTextColor(0, 0, 0);
      doc.setDrawColor(0, 0, 0);
    }
  };

  const writeLines = (
    text: string,
    { size = 10, style = "normal", indent = 0, align = "left", gap = 1.2 } = {} as {
      size?: number;
      style?: string;
      indent?: number;
      align?: "left" | "center";
      gap?: number;
    },
  ) => {
    if (!text) return;
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    const lineH = size * 0.42 + 1.2;
    const lines: string[] = doc.splitTextToSize(text, CONTENT_W - indent);
    lines.forEach((line) => {
      ensureSpace(lineH);
      if (align === "center") {
        doc.text(line, PAGE_W / 2, y + lineH - 1.5, { align: "center" });
      } else {
        doc.text(line, M + indent, y + lineH - 1.5);
      }
      y += lineH;
    });
    y += gap;
  };

  const sectionHeading = (title: string) => {
    ensureSpace(12);
    y += 2.5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), M, y + 4);
    y += 5.5;
    doc.setLineWidth(0.3);
    doc.line(M, y, PAGE_W - M, y);
    y += 3;
  };

  const bulletLine = (text: string) => {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lineH = 5.4;
    const lines: string[] = doc.splitTextToSize(text, CONTENT_W - 5);
    lines.forEach((line, i) => {
      ensureSpace(lineH);
      if (i === 0) doc.text("-", M + 1, y + lineH - 1.5);
      doc.text(line, M + 5, y + lineH - 1.5);
      y += lineH;
    });
    y += 0.6;
  };

  // Header
  const pi = data.personalInfo;
  if (pi?.name) {
    writeLines(pi.name, { size: 18, style: "bold", align: "center", gap: 0.5 });
  }
  const contactParts = [pi?.email, pi?.phone, pi?.location, pi?.linkedin].filter(Boolean) as string[];
  if (contactParts.length > 0) {
    writeLines(contactParts.join("  |  "), { size: 9.5, align: "center", gap: 1 });
  }

  if (data.professionalSummary) {
    sectionHeading("Professional Summary");
    writeLines(data.professionalSummary, { size: 10 });
  }

  if (data.technicalSkills?.length) {
    sectionHeading("Technical Skills");
    writeLines(data.technicalSkills.join(", "), { size: 10 });
  }

  if (data.experience?.length) {
    sectionHeading("Professional Experience");
    data.experience.forEach((exp) => {
      writeLines(exp.title, { size: 10.5, style: "bold", gap: 0.2 });
      const meta = [exp.company, exp.duration].filter(Boolean).join("  |  ");
      writeLines(meta, { size: 9.5, style: "italic", gap: 0.8 });
      exp.bullets?.forEach((b) => bulletLine(b));
      y += 1.5;
    });
  }

  if (data.projects?.length) {
    sectionHeading("Projects");
    data.projects.forEach((p) => {
      writeLines(p.name, { size: 10.5, style: "bold", gap: 0.2 });
      if (p.description) writeLines(p.description, { size: 10, gap: 0.8 });
      p.bullets?.forEach((b) => bulletLine(b));
      y += 1.5;
    });
  }

  if (data.education?.length) {
    sectionHeading("Education");
    data.education.forEach((ed) => {
      writeLines([ed.degree, ed.institution, ed.year].filter(Boolean).join("  |  "), {
        size: 10,
        gap: 0.6,
      });
    });
  }

  if (data.certifications?.length) {
    sectionHeading("Certifications");
    data.certifications.forEach((c) => bulletLine(c));
  }

  doc.save("ATS_Resume.pdf");
}


export async function exportToDOCX(data: ResumeData) {
  const children: Paragraph[] = [];

  const heading = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 28, font: "Calibri" })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    });

  const bullet = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, size: 22, font: "Calibri" })],
      bullet: { level: 0 },
      spacing: { after: 40 },
    });

  const normal = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, size: 22, font: "Calibri" })],
      spacing: { after: 80 },
    });

  // Personal Info Header
  const pi = data.personalInfo;
  if (pi && (pi.name || pi.email)) {
    if (pi.name) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: pi.name, bold: true, size: 36, font: "Calibri" })],
          spacing: { after: 80 },
        })
      );
    }
    const contactParts = [pi.email, pi.phone, pi.location, pi.linkedin].filter(Boolean);
    if (contactParts.length > 0) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: contactParts.join(" | "), size: 20, font: "Calibri" })],
          spacing: { after: 200 },
        })
      );
    }
  }

  // Professional Summary
  children.push(heading("PROFESSIONAL SUMMARY"));
  children.push(normal(data.professionalSummary));

  // Technical Skills
  children.push(heading("TECHNICAL SKILLS"));
  children.push(normal(data.technicalSkills.join(" • ")));

  // Experience
  children.push(heading("PROFESSIONAL EXPERIENCE"));
  data.experience.forEach((exp) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: exp.title, bold: true, size: 24, font: "Calibri" }),
          new TextRun({ text: ` | ${exp.company} | ${exp.duration}`, size: 22, font: "Calibri" }),
        ],
        spacing: { before: 150, after: 60 },
      })
    );
    exp.bullets.forEach((b) => children.push(bullet(b)));
  });

  // Projects
  if (data.projects.length > 0) {
    children.push(heading("PROJECTS"));
    data.projects.forEach((p) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: p.name, bold: true, size: 24, font: "Calibri" }),
            new TextRun({ text: ` — ${p.description}`, size: 22, font: "Calibri" }),
          ],
          spacing: { before: 100, after: 60 },
        })
      );
      p.bullets.forEach((b) => children.push(bullet(b)));
    });
  }

  // Education
  children.push(heading("EDUCATION"));
  data.education.forEach((ed) => {
    children.push(normal(`${ed.degree} | ${ed.institution} | ${ed.year}`));
  });

  // Certifications
  if (data.certifications.length > 0) {
    children.push(heading("CERTIFICATIONS"));
    data.certifications.forEach((c) => children.push(bullet(c)));
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "ATS_Resume.docx");
}
