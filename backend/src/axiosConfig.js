// import axios from "axios";

// const token = localStorage.getItem("supervisorToken");
// const instance = axios.create({
//   baseURL: "http://localhost:5000",
//   headers: {
//     Authorization: token ? `Bearer ${token}` : "",
//   },
// });

import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("supervisorToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;

