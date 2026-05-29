"use client";
import { cn } from "@/lib/utils";
import { useEdit } from "@/providers/edit-provider";
import { RotateCw } from "lucide-react";

type Props = {
  className?: string;
  disabled?: boolean;
  size?: number;
};
export default function ResetButton({
  className,
  disabled = false,
  size = 16,
}: Props) {
  const { resetFn, isEdit } = useEdit();

  const handleReset = () => {
    resetFn?.();
  };

  if (!isEdit) return null;
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(className, "cursor-pointer")}
      onClick={handleReset}
    >
      <RotateCw
        strokeWidth={2}
        size={size}
        className="text-white hover:text-amber-500"
      />
    </button>
  );
}
