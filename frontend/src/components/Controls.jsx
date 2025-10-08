import React from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();

  return (
    <div style={{ marginTop: "20px" }}>
      <button
        onClick={() => leave()}
        style={{ margin: "5px", padding: "8px 12px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" }}
      >
        Leave
      </button>
      <button
        onClick={() => toggleMic()}
        style={{ margin: "5px", padding: "8px 12px", background: "#17a2b8", color: "#fff", border: "none", borderRadius: "4px" }}
      >
        Toggle Mic
      </button>
      <button
        onClick={() => toggleWebcam()}
        style={{ margin: "5px", padding: "8px 12px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}
      >
        Toggle Webcam
      </button>
    </div>
  );
}

export default Controls;
