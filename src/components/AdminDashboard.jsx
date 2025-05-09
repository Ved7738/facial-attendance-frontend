import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from './config';
import AddEmployeeForm from './AddEmployeeForm';

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/employees`, { withCredentials: true });
      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/attendance`, { withCredentials: true });
      setAttendance(res.data);
    } catch (error) {
      console.error("Failed to fetch attendance", error);
    }
  };

  const downloadCSV = (data, filename) => {
    if (!data.length) return alert("No data to export.");
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="p-4">
      <AddEmployeeForm />
      <h2 className="text-xl font-bold mt-6">Employees</h2>
      <table className="w-full table-auto border mb-4">
        <thead><tr><th>ID</th><th>Name</th></tr></thead>
        <tbody>
          {employees.map(emp => <tr key={emp.id}><td>{emp.id}</td><td>{emp.name}</td></tr>)}
        </tbody>
      </table>

      <h2 className="text-xl font-bold">Attendance</h2>
      <table className="w-full table-auto border">
        <thead><tr><th>Name</th><th>Time</th></tr></thead>
        <tbody>
          {attendance.map((a, i) => <tr key={i}><td>{a.name}</td><td>{a.time}</td></tr>)}
        </tbody>
      </table>

      <div className="mt-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded mb-2" onClick={() => downloadCSV(employees, "employees.csv")}>⬇️ Export Employees</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={() => downloadCSV(attendance, "attendance.csv")}>⬇️ Export Attendance</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
