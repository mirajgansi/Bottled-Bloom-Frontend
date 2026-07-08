import { handleWhoami } from "@/lib/actions/auth-actions";
import { redirect } from "next/navigation";
import AllProductsPage from "./components/AllProduct";

export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await handleWhoami();

  if (!result.success || !result.data) {
    redirect("/login");
  }

  return <AllProductsPage />;
}