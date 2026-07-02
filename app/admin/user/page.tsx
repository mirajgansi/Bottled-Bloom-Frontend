import { handleGetAllUSER } from "@/lib/actions/admin/user-action";
import UsersTable from "./_componenet/usersTable";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams?: { search?: string; page?: string };
}) {
   const res = await handleGetAllUSER({ page: 1, size: 10, search: "" });

  if (!res.success) {
    return <p className="text-red-600">{res.message || "Failed to fetch users"}</p>;
  }



  return (
    <div className="p-4">
        
    <UsersTable
      users={res.users ?? []}
      pagination={res.pagination}
      search={searchParams?.search ?? ""}
    />
    </div>
  );
}
