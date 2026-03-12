import { Controller } from "react-hook-form";
import { Button, FieldGroup, Input, RightPanelModal, Select } from "@/components/ui";
import type { Medicine } from "@/services/medicine.service";
import { useMedicineForm } from "../hooks";
import type { MedicineFormValues } from "../schemas/medicine-form.schema";

type MedicineFormModalProps = {
  open: boolean;
  medicine: Medicine | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: MedicineFormValues) => void;
};

export function MedicineFormModal({
  open,
  medicine,
  loading,
  onClose,
  onSubmit
}: MedicineFormModalProps) {
  const form = useMedicineForm(open, medicine);

  return (
    <RightPanelModal
      open={open}
      title={medicine ? "Edit Medicine" : "Create Medicine"}
      description={medicine ? "Update medicine stock and metadata." : "Add a new medicine to stock."}
      onClose={onClose}
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="medicine-form" disabled={loading}>
            {medicine ? "Save Changes" : "Create Medicine"}
          </Button>
        </>
      }
    >
      <form
        id="medicine-form"
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
      >
        <FieldGroup id="medicine-name" label="Name" error={form.formState.errors.name?.message}>
          <Input id="medicine-name" invalid={Boolean(form.formState.errors.name)} {...form.register("name")} />
        </FieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup id="medicine-category" label="Category">
            <Input id="medicine-category" {...form.register("category")} />
          </FieldGroup>
          <FieldGroup id="medicine-unit" label="Unit">
            <Input id="medicine-unit" placeholder="tablet, bottle..." {...form.register("unit")} />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup
            id="medicine-stock"
            label="Stock Qty"
            error={form.formState.errors.stockQty?.message}
          >
            <Input id="medicine-stock" type="number" min={0} {...form.register("stockQty")} />
          </FieldGroup>
          <FieldGroup
            id="medicine-reorder"
            label="Reorder Level"
            error={form.formState.errors.reorderLevel?.message}
          >
            <Input id="medicine-reorder" type="number" min={0} {...form.register("reorderLevel")} />
          </FieldGroup>
        </div>

        <FieldGroup id="medicine-price" label="Price">
          <Input id="medicine-price" type="number" min={0} step="0.01" {...form.register("price")} />
        </FieldGroup>

        <FieldGroup id="medicine-status" label="Status">
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select
                inputId="medicine-status"
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "INACTIVE", label: "Inactive" }
                ]}
                value={
                  field.value === "ACTIVE"
                    ? { value: "ACTIVE", label: "Active" }
                    : { value: "INACTIVE", label: "Inactive" }
                }
                onChange={(nextValue) => {
                  if (!nextValue) {
                    return;
                  }
                  field.onChange(nextValue.value);
                }}
              />
            )}
          />
        </FieldGroup>
      </form>
    </RightPanelModal>
  );
}
