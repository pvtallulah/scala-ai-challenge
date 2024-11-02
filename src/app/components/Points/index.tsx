import * as THREE from "three";
import { Point as PointType } from "@/types";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getColorFromZ } from "@/lib";

type Params = {
  points: PointType[];
};

export function Point({ points }: Params) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numPoints = points.length;

  useMemo(() => {
    if (!meshRef.current) return;

    const colorArray = new Float32Array(numPoints * 3);
    const matrix = new THREE.Matrix4();

    for (let i = 0; i < numPoints; i++) {
      const [x, y, z] = points[i];
      matrix.setPosition(x, y, z);
      meshRef.current.setMatrixAt(i, matrix);

      const color = getColorFromZ(z);
      color.toArray(colorArray, i * 3);
    }

    meshRef.current.geometry.setAttribute(
      "color",
      new THREE.InstancedBufferAttribute(colorArray, 3)
    );
  }, [points, numPoints]);

  useFrame(({ camera }) => {
    if (!meshRef.current) return;

    const frustum = new THREE.Frustum();
    const projScreenMatrix = new THREE.Matrix4();
    projScreenMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(projScreenMatrix);

    for (let i = 0; i < numPoints; i++) {
      const pointPosition = new THREE.Vector3(...points[i]);
      if (frustum.containsPoint(pointPosition)) {
        meshRef.current.setMatrixAt(
          i,
          new THREE.Matrix4().makeTranslation(...points[i])
        );
      } else {
        meshRef.current.setMatrixAt(
          i,
          new THREE.Matrix4().makeTranslation(0, 0, -10000)
        );
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, numPoints]}>
      <sphereGeometry args={[0.05, 4, 4]} />
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  );
}
