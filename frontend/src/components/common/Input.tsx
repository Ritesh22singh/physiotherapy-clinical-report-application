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
      <label className="block text-sm font-medium text-slate-800">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 ${className}`.trim()}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;