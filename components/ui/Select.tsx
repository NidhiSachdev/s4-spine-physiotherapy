import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, options, placeholder, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-charcoal">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`
            w-full px-4 py-2.5 rounded-lg border appearance-none
            text-body text-sm bg-white
            transition-colors duration-200
            ${error
              ? "border-error focus:ring-2 focus:ring-error/20 focus:border-error"
              : "border-input-border focus:ring-2 focus:ring-teal/20 focus:border-teal"
            }
            outline-none
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-error text-xs">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
