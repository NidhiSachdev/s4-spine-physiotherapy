type BadgeVariant = "default" | "teal" | "orange" | "success" | "error" | "warning" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-charcoal/10 text-charcoal",
  teal: "bg-teal/10 text-teal-dark",
  orange: "bg-orange/10 text-orange-dark",
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

export default function Badge({ variant = "default", className = "", children }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
