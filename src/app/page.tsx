"use client";
import { Canvas } from "@react-three/fiber";
import useSWR from "swr";
import { fetcher } from "@/lib";
import { FramesData } from "@/types";
import { Points } from "./components/Points";
import { Cuboids } from "./components/Cuboids";
import { OrbitControls } from "@react-three/drei";

export default function Home() {
  const { data, error, isLoading } = useSWR<FramesData>("/api/data", fetcher);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Failed to load data</div>;
  return (
    <Canvas camera={{ position: [5, 0, 0], near: 0.025 }}>
      <ambientLight intensity={0.5} />
      <OrbitControls />
      <Points points={data?.points || []} />
      <Cuboids cuboids={data?.cuboids || []} />
      <gridHelper args={[50]} />
      <axesHelper args={[50]} />
    </Canvas>
  );
}
