import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const LoginClerk = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
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
