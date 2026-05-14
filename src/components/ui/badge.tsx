import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "muted";
  className?: string;
};

const tones = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-amber-700",
  danger: "bg-danger/10 text-danger",
  muted: "bg-muted text-muted-foreground"
};

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex h-6 items-center rounded-md px-2 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}
