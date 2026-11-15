import React from "react";
import { cn } from "../utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full px-3 py-2 text-sm bg-white border rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D6B5A] focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500",
            error ? "border-rose-400 focus:ring-rose-400" : "border-slate-300",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-rose-500">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-400">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
