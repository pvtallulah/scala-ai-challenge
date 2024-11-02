"use client";
import { Canvas } from "@react-three/fiber";
import { Box } from "./components/Box";
import useSWR from "swr";
import { fetcher } from "@/lib";
import { FramesData } from "@/types";

export default function Home() {
  const { data, error, isLoading } = useSWR<FramesData>("/api/data", fetcher);

  console.log(data, error, isLoading);
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
}
