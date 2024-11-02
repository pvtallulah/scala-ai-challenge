import React, { createContext, useContext, useEffect, useState } from "react";
import { FramesData } from "@/types";
import { fetcher } from "@/lib";

type FrameContextType = {
  frames: FramesData[];
  currentFrameIndex: number;
  setCurrentFrameIndex: React.Dispatch<React.SetStateAction<number>>;
  getCurrentFrameData: () => FramesData | null;
};

const FrameContext = createContext<FrameContextType | undefined>(undefined);

export const useFrameContext = () => {
  const context = useContext(FrameContext);
  if (!context) {
    throw new Error("useFrameContext must be used within a FrameProvider");
  }
  return context;
};

export const FrameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [frames, setFrames] = useState<FramesData[]>([]);

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  useEffect(() => {
    const loadFrames = async () => {
      try {
        const framePromises = Array.from({ length: 50 }, (_, i) => {
          const frameNumber = i.toString().padStart(2, "0");
          return fetcher<FramesData>(`/api/data?frame=${frameNumber}`);
        });

        const loadedFrames = await Promise.all(framePromises);
        setFrames(loadedFrames);
      } catch (error) {
        console.error("Error loading frames:", error);
      }
    };

    loadFrames();
  }, []);

  const getCurrentFrameData = () => {
    return frames[currentFrameIndex] || null;
  };

  return (
    <FrameContext.Provider
      value={{
        frames,
        currentFrameIndex,
        setCurrentFrameIndex,
        getCurrentFrameData,
      }}
    >
      {children}
    </FrameContext.Provider>
  );
};
