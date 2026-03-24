import { useQuery } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import {
  Button,
  CenterModal,
  FieldGroup,
  Input,
  RadioChipGroup,
  SectionDivider,
  Select
} from "@/components/ui";
import { MedicineService, type Medicine } from "@/services/medicine.service";
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
  const categoryQuery = useQuery({
    queryKey: ["medicine-categories"],
    queryFn: MedicineService.listCategories,
    staleTime: 5 * 60_000
  });
  const unitQuery = useQuery({
    queryKey: ["medicine-units"],
    queryFn: MedicineService.listUnits,
    staleTime: 5 * 60_000
  });

  const categoryOptions = categoryQuery.data ?? [];
  const unitOptions = unitQuery.data ?? [];

  const watchedStockQty = Number(form.watch("stockQty")) || 0;
  const watchedReorderLevel = Number(form.watch("reorderLevel")) || 0;
  const isLowStock = watchedStockQty > 0 && watchedStockQty <= watchedReorderLevel;

  return (
    <CenterModal
      open={open}
      title={medicine ? "Edit Medicine" : "Create Medicine"}
      description={
        medicine ? "Update medicine stock and metadata." : "Add a new medicine to stock."
      }
      iconName="clipboardList"
      variant="success"
      onClose={onClose}
      className="max-w-120"
      footer={
        <>
          <Button variant="outlined" intent="neutral" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="medicine-form" startIconName="plus" disabled={loading}>
            {medicine ? "Save Changes" : "Create Medicine"}
          </Button>
        </>
      }
    >
      <form
        id="medicine-form"
        className="space-y-5"
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
      >
        <SectionDivider label="Basic Info" iconName="clipboardList" showLeadingLine={false} />

        <FieldGroup
          id="medicine-name"
          label="Medicine Name"
          required
          error={form.formState.errors.name?.message}
        >
          <Input
            id="medicine-name"
            placeholder="e.g. Amoxicillin 500mg"
            startIconName="clipboardList"
            invalid={Boolean(form.formState.errors.name)}
            {...form.register("name")}
          />
        </FieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup id="medicine-category" label="Category" required>
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <Select
                  inputId="medicine-category"
                  options={categoryOptions}
                  isDisabled={categoryQuery.isLoading}
                  placeholder="Select category"
                  value={categoryOptions.find((option) => option.label === field.value) ?? null}
                  onChange={(nextValue) => field.onChange(nextValue?.label ?? "")}
                />
              )}
            />
          </FieldGroup>

          <FieldGroup id="medicine-unit" label="Unit" hint="How the medicine is dispensed">
            <Controller
              control={form.control}
              name="unit"
              render={({ field }) => (
                <Select
                  inputId="medicine-unit"
                  options={unitOptions}
                  isDisabled={unitQuery.isLoading}
                  placeholder="Select unit"
                  value={unitOptions.find((option) => option.label === field.value) ?? null}
                  onChange={(nextValue) => field.onChange(nextValue?.label ?? "")}
                />
              )}
            />
          </FieldGroup>
        </div>

        <SectionDivider label="Stock & Pricing" iconName="calendarClock" showLeadingLine={false} />

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup
            id="medicine-stock"
            label="Stock Qty"
            hint="Current stock on hand"
            error={form.formState.errors.stockQty?.message}
          >
            <Input
              id="medicine-stock"
              type="number"
              min={0}
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              startIconName="clipboardList"
              endAdornment={
                <span className="rounded-full bg-neutral-40 px-2 py-0.5 text-xs text-neutral-70">
                  units
                </span>
              }
              {...form.register("stockQty")}
            />
          </FieldGroup>

          <FieldGroup
            id="medicine-reorder"
            label="Reorder Level"
            hint="Alert when stock falls below"
            error={form.formState.errors.reorderLevel?.message}
          >
            <Input
              id="medicine-reorder"
              type="number"
              min={0}
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              startIconName="refreshCcw"
              endAdornment={
                <span className="rounded-full bg-neutral-40 px-2 py-0.5 text-xs text-neutral-70">
                  units
                </span>
              }
              {...form.register("reorderLevel")}
            />
          </FieldGroup>
        </div>

        <FieldGroup id="medicine-price" label="Price" hint="Price per unit">
          <Input
            id="medicine-price"
            type="number"
            min={0}
            step="0.01"
            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            startAdornment={<span className="text-sm text-neutral-70">$</span>}
            endAdornment={
              <span className="rounded-full bg-neutral-40 px-2 py-0.5 text-xs font-semibold text-neutral-70">
                LKR
              </span>
            }
            {...form.register("price")}
          />
        </FieldGroup>

        <SectionDivider label="Status" iconName="check" showLeadingLine={false} />

        <FieldGroup id="medicine-status" label="Status">
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <RadioChipGroup
                value={field.value}
                onValueChange={field.onChange}
                options={[
                  {
                    value: "ACTIVE",
                    label: "Active",
                    color: isLowStock ? "warning" : "success"
                  },
                  { value: "INACTIVE", label: "Inactive", color: "danger" }
                ]}
              />
            )}
          />
        </FieldGroup>
      </form>
    </CenterModal>
  );
}
