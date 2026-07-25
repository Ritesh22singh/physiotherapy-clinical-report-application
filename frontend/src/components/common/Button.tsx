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
            className={`w-full rounded-2xl border border-transparent bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-300 ${className}`.trim()}
        >
            {isLoading ? "Loading..." : children}
        </button>
    )
}

export default Button;
