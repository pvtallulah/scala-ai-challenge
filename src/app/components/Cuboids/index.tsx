import * as THREE from "three";
import { Cuboid as CuboidType } from "@/types";
import { useMemo, useRef } from "react";
import { getColorFromZ } from "@/lib";

type Params = {
  cuboids: CuboidType[];
};

export const Cuboids = ({ cuboids }: Params) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numCuboids = cuboids.length;

  useMemo(() => {
    if (!meshRef.current) return;

    const colorArray = new Float32Array(numCuboids * 3);
    const matrix = new THREE.Matrix4();

    for (let i = 0; i < numCuboids; i++) {
      const cuboid = cuboids[i];
      const posX = cuboid["position.x"];
      const posY = cuboid["position.y"];
      const posZ = cuboid["position.z"];
      const dimX = cuboid["dimensions.x"];
      const dimY = cuboid["dimensions.y"];
      const dimZ = cuboid["dimensions.z"];
      const yaw = cuboid.yaw;

      matrix
        .identity()
        .makeRotationY(yaw)
        .scale(new THREE.Vector3(dimX, dimY, dimZ))
        .setPosition(posX, posY, posZ);

      meshRef.current.setMatrixAt(i, matrix);

      const color = getColorFromZ(posZ);
      color.toArray(colorArray, i * 3);
    }
    console.log("Cuboids updateds");
    meshRef.current.geometry.setAttribute(
      "color",
      new THREE.InstancedBufferAttribute(colorArray, 3)
    );
  }, [cuboids, numCuboids]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, numCuboids]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial vertexColors opacity={0.5} transparent />
    </instancedMesh>
  );
};
