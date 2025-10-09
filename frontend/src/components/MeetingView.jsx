import React, { useState } from "react";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
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
	const { publish, messages } = usePubSub("focus-mode");

	// Extract the current focused participantId (if any)
	const focusedParticipantId = messages?.length
		? messages[messages.length - 1].message
		: null;

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
					<div style={{ marginTop: "10px", textAlign: "center" }}>
						{focusedParticipantId ? (
							<button
								onClick={() => publish(null)} // Clear focus
								style={{
									backgroundColor: "#dc3545",
									color: "#fff",
									padding: "8px 16px",
									borderRadius: "6px",
									border: "none",
									cursor: "pointer",
								}}
							>
								Exit Focus Mode
							</button>
						) : (
							<button
								onClick={() => publish(localStorage.getItem("participantId"))}
								style={{
									backgroundColor: "#007bff",
									color: "#fff",
									padding: "8px 16px",
									borderRadius: "6px",
									border: "none",
									cursor: "pointer",
								}}
							>
								Enable Focus Mode
							</button>
						)}
					</div>

					<Controls />

					{/* ✅ Participants */}
					{/* 🎥 If someone is focused, show only that participant */}
					{focusedParticipantId ? (
						<div style={{ textAlign: "center", marginTop: "30px" }}>
							<ParticipantView participantId={focusedParticipantId} />
						</div>
					) : (
						// Normal responsive grid
						<div
							style={{
								display: "grid",
								gap: "20px",
								justifyContent: "center",
								alignItems: "center",
								marginTop: "30px",
								gridTemplateColumns:
									participants.size === 1
										? "1fr"
										: participants.size === 2
											? "repeat(2, 1fr)"
											: participants.size <= 4
												? "repeat(2, 1fr)"
												: participants.size <= 6
													? "repeat(3, 1fr)"
													: "repeat(auto-fill, minmax(300px, 1fr))",
							}}
						>
							{[...participants.keys()].map((participantId) => (
								<ParticipantView key={participantId} participantId={participantId} />
							))}
						</div>
					)}


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
