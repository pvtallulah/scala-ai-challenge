import React, { createContext, useContext, useEffect, useState } from "react";
import { FramesData } from "@/types";
import { fetcher } from "@/lib";

let _devIsLoadingFrames = false;
type FrameContextType = {
  frames: FramesData[];
  currentFrameIndex: number;
  setCurrentFrameIndex: React.Dispatch<React.SetStateAction<number>>;
  getCurrentFrameData: () => FramesData | null;
  getNextFrameData: () => FramesData | null;
  loading: boolean;
  progress: number;
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
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const totalFrames = 50;

  useEffect(() => {
    // In dev mode we don't want to load frames multiple times. Due to Reac.StrictMode this will be called twice on dev env.
    // On production this will be called only once.
    if (_devIsLoadingFrames) return;
    _devIsLoadingFrames = true;
    const loadFrames = async () => {
      let completed = 0;
      const trackProgress = async (
        promise: Promise<FramesData>
      ): Promise<FramesData> => {
        const result = await promise;
        completed += 1;
        setProgress(Math.round((completed / totalFrames) * 100));
        return result;
      };

      try {
        const framePromises: Promise<FramesData>[] = Array.from(
          { length: totalFrames },
          (_, i) => {
            const frameNumber = i.toString().padStart(2, "0");
            return trackProgress(
              fetcher<FramesData>(`/api/data?frame=${frameNumber}`)
            );
          }
        );

        const loadedFrames = await Promise.all(framePromises);
        setFrames(loadedFrames);
      } catch (error) {
        console.error("Error loading frames:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFrames();
  }, []);

  const getCurrentFrameData = () => {
    return frames[currentFrameIndex] || null;
  };

  const getNextFrameData = () => {
    return frames[currentFrameIndex + 1] || null;
  };

  return (
    <FrameContext.Provider
      value={{
        frames,
        currentFrameIndex,
        setCurrentFrameIndex,
        getCurrentFrameData,
        getNextFrameData,
        loading,
        progress,
      }}
    >
      {children}
    </FrameContext.Provider>
  );
};
