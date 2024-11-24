import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { db } from "@/config/db"; // Adjust to your database instance
import { roomDesigns } from "@/config/schema"; // Adjust to your schema
import { getAuth } from "@clerk/nextjs/server"; // For server-side Clerk auth
import { clerkClient } from "@clerk/clerk-sdk-node";
import { eq } from "drizzle-orm"; // Correct import for clerkClient
import { Users } from "@/config/schema";
import "react-toastify/dist/ReactToastify.css";
import Replicate from "replicate"; // Added Replicate import
import alertGradient from "@material-tailwind/react/theme/components/alert/alertGradient";

// Configure Replicate
const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
});
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUD_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUD_API_SECRET,
});

export async function POST(req) {
  try {
    // Authenticate the user
    const { userId } = getAuth(req);
    if (!userId) {
      alert("Unauthorized: User session is required", { position: "top-right" });
    }

    // Fetch detailed user information using clerkClient
    const user = await clerkClient.users.getUser(userId); // Get user details
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      throw new Error("Unable to fetch user email");
    }
    // Check if user has enough credits
    const [userRecord] = await db
      .select()
      .from(Users)
      .where(eq(Users.email, userEmail)); // Correct syntax here

    if (!userRecord || userRecord.credits < 5) {
      alert("Insufficient credits. Please purchase more to generate an image", { position: "top-right" });
    }

    // Parse and validate the request body
    const { imageUrl, roomType, designType, additionalRequirement } =
      await req.json();
    if (!imageUrl || !roomType || !designType) {
      alertGradient("Missing Required Fields", { position: "top-right" });
    }

    console.log("Input received:", {
      userId,
      userEmail,
      imageUrl,
      roomType,
      designType,
      additionalRequirement,
    });

    // Generate AI-generated image using Replicate
    const aiGeneratedImage = await generateRoomDesign({
      image: imageUrl,
      prompt:`A ${roomType} with a ${designType}. ${additionalRequirement}`,
    });

    console.log("Generated AI Image URL:", aiGeneratedImage);

    // Upload the AI-generated image to Cloudinary
    const uploadedImageUrl = await uploadToCloudinary(aiGeneratedImage);
    console.log("Uploaded Cloudinary URL:", uploadedImageUrl);

    // Deduct credits
    await db
      .update(Users)
      .set({ credits: userRecord.credits - 5 })
      .where(eq(Users.email, userEmail));

    // Insert into database
    const record = await db.insert(roomDesigns).values({
      room_type: roomType,
      design_type: designType,
      additional_requirement: additionalRequirement || null,
      image_url: imageUrl,
      ai_generated_url: uploadedImageUrl,
      user_email: userEmail,
    });

    console.log("Database record inserted:", record);

    return NextResponse.json({ result: record });
  } catch (error) {
    console.error(
      "Error in POST /redesign-room:",
      error.stack || error.message || error
    );
    return NextResponse.json(
      { error: error.message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}

// Function to generate room design using Replicate
async function generateRoomDesign(input) {
  try {
    const output = await replicate.run(
      process.env.NEXT_PUBLIC_REPLICATE_AI_MODEL,
      {
        input,
      }
    );
    return output;
  } catch (error) {
    console.error("Error in generateRoomDesign:", error);
    throw new Error("Error generating room design with Replicate.");
  }
}

// Upload to Cloudinary
async function uploadToCloudinary(imageUrl) {
  try {
    const response = await cloudinary.v2.uploader.upload(imageUrl, {
      folder: "room_designs",
    });
    return response.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}
