import * as THREE from "three";
import { Point as PointType } from "@/types";
import { useEffect, useRef } from "react";
import { getColorFromZ } from "@/lib";

type Params = {
  currentFramePoints: PointType[];
};

export const Points = ({ currentFramePoints }: Params) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numPoints = currentFramePoints.length;

  useEffect(() => {
    if (!meshRef.current) return;

    const colorArray = new Float32Array(numPoints * 3);
    const sphere = new THREE.Object3D();

    for (let i = 0; i < numPoints; i++) {
      const [x, y, z] = currentFramePoints[i];
      sphere.position.set(y, z, x);
      sphere.updateMatrix();
      meshRef.current.setMatrixAt(i, sphere.matrix);

      const color = getColorFromZ(z);
      color.toArray(colorArray, i * 3);
    }

    const colorAttribute = new THREE.InstancedBufferAttribute(colorArray, 3);
    meshRef.current.geometry.setAttribute("color", colorAttribute);
  }, [currentFramePoints, numPoints]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, numPoints]}>
      <sphereGeometry args={[0.03, 4, 4]} />
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  );
};
