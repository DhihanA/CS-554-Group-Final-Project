import { Clerk } from "@clerk/clerk-js";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
let clerkInstance = null;

export const initializeClerk = async () => {
  if (!clerkInstance) {
    clerkInstance = new Clerk(PUBLISHABLE_KEY);
    await clerkInstance.load({});
  }
  return clerkInstance;
};

export const getClerkInstance = () => {
  if (!clerkInstance) {
    throw "Clerk has not been initialized. Please call initializeClerk first.";
  }
  return clerkInstance;
};
