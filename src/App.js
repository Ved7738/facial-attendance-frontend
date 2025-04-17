import React, { useEffect, useState } from 'react';
import './App.css';
import './output.css';
import WebcamCapture from './components/WebcamCapture';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import axios from 'axios';

function App() {
  const [view, setView] = useState('recognize');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAdmin') === 'true';
    if (loggedIn) setIsAdmin(true);
  }, []);

  const handleCapture = (imageData) => {
    if (!imageData) {
      alert("Failed to capture image.");
      return;
    }

    const cleanBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");

    axios
      .post('http://127.0.0.1:5000/recognize', {
        image: cleanBase64,
      })
      .then((res) => {
        console.log("✅ Recognized:", res.data);
        alert(`✅ Welcome, ${res.data.name || "Unknown User"}`);
      })
      .catch((err) => {
        console.error("❌ Recognition failed:", err);
        alert("❌ Recognition failed");
      });
  };

  const handleLogout = () => {
    axios.post('http://127.0.0.1:5000/logout', {}, { withCredentials: true })
      .then(() => {
        setIsAdmin(false);
        localStorage.removeItem('isAdmin');
        setView('recognize');
      });
  };

  const onLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo.png" alt="Company Logo" className="App-logo" />
        <h1 className="App-title">Facial + Iris Attendance</h1>

        <div className="mt-4">
          <button onClick={() => setView('recognize')} className="btn mr-2">
            Recognition
          </button>
          <button onClick={() => setView('admin')} className="btn">
            Admin Panel
          </button>
          {isAdmin && (
            <button onClick={handleLogout} className="btn ml-2 bg-red-600 hover:bg-red-700">
              Logout
            </button>
          )}
        </div>
      </header>

      <div className="card">
        {view === 'admin' ? (
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <AdminLogin onLoginSuccess={onLoginSuccess} />
          )
        ) : (
          <WebcamCapture onCapture={handleCapture} />
        )}
      </div>
    </div>
  );
}

export default App;
