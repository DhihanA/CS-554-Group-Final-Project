import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const LoginClerk = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <SignedIn>
        <Navigate to={"/dashboard"} />
      </SignedIn>
      <SignedOut>
        <SignIn afterSignInUrl="/dashboard" signUpUrl="/signup" />
      </SignedOut>
    </div>
  );
};

export default LoginClerk;
