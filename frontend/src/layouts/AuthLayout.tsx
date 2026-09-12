import React from "react";

interface Props{
    children: React.ReactNode;
}

const AuthLayout = ({children} : Props) => {
    return(
        <div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        {children}
      </div>
    </div>
    )
}

export default AuthLayout;