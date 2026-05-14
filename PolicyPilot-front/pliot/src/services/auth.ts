// auth.ts
import axios from "axios";

const authApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/auth",
});

export const authService = {
  login: (email: string, password: string) =>
    authApi.post<{ token: string }>("/login", { email, password })
      .then((res) => res.data),
  
  register: (email: string, password: string) =>
    authApi.post<{ token: string }>("/register", { email, password })
      .then((res) => res.data),

  verifyToken: (token: string) => 
    authApi.get("/verify", { headers: { Authorization: `Bearer ${token}` } })
};