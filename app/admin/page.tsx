import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound, redirect } from "next/navigation";
import Dashboard from "./dashboard/page";
export const dynamic = "force-dynamic";
export default async function Page() {
    const result = await handleWhoami();
   if (!result?.success || !result?.data) {
    redirect("/auth/login"); 
  }
  if (result.data.role !== "admin") {
    redirect("/"); 
  }            
      return <Dashboard />;

}
