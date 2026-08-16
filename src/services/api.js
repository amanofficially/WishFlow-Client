// ONE central Axios client for the whole app.
// Every page imports THIS instead of creating its own axios calls.
// That way, if the API URL changes, we only update it in one place.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // sends our HTTP-only auth cookie automatically
});

export default api;
