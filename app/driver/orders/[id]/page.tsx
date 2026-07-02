import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import DriverOrderDetailPage from "./components/orderDetail";

export default async function Page() {
    const result = await handleWhoami();
    if(!result.success){
        throw new Error("Error fetching user data")
    }
   
      return <DriverOrderDetailPage />;

}
