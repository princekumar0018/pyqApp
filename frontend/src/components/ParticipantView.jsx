import React, { useEffect, useRef, useState } from "react";
import { useParticipant, VideoPlayer, usePubSub, useMeeting } from "@videosdk.live/react-sdk";

function ParticipantView({ participantId }) {
  const micRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // ✅ Always define this first
  const { micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  // ✅ Meeting controls for local participant
  const { leave, toggleMic, toggleWebcam } = useMeeting();

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
  const CLEAR_FOCUS = "__CLEAR_FOCUS__";
  const lastMessage = messages?.length ? messages[messages.length - 1].message : null;
  const focusedParticipantId = lastMessage === CLEAR_FOCUS ? null : lastMessage;
  const isFocused = participantId === focusedParticipantId;

  // 🔤 Helper: get initials for placeholder avatar
  const getInitials = (name = "User") => {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "U";
    const second = parts[1]?.[0] || (parts[0]?.[1] || "");
    return (first + second).toUpperCase();
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: isFocused ? "#0d6efd" : "#1f1f1f",
        transform: isFocused ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        padding: "10px",
        borderRadius: "12px",
        color: "#fff",
        textAlign: "center",
        boxShadow: isFocused ? "0 8px 24px rgba(13,110,253,0.35)" : "0 6px 18px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ marginBottom: 8, opacity: 0.9, fontSize: 14 }}>
        👤 <b>{displayName}</b> • 🎥 {webcamOn ? "On" : "Off"} • 🎙️ {micOn ? "On" : "Off"}
      </div>

      {/* 🔊 Mic audio */}
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />

      {/* 🎥 Video feed or placeholder */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: 12,
          overflow: "hidden",
          background: webcamOn
            ? "transparent"
            : "linear-gradient(135deg, #2a2a2a 0%, #1b1b1b 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {webcamOn ? (
          <VideoPlayer
            participantId={participantId}
            type="video"
            containerStyle={{ width: "100%", height: "100%" }}
            videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          // 📷 Placeholder avatar when camera is off
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 30% 30%, #3a3a3a, #2a2a2a 60%, #1f1f1f)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ddd",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 1,
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              {getInitials(displayName)}
            </div>
            <div style={{ color: "#aaa", fontSize: 13 }}>Camera is off</div>
          </div>
        )}

        {/* 🎛️ Overlay controls on top of video (local only) */}
        {isLocal && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              gap: 10,
              padding: 10,
              background: hovered
                ? "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 60%)"
                : "transparent",
              transition: "background 0.2s ease",
            }}
          >
            <button
              onClick={() => leave()}
              title="Leave meeting"
              style={{
                background: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                opacity: hovered ? 1 : 0.85,
              }}
            >
              Leave
            </button>
            <button
              onClick={() => toggleMic()}
              title={micOn ? "Mute microphone" : "Unmute microphone"}
              style={{
                background: micOn ? "#198754" : "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                opacity: hovered ? 1 : 0.9,
              }}
            >
              {micOn ? "Mic On" : "Mic Off"}
            </button>
            <button
              onClick={() => toggleWebcam()}
              title={webcamOn ? "Turn camera off" : "Turn camera on"}
              style={{
                background: webcamOn ? "#0d6efd" : "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                opacity: hovered ? 1 : 0.9,
              }}
            >
              {webcamOn ? "Camera On" : "Camera Off"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticipantView;
