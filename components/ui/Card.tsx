import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  hover = false,
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-card rounded-xl border border-border
        ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer" : "shadow-sm"}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
