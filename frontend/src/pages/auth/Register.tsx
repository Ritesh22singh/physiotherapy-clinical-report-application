import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "../../validation/auth.schema";
import type { RegisterFormData } from "../../validation/auth.schema";

import AuthLayout from "../../layouts/AuthLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [isLoading, setISloading] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    setISloading(true);

    try {
      const response = await registerUser(data);
      toast.success(response.message);
      navigate("/login");
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || "Something went wrong");
      console.error(error);
    } finally {
      setISloading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-8 rounded-[32px] border border-slate-200/80 bg-slate-950/95 px-6 py-7 text-slate-50 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] ring-1 ring-white/10 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-200/90">Physio Report</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Create your clinician account</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                Register once and securely manage patients, create professional reports, and keep your physiotherapy practice organized.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-800/80 px-4 py-3 text-sm text-slate-200 ring-1 ring-white/10">
              Built for healthcare professionals
            </div>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-2xl">
          <div className="mb-8">
            <div className="text-sm uppercase tracking-[0.25em] text-slate-500">Sign up</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Your professional dashboard awaits</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Enter your details to begin creating patient reports and managing clinical workflows.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="name"
                label="Full name"
                placeholder="Enter your full name"
                registration={register("name")}
                error={errors.name?.message}
              />

              <Input
                id="email"
                label="Email address"
                type="email"
                placeholder="Enter your email"
                registration={register("email")}
                error={errors.email?.message}
              />
            </div>

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Create a secure password"
              registration={register("password")}
              error={errors.password?.message}
            />

            <Button type="submit" isLoading={isLoading} className="mt-1">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-slate-900 underline decoration-sky-500/30 hover:text-slate-700">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default Register;
