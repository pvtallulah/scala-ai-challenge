import * as THREE from "three";
import { Cuboid as CuboidType } from "@/types";
import { useEffect, useRef } from "react";
import { getColorFromZ } from "@/lib";

type Params = {
  cuboids: CuboidType[];
};

export const Cuboids = ({ cuboids }: Params) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numCuboids = cuboids.length;

  useEffect(() => {
    if (!meshRef.current) return;

    const colorArray = new Float32Array(numCuboids * 3);
    const cube = new THREE.Object3D();

    for (let i = 0; i < numCuboids; i++) {
      const cuboid = cuboids[i];

      const x = cuboid["position.x"];
      const y = cuboid["position.y"];
      const z = cuboid["position.z"];
      const dimX = cuboid["dimensions.x"];
      const dimY = cuboid["dimensions.y"];
      const dimZ = cuboid["dimensions.z"];
      const yaw = cuboid["yaw"];

      cube.position.set(y, z, x);
      cube.rotation.set(0, yaw, 0);
      cube.scale.set(dimY, dimZ, dimX);
      cube.updateMatrix();

      meshRef.current.setMatrixAt(i, cube.matrix);

      const color = getColorFromZ(z);
      color.toArray(colorArray, i * 3);
    }

    const colorAttribute = new THREE.InstancedBufferAttribute(colorArray, 3);
    meshRef.current.geometry.setAttribute("color", colorAttribute);
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [cuboids, numCuboids]);

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, numCuboids]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial vertexColors opacity={0.45} transparent />
      </instancedMesh>

      {cuboids.map((cuboid, index) => {
        const x = cuboid["position.x"];
        const y = cuboid["position.y"];
        const z = cuboid["position.z"];
        const dimX = cuboid["dimensions.x"];
        const dimY = cuboid["dimensions.y"];
        const dimZ = cuboid["dimensions.z"];
        const yaw = cuboid["yaw"];

        return (
          <lineSegments
            key={cuboid.uuid || index}
            position={[y, z, x]}
            rotation={[0, yaw, 0]}
            scale={[dimY, dimZ, dimX]}
          >
            <edgesGeometry
              attach="geometry"
              args={[new THREE.BoxGeometry(1, 1, 1)]}
            />
            <lineBasicMaterial attach="material" color="black" />
          </lineSegments>
        );
      })}
    </>
  );
};
