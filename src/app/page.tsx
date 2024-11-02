"use client";
import { Canvas } from "@react-three/fiber";
import { Points } from "./components/Points";
import { Cuboids } from "./components/Cuboids";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import { Control } from "./components/Controls";
import { useFrameContext } from "@/context/FrameContext";

export default function Home() {
  const { currentFrameIndex, setCurrentFrameIndex, getCurrentFrameData } =
    useFrameContext();
  const totalFrames = 50;

  const handleStep = (step: number) => {
    setCurrentFrameIndex((prev) => {
      const newFrameIndex = prev + step;
      return newFrameIndex >= 0 && newFrameIndex < totalFrames
        ? newFrameIndex
        : prev;
    });
  };

  const data = getCurrentFrameData();

  useEffect(() => {
    console.log("Current Frame Data:", data);
  }, [data]);

  if (!data) return <div className="text-white">Loading frames...</div>;

  return (
    <Canvas camera={{ position: [5, 0, 0], near: 0.025 }}>
      <ambientLight intensity={0.5} />
      <OrbitControls />
      <Points points={data?.points || []} />
      <Cuboids cuboids={data?.cuboids || []} />
      <Control
        handleStep={handleStep}
        currentFrame={currentFrameIndex}
        totalFrames={totalFrames}
      />
      <gridHelper args={[50]} />
      <axesHelper args={[50]} />
    </Canvas>
  );
}
