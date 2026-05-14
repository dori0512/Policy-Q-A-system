import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { ChatSession, ApiResponse, Message } from "../types";

export type QueryResponse = {
  references: string[] | undefined;
  answer: string;
  id: string;
  query: string;
  response: string;
};

export type SessionResponse = {
  sessionId: string;
  title: string;
  createdAt: Date;
};

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {}; // 安全初始化
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    const message =
      (error.response?.data as ApiResponse)?.message || error.message;
    return Promise.reject(message || "请求失败，请检查网络连接");
  }
);

export const apiService = {
  getChatHistory: (): Promise<ChatSession[]> =>
    api
      .get<ApiResponse<ChatSession[]>>("/chat/history")
      .then(
        (res: AxiosResponse<ApiResponse<ChatSession[]>>) => {
          return res.data.data || []
        }),

  getSessionMessages: (sessionId: string): Promise<Message[]> =>
    api
      .get<ApiResponse<Message[]>>(`/chat/messages/${sessionId}`)
      .then((res) => res.data.data || [])
      .catch((error) => {
        throw new Error(error.message || "获取消息失败");
      }),

  sendQuery: (query: string, sessionId: string): Promise<QueryResponse> =>
    api
      .post<ApiResponse<QueryResponse>>("/chat/query", {
        query,
        sessionId,
      })
      .then((res) => res.data.data!),

  createNewSession: (initialQuestion: string): Promise<SessionResponse> =>
    api
      .post<ApiResponse<SessionResponse>>("/chat/new", { initialQuestion })
      .then((res) => res.data.data!)
      .catch((error) => {
        throw new Error(error.message || "创建会话失败");
      }),

  searchPolicies: (query: string): Promise<string[]> =>
    api
      .get<ApiResponse<string[]>>("/knowledge/search", { params: { query } })
      .then((res: AxiosResponse<ApiResponse<string[]>>) => res.data.data || []),

  validateToken: (token: string): Promise<{ email: string }> =>
    api
      .get<ApiResponse<{ email: string; id: string }>>("/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        return res.data.data!;
      }),
};
