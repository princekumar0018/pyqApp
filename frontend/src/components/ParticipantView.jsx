import React, { useEffect, useRef } from "react";
import { useParticipant, VideoPlayer, usePubSub } from "@videosdk.live/react-sdk";

function ParticipantView({ participantId }) {
  const micRef = useRef(null);

  // ✅ Always define this first
  const { micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  // ✅ Store local participant ID (for focus mode)
  useEffect(() => {
    if (isLocal) {
      localStorage.setItem("participantId", participantId);
    }
  }, [isLocal, participantId]);

  // ✅ Handle mic audio playback
  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("audioElement.play() failed:", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  // ✅ Optional: Highlight focused participant (if you added focus mode)
  const { messages } = usePubSub("focus-mode");
  const focusedParticipantId = messages?.length
    ? messages[messages.length - 1].message
    : null;
  const isFocused = participantId === focusedParticipantId;

  return (
    <div
      style={{
        background: isFocused ? "#007bff" : "#222",
        transform: isFocused ? "scale(1.05)" : "scale(1)",
        transition: "all 0.3s ease",
        padding: "10px",
        borderRadius: "10px",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <p>
        👤 <b>{displayName}</b> | 🎥 {webcamOn ? "ON" : "OFF"} | 🎙️{" "}
        {micOn ? "ON" : "OFF"}
      </p>

      {/* 🔊 Mic audio */}
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />

      {/* 🎥 Video feed */}
      {webcamOn && (
        <VideoPlayer
          participantId={participantId}
          type="video"
          containerStyle={{
            width: "100%",
            height: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
          className="video-tile"
          classNameVideo="h-full"
          videoStyle={{
            objectFit: "cover",
          }}
        />

      )}
    </div>
  );
}

export default ParticipantView;
