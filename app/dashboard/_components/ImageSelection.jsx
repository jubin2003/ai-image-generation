"use client";
import React, { useState } from "react";
import Image from "next/image";

function ImageSelection({ selectedImage }) {
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();

    const onFileSelected = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith("image/")) {
            alert("Please upload a valid image file");
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        selectedImage(selectedFile);
    };

    return (
        <div className="flex flex-col gap-4 items-center">
            <label htmlFor="upload-image" className="text-gray-600 font-medium">
                Select an image of your room
            </label>
            <div className="mt-3">
                <label htmlFor="upload-image">
                    <div className="p-16 border rounded-xl border-dotted flex justify-center items-center border-primary bg-slate-200 cursor-pointer hover:shadow-lg">
                        {!preview ? (
                            <Image
                                src={"/file-upload.png"}
                                alt="Upload Icon"
                                width={90}
                                height={90}
                                className="opacity-70 hover:opacity-100 transition"
                            />
                        ) : (
                            <div className="relative w-64 h-64 flex justify-center items-center">
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
    );
}

export default ImageSelection;
