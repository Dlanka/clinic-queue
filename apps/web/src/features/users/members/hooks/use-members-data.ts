import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppRole } from "@/config/roles";
import { useToast } from "@/components/ui";
import { MemberService, type Member } from "@/services/member.service";
import { membersQueryKey } from "../store/members.store";

type SubmitPayload = {
  member: Member | null;
  values: {
    email: string;
    roles: AppRole[];
    status: "ACTIVE" | "DISABLED";
  };
};

type UseMembersDataParams = {
  onSettledSuccess: () => void;
};

export function useMembersData({ onSettledSuccess }: UseMembersDataParams) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: membersQueryKey,
    queryFn: MemberService.list
  });

  const createMutation = useMutation({
    mutationFn: MemberService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: membersQueryKey });
      toast.success("Member created");
      onSettledSuccess();
    },
    onError: (error: Error) => {
      toast.error("Create failed", error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { roles: AppRole[]; isActive: boolean } }) =>
      MemberService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: membersQueryKey });
      toast.success("Member updated");
      onSettledSuccess();
    },
    onError: (error: Error) => {
      toast.error("Update failed", error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: MemberService.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: membersQueryKey });
      toast.success("Member deleted");
    },
    onError: (error: Error) => {
      toast.error("Delete failed", error.message);
    }
  });

  const rows = useMemo(() => membersQuery.data ?? [], [membersQuery.data]);
  const isBusy = createMutation.isPending || updateMutation.isPending;

  const submitMember = ({ member, values }: SubmitPayload) => {
    if (member) {
      updateMutation.mutate({
        id: member.id,
        payload: {
          roles: values.roles,
          isActive: values.status === "ACTIVE"
        }
      });
      return;
    }

    createMutation.mutate({
      email: values.email,
      roles: values.roles,
      isActive: values.status === "ACTIVE"
    });
  };

  return {
    rows,
    isBusy,
    membersQuery,
    deleteMutation,
    submitMember
  };
}
