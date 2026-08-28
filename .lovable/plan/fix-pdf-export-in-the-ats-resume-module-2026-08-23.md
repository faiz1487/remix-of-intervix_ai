# Fix PDF export in the ATS Resume module

## Problem

DOCX export is built from the resume data itself (`exportToDOCX` in `src/lib/resume-export.ts`), so it comes out clean and correctly formatted.

PDF export does something completely different: it screenshots the on-screen preview (`ResumePreview`) with html2canvas and pastes the image into a PDF. That means the PDF inherits the app's theme — cyan section headings, grey "muted" body text, coloured skill pills and bullet dots — and the page is an image, so the text is not selectable, not searchable, and not readable by ATS parsers. It also gets cut mid-line when content spills past one page.

## Fix

Rebuild PDF export the same way DOCX is built: generate the document from the resume data, not from the screen.

- Replace the html2canvas/html2pdf approach with real text drawing using jsPDF (already loaded via the html2pdf bundle; will be loaded directly instead).
- All text rendered in pure black (`#000000`) on white — no theme colours, no cyan, no grey, no pills, no background fills.
- One clean ATS-friendly structure matching the DOCX:
  - Name centred and bold at the top, contact line (email | phone | location | LinkedIn) centred beneath it
  - Section headings in bold uppercase with a thin black rule
  - Skills as a plain comma/bullet-separated line of text, not chips
  - Experience: bold role, then company and dates, then plain "-" bullets
  - Projects, Education, Certifications in the same plain style
- Automatic word wrap to the page width and automatic page breaks so nothing is clipped mid-sentence.
- Standard A4 with consistent margins, single Helvetica family, sizes tuned for one to two pages.

The on-screen preview keeps its current styled look — only the exported PDF changes.

## Files touched

- `src/lib/resume-export.ts` — rewrite `exportToPDF` to take `ResumeData` and draw text with jsPDF.
- `src/pages/ATSResumeBuilder.tsx` — pass the resume data to `exportToPDF` instead of the DOM element.

## Verification

Generate a sample resume, download the PDF, and confirm: text is selectable, everything is black, sections match the DOCX, and long content flows onto page 2 without clipping.
