import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000'; // Change to your deployed backend later

export const recognizeFace = (imageBase64) => {
  return axios.post(`${BASE_URL}/recognize`, { image: imageBase64 });
};

export const getTodayAttendance = () => {
  return axios.get(`${BASE_URL}/attendance/today`);
};
