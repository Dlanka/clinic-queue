import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge, PageHeader, SectionNavigation, useToast } from "@/components/ui";
import { meQueryKey, useMe } from "@/hooks/use-me";
import { AuthService } from "@/services/auth.service";
import { ProfileAccountCard } from "./components/profile-account-card";
import { ProfilePreferencesCard } from "./components/profile-preferences-card";
import { ProfileSecurityCard } from "./components/profile-security-card";
import { ProfileSessionsCard } from "./components/profile-sessions-card";
import { profileSections, type ProfileSection } from "./profile.types";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is required")
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters")
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

const preferencesSchema = z.object({
  language: z.string().trim().min(2),
  timezone: z.string().trim().min(1),
  dateFormat: z.string().trim().min(1),
  timeFormat: z.string().trim().min(1),
  emailNotifications: z.boolean(),
  inAppNotifications: z.boolean()
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const sessionsQueryKey = ["auth", "sessions"] as const;

export function ProfilePage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const meQuery = useMe();
  const [activeSection, setActiveSection] = useState<ProfileSection>("account");

  const sessionsQuery = useQuery({
    queryKey: sessionsQueryKey,
    queryFn: AuthService.sessions,
    enabled: !!meQuery.data
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "" }
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      language: "en",
      timezone: "Asia/Colombo",
      dateFormat: "MMM dd, yyyy",
      timeFormat: "12-hour (AM/PM)",
      emailNotifications: true,
      inAppNotifications: true
    }
  });

  useEffect(() => {
    if (!meQuery.data?.account) {
      return;
    }

    profileForm.reset({ name: meQuery.data.account.name });
    preferencesForm.reset({
      language: meQuery.data.account.preferences.language,
      timezone: meQuery.data.account.preferences.timezone,
      dateFormat: meQuery.data.account.preferences.dateFormat,
      timeFormat: meQuery.data.account.preferences.timeFormat,
      emailNotifications: meQuery.data.account.preferences.emailNotifications,
      inAppNotifications: meQuery.data.account.preferences.inAppNotifications
    });
  }, [meQuery.data?.account, profileForm, preferencesForm]);

  const updateProfileMutation = useMutation({
    mutationFn: AuthService.updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      toast.success("Profile updated");
    },
    onError: (error: Error) => {
      toast.error("Update failed", error.message);
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: AuthService.updatePreferences,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      toast.success("Preferences updated");
    },
    onError: (error: Error) => {
      toast.error("Preference update failed", error.message);
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: AuthService.changePassword,
    onSuccess: async () => {
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      toast.success("Password updated");
    },
    onError: (error: Error) => {
      toast.error("Password update failed", error.message);
    }
  });

  const revokeSessionMutation = useMutation({
    mutationFn: AuthService.revokeSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
      toast.success("Session signed out");
    },
    onError: (error: Error) => {
      toast.error("Could not sign out session", error.message);
    }
  });

  const revokeOtherSessionsMutation = useMutation({
    mutationFn: AuthService.revokeOtherSessions,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
      toast.success("Other sessions signed out");
    },
    onError: (error: Error) => {
      toast.error("Could not sign out other sessions", error.message);
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account details, preferences, and security"
        iconName="user"
        iconClassName="bg-primary-soft text-primary"
        action={
          <Badge tone="info" size="sm">
            {meQuery.data?.member.roles.join(", ") || "No roles"}
          </Badge>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <SectionNavigation
          title="My Profile"
          items={profileSections}
          activeValue={activeSection}
          onChange={setActiveSection}
          className="rounded-xl"
        />

        <section>
          {activeSection === "account" ? (
            <ProfileAccountCard
              form={profileForm}
              email={meQuery.data?.account.email ?? ""}
              isSaving={updateProfileMutation.isPending}
              isLoading={meQuery.isLoading}
              onSubmit={profileForm.handleSubmit((values) =>
                updateProfileMutation.mutate({
                  name: values.name
                })
              )}
            />
          ) : null}

          {activeSection === "preferences" ? (
            <ProfilePreferencesCard
              form={preferencesForm}
              isSaving={updatePreferencesMutation.isPending}
              onSubmit={preferencesForm.handleSubmit((values) =>
                updatePreferencesMutation.mutate(values)
              )}
            />
          ) : null}

          {activeSection === "security" ? (
            <ProfileSecurityCard
              form={passwordForm}
              passwordChangedAt={meQuery.data?.account.passwordChangedAt ?? null}
              isSaving={changePasswordMutation.isPending}
              onSubmit={passwordForm.handleSubmit((values) =>
                changePasswordMutation.mutate({
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword,
                  confirmPassword: values.confirmPassword
                })
              )}
            />
          ) : null}

          {activeSection === "sessions" ? (
            <ProfileSessionsCard
              sessions={sessionsQuery.data?.sessions ?? []}
              isLoading={sessionsQuery.isLoading}
              isRevokingSession={revokeSessionMutation.isPending}
              isRevokingOthers={revokeOtherSessionsMutation.isPending}
              onRevokeSession={(sessionId) => revokeSessionMutation.mutate(sessionId)}
              onRevokeOthers={() => revokeOtherSessionsMutation.mutate()}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}
