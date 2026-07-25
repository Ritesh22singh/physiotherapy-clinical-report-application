import React from 'react';

interface CardProps{
    children: React.ReactNode;
    className?: string;
}

const Card =({children, className = ""} : CardProps) => {
    return(
        <div className={`bg-white shadow-md rounded-xl p-6 ${className}`.trim()}>
            {children}
        </div>
    )
}

export default Card;