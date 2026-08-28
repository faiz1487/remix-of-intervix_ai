import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  fallback?: string;
  label?: string;
}

export const BackButton = ({ fallback = "/", label = "Back" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
      onClick={handleClick}
    >
      <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
      {label}
    </Button>
  );
};

export default BackButton;
