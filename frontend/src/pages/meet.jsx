import React, { useEffect, useRef, useState } from "react";
import toast from 'react-hot-toast';
import {
	MeetingProvider,
	useMeeting,
	useParticipant,
} from "@videosdk.live/react-sdk";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import MeetingView from "../components/MeetingView";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


// ========================
// 🎥 Participant component
// ========================
const ParticipantView = ({ participantId }) => {
	const { webcamStream, micStream, webcamOn, micOn, displayName } =
		useParticipant(participantId);
	const videoRef = useRef(null);

	useEffect(() => {
		if (webcamOn && videoRef.current) {
			const mediaStream = new MediaStream();
			mediaStream.addTrack(webcamStream.track);
			videoRef.current.srcObject = mediaStream;
			videoRef.current.play();
		}
	}, [webcamOn, webcamStream]);

	return (
		<div className="flex flex-col items-center bg-gray-800 p-3 rounded-lg shadow-md">
			<h3 className="text-white text-sm mb-2">{displayName}</h3>
			<video ref={videoRef} autoPlay playsInline width="300" className="rounded-lg" />
		</div>
	);
};

// ========================
// 🎮 Meeting Controls
// ========================




// ========================
// 🚪 Join Screen
// ========================
function JoinScreen({ getMeetingAndToken }) {
	const [meetingId, setMeetingId] = useState("");

	// When user clicks "Join" or "Create"
	const handleJoin = async () => {
		if (!meetingId) {
			toast.error("Please enter a meeting ID or create one.");
			return;
		}
		await getMeetingAndToken(meetingId); // join existing meeting
	};

	const handleCreate = async () => {
		await getMeetingAndToken(null); // create a new meeting
	};

	return (
		<div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh", gap: "12px" }}>
			<h2 className="brand-gradient">Join or Create a Meeting</h2>

			<input
				type="text"
				placeholder="Enter Meeting ID"
				value={meetingId}
				onChange={(e) => setMeetingId(e.target.value)}
				style={{
					padding: "10px 12px",
					borderRadius: "10px",
					border: "1px solid #cfd8dc",
					width: "280px",
					textAlign: "center",
					boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
				}}
			/>

			<div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
				<button onClick={handleJoin} className="btn-success-edu" style={{ padding: "10px 18px", borderRadius: "10px" }}>
					Join Meeting
				</button>

				<button onClick={handleCreate} className="btn-primary-edu" style={{ padding: "10px 18px", borderRadius: "10px" }}>
					Create Meeting
				</button>
			</div>
		</div>
	);
}


// ========================
// 🚀 Main Component
// ========================
const Meet = () => {
	const [meetingId, setMeetingId] = useState(null);
	const [token, setToken] = useState("");
	const [participantName, setParticipantName] = useState("");

	// 1️⃣ Create or join a meeting
	const getMeetingAndToken = async (id, name) => {
		try {
			let newMeetingId;

			// 🟢 If no meeting ID is provided → create a new meeting
			if (!id) {
				const res = await axios.post(BACKEND_URL+"/meet/create-room");
				newMeetingId = res.data.roomId;
				console.log("🆕 Created new meeting:", newMeetingId);
			} else {
				// 🟡 If user provided a meeting ID → join that meeting
				newMeetingId = id;
				console.log("🔗 Joining existing meeting:", newMeetingId);
			}

			// ✅ Set participant info and token
			setMeetingId(newMeetingId);
			setParticipantName(name || "Guest-" + uuidv4().slice(0, 4));

			const token = import.meta.env.VITE_VIDEOSDK_TOKEN;
			console.log("✅ VideoSDK Token Loaded:", token);

			setToken(token);
		} catch (err) {
			console.error("❌ Error creating or joining meeting:", err);
			toast.error("Something went wrong while joining the meeting. Check console for details.");
		}
	};


	const onMeetingLeave = () => {
		setMeetingId(null);
	};

	return token && meetingId ? (
		<MeetingProvider
			config={{
				meetingId,
				micEnabled: true,
				webcamEnabled: true,
				name: participantName,
			}}
			token={token}
		>
			<MeetingView meetingId={meetingId} onLeave={onMeetingLeave} />
		</MeetingProvider>
	) : (
		<JoinScreen getMeetingAndToken={getMeetingAndToken} />
	);
};

export default Meet;
