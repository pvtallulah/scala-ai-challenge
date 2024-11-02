import * as THREE from "three";

export const getColorFromZ = (z: number) => {
  const minZ = -10;
  const maxZ = 50;
  const clampedZ = Math.max(minZ, Math.min(z, maxZ));
  const normalizedZ = (clampedZ - minZ) / (maxZ - minZ);

  const gradientColors = [
    new THREE.Color("#FF0000"),
    new THREE.Color("#FF7F00"),
    new THREE.Color("#FFFF00"),
    new THREE.Color("#7FFF00"),
    new THREE.Color("#00FF00"),
    new THREE.Color("#00FF7F"),
    new THREE.Color("#00FFFF"),
    new THREE.Color("#007FFF"),
    new THREE.Color("#0000FF"),
    new THREE.Color("#7F00FF"),
    new THREE.Color("#FF00FF"),
  ];

  const step = 1 / (gradientColors.length - 1);
  const index = Math.floor(normalizedZ / step);
  const remainder = (normalizedZ % step) / step;

  if (index >= gradientColors.length - 1) {
    return gradientColors[gradientColors.length - 1];
  }
  return gradientColors[index]
    .clone()
    .lerp(gradientColors[index + 1], remainder);
};
