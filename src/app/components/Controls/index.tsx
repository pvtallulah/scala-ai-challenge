import { Html } from "@react-three/drei";

type ControlProps = {
  handleStep: (step: number) => void;
  currentFrame: number;
  totalFrames: number;
};

export const Control = ({
  handleStep,
  currentFrame,
  totalFrames,
}: ControlProps) => {
  return (
    <Html
      prepend
      calculatePosition={(el, camera, size) => {
        const offsetX = size.width / 2.5;
        const offsetY = size.height - 50;
        return [offsetX, offsetY];
      }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#2f2f2f",
        color: "#f5f5f5",
        position: "absolute",
        bottom: 0,
        height: "100px",
        width: "400px",
      }}
    >
      <button
        onClick={() => handleStep(-1)}
        disabled={currentFrame <= 0}
        style={{
          marginRight: "20px",
          padding: "10px",
          backgroundColor: "#444",
          color: "#f5f5f5",
          border: "none",
          borderRadius: "5px",
          cursor: currentFrame > 0 ? "pointer" : "not-allowed",
        }}
      >
        Step Back
      </button>
      <div>
        Frame {currentFrame + 1} of {totalFrames}
      </div>
      <button
        onClick={() => handleStep(1)}
        disabled={currentFrame >= totalFrames - 1}
        style={{
          marginLeft: "20px",
          padding: "10px",
          backgroundColor: "#444",
          color: "#f5f5f5",
          border: "none",
          borderRadius: "5px",
          cursor: currentFrame < totalFrames - 1 ? "pointer" : "not-allowed",
        }}
      >
        Step Forward
      </button>
    </Html>
  );
};
