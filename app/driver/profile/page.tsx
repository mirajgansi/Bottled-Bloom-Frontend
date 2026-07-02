import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound, redirect } from "next/navigation";
import UpdateFrom from "./_components/updateForm";

export const dynamic = "force-dynamic";

export default async function Page() {
    const result = await handleWhoami();
    if (!result?.success || !result?.data) {
    redirect("/auth/login"); 
  }
    return (
        <div>
            <UpdateFrom user={result.data}/>
        </div>
    );
}
