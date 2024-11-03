"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useFrameContext } from "@/context/FrameContext";
import { ProgressBar } from "@/app/components/ProgressBar";

export default function Loading() {
  const router = useRouter();
  const { progress } = useFrameContext();

  useEffect(() => {
    if (progress === 100) {
      router.push("/scene");
    }
  }, [progress, router]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="w-11/12 flex flex-col items-center max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-f5f5f5 mb-4">
          Loading Frames...
        </h2>
        <ProgressBar />
        <p className="text-center mt-2 text-f5f5f5">{progress}%</p>
        {progress === 100 && (
          <div className="text-center text-green-500 mt-4">
            All frames loaded!
          </div>
        )}
      </div>
    </div>
  );
}
