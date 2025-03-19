import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // Thay thế bằng URL cơ sở của API của bạn
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance