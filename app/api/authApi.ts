import axiosInstance from "@/lib/axiosInstance"

interface LoginCredentials {
  email: string
  password: string
}

interface GoogleLoginCredentials {
  email: string
}

interface GoogleTokenCredentials {
  token: string
}

// Regular login
export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials)
    console.log("Login success")
    return response.data
  } catch (error) {
    console.error("Error during login:", error)
    throw error
  }
}

// Login with Google Email
export const loginWithGoogle = async (email: string) => {
  try {
    const response = await axiosInstance.post("/oauth2/authorization/google", { email }) // Gửi email dưới dạng object
    console.log("Google login success", response.data)
    return response.data
  } catch (error) {
    console.error("Error during Google login:", error)
    throw error
  }
}


// Login with Google JWT Token
export const loginWithGoogleToken = async (credentials: GoogleTokenCredentials) => {
  try {
    const response = await axiosInstance.post("/auth/login/token/google", credentials)
    console.log("Google token login success")
    return response.data
  } catch (error) {
    console.error("Error during Google token login:", error)
    throw error
  }
}