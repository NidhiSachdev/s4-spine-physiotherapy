import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            w-full px-4 py-2.5 rounded-lg border
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

Input.displayName = "Input";
export default Input;
