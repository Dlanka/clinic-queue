import CreatableSelect, {
  type CreatableProps as ReactCreatableSelectProps
} from "react-select/creatable";
import type { GroupBase } from "react-select";
import { selectBaseStyles, type SelectOption } from "../select";

type ComboboxProps<IsMulti extends boolean = false> = ReactCreatableSelectProps<
  SelectOption,
  IsMulti,
  GroupBase<SelectOption>
>;

export function Combobox<IsMulti extends boolean = false>({
  inputId,
  styles,
  ...props
}: ComboboxProps<IsMulti>) {
  return (
    <CreatableSelect<SelectOption, IsMulti, GroupBase<SelectOption>>
      inputId={inputId}
      styles={{ ...selectBaseStyles, ...styles }}
      formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
      {...props}
    />
  );
}
