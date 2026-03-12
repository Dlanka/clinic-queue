import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui";
import { DoctorService, type Doctor } from "@/services/doctor.service";
import { MemberService } from "@/services/member.service";
import type { DoctorFormValues } from "../schemas/doctor-form.schema";
import { doctorsQueryKey, membersQueryKey } from "../store/doctors.store";

type SubmitPayload = {
  doctor: Doctor | null;
  values: DoctorFormValues;
};

type UseDoctorsDataParams = {
  onSettledSuccess: () => void;
};

export function useDoctorsData({ onSettledSuccess }: UseDoctorsDataParams) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const doctorsQuery = useQuery({
    queryKey: doctorsQueryKey,
    queryFn: DoctorService.list
  });

  const membersQuery = useQuery({
    queryKey: membersQueryKey,
    queryFn: MemberService.list
  });

  const createMutation = useMutation({
    mutationFn: DoctorService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: doctorsQueryKey });
      toast.success("Doctor created");
      onSettledSuccess();
    },
    onError: (error: Error) => {
      toast.error("Create failed", error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DoctorFormValues }) =>
      DoctorService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: doctorsQueryKey });
      toast.success("Doctor updated");
      onSettledSuccess();
    },
    onError: (error: Error) => {
      toast.error("Update failed", error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: DoctorService.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: doctorsQueryKey });
      toast.success("Doctor deleted");
    },
    onError: (error: Error) => {
      toast.error("Delete failed", error.message);
    }
  });

  const rows = useMemo(() => doctorsQuery.data ?? [], [doctorsQuery.data]);
  const members = useMemo(() => membersQuery.data ?? [], [membersQuery.data]);
  const isBusy = createMutation.isPending || updateMutation.isPending;

  const submitDoctor = ({ doctor, values }: SubmitPayload) => {
    const duplicateDoctor = rows.find((row) => row.memberId === values.memberId && row.id !== doctor?.id);
    if (duplicateDoctor) {
      toast.error("Duplicate doctor member", "Selected member already has a doctor profile.");
      return;
    }

    if (doctor) {
      updateMutation.mutate({ id: doctor.id, payload: values });
      return;
    }

    createMutation.mutate(values);
  };

  return {
    rows,
    members,
    isBusy,
    doctorsQuery,
    membersQuery,
    deleteMutation,
    submitDoctor
  };
}
