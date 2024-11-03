import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { Cuboid as CuboidType } from "@/types";
import { getColorFromZ } from "@/lib";
import { Tooltip } from "../Tooltip";

type Params = {
  currentFrameCuboids: CuboidType[];
  nextFrameCuboids: CuboidType[] | null;
};

export const Cuboids = ({ currentFrameCuboids, nextFrameCuboids }: Params) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [hoveredCuboid, setHoveredCuboid] = useState<CuboidType | null>(null);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);
  const numCuboids = currentFrameCuboids.length;

  useEffect(() => {
    if (!meshRef.current) return;

    const colorArray = new Float32Array(numCuboids * 3);
    const cube = new THREE.Object3D();

    for (let i = 0; i < numCuboids; i++) {
      const cuboid = currentFrameCuboids[i];

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
  }, [currentFrameCuboids, numCuboids]);

  useFrame((state, delta) => {
    if (!meshRef.current || !nextFrameCuboids) return;

    for (let i = 0; i < numCuboids; i++) {
      const currentCuboid = currentFrameCuboids[i];
      if (currentCuboid.stationary) continue;
      const nextCuboid = nextFrameCuboids.find(
        (c) => c.uuid === currentCuboid.uuid
      );
      if (nextCuboid) {
        const currentPos = new THREE.Vector3(
          currentCuboid["position.y"],
          currentCuboid["position.z"],
          currentCuboid["position.x"]
        );
        const nextPos = new THREE.Vector3(
          nextCuboid["position.y"],
          nextCuboid["position.z"],
          nextCuboid["position.x"]
        );

        const interpolatedPos = currentPos.lerp(nextPos, delta);

        const cube = new THREE.Object3D();
        cube.position.copy(interpolatedPos);
        cube.rotation.set(0, nextCuboid["yaw"], 0);
        cube.scale.set(
          nextCuboid["dimensions.y"],
          nextCuboid["dimensions.z"],
          nextCuboid["dimensions.x"]
        );
        cube.updateMatrix();

        meshRef.current.setMatrixAt(i, cube.matrix);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const handlePointerOver = (cuboid: CuboidType) => {
    if (!isHoveringTooltip) {
      setHoveredCuboid(cuboid);
    }
  };

  const handlePointerOut = () => {
    if (!isHoveringTooltip) {
      setHoveredCuboid(null);
    }
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
      {hoveredCuboid && (
        <Tooltip
          hoveredCuboid={hoveredCuboid}
          setIsHoveringTooltip={setIsHoveringTooltip}
        />
      )}
    </>
  );
};
