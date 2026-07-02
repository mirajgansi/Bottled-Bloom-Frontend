import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import AdminLayoutClient from "./_components/AdminShell";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await handleWhoami();

  if (!result?.success || !result?.data) {
    notFound();
  }

  return (
    <AdminLayoutClient user={result.data}>
      {children}
    </AdminLayoutClient>
  );
}
