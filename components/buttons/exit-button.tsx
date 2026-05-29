"use client";

import { cn } from "@/lib/utils";
import { useEdit } from "@/providers/edit-provider";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  disabled?: boolean;
  url?: string;
};

export default function ExitButton({
  className,
  disabled = false,
  url,
}: Props) {
  const router = useRouter();
  const { isEdit } = useEdit();

  if (isEdit) return null;
  return (
    <button
      type="button"
      onClick={() => {
        url ? router.replace(url) : router.back();
      }}
      disabled={disabled}
      className={cn("cursor-pointer", className, disabled && "opacity-50")}
    >
      <LogOutIcon
        size={16}
        strokeWidth={2}
        className="text-white hover:text-red-600"
      />
    </button>
  );
}
