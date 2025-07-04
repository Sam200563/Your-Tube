import React, { useEffect, useRef, useState, useContext } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { Callcontext } from "./Callcontext";
import './Videocall.css'

const Videocall = () => {
  const currentuser = useSelector((state) => state.currentuserreducer);
  const username =
    currentuser?.result?.name ||
    currentuser?.result?.username ||
    currentuser?.result?.email;
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const {
    socketRef,
    peerRef,
    mediaStreamRef,
    screenStreamRef,
    recorderRef,
    recordedChunksref,
    targetSocketIdRef,
  } = useContext(Callcontext);
  const [calleeName, setCalleeName] = useState("");
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenShared, setIsScreenShared] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!currentuser) {
      alert("Please login to use VOIP");
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000");
      socketRef.current.on("receive-call", ({ offer, fromSocketId }) => {
        handleOffer({ offer, fromSocketId });
      });

      socketRef.current.on("call-answered", ({ answer }) => {
        if (peerRef.current) {
          peerRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        }
      });

      socketRef.current.on("ice-candidate", ({ candidate }) => {
        if (peerRef.current && candidate) {
          peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socketRef.current.on("call-ended", () => {
        if (peerRef.current) peerRef.current.close();
        setIsCallStarted(false);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
      });

      if (username) {
        socketRef.current.emit("register-user", username);
      }
    }

    if (!mediaStreamRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          mediaStreamRef.current = stream;
        });
    } else {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStreamRef.current;
      }
    }

    if (screenStreamRef.current) {
      const sender = peerRef.current
        ?.getSenders?.()
        .find((s) => s.track.kind === "video");
      const screenTrack = screenStreamRef.current.getVideoTracks?.()[0];
      if (sender && screenTrack) {
        sender.replaceTrack(screenTrack);
      }
    }

    if (remoteVideoRef.current && peerRef.current) {
      const remoteTracks = peerRef.current
        .getReceivers()
        .map((r) => r.track)
        .filter((track) => track.kind === "video");
      if (remoteTracks.length) {
        remoteVideoRef.current.srcObject = new MediaStream(remoteTracks);
      }
    }
  }, [currentuser, username]);

  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peer.onicecandidate = (e) => {
      if (e.candidate && targetSocketIdRef.current) {
        socketRef.current.emit("ice-candidate", {
          targetSocketId: targetSocketIdRef.current,
          candidate: e.candidate,
        });
      }
    };

    peer.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, mediaStreamRef.current);
      });
    }
    return peer;
  };

  const startCall = async () => {
    if (!calleeName.trim())
      return alert("please enter the recipient's username");
    const peer = createPeer();
    peerRef.current = peer;

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socketRef.current.emit("call-user", {
      targetUsername: calleeName,
      offer,
      fromSocketId: socketRef.current.id,
    });
    setIsCallStarted(true);
  };

  const handleOffer = async ({ offer, fromSocketId }) => {
    const peer = createPeer();
    peerRef.current = peer;
    targetSocketIdRef.current = fromSocketId;

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socketRef.current.emit("answer-call", {
      targetSocketId: fromSocketId,
      answer,
    });
    setIsCallStarted(true);
  };

  const shareScreen = async () => {
    if (!peerRef.current)
      return alert("start the call before sharing the screen.");
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      screenStreamRef.current = screenStream;
      setIsScreenShared(true);

      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = peerRef.current
        .getSenders()
        .find((s) => s.track.kind === "video");
      if (sender) sender.replaceTrack(screenTrack);

      screenTrack.onended = () => {
        const cameraTrack = mediaStreamRef.current.getVideoTracks()[0];
        if (cameraTrack && sender) sender.replaceTrack(cameraTrack);
        screenStreamRef.current = null;
        setIsScreenShared(false);
      };
    } catch (error) {
      alert("screen share failed:" + error.message);
    }
  };

  const startRecording = () => {
    const streamToRecord = screenStreamRef.current;
    if (!streamToRecord) return alert("share screen first");
    const recorder = new MediaRecorder(streamToRecord);
    recorderRef.current = recorder;
    recordedChunksref.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksref.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksref.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  const toggleMute = () => {
    mediaStreamRef.current
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsMuted((prev) => !prev);
  };

  const endCall = () => {
    peerRef.current?.close();
    setIsCallStarted(false);
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    socketRef.current.emit("end-call", {
      targetSocketId: targetSocketIdRef.current,
    });
    socketRef.current?.disconnect();
  };

  return (
    <div className="video-call-container">
      <h2 style={{ textAlign: "center" }}>Video Call</h2>
      <div className="input-container">
        <label>Recipient Username (email):</label>
        <input
          type="text"
          placeholder="Enter username to call"
          value={calleeName}
          onChange={(e) => setCalleeName(e.target.value)}
          style={{ marginLeft: 10, padding: "6px 10px", borderRadius: 4 }}
        />
      </div>
      {isRecording && (
        <div className="recording-badge">
          Recording.....
        </div>
      )}
      {isScreenShared && (
        <div className="screenshare-badge">
          Screen Sharing
        </div>
      )}
      <div className="videos-wrapper">
        <div className="local-video-container">
          <h4 style={{ textAlign: "center" }}>Local Video</h4>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="local-video"
          />
        </div>
        <div className="remote-video-container">
          <h4 style={{ textAlign: "center" }}>Remote Video</h4>
          <video
            ref={remoteVideoRef}
            autoPlay
            muted
            playsInline
            className="remote-video"
          />
        </div>
      </div>
      <div className="buttons-wrapper">
        <button
          onClick={startCall}
          disabled={isCallStarted}
          style={buttonStyle}
        >
          Start Call
        </button>
        <button onClick={shareScreen} style={buttonStyle}>
          Share Screen
        </button>
        <button onClick={startRecording} style={buttonStyle}>
          Start Recording
        </button>
        <button onClick={stopRecording} style={buttonStyle}>
          Stop & Download
        </button>
        <button onClick={toggleMute} style={buttonStyle}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={endCall}
          style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
        >
          End Call
        </button>
      </div>
    </div>
  );
};
const buttonStyle = {
  padding: "10px 8px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#3498db",
  color: "white",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export default Videocall;
