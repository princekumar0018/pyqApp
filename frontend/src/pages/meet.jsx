// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";

// const socket = io("http://localhost:5000"); // backend signaling server

// const Meet = () => {
//   const [roomId, setRoomId] = useState("");
//   const [joined, setJoined] = useState(false);
//   const [remoteJoined, setRemoteJoined] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isCameraOff, setIsCameraOff] = useState(false);

//   const myVideo = useRef();
//   const userVideo = useRef();
//   const peerRef = useRef();
//   const streamRef = useRef();

//   // 🔹 Initialize socket listeners
//   useEffect(() => {
//     socket.on("user-joined", (id) => {
//       console.log("Another user joined:", id);
//       callUser(id);
//     });

//     socket.on("signal", handleSignal);

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   // 🔹 Join a room
//   const joinRoom = async () => {
//     if (!roomId) return alert("Enter a room ID");
//     setJoined(true);

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     streamRef.current = stream;
//     myVideo.current.srcObject = stream;
//     myVideo.current.play();

//     socket.emit("join-room", roomId);
//   };

//   // 🔹 Handle incoming signals
//   const handleSignal = async ({ from, signal }) => {
//     if (!peerRef.current) {
//       const peer = new Peer({
//         initiator: false,
//         trickle: false,
//         stream: streamRef.current,
//       });
//       peer.on("signal", (sig) => {
//         socket.emit("signal", { signal: sig, to: from });
//       });
//       peer.on("stream", (remoteStream) => {
//         userVideo.current.srcObject = remoteStream;
//         setRemoteJoined(true);
//       });
//       peer.signal(signal);
//       peerRef.current = peer;
//     } else {
//       peerRef.current.signal(signal);
//     }
//   };

//   // 🔹 Call another user
//   const callUser = (id) => {
//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream: streamRef.current,
//     });
//     peer.on("signal", (signal) => {
//       socket.emit("signal", { signal, to: id });
//     });
//     peer.on("stream", (remoteStream) => {
//       userVideo.current.srcObject = remoteStream;
//       setRemoteJoined(true);
//     });
//     peerRef.current = peer;
//   };

//   // 🔹 Mute/Unmute
//   const toggleMute = () => {
//     if (!streamRef.current) return;
//     const audioTrack = streamRef.current.getAudioTracks()[0];
//     audioTrack.enabled = !audioTrack.enabled;
//     setIsMuted(!audioTrack.enabled);
//   };

//   // 🔹 Camera on/off
//   const toggleCamera = () => {
//     if (!streamRef.current) return;
//     const videoTrack = streamRef.current.getVideoTracks()[0];
//     videoTrack.enabled = !videoTrack.enabled;
//     setIsCameraOff(!videoTrack.enabled);
//   };

//   // 🔹 Leave the call
//   const leaveCall = () => {
//     peerRef.current?.destroy();
//     streamRef.current?.getTracks().forEach((t) => t.stop());
//     setJoined(false);
//     setRemoteJoined(false);
//     socket.disconnect();
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//       {!joined ? (
//         <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
//           <h2 className="text-xl font-bold mb-3">Join a Meeting</h2>
//           <input
//             type="text"
//             className="p-2 rounded w-64 text-black mb-3"
//             placeholder="Enter Room ID"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//           />
//           <button
//             onClick={joinRoom}
//             className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
//           >
//             Join Room
//           </button>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center gap-4">
//           <div className="flex gap-4">
//             <video
//               ref={myVideo}
//               muted
//               autoPlay
//               playsInline
//               className="rounded-lg border-2 border-blue-500 w-72"
//             />
//             {remoteJoined ? (
//               <video
//                 ref={userVideo}
//                 autoPlay
//                 playsInline
//                 className="rounded-lg border-2 border-green-500 w-72"
//               />
//             ) : (
//               <div className="w-72 h-52 flex items-center justify-center bg-gray-700 rounded-lg">
//                 Waiting for other user...
//               </div>
//             )}
//           </div>

//           <div className="flex gap-3 mt-4">
//             <button
//               onClick={toggleMute}
//               className={`px-4 py-2 rounded ${
//                 isMuted ? "bg-red-600" : "bg-gray-700"
//               }`}
//             >
//               {isMuted ? "Unmute" : "Mute"}
//             </button>
//             <button
//               onClick={toggleCamera}
//               className={`px-4 py-2 rounded ${
//                 isCameraOff ? "bg-red-600" : "bg-gray-700"
//               }`}
//             >
//               {isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
//             </button>
//             <button
//               onClick={leaveCall}
//               className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded"
//             >
//               Leave
//             </button>
//           </div>

//           <p className="text-sm mt-3">Room ID: {roomId}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Meet;


import React from 'react'

const Meet = () => {
  return (
    <div>Meet</div>
  )
}

export default Meet