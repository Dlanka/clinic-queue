import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Clock3, UserRound } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { format } from "date-fns";
import { z } from "zod";
import {
  Badge,
  BaseModal,
  Button,
  Card,
  Checkbox,
  FieldGroup,
  IconButton,
  Input,
  RadioButton,
  Select,
  Switch,
  Table,
  Textarea,
  useToast
} from "../components/ui";

const intakeSchema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  phoneOrId: z.string().optional(),
  note: z.string().min(5, "Please add at least 5 characters"),
  followUp: z.boolean().optional(),
  paymentMode: z.enum(["CASH", "CARD", "INSURANCE", "PHILHEALTH"])
});

type IntakeForm = z.infer<typeof intakeSchema>;
type QueueStatus = "WAITING" | "IN_PROGRESS" | "DONE" | "CANCELLED";

const intakeResolver: Resolver<IntakeForm> = async (values) => {
  const parsed = intakeSchema.safeParse(values);

  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const errors = parsed.error.issues.reduce<Record<string, { type: string; message: string }>>(
    (acc, issue) => {
      const fieldName = String(issue.path[0] ?? "root");
      acc[fieldName] = { type: "manual", message: issue.message };
      return acc;
    },
    {}
  );

  return { values: {}, errors: errors as never };
};

const doctorOptions = [
  { value: "dr-lin", label: "Dr. Lin — General" },
  { value: "dr-foster", label: "Dr. Foster — Cardiology" },
  { value: "dr-park", label: "Dr. Park — Pediatrics" }
];

const queueRows: Array<{
  id: string;
  name: string;
  doctor: string;
  status: QueueStatus;
}> = [
  { id: "Q-1092", name: "Nora Watson", doctor: "Dr. Lin", status: "WAITING" },
  { id: "Q-1093", name: "Peter Chan", doctor: "Dr. Foster", status: "IN_PROGRESS" },
  { id: "Q-1090", name: "Sarah Ali", doctor: "Dr. Park", status: "DONE" },
  { id: "Q-1094", name: "James Reyes", doctor: "Dr. Lin", status: "CANCELLED" }
];

export const Route = createFileRoute("/")({
  component: DashboardPage
});

