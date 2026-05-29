import LogOutButton from "../buttons/logout-button";

export default function NotPermission({
  email,
  role,
}: {
  email: string;
  role: string;
}) {
  return (
    <div className="pt-10 flex flex-col justify-center items-center h-screen">
      <span className="text-red-700">email with role not authorized</span>
      <span>email: {email}</span>
      <span>role: {role}</span>
      <LogOutButton />
    </div>
  );
}
