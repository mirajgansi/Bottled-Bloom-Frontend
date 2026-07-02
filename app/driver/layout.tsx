import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import DriverLayoutClient from "./_components/DriverShell";
import { Toaster } from "sonner";

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
    <DriverLayoutClient user={result.data}>
              <Toaster position="bottom-right" />
    
      {children}
    </DriverLayoutClient>
  );
}
