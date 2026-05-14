import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { AxiosError } from "axios";

const schema = yup.object({
  email: yup.string().email("请输入有效的邮箱地址").required("邮箱不能为空"),
  password: yup.string().min(6, "密码至少需要6位").required("密码不能为空"),
});

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('已重置本地存储');
  }, []);

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      console.log('登录信息已提交')
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      alert(
        axiosError.response?.data?.error || "登录失败：请检查网络连接"
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        欢迎登录政策问答系统
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="邮箱"
          variant="outlined"
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <TextField
          fullWidth
          label="密码"
          type="password"
          variant="outlined"
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          {isSubmitting ? "登录中..." : "登录"}
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link href="/register" underline="hover">
            注册新账号
          </Link>
        </Box>
      </form>
    </Box>
  );
};
