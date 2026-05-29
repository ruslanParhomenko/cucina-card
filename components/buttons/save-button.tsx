import { useEdit } from "@/providers/edit-provider";
import { SaveIcon } from "lucide-react";
import { useSession } from "next-auth/react";

type Props = {
  formId: string;
  className?: string;
  size?: number;
};

export default function SaveButton({ formId, className, size = 16 }: Props) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const { isEdit } = useEdit();

  if (!isEdit) return null;
  return (
    <button
      form={formId}
      type="submit"
      disabled={!isAdmin}
      className={className}
    >
      <SaveIcon
        size={size}
        strokeWidth={2}
        className="text-white hover:text-black"
      />
    </button>
  );
}
