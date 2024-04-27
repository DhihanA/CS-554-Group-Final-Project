import {
    SignOutButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    useAuth,
    SignUp,
    useUser,
  } from "@clerk/clerk-react";

import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const SignUpClerk = () => {
        
    const navigate = useNavigate();
    const {isLoaded, isSignedIn} = useAuth();


    useEffect(() => {
    if(isLoaded && isSignedIn){
        navigate("/")
    }
    }, [isLoaded, isSignedIn]);

    return (
    <div style={{display: "flex", justifyContent: "center"}}>
        <SignedIn>
        <Navigate to={'/'} />
        </SignedIn>
        <SignedOut>
        <SignUp signInUrl='/login'/>
        </SignedOut>
    </div>
);
  };
  
  export default SignUpClerk;