import type { Doctor } from "@/services/doctor.service";

export const doctorsQueryKey = ["doctors"] as const;
export const membersQueryKey = ["members"] as const;

export const specializationOptions: Array<{ value: string; label: string }> = [
  { value: "General Medicine", label: "General Medicine" },
  { value: "Cardiology", label: "Cardiology" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Endocrinology", label: "Endocrinology" },
  { value: "Gastroenterology", label: "Gastroenterology" },
  { value: "Gynecology", label: "Gynecology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Orthopedics", label: "Orthopedics" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "Psychiatry", label: "Psychiatry" },
  { value: "Radiology", label: "Radiology" }
];

export type DoctorsUiState = {
  modalOpen: boolean;
  editingDoctor: Doctor | null;
};

export const createInitialDoctorsUiState = (): DoctorsUiState => ({
  modalOpen: false,
  editingDoctor: null
});
