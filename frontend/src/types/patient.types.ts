export interface Patient {
    _id: string;
    name: string;
    phone?: string;
    dateOfBirth?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePatientPayload {
    name: string;
    phone?: string;
    dateOfBirth?: string;
}