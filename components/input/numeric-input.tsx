"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

type NumericInputProps = {
  fieldLabel?: string;
  fieldName: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  classNameLabel?: string;
  onValueChange?: (value: string) => void;
  floating?: boolean;
};

function NumericInput({
  fieldLabel,
  fieldName,
  id,
  placeholder,
  disabled,
  className,
  classNameLabel,
  onValueChange,
  floating = false,
}: NumericInputProps) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formatFloating = (val: string) => {
    if (val === "" || val === "-" || val === ".") return val;

    const num = Number(val);
    if (Number.isNaN(num)) return val;

    return num.toFixed(4);
  };

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => {
        const value = field.value ?? "";

        const updateValue = (next: string) => {
          field.onChange(next);
          onValueChange?.(next);
        };

        return (
          <FormItem
            className={cn(
              fieldLabel ? "grid-cols-2 gap-2" : "grid-cols-1 gap-4",
            )}
          >
            {fieldLabel && (
              <FormLabel className="border-b">{fieldLabel}</FormLabel>
            )}

            {disabled ? (
              <Label className={cn("", classNameLabel)}>
                {value || placeholder || "-"}
              </Label>
            ) : (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Input
                      id={id}
                      value={value}
                      placeholder={placeholder}
                      disabled={disabled}
                      className={cn(
                        "cursor-pointer text-center",
                        fieldLabel && "h-full w-12",
                        className,
                      )}
                      onClick={() => setOpen(true)}
                      onChange={(e) => updateValue(e.target.value)}
                      onBlur={() => {
                        if (floating) {
                          updateValue(formatFloating(value));
                        }
                      }}
                    />
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="grid w-50 grid-cols-3 gap-2 border-none p-2">
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                    <Button
                      key={num}
                      variant="outline"
                      className="h-10 bg-background text-xl"
                      onClick={() => updateValue(value + num)}
                    >
                      {num}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    className="h-10 bg-background text-xl"
                    onClick={() => {
                      if (!value.startsWith("-")) {
                        updateValue("-" + value);
                      }
                    }}
                  >
                    -
                  </Button>

                  <Button
                    variant="outline"
                    className="h-10 bg-background text-xl"
                    onClick={() => updateValue(value + "0")}
                  >
                    0
                  </Button>

                  <Button
                    variant="outline"
                    className="h-10 bg-background text-xl"
                    onClick={() => {
                      if (!value.includes(".")) {
                        updateValue(value + ".");
                      }
                    }}
                  >
                    .
                  </Button>

                  <Button
                    variant="outline"
                    className="h-10 bg-background text-xl"
                    onClick={() => updateValue(value.slice(0, -1))}
                  >
                    x
                  </Button>

                  <Button
                    variant="outline"
                    className="col-span-2 h-10 bg-background"
                    onClick={() => {
                      if (floating) {
                        updateValue(formatFloating(value));
                      }
                      setOpen(false);
                    }}
                  >
                    ok
                  </Button>
                </PopoverContent>
              </Popover>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default NumericInput;
