import { useEffect } from "react";
import { useThree, extend } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "three-stdlib";
extend({ OrbitControls, TransformControls });

export const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 0;
    controls.maxDistance = 200;
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};
