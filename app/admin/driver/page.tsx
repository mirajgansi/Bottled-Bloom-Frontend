import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import DriversTable from "./components/DriverTable";
import { handleGetDrivers } from "@/lib/actions/order-action";

export default async function Page({
  searchParams,
}: {
  searchParams?: { search?: string; page?: string };
}) {
  const result = await handleWhoami();

  if (!result.success) {
    // better than throw while debugging
    return (
      <div className="">
        <p className="text-red-600 font-medium">Whoami failed</p>
        <pre className="mt-2 text-xs whitespace-pre-wrap">
          {result.message || "No message"}
        </pre>
      </div>
    );
  }

  if (!result.data) notFound();

  const search = searchParams?.search ?? "";
  const page = Number(searchParams?.page ?? "1");
  const size = 10;

  const res = await handleGetDrivers({ page, size, search });

  if (!res.success) {
    return <p className="p-4 text-red-600">{res.message || "Failed to fetch drivers"}</p>;
  }

  return (
    <div className="">
<DriversTable pagination={{
        size: 10
      }} />
    </div>
  );
}
