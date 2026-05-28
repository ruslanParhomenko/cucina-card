import NavLayout from "@/components/nav-layout/nav-menu";

import NotPermission from "@/components/page/not-permission";
import { authOptions } from "@/lib/auth";
import ClientRefProvider from "@/providers/client-ref-provider";
import EditProvider from "@/providers/edit-provider";
import { getServerSession } from "next-auth";

const ACCESS_ROLE = ["ADMIN", "CUCINA", "MNGR", "BAR"];

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <NotPermission email="" role="" />;
  }

  if (session.user && !ACCESS_ROLE.includes(session.user.role || "")) {
    return (
      <NotPermission
        email={session?.user.email || ""}
        role={session?.user.role || ""}
      />
    );
  }
  return (
    <div className="flex flex-col h-dvh">
      <EditProvider>
        <ClientRefProvider>
          <NavLayout>{children}</NavLayout>
        </ClientRefProvider>
      </EditProvider>
    </div>
  );
}