function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [priorityMode, setPriorityMode] = useState(true);
  const [queueFilter, setQueueFilter] = useState<"ALL" | QueueStatus>("ALL");
  const toast = useToast();

  const form = useForm<IntakeForm>({
    resolver: intakeResolver,
    defaultValues: {
      patientName: "",
      phoneOrId: "",
      note: "",
      followUp: false,
      paymentMode: "CASH"
    }
  });

  const filteredQueue = useMemo(
    () =>
      queueFilter === "ALL" ? queueRows : queueRows.filter((row) => row.status === queueFilter),
    [queueFilter]
  );

  const onSubmit = form.handleSubmit((data) => {
    toast.success("Intake saved", `${data.patientName} has been queued.`);
    form.reset({
      patientName: "",
      phoneOrId: "",
      note: "",
      followUp: false,
      paymentMode: "CASH"
    });
  });

  return (
    <div className="relative z-1 space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="bg-linear-to-r from-neutral-95 to-neutral-70 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-90">
            {format(new Date(), "EEEE, MMMM d, yyyy")} · All systems operational
          </p>
        </div>
        <Button type="button" startIconName="plus" onClick={() => setOpen(true)}>
          New Intake
        </Button>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <StatCard
          icon={<ClipboardList size={20} className="text-primary" />}
          iconClassName="bg-primary-soft"
          value="5"
          label="In Queue Today"
          trend="+2 live"
          trendTone="warning"
          lineClassName="bg-gradient-to-r from-primary to-tertiary"
        />
        <StatCard
          icon={<CalendarDays size={20} className="text-tertiary" />}
          iconClassName="bg-tertiary-soft"
          value="12"
          label="Appointments"
          trend="+3 new"
          trendTone="success"
          lineClassName="bg-gradient-to-r from-tertiary to-pink-400"
        />
        <StatCard
          icon={<UserRound size={20} className="text-success" />}
          iconClassName="bg-success-soft"
          value="148"
          label="Total Patients"
          trend="+6 week"
          trendTone="success"
          lineClassName="bg-gradient-to-r from-success to-primary"
        />
        <StatCard
          icon={<Clock3 size={20} className="text-warning" />}
          iconClassName="bg-warning-soft"
          value="14m"
          label="Avg. Wait Time"
          trend="+2m"
          trendTone="danger"
          lineClassName="bg-gradient-to-r from-warning to-danger"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]">
        <Card>
          <Card.Header
            title="Quick Intake Form"
            subtitle="Register a new patient visit"
            iconName="clipboardList"
            iconClassName="bg-primary-soft text-primary"
            action={<IconButton type="button" iconName="ellipsis" />}
          />

          <Card.Body>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <FieldGroup
                  id="patientName"
                  label="Patient Name"
                  error={form.formState.errors.patientName?.message}
                >
                  <Input
                    id="patientName"
                    invalid={Boolean(form.formState.errors.patientName)}
                    placeholder="Full name..."
                    {...form.register("patientName")}
                  />
                </FieldGroup>
                <FieldGroup id="phoneOrId" label="Phone / ID">
                  <Input
                    id="phoneOrId"
                    placeholder="Contact or ID..."
                    {...form.register("phoneOrId")}
                  />
                </FieldGroup>
              </div>

              <FieldGroup id="doctor" label="Assigned Doctor">
                <Select inputId="doctor" options={doctorOptions} defaultValue={doctorOptions[0]} />
              </FieldGroup>

              <FieldGroup id="note" label="Visit Note" error={form.formState.errors.note?.message}>
                <Textarea
                  id="note"
                  invalid={Boolean(form.formState.errors.note)}
                  rows={4}
                  placeholder="Symptoms and context..."
                  {...form.register("note")}
                />
              </FieldGroup>

              <div className="flex flex-wrap items-start gap-3">
                <Checkbox
                  id="isFollowup"
                  label="Follow-up visit"
                  hint="Mark for faster routing"
                  {...form.register("followUp")}
                />
                <div className="ml-auto">
                  <Switch
                    checked={priorityMode}
                    label="Priority mode"
                    onCheckedChange={setPriorityMode}
                  />
                </div>
              </div>

              <FieldGroup id="cashMode" label="Payment Method">
                <div className="flex flex-wrap gap-2">
                  <RadioButton
                    id="cashMode"
                    value="CASH"
                    label="Cash"
                    {...form.register("paymentMode")}
                  />
                  <RadioButton
                    id="cardMode"
                    value="CARD"
                    label="Card"
                    {...form.register("paymentMode")}
                  />
                  <RadioButton
                    id="insuranceMode"
                    value="INSURANCE"
                    label="Insurance"
                    {...form.register("paymentMode")}
                  />
                  <RadioButton
                    id="philhealthMode"
                    value="PHILHEALTH"
                    label="PhilHealth"
                    {...form.register("paymentMode")}
                  />
                </div>
              </FieldGroup>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" startIconName="check">
                  Save Intake
                </Button>
                <Button
                  intent="secondary"
                  type="button"
                  startIconName="plus"
                  onClick={() => setOpen(true)}
                >
                  Open Modal
                </Button>
                <Button
                  intent="ghost"
                  type="button"
                  onClick={() =>
                    toast.error("Missing fields", "Please complete all required fields.")
                  }
                >
                  Trigger Toast
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title="Today's Queue"
            subtitle={format(new Date(), "MMMM d, yyyy")}
            iconName="calendarDays"
            iconClassName="bg-tertiary-soft text-tertiary"
            action={
              <Button intent="ghost" size="sm" className="!px-2 text-xs">
                View All
              </Button>
            }
            className="px-5 py-4"
          />

          <div className="flex flex-wrap gap-2 px-5 py-3">
            <QueueFilterChip
              label="All"
              active={queueFilter === "ALL"}
              onClick={() => setQueueFilter("ALL")}
            />
            <QueueFilterChip
              label="Waiting"
              active={queueFilter === "WAITING"}
              onClick={() => setQueueFilter("WAITING")}
            />
            <QueueFilterChip
              label="In Progress"
              active={queueFilter === "IN_PROGRESS"}
              onClick={() => setQueueFilter("IN_PROGRESS")}
            />
            <QueueFilterChip
              label="Done"
              active={queueFilter === "DONE"}
              onClick={() => setQueueFilter("DONE")}
            />
          </div>

          <Card.Body className="p-0">
            <Table
              columns={[
                {
                  key: "ticket",
                  header: "Ticket",
                  render: (row) => (
                    <span className="rounded-md border border-primary/25 bg-primary-soft px-2.5 py-1 font-mono text-xs font-bold text-primary">
                      {row.id}
                    </span>
                  )
                },
                {
                  key: "name",
                  header: "Patient",
                  render: (row) => <span className="font-bold text-neutral-95">{row.name}</span>
                },
                {
                  key: "doctor",
                  header: "Doctor",
                  render: (row) => <span className="text-neutral-90">{row.doctor}</span>
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusBadge status={row.status} />
                }
              ]}
              rows={filteredQueue}
              getRowId={(row) => row.id}
            />
          </Card.Body>
        </Card>
      </section>

      <BaseModal
        open={open}
        title="Reusable BaseModal"
        description="This modal is rendered through a portal appended into #root only while visible."
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button intent="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                toast.success("Action completed");
                setOpen(false);
              }}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-90">
          Milestone 3 includes motion, Lucide icons, Sonner toast, and reusable form primitives.
        </p>
      </BaseModal>
    </div>
  );
}

function QueueFilterChip({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-neutral-variant-80 text-neutral-90 hover:border-neutral-variant-70 hover:text-neutral-95"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: QueueStatus }) {
  if (status === "WAITING") {
    return <Badge tone="warning">Waiting</Badge>;
  }

  if (status === "IN_PROGRESS") {
    return <Badge tone="info">In Progress</Badge>;
  }

  if (status === "DONE") {
    return <Badge tone="success">Done</Badge>;
  }

  return <Badge tone="danger">Cancelled</Badge>;
}

function StatCard({
  icon,
  iconClassName,
  value,
  label,
  trend,
  trendTone,
  lineClassName
}: {
  icon: ReactNode;
  iconClassName: string;
  value: string;
  label: string;
  trend: string;
  trendTone: "success" | "warning" | "danger";
  lineClassName: string;
}) {
  return (
    <article className="relative overflow-hidden rounded-xl bg-neutral-30 p-5">
      <span className={`absolute inset-x-0 top-0 h-0.5 ${lineClassName}`} />
      <div className="mb-4 flex items-center justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-md ${iconClassName}`}>
          {icon}
        </div>
        <Badge tone={trendTone}>{trend}</Badge>
      </div>
      <p className="text-3xl font-extrabold tracking-tight text-neutral-95">{value}</p>
      <p className="mt-2 text-sm font-semibold text-neutral-90">{label}</p>
    </article>
  );
}
