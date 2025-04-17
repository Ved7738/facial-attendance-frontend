import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEmployeeForm = () => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);

  // Step 1: Make sure the video feed is running
  useEffect(() => {
    const video = document.querySelector("video");
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error("Webcam access denied:", err);
        alert("Failed to access webcam. Please allow webcam permission.");
      });
  }, []);

  const handleCapture = () => {
    const video = document.querySelector("video");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg");

    // Log the base64 string for preview
    console.log("📸 Base64 image preview:", base64.slice(0, 100));

    setCapturedImage(base64);
  };

  const handleSave = async () => {
    if (!name || !designation || !capturedImage) {
      alert("Please provide all info and capture an image.");
      return;
    }

    // Step 3: Validate the captured image
    if (!capturedImage || !capturedImage.startsWith("data:image")) {
      alert("Image capture failed. Please try again.");
      return;
    }

    try {
      const image = capturedImage.replace(/^data:image\/\w+;base64,/, "");

      // Log base64 preview before sending
      console.log("✅ Captured Image Base64:", capturedImage.slice(0, 100));
      console.log("✅ Sending Base64 Part:", image.slice(0, 100));

      // Step 1: Get Embeddings
      const embeddingRes = await axios.post(
        'http://127.0.0.1:5000/extract-embeddings',
        { image },
        { withCredentials: true }
      );
      const { face_embeddings, iris_embeddings } = embeddingRes.data;

      // Step 2: Save employee
      await axios.post('http://127.0.0.1:5000/add-employee', {
        name,
        designation,
        face_embeddings: face_embeddings[0],  // <-- flatten
        iris_embeddings: iris_embeddings[0]   // <-- flatten
      }, { withCredentials: true });
      

      alert("✅ Employee added!");
      setName('');
      setDesignation('');
      setCapturedImage(null);

    } catch (err) {
      console.error("❌ Error during save:", err);
      if (err.response) {
        console.error("🚨 Backend Error:", err.response.data);
      } else {
        console.error("❌ No response from server:", err.message);
      }
      alert("Something went wrong. Check the logs.");
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-2 border"
      />
      <input
        type="text"
        placeholder="Designation"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
        className="w-full p-2 mb-2 border"
      />

      {/* Video feed for capturing the image */}
      <video autoPlay width="100%" className="mb-2" />

      <button onClick={handleCapture} className="btn mb-2">📷 Capture</button>

      {capturedImage && <img src={capturedImage} alt="Preview" className="mb-2 rounded shadow-md" width="200" />}

      <button onClick={handleSave} className="btn bg-green-600 hover:bg-green-700">Save Employee</button>
    </div>
  );
};

export default AddEmployeeForm;
