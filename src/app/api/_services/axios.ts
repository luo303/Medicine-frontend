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
 * 响应拦截器 - 统一处理错误，未授权时重定向到登录页
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("认证已过期或未登录 (401)，跳转至登录页");
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (!status && error.message === "Network Error") {
      console.error("网络连接失败，请检查服务是否正常运行");
    } else if (status >= 500) {
      console.error(`服务器错误 (${status})`);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
