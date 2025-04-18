import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { BASE_URL } from './config';

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleMarkAttendance = async () => {
    if (!webcamRef.current) return alert("Webcam not ready.");
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return alert("❌ Failed to capture image.");
    const cleanBase64 = imageSrc.replace(/^data:image\/\w+;base64,/, "");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/recognize`, { image: cleanBase64 });
      const { name, attendance } = res.data;

      if (attendance === "marked") {
        alert(`✅ Attendance marked for ${name}`);
      } else if (attendance === "already marked") {
        alert(`⚠️ Attendance already marked for ${name}`);
      } else {
        alert(`❌ Attendance failed for ${name || "Unknown"}`);
      }
    } catch (err) {
      console.error("❌ Error marking attendance:", err);
      alert("❌ Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-8">
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-xl border shadow-md" width={350} />
      <div className="h-10" />
      <button onClick={handleMarkAttendance} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-lg">
        {loading ? "Marking..." : "📋 Mark Attendance"}
      </button>
    </div>
  );
};

export default WebcamCapture;
