import { useEffect, useRef, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

interface Props {
  url: string;
  name: string;
}

const isImage = (u: string) => /\.(png|jpe?g|webp|gif)(\?|$)/i.test(u);
const isPdf = (u: string) => /\.pdf(\?|$)/i.test(u);

const ResumeThumbnail = ({ url, name }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "done" | "error">(
    isImage(url) ? "done" : isPdf(url) ? "loading" : "error"
  );

  useEffect(() => {
    if (!isPdf(url)) return;
    let cancelled = false;

    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument({ url }).promise;
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = 600 / baseViewport.width;
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (!cancelled) setStatus("done");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-background border border-border/50 group-hover:glow-primary transition-all">
      {isImage(url) ? (
        <img
          src={url}
          alt={`${name} resume preview`}
          loading="lazy"
          className="w-full h-full object-cover object-top"
          onError={() => setStatus("error")}
        />
      ) : (
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover object-top ${status === "done" ? "" : "invisible"}`}
        />
      )}

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
          <FileText className="w-16 h-16 text-primary/60" />
        </div>
      )}
    </div>
  );
};

export default ResumeThumbnail;
