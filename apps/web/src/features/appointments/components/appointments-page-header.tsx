import { PageHeader, Button } from "@/components/ui";

interface AppointmentsPageHeaderProps {
  onCreate: () => void;
}

export function AppointmentsPageHeader({ onCreate }: AppointmentsPageHeaderProps) {
  return (
    <PageHeader
      title="Appointments"
      subtitle="Schedule and manage patient appointments."
      iconName="calendarClock"
      iconClassName="bg-primary-soft text-primary"
      action={
        <Button startIconName="plus" onClick={onCreate}>
          New Appointment
        </Button>
      }
    />
  );
}
