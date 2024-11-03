import React from "react";

import { useFrameContext } from "@/context/FrameContext";

export const ProgressBar = () => {
  const { progress } = useFrameContext();
  return (
    <div className="w-2/3 max-w-md">
      <div className="w-full bg-gray-300 h-4 rounded-md overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
