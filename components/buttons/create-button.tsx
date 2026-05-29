"use client";
import { useEdit } from "@/providers/edit-provider";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
  className?: string;
  disabled?: boolean;
  size?: number;
  url?: string;
};
export default function CreateButton({
  className,
  disabled,
  size = 16,
  url,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { isEdit } = useEdit();

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const handleClick = () => {
    startTransition(() => {
      url && router.push(url);
    });
  };

  if (isEdit) return null;
  return (
    <button
      type="button"
      className={className}
      disabled={!isAdmin || isPending || disabled}
      onClick={handleClick}
    >
      <PlusIcon size={size} strokeWidth={2} className="text-white" />
    </button>
  );
}
