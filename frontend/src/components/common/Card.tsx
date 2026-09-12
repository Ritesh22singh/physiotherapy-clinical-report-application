import React from 'react';

interface CardProps{
    children: React.ReactNode;
    className?: string;
}

const Card =({children, className = ""} : CardProps) => {
    return(
        <div className={`rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm ${className}`.trim()}>
            {children}
        </div>
    )
}

export default Card;