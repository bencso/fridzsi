import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const BASE_URL = Constants.expoConfig?.extra?.apiUrl;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.data &&
      error.response.data.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) {
          router.replace("/(notauth)/auth/login");
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          BASE_URL + "/auth/refresh",
          { refreshToken },
          { withCredentials: true }
        );

        const tokens = {
          access: refreshResponse.data.accessToken,
          refresh: refreshResponse.data.refreshToken,
        };
        if (tokens.access && tokens.refresh) {
          await SecureStore.setItemAsync("accessToken", String(tokens.access));
          await SecureStore.setItemAsync(
            "refreshToken",
            String(tokens.refresh)
          );
          originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
          return api(originalRequest);
        } else {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          router.replace("/(notauth)/auth/login");
        }
      } catch {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        router.replace("/(notauth)/auth/login");
      }
    } else {
      return Promise.reject();
    }
  }
);

export default api;
