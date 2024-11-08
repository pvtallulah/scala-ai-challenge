"use client";
import * as THREE from "three";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Points } from "@/app/components/Points";
import { Cuboids } from "@/app/components/Cuboids";
import { Control } from "@/app/components/Controls";
import { useFrameContext } from "@/context/FrameContext";

const Scene = () => {
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
    <Canvas
      orthographic={false}
      camera={{
        zoom: 1,
        rotation: new THREE.Euler(0, Math.PI / 2, Math.PI / 2),
        position: [10, 10, 15],
        up: [0, 0, 1],
      }}
    >
      <ambientLight intensity={0.5} />
      <OrbitControls rotation={[Math.PI / 2, 0, Math.PI / 2]} />

      <Points currentFramePoints={data?.points || []} />
      <Cuboids
        currentFrameCuboids={data?.cuboids || []}
        nextFrameCuboids={nextFrame?.cuboids || null}
        isPlaying={isPlaying}
      />

      <Control
        handlePlayStop={handlePlayStop}
        handleStep={handleStep}
        currentFrame={currentFrameIndex}
        totalFrames={totalFrames}
        handleReplay={handleReplay}
        isPlaying={isPlaying}
      />
      <group rotation={new THREE.Euler(0, Math.PI / 2, Math.PI / 2)}>
        <axesHelper args={[50]} />
        <gridHelper args={[50]} />
      </group>
    </Canvas>
  );
};

export default Scene;
