import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://your-backend-url.com/api", // Thay thế bằng URL backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
})

export default axiosInstance