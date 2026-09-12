import React from "react";

interface Props{
    children: React.ReactNode;
}

const AuthLayout = ({children} : Props) => {
    return(
        <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center justify-center">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
    )
}

export default AuthLayout;