import axios from "axios";
import {
  getAccessToken,
  removeAccessToken,
  clearUserData,
} from "./sessionStorage";

export const API_BASE_URL =
  "http://localhost:3001/api/v1";

// export const API_BASE_URL = "https://server-89nw.onrender.com/api/v1";

export const apiStatusConstants = {
  INITIAL: "INITIAL",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  IN_PROGRESS: "IN_PROGRESS",
};

// 🔥 Common Axios Config
const createApiClient = (contentType = "application/json") => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": contentType,
    },
  });

  // 🔹 Request Interceptor (Inject Token)
  instance.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 🔹 Response Interceptor (Auto Logout on 401)
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        removeAccessToken();
        clearUserData();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// ✅ JSON client
export const apiClientJson = createApiClient(
  "application/json"
);

// ✅ Form-data client
export const apiClientForm = createApiClient(
  "multipart/form-data"
);

// ✅ Default client
const apiClient = createApiClient();

export default apiClient;