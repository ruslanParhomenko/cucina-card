"use client";
import { useEdit } from "@/providers/edit-provider";
import { PenBox, PencilOff } from "lucide-react";
import { useSession } from "next-auth/react";

export default function EditButton({
  className,
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  const { isEdit, setIsEdit } = useEdit();

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  return (
    <button
      type="button"
      onClick={() => setIsEdit(!isEdit)}
      className={className}
      disabled={!isAdmin}
    >
      {isEdit ? (
        <PencilOff size={size} strokeWidth={2} className="text-white" />
      ) : (
        <PenBox
          size={size}
          strokeWidth={2}
          className="text-white hover:text-green-600"
        />
      )}
    </button>
  );
}
