// api.js
import axios from "axios";

const API = axios.create({
   baseURL: "https://task-manager-backend-tpl6.onrender.com",
});

export default API;
