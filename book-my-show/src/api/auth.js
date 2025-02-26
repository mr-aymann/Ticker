import axiosInstance from "./config"

export const login = async (payload) => {
    console.log("API hit: Sending payload:", payload);
    try {
      const response = await axiosInstance.post('/auth/login', payload);
      console.log("API response:", response);
      return response;
    } catch (error) {
      console.error("API error:", error.response || error);
      throw error;
    }
  }
  
export const register = (payload) => axiosInstance.post('/auth/register', payload);
export const forgetPassword = () => axiosInstance.post('/auth/forget');
// export const  = () => axiosInstance.get('/auth/forget');