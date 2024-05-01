import React, { useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useMutation } from "@apollo/client";
import queries from "../queries";

//TODO: Jesal: fix this
const ClerkEventHandlers = () => {
  const { user } = useUser();
  const { clerk } = useClerk();
  const [createUserInDB] = useMutation(queries.CREATE_USER_IN_DB);
  const [updateUserInDB] = useMutation(queries.UPDATE_USER_IN_DB);

  useEffect(() => {
    console.log("Clerk instance:", clerk);
    if (!clerk) {
      console.log("Clerk is not initialized yet.");
      return;
    }
  }, [clerk]);

  // a user is added to the db when they are created in clerk
  useEffect(() => {
    if (!clerk) return;

    const handleUserCreated = async (user) => {
      try {
        const { data } = await createUserInDB({
          variables: {
            clerkId: user.id,
          },
        });
        console.log("User created in database:", data.createUserInDB);
      } catch (error) {
        console.error("Error creating user in database:", error);
      }
    };

    const handleUserUpdated = async (user) => {
      try {
        const { data } = await updateUserInDB({
          variables: {
            userId: user.id,
          },
        });
        console.log("User updated in database:", data.updateUserInDB);
      } catch (error) {
        console.error("Error updating user in database:", error);
      }
    };

    const unsubscribeCreated = clerk.addListener(
      "user.created",
      handleUserCreated(user)
    );
    const unsubscribeUpdated = clerk.addListener(
      "user.updated",
      handleUserUpdated(user)
    );

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
    };
  }, [user, clerk]);

  return null;
};

export default ClerkEventHandlers;
