import api from "../api/axios";

import type{
  RegisterPayload,
  LoginPayload,
  AuthResponse,
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