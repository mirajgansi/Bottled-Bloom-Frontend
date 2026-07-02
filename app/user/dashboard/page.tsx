import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import HomePage from "./_components/HomePage";

export default async function Page() {


  return (
    <div className="bg-gray-100">
     <HomePage/>
    </div>
  );
}
