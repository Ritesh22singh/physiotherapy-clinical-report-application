import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { loginSchema } from "../../validation/auth.schema";
import type { LoginFormData } from "../../validation/auth.schema";
import AuthLayout from "../../layouts/AuthLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { loginUser } from "../../services/authService";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await loginUser(data);

      if (response.token) {
        localStorage.setItem("auth_token", response.token);
      }

      toast.success(response.message);
      navigate("/dashboard");
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || "Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <div className="text-sm uppercase tracking-[0.25em] text-slate-500">Sign in</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Welcome back, clinician</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Sign in to manage your patients and continue your clinical reporting workflow.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="Enter your email"
            registration={register("email")}
            error={errors.email?.message}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            registration={register("password")}
            error={errors.password?.message}
          />

          <Button type="submit" isLoading={isLoading} className="mt-1">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to Physio Report?{" "}
          <Link to="/" className="font-semibold text-slate-900 underline decoration-sky-500/30 hover:text-slate-700">
            Create an account
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
};

export default Login;
