import React from "react";

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  registration?: any;
  className?: string;
}

const Input = ({
  label,
  type = "text",
  placeholder,
  error,
  registration,
  className = "",
}: InputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100 ${className}`.trim()}
        aria-invalid={error ? "true" : "false"}
      />

      {error && (
        <p className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;