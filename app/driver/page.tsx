import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound, redirect } from "next/navigation";
import DriverDashboard from "./dashboard/page";

export default async function Page() {
    const result = await handleWhoami();
   
    if(!result.data){
redirect("/unauthorized");    
        }
        
      return <DriverDashboard />;

}

