import { NextResponse } from "next/server";
import { db } from "@/config/db"; // Adjust to your database instance
import { roomDesigns } from "@/config/schema"; // Adjust to your schema
import { getAuth } from "@clerk/nextjs/server"; // For server-side Clerk auth
import { clerkClient } from "@clerk/clerk-sdk-node";
import { eq } from "drizzle-orm"; // Import the equality operator

export async function GET(req) {
  try {
    // Authenticate the user
    const { userId } = getAuth(req);
    if (!userId) {
      throw new Error("Unauthorized: User session is required");
    }

    // Fetch user email
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      throw new Error("Unable to fetch user email");
    }

    // Fetch room designs for this user using Drizzle's `eq` function
    const userRooms = await db
      .select()
      .from(roomDesigns)
      .where(eq(roomDesigns.user_email, userEmail)); // Proper equality check

    return NextResponse.json(userRooms);
  } catch (error) {
    console.error("Error fetching user rooms:", error.stack || error.message || error);
    return NextResponse.json({ error: error.message || "Unknown error occurred" }, { status: 500 });
  }
}
