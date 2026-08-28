import { CheckCircle2, AlertTriangle, Search, TrendingUp } from "lucide-react";
import type { ATSAnalysis } from "@/pages/ATSResumeBuilder";

const ATSScoreCard = ({ analysis }: { analysis: ATSAnalysis }) => {
  const scoreColor =
    analysis.atsScore >= 80 ? "text-green-400" : analysis.atsScore >= 60 ? "text-yellow-400" : "text-red-400";
  const scoreBg =
    analysis.atsScore >= 80 ? "bg-green-400/10" : analysis.atsScore >= 60 ? "bg-yellow-400/10" : "bg-red-400/10";

  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      <h3 className="font-display font-semibold text-sm flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" /> ATS Analysis
      </h3>

      {/* Score Circles */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`${scoreBg} rounded-xl p-4 text-center`}>
          <p className={`font-display text-3xl font-bold ${scoreColor}`}>{analysis.atsScore}%</p>
          <p className="text-xs text-muted-foreground mt-1">ATS Score</p>
        </div>
        <div className="bg-primary/10 rounded-xl p-4 text-center">
          <p className="font-display text-3xl font-bold text-primary">{analysis.keywordMatch}%</p>
          <p className="text-xs text-muted-foreground mt-1">Keyword Match</p>
        </div>
      </div>

      {/* Missing Keywords */}
      {analysis.missingKeywords.length > 0 && (
        <div>
          <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-yellow-400" /> Missing Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missingKeywords.map((kw, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-yellow-400/10 text-yellow-400 text-xs">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {analysis.improvements.length > 0 && (
        <div>
          <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-primary" /> Suggestions
          </p>
          <ul className="space-y-1.5">
            {analysis.improvements.map((imp, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ATSScoreCard;
