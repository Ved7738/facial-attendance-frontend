import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';
import { recognizeFace } from '../components/services/api';  // Correct path
import { BASE_URL } from '../config'; // Adjust path if needed

const FaceRecognition = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCapture = async (imageBase64) => {
    try {
      const base64Only = imageBase64.split(',')[1]; // Remove prefix
      const response = await recognizeFace(base64Only);
      setResult(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Recognition failed.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 space-y-4">
      <WebcamCapture onCapture={handleCapture} />
      {result && (
        <div className="text-center bg-green-100 p-4 rounded-xl mt-4 w-[350px] shadow">
          <h2 className="text-xl font-semibold text-green-800">✅ {result.name}</h2>
          <p className="text-sm">Distance: {result.distance}</p>
          <p className="text-sm text-gray-600">Attendance: {result.attendance}</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FaceRecognition;
