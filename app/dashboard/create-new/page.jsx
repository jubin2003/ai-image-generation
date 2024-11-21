"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import ImageSelection from "../_components/ImageSelection";
import RoomType from "../_components/RoomType";
import DesignType from "../_components/DesignType";
import AdditionalRequirements from "../_components/AdditionalRequirements";
import { Button } from "@/components/ui/button";
import AiOutputDialog from "../_components/AiOutputDialog";

function CreateNew() {
    const { user } = useUser();
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [aiOutputImage, setAiOutputImage] = useState(null);
    const [openOutputDialog, setOpenOutputDialog] = useState(false);

    const onHandleInputChange = (value, fieldName) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
        console.log(`Field: ${fieldName}, Value:`, value);
    };

    const GenerateAiImage = async () => {
        if (!formData.image) {
            alert("Please select an image before generating!");
            return;
        }

        setIsLoading(true);
        try {
            const rawImageUrl = await SaveRawImageToFireBase();

            const result = await axios.post("/api/redesign-room", {
                ...formData,
                imageUrl: rawImageUrl,
            });
            setAiOutputImage(result.data.result);
            setOpenOutputDialog(true); // Show the AI output dialog
        } catch (error) {
            console.error("Error generating AI image:", error.response?.data || error.message || error);
        } finally {
            setIsLoading(false);
        }
    };

    const SaveRawImageToFireBase = async () => {
        if (!formData.image || !(formData.image instanceof File)) {
            throw new Error("Invalid or missing image file. Please upload a valid image file.");
        }

        const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`;
        const formDataToUpload = new FormData();
        formDataToUpload.append("file", formData.image);
        formDataToUpload.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);

        try {
            const response = await axios.post(cloudinaryUploadUrl, formDataToUpload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload failed:", error.message);
            throw new Error("Failed to upload the image to Cloudinary. Please try again later.");
        }
    };

    // UseEffect to handle side-effects when the AI image is updated
    useEffect(() => {
        if (aiOutputImage) {
            console.log("AI image generated successfully. Triggering updates...");
            setTimeout(() => {
                window.location.reload();
            }, 5000);
            // Reset or refresh dependent states/components
            setFormData({});
        }
    }, [aiOutputImage]);
    

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-gray-50 rounded-lg shadow-md">
            <h2 className="font-extrabold text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-center leading-tight">
                Reimagine Your Space with AI-Powered Magic
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 w-full max-w-4xl">
                <ImageSelection
                    selectedImage={(value) => onHandleInputChange(value, "image")}
                />
            </div>
            <div className="w-full max-w-lg mt-6">
                <RoomType
                    selectedRoomType={(value) =>
                        onHandleInputChange(value, "roomType")
                    }
                />
            </div>
            <DesignType
                selectedDesignType={(value) =>
                    onHandleInputChange(value, "designType")
                }
            />
            <AdditionalRequirements
                additionalRequirementInput={(value) =>
                    onHandleInputChange(value, "additionalRequirement")
                }
            />
            <Button className="w-full mt-5" onClick={GenerateAiImage} disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate"}
            </Button>

            {openOutputDialog && (
                <AiOutputDialog
                    openDialog={openOutputDialog}
                    closeDialog={() => setOpenOutputDialog(false) }
                    orgImage={formData.image ? URL.createObjectURL(formData.image) : ""}
                    aiImage={aiOutputImage}
                />
            )}
        </div>
    );
}

export default CreateNew;
