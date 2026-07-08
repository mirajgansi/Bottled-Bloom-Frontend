import { handleWhoami } from "@/lib/actions/auth-actions";
import DriverOrderDetailPage from "./components/orderDetail";
import { redirect } from "next/navigation";

export default async function Page() {
  const result = await handleWhoami();
  if (!result.success) {
    redirect("/login");
  }
  return <DriverOrderDetailPage />;
}