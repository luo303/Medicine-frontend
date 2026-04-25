/**
 * Axios 实例配置
 */
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

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
 * 处理 401 未授权响应
 */
function handleUnauthorized(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  }
}

/**
 * 请求拦截器 - 统一添加 token
 */
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    const status = error.response?.status;

    if (status === 401) {
      handleUnauthorized();
    } else if (!status && error.message === "Network Error") {
      console.error("网络连接失败，请检查服务是否正常运行");
    } else if (status >= 500) {
      console.error(`服务器错误 (${status})`);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
