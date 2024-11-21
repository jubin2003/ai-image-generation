// import { NextResponse } from 'next/server';
// import cloudinary from 'cloudinary';
// import { db } from '@/config/db'; // Adjust the import path for your Drizzle instance
// import { roomDesigns } from '@/config/schema'; // Adjust the import path for your schema

// // Cloudinary Configuration
// cloudinary.v2.config({
//     cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
//     api_key: process.env.NEXT_PUBLIC_CLOUD_API_KEY,
//     api_secret: process.env.NEXT_PUBLIC_CLOUD_API_SECRET,
// });

// export async function POST(req) {
//     try {
//         const { imageUrl, roomType, designType, additionalRequirement } = await req.json();

//         // Validate input
//         if (!imageUrl || !roomType || !designType) {
//             throw new Error("Invalid input: Missing required fields");
//         }

//         console.log("Input received:", { imageUrl, roomType, designType, additionalRequirement });

//         // Use a dummy AI-generated image URL for testing
//         const aiGeneratedImage = "https://via.placeholder.com/600x400.png?text=AI+Generated+Image";

//         // Commented the API call for testing purposes
//         /*
//         const aiGeneratedImage = await regenerateImage(imageUrl, designType, roomType, additionalRequirement);
//         */

//         // Upload the AI-generated image to Cloudinary
//         const uploadedImageUrl = await uploadToCloudinary(aiGeneratedImage);

//         console.log("Uploaded Cloudinary URL:", uploadedImageUrl);

//         // Save to Neon database
//         const record = await db.insert(roomDesigns).values({
//             roomType,
//             designType,
//             additionalRequirement,
//             imageUrl, // Original image URL
//             aiGeneratedUrl: uploadedImageUrl, // AI-generated Cloudinary URL
//             userEmail: '', // Assuming userEmail is optional; adjust if needed
//         });

//         console.log("Database record inserted:", record);

//         return NextResponse.json({ result: uploadedImageUrl });
//     } catch (error) {
//         console.error("Error in POST /redesign-room:", error.stack || error.message || error);
//         return NextResponse.json({ error: error.message || "Unknown error occurred" }, { status: 500 });
//     }
// }

// // Function to regenerate the image using Replicate API
// // Commented out for testing purposes
// /*
// async function regenerateImage(originalImageUrl, designType, roomType, additionalRequirement) {
//     try {
//         console.log("Calling Replicate API for image regeneration...");

//         const input = {
//             image: originalImageUrl,
//             prompt: `A ${roomType} with a ${designType}. ${additionalRequirement || ""}`,
//         };

//         const output = await replicate.run(
//             "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
//             { input }
//         );

//         console.log("Generated image URL from Replicate:", output);
//         if (!output) {
//             throw new Error("Failed to regenerate image via Replicate");
//         }

//         return output; // Directly returning the AI-generated image URL
//     } catch (error) {
//         console.error("Error regenerating image:", error);
//         throw new Error("Image regeneration failed");
//     }
// }
// */

// // Upload image to Cloudinary
// async function uploadToCloudinary(imageUrl) {
//     try {
//         const response = await cloudinary.v2.uploader.upload(imageUrl, {
//             folder: "room_designs",
//         });
//         return response.secure_url;
//     } catch (error) {
//         console.error("Cloudinary upload failed:", error.message);
//         throw new Error(`Cloudinary upload failed: ${error.message}`);
//     }
// }
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { db } from "@/config/db"; // Adjust to your database instance
import { roomDesigns } from "@/config/schema"; // Adjust to your schema
import { getAuth } from "@clerk/nextjs/server"; // For server-side Clerk auth
import { clerkClient } from "@clerk/clerk-sdk-node";
import { eq } from "drizzle-orm"; // Correct import for clerkClient
import { Users } from "@/config/schema";
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
      throw new Error("Unauthorized: User session is required");
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
    throw new Error(
      "Insufficient credits. Please purchase more to generate an image."
    );
  }
    // Parse and validate the request body
    const { imageUrl, roomType, designType, additionalRequirement } =
      await req.json();
    if (!imageUrl || !roomType || !designType) {
      throw new Error("Invalid input: Missing required fields");
    }

    console.log("Input received:", {
      userId,
      userEmail,
      imageUrl,
      roomType,
      designType,
      additionalRequirement,
    });

    // Dummy AI-generated image URL for testing
    const aiGeneratedImage =
      "https://via.placeholder.com/600x400.png?text=AI+Generated+Image";

    // Upload the AI-generated image to Cloudinary
    const uploadedImageUrl = await uploadToCloudinary(aiGeneratedImage);
    console.log("Uploaded Cloudinary URL:", uploadedImageUrl);
     // Deduct credits
     await db
     .update(Users)
     .set({ credits: userRecord.credits - 5 })
     .where(eq(Users.email, userEmail))

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
