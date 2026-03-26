import ReactSelect, {
  type GroupBase,
  type Props as ReactSelectProps,
  type StylesConfig
} from "react-select";

export interface SelectOption {
  value: string;
  label: string;
}

type SelectProps<IsMulti extends boolean = false> = ReactSelectProps<
  SelectOption,
  IsMulti,
  GroupBase<SelectOption>
>;

const baseStyles: StylesConfig<SelectOption, boolean> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: 40,
    fontSize: 13,
    fontWeight: 400,
    borderRadius: 12,
    backgroundColor: "var(--color-neutral-30)",
    borderWidth: "1px",
    borderColor: state.isFocused ? "var(--color-primary)" : "var(--color-neutral-variant-80)",
    boxShadow: state.isFocused
      ? "0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent)"
      : "none",
    "&:hover": {
      borderColor: state.isFocused ? "var(--color-primary)" : "var(--color-neutral-variant-70)"
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--color-neutral-95)",
    fontSize: "var(--text-sm)",
    fontWeight: 400
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--color-neutral-95)",
    fontSize: "var(--text-sm)",
    fontWeight: 400
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--color-neutral-70)",
    fontSize: "var(--text-sm)",
    fontWeight: 400
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: "var(--color-neutral-variant-80)"
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "var(--color-neutral-70)",
    "&:hover": {
      color: "var(--color-neutral-95)"
    }
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "var(--color-neutral-30)",
    border: "1px solid color-mix(in srgb, var(--color-neutral-variant-80) 70%, transparent)",
    borderRadius: 8,
    overflow: "hidden"
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "var(--text-sm)",
    backgroundColor: state.isSelected
      ? "var(--color-primary)"
      : state.isFocused
        ? "var(--color-primary-soft)"
        : "var(--color-neutral-30)",
    color: state.isSelected ? "var(--color-on-primary)" : "var(--color-neutral-95)"
  })
};

export const selectBaseStyles = baseStyles;

export function Select<IsMulti extends boolean = false>({
  inputId,
  styles,
  menuPortalTarget: customMenuPortalTarget,
  menuPosition: customMenuPosition,
  ...props
}: SelectProps<IsMulti>) {
  // Use document.body as portal target to prevent overflow clipping
  const menuPortalTarget =
    customMenuPortalTarget ?? (typeof document !== "undefined" ? document.body : undefined);
  // Use fixed positioning to prevent ancestor scroll/overflow issues
  const menuPosition = customMenuPosition ?? "fixed";

  return (
    <ReactSelect<SelectOption, IsMulti, GroupBase<SelectOption>>
      inputId={inputId}
      styles={{ ...selectBaseStyles, ...styles }}
      menuPortalTarget={menuPortalTarget}
      menuPosition={menuPosition}
      {...props}
    />
  );
}
