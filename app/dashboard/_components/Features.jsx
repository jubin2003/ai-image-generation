import React from 'react'
import { AdjustmentsHorizontalIcon, CameraIcon, SparklesIcon, HomeModernIcon, PencilIcon } from "@heroicons/react/24/outline";
const features = [
    {
      name: "AI Room Transformation",
      description:
        "Leverage cutting-edge AI to transform your room designs into modern, functional, and visually stunning spaces.",
      icon: AdjustmentsHorizontalIcon,
    },
    {
      name: "Photo Uploads",
      description:
        "Easily upload high-quality images of your rooms for AI-powered enhancement and redesign suggestions.",
      icon: CameraIcon,
    },
    {
      name: "Real-Time Previews",
      description:
        "Get instant previews of your redesigned rooms and experiment with different styles and layouts.",
      icon: SparklesIcon,
    },
    {
      name: "Custom Design Suggestions",
      description:
        "Receive tailored design ideas based on your preferences, room type, and lifestyle needs.",
      icon: HomeModernIcon,
    },
    {
      name: "Easy Edits",
      description:
        "Make quick adjustments to AI-generated designs to personalize your space effortlessly.",
      icon: PencilIcon,
    },
  ];

function Features() {
  return (
    <div className="bg-white py-24 sm:py-32 mt-0">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">Features</h2>
          <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            Everything you need to transform your home interior
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Features