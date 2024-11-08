import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { Point as PointType } from "@/types";
import { getColorFromZ } from "@/lib";

type Params = {
  currentFramePoints: PointType[];
};

export const Points = ({ currentFramePoints }: Params) => {
  const meshRef = useRef<THREE.Points>(null);
  const numPoints = currentFramePoints.length;
  console.time("render");

  // Memoize colors to avoid recalculation on every render
  const colors = useMemo(() => {
    console.time("colorCalculation");
    const colorArray = new Float32Array(
      currentFramePoints.flatMap(([x]) => {
        const color = getColorFromZ(x);
        return [color.r, color.g, color.b];
      })
    );
    console.timeEnd("colorCalculation");
    return colorArray;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;

    const points = new Float32Array(currentFramePoints.flat());

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    meshRef.current.geometry = geometry;

    console.timeEnd("render");
  }, [currentFramePoints, numPoints]);

  return (
    <points ref={meshRef}>
      <pointsMaterial attach="material" size={0.05} vertexColors />
    </points>
  );
};
