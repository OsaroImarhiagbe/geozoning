import axios from "axios";

import type { ApiResponse } from "./types/type";
import { useTokenStore } from "@/api/store/useTokenStore";
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 10_000,
  withCredentials: true, // sends your httpOnly refresh token cookie automatically
  headers: {
    "Content-Type": "application/json", // Optional: default headers
  },
});
apiClient.defaults.withCredentials = true;

const PUBLIC_ROUTES = ["/(auth)/signup", "/(auth)/login", "/auth/refresh"];

// Request interceptor — attaches the access token to every outgoing request
apiClient.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ROUTES.some((route) => config.url?.includes(route));
  if (!isPublic) {
    const access_token = useTokenStore.getState().token;
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
  }
  return config;
});

// Response interceptor — handles 401s by refreshing and retrying once
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // Your refresh endpoint — the cookie goes automatically via withCredentials
        const { data } = await axios.post(
          "http://localhost:8000/api/v1/auth/refresh",
          {},
          { withCredentials: true },
        );
        useTokenStore.getState().tokenTrigger(data.access_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(original); // retry the original request
      } catch {
        useTokenStore.getState().tokenClear();
        window.location.href = "/login"; // or dispatch a logout event
      }
    }

    return Promise.reject(error);
  },
);

// Typed helper methods — these unwrap ApiResponse<T> for you
export const api = {
  get: <T>(url: string, config?: Parameters<typeof apiClient.get>[1]) =>
    apiClient.get<ApiResponse<T>>(url, config),

  post: <T>(
    url: string,
    body?: unknown,
    config?: Parameters<typeof apiClient.post>[2],
  ) => apiClient.post<ApiResponse<T>>(url, body, config),

  patch: <T>(url: string, body?: unknown) =>
    apiClient.patch<ApiResponse<T>>(url, body),

  delete: <T>(url: string) => apiClient.delete<ApiResponse<T>>(url),
};
