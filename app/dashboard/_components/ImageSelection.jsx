"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ImageSelection({ selectedImage }) {
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();

    const onFileSelected = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith("image/")) {
            toast.error("Please upload a valid image file", { position: "top left" });
            return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) { // 10 MB
            toast.error("File size must be less than 50MB", { position: "top left" });
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        selectedImage(selectedFile);
    };

    return (
        <div>
     <ToastContainer />
        <div className="flex flex-col gap-4 items-center px-4 sm:px-8 md:px-16 lg:px-32">
       
            <label htmlFor="upload-image" className="text-gray-600 font-medium text-lg sm:text-xl md:text-2xl ">
                Select an image of your room
            </label>
            <div className="mt-3 w-full max-w-md">
                <label htmlFor="upload-image">
                    <div className="p-8 sm:p-12 md:p-18  border rounded-xl border-dotted flex justify-center items-center border-primary bg-slate-200 cursor-pointer hover:shadow-lg transition-all">
                        {!preview ? (
                            <Image
                                src="/image_upload.png" // Corrected path
                                alt="Upload Icon"
                                width={90}
                                height={90}
                                className="opacity-70 hover:opacity-100 transition"
                            />
                        ) : (
                            <div className="relative w-full h-64 md:h-80 lg:h-96 flex justify-center items-center">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>
                        )}
                    </div>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    id="upload-image"
                    style={{ display: "none" }}
                    onChange={onFileSelected}
                />
            </div>
        </div>
        
       </div>
    );
}

export default ImageSelection;
