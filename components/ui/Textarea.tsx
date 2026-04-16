import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={4}
          className={`
            w-full px-4 py-2.5 rounded-lg border resize-y
            text-body text-sm placeholder:text-muted
            transition-colors duration-200
            ${error
              ? "border-error focus:ring-2 focus:ring-error/20 focus:border-error"
              : "border-input-border focus:ring-2 focus:ring-teal/20 focus:border-teal"
            }
            outline-none
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-error text-xs">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
