import React, { useState, useRef, useEffect } from "react";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import Controls from "../components/Controls";
import ParticipantView from "./ParticipantView";
import axios from "axios";

function MeetingView({ meetingId, onMeetingLeave }) {
	const [joined, setJoined] = useState(null);
	const [summaries, setSummaries] = useState([]);
	const [isSummarizing, setIsSummarizing] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isRecording, setIsRecording] = useState(false);

	const mediaRecorderRef = useRef(null);
	const intervalRef = useRef(null);
	const streamRef = useRef(null);
	const summaryContainerRef = useRef(null);

	useEffect(() => {
		if (summaryContainerRef.current) {
			summaryContainerRef.current.scrollTop =
				summaryContainerRef.current.scrollHeight;
		}
	}, [summaries]);

	// 🧠 Start summarizer
	const startGeminiSummarizer = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;

			let mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
			mediaRecorderRef.current = mediaRecorder;
			let chunks = [];

			mediaRecorder.ondataavailable = async (event) => {
				if (event.data.size > 0) chunks.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				if (chunks.length === 0) return;
				const blob = new Blob(chunks, { type: "audio/webm" });
				chunks = [];

				const formData = new FormData();
				formData.append("audio", blob, "recording.webm");
				formData.append("mimeType", "audio/webm");

				try {
					setIsSummarizing(true);

					const res = await axios.post(
						"http://localhost:5000/meet/live-summary",
						formData,
						{
							headers: { "Content-Type": "multipart/form-data" },
						}
					);

					const data = res.data;
					if (
						data.result &&
						typeof data.result === "string" &&
						data.result.trim() !== "" &&
						data.result !== "null" &&
						data.result !== "Null"
					) {
						setSummaries((prev) => [...prev, data.result.trim()]);
					}
				} catch (error) {
					console.error("❌ Error sending audio:", error);
				} finally {
					setIsSummarizing(false);
				}
			};

			mediaRecorder.start();
			setIsRecording(true);

			intervalRef.current = setInterval(() => {
				if (mediaRecorder.state === "recording") {
					mediaRecorder.stop();
					mediaRecorder.start();
				}
			}, 20000);
		} catch (error) {
			console.error("❌ Audio capture failed:", error);
		}
	};

	// 🛑 Stop summarizer
	const stopGeminiSummarizer = () => {
		try {
			setIsRecording(false);
			if (intervalRef.current) clearInterval(intervalRef.current);
			if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
				mediaRecorderRef.current.stop();
			}
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((t) => t.stop());
			}
			console.log("🛑 Summarization stopped");
		} catch (err) {
			console.error("Error stopping summarizer:", err);
		}
	};

	const { join, participants } = useMeeting({
		onMeetingJoined: () => {
			console.log("✅ Joined meeting successfully");
			setJoined("JOINED");
		},
		onMeetingLeft: () => {
			console.log("🚪 Left meeting");
			stopGeminiSummarizer();
			onMeetingLeave();
		},
	});

	const { publish, messages } = usePubSub("focus-mode");

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
				position: "relative",
				background: "#111",
				color: "#fff",
				minHeight: "100vh",
				overflow: "hidden",
			}}
		>
			{/* 🧠 Floating Sidebar Overlay */}
			<div
				style={{
					position: "fixed",
					right: isSidebarOpen ? "0" : "-470px",
					top: 0,
					height: "100vh",
					width: "450px",
					backgroundColor: "#1e1e1e",
					boxShadow: "0 0 20px rgba(0,0,0,0.6)",
					padding: "20px",
					transition: "right 0.3s ease",
					zIndex: 1000,
					display: "flex",
					flexDirection: "column",
				}}
			>
				{/* Header and Close Button */}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<h2 style={{ color: "#00bfff", margin: 0 }}> AI Summary</h2>
					<button
						onClick={() => setIsSidebarOpen(false)}
						style={{
							backgroundColor: "transparent",
							border: "none",
							color: "#fff",
							fontSize: "22px",
							cursor: "pointer",
						}}
					>
						CLOSE
					</button>
				</div>

				{/* Controls */}
				<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
					{!isRecording ? (
						<button
							onClick={startGeminiSummarizer}
							style={{
								backgroundColor: "#007bff",
								color: "#fff",
								border: "none",
								padding: "10px 15px",
								borderRadius: "6px",
								cursor: "pointer",
								fontWeight: "600",
							}}
						>
							Start Summary
						</button>
					) : (
						<button
							onClick={stopGeminiSummarizer}
							style={{
								backgroundColor: "#dc3545",
								color: "#fff",
								border: "none",
								padding: "10px 15px",
								borderRadius: "6px",
								cursor: "pointer",
								fontWeight: "600",
							}}
						>
							Stop Summary
						</button>
					)}
				</div>

				{isSummarizing && (
					<p style={{ color: "#00bfff", fontStyle: "italic", marginTop: "10px" }}>
						Analyzing audio...
					</p>
				)}

				{/* Summaries */}
				<div
					ref={summaryContainerRef}
					style={{
						flexGrow: 1,
						marginTop: "20px",
						overflowY: "auto",
						scrollbarWidth: "thin",
						paddingRight: "8px",
					}}
				>
					{summaries.length > 0 ? (
						summaries.map((s, i) => (
							<p
								key={i}
								style={{
									backgroundColor: "#2a2a2a",
									marginBottom: "12px",
									padding: "14px",
									borderRadius: "10px",
									fontSize: "17px",
									lineHeight: "1.6",
								}}
							>
								{s}
							</p>
						))
					) : (
						<p style={{ color: "#888" }}>Waiting for summaries...</p>
					)}
				</div>
			</div>

			{/* 🎥 Floating open button */}
			{!isSidebarOpen && (
				<button
					onClick={() => setIsSidebarOpen(true)}
					style={{
						position: "fixed",
						right: "20px",
						top: "20px",
						backgroundColor: "#00bfff",
						color: "#fff",
						border: "none",
						padding: "12px 18px",
						borderRadius: "8px",
						cursor: "pointer",
						fontWeight: "600",
						boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
						zIndex: 999,
					}}
				>
					🧠 AI Summarizer
				</button>
			)}

			{/* 🎥 Main Meeting Content */}
			<div style={{ padding: "20px" }}>
				<h2 style={{ textAlign: "center" }}>Meeting ID: {meetingId}</h2>

				{joined === "JOINED" ? (
					<div style={{ textAlign: "center", marginTop: "20px" }}>
						{/* Meeting Controls */}
						<div style={{ marginTop: "10px" }}>
							{focusedParticipantId ? (
								<button
									onClick={() => publish(null)}
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

						{/* Participants */}
						{focusedParticipantId ? (
							<div style={{ textAlign: "center", marginTop: "30px" }}>
								<ParticipantView participantId={focusedParticipantId} />
							</div>
						) : (
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
		</div>
	);
}

export default MeetingView;
