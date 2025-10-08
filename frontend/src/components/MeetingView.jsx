import React, { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import Controls from "../components/Controls";
import ParticipantView from "./ParticipantView";


function MeetingView({ meetingId, onMeetingLeave }) {
  const [joined, setJoined] = useState(null);

  // 🎯 Get meeting methods & participants
  const { join, participants } = useMeeting({
    onMeetingJoined: () => {
      console.log("✅ Joined meeting successfully");
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      console.log("🚪 Left meeting");
      onMeetingLeave();
    },
  });

  const joinMeeting = () => {
    console.log("Joining meeting...");
    setJoined("JOINING");
    join();
  };

  return (
    <div
      style={{
        background: "#111",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Meeting ID: {meetingId}</h2>

      {joined === "JOINED" ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {/* ✅ Meeting Controls */}
          <Controls />

          {/* ✅ Participants */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                key={participantId}
                participantId={participantId}
              />
            ))}
          </div>
        </div>
      ) : joined === "JOINING" ? (
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          Joining the meeting...
        </p>
      ) : (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={joinMeeting}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Join Meeting
          </button>
        </div>
      )}
    </div>
  );
}

export default MeetingView;
