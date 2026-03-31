/**
 * Axios 实例配置
 */
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

/**
 * 获取认证 Token
 */
function getAuthToken(): string | null {
  // 优先从 localStorage 获取（客户端）
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      return `Bearer ${token}`;
    }
  }
  // 如果没有 token，返回 null
  return null;
}

/**
 * 创建 axios 实例
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 请求拦截器 - 自动添加认证 token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * 响应拦截器 - 统一处理错误
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API 请求错误:", error.response?.status || error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
