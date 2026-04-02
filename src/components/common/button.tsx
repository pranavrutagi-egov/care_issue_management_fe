import { Button } from "@/components/ui/button";

interface WidgetButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "primary" | "secondary";
}

export default function WidgetButton({
  onClick,
  children,
  className,
  type = "primary",
}: WidgetButtonProps) {
  const baseClasses =
    "fixed bottom-20 right-10 rounded-full h-16 w-16 shadow-xl";
  const typeClasses =
    type === "secondary" ? "bg-secondary-600" : "bg-primary-600";

  return (
    <Button
      variant="outline"
      size="icon"
      className={`${baseClasses} ${typeClasses} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
