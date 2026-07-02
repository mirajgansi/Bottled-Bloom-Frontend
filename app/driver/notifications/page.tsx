import NotificationsPageClient from "@/app/_componets/notification/NotificationPageClient";
import { handleWhoami } from "@/lib/actions/auth-actions";

export default async function DriverNotificationsPage() {
  const result = await handleWhoami();
  const user = result?.success ? result.data : null;

  if (!user?._id) return <div className="p-6">Please login.</div>;

  return <NotificationsPageClient userId={user._id} role="driver" />;
}