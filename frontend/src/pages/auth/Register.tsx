import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "../../validation/auth.schema";
import type { RegisterFormData } from "../../validation/auth.schema";

import AuthLayout from "../../layouts/AuthLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./Register.css";
import { useState } from "react";
import { registerUser } from "../../services/authService";

import toast from "react-hot-toast";

const Register = () => {

    const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<RegisterFormData>({
  resolver: zodResolver(registerSchema),
});

const [isLoading, setISloading] = useState(false)

const onSubmit = async(data: RegisterFormData) => {
  console.log(data);
  setISloading(true);
  try {
    const response = await registerUser(data);
    //console.log(response.message)
    toast.success(response.message);
  } catch (error: any) {
   
   toast.error(
    error.response?.data?.message || "Somethings went wrong"
   )
   console.error(error)
  }
  finally{
    setISloading(false);
  }
 
};

    return(
         <AuthLayout>
      <Card className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create your account</h1>
          <p className="register-subtitle">
            Securely manage patients, create reports, and access your dashboard.
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Full name"
            placeholder="Enter your full name"
            registration={register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Email"
            placeholder="Enter your email"
             registration={register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
             registration={register("password")}
            error={errors.password?.message}
          />

          <Button type="submit" isLoading={isLoading} className="register-button">
            Register account
          </Button>
        </form>

        <p className="register-footer">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </Card>
    </AuthLayout>
    )
}

export default Register;