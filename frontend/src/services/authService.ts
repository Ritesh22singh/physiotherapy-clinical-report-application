import api from "../api/axios";

import type{
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  User
} from "../types/auth.types";

export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const response = await api.post(
    "/auth/register",
    payload
  );

  return response.data;
};

export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const response = await api.post(
    "/auth/login",
    payload
  );

  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<{user: User}>("/auth/me");
  return response.data.user;
}