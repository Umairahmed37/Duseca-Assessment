import axios, { AxiosError } from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.log(error);

    if (error.response?.status) {
      throw error.response?.data ?? { message: "Something went wrong!" };
    }

    throw error;
  },
);

const API = axios;

export default API;
