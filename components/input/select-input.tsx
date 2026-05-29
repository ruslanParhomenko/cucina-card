import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

export default function SelectInput({
  options,
  fieldName,
  fieldLabel,
  placeholder,
  disabled = false,
  classNameSelect,
  classNameLabel,
  onValueChange,
  orientation = "vertical",
}: {
  options: { value: string; label: string }[];
  fieldName: string;
  fieldLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  classNameSelect?: string;
  classNameLabel?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field, fieldState }) => {
        const selectedOption = options.find(
          (item) => item.value === field.value,
        );

        return (
          <FormItem
            className={cn(
              orientation === "horizontal"
                ? "grid-cols-2 gap-2 pb-2"
                : "grid-cols-1 gap-4",
            )}
          >
            {fieldLabel && (
              <FormLabel
                className={cn(
                  orientation === "horizontal" && "border-b px-2 text-xs",
                )}
              >
                {fieldLabel}
              </FormLabel>
            )}

            {disabled ? (
              <Label className={cn("border-b px-3 py-0.5", classNameLabel)}>
                {selectedOption?.label || placeholder || "-"}
              </Label>
            ) : (
              <Select
                key={field.value ?? "empty"}
                onValueChange={(value) => {
                  field.onChange(value);
                  onValueChange?.(value);
                }}
                value={field.value}
              >
                <FormControl className={cn(classNameSelect, "w-full")}>
                  <SelectTrigger data-placeholder="">
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectGroup>
                    {options.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            <FormMessage>{fieldState?.error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
}
