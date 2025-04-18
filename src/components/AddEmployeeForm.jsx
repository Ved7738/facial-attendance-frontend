import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

const AddEmployeeForm = () => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const video = document.querySelector("video");
    navigator.mediaDevices.getUserMedia({ video: true })
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
    setCapturedImage(canvas.toDataURL("image/jpeg"));
  };

  const handleSave = async () => {
    if (!name || !designation || !capturedImage) {
      alert("Please provide all info and capture an image.");
      return;
    }

    try {
      const image = capturedImage.replace(/^data:image\/\w+;base64,/, "");

      const embeddingRes = await axios.post(
        `${BASE_URL}/extract-embeddings`,
        { image },
        { withCredentials: true }
      );

      const { face_embeddings, iris_embeddings } = embeddingRes.data;

      await axios.post(`${BASE_URL}/add-employee`, {
        name,
        designation,
        face_embeddings: face_embeddings[0],
        iris_embeddings: iris_embeddings[0]
      }, { withCredentials: true });

      alert("✅ Employee added!");
      setName('');
      setDesignation('');
      setCapturedImage(null);
    } catch (err) {
      console.error("❌ Error during save:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mb-2 border" />
      <input type="text" placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full p-2 mb-2 border" />
      <video autoPlay width="100%" className="mb-2" />
      <button onClick={handleCapture} className="btn mb-2">📷 Capture</button>
      {capturedImage && <img src={capturedImage} alt="Preview" className="mb-2 rounded shadow-md" width="200" />}
      <button onClick={handleSave} className="btn bg-green-600 hover:bg-green-700">Save Employee</button>
    </div>
  );
};

export default AddEmployeeForm;
