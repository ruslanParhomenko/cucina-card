import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type Props = {
  className?: string;
  size?: number;
};

export default function LogOutButton({ className, size = 16 }: Props) {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })} className={className}>
      <LogOut size={size} strokeWidth={2} className=" text-red-600" />
    </button>
  );
}
