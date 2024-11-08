import { Html } from "@react-three/drei";

import { Cuboid as CuboidType } from "@/types";

type TooltipProps = {
  hoveredCuboid: CuboidType | null;
};

export const Tooltip = ({ hoveredCuboid }: TooltipProps) => {
  if (!hoveredCuboid) return null;
  const x = hoveredCuboid["position.x"];
  const y = hoveredCuboid["position.y"];
  const z = hoveredCuboid["position.z"];

  return (
    <Html
      position={[x + 5, y + 5, z + 5]}
      as="div"
      style={{
        backgroundColor: "#2f2f2f",
        padding: "15px",
        width: "380px",
        height: "fit-content",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div>
        <div style={{ color: "#f5f5f5" }}>ID: {hoveredCuboid.uuid}</div>
        <div style={{ color: "#f5f5f5" }}>Label: {hoveredCuboid.label}</div>
        <div style={{ color: "#f5f5f5" }}>
          Stationary: {hoveredCuboid.stationary ? "Yes" : "No"}
        </div>
        <div style={{ color: "#f5f5f5" }}>
          Sensor: {hoveredCuboid["cuboids.sensor_id"]}
        </div>
        {hoveredCuboid["cuboids.sibling_id"] !== "-" && (
          <div style={{ color: "#f5f5f5" }}>
            Sibling: {hoveredCuboid["cuboids.sibling_id"]}
          </div>
        )}
      </div>
    </Html>
  );
};
