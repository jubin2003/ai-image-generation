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
            toast.error("File size must be less than 10MB", { position: "top left" });
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        selectedImage(selectedFile);
    };

    return (
        <div className="p-4">
  <ToastContainer />
  <div className="flex flex-col gap-6 items-center">
    
    <label htmlFor="upload-image" className="block text-gray-700 font-bold mb-2">
      Select an image of your room
    </label>
    
  
    <div className="mt-4 w-full max-w-md">
      <label htmlFor="upload-image">
        <div 
          className="p-12 sm:p-16 border rounded-xl border-dotted flex justify-center items-center border-primary bg-slate-200 
                     cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all duration-300"
        >
          {!preview ? (
            <Image
              src="/image_upload.png"
              alt="Upload Icon"
              width={80}
              height={80}
              className="opacity-70 hover:opacity-100 transition-all"
            />
          ) : (
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex justify-center items-center">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg shadow-lg"
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
