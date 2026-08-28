import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModuleHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  backTo?: string;
  className?: string;
  titleClassName?: string;
}

export const ModuleHeader = ({
  title,
  description,
  icon,
  action,
  backTo = "/chat",
  className,
  titleClassName,
}: ModuleHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => navigate(backTo)}
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 glow-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <h1 className={cn("font-display font-bold truncate", titleClassName || "text-3xl")}>
            {title}
          </h1>
          <p className="text-muted-foreground text-sm truncate">{description}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
};

export default ModuleHeader;
