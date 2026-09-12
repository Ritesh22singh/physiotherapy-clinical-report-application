import React from "react";

interface ButtonProps{
    children: React.ReactNode;
    type?:"button" | "submit" | "reset";
    isLoading?: boolean;
    disable?: boolean;
    onClick?: () => void;
    className?: string;
}

const Button = ({
    children,
    type = "button",
    isLoading = false,
    disable = false,
    onClick,
    className = "",
}: ButtonProps) => {
    return (
        <button
            type={type}
            disabled={disable || isLoading}
            onClick={onClick}
            className={`inline-flex w-full items-center justify-center rounded-2xl border border-transparent bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-400/10 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 ${className}`.trim()}
        >
            {isLoading ? "Loading..." : children}
        </button>
    )
}

export default Button;
