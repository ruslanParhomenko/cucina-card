"use client";

import { Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import ModalConfirm from "../modal/ModalConfirm";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useEdit } from "@/providers/edit-provider";

type Props = {
  dialogText?: string;
  descriptionText?: string;
  onDelete: () => Promise<void> | void;
  className?: string;
  size?: number;
};

export default function DeleteButton({
  dialogText = "Вы уверены что хотите удалить?",
  descriptionText = "Это действие нельзя будет отменить",
  onDelete,
  className,
  size = 16,
}: Props) {
  const { isEdit } = useEdit();

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

  if (!isEdit) return null;

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
        disabled={!isAdmin || isPending}
        className={cn(className, "cursor-pointer hover:text-black")}
      >
        <Trash2Icon
          size={size}
          strokeWidth={2}
          className="text-white hover:text-red-800"
        />
      </button>
    </>
  );
}
