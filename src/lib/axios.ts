import axios from "axios";

// Create instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://shitty_endpint:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
