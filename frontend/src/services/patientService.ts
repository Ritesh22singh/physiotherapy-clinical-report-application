import api from "../api/axios";
import type { Patient, CreatePatientPayload } from "../types/patient.types";

export const getPatients = async() : Promise<Patient[]> => {
    const response = await api.get<{patients: Patient[] }> ("/patients");
    return response.data.patients
}

export const createPatient = async (
  payload: CreatePatientPayload
): Promise<Patient> => {
  const response = await api.post<{ patient: Patient }>("/patients", payload);
  return response.data.patient;
};

export const getPatient = async (id: string): Promise<Patient> => {
  const response = await api.get<{ patient: Patient }>(`/patients/${id}`);
  return response.data.patient;
};