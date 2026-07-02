import { handleWhoami } from "@/lib/actions/auth-actions";
import { redirect } from "next/navigation";
import DriverDashboardPage from "./components/Driver-Dashboard";

export const dynamic = "force-dynamic"; 
export default async function Page() {
  const result = await handleWhoami();

  if (!result?.success || !result?.data) {
    redirect("/auth/login"); // use your real login route
  }

  return <DriverDashboardPage user={result.data} />;
}