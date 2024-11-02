"use client";
import { Canvas } from "@react-three/fiber";
import { Points } from "./components/Points";
import { Cuboids } from "./components/Cuboids";
import { OrbitControls } from "@react-three/drei";
import { Control } from "./components/Controls";
import { useFrameContext } from "@/context/FrameContext";
import { useState } from "react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const {
    currentFrameIndex,
    setCurrentFrameIndex,
    getCurrentFrameData,
    getNextFrameData,
    loading,
  } = useFrameContext();
  const totalFrames = 50;

  const handleStep = (step: number) => {
    setCurrentFrameIndex((prev) => {
      const newFrameIndex = prev + step;
      return newFrameIndex >= 0 && newFrameIndex < totalFrames
        ? newFrameIndex
        : prev;
    });
  };

  if (loading) return <div className="text-white">Loading frames...</div>;

  const data = getCurrentFrameData();
  const nextFrame = getNextFrameData();

  const handleReplay = () => {
    setCurrentFrameIndex(0);
  };
  const handlePlayStop = () => {
    setIsPlaying((prev) => !prev);
  };
  if (!data) return <div className="text-white">No frame data available</div>;

  return (
    <Canvas camera={{ position: [5, 0, 0], near: 0.025 }}>
      <ambientLight intensity={0.5} />
      <OrbitControls />
      {!isPlaying && <Points currentFramePoints={data?.points || []} />}
      <Cuboids
        currentFrameCuboids={data?.cuboids || []}
        nextFrameCuboids={nextFrame?.cuboids || null}
      />
      <Control
        handlePlayStop={handlePlayStop}
        handleStep={handleStep}
        currentFrame={currentFrameIndex}
        totalFrames={totalFrames}
        handleReplay={handleReplay}
        isPlaying={isPlaying}
      />
      <gridHelper args={[50]} />
      <axesHelper args={[50]} />
    </Canvas>
  );
}
