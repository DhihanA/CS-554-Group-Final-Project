import {
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useAuth,
  SignUp,
  useUser,
  UserButton,
} from "@clerk/clerk-react";


import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const SignUpClerk = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  const [customData, setCustomData] = useState({ role: "", dob: "" });
  const [customComplete, setCustomComplete] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/");
    }
  }, [isLoaded, isSignedIn]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <SignedIn>
            <Navigate to={'/'} />
            </SignedIn>
            <SignedOut>
                <SignUp signInUrl='/login' fallbackRedirectUrl="/fillinfo"/>
            </SignedOut>
        </div>
    );
};

export default SignUpClerk;
