import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "@apollo/client";
import queries from "../queries";
// import { initializeClerk, getClerkInstance } from "../clerkManager.js";

//TODO: Jesal: fix this
const ClerkEventHandlers = () => {
  const { user, isSignedIn } = useUser();

  const [createOrUpdateUserInDB] = useMutation(
    queries.CREATE_OR_UPDATE_USER_IN_DB
  );

  // useEffect(() => {
  //   if (!loaded) console.log("Clerk is not initialized yet.");
  //   else console.log("Clerk instance:", clerk);
  // }, []);

  const handleUserCreatedOrUpdated = async () => {
    try {
      const { data } = await createOrUpdateUserInDB({
        variables: {
          clerkUserId: user.id,
        },
      });
      console.log("User created in database:");
    } catch (error) {
      console.error("Error creating user in database:", error);
    }
    console.log("user created/updated function triggered");
  };

  // a user is added to the db when they are created in clerk
  useEffect(() => {
    console.log("user: ", user);

    if (isSignedIn) handleUserCreatedOrUpdated();
  }, [user]);

  return null;
};

export default ClerkEventHandlers;
