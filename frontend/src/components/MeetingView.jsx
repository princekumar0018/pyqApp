import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";
import Controls from "../components/Controls";


function MeetingView({ meetingId, onMeetingLeave, onLeave }) {
	const [joined, setJoined] = useState(null);
	const [left, setLEft] = useState(null);
	const containerRef = useRef(null);
	const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

	// 🎯 Get meeting methods & participants
	const { join, participants, localParticipant } = useMeeting({
		onMeetingJoined: () => {
			console.log("✅ Joined meeting successfully");
			setJoined("JOINED");
		},
		onMeetingLeft: () => {
			console.log("🚪 Left meeting");
			// Support either prop name
			if (onMeetingLeave) onMeetingLeave();
			else if (onLeave) onLeave();
		},
	});
	const { publish, messages } = usePubSub("focus-mode");

	// Track container size to compute grid without vertical scroll
	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const measure = () => {
			const rect = el.getBoundingClientRect();
			setContainerSize({ width: rect.width, height: rect.height });
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		window.addEventListener("resize", measure);
		window.addEventListener("orientationchange", measure);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", measure);
			window.removeEventListener("orientationchange", measure);
		};
	}, []);

	// Extract the current focused participantId (if any)
	const CLEAR_FOCUS = "__CLEAR_FOCUS__";
	const lastMessage = messages?.length ? messages[messages.length - 1].message : null;
	const focusedParticipantId = lastMessage === CLEAR_FOCUS ? null : lastMessage;

	const joinMeeting = () => {
		console.log("Joining meeting...");
		setJoined("JOINING");
		join();
	};

	// Compute best-fit columns to avoid scroll (tiles are ~16:9)
	const layout = useMemo(() => {
		const count = participants.size || 1;
		const W = Math.max(0, containerSize.width);
		const H = Math.max(0, containerSize.height);
		const aspect = 16 / 9;
		if (!W || !H) return { cols: Math.min(count, 3) || 1 };
		let best = { cols: 1, area: 0 };
		for (let cols = 1; cols <= count; cols++) {
			const rows = Math.ceil(count / cols);
			const maxTileWByWidth = W / cols;
			const maxTileWByHeight = (H / rows) * aspect; // since height = width/aspect -> width = height*aspect
			const tileW = Math.min(maxTileWByWidth, maxTileWByHeight);
			const tileH = tileW / aspect;
			const area = tileW * tileH;
			if (area > best.area) best = { cols, area };
		}
		return { cols: best.cols };
	}, [participants.size, containerSize.width, containerSize.height]);

	// Local participant id (for enabling focus on self). Prefer SDK's localParticipant.
	const myId = useMemo(() => {
		if (localParticipant?.id) return localParticipant.id;
		const stored = localStorage.getItem("participantId");
		if (stored) return stored;
		const first = [...participants.keys()][0];
		return first || null;
	}, [localParticipant, participants]);

	return (
		<div
			style={{
				background: "#111",
				color: "#fff",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<h2 style={{ textAlign: "center", padding: "16px 12px 0" }}>Meeting ID: {meetingId}</h2>

			{joined === "JOINED" ? (
				<>
					{/* Focus mode toggle */}
					<div style={{ textAlign: "center", marginTop: 10 }}>
						<button
							onClick={() => {
								if (focusedParticipantId) publish(CLEAR_FOCUS);
								else if (myId) publish(myId);
							}}
							style={{
								backgroundColor: focusedParticipantId ? "#dc3545" : "#007bff",
								color: "#fff",
								padding: "8px 16px",
								borderRadius: 6,
								border: "none",
								cursor: "pointer",
							}}
						>
							{focusedParticipantId ? "Exit Focus Mode" : "Enable Focus (Me)"}
						</button>
					</div>

					{/* Optional global controls */}
					<div style={{ textAlign: "center" }}>
						<Controls />
					</div>

					{/* Participants area */}
					<div style={{ flex: 1, minHeight: 0, padding: "16px 20px" }}>
						<div ref={containerRef} style={{ height: "100%" }}>
							{focusedParticipantId ? (
								<div style={{ display: "grid", placeItems: "center", height: "100%" }}>
									<div
										style={{ width: "min(100%, 1400px)", cursor: "pointer" }}
										onClick={() => publish(CLEAR_FOCUS)}
										title="Click to exit focus"
									>
										<ParticipantView participantId={focusedParticipantId} />
									</div>
								</div>
							) : (
								<div
									style={{
										display: "grid",
										gap: 16,
										gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
										alignItems: "center",
										justifyItems: "center",
										height: "100%",
									}}
								>
									{[...participants.keys()].map((participantId) => (
										<div
											key={participantId}
											style={{ width: "100%", cursor: "pointer" }}
											onClick={() =>
												publish(
													focusedParticipantId === participantId
														? CLEAR_FOCUS
														: participantId
												)
											}
											title={
												focusedParticipantId === participantId
													? "Click to exit focus"
													: "Click to focus"
											}
										>
											<ParticipantView participantId={participantId} />
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</>
			) : joined === "JOINING" ? (
				<p style={{ textAlign: "center", marginTop: 30 }}>Joining the meeting...</p>
			) : (
				<div style={{ textAlign: "center", marginTop: 30 }}>
					<button
						onClick={joinMeeting}
						style={{
							backgroundColor: "#007bff",
							color: "#fff",
							border: "none",
							padding: "10px 20px",
							borderRadius: 6,
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
