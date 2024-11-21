"use client";
import Image from "next/image";
import React, { useState } from "react";

function DesignType({ selectedDesignType }) {
  const Designs = [
    {
      name: "modern",
      image: "/modern.jpg", // Correct path
    },
    {
      name: "industrial",
      image: "/industrial.jpg", // Correct path
    },
    {
      name: "Traditional",
      image: "/traditional.jpg", // Correct path
    },
    {
      name: "Rustic",
      image: "/rustic.jpg", // Correct path
    },
  ];

  const [selectedOption, setSelectedOption] = useState();

  return (
    <div className="mt-5">
      <label className="text-gray-500">Interior Design Type</label>
      <div className="grid mt-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Designs.map((design, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedOption(design.name);
              selectedDesignType(design.name);
            }}
            className={`cursor-pointer ${
              design.name === selectedOption && "border-2 p-1 border-primary rounded-md"
            }`}
          >
            <Image
              src={design.image}
              width={100}
              height={100}
              className="h-[70px] rounded-lg hover:scale-105 transition-all"
              alt={`${design.name} design`}
            />
            <h2>{design.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DesignType;
