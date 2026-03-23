import axios from "axios";
import { clearAuthSession } from "../utils/authSession.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const instance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

function clearSessionAndRedirectToLogin() {
  clearAuthSession();

  if (!window.location.pathname.startsWith("/auth/")) {
    window.location.href = "/auth/login";
  }
}

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log("une erreur est survenue:", error);
    return Promise.reject(new Error(error));
  },
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const apiMessage = `${error?.response?.data?.error || ""}`.toLowerCase();

    if (status === 401 && apiMessage.includes("jwt expired")) {
      clearSessionAndRedirectToLogin();
      return Promise.reject(
        new Error("Session expirée, merci de vous reconnecter."),
      );
    }

    return Promise.reject(error);
  },
);

export default instance;
