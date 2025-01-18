"use client";
import { useAuthContextHook } from "@/context/use-auth-context";
import { cn } from "@/lib/utils";
import React from "react";

const HighLightBar = () => {
  const { currentStep } = useAuthContextHook();

  return (
    <div className="grid grid-cols-2 gap-2">
      <div
        className={cn(
          "rounded-full h-2 col-span-1",
          currentStep == 1 ? "bg-[#183EC2]" : "bg-gray-500"
        )}
      ></div>
      <div
        className={cn(
          "rounded-full h-2 col-span-1",
          currentStep == 2 ? "bg-[#183EC2]" : "bg-gray-500"
        )}
      ></div>
    </div>
  );
};

export default HighLightBar;
