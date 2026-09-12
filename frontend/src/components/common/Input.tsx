
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  className?: string;
}

const Input = ({
  id,
  label,
  type = "text",
  placeholder,
  error,
  registration,
  className = "",
}: InputProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100 ${className}`.trim()}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;