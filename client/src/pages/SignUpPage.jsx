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

// import RolePrompt from '../components/RolePrompt.jsx';
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

  const handlePostSignUp = async () => {
    try {
      await user.update({
        publicMetadata: {
          role: customData.role,
        },
        privateMetadata: {
          dob: customData.dob,
        },
      });
      alert("Metadata updated successfully!");
    } catch (error) {
      console.error("Failed to update metadata:", error);
      alert("Failed to update metadata.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <SignedIn>
        <Navigate to={"/"} />
      </SignedIn>
      <SignedOut>
        {customComplete ? (
          <>
            <button className="my-4" onClick={() => setCustomComplete(false)}>
              Go Back
            </button>
            <SignUp
              signInUrl="/login"
              onSignUp={() => {
                console.log("this is being reached");
                handlePostSignUp();
              }}
            />
          </>
        ) : (
          <RolePrompt
            setCustomData={setCustomData}
            setCustomComplete={setCustomComplete}
          />
        )}
      </SignedOut>
    </div>
  );
};

export default SignUpClerk;
