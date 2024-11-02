import { Html } from "@react-three/drei";
import { useEffect } from "react";

type ControlProps = {
  handleStep: (step: number) => void;
  handleReplay: () => void;
  handlePlayStop: () => void;
  currentFrame: number;
  totalFrames: number;
  isPlaying: boolean;
};

export const Control = ({
  handleStep,
  handleReplay,
  handlePlayStop,
  currentFrame,
  totalFrames,
  isPlaying,
}: ControlProps) => {
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        handleStep(1);
      }, 500);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, handleStep]);

  return (
    <Html
      prepend
      calculatePosition={(el, camera, size) => {
        const offsetX = size.width / 3;
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
        height: "60px",
        width: "520px",
      }}
    >
      <button
        onClick={() => handleStep(-1)}
        disabled={currentFrame <= 0}
        style={{
          marginRight: "10px",
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
      <button
        onClick={() => handlePlayStop()}
        style={{
          marginRight: "10px",
          padding: "10px",
          backgroundColor: isPlaying ? "#900" : "#444",
          color: "#f5f5f5",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isPlaying ? "Stop" : "Play"}
      </button>
      <div>
        Frame {currentFrame + 1} of {totalFrames}
      </div>
      <button
        onClick={handleReplay}
        style={{
          marginLeft: "10px",
          padding: "10px",
          backgroundColor: "#444",
          color: "#f5f5f5",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Replay
      </button>
      <button
        onClick={() => handleStep(1)}
        disabled={currentFrame >= totalFrames - 1}
        style={{
          marginLeft: "10px",
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
