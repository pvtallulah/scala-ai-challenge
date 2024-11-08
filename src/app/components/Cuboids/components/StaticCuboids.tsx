import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Cuboid as CuboidType } from "@/types";
import { getColorFromZ } from "@/lib";
import { Tooltip } from "@/app/components/Tooltip";

type StaticCuboidsProps = {
  staticCuboids: CuboidType[];
};

export const StaticCuboids = ({ staticCuboids }: StaticCuboidsProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numCuboids = staticCuboids.length;
  const [hoveredCuboid, setHoveredCuboid] = useState<CuboidType | null>(null);

  useEffect(() => {
    if (!meshRef.current) return;

    const colorArray = new Float32Array(numCuboids * 3);
    const cube = new THREE.Object3D();

    for (let i = 0; i < numCuboids; i++) {
      const cuboid = staticCuboids[i];
      const x = cuboid["position.x"];
      const y = cuboid["position.y"];
      const z = cuboid["position.z"];
      const dimX = cuboid["dimensions.x"];
      const dimY = cuboid["dimensions.y"];
      const dimZ = cuboid["dimensions.z"];
      const yaw = cuboid["yaw"];

      cube.position.set(x, y, z);
      cube.rotation.set(0, 0, -yaw);
      cube.scale.set(dimY, dimZ, dimX);
      cube.updateMatrix();

      meshRef.current.setMatrixAt(i, cube.matrix);

      const color = getColorFromZ(x);
      color.toArray(colorArray, i * 3);
    }

    const colorAttribute = new THREE.InstancedBufferAttribute(colorArray, 3);
    meshRef.current.geometry.setAttribute("color", colorAttribute);
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [staticCuboids, numCuboids]);

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
          handlePointerOver(staticCuboids[event.instanceId!])
        }
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial vertexColors opacity={0.45} transparent />
      </instancedMesh>
      {staticCuboids.map((cuboid, index) => {
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
      {hoveredCuboid && <Tooltip hoveredCuboid={hoveredCuboid} />}
    </>
  );
};
