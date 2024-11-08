import { useRef, useState } from "react";
import * as THREE from "three";

import { useFrame } from "@react-three/fiber";
import { getColorFromZ } from "@/lib";
import { Cuboid as CuboidType } from "@/types";
import { Tooltip } from "@/app/components/Tooltip";

type MovingCuboidsProps = {
  currentFrameCuboids: CuboidType[];
  nextFrameCuboids: CuboidType[] | null;
  isPlaying: boolean;
};

export const MovingCuboids = ({
  currentFrameCuboids,
  nextFrameCuboids,
  isPlaying,
}: MovingCuboidsProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numCuboids = currentFrameCuboids.length;
  const [hoveredCuboid, setHoveredCuboid] = useState<CuboidType | null>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || !nextFrameCuboids) return;
    const colorArray = new Float32Array(numCuboids * 3);
    for (let i = 0; i < numCuboids; i++) {
      const currentCuboid = currentFrameCuboids[i];
      if (currentCuboid.stationary) continue;
      const nextCuboid = nextFrameCuboids.find(
        (c) => c.uuid === currentCuboid.uuid
      );
      if (nextCuboid) {
        const currentPos = new THREE.Vector3(
          currentCuboid["position.x"],
          currentCuboid["position.y"],
          currentCuboid["position.z"]
        );
        const nextPos = new THREE.Vector3(
          nextCuboid["position.x"],
          nextCuboid["position.y"],
          nextCuboid["position.z"]
        );

        const interpolatedPos = currentPos.lerp(nextPos, delta);

        const cube = new THREE.Object3D();
        cube.position.copy(interpolatedPos);
        const yaw = nextCuboid["yaw"];
        cube.rotation.set(0, 0, -yaw);
        cube.scale.set(
          nextCuboid["dimensions.y"],
          nextCuboid["dimensions.z"],
          nextCuboid["dimensions.x"]
        );
        cube.updateMatrix();

        meshRef.current.setMatrixAt(i, cube.matrix);
      }
      const color = getColorFromZ(currentCuboid["position.x"]);
      color.toArray(colorArray, i * 3);
    }
    const colorAttribute = new THREE.InstancedBufferAttribute(colorArray, 3);
    meshRef.current.geometry.setAttribute("color", colorAttribute);
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const handlePointerOver = (cuboid: CuboidType) => {
    setHoveredCuboid(cuboid);
  };

  const handlePointerOut = () => {
    setHoveredCuboid(null);
  };

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, numCuboids]}
        onPointerOver={(event) =>
          handlePointerOver(currentFrameCuboids[event.instanceId!])
        }
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial vertexColors opacity={0.45} transparent />
      </instancedMesh>
      {currentFrameCuboids.map((cuboid, index) => {
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
            position={[x, y, z]}
            rotation={[0, 0, -yaw]}
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
      {hoveredCuboid && !isPlaying && <Tooltip hoveredCuboid={hoveredCuboid} />}
    </>
  );
};
