// api.js
import axios from "axios";

const API = axios.create({
   baseURL: "https://your-backend-service.onrender.com/api",
});

export default API;
