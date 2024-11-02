import * as THREE from "three";
import { Point as PointType } from "@/types";

type Params = {
  point: PointType;
};

function getColorFromZ(z: number): THREE.Color {
  const minZ = -10;
  const maxZ = 50;
  const clampedZ = Math.max(minZ, Math.min(z, maxZ));
  const normalizedZ = (clampedZ - minZ) / (maxZ - minZ);

  const gradientColors = [
    new THREE.Color("#0000FF"),
    new THREE.Color("#00FFFF"),
    new THREE.Color("#00FF00"),
    new THREE.Color("#FFFF00"),
    new THREE.Color("#FFA500"),
    new THREE.Color("#FF0000"),
  ];

  const step = 1 / (gradientColors.length - 1);
  const index = Math.floor(normalizedZ / step);
  const remainder = (normalizedZ % step) / step;

  if (index >= gradientColors.length - 1) {
    return gradientColors[gradientColors.length - 1];
  }
  const result = gradientColors[index]
    .clone()
    .lerp(gradientColors[index + 1], remainder);
  return result;
}

export function Point({ point }: Params) {
  return (
    <mesh visible position={point}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshBasicMaterial color={getColorFromZ(point[2])} />
    </mesh>
  );
}
