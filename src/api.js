import axios from 'axios';

const API = axios.create({ baseURL: "https://backed-apti.onrender.com/api" });

// const API = axios.create({ baseURL: "http://localhost:9500/api" });

export default API;
