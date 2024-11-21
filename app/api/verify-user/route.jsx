import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";
import { Users } from "@/config/schema";

export async function POST(req) {
  try {
    // Parse the request body
    const { user } = await req.json();

    // Fetch user information from the `Users` table
    const [userInfo] = await db
      .select()
      .from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress)); // Fetch by email

    // If user does not exist, insert a new record
    if (!userInfo) {
      const [savedUser] = await db
        .insert(Users)
        .values({
          name: user?.fullName,
          email: user?.primaryEmailAddress,
          image_url: user?.imageUrl,
        })
        .returning(); // Returns the inserted record

      return NextResponse.json({ result: savedUser });
    }

    // If user exists, return their information
    return NextResponse.json({ result: userInfo });
  } catch (error) {
    console.error("Error storing user:", error);
    return NextResponse.json({ error: error.message || "Unknown error" });
  }
}
