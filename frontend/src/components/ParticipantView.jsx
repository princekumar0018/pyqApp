import React, { useEffect, useRef } from "react";
import { useParticipant, VideoPlayer } from "@videosdk.live/react-sdk";

function ParticipantView({ participantId }) {
  const micRef = useRef(null);

  const { micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  // 🔊 Play participant's mic audio
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

  return (
    <div
      style={{
        background: "#222",
        padding: "10px",
        borderRadius: "10px",
        color: "#fff",
        textAlign: "center",
        width: "320px",
      }}
    >
      <p>
        👤 <b>{displayName}</b> | 🎥 {webcamOn ? "ON" : "OFF"} | 🎙️{" "}
        {micOn ? "ON" : "OFF"}
      </p>

      {/* 🔊 Audio for participant */}
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />

      {/* 🎥 Video feed */}
      {webcamOn && (
        <VideoPlayer
          participantId={participantId}
          type="video"
          containerStyle={{
            width: "80vw",          // 80% of the screen width
            height: "auto",
            maxHeight: "80vh",      // keep it inside the viewport
            borderRadius: "16px",
            overflow: "hidden",
            margin: "auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
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
