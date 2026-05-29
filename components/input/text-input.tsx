import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

export default function TextInput({
  fieldName,
  fieldLabel,
  placeholder,
  disabled = false,
  description,
  classNameInput,
  classNameLabel,
  type = "text",
  orientation = "vertical",
}: {
  fieldName: string;
  fieldLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  description?: string;
  classNameInput?: string;
  classNameLabel?: string;
  type?: string;
  orientation?: "horizontal" | "vertical";
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem
          className={cn(
            orientation === "vertical" ? "grid-cols-1 gap-4" : "grid-cols-2",
          )}
        >
          <FormLabel
            className={cn(
              orientation === "horizontal" && "border-b px-2 text-xs",
            )}
          >
            {fieldLabel}
          </FormLabel>

          {disabled ? (
            <Label className={cn("border-b px-3 py-0.5", classNameLabel)}>
              {field.value || placeholder || "-"}
            </Label>
          ) : (
            <FormControl className={cn(classNameInput, "w-full")}>
              <Input
                placeholder={placeholder}
                {...field}
                value={field.value ?? ""}
                type={type}
              />
            </FormControl>
          )}

          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
