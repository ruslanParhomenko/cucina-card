import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import type { SelectOptions } from "@/types/options";

export default function SelectOptions({
  options,
  value,
  onChange,
  isLoading = false,
  className,
  placeHolder,
}: {
  options: SelectOptions;
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  placeHolder?: string;
}) {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value)}
      disabled={isLoading}
    >
      <SelectTrigger
        className={cn(
          "[&>svg]:hidden justify-center bg-background h-6!",
          className,
        )}
      >
        <SelectValue placeholder={placeHolder ?? ""} />
      </SelectTrigger>
      <SelectContent>
        {options.map((item, idx) => (
          <SelectItem key={`${item.value}-${idx}`} value={item.value}>
            <span className="truncate">{item.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
