import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { AxiosError } from "axios";

const schema = yup.object({
  email: yup.string().email("请输入有效的邮箱地址").required("邮箱不能为空"),
  password: yup.string().min(6, "密码至少需要6位").required("密码不能为空"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "两次输入的密码不一致")
    .required("请确认密码"),
});

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      await register(data.email, data.password);
      alert("注册成功");
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      if (
        axiosError.response &&
        axiosError.response.data &&
        axiosError.response.data.error
      ) {
        alert("注册失败：" + axiosError.response.data.error);
      } else {
        alert("注册失败：未知错误");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        注册新账号
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="邮箱"
          variant="outlined"
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...formRegister("email")}
        />
        <TextField
          fullWidth
          label="密码"
          type="password"
          variant="outlined"
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...formRegister("password")}
        />
        <TextField
          fullWidth
          label="确认密码"
          type="password"
          variant="outlined"
          margin="normal"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          {...formRegister("confirmPassword")}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          {isSubmitting ? "注册中..." : "注册并登录"}
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link href="/login" underline="hover">
            已有账号？立即登录
          </Link>
        </Box>
      </form>
    </Box>
  );
};
