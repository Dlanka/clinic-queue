import { Badge, Button, Table } from "./ui";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

const sampleRows = [
  { id: "1", label: "Coming soon", value: "Module wiring in next milestone" },
  { id: "2", label: "Status", value: "Placeholder route active" }
];

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-neutral-variant-80/80 bg-neutral-20 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-neutral-95">{title}</h2>
            <p className="mt-1 text-sm text-neutral-90">{description}</p>
          </div>
          <Badge tone="info">Placeholder</Badge>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4 rounded-2xl border border-neutral-variant-80/80 bg-neutral-20 p-5">
          <h3 className="text-base font-bold text-neutral-95">Next Steps</h3>
          <p className="text-sm text-neutral-90">
            This page is connected to the shell navigation and ready for feature implementation.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button intent="secondary" type="button" startIconName="calendarClock">
              Plan Module
            </Button>
            <Button intent="ghost" type="button">
              View Spec
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-variant-80/80 bg-neutral-20 p-5">
          <h3 className="mb-4 text-base font-bold text-neutral-95">Route Status</h3>
          <Table
            columns={[
              { key: "label", header: "Item", render: (row) => row.label },
              { key: "value", header: "Value", render: (row) => row.value }
            ]}
            rows={sampleRows}
            getRowId={(row) => row.id}
          />
        </div>
      </section>
    </div>
  );
}
