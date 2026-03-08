import axios from "axios";

export const apiBase = axios.create({
    baseURL: "http://10.0.2.2:5000",
    headers: {
        "Content-Type": "application/json",
    },
})

export const apiClient = axios.create({
  baseURL: "http://10.0.2.2:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.get("/health").then((res) => {
  console.log("API HEALTH:", res.data);
});