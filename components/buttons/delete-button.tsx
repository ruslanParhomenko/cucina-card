"use client";

import { Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import ModalConfirm from "../modal/ModalConfirm";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function DeleteButton({
  disabled = true,
  dialogText,
  descriptionText,
  onDelete,
  className,
  isEdit,
  setIsEdit,
  size = 16,
}: {
  disabled?: boolean;
  dialogText: string;
  descriptionText: string;
  onDelete: () => Promise<void> | void;
  className?: string;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
  size?: number;
}) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    setOpen(false);
    startTransition(async () => {
      await onDelete();
    });
  };

  return (
    <>
      <ModalConfirm
        open={open}
        setOpen={setOpen}
        handleConfirm={handleConfirm}
        dialogText={dialogText}
        descriptionText={descriptionText}
      />
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={(disabled && !isAdmin) || isPending}
        className={cn(className, "cursor-pointer hover:text-black")}
      >
        <Trash2Icon size={size} className="text-red-600" strokeWidth={1.5} />
      </button>
    </>
  );
}
