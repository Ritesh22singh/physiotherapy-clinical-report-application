import React from "react";

interface Props{
    children: React.ReactNode;
}

const AuthLayout = ({children} : Props) => {
    return(
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
    )
}

export default AuthLayout;