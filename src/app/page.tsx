"use client";
import { Canvas } from "@react-three/fiber";
// import { Box } from "./components/Box";
import useSWR from "swr";
import { fetcher } from "@/lib";
import { FramesData } from "@/types";
import { Point } from "./components/Points";
import { extend } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "three-stdlib";
import { CameraController } from "./components/CameraController";
extend({ OrbitControls, TransformControls });

export default function Home() {
  const { data, error, isLoading } = useSWR<FramesData>("/api/data", fetcher);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Failed to load data</div>;
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <CameraController />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <Point points={data?.points || []} />
    </Canvas>
  );
}
