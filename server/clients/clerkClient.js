import { createClerkClient } from "@clerk/clerk-sdk-node";
import { configDotenv } from "dotenv";

configDotenv();

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export default clerkClient;
