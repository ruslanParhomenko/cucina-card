import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import type { SelectOptions } from "@/types/options";

export default function TabsOptions({
  value,
  setValue,
  isPending,
  options,
}: {
  value: string;
  setValue: (value: string) => void;
  isPending: boolean;
  options: SelectOptions;
}) {
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList className="flex h-8!  md:gap-2">
        {options.map((item, idx) => {
          const isActive = value === item.value;
          return (
            <TabsTrigger
              key={`${item.value}-${idx}`}
              value={item.value}
              disabled={isPending}
              className={cn(
                "w-24 cursor-pointer md:w-32",
                isPending && "opacity-50",
                isActive && "font-bold text-blue-600!",
              )}
            >
              <span className="md:text-md  block w-full truncate text-xs">
                {item.label}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
