import { handleGetAdminDashboard } from "@/lib/actions/admin/analytics-action";
import { handleWhoami } from "@/lib/actions/auth-actions";
import DashboardClient from "./_component/AdminDashboard";

export default async function DashboardPage() {
  
  const to = new Date();
  const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const [analytics, who] = await Promise.all([
    handleGetAdminDashboard({
      from: fmt(from),
      to: fmt(to),
      group: "daily",
      topLimit: 10,
      driverLimit: 10,
    }),
    handleWhoami(),
  ]);

  return <DashboardClient initial={analytics} user={who?.data ?? null} />;
}
