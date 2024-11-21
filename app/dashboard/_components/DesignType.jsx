"use client"
import Image from "next/image";
import React, { useState } from "react";

function DesignType({selectedDesignType}) {
  const Designs = [
    {
      name: "modern",
      image: "",
    },
    {
      name: "industrial",
      image: "",
    },
    {
      name: "Traditional",
      image: "",
    },
    {
      name: "Rustic",
      image: "",
    },
  ];
   const[selectedOption,setSelectedOption]=useState();
  return (
    <div className="mt-5">
      <label className="text-gray-500">Interior Design Type</label>
      <div className="grid mt-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Designs.map((design, index) => (
          <div key={index} onClick={()=>{setSelectedOption(design.name);selectedDesignType(design.name)}}>
            <Image src={design.image} width={100} height={100} className={`h-[70px] rounded-lg hover:scale-105 transition-all ${design.name ==selectedOption&&'border-2 p-1 border-primary rounded-md'} `} alt='img'/>
            <h2>{design.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DesignType;
