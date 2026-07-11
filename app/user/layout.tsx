import { handleWhoami } from "@/lib/actions/auth-actions";
import Header from "./_components/header/Header";
import UserSocketClient from "../_componets/SocketBridge";
import AuthBridge from "./_components/AuthBridge";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await handleWhoami();
  const user = result?.success ? result.data : null;

  return (
    <>
      <AuthBridge user={user} />
      <UserSocketClient />
      <Header />
      {children}
    </>
  );
}